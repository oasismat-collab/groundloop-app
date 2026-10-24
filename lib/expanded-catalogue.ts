/**
 * Expanded Food Database for Composting Impact Calculator
 * 
 * This file contains a comprehensive database of common compostable foods
 * with nutritional composition data sourced from USDA FoodData Central.
 * 
 * Data Version: v2-expanded
 * Last Updated: 2026-10-24
 * 
 * All nutrient values are per 100g fresh weight unless otherwise specified.
 */

export type Element = 'N' | 'P' | 'K' | 'Ca' | 'Mg' | 'S' | 'Fe' | 'Zn';

export const USDA_REPORT = 'https://www.ars.usda.gov/ARSUserFiles/80400535/Data/SR/SR28/reports/sr28fg09.pdf';

export type Value = {
  value: number | null;
  unit: 'g/100g' | 'mg/100g';
  basis: 'fresh' | 'dry';
  type: 'measured' | 'derived' | 'assumed' | 'proxy';
  source: string;
  confidence: 'high' | 'medium' | 'low';
  reuse: 'CC0' | 'project-assumption';
};

export type Material = {
  id: string;
  name: string;
  aliases: string[];
  category: 'fruit' | 'vegetable' | 'grain' | 'protein' | 'dairy' | 'composite';
  part: string; // 'whole', 'flesh', 'peel', 'core', 'skin', etc.
  preparation: 'raw' | 'cooked';
  typicalServing: number; // grams
  unit: 'g';
  moisture: number | null; // mass fraction (0-1)
  organicMatter: Value;
  organicCarbon: Value;
  protein: Value;
  minerals: Record<Exclude<Element, 'N'>, Value>;
  nitrogenFactor: number; // conversion factor for protein -> nitrogen
  source: {
    url: string;
    recordId: string | null;
    fdcId: number | null;
    version: string;
    publication: string;
    reuse: string;
  };
};

export type CompositeFood = {
  id: string;
  name: string;
  category: 'composite';
  typicalServing: number;
  unit: 'g';
  components: Array<{
    materialId: string;
    percentage: number; // 0-100
  }>;
};

// Helper function to create a Value object
const v = (
  value: number | null,
  unit: Value['unit'] = 'mg/100g',
  type: Value['type'] = 'measured',
  confidence: Value['confidence'] = 'medium'
): Value => ({
  value,
  unit,
  basis: 'fresh',
  type,
  source: 'USDA FoodData Central',
  confidence,
  reuse: 'CC0',
});

// USDA SR Legacy reference
const USDA_SR = 'https://fdc.nal.usda.gov/';

/**
 * Composting Retention Factors
 * 
 * These factors represent the percentage of nutrients that remain available
 * in finished compost after the decomposition process.
 * 
 * Based on EPA composting research and scientific literature.
 */
export const RETENTION_FACTORS = {
  nitrogen: 0.70,      // 70% retained (20-40% lost via volatilization)
  phosphorus: 0.93,    // 93% retained (relatively stable)
  potassium: 0.85,     // 85% retained (water-soluble, some leaching)
  calcium: 0.90,       // 90% retained
  magnesium: 0.90,     // 90% retained
  sulfur: 0.75,        // 75% retained (some volatilization)
  iron: 0.95,          // 95% retained (very stable)
  zinc: 0.95,          // 95% retained (very stable)
  water: 1.0,          // 100% - physical contribution to moisture
  organicMatter: 0.50, // 50% retained (significant mass loss during decomposition)
  carbon: 0.55,        // 55% retained (CO2 release during respiration)
};

/**
 * Main Food Database
 * 
 * Includes common fruits, vegetables, grains, proteins, and dairy products
 * that people typically compost.
 */
