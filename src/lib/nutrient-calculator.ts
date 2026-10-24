/**
 * Nutrient Calculator for Composting Impact
 * 
 * Integrates the expanded food catalogue with calculation engine
 * to compute nutrient returns from composted food waste.
 */

import { 
  getMaterialById, 
  getCompositeFoodById,
  RETENTION_FACTORS,
  type Material,
  type CompositeFood,
  type Element 
} from './expanded-catalogue';

export type NutrientResults = {
  nutrients: Record<Element, number | null>;
  inputNutrients: Record<Element, number | null>;
  organicMatter: number | null;
  carbon: number | null;
  waterContent: number | null;
  components: ComponentResult[];
  totalInputMass: number;
  hasUnknownData: boolean;
  missingDataItems: string[];
  // Avoided impacts (what would be lost in landfill)
  avoidedImpacts: {
    nutrientsLost: Record<Element, number | null>; // 100% loss in landfill
    methaneEmissions: number | null; // kg CO2 equivalent
    waterEmbedded: number | null; // liters of water used to grow the food
    soilMoistureBenefit: number | null; // improved water retention (20-30%)
  };
};

export type ComponentResult = {
  materialId: string;
  materialName: string;
  mass: number; // grams
  nutrients: Record<Element, number | null>;
  inputNutrients: Record<Element, number | null>;
};

const elements: Element[] = ['N', 'P', 'K', 'Ca', 'Mg', 'S', 'Fe', 'Zn'];

/**
 * Convert concentration from Value to grams per gram fresh weight
 */
function freshGrams(
  value: number | null,
  unit: 'g/100g' | 'mg/100g',
  basis: 'fresh' | 'dry',
  moisture: number | null
): number | null {
  if (value === null) return null;
  
  // Convert to g/g
  const amount = value * (unit === 'mg/100g' ? 0.001 : 1) / 100;
  
  // Apply moisture correction for dry basis
  if (basis === 'fresh') {
    return amount;
  } else {
    // dry basis: need moisture to convert
    if (moisture === null) return null;
    return amount * (1 - moisture);
  }
}

/**
 * Calculate nutrient concentration for a material
 */
function getConcentration(material: Material, element: Element): number | null {
  if (element === 'N') {
    // Nitrogen derived from protein
    const proteinConc = freshGrams(
      material.protein.value,
      material.protein.unit,
      material.protein.basis,
      material.moisture
    );
    
    if (proteinConc === null) return null;
    return proteinConc / material.nitrogenFactor;
  } else {
    // Other minerals
    const mineral = material.minerals[element];
    return freshGrams(
      mineral.value,
      mineral.unit,
      mineral.basis,
      material.moisture
    );
  }
}

/**
 * Calculate returned amount after composting
 */
function calculateReturned(
  mass: number,
  concentration: number | null,
  retention: number,
  applied: number
): number | null {
  if (!Number.isFinite(mass) || mass <= 0) {
    throw new Error('Invalid mass');
  }
  
  if (!Number.isFinite(applied) || applied < 0 || applied > 1) {
    throw new Error('Invalid applied fraction');
  }
  
  if (!Number.isFinite(retention) || retention < 0 || retention > 1) {
    throw new Error('Invalid retention factor');
  }
  
  if (concentration === null) return null;
  
  return mass * concentration * retention * applied;
}

/**
 * Calculate nutrients for a single material
 */
function calculateMaterial(
  material: Material,
  mass: number,
  appliedFraction: number = 1.0
): ComponentResult {
  const nutrients: Record<Element, number | null> = {} as any;
  const inputNutrients: Record<Element, number | null> = {} as any;
  
  for (const element of elements) {
    const concentration = getConcentration(material, element);
    
    // Input nutrients (before composting)
    inputNutrients[element] = concentration === null 
      ? null 
      : mass * concentration;
    
    // Returned nutrients (after composting with retention)
    const elementKey = element === 'N' ? 'nitrogen' :
                       element === 'P' ? 'phosphorus' :
                       element === 'K' ? 'potassium' :
                       element === 'Ca' ? 'calcium' :
                       element === 'Mg' ? 'magnesium' :
                       element === 'S' ? 'sulfur' :
                       element === 'Fe' ? 'iron' : 'zinc';
    
    const retention = RETENTION_FACTORS[elementKey];
    
    nutrients[element] = calculateReturned(
      mass,
      concentration,
      retention,
      appliedFraction
    );
  }
  
  return {
    materialId: material.id,
    materialName: material.name,
    mass,
    nutrients,
    inputNutrients,
  };
}

