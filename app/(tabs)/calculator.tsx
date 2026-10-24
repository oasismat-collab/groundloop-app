import React, { useState } from 'react';
import { ScrollView, Text, View, TextInput, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, Eyebrow } from '../../src/components/ui';
import { useTheme } from '../../src/theme';
import { FOOD_CATEGORIES, getMaterialById } from '../../src/lib/expanded-catalogue';
import { calculateCompostImpact, formatMass, getNutrientName } from '../../src/lib/nutrient-calculator';
import type { Element } from '../../src/lib/expanded-catalogue';

export default function Calculator() {
  const t = useTheme();
  const [selectedFood, setSelectedFood] = useState<string>('banana-flesh');
  const [quantity, setQuantity] = useState<string>('100');
  const [results, setResults] = useState<any>(null);

  // Get list of common foods
  const commonFoods = [
    { id: 'banana-flesh', name: 'Banana' },
    { id: 'apple-flesh', name: 'Apple' },
    { id: 'lettuce', name: 'Lettuce' },
    { id: 'carrot', name: 'Carrot' },
    { id: 'potato-flesh', name: 'Potato' },
    { id: 'tomato', name: 'Tomato' },
    { id: 'bread-white', name: 'Bread' },
    { id: 'rice-cooked', name: 'Rice (cooked)' },
    { id: 'eggshell', name: 'Egg shell' },
    { id: 'coffee-grounds', name: 'Coffee grounds' },
  ];

  const handleCalculate = () => {
    const mass = parseFloat(quantity);
    if (isNaN(mass) || mass <= 0) {
      return;
    }

    const foodsForCalculation = [{
      id: selectedFood,
      type: 'material' as const,
      massGrams: mass,
    }];

    const calculated = calculateCompostImpact(foodsForCalculation);
    setResults(calculated);
  };

  const primaryNutrients: Element[] = ['N', 'P', 'K'];
  const filteredPrimary = results ? primaryNutrients.filter(e => {
    const amount = results.nutrients[e];
    return amount !== null && amount >= 0.01;
  }) : [];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: t.bg }]} edges={['top']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Eyebrow>NUTRIENT CALCULATOR</Eyebrow>
          <Text style={[styles.title, { color: t.ink }]}>Calculate your impact</Text>
          <Text style={[styles.subtitle, { color: t.inkTertiary }]}>
            See how many nutrients you're returning to the soil
          </Text>
        </View>

        <Card>
          <Text style={[styles.label, { color: t.ink }]}>Food Type</Text>
          <View style={styles.foodGrid}>
            {commonFoods.map(food => (
              <Pressable
                key={food.id}
                style={[
                  styles.foodButton,
                  { 
                    backgroundColor: selectedFood === food.id ? t.forest2 : t.surface,
                    borderColor: t.line,
                  }
                ]}
                onPress={() => setSelectedFood(food.id)}
              >
                <Text style={[
                  styles.foodButtonText,
                  { color: selectedFood === food.id ? 'white' : t.ink }
                ]}>
                  {food.name}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={[styles.label, { color: t.ink, marginTop: 20 }]}>Amount (grams)</Text>
          <TextInput
            style={[styles.input, { backgroundColor: t.surface, color: t.ink, borderColor: t.line }]}
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
            placeholder="100"
            placeholderTextColor={t.inkTertiary}
          />

          <Button onPress={handleCalculate} style={{ marginTop: 20 }}>
            Calculate Impact
          </Button>
        </Card>

        {results && filteredPrimary.length > 0 && (
          <Card style={{ marginTop: 20 }}>
            <Text style={[styles.sectionTitle, { color: t.ink }]}>Nutrients Returned</Text>
            <Text style={[styles.sectionDesc, { color: t.inkTertiary }]}>
              Amount returned to soil through composting
            </Text>
            
            {filteredPrimary.map(element => {
              const amount = results.nutrients[element];
              return (
                <View key={element} style={[styles.nutrientRow, { borderBottomColor: t.line }]}>
                  <View style={styles.nutrientLeft}>
                    <Text style={[styles.nutrientSymbol, { color: t.forest2 }]}>{element}</Text>
                    <Text style={[styles.nutrientName, { color: t.ink }]}>
                      {getNutrientName(element)}
                    </Text>
                  </View>
                  <Text style={[styles.nutrientAmount, { color: t.forest2 }]}>
                    {formatMass(amount)}
                  </Text>
                </View>
              );
            })}

            <View style={[styles.waterRow, { backgroundColor: t.surface, marginTop: 20 }]}>
              <Text style={[styles.waterLabel, { color: t.inkSecondary }]}>Water Saved</Text>
              <Text style={[styles.waterAmount, { color: t.forest2 }]}>
                {results.avoidedImpacts.waterEmbedded 
                  ? `${results.avoidedImpacts.waterEmbedded.toFixed(1)} L`
                  : 'N/A'}
              </Text>
            </View>
          </Card>
        )}

        {results && filteredPrimary.length === 0 && (
          <Card style={{ marginTop: 20 }}>
            <Text style={[styles.infoText, { color: t.inkSecondary }]}>
              ℹ️ This food doesn't have detailed nutrient data yet. We're continuously expanding our database!
            </Text>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginTop: 8,
  },
  subtitle: {
    fontSize: 16,
    marginTop: 8,
    lineHeight: 22,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  foodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  foodButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  foodButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  sectionDesc: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  nutrientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  nutrientLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  nutrientSymbol: {
    fontSize: 20,
    fontWeight: '700',
    width: 32,
  },
  nutrientName: {
    fontSize: 16,
    fontWeight: '500',
  },
  nutrientAmount: {
    fontSize: 18,
    fontWeight: '700',
  },
  waterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
  },
  waterLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  waterAmount: {
    fontSize: 20,
    fontWeight: '700',
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
});