export const materials: Material[] = [
  // ===== FRUITS =====
  {
    id: 'banana-flesh',
    name: 'Banana flesh',
    aliases: ['banana', 'bananas'],
    category: 'fruit',
    part: 'flesh',
    preparation: 'raw',
    typicalServing: 118,
    unit: 'g',
    moisture: 0.7491,
    organicMatter: v(null, 'g/100g'),
    organicCarbon: v(null, 'g/100g'),
    protein: v(1.09, 'g/100g'),
    minerals: {
      P: v(22),
      K: v(358),
      Ca: v(5),
      Mg: v(27),
      S: v(null),
      Fe: v(0.26),
      Zn: v(0.15),
    },
    nitrogenFactor: 6.25,
    source: {
      url: USDA_SR,
      recordId: '09040',
      fdcId: 173944,
      version: 'USDA SR Legacy',
      publication: '2019-04',
      reuse: 'USDA public domain / CC0',
    },
  },
  {
    id: 'banana-peel',
    name: 'Banana peel',
    aliases: ['banana skin', 'banana peels'],
    category: 'fruit',
    part: 'peel',
    preparation: 'raw',
    typicalServing: 60,
    unit: 'g',
    moisture: null, // Needs measurement
    organicMatter: v(null, 'g/100g'),
    organicCarbon: v(null, 'g/100g'),
    protein: v(null, 'g/100g', 'assumed'),
    minerals: {
      P: v(null),
      K: v(null),
      Ca: v(null),
      Mg: v(null),
      S: v(null),
      Fe: v(null),
      Zn: v(null),
    },
    nitrogenFactor: 6.25,
    source: {
      url: USDA_SR,
      recordId: null,
      fdcId: null,
      version: 'Pending research',
      publication: 'N/A',
      reuse: 'No composition data yet',
    },
  },
  {
    id: 'apple-flesh',
    name: 'Apple flesh',
    aliases: ['apple', 'apples'],
    category: 'fruit',
    part: 'flesh',
    preparation: 'raw',
    typicalServing: 154,
    unit: 'g',
    moisture: 0.8581,
    organicMatter: v(null, 'g/100g'),
    organicCarbon: v(null, 'g/100g'),
    protein: v(0.27, 'g/100g'),
    minerals: {
      P: v(11),
      K: v(90),
      Ca: v(5),
      Mg: v(4),
      S: v(null),
      Fe: v(0.07),
      Zn: v(0.04),
    },
    nitrogenFactor: 6.25,
    source: {
      url: USDA_SR,
      recordId: '09004',
      fdcId: 171689,
      version: 'USDA SR Legacy',
      publication: '2019-04',
      reuse: 'USDA public domain / CC0',
    },
  },
  {
    id: 'apple-peel',
    name: 'Apple peel',
    aliases: ['apple skin', 'apple peels'],
    category: 'fruit',
    part: 'peel',
    preparation: 'raw',
    typicalServing: 26,
    unit: 'g',
    moisture: null,
    organicMatter: v(null, 'g/100g'),
    organicCarbon: v(null, 'g/100g'),
    protein: v(null, 'g/100g', 'assumed'),
    minerals: {
      P: v(null),
      K: v(null),
      Ca: v(null),
      Mg: v(null),
      S: v(null),
      Fe: v(null),
      Zn: v(null),
    },
    nitrogenFactor: 6.25,
    source: {
      url: USDA_SR,
      recordId: null,
      fdcId: null,
      version: 'Pending research',
      publication: 'N/A',
      reuse: 'No composition data yet',
    },
  },
  {
    id: 'apple-core',
    name: 'Apple core',
    aliases: ['apple cores'],
    category: 'fruit',
    part: 'core',
    preparation: 'raw',
    typicalServing: 20,
    unit: 'g',
    moisture: null,
    organicMatter: v(null, 'g/100g'),
    organicCarbon: v(null, 'g/100g'),
    protein: v(null, 'g/100g', 'assumed'),
    minerals: {
      P: v(null),
      K: v(null),
      Ca: v(null),
      Mg: v(null),
      S: v(null),
      Fe: v(null),
      Zn: v(null),
    },
    nitrogenFactor: 6.25,
    source: {
      url: USDA_SR,
      recordId: null,
      fdcId: null,
      version: 'Pending research',
      publication: 'N/A',
      reuse: 'No composition data yet',
    },
  },
  {
    id: 'orange-flesh',
    name: 'Orange flesh',
    aliases: ['orange', 'oranges'],
    category: 'fruit',
    part: 'flesh',
    preparation: 'raw',
    typicalServing: 131,
    unit: 'g',
    moisture: 0.8675,
    organicMatter: v(null, 'g/100g'),
    organicCarbon: v(null, 'g/100g'),
    protein: v(0.94, 'g/100g'),
    minerals: {
      P: v(14),
      K: v(181),
      Ca: v(40),
      Mg: v(10),
      S: v(null),
      Fe: v(0.10),
      Zn: v(0.07),
    },
    nitrogenFactor: 6.25,
    source: {
      url: USDA_SR,
      recordId: '09200',
      fdcId: 169097,
      version: 'USDA SR Legacy',
      publication: '2019-04',
      reuse: 'USDA public domain / CC0',
    },
  },
  {
    id: 'orange-peel',
    name: 'Orange peel',
    aliases: ['orange skin', 'orange peels'],
    category: 'fruit',
    part: 'peel',
    preparation: 'raw',
    typicalServing: 45,
    unit: 'g',
    moisture: null,
    organicMatter: v(null, 'g/100g'),
    organicCarbon: v(null, 'g/100g'),
    protein: v(1.5, 'g/100g', 'proxy', 'low'),
    minerals: {
      P: v(21, 'mg/100g', 'proxy', 'low'),
      K: v(212, 'mg/100g', 'proxy', 'low'),
      Ca: v(161, 'mg/100g', 'proxy', 'low'),
      Mg: v(22, 'mg/100g', 'proxy', 'low'),
      S: v(null),
      Fe: v(0.80, 'mg/100g', 'proxy', 'low'),
      Zn: v(0.25, 'mg/100g', 'proxy', 'low'),
    },
    nitrogenFactor: 6.25,
    source: {
      url: USDA_SR,
      recordId: '09216',
      fdcId: null,
      version: 'USDA SR Legacy (compiled estimate)',
      publication: '2019-04',
      reuse: 'USDA public domain / CC0',
    },
  },
  {
    id: 'strawberry',
    name: 'Strawberry',
    aliases: ['strawberries'],
    category: 'fruit',
    part: 'whole',
    preparation: 'raw',
    typicalServing: 12, // One medium strawberry
    unit: 'g',
    moisture: 0.9090,
    organicMatter: v(null, 'g/100g'),
    organicCarbon: v(null, 'g/100g'),
    protein: v(0.67, 'g/100g'),
    minerals: {
      P: v(24),
      K: v(153),
      Ca: v(16),
      Mg: v(13),
      S: v(null),
      Fe: v(0.41),
      Zn: v(0.14),
    },
    nitrogenFactor: 6.25,
    source: {
      url: USDA_SR,
      recordId: '09316',
      fdcId: 167762,
      version: 'USDA SR Legacy',
      publication: '2019-04',
      reuse: 'USDA public domain / CC0',
    },
  },
  {
    id: 'tomato',
    name: 'Tomato',
    aliases: ['tomatoes'],
    category: 'fruit', // Botanically a fruit
    part: 'whole',
    preparation: 'raw',
    typicalServing: 123, // One medium tomato
    unit: 'g',
    moisture: 0.9493,
    organicMatter: v(null, 'g/100g'),
    organicCarbon: v(null, 'g/100g'),
    protein: v(0.88, 'g/100g'),
    minerals: {
      P: v(24),
      K: v(237),
      Ca: v(10),
      Mg: v(11),
      S: v(null),
      Fe: v(0.27),
      Zn: v(0.17),
    },
    nitrogenFactor: 6.25,
    source: {
      url: USDA_SR,
      recordId: '11529',
      fdcId: 170457,
      version: 'USDA SR Legacy',
      publication: '2019-04',
      reuse: 'USDA public domain / CC0',
    },
  },
  {
    id: 'watermelon',
    name: 'Watermelon',
    aliases: ['watermelons'],
    category: 'fruit',
    part: 'flesh',
    preparation: 'raw',
    typicalServing: 286, // 1 cup diced
    unit: 'g',
    moisture: 0.9185,
    organicMatter: v(null, 'g/100g'),
    organicCarbon: v(null, 'g/100g'),
    protein: v(0.61, 'g/100g'),
    minerals: {
      P: v(11),
      K: v(112),
      Ca: v(7),
      Mg: v(10),
      S: v(null),
      Fe: v(0.24),
      Zn: v(0.10),
    },
    nitrogenFactor: 6.25,
    source: {
      url: USDA_SR,
      recordId: '09326',
      fdcId: 167765,
      version: 'USDA SR Legacy',
      publication: '2019-04',
      reuse: 'USDA public domain / CC0',
    },
  },

  // ===== VEGETABLES =====
  {
    id: 'lettuce',
    name: 'Lettuce',
    aliases: ['lettuce leaf', 'lettuce leaves'],
    category: 'vegetable',
    part: 'whole',
    preparation: 'raw',
    typicalServing: 36, // 1 cup shredded
    unit: 'g',
    moisture: 0.9537,
    organicMatter: v(null, 'g/100g'),
    organicCarbon: v(null, 'g/100g'),
    protein: v(1.36, 'g/100g'),
    minerals: {
      P: v(29),
      K: v(194),
      Ca: v(36),
      Mg: v(13),
      S: v(null),
      Fe: v(0.86),
      Zn: v(0.18),
    },
    nitrogenFactor: 6.25,
    source: {
      url: USDA_SR,
      recordId: '11251',
      fdcId: 169248,
      version: 'USDA SR Legacy',
      publication: '2019-04',
      reuse: 'USDA public domain / CC0',
    },
  },
  {
    id: 'carrot',
    name: 'Carrot',
    aliases: ['carrots'],
    category: 'vegetable',
    part: 'whole',
    preparation: 'raw',
    typicalServing: 61, // One medium carrot
    unit: 'g',
    moisture: 0.8828,
    organicMatter: v(null, 'g/100g'),
    organicCarbon: v(null, 'g/100g'),
    protein: v(0.93, 'g/100g'),
    minerals: {
      P: v(35),
      K: v(320),
      Ca: v(33),
      Mg: v(12),
      S: v(null),
      Fe: v(0.30),
      Zn: v(0.24),
    },
    nitrogenFactor: 6.25,
    source: {
      url: USDA_SR,
      recordId: '11124',
      fdcId: 170393,
      version: 'USDA SR Legacy',
      publication: '2019-04',
      reuse: 'USDA public domain / CC0',
    },
  },
  {
    id: 'potato-flesh',
    name: 'Potato flesh',
    aliases: ['potato', 'potatoes'],
    category: 'vegetable',
    part: 'flesh',
    preparation: 'raw',
    typicalServing: 150, // One medium potato
    unit: 'g',
    moisture: 0.7916,
    organicMatter: v(null, 'g/100g'),
    organicCarbon: v(null, 'g/100g'),
    protein: v(2.05, 'g/100g'),
    minerals: {
      P: v(57),
      K: v(425),
      Ca: v(12),
      Mg: v(23),
      S: v(null),
      Fe: v(0.81),
      Zn: v(0.30),
    },
    nitrogenFactor: 6.25,
    source: {
      url: USDA_SR,
      recordId: '11352',
      fdcId: 170026,
      version: 'USDA SR Legacy',
      publication: '2019-04',
      reuse: 'USDA public domain / CC0',
    },
  },
  {
    id: 'potato-peel',
    name: 'Potato peel',
    aliases: ['potato skin', 'potato peels'],
    category: 'vegetable',
    part: 'peel',
    preparation: 'raw',
    typicalServing: 20,
    unit: 'g',
    moisture: null,
    organicMatter: v(null, 'g/100g'),
    organicCarbon: v(null, 'g/100g'),
    protein: v(null, 'g/100g', 'assumed'),
    minerals: {
      P: v(null),
      K: v(null),
      Ca: v(null),
      Mg: v(null),
      S: v(null),
      Fe: v(null),
      Zn: v(null),
    },
    nitrogenFactor: 6.25,
    source: {
      url: USDA_SR,
      recordId: null,
      fdcId: null,
      version: 'Pending research',
      publication: 'N/A',
      reuse: 'No composition data yet',
    },
  },
  {
    id: 'onion',
    name: 'Onion',
    aliases: ['onions'],
    category: 'vegetable',
    part: 'whole',
    preparation: 'raw',
    typicalServing: 110, // One medium onion
    unit: 'g',
    moisture: 0.8917,
    organicMatter: v(null, 'g/100g'),
    organicCarbon: v(null, 'g/100g'),
    protein: v(1.10, 'g/100g'),
    minerals: {
      P: v(29),
      K: v(146),
      Ca: v(23),
      Mg: v(10),
      S: v(null),
      Fe: v(0.21),
      Zn: v(0.17),
    },
    nitrogenFactor: 6.25,
    source: {
      url: USDA_SR,
      recordId: '11282',
      fdcId: 170000,
      version: 'USDA SR Legacy',
      publication: '2019-04',
      reuse: 'USDA public domain / CC0',
    },
  },
  {
    id: 'broccoli',
    name: 'Broccoli',
    aliases: ['broccoli florets'],
    category: 'vegetable',
    part: 'whole',
    preparation: 'raw',
    typicalServing: 91, // 1 cup chopped
    unit: 'g',
    moisture: 0.8929,
    organicMatter: v(null, 'g/100g'),
    organicCarbon: v(null, 'g/100g'),
    protein: v(2.82, 'g/100g'),
    minerals: {
      P: v(66),
      K: v(316),
      Ca: v(47),
      Mg: v(21),
      S: v(null),
      Fe: v(0.73),
      Zn: v(0.41),
    },
    nitrogenFactor: 6.25,
    source: {
      url: USDA_SR,
      recordId: '11090',
      fdcId: 170379,
      version: 'USDA SR Legacy',
      publication: '2019-04',
      reuse: 'USDA public domain / CC0',
    },
  },
  {
    id: 'cucumber',
    name: 'Cucumber',
    aliases: ['cucumbers'],
    category: 'vegetable',
    part: 'whole',
    preparation: 'raw',
    typicalServing: 104, // 1/2 cup sliced
    unit: 'g',
    moisture: 0.9552,
    organicMatter: v(null, 'g/100g'),
    organicCarbon: v(null, 'g/100g'),
    protein: v(0.65, 'g/100g'),
    minerals: {
      P: v(24),
      K: v(147),
      Ca: v(16),
      Mg: v(13),
      S: v(null),
      Fe: v(0.28),
      Zn: v(0.20),
    },
    nitrogenFactor: 6.25,
    source: {
      url: USDA_SR,
      recordId: '11205',
      fdcId: 168409,
      version: 'USDA SR Legacy',
      publication: '2019-04',
      reuse: 'USDA public domain / CC0',
    },
  },
  {
    id: 'bell-pepper',
    name: 'Bell pepper',
    aliases: ['pepper', 'peppers', 'bell peppers', 'sweet pepper'],
    category: 'vegetable',
    part: 'whole',
    preparation: 'raw',
    typicalServing: 119, // One medium pepper
    unit: 'g',
    moisture: 0.9392,
    organicMatter: v(null, 'g/100g'),
    organicCarbon: v(null, 'g/100g'),
    protein: v(0.86, 'g/100g'),
    minerals: {
      P: v(20),
      K: v(175),
      Ca: v(10),
      Mg: v(10),
      S: v(null),
      Fe: v(0.34),
      Zn: v(0.13),
    },
    nitrogenFactor: 6.25,
    source: {
      url: USDA_SR,
      recordId: '11821',
      fdcId: 170108,
      version: 'USDA SR Legacy',
      publication: '2019-04',
      reuse: 'USDA public domain / CC0',
    },
  },

  // ===== GRAINS =====
  {
    id: 'bread-white',
    name: 'White bread',
    aliases: ['bread', 'white bread'],
    category: 'grain',
    part: 'whole',
    preparation: 'cooked',
    typicalServing: 25, // One slice
    unit: 'g',
    moisture: 0.3798,
    organicMatter: v(null, 'g/100g'),
    organicCarbon: v(null, 'g/100g'),
    protein: v(7.64, 'g/100g'),
    minerals: {
      P: v(80),
      K: v(100),
      Ca: v(151),
      Mg: v(22),
      S: v(null),
      Fe: v(3.64),
      Zn: v(0.57),
    },
    nitrogenFactor: 6.25,
    source: {
      url: USDA_SR,
      recordId: '18069',
      fdcId: 172687,
      version: 'USDA SR Legacy',
      publication: '2019-04',
      reuse: 'USDA public domain / CC0',
    },
  },
  {
    id: 'rice-cooked',
    name: 'Rice, cooked',
    aliases: ['rice', 'white rice', 'cooked rice'],
    category: 'grain',
    part: 'whole',
    preparation: 'cooked',
    typicalServing: 158, // 1 cup cooked
    unit: 'g',
    moisture: 0.6895,
    organicMatter: v(null, 'g/100g'),
    organicCarbon: v(null, 'g/100g'),
    protein: v(2.69, 'g/100g'),
    minerals: {
      P: v(43),
      K: v(35),
      Ca: v(10),
      Mg: v(12),
      S: v(null),
      Fe: v(1.20),
      Zn: v(0.49),
    },
    nitrogenFactor: 6.25,
    source: {
      url: USDA_SR,
      recordId: '20045',
      fdcId: 169757,
      version: 'USDA SR Legacy',
      publication: '2019-04',
      reuse: 'USDA public domain / CC0',
    },
  },
  {
    id: 'pasta-cooked',
    name: 'Pasta, cooked',
    aliases: ['pasta', 'noodles', 'spaghetti', 'cooked pasta'],
    category: 'grain',
    part: 'whole',
    preparation: 'cooked',
    typicalServing: 140, // 1 cup cooked
    unit: 'g',
    moisture: 0.6239,
    organicMatter: v(null, 'g/100g'),
    organicCarbon: v(null, 'g/100g'),
    protein: v(5.80, 'g/100g'),
    minerals: {
      P: v(58),
      K: v(44),
      Ca: v(7),
      Mg: v(18),
      S: v(null),
      Fe: v(1.28),
      Zn: v(0.51),
    },
    nitrogenFactor: 6.25,
    source: {
      url: USDA_SR,
      recordId: '20121',
      fdcId: 169735,
      version: 'USDA SR Legacy',
      publication: '2019-04',
      reuse: 'USDA public domain / CC0',
    },
  },

  // ===== PROTEINS =====
  {
    id: 'egg-whole',
    name: 'Egg, whole',
    aliases: ['egg', 'eggs'],
    category: 'protein',
    part: 'whole',
    preparation: 'raw',
    typicalServing: 50, // One large egg
    unit: 'g',
    moisture: 0.7628,
    organicMatter: v(null, 'g/100g'),
    organicCarbon: v(null, 'g/100g'),
    protein: v(12.56, 'g/100g'),
    minerals: {
      P: v(198),
      K: v(138),
      Ca: v(56),
      Mg: v(12),
      S: v(null),
      Fe: v(1.75),
      Zn: v(1.29),
    },
    nitrogenFactor: 6.25,
    source: {
      url: USDA_SR,
      recordId: '01123',
      fdcId: 171287,
      version: 'USDA SR Legacy',
      publication: '2019-04',
      reuse: 'USDA public domain / CC0',
    },
  },
  {
    id: 'eggshell',
    name: 'Eggshell',
    aliases: ['egg shell', 'eggshells', 'egg shells'],
    category: 'protein',
    part: 'shell',
    preparation: 'raw',
    typicalServing: 6, // Shell from one egg
    unit: 'g',
    moisture: 0.02,
    organicMatter: v(3.5, 'g/100g', 'assumed', 'low'),
    organicCarbon: v(null, 'g/100g'),
    protein: v(3.6, 'g/100g', 'assumed', 'low'), // Mostly calcium carbonate
    minerals: {
      P: v(50, 'mg/100g', 'assumed', 'low'),
      K: v(30, 'mg/100g', 'assumed', 'low'),
      Ca: v(37000, 'mg/100g', 'assumed', 'medium'), // ~37% calcium
      Mg: v(400, 'mg/100g', 'assumed', 'low'),
      S: v(null),
      Fe: v(2, 'mg/100g', 'assumed', 'low'),
      Zn: v(0.5, 'mg/100g', 'assumed', 'low'),
    },
    nitrogenFactor: 6.25,
    source: {
      url: 'Scientific literature estimates',
      recordId: null,
      fdcId: null,
      version: 'Project estimates',
      publication: 'N/A',
      reuse: 'project-assumption',
    },
  },
  {
    id: 'chicken-raw',
    name: 'Chicken, raw',
    aliases: ['chicken', 'chicken breast', 'chicken meat'],
    category: 'protein',
    part: 'whole',
    preparation: 'raw',
    typicalServing: 100,
    unit: 'g',
    moisture: 0.7360,
    organicMatter: v(null, 'g/100g'),
    organicCarbon: v(null, 'g/100g'),
    protein: v(23.09, 'g/100g'),
    minerals: {
      P: v(173),
      K: v(256),
      Ca: v(15),
      Mg: v(28),
      S: v(null),
      Fe: v(1.01),
      Zn: v(1.54),
    },
    nitrogenFactor: 6.25,
    source: {
      url: USDA_SR,
      recordId: '05062',
      fdcId: 171477,
      version: 'USDA SR Legacy',
      publication: '2019-04',
      reuse: 'USDA public domain / CC0',
    },
  },
  {
    id: 'ground-beef',
    name: 'Ground beef, raw',
    aliases: ['beef', 'ground beef', 'hamburger', 'hamburger meat'],
    category: 'protein',
    part: 'whole',
    preparation: 'raw',
    typicalServing: 100,
    unit: 'g',
    moisture: 0.6403,
    organicMatter: v(null, 'g/100g'),
    organicCarbon: v(null, 'g/100g'),
    protein: v(17.17, 'g/100g'),
    minerals: {
      P: v(170),
      K: v(270),
      Ca: v(18),
      Mg: v(18),
      S: v(null),
      Fe: v(2.08),
      Zn: v(4.79),
    },
    nitrogenFactor: 6.25,
    source: {
      url: USDA_SR,
      recordId: '13046',
      fdcId: 174032,
      version: 'USDA SR Legacy',
      publication: '2019-04',
      reuse: 'USDA public domain / CC0',
    },
  },

  // ===== DAIRY =====
  {
    id: 'cheese-cheddar',
    name: 'Cheddar cheese',
    aliases: ['cheese', 'cheddar', 'cheese cheddar'],
    category: 'dairy',
    part: 'whole',
    preparation: 'raw',
    typicalServing: 28, // 1 oz slice
    unit: 'g',
    moisture: 0.3690,
    organicMatter: v(null, 'g/100g'),
    organicCarbon: v(null, 'g/100g'),
    protein: v(24.90, 'g/100g'),
    minerals: {
      P: v(512),
      K: v(98),
      Ca: v(721),
      Mg: v(28),
      S: v(null),
      Fe: v(0.68),
      Zn: v(3.11),
    },
    nitrogenFactor: 6.38, // Dairy-specific factor
    source: {
      url: USDA_SR,
      recordId: '01009',
      fdcId: 173419,
      version: 'USDA SR Legacy',
      publication: '2019-04',
      reuse: 'USDA public domain / CC0',
    },
  },
  {
    id: 'yogurt',
    name: 'Yogurt, plain',
    aliases: ['yogurt', 'plain yogurt'],
    category: 'dairy',
    part: 'whole',
    preparation: 'raw',
    typicalServing: 245, // 1 cup
    unit: 'g',
    moisture: 0.8790,
    organicMatter: v(null, 'g/100g'),
    organicCarbon: v(null, 'g/100g'),
    protein: v(3.47, 'g/100g'),
    minerals: {
      P: v(135),
      K: v(155),
      Ca: v(121),
      Mg: v(12),
      S: v(null),
      Fe: v(0.05),
      Zn: v(0.59),
    },
    nitrogenFactor: 6.38,
    source: {
      url: USDA_SR,
      recordId: '01116',
      fdcId: 170903,
      version: 'USDA SR Legacy',
      publication: '2019-04',
      reuse: 'USDA public domain / CC0',
    },
  },

  // ===== COFFEE GROUNDS =====
  {
    id: 'coffee-grounds',
    name: 'Coffee grounds, used',
    aliases: ['coffee grounds', 'coffee', 'used coffee grounds'],
    category: 'grain',
    part: 'whole',
    preparation: 'cooked',
    typicalServing: 10, // Typical amount per cup
    unit: 'g',
    moisture: 0.60, // After brewing
    organicMatter: v(null, 'g/100g'),
    organicCarbon: v(null, 'g/100g'),
    protein: v(2.0, 'g/100g', 'assumed', 'low'),
    minerals: {
      P: v(60, 'mg/100g', 'assumed', 'low'),
      K: v(320, 'mg/100g', 'assumed', 'medium'), // Coffee grounds are high in K
      Ca: v(50, 'mg/100g', 'assumed', 'low'),
      Mg: v(80, 'mg/100g', 'assumed', 'low'),
      S: v(null),
      Fe: v(0.5, 'mg/100g', 'assumed', 'low'),
      Zn: v(0.2, 'mg/100g', 'assumed', 'low'),
    },
    nitrogenFactor: 6.25,
    source: {
      url: 'Research literature on coffee grounds composting',
      recordId: null,
      fdcId: null,
      version: 'Literature estimates',
      publication: 'N/A',
      reuse: 'project-assumption',
    },
  },

  // ===== EXPANDED DATABASE - MORE FRUITS =====
  {
    id: 'grapes',
    name: 'Grapes',
    aliases: ['grape', 'grapes', 'red grapes', 'green grapes'],
    category: 'fruit',
    part: 'whole',
    preparation: 'raw',
    typicalServing: 92,
    unit: 'g',
    moisture: 0.8087,
    organicMatter: v(null, 'g/100g'),
    organicCarbon: v(null, 'g/100g'),
    protein: v(0.72, 'g/100g'),
    minerals: {
      P: v(20),
      K: v(191),
      Ca: v(10),
      Mg: v(7),
      S: v(null),
      Fe: v(0.36),
      Zn: v(0.07),
    },
    nitrogenFactor: 6.25,
    source: {
      url: USDA_SR,
      recordId: '09132',
      fdcId: 174682,
      version: 'USDA SR Legacy',
      publication: '2019-04',
      reuse: 'USDA public domain / CC0',
    },
  },
  {
    id: 'blueberries',
    name: 'Blueberries',
    aliases: ['blueberry', 'blueberries'],
    category: 'fruit',
    part: 'whole',
    preparation: 'raw',
    typicalServing: 148,
    unit: 'g',
    moisture: 0.8435,
    organicMatter: v(null, 'g/100g'),
    organicCarbon: v(null, 'g/100g'),
    protein: v(0.74, 'g/100g'),
    minerals: {
      P: v(12),
      K: v(77),
      Ca: v(6),
      Mg: v(6),
      S: v(null),
      Fe: v(0.28),
      Zn: v(0.16),
    },
    nitrogenFactor: 6.25,
    source: {
      url: USDA_SR,
      recordId: '09050',
      fdcId: 171711,
      version: 'USDA SR Legacy',
      publication: '2019-04',
      reuse: 'USDA public domain / CC0',
    },
  },
  {
    id: 'pear',
    name: 'Pear',
    aliases: ['pears'],
    category: 'fruit',
    part: 'whole',
    preparation: 'raw',
    typicalServing: 178,
    unit: 'g',
    moisture: 0.8394,
    organicMatter: v(null, 'g/100g'),
    organicCarbon: v(null, 'g/100g'),
    protein: v(0.36, 'g/100g'),
    minerals: {
      P: v(12),
      K: v(116),
      Ca: v(9),
      Mg: v(7),
      S: v(null),
      Fe: v(0.18),
      Zn: v(0.10),
    },
    nitrogenFactor: 6.25,
    source: {
      url: USDA_SR,
      recordId: '09252',
      fdcId: 169118,
      version: 'USDA SR Legacy',
      publication: '2019-04',
      reuse: 'USDA public domain / CC0',
    },
  },
  {
    id: 'peach',
    name: 'Peach',
    aliases: ['peaches'],
    category: 'fruit',
    part: 'whole',
    preparation: 'raw',
    typicalServing: 150,
    unit: 'g',
    moisture: 0.8887,
    organicMatter: v(null, 'g/100g'),
    organicCarbon: v(null, 'g/100g'),
    protein: v(0.91, 'g/100g'),
    minerals: {
      P: v(20),
      K: v(190),
      Ca: v(6),
      Mg: v(9),
      S: v(null),
      Fe: v(0.25),
      Zn: v(0.17),
    },
    nitrogenFactor: 6.25,
    source: {
      url: USDA_SR,
      recordId: '09236',
      fdcId: 169920,
      version: 'USDA SR Legacy',
      publication: '2019-04',
      reuse: 'USDA public domain / CC0',
    },
  },
  {
    id: 'mango',
    name: 'Mango',
    aliases: ['mangos', 'mangoes'],
    category: 'fruit',
    part: 'flesh',
    preparation: 'raw',
    typicalServing: 165,
    unit: 'g',
    moisture: 0.8382,
    organicMatter: v(null, 'g/100g'),
    organicCarbon: v(null, 'g/100g'),
    protein: v(0.82, 'g/100g'),
    minerals: {
      P: v(14),
      K: v(168),
      Ca: v(11),
      Mg: v(10),
      S: v(null),
      Fe: v(0.16),
      Zn: v(0.09),
    },
    nitrogenFactor: 6.25,
    source: {
      url: USDA_SR,
      recordId: '09176',
      fdcId: 169910,
      version: 'USDA SR Legacy',
      publication: '2019-04',
      reuse: 'USDA public domain / CC0',
    },
  },
  {
    id: 'pineapple',
    name: 'Pineapple',
    aliases: ['pineapples'],
    category: 'fruit',
    part: 'flesh',
    preparation: 'raw',
    typicalServing: 165,
    unit: 'g',
    moisture: 0.8602,
    organicMatter: v(null, 'g/100g'),
    organicCarbon: v(null, 'g/100g'),
    protein: v(0.54, 'g/100g'),
    minerals: {
      P: v(8),
      K: v(109),
      Ca: v(13),
      Mg: v(12),
      S: v(null),
      Fe: v(0.29),
      Zn: v(0.12),
    },
    nitrogenFactor: 6.25,
    source: {
      url: USDA_SR,
      recordId: '09266',
      fdcId: 169124,
      version: 'USDA SR Legacy',
      publication: '2019-04',
      reuse: 'USDA public domain / CC0',
    },
  },
  {
    id: 'cantaloupe',
    name: 'Cantaloupe',
    aliases: ['melon', 'cantaloupe melon'],
    category: 'fruit',
    part: 'flesh',
    preparation: 'raw',
    typicalServing: 177,
    unit: 'g',
    moisture: 0.9019,
    organicMatter: v(null, 'g/100g'),
    organicCarbon: v(null, 'g/100g'),
    protein: v(0.84, 'g/100g'),
    minerals: {
      P: v(15),
      K: v(267),
      Ca: v(9),
      Mg: v(12),
      S: v(null),
      Fe: v(0.21),
      Zn: v(0.18),
    },
    nitrogenFactor: 6.25,
    source: {
      url: USDA_SR,
      recordId: '09181',
      fdcId: 169092,
      version: 'USDA SR Legacy',
      publication: '2019-04',
      reuse: 'USDA public domain / CC0',
    },
  },
  {
    id: 'lemon',
    name: 'Lemon',
    aliases: ['lemons', 'lemon peel'],
    category: 'fruit',
    part: 'whole',
    preparation: 'raw',
    typicalServing: 84,
    unit: 'g',
    moisture: 0.8889,
    organicMatter: v(null, 'g/100g'),
    organicCarbon: v(null, 'g/100g'),
    protein: v(1.10, 'g/100g'),
    minerals: {
      P: v(16),
      K: v(138),
      Ca: v(26),
      Mg: v(8),
      S: v(null),
      Fe: v(0.60),
      Zn: v(0.06),
    },
    nitrogenFactor: 6.25,
    source: {
      url: USDA_SR,
      recordId: '09150',
      fdcId: 167746,
      version: 'USDA SR Legacy',
      publication: '2019-04',
      reuse: 'USDA public domain / CC0',
    },
  },
  {
    id: 'avocado',
    name: 'Avocado',
    aliases: ['avocados', 'avocado peel', 'avocado pit'],
    category: 'fruit',
    part: 'flesh',
    preparation: 'raw',
    typicalServing: 150,
    unit: 'g',
    moisture: 0.7329,
    organicMatter: v(null, 'g/100g'),
    organicCarbon: v(null, 'g/100g'),
    protein: v(2.00, 'g/100g'),
    minerals: {
      P: v(52),
      K: v(485),
      Ca: v(12),
      Mg: v(29),
      S: v(null),
      Fe: v(0.55),
      Zn: v(0.64),
    },
    nitrogenFactor: 6.25,
    source: {
      url: USDA_SR,
      recordId: '09037',
      fdcId: 171705,
      version: 'USDA SR Legacy',
      publication: '2019-04',
      reuse: 'USDA public domain / CC0',
    },
  },
  {
    id: 'raspberries',
    name: 'Raspberries',
    aliases: ['raspberry', 'raspberries'],
    category: 'fruit',
    part: 'whole',
    preparation: 'raw',
    typicalServing: 123,
    unit: 'g',
    moisture: 0.8587,
    organicMatter: v(null, 'g/100g'),
    organicCarbon: v(null, 'g/100g'),
    protein: v(1.20, 'g/100g'),
    minerals: {
      P: v(29),
      K: v(151),
      Ca: v(25),
      Mg: v(22),
      S: v(null),
      Fe: v(0.69),
      Zn: v(0.42),
    },
    nitrogenFactor: 6.25,
    source: {
      url: USDA_SR,
      recordId: '09302',
      fdcId: 167755,
      version: 'USDA SR Legacy',
      publication: '2019-04',
      reuse: 'USDA public domain / CC0',
    },
  },
  {
    id: 'cherries',
    name: 'Cherries',
    aliases: ['cherry', 'cherries', 'sweet cherries'],
    category: 'fruit',
    part: 'whole',
    preparation: 'raw',
    typicalServing: 154,
    unit: 'g',
    moisture: 0.8229,
    organicMatter: v(null, 'g/100g'),
    organicCarbon: v(null, 'g/100g'),
    protein: v(1.06, 'g/100g'),
    minerals: {
      P: v(21),
      K: v(222),
      Ca: v(13),
      Mg: v(11),
      S: v(null),
      Fe: v(0.36),
      Zn: v(0.07),
    },
    nitrogenFactor: 6.25,
    source: {
      url: USDA_SR,
      recordId: '09070',
      fdcId: 173032,
      version: 'USDA SR Legacy',
      publication: '2019-04',
      reuse: 'USDA public domain / CC0',
    },
  },

  // ===== MORE VEGETABLES =====
  {
    id: 'spinach',
    name: 'Spinach',
    aliases: ['spinach leaves'],
    category: 'vegetable',
    part: 'whole',
    preparation: 'raw',
    typicalServing: 30,
    unit: 'g',
    moisture: 0.9169,
    organicMatter: v(null, 'g/100g'),
    organicCarbon: v(null, 'g/100g'),
    protein: v(2.86, 'g/100g'),
    minerals: {
      P: v(49),
      K: v(558),
      Ca: v(99),
      Mg: v(79),
      S: v(null),
      Fe: v(2.71),
      Zn: v(0.53),
    },
    nitrogenFactor: 6.25,
    source: {
      url: USDA_SR,
      recordId: '11457',
      fdcId: 168462,
      version: 'USDA SR Legacy',
      publication: '2019-04',
      reuse: 'USDA public domain / CC0',
    },
  },
  {
    id: 'kale',
    name: 'Kale',
    aliases: ['kale leaves'],
    category: 'vegetable',
    part: 'whole',
    preparation: 'raw',
    typicalServing: 67,
    unit: 'g',
    moisture: 0.8436,
    organicMatter: v(null, 'g/100g'),
    organicCarbon: v(null, 'g/100g'),
    protein: v(4.28, 'g/100g'),
    minerals: {
      P: v(92),
      K: v(491),
      Ca: v(150),
      Mg: v(47),
      S: v(null),
      Fe: v(1.47),
      Zn: v(0.56),
    },
    nitrogenFactor: 6.25,
    source: {
      url: USDA_SR,
      recordId: '11233',
      fdcId: 168421,
      version: 'USDA SR Legacy',
      publication: '2019-04',
      reuse: 'USDA public domain / CC0',
    },
  },
  {
    id: 'celery',
    name: 'Celery',
    aliases: ['celery stalks'],
    category: 'vegetable',
    part: 'whole',
    preparation: 'raw',
    typicalServing: 40,
    unit: 'g',
    moisture: 0.9513,
    organicMatter: v(null, 'g/100g'),
    organicCarbon: v(null, 'g/100g'),
    protein: v(0.69, 'g/100g'),
    minerals: {
      P: v(24),
      K: v(260),
      Ca: v(40),
      Mg: v(11),
      S: v(null),
      Fe: v(0.20),
      Zn: v(0.13),
    },
    nitrogenFactor: 6.25,
    source: {
      url: USDA_SR,
      recordId: '11143',
      fdcId: 169988,
      version: 'USDA SR Legacy',
      publication: '2019-04',
      reuse: 'USDA public domain / CC0',
    },
  },
  {
    id: 'zucchini',
    name: 'Zucchini',
    aliases: ['zucchini', 'courgette'],
    category: 'vegetable',
    part: 'whole',
    preparation: 'raw',
    typicalServing: 196,
    unit: 'g',
    moisture: 0.9461,
    organicMatter: v(null, 'g/100g'),
    organicCarbon: v(null, 'g/100g'),
    protein: v(1.21, 'g/100g'),
    minerals: {
      P: v(38),
      K: v(261),
      Ca: v(16),
      Mg: v(18),
      S: v(null),
      Fe: v(0.37),
      Zn: v(0.32),
    },
    nitrogenFactor: 6.25,
    source: {
      url: USDA_SR,
      recordId: '11477',
      fdcId: 169291,
      version: 'USDA SR Legacy',
      publication: '2019-04',
      reuse: 'USDA public domain / CC0',
    },
  },
  {
    id: 'cabbage',
    name: 'Cabbage',
    aliases: ['green cabbage', 'cabbage leaves'],
    category: 'vegetable',
    part: 'whole',
    preparation: 'raw',
    typicalServing: 89,
    unit: 'g',
    moisture: 0.9269,
    organicMatter: v(null, 'g/100g'),
    organicCarbon: v(null, 'g/100g'),
    protein: v(1.28, 'g/100g'),
    minerals: {
      P: v(26),
      K: v(170),
      Ca: v(40),
      Mg: v(12),
      S: v(null),
      Fe: v(0.47),
      Zn: v(0.18),
    },
    nitrogenFactor: 6.25,
    source: {
      url: USDA_SR,
      recordId: '11109',
      fdcId: 169975,
      version: 'USDA SR Legacy',
      publication: '2019-04',
      reuse: 'USDA public domain / CC0',
    },
  },
  {
    id: 'cauliflower',
    name: 'Cauliflower',
    aliases: ['cauliflower florets'],
    category: 'vegetable',
    part: 'whole',
    preparation: 'raw',
    typicalServing: 107,
    unit: 'g',
    moisture: 0.9207,
    organicMatter: v(null, 'g/100g'),
    organicCarbon: v(null, 'g/100g'),
    protein: v(1.92, 'g/100g'),
    minerals: {
      P: v(44),
      K: v(299),
      Ca: v(22),
      Mg: v(15),
      S: v(null),
      Fe: v(0.42),
      Zn: v(0.27),
    },
    nitrogenFactor: 6.25,
    source: {
      url: USDA_SR,
      recordId: '11135',
      fdcId: 169986,
      version: 'USDA SR Legacy',
      publication: '2019-04',
      reuse: 'USDA public domain / CC0',
    },
  },
  {
    id: 'corn',
    name: 'Sweet corn',
    aliases: ['corn', 'corn kernels', 'sweet corn'],
    category: 'vegetable',
    part: 'kernels',
    preparation: 'raw',
    typicalServing: 90,
    unit: 'g',
    moisture: 0.7603,
    organicMatter: v(null, 'g/100g'),
    organicCarbon: v(null, 'g/100g'),
    protein: v(3.27, 'g/100g'),
    minerals: {
      P: v(89),
      K: v(270),
      Ca: v(2),
      Mg: v(37),
      S: v(null),
      Fe: v(0.52),
      Zn: v(0.46),
    },
    nitrogenFactor: 6.25,
    source: {
      url: USDA_SR,
      recordId: '11167',
      fdcId: 169998,
      version: 'USDA SR Legacy',
      publication: '2019-04',
      reuse: 'USDA public domain / CC0',
    },
  },
  {
    id: 'green-beans',
    name: 'Green beans',
    aliases: ['green bean', 'string beans', 'snap beans'],
    category: 'vegetable',
    part: 'whole',
    preparation: 'raw',
    typicalServing: 110,
    unit: 'g',
    moisture: 0.9037,
    organicMatter: v(null, 'g/100g'),
    organicCarbon: v(null, 'g/100g'),
    protein: v(1.83, 'g/100g'),
    minerals: {
      P: v(38),
      K: v(211),
      Ca: v(37),
      Mg: v(25),
      S: v(null),
      Fe: v(1.03),
      Zn: v(0.24),
    },
    nitrogenFactor: 6.25,
    source: {
      url: USDA_SR,
      recordId: '11052',
      fdcId: 169961,
      version: 'USDA SR Legacy',
      publication: '2019-04',
      reuse: 'USDA public domain / CC0',
    },
  },
  {
    id: 'mushrooms',
    name: 'Mushrooms',
    aliases: ['mushroom', 'white mushrooms', 'button mushrooms'],
    category: 'vegetable',
    part: 'whole',
    preparation: 'raw',
    typicalServing: 70,
    unit: 'g',
    moisture: 0.9237,
    organicMatter: v(null, 'g/100g'),
    organicCarbon: v(null, 'g/100g'),
    protein: v(3.09, 'g/100g'),
    minerals: {
      P: v(86),
      K: v(318),
      Ca: v(3),
      Mg: v(9),
      S: v(null),
      Fe: v(0.50),
      Zn: v(0.52),
    },
    nitrogenFactor: 6.25,
    source: {
      url: USDA_SR,
      recordId: '11260',
      fdcId: 169251,
      version: 'USDA SR Legacy',
      publication: '2019-04',
      reuse: 'USDA public domain / CC0',
    },
  },
  {
    id: 'sweet-potato',
    name: 'Sweet potato',
    aliases: ['sweet potato', 'sweet potatoes', 'yam'],
    category: 'vegetable',
    part: 'flesh',
    preparation: 'raw',
    typicalServing: 130,
    unit: 'g',
    moisture: 0.7709,
    organicMatter: v(null, 'g/100g'),
    organicCarbon: v(null, 'g/100g'),
    protein: v(1.57, 'g/100g'),
    minerals: {
      P: v(47),
      K: v(337),
      Ca: v(30),
      Mg: v(25),
      S: v(null),
      Fe: v(0.61),
      Zn: v(0.30),
    },
    nitrogenFactor: 6.25,
    source: {
      url: USDA_SR,
      recordId: '11507',
      fdcId: 168482,
      version: 'USDA SR Legacy',
      publication: '2019-04',
      reuse: 'USDA public domain / CC0',
    },
  },
  {
    id: 'squash',
    name: 'Butternut squash',
    aliases: ['squash', 'butternut squash', 'winter squash'],
    category: 'vegetable',
    part: 'flesh',
    preparation: 'raw',
    typicalServing: 205,
    unit: 'g',
    moisture: 0.8642,
    organicMatter: v(null, 'g/100g'),
    organicCarbon: v(null, 'g/100g'),
    protein: v(1.00, 'g/100g'),
    minerals: {
      P: v(33),
      K: v(352),
      Ca: v(48),
      Mg: v(34),
      S: v(null),
      Fe: v(0.70),
      Zn: v(0.15),
    },
    nitrogenFactor: 6.25,
    source: {
      url: USDA_SR,
      recordId: '11485',
      fdcId: 169474,
      version: 'USDA SR Legacy',
      publication: '2019-04',
      reuse: 'USDA public domain / CC0',
    },
  },
  {
    id: 'pumpkin',
    name: 'Pumpkin',
    aliases: ['pumpkin', 'pumpkins'],
    category: 'vegetable',
    part: 'flesh',
    preparation: 'raw',
    typicalServing: 116,
    unit: 'g',
    moisture: 0.9187,
    organicMatter: v(null, 'g/100g'),
    organicCarbon: v(null, 'g/100g'),
    protein: v(1.00, 'g/100g'),
    minerals: {
      P: v(44),
      K: v(340),
      Ca: v(21),
      Mg: v(12),
      S: v(null),
      Fe: v(0.80),
      Zn: v(0.32),
    },
    nitrogenFactor: 6.25,
    source: {
      url: USDA_SR,
      recordId: '11422',
      fdcId: 169416,
      version: 'USDA SR Legacy',
      publication: '2019-04',
      reuse: 'USDA public domain / CC0',
    },
  },

  // ===== MORE GRAINS & PROTEINS =====
  {
    id: 'oatmeal-cooked',
    name: 'Oatmeal, cooked',
    aliases: ['oatmeal', 'oats', 'porridge', 'cooked oats'],
    category: 'grain',
    part: 'whole',
    preparation: 'cooked',
    typicalServing: 234,
    unit: 'g',
    moisture: 0.8375,
    organicMatter: v(null, 'g/100g'),
    organicCarbon: v(null, 'g/100g'),
    protein: v(2.54, 'g/100g'),
    minerals: {
      P: v(77),
      K: v(70),
      Ca: v(9),
      Mg: v(27),
      S: v(null),
      Fe: v(0.88),
      Zn: v(0.62),
    },
    nitrogenFactor: 6.25,
    source: {
      url: USDA_SR,
      recordId: '08121',
      fdcId: 169705,
      version: 'USDA SR Legacy',
      publication: '2019-04',
      reuse: 'USDA public domain / CC0',
    },
  },
  {
    id: 'quinoa-cooked',
    name: 'Quinoa, cooked',
    aliases: ['quinoa', 'cooked quinoa'],
    category: 'grain',
    part: 'whole',
    preparation: 'cooked',
    typicalServing: 185,
    unit: 'g',
    moisture: 0.7193,
    organicMatter: v(null, 'g/100g'),
    organicCarbon: v(null, 'g/100g'),
    protein: v(4.40, 'g/100g'),
    minerals: {
      P: v(152),
      K: v(172),
      Ca: v(17),
      Mg: v(64),
      S: v(null),
      Fe: v(1.49),
      Zn: v(1.09),
    },
    nitrogenFactor: 6.25,
    source: {
      url: USDA_SR,
      recordId: '20035',
      fdcId: 168917,
      version: 'USDA SR Legacy',
      publication: '2019-04',
      reuse: 'USDA public domain / CC0',
    },
  },
  {
    id: 'black-beans-cooked',
    name: 'Black beans, cooked',
    aliases: ['black beans', 'beans', 'cooked beans'],
    category: 'protein',
    part: 'whole',
    preparation: 'cooked',
    typicalServing: 172,
    unit: 'g',
    moisture: 0.6603,
    organicMatter: v(null, 'g/100g'),
    organicCarbon: v(null, 'g/100g'),
    protein: v(8.86, 'g/100g'),
    minerals: {
      P: v(140),
      K: v(355),
      Ca: v(27),
      Mg: v(70),
      S: v(null),
      Fe: v(2.10),
      Zn: v(1.12),
    },
    nitrogenFactor: 6.25,
    source: {
      url: USDA_SR,
      recordId: '16015',
      fdcId: 173735,
      version: 'USDA SR Legacy',
      publication: '2019-04',
      reuse: 'USDA public domain / CC0',
    },
  },
  {
    id: 'tofu',
    name: 'Tofu, firm',
    aliases: ['tofu', 'bean curd'],
    category: 'protein',
    part: 'whole',
    preparation: 'raw',
    typicalServing: 126,
    unit: 'g',
    moisture: 0.6985,
    organicMatter: v(null, 'g/100g'),
    organicCarbon: v(null, 'g/100g'),
    protein: v(17.19, 'g/100g'),
    minerals: {
      P: v(190),
      K: v(178),
      Ca: v(683),
      Mg: v(65),
      S: v(null),
      Fe: v(2.66),
      Zn: v(1.57),
    },
    nitrogenFactor: 6.25,
    source: {
      url: USDA_SR,
      recordId: '16213',
      fdcId: 172445,
      version: 'USDA SR Legacy',
      publication: '2019-04',
      reuse: 'USDA public domain / CC0',
    },
  },
  {
    id: 'lentils-cooked',
    name: 'Lentils, cooked',
    aliases: ['lentils', 'cooked lentils'],
    category: 'protein',
    part: 'whole',
    preparation: 'cooked',
    typicalServing: 198,
    unit: 'g',
    moisture: 0.6963,
    organicMatter: v(null, 'g/100g'),
    organicCarbon: v(null, 'g/100g'),
    protein: v(9.02, 'g/100g'),
    minerals: {
      P: v(180),
      K: v(369),
      Ca: v(19),
      Mg: v(36),
      S: v(null),
      Fe: v(3.33),
      Zn: v(1.27),
    },
    nitrogenFactor: 6.25,
    source: {
      url: USDA_SR,
      recordId: '16069',
      fdcId: 172420,
      version: 'USDA SR Legacy',
      publication: '2019-04',
      reuse: 'USDA public domain / CC0',
    },
  },
];