/**
 * Calculate nutrients for a composite food (breaks down into components)
 */
function calculateComposite(
  composite: CompositeFood,
  mass: number,
  appliedFraction: number = 1.0
): ComponentResult[] {
  const results: ComponentResult[] = [];
  
  for (const component of composite.components) {
    const material = getMaterialById(component.materialId);
    if (!material) {
      console.warn(`Material ${component.materialId} not found for composite ${composite.id}`);
      continue;
    }
    
    const componentMass = (mass * component.percentage) / 100;
    const result = calculateMaterial(material, componentMass, appliedFraction);
    results.push(result);
  }
  
  return results;
}

/**
 * Sum nutrient values across components
 */
function sumNutrients(
  components: ComponentResult[],
  key: 'nutrients' | 'inputNutrients'
): Record<Element, number | null> {
  const totals: Record<Element, number | null> = {} as any;
  
  for (const element of elements) {
    const values = components.map(c => c[key][element]);
    
    // If any component is null, the total is null
    if (values.some(v => v === null)) {
      totals[element] = null;
    } else {
      totals[element] = (values as number[]).reduce((sum, v) => sum + v, 0);
    }
  }
  
  return totals;
}

/**
 * Calculate total water content (sum of moisture in all foods)
 */
function calculateWaterContent(components: ComponentResult[]): number | null {
  let totalWater = 0;
  
  for (const component of components) {
    const material = getMaterialById(component.materialId);
    if (!material || material.moisture === null) {
      return null; // Can't calculate if any moisture is unknown
    }
    
    totalWater += component.mass * material.moisture;
  }
  
  return totalWater;
}

/**
 * Calculate avoided impacts (landfill alternative)
 * 
 * Research findings:
 * - Landfill: 100% nutrient loss (never return to soil)
 * - Methane: 0.5 kg CO2e per kg organic waste (EPA)
 * - Water footprint: Average 58L per person per day of food waste (ResearchGate)
 * - Compost improves soil water retention by 20-30% (multiple sources)
 */
function calculateAvoidedImpacts(
  totalInputMass: number,
  inputNutrients: Record<Element, number | null>,
  waterContent: number | null
): {
  nutrientsLost: Record<Element, number | null>;
  methaneEmissions: number | null;
  waterEmbedded: number | null;
  soilMoistureBenefit: number | null;
} {
  // In landfill, ALL nutrients are lost (never return to soil cycle)
  const nutrientsLost = { ...inputNutrients };
  
  // Methane emissions from landfill decomposition
  // EPA research: ~0.5 kg CO2e per kg of food waste in landfill
  // (anaerobic decomposition produces methane, 80x more potent than CO2)
  const methaneEmissions = totalInputMass > 0 
    ? (totalInputMass / 1000) * 0.5  // Convert g to kg, multiply by 0.5 kg CO2e/kg
    : null;
  
  // Embedded water: water used to grow the food
  // Research shows average 58L per person per day of food waste
  // Conservative estimate: ~0.5L per gram of food waste
  const waterEmbedded = totalInputMass > 0
    ? totalInputMass * 0.5 // 0.5 liters per gram
    : null;
  
  // Soil moisture benefit: compost helps soil retain 20-30% more water
  // This is the water retention improvement, not the water in the compost itself
  const soilMoistureBenefit = waterContent !== null
    ? waterContent * 0.25 // 25% average improvement factor
    : null;
  
  return {
    nutrientsLost,
    methaneEmissions,
    waterEmbedded,
    soilMoistureBenefit,
  };
}

/**
 * Main calculation function for multiple foods
 */
