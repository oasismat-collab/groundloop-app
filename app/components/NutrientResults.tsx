'use client';

import { type NutrientResults } from '@/lib/nutrient-calculator';
import { 
  formatMass, 
  getNutrientName, 
  getNutrientDescription,
  getRetentionPercentage 
} from '@/lib/nutrient-calculator';
import type { Element } from '@/lib/expanded-catalogue';

interface NutrientResultsProps {
  results: NutrientResults;
  showRetentionFactors?: boolean;
}

function Sprout({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path
        d="M24 43V23M24 29C8 30 5 17 7 7c13 0 22 7 17 22ZM24 22C23 8 34 4 43 5c0 12-6 20-19 17Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function NutrientResults({ 
  results, 
  showRetentionFactors = true 
}: NutrientResultsProps) {
  // Filter to only show nutrients with meaningful data
  const THRESHOLD = 0.01; // 10mg minimum to display
  
  const allPrimary: Element[] = ['N', 'P', 'K'];
  const allSecondary: Element[] = ['Ca', 'Mg', 'S'];
  const allMicro: Element[] = ['Fe', 'Zn'];
  
  // Filter each category to only show nutrients with data above threshold
  const primaryNutrients = allPrimary.filter(e => {
    const amount = results.nutrients[e];
    return amount !== null && amount >= THRESHOLD;
  });
  
  const secondaryNutrients = allSecondary.filter(e => {
    const amount = results.nutrients[e];
    return amount !== null && amount >= THRESHOLD;
  });
  
  const micronutrients = allMicro.filter(e => {
    const amount = results.nutrients[e];
    return amount !== null && amount >= THRESHOLD;
  });

  // Check if we have any calculated values
  const hasAnyNutrientData = primaryNutrients.length > 0 || 
                             secondaryNutrients.length > 0 || 
                             micronutrients.length > 0;

  return (
    <div className="nutrient-results">
      {/* Header */}
      <div className="results-header">
        <div className="step-label">
          03 <span>YOUR IMPACT</span>
        </div>
        <h2>Nutrients returned to soil</h2>
        <p>
          Based on {results.components.length} component
          {results.components.length !== 1 ? 's' : ''} totaling{' '}
          {Math.round(results.totalInputMass)}g of food waste.
        </p>
      </div>

      {/* Warning for missing data */}
      {results.hasUnknownData && (
        <div className="data-warning">
          <span className="warning-icon">⚠️</span>
          <div>
            <strong>Incomplete data for some items</strong>
            <p>
              {results.missingDataItems.length > 0 && (
                <>
                  The following items lack complete nutritional data:{' '}
                  <em>{results.missingDataItems.join(', ')}</em>. 
                  Totals show only known components.
                </>
              )}
              {results.missingDataItems.length === 0 && (
                <>Some nutrient values could not be calculated.</>
              )}
            </p>
          </div>
        </div>
      )}

      {/* Summary Card */}
      <div className="summary-card">
        <div className="summary-stats">
          <div className="stat">
            <span className="stat-label">Total input</span>
            <span className="stat-value">
              {Math.round(results.totalInputMass)}g
            </span>
          </div>
          {results.waterContent !== null && (
            <div className="stat">
              <span className="stat-label">Water content</span>
              <span className="stat-value">
                {formatMass(results.waterContent)}
              </span>
            </div>
          )}
          <div className="stat">
            <span className="stat-label">Components</span>
            <span className="stat-value">
              {results.components.length}
            </span>
          </div>
        </div>
      </div>

      {/* Primary Nutrients (N-P-K) */}
      {primaryNutrients.length > 0 && (
        <div className="nutrient-section">
          <h3 className="section-title">
            <span className="nutrient-badge primary">Primary</span>
            Major Nutrients (N-P-K)
          </h3>
          <p className="section-description">
            The three most important nutrients for plant growth and development.
          </p>
          
          <div className="nutrient-cards-compact">
            {primaryNutrients.map(element => {
              const returned = results.nutrients[element];
              
              return (
                <div key={element} className="nutrient-card-compact primary">
                  <div className="card-compact-header">
                    <span className="element-symbol-compact">{element}</span>
                    <span className="element-name-compact">{getNutrientName(element)}</span>
                  </div>
                  
                  <div className="value-amount-compact">
                    {formatMass(returned)}
                  </div>
                  
                  <p className="nutrient-description-compact">
                    {getNutrientDescription(element)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Secondary Nutrients */}
      {secondaryNutrients.length > 0 && (
        <div className="nutrient-section">
          <h3 className="section-title">
            <span className="nutrient-badge secondary">Secondary</span>
            Secondary Nutrients
          </h3>
          <p className="section-description">
            Important for plant structure, enzyme function, and overall health.
          </p>
          
          <div className="nutrient-cards-compact">
            {secondaryNutrients.map(element => {
              const returned = results.nutrients[element];
              
              return (
                <div key={element} className="nutrient-card-compact secondary">
                  <div className="card-compact-header">
                    <span className="element-symbol-compact">{element}</span>
                    <span className="element-name-compact">{getNutrientName(element)}</span>
                  </div>
                  
                  <div className="value-amount-compact">
                    {formatMass(returned)}
                  </div>
                  
                  <p className="nutrient-description-compact">
                    {getNutrientDescription(element)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Micronutrients */}
      {micronutrients.length > 0 && (
        <div className="nutrient-section">
          <h3 className="section-title">
            <span className="nutrient-badge micro">Micro</span>
            Micronutrients (Trace Elements)
          </h3>
          <p className="section-description">
            Required in small amounts but essential for plant health and enzyme activity.
          </p>
          
          <div className="nutrient-cards-compact">
            {micronutrients.map(element => {
              const returned = results.nutrients[element];
              
              return (
                <div key={element} className="nutrient-card-compact micro">
                  <div className="card-compact-header">
                    <span className="element-symbol-compact">{element}</span>
                    <span className="element-name-compact">{getNutrientName(element)}</span>
                  </div>
                  
                  <div className="value-amount-compact">
                    {formatMass(returned)}
                  </div>
                  
                  <p className="nutrient-description-compact">
                    {getNutrientDescription(element)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* No nutrient data message */}
      {!hasAnyNutrientData && (
        <div className="data-warning" style={{ marginTop: '24px' }}>
          <span className="warning-icon">ℹ️</span>
          <div>
            <strong>Nutrient data not yet available</strong>
            <p>
              The foods you've composted don't have detailed nutrient composition data in our database yet.
              We're continuously expanding our food database! In the meantime, you're still making a positive
              impact by diverting waste from landfills and saving the embedded water used to produce this food.
            </p>
          </div>
        </div>
      )}

      {/* Component Breakdown */}
      {results.components.length > 1 && (
        <details className="component-breakdown">
          <summary>
            <span className="breakdown-title">
              📊 View detailed breakdown by component
            </span>
            <span className="breakdown-icon">⌄</span>
          </summary>
          
          <div className="breakdown-content">
            <table className="breakdown-table">
              <thead>
                <tr>
                  <th>Component</th>
                  <th>Mass</th>
                  <th>N</th>
                  <th>P</th>
                  <th>K</th>
                  <th>Ca</th>
                  <th>Mg</th>
                </tr>
              </thead>
              <tbody>
                {results.components.map((component, index) => (
                  <tr key={index}>
                    <td className="component-name">{component.materialName}</td>
                    <td>{Math.round(component.mass)}g</td>
                    <td>{formatMass(component.nutrients.N)}</td>
                    <td>{formatMass(component.nutrients.P)}</td>
                    <td>{formatMass(component.nutrients.K)}</td>
                    <td>{formatMass(component.nutrients.Ca)}</td>
                    <td>{formatMass(component.nutrients.Mg)}</td>
                  </tr>
                ))}
                <tr className="total-row">
                  <td><strong>Total</strong></td>
                  <td><strong>{Math.round(results.totalInputMass)}g</strong></td>
                  <td><strong>{formatMass(results.nutrients.N)}</strong></td>
                  <td><strong>{formatMass(results.nutrients.P)}</strong></td>
                  <td><strong>{formatMass(results.nutrients.K)}</strong></td>
                  <td><strong>{formatMass(results.nutrients.Ca)}</strong></td>
                  <td><strong>{formatMass(results.nutrients.Mg)}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </details>
      )}

      {/* Methodology Note */}
      <div className="methodology-note">
        <Sprout className="note-icon" />
        <div>
          <strong>How we calculated this</strong>
          <p>
            Nutrient values are calculated from USDA FoodData Central composition data,
            adjusted for composting retention rates based on EPA research. Retention factors:{' '}
            N {getRetentionPercentage('N')}%, P {getRetentionPercentage('P')}%,{' '}
            K {getRetentionPercentage('K')}%, Ca-Mg {getRetentionPercentage('Ca')}%,{' '}
            S {getRetentionPercentage('S')}%, Fe-Zn {getRetentionPercentage('Fe')}%.
          </p>
        </div>
      </div>
    </div>
  );
}