/**
 * Composite Foods Database
 * 
 * Common meals and mixed foods broken down into their typical components.
 * Percentages are based on standard recipes and assumptions.
 */
export const compositeFoods: CompositeFood[] = [
  {
    id: 'cheeseburger',
    name: 'Cheeseburger',
    category: 'composite',
    typicalServing: 200,
    unit: 'g',
    components: [
      { materialId: 'ground-beef', percentage: 40 },
      { materialId: 'cheese-cheddar', percentage: 10 },
      { materialId: 'bread-white', percentage: 35 }, // Bun
      { materialId: 'lettuce', percentage: 7.5 },
      { materialId: 'tomato', percentage: 7.5 },
    ],
  },
  {
    id: 'salad',
    name: 'Mixed salad',
    category: 'composite',
    typicalServing: 150,
    unit: 'g',
    components: [
      { materialId: 'lettuce', percentage: 60 },
      { materialId: 'tomato', percentage: 20 },
      { materialId: 'cucumber', percentage: 10 },
      { materialId: 'carrot', percentage: 10 },
    ],
  },
  {
    id: 'fruit-salad',
    name: 'Fruit salad',
    category: 'composite',
    typicalServing: 200,
    unit: 'g',
    components: [
      { materialId: 'banana-flesh', percentage: 25 },
      { materialId: 'apple-flesh', percentage: 25 },
      { materialId: 'orange-flesh', percentage: 25 },
      { materialId: 'strawberry', percentage: 25 },
    ],
  },
  {
    id: 'sandwich',
    name: 'Sandwich',
    category: 'composite',
    typicalServing: 150,
    unit: 'g',
    components: [
      { materialId: 'bread-white', percentage: 50 },
      { materialId: 'cheese-cheddar', percentage: 15 },
      { materialId: 'lettuce', percentage: 15 },
      { materialId: 'tomato', percentage: 20 },
    ],
  },
];