export function calculateCompostImpact(
  foods: Array<{
    id: string;
    type: 'material' | 'composite';
    massGrams: number;
  }>,
  appliedFraction: number = 1.0
): NutrientResults {
  const allComponents: ComponentResult[] = [];
  const missingDataItems: string[] = [];
  let totalInputMass = 0;
  
  // Process each food
  for (const food of foods) {
    totalInputMass += food.massGrams;
    
    if (food.type === 'material') {
      const material = getMaterialById(food.id.split('-').slice(0, -1).join('-')); // Remove timestamp
      if (!material) {
        console.warn(`Material ${food.id} not found`);
        continue;
      }
      
      // Check if material has data
      if (material.protein.value === null || 
          material.minerals.P.value === null || 
          material.minerals.K.value === null) {
        missingDataItems.push(material.name);
      }
      
      const result = calculateMaterial(material, food.massGrams, appliedFraction);
      allComponents.push(result);
      
    } else if (food.type === 'composite') {
      const composite = getCompositeFoodById(food.id.split('-').slice(0, -1).join('-'));
      if (!composite) {
        console.warn(`Composite ${food.id} not found`);
        continue;
      }
      
      const results = calculateComposite(composite, food.massGrams, appliedFraction);
      
      // Check for missing data in components
      for (const result of results) {
        const material = getMaterialById(result.materialId);
        if (material && (material.protein.value === null || 
            material.minerals.P.value === null || 
            material.minerals.K.value === null)) {
          if (!missingDataItems.includes(material.name)) {
            missingDataItems.push(material.name);
          }
        }
      }
      
      allComponents.push(...results);
    }
  }
  
  // Calculate totals
  const nutrients = sumNutrients(allComponents, 'nutrients');
  const inputNutrients = sumNutrients(allComponents, 'inputNutrients');
  const waterContent = calculateWaterContent(allComponents);
  
  // Organic matter and carbon (placeholder - need proper data)
  const organicMatter = null; // TODO: Calculate when data available
  const carbon = null; // TODO: Calculate when data available
  
  const hasUnknownData = missingDataItems.length > 0 || 
                         Object.values(nutrients).some(v => v === null);
  
  // Calculate avoided impacts (what would be lost in landfill)
  const avoidedImpacts = calculateAvoidedImpacts(
    totalInputMass,
    inputNutrients,
    waterContent
  );
  
  return {
    nutrients,
    inputNutrients,
    organicMatter,
    carbon,
    waterContent,
    components: allComponents,
    totalInputMass,
    hasUnknownData,
    missingDataItems,
    avoidedImpacts,
  };
}

/**
 * Format mass for display
 */
export function formatMass(grams: number | null, precision: number = 2): string {
  if (grams === null) return 'Not yet quantified';
  if (grams === 0) return '0 mg';
  
  if (grams < 0.001) {
    // Micrograms
    const micrograms = grams * 1_000_000;
    return `${micrograms.toFixed(1)} µg`;
  } else if (grams < 1) {
    // Milligrams - use toFixed instead of toPrecision to avoid scientific notation
    const milligrams = grams * 1000;
    return `${milligrams.toFixed(1)} mg`;
  } else if (grams < 1000) {
    // Grams
    return `${grams.toFixed(1)} g`;
  } else {
    // Kilograms
    return `${(grams / 1000).toFixed(1)} kg`;
  }
}

/**
 * Get nutrient name
 */
export function getNutrientName(element: Element): string {
  const names: Record<Element, string> = {
    N: 'Nitrogen',
    P: 'Phosphorus',
    K: 'Potassium',
    Ca: 'Calcium',
    Mg: 'Magnesium',
    S: 'Sulfur',
    Fe: 'Iron',
    Zn: 'Zinc',
  };
  return names[element];
}

/**
 * Get nutrient description
 */
export function getNutrientDescription(element: Element): string {
  const descriptions: Record<Element, string> = {
    N: 'Essential for plant growth and green leafy development. Promotes healthy stems and leaves.',
    P: 'Supports root development, flowering, and fruiting. Key for energy transfer in plants.',
    K: 'Regulates water uptake and strengthens plant resistance to disease and stress.',
    Ca: 'Builds strong cell walls and supports root growth. Helps prevent blossom end rot.',
    Mg: 'Central component of chlorophyll. Essential for photosynthesis and enzyme function.',
    S: 'Important for protein synthesis and enzyme function. Contributes to plant vigor.',
    Fe: 'Crucial for chlorophyll production. Prevents yellowing of leaves (chlorosis).',
    Zn: 'Activates plant enzymes and supports growth hormone production.',
  };
  return descriptions[element];
}

/**
 * Calculate retention percentage display
 */
export function getRetentionPercentage(element: Element): number {
  const elementKey = element === 'N' ? 'nitrogen' :
                     element === 'P' ? 'phosphorus' :
                     element === 'K' ? 'potassium' :
                     element === 'Ca' ? 'calcium' :
                     element === 'Mg' ? 'magnesium' :
                     element === 'S' ? 'sulfur' :
                     element === 'Fe' ? 'iron' : 'zinc';
  
  return Math.round(RETENTION_FACTORS[elementKey] * 100);
}
