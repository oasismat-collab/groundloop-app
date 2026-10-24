/**
 * privacy.js — the 10-user minimum (k-anonymity) gate from steering/privacy.md.
 * Every partner aggregate passes through aggregateByArea before it is shown.
 * Areas with fewer than `minUsers` opted-in residents are suppressed/merged,
 * never rendered, and a note explains why.
 */

export const MIN_USERS = 10;

/**
 * Split area stats into { shown, suppressed } by the minimum-users threshold.
 * `records` are { area, city, users, dropoffs, ... }. Suppressed areas are
 * merged into a single "Other areas" bucket for the parent city so their total
 * still contributes, but no small cell is individually visible.
 */
export function aggregateByArea(records, { minUsers = MIN_USERS } = {}) {
  const shown = [];
  const suppressedRecords = [];
  for (const r of records) {
    if (r.users >= minUsers) shown.push(r);
    else suppressedRecords.push(r);
  }
  shown.sort((a, b) => b.dropoffs - a.dropoffs);

  let merged = null;
  if (suppressedRecords.length) {
    const users = suppressedRecords.reduce((s, r) => s + r.users, 0);
    const dropoffs = suppressedRecords.reduce((s, r) => s + r.dropoffs, 0);
    merged = { area: 'Other areas', users, dropoffs, count: suppressedRecords.length, merged: true };
  }
  return { shown, suppressed: suppressedRecords, merged };
}

/** True if an aggregate cell is safe to display on its own. */
export function isShowable(users, minUsers = MIN_USERS) {
  return users >= minUsers;
}
