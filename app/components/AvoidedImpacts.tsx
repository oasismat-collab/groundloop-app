'use client';

import { type NutrientResults } from '@/lib/nutrient-calculator';
import { formatMass, getNutrientName } from '@/lib/nutrient-calculator';
import type { Element } from '@/lib/expanded-catalogue';

interface AvoidedImpactsProps {
  results: NutrientResults;
}

export default function AvoidedImpacts({ results }: AvoidedImpactsProps) {
  const { avoidedImpacts, totalInputMass } = results;
  const primaryNutrients: Element[] = ['N', 'P', 'K'];

  // Format water amounts
  const formatWater = (liters: number | null): string => {
    if (liters === null) return 'Not calculated';
    if (liters < 1) return `~${Math.round(liters * 1000)} mL`;
    if (liters < 1000) return `~${liters.toFixed(1)} L`;
    return `~${(liters / 1000).toFixed(2)} m³`;
  };

  // Format CO2 equivalent
  const formatCO2e = (kg: number | null): string => {
    if (kg === null) return 'Not calculated';
    if (kg < 1) return `~${Math.round(kg * 1000)} g CO₂e`;
    return `~${kg.toFixed(2)} kg CO₂e`;
  };

  return (
    <div className="avoided-impacts">
      <div className="avoided-header">
        <h3>
          <span className="impact-icon">♻️</span>
          By Composting Instead of Landfilling
        </h3>
        <p className="avoided-subtitle">
          When food goes to landfill, <strong>100% of nutrients are permanently lost</strong> from the soil cycle. 
          By composting {Math.round(totalInputMass)}g of food waste, you've avoided these environmental impacts:
        </p>
      </div>

      <div className="impact-cards">
        {/* Nutrients Saved Card */}
        <div className="impact-card nutrients-saved">
          <div className="card-icon-large">🌱</div>
          <h4>Nutrients Returned to Soil</h4>
          <p className="card-description">
            In landfill, these nutrients would be completely lost. 
            Composting brings them back to nourish plants and build soil health.
          </p>
          
          <div className="nutrient-comparison">
            {primaryNutrients.map(element => {
              const lost = avoidedImpacts.nutrientsLost[element];
              const returned = results.nutrients[element];
              
              return (
                <div key={element} className="comparison-row">
                  <span className="nutrient-label">{getNutrientName(element)}</span>
                  <div className="comparison-values">
                    <div className="value-item lost">
                      <span className="value-tag">Landfill (Lost)</span>
                      <span className="value-amount">{formatMass(lost)}</span>
                    </div>
                    <div className="value-arrow">→</div>
                    <div className="value-item saved">
                      <span className="value-tag">Compost (Saved)</span>
                      <span className="value-amount">{formatMass(returned)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Methane Avoided Card */}
        <div className="impact-card methane-avoided">
          <div className="card-icon-large">💨</div>
          <h4>Methane Emissions Avoided</h4>
          <div className="big-stat">
            {formatCO2e(avoidedImpacts.methaneEmissions)}
          </div>
          <p className="card-description">
            <strong>Landfills are the 3rd largest source of methane</strong> in the U.S. 
            Food waste decomposes anaerobically (without oxygen), producing methane - 
            a greenhouse gas 80x more potent than CO₂ over 20 years.
          </p>
          <div className="equivalency">
            <span className="equiv-icon">🚗</span>
            <span className="equiv-text">
              Equivalent to {avoidedImpacts.methaneEmissions !== null 
                ? `driving ${(avoidedImpacts.methaneEmissions * 4.5).toFixed(1)} km` 
                : 'N/A'} in an average car
            </span>
          </div>
        </div>

        {/* Water Impact Card */}
        <div className="impact-card water-impact">
          <div className="card-icon-large">💧</div>
          <h4>Water Resources Honored</h4>
          <div className="big-stat">
            {formatWater(avoidedImpacts.waterEmbedded)}
          </div>
          <p className="card-description">
            This is the <strong>water used to grow this food</strong>. When food goes to 
            landfill, that water investment is completely wasted. Composting ensures 
            those resources contribute to future food production.
          </p>
          {avoidedImpacts.soilMoistureBenefit !== null && (
            <div className="bonus-benefit">
              <strong>+ Soil water retention boost</strong>
              <p>
                Compost acts like a sponge, helping soil retain up to 30% more moisture. 
                This compost could retain an additional {formatWater(avoidedImpacts.soilMoistureBenefit)} 
                of water in the soil.
              </p>
            </div>
          )}
        </div>

        {/* Landfill Impact Card */}
        <div className="impact-card landfill-impact">
          <div className="card-icon-large">🚫</div>
          <h4>Landfill Space Saved</h4>
          <div className="big-stat">
            {Math.round(totalInputMass)}g
          </div>
          <p className="card-description">
            <strong>Food waste is the #1 material in U.S. landfills</strong> (24% by weight in 2018). 
            Every gram composted reduces landfill burden and prevents contamination of recyclables.
          </p>
          <div className="impact-list">
            <div className="impact-item">
              <span className="check-icon">✓</span>
              <span>No leachate pollution</span>
            </div>
            <div className="impact-item">
              <span className="check-icon">✓</span>
              <span>No permanent nutrient loss</span>
            </div>
            <div className="impact-item">
              <span className="check-icon">✓</span>
              <span>Soil cycle restored</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scientific Sources */}
      <details className="research-sources">
        <summary>
          <span className="sources-title">📚 Research & Data Sources</span>
          <span className="sources-icon">⌄</span>
        </summary>
        <div className="sources-content">
          <h5>Avoided Impacts Based On:</h5>
          <ul>
            <li>
              <strong>100% Nutrient Loss in Landfill:</strong> EPA research confirms organic matter in landfills 
              decomposes anaerobically and never returns to agricultural cycle. Nutrients are permanently lost.
            </li>
            <li>
              <strong>Methane Emissions (~0.5 kg CO₂e per kg):</strong> EPA "Quantifying Methane Emissions from 
              Landfilled Food Waste" (2023). Municipal solid waste landfills are third-largest methane source in U.S.
            </li>
            <li>
              <strong>Water Footprint (~58L per person/day of food waste):</strong> "Nutritional and Environmental 
              Losses Embedded in Global Food Waste" - ResearchGate study showing embedded water, energy, and nutrients.
            </li>
            <li>
              <strong>Soil Water Retention (20-30% improvement):</strong> Multiple studies including University of Georgia, 
              Rutgers, and EPA confirm compost improves soil moisture retention by up to 30%.
            </li>
            <li>
              <strong>Landfill Statistics:</strong> EPA reports food waste comprises 24% of municipal solid waste 
              landfilled in the U.S. (2018 data).
            </li>
          </ul>
          <p className="sources-note">
            <strong>Note:</strong> Calculations use conservative estimates. Actual impacts vary by food type, 
            landfill management, and composting methods. Water footprint represents production water, not physical 
            water content.
          </p>
        </div>
      </details>
    </div>
  );
}