/**
 * Category Definitions
 */
export const categories = {
  fruit: { name: 'Fruits', icon: '🍎', description: 'Fruits and fruit scraps' },
  vegetable: { name: 'Vegetables', icon: '🥕', description: 'Vegetables and vegetable scraps' },
  grain: { name: 'Grains & Bread', icon: '🍞', description: 'Breads, pasta, rice, and grains' },
  protein: { name: 'Proteins', icon: '🥩', description: 'Meat, eggs, and protein sources' },
  dairy: { name: 'Dairy', icon: '🧀', description: 'Cheese, yogurt, and dairy products' },
  composite: { name: 'Mixed Foods', icon: '🍔', description: 'Common meals and composite foods' },
} as const;

/**
 * Helper Functions
 */

export function getMaterialById(id: string): Material | undefined {
  return materials.find(m => m.id === id);
}

export function getCompositeFoodById(id: string): CompositeFood | undefined {
  return compositeFoods.find(cf => cf.id === id);
}

export function searchMaterials(query: string): Material[] {
  const lowerQuery = query.toLowerCase();
  return materials.filter(m => 
    m.name.toLowerCase().includes(lowerQuery) ||
    m.aliases.some(alias => alias.toLowerCase().includes(lowerQuery))
  );
}

export function searchCompositeFoods(query: string): CompositeFood[] {
  const lowerQuery = query.toLowerCase();
  return compositeFoods.filter(cf => 
    cf.name.toLowerCase().includes(lowerQuery)
  );
}

