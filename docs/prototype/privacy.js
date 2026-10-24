/**
 * privacy.js — the 10-user minimum (k-anonymity) gate from steering/privacy.md.
 * Every partner aggregate passes through aggregateByArea before it is shown.
 * Areas with fewer than `minUsers` opted-in residents are suppressed/merged,
 * never rendered, and a note explains why.
 */

export const MIN_USERS = 10;

/**
 * Split area stats into { shown, suppressed, merged } by the minimum-users
 * threshold. `records` are { area, city, users, dropoffs, ... }. Suppressed areas
 * are merged into a single "Other areas" bucket so their total still contributes —
 * but ONLY when that bucket itself reaches `minUsers`. If the combined bucket is
 * still below the threshold, `merged` is null and those areas are hidden outright,
 * so no small cell is ever visible, not even relabelled as "Other areas".
 */
export function aggregateByArea(records, { minUsers = MIN_USERS } = {}) {
  const shown = [];
  const suppressedRecords = [];
  for (const r of records) {
    if (r.users >= minUsers) shown.push(r);
    else suppressedRecords.push(r);
  }
  shown.sort((a, b) => b.dropoffs - a.dropoffs);

  // Merge suppressed areas into a single "Other areas" bucket so their total still
  // contributes. But that bucket is itself a cell a partner sees, so it must also
  // clear the threshold: a lone small area (or a handful summing to < minUsers)
  // merged under a new label would still expose a small cell. When the combined
  // bucket does not reach minUsers we drop it entirely — privacy.md: "when in
  // doubt, aggregate harder and suppress smaller cells — never the reverse."
  let merged = null;
  if (suppressedRecords.length) {
    const users = suppressedRecords.reduce((s, r) => s + r.users, 0);
    const dropoffs = suppressedRecords.reduce((s, r) => s + r.dropoffs, 0);
    if (users >= minUsers) {
      merged = { area: 'Other areas', users, dropoffs, count: suppressedRecords.length, merged: true };
    }
  }
  return { shown, suppressed: suppressedRecords, merged };
}

/** True if an aggregate cell is safe to display on its own. */
export function isShowable(users, minUsers = MIN_USERS) {
  return users >= minUsers;
}
