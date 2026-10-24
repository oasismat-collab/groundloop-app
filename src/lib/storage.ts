/**
 * Local Storage Persistence Layer
 * Tracks composting sessions over time for cumulative impact calculation
 */

import type { NutrientResults } from './nutrient-calculator';
import type { Element } from './expanded-catalogue';

export type CompostSession = {
  id: string;
  timestamp: number; // Unix timestamp in milliseconds
  nutrients: Record<Element, number | null>;
  waterEmbedded: number | null; // liters
  totalMassGrams: number;
  itemCount: number;
  foodNames: string[]; // Names of foods composted
};

export type TimePeriod = 'week' | 'month' | 'year' | 'all-time';

const STORAGE_KEY = 'groundwork_compost_sessions';

/**
 * Save a composting session to localStorage
 */
export function saveCompostSession(
  results: NutrientResults,
  foodNames: string[]
): CompostSession {
  const session: CompostSession = {
    id: `session_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    timestamp: Date.now(),
    nutrients: results.nutrients,
    waterEmbedded: results.avoidedImpacts.waterEmbedded,
    totalMassGrams: results.totalInputMass,
    itemCount: foodNames.length,
    foodNames,
  };

  const sessions = getAllSessions();
  sessions.push(session);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));

  return session;
}

/**
 * Get all sessions from localStorage
 */
export function getAllSessions(): CompostSession[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Error reading compost sessions from localStorage:', error);
    return [];
  }
}

/**
 * Get sessions within a time period
 */
export function getSessionsInPeriod(period: TimePeriod): CompostSession[] {
  const sessions = getAllSessions();
  const now = Date.now();
  
  let startTime: number;
  
  switch (period) {
    case 'week':
      startTime = now - (7 * 24 * 60 * 60 * 1000);
      break;
    case 'month':
      startTime = now - (30 * 24 * 60 * 60 * 1000);
      break;
    case 'year':
      startTime = now - (365 * 24 * 60 * 60 * 1000);
      break;
    case 'all-time':
      startTime = 0;
      break;
  }
  
  return sessions.filter(s => s.timestamp >= startTime);
}

/**
 * Calculate cumulative totals for a time period
 */
export function getCumulativeTotals(period: TimePeriod): {
  nutrients: Record<Element, number>;
  waterEmbedded: number;
  totalMassGrams: number;
  sessionCount: number;
  itemCount: number;
  startDate: number | null;
  endDate: number | null;
} {
  const sessions = getSessionsInPeriod(period);
  
  if (sessions.length === 0) {
    return {
      nutrients: { N: 0, P: 0, K: 0, Ca: 0, Mg: 0, S: 0, Fe: 0, Zn: 0 },
      waterEmbedded: 0,
      totalMassGrams: 0,
      sessionCount: 0,
      itemCount: 0,
      startDate: null,
      endDate: null,
    };
  }

  const elements: Element[] = ['N', 'P', 'K', 'Ca', 'Mg', 'S', 'Fe', 'Zn'];
  const nutrients: Record<Element, number> = {} as any;
  
  // Initialize all to 0
  for (const element of elements) {
    nutrients[element] = 0;
  }

  let waterEmbedded = 0;
  let totalMassGrams = 0;
  let itemCount = 0;

  // Sum up all sessions
  for (const session of sessions) {
    for (const element of elements) {
      const value = session.nutrients[element];
      if (value !== null && Number.isFinite(value)) {
        nutrients[element] += value;
      }
    }

    if (session.waterEmbedded !== null && Number.isFinite(session.waterEmbedded)) {
      waterEmbedded += session.waterEmbedded;
    }

    totalMassGrams += session.totalMassGrams;
    itemCount += session.itemCount;
  }

  return {
    nutrients,
    waterEmbedded,
    totalMassGrams,
    sessionCount: sessions.length,
    itemCount,
    startDate: Math.min(...sessions.map(s => s.timestamp)),
    endDate: Math.max(...sessions.map(s => s.timestamp)),
  };
}

/**
 * Clear all sessions (for testing or reset)
 */
export function clearAllSessions(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Delete a specific session
 */
export function deleteSession(sessionId: string): void {
  const sessions = getAllSessions();
  const filtered = sessions.filter(s => s.id !== sessionId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

/**
 * Export sessions as JSON (for backup/migration)
 */
export function exportSessions(): string {
  const sessions = getAllSessions();
  return JSON.stringify(sessions, null, 2);
}

/**
 * Import sessions from JSON
 */
export function importSessions(jsonData: string): { success: boolean; error?: string } {
  try {
    const parsed = JSON.parse(jsonData);
    
    if (!Array.isArray(parsed)) {
      return { success: false, error: 'Invalid format: expected an array' };
    }

    // Validate structure
    for (const item of parsed) {
      if (!item.id || !item.timestamp || !item.nutrients) {
        return { success: false, error: 'Invalid session structure' };
      }
    }

    localStorage.setItem(STORAGE_KEY, jsonData);
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Get typical monthly targets for progress visualization
 * Based on EPA average household food waste: ~20 lbs (9 kg) per month
 */
export function getMonthlyTargets(): {
  nutrients: Record<Element, number>;
  waterEmbedded: number;
  totalMassGrams: number;
} {
  // Average household: 9000g per month
  // Typical nutrient concentrations (weighted average):
  return {
    nutrients: {
      N: 30,    // ~0.33% nitrogen
      P: 5,     // ~0.055% phosphorus
      K: 15,    // ~0.167% potassium
      Ca: 8,    // ~0.089% calcium
      Mg: 3,    // ~0.033% magnesium
      S: 2,     // ~0.022% sulfur
      Fe: 0.5,  // ~0.0055% iron
      Zn: 0.3,  // ~0.0033% zinc
    },
    waterEmbedded: 4500, // liters (9kg × 0.5 L/g)
    totalMassGrams: 9000,
  };
}

/**
 * Format time period for display
 */
export function formatTimePeriod(period: TimePeriod): string {
  switch (period) {
    case 'week': return 'This Week';
    case 'month': return 'This Month';
    case 'year': return 'This Year';
    case 'all-time': return 'All Time';
  }
}

/**
 * Get date range string for a period
 */
export function getDateRangeString(startDate: number | null, endDate: number | null): string {
  if (startDate === null || endDate === null) {
    return 'No data yet';
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (start.toDateString() === end.toDateString()) {
    return formatDate(start);
  }

  return `${formatDate(start)} – ${formatDate(end)}`;
}