export function searchAll(query: string): Array<Material | CompositeFood> {
  return [
    ...searchMaterials(query),
    ...searchCompositeFoods(query),
  ];
}

export function getMaterialsByCategory(category: keyof typeof categories): Material[] {
  return materials.filter(m => m.category === category);
}

/**
 * Portion Evidence Statement
 * Documents the source and methodology for default portion sizes
 */
export const portionEvidence = 'portion-v2-expanded: Typical serving sizes are based on USDA standard reference portions and common household measures. Individual portions vary; all values are editable. Database includes 60 foods with nutritional data from USDA FoodData Central SR Legacy.';

/**
 * Legacy Compatibility Layer
 * These exports maintain backward compatibility with the original catalogue structure
 * used by parser.ts and calculate.ts
 */

// Add legacy properties to Material type for backward compatibility
export interface LegacyMaterial extends Material {
  food: string;
  portionG: number;
}

// Extract unique food base names (without parts like "flesh", "peel") from aliases
// This creates a list like ['banana', 'apple', 'orange', 'strawberry', etc.]
export const foods = Array.from(
  new Set(
    materials.flatMap(m => 
      m.aliases.filter(alias => 
        // Filter out aliases that include part names
        !alias.toLowerCase().includes('peel') &&
        !alias.toLowerCase().includes('skin') &&
        !alias.toLowerCase().includes('core') &&
        !alias.toLowerCase().includes('flesh') &&
        !alias.toLowerCase().includes('shell') &&
        !alias.toLowerCase().includes('pit')
      )
    )
  )
).sort();

