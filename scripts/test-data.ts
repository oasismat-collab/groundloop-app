#!/usr/bin/env tsx
/**
 * Test script to verify expanded food database
 * 
 * Run with: npx tsx scripts/test-data.ts
 */

import { 
  materials, 
  compositeFoods,
  searchMaterials,
  searchCompositeFoods,
  getMaterialById,
  getCompositeFoodById,
  getMaterialsByCategory,
  RETENTION_FACTORS,
  categories 
} from '../lib/expanded-catalogue';

console.log('='.repeat(60));
console.log('FOOD DATABASE TEST');
console.log('='.repeat(60));
console.log();

// Test 1: Database size
console.log('📊 DATABASE STATISTICS');
console.log('-'.repeat(60));
console.log(`Total food items: ${materials.length}`);
console.log(`Composite foods: ${compositeFoods.length}`);
console.log();

// Test 2: Categories
console.log('📁 CATEGORIES');
console.log('-'.repeat(60));
Object.entries(categories).forEach(([key, cat]) => {
  const count = materials.filter(m => m.category === key).length;
  console.log(`${cat.icon} ${cat.name}: ${count} items`);
});
console.log();

// Test 3: Sample foods from each category
console.log('🍎 SAMPLE FOODS');
console.log('-'.repeat(60));
const samples = [
  'banana-flesh',
  'apple-flesh',
  'lettuce',
  'carrot',
  'bread-white',
  'egg-whole',
  'cheese-cheddar',
  'coffee-grounds'
];

samples.forEach(id => {
  const food = getMaterialById(id);
  if (food) {
    console.log(`${food.name}:`);
    console.log(`  Serving: ${food.typicalServing}g`);
    console.log(`  Moisture: ${food.moisture !== null ? (food.moisture * 100).toFixed(1) + '%' : 'Unknown'}`);
    console.log(`  Protein: ${food.protein.value}${food.protein.unit}`);
    console.log(`  K: ${food.minerals.K.value}${food.minerals.K.unit}`);
    console.log(`  P: ${food.minerals.P.value}${food.minerals.P.unit}`);
    console.log(`  Confidence: ${food.source.reuse}`);
    console.log();
  }
});

// Test 4: Composite foods
console.log('🍔 COMPOSITE FOODS');
console.log('-'.repeat(60));
compositeFoods.forEach(cf => {
  console.log(`${cf.name} (${cf.typicalServing}g):`);
  cf.components.forEach(comp => {
    const material = getMaterialById(comp.materialId);
    console.log(`  - ${comp.percentage}% ${material?.name || comp.materialId}`);
  });
  console.log();
});

// Test 5: Search functionality
console.log('🔍 SEARCH TESTS');
console.log('-'.repeat(60));
const searchTests = ['banana', 'cheese', 'apple', 'egg'];
searchTests.forEach(query => {
  const results = searchMaterials(query);
  const composites = searchCompositeFoods(query);
  const total = results.length + composites.length;
  console.log(`"${query}" → ${total} result(s)`);
  results.forEach((r: any) => console.log(`  - ${r.name}`));
  composites.forEach((r: any) => console.log(`  - ${r.name}`));
});
console.log();

// Test 6: Retention factors
console.log('♻️  COMPOSTING RETENTION FACTORS');
console.log('-'.repeat(60));
Object.entries(RETENTION_FACTORS).forEach(([nutrient, factor]) => {
  const percentage = (factor * 100).toFixed(0);
  console.log(`${nutrient.padEnd(15)}: ${percentage}%`);
});
console.log();

// Test 7: Data quality check
console.log('✓ DATA QUALITY CHECK');
console.log('-'.repeat(60));
let withData = 0;
let withoutData = 0;
materials.forEach(m => {
  if (m.protein.value !== null && 
      m.minerals.P.value !== null && 
      m.minerals.K.value !== null) {
    withData++;
  } else {
    withoutData++;
    console.log(`⚠️  ${m.name} - missing data (${m.source.reuse})`);
  }
});
console.log();
console.log(`Foods with complete data: ${withData}/${materials.length}`);
console.log(`Foods awaiting data: ${withoutData}/${materials.length}`);
console.log();

// Test 8: USDA attribution check
console.log('📚 DATA SOURCES');
console.log('-'.repeat(60));
const sources = {
  usda: materials.filter(m => m.source.reuse.includes('USDA')).length,
  project: materials.filter(m => m.source.reuse.includes('project')).length,
  pending: materials.filter(m => m.source.reuse.includes('yet')).length,
};
console.log(`USDA FoodData Central: ${sources.usda} items`);
console.log(`Project estimates: ${sources.project} items`);
console.log(`Pending research: ${sources.pending} items`);
console.log();

console.log('='.repeat(60));
console.log('✅ ALL TESTS COMPLETED');
console.log('='.repeat(60));
console.log();
console.log('Next: Run `npm run dev` to start development server');
console.log('Then navigate to http://localhost:3000');
