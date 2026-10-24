/**
 * Cumulative Tracker Component
 * 
 * Displays apothecary jars showing cumulative nutrients and water saved over time
 * Includes period selector and friendly summary messages
 */

'use client';

import { useState, useEffect } from 'react';
import ApothecaryJar from './ApothecaryJar';
import { 
  getCumulativeTotals, 
  getMonthlyTargets,
  formatTimePeriod,
  getDateRangeString,
  type TimePeriod 
} from '@/lib/storage';
import { type Element } from '@/lib/expanded-catalogue';

export default function CumulativeTracker() {
  const [period, setPeriod] = useState<TimePeriod>('month');
  const [totals, setTotals] = useState(getCumulativeTotals('month'));
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setTotals(getCumulativeTotals(period));
  }, [period]);

  // Prevent hydration mismatch
  if (!isClient) {
    return (
      <div className="cumulative-tracker">
        <div className="tracker-loading">Loading your impact...</div>
      </div>
    );
  }

  const targets = getMonthlyTargets();
  const hasData = totals.sessionCount > 0;

  // Filter nutrients to only show those with meaningful amounts
  // Threshold: 0.01g (10mg) to avoid showing trace amounts
  const THRESHOLD = 0.01; // grams
  
  const allElements: Element[] = ['N', 'P', 'K', 'Ca', 'Mg', 'S', 'Fe', 'Zn'];
  const relevantElements = allElements.filter(element => {
    const amount = totals.nutrients[element];
    // Only show if: not null AND above threshold
    return amount !== null && amount >= THRESHOLD;
  });
  
  // Categorize relevant nutrients
  const primaryElements = relevantElements.filter(e => ['N', 'P', 'K'].includes(e));
  const secondaryElements = relevantElements.filter(e => ['Ca', 'Mg', 'S'].includes(e));
  const microElements = relevantElements.filter(e => ['Fe', 'Zn'].includes(e));

  // Generate friendly summary message
  const getSummaryMessage = (): string => {
    if (!hasData) {
      return "Start composting to see your impact build up over time!";
    }

    const waterLiters = totals.waterEmbedded;
    const periodName = formatTimePeriod(period).toLowerCase();
    
    // Find the nutrient with the highest amount to feature
    const nutrientAmounts = allElements
      .filter(e => totals.nutrients[e] !== null) // Exclude null values
      .map(e => ({
        element: e,
        amount: totals.nutrients[e] as number, // Safe to cast after filter
        name: e === 'N' ? 'nitrogen' : 
              e === 'P' ? 'phosphorus' : 
              e === 'K' ? 'potassium' :
              e === 'Ca' ? 'calcium' :
              e === 'Mg' ? 'magnesium' :
              e === 'S' ? 'sulfur' :
              e === 'Fe' ? 'iron' : 'zinc'
      }))
      .sort((a, b) => b.amount - a.amount);
    
    const topNutrient = nutrientAmounts[0] || null;

    if (period === 'month') {
      return `You saved ${waterLiters.toFixed(1)} liters of water ${periodName} by composting!${topNutrient && topNutrient.amount >= THRESHOLD ? ` That's ${topNutrient.amount.toFixed(1)}g of ${topNutrient.name} returned to the soil.` : ''}`;
    } else if (period === 'week') {
      return `This week you've composted ${totals.itemCount} items and saved ${waterLiters.toFixed(1)}L of water!`;
    } else if (period === 'year') {
      return `In ${periodName.replace('this ', '')}, you've ${topNutrient && topNutrient.amount >= THRESHOLD ? `returned ${topNutrient.amount.toFixed(1)}g of ${topNutrient.name} and ` : ''}saved ${waterLiters.toFixed(1)}L of water!`;
    } else {
      return `Since you started, you've composted ${(totals.totalMassGrams / 1000).toFixed(1)}kg of food waste across ${totals.sessionCount} sessions!`;
    }
  };

  return (
    <div className="cumulative-tracker">
      {/* Header */}
      <div className="tracker-header">
        <div>
          <div className="eyebrow">
            <span /> YOUR CUMULATIVE IMPACT
          </div>
          <h2>Track your progress</h2>
          {hasData && (
            <p className="tracker-date-range">
              {getDateRangeString(totals.startDate, totals.endDate)}
            </p>
          )}
        </div>

        {/* Period selector */}
        <div className="period-selector">
          {(['week', 'month', 'year', 'all-time'] as TimePeriod[]).map(p => (
            <button
              key={p}
              className={`period-button ${period === p ? 'active' : ''}`}
              onClick={() => setPeriod(p)}
            >
              {formatTimePeriod(p)}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Message */}
      <div className={`tracker-summary ${!hasData ? 'empty' : ''}`}>
        <svg viewBox="0 0 24 24" fill="none" className="summary-icon">
          <path
            d="M12 2L2 7L12 12L22 7L12 2Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2 17L12 22L22 17"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2 12L12 17L22 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <p>{getSummaryMessage()}</p>
      </div>

      {/* Stats overview */}
      {hasData && (
        <div className="tracker-stats">
          <div className="stat-card">
            <div className="stat-value">{totals.sessionCount}</div>
            <div className="stat-label">Compost Sessions</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{totals.itemCount}</div>
            <div className="stat-label">Items Composted</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{(totals.totalMassGrams / 1000).toFixed(1)} kg</div>
            <div className="stat-label">Total Food Waste</div>
          </div>
        </div>
      )}

      {/* Water jar (featured) */}
      {hasData && (
        <div className="featured-jar">
          <h3>Water Saved</h3>
          <p className="featured-description">
            Embedded water from food production that would be lost in landfill
          </p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ApothecaryJar
              element="water"
              amount={totals.waterEmbedded}
              target={targets.waterEmbedded}
            />
          </div>
        </div>
      )}

      {/* Primary Nutrients (N, P, K) */}
      {hasData && primaryElements.length > 0 && (
        <div className="nutrient-section">
          <h3>Primary Nutrients</h3>
          <p className="section-description">
            Essential macronutrients for plant growth and soil health
          </p>
          <div className="jar-grid">
            {primaryElements.map(element => (
              <ApothecaryJar
                key={element}
                element={element}
                amount={totals.nutrients[element]}
                target={targets.nutrients[element]}
              />
            ))}
          </div>
        </div>
      )}

      {/* Secondary Nutrients */}
      {hasData && secondaryElements.length > 0 && (
        <div className="nutrient-section">
          <h3>Secondary Nutrients</h3>
          <p className="section-description">
            Important for plant structure and enzyme function
          </p>
          <div className="jar-grid">
            {secondaryElements.map(element => (
              <ApothecaryJar
                key={element}
                element={element}
                amount={totals.nutrients[element]}
                target={targets.nutrients[element]}
              />
            ))}
          </div>
        </div>
      )}

      {/* Micronutrients */}
      {hasData && microElements.length > 0 && (
        <div className="nutrient-section">
          <h3>Micronutrients</h3>
          <p className="section-description">
            Trace elements vital for enzyme activation and chlorophyll
          </p>
          <div className="jar-grid">
            {microElements.map(element => (
              <ApothecaryJar
                key={element}
                element={element}
                amount={totals.nutrients[element]}
                target={targets.nutrients[element]}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!hasData && (
        <div className="empty-state">
          <svg viewBox="0 0 120 180" className="empty-jar">
            <path
              d="M 30 20 L 30 150 Q 30 165 45 165 L 75 165 Q 90 165 90 150 L 90 20"
              stroke="#c8cdbf"
              strokeWidth="2"
              fill="none"
              opacity="0.3"
            />
            <rect x="40" y="5" width="40" height="15" rx="2" stroke="#c8cdbf" strokeWidth="2" fill="none" opacity="0.3" />
            <rect x="38" y="2" width="44" height="8" rx="3" fill="#d4d6cc" stroke="#b8bab0" strokeWidth="1" />
          </svg>
          <h3>Your jars are empty</h3>
          <p>
            Add your first compost session above to start tracking your cumulative impact.
            Each time you compost, you'll see these jars fill up with the nutrients and water you've saved!
          </p>
        </div>
      )}

      {/* Info message if no relevant nutrients found */}
      {hasData && relevantElements.length === 0 && (
        <div className="info-message">
          <svg viewBox="0 0 24 24" fill="none" className="info-icon">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 16V12M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <p>
            {Object.values(totals.nutrients).every(v => v === null) 
              ? "The foods you've composted don't have detailed nutrient data yet. We're working on adding more foods to our database! In the meantime, you're still saving water and diverting waste from landfills."
              : "The foods you've composted contain very small amounts of nutrients (below 10mg threshold). Keep composting - as you add more sessions, you'll see the jars start to fill!"}
          </p>
        </div>
      )}

      <style jsx>{`
        .cumulative-tracker {
          background: #fafaf8;
          border: 1px solid #e0e3d8;
          border-radius: 16px;
          padding: 32px;
          margin-top: 32px;
        }

        .tracker-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
          gap: 24px;
          flex-wrap: wrap;
        }

        .tracker-header h2 {
          margin: 8px 0 4px;
          font-size: 32px;
        }

        .tracker-date-range {
          font-size: 14px;
          color: #6a745e;
          margin: 0;
        }

        .tracker-loading {
          text-align: center;
          padding: 48px;
          color: #8a9478;
        }

        .period-selector {
          display: flex;
          gap: 8px;
          background: white;
          padding: 4px;
          border-radius: 8px;
          border: 1px solid #e0e3d8;
        }

        .period-button {
          padding: 8px 16px;
          border: none;
          background: transparent;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          color: #6a745e;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .period-button:hover {
          background: #f5f6f0;
          color: var(--ink);
        }

        .period-button.active {
          background: var(--green);
          color: white;
        }

        .tracker-summary {
          display: flex;
          align-items: center;
          gap: 16px;
          background: linear-gradient(135deg, #f0f2e8 0%, #fafaf8 100%);
          border: 1px solid #e0e3d8;
          border-radius: 12px;
          padding: 20px 24px;
          margin-bottom: 24px;
        }

        .tracker-summary.empty {
          background: linear-gradient(135deg, #fafaf8 0%, #f5f6f0 100%);
        }

        .summary-icon {
          width: 32px;
          height: 32px;
          color: var(--green);
          flex-shrink: 0;
        }

        .tracker-summary p {
          margin: 0;
          font-size: 16px;
          font-weight: 500;
          color: var(--ink);
          line-height: 1.5;
        }

        .tracker-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 16px;
          margin-bottom: 32px;
        }

        .stat-card {
          background: white;
          border: 1px solid #e0e3d8;
          border-radius: 10px;
          padding: 16px;
          text-align: center;
        }

        .stat-value {
          font-size: 28px;
          font-weight: 700;
          color: var(--green);
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 12px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #6a745e;
        }

        .featured-jar {
          margin-bottom: 32px;
          padding: 24px;
          background: linear-gradient(135deg, #f5f9fc 0%, #fafcfd 100%);
          border: 1px solid #d4e3f0;
          border-radius: 12px;
        }

        .featured-jar h3 {
          text-align: center;
          margin: 0 0 8px;
          font-size: 24px;
          color: var(--ink);
        }

        .featured-description {
          text-align: center;
          font-size: 14px;
          color: #6a745e;
          margin: 0 0 20px;
        }

        .nutrient-section {
          margin-bottom: 32px;
        }

        .nutrient-section:last-child {
          margin-bottom: 0;
        }

        .nutrient-section h3 {
          margin: 0 0 8px;
          font-size: 20px;
        }

        .section-description {
          font-size: 14px;
          color: #6a745e;
          margin: 0 0 16px;
        }

        .jar-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 16px;
        }

        .empty-state {
          text-align: center;
          padding: 48px 24px;
        }

        .empty-jar {
          width: 120px;
          height: 180px;
          margin: 0 auto 24px;
          opacity: 0.5;
        }

        .empty-state h3 {
          margin: 0 0 12px;
          font-size: 24px;
          color: #6a745e;
        }

        .empty-state p {
          max-width: 480px;
          margin: 0 auto;
          font-size: 15px;
          color: #8a9478;
          line-height: 1.6;
        }

        .info-message {
          display: flex;
          align-items: center;
          gap: 16px;
          background: linear-gradient(135deg, #f5f6f0 0%, #fafaf8 100%);
          border: 1px solid #e0e3d8;
          border-radius: 12px;
          padding: 20px 24px;
          margin-top: 24px;
        }

        .info-icon {
          width: 32px;
          height: 32px;
          color: #8a9478;
          flex-shrink: 0;
        }

        .info-message p {
          margin: 0;
          font-size: 14px;
          color: #6a745e;
          line-height: 1.5;
        }

        @media (max-width: 768px) {
          .cumulative-tracker {
            padding: 24px 16px;
          }

          .tracker-header {
            flex-direction: column;
          }

          .period-selector {
            width: 100%;
            overflow-x: auto;
          }

          .jar-grid {
            grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          }
        }
      `}</style>
    </div>
  );
}