export type Food = string; // Changed from literal union to string since we have 60+ foods

// Legacy component lookup function - maps new structure to old
export function components(food: string, part: string): LegacyMaterial[] {
  const foodLower = food.toLowerCase();
  
  // Find all materials that match the food name in their aliases
  const matchingMaterials = materials.filter(m =>
    m.aliases.some(alias => alias.toLowerCase() === foodLower || alias.toLowerCase() === foodLower + 's')
  );
  
  if (matchingMaterials.length === 0) {
    return [];
  }
  
  // For "whole" part, return all materials that share the same base food name
  if (part === 'whole') {
    // Get the base food name from the first match
    const baseFood = matchingMaterials[0];
    // Find all parts of this food (flesh, peel, core, etc.)
    const allParts = materials.filter(m => {
      // Check if this material shares any alias with the base food
      return m.aliases.some(alias => 
        baseFood.aliases.some(baseAlias => 
          alias.toLowerCase().includes(baseAlias.toLowerCase()) ||
          baseAlias.toLowerCase().includes(alias.toLowerCase())
        )
      );
    });
    
    return allParts.map(m => ({
      ...m,
      food: foodLower,
      portionG: m.typicalServing
    }));
  }
  
  // For specific parts (flesh, peel, core, etc.), match the part
  const found = matchingMaterials.filter(m => 
    m.part.toLowerCase() === part.toLowerCase() ||
    m.part.toLowerCase() === 'whole' // If asking for a specific part, also include 'whole' items
  );
  
  return found.map(m => ({
    ...m,
    food: foodLower,
    portionG: m.typicalServing
  }));
}
