/**
 * The mascot for the current session (Req 2.2, 2.3).
 *
 * On each new session the greeting mascot rotates Peel → Bram → Cora. The index
 * is persisted in AsyncStorage so the next launch advances to the next mascot.
 * The same mascot is used both for the sign-in greeting and as the app header's
 * logo mark, so they always agree within a session.
 *
 * Also tracks the OS "reduce motion" setting so the greeting can skip its
 * entrance animation (Req 2.4).
 */
import { createContext, useContext } from 'react';
import { MASCOT_ORDER, type MascotId } from '../components/Mascot';

const STORAGE_KEY = 'mascotIndex';

export interface SessionMascot {
  /** The mascot chosen for this session. */
  mascot: MascotId;
  /** True when the OS "reduce motion" accessibility setting is on. */
  reduceMotion: boolean;
}

export const SessionMascotContext = createContext<SessionMascot>({ mascot: MASCOT_ORDER[0]!, reduceMotion: false });

export function useSessionMascot(): SessionMascot {
  return useContext(SessionMascotContext);
}

/**
 * Advances the rotation and returns the mascot for this session, persisting the
 * new index. Pure w.r.t. React; call once when a session begins.
 */
export async function nextSessionMascot(storage: {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
}): Promise<MascotId> {
  const last = Number((await storage.getItem(STORAGE_KEY)) ?? '-1');
  const next = Number.isFinite(last) ? (last + 1) % MASCOT_ORDER.length : 0;
  await storage.setItem(STORAGE_KEY, String(next));
  return MASCOT_ORDER[next]!;
}
