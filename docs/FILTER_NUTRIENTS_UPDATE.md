# Nutrient Filtering Update

**Date:** October 24, 2026  
**Update:** Modified cumulative tracker to only show nutrients present in meaningful amounts

## Problem

The original implementation showed all 8 nutrient jars (N, P, K, Ca, Mg, S, Fe, Zn) regardless of whether the composted foods actually contained those nutrients. This resulted in:
- Empty or near-empty jars with trace amounts
- Visual clutter
- Misleading representation of what nutrients are actually in the food

## Solution

Implemented intelligent filtering to only display nutrients that are present in meaningful amounts (≥10mg threshold).

## Changes Made

### 1. Threshold-Based Filtering

Added a 10mg (0.01g) threshold to filter out trace amounts:

```typescript
const THRESHOLD = 0.01; // grams (10mg)

const allElements: Element[] = ['N', 'P', 'K', 'Ca', 'Mg', 'S', 'Fe', 'Zn'];
const relevantElements = allElements.filter(element => 
  totals.nutrients[element] >= THRESHOLD
);
```

### 2. Category-Based Display

Nutrients are now filtered per category:

```typescript
// Categorize only relevant nutrients
const primaryElements = relevantElements.filter(e => ['N', 'P', 'K'].includes(e));
const secondaryElements = relevantElements.filter(e => ['Ca', 'Mg', 'S'].includes(e));
const microElements = relevantElements.filter(e => ['Fe', 'Zn'].includes(e));
```

### 3. Conditional Section Rendering

Each section only renders if it has relevant nutrients:

```typescript
{hasData && primaryElements.length > 0 && (
  <div className="nutrient-section">
    <h3>Primary Nutrients</h3>
    // ... jars for primary nutrients
  </div>
)}
```

### 4. Smart Summary Messages

Summary messages now feature the nutrient with the highest amount:

```typescript
const nutrientAmounts = allElements.map(e => ({
  element: e,
  amount: totals.nutrients[e],
  name: e === 'N' ? 'nitrogen' : ... // full mapping
})).sort((a, b) => b.amount - a.amount);

const topNutrient = nutrientAmounts[0];
```

If the top nutrient is above the threshold, it's mentioned in the summary. Otherwise, the message focuses on water savings.

### 5. Info Message for Low Nutrient Sessions

Added a helpful message when no nutrients meet the threshold:

```typescript
{hasData && relevantElements.length === 0 && (
  <div className="info-message">
    <p>
      The foods you've composted contain very small amounts of nutrients 
      (below 10mg threshold). Keep composting - as you add more sessions, 
      you'll see the jars start to fill!
    </p>
  </div>
)}
```

## User Experience Improvements

### Before
- All 8 nutrient jars always displayed
- Many jars showing "~0 mg" or trace amounts
- Confusing when composting low-nutrient foods

### After
- Only relevant nutrients displayed
- Clean, focused visualization
- Empty sections hidden automatically
- Helpful message when nutrients are below threshold
- Summary message adapts to what's actually present

## Examples

### Example 1: Banana Peel Only
**Nutrients present:** N, K, Ca, Mg (potassium-rich)
**Display:**
- Water jar (featured)
- Primary: N, K only (P hidden)
- Secondary: Ca, Mg only (S hidden)
- Micronutrients section hidden (Fe, Zn below threshold)

### Example 2: Lettuce Scraps
**Nutrients present:** N, K, Ca (lightweight, high water content)
**Display:**
- Water jar (featured)
- Primary: N, K only
- Secondary: Ca only
- Other sections hidden

### Example 3: Mixed Meal (Cheeseburger)
**Nutrients present:** All 8 nutrients (comprehensive meal)
**Display:**
- Water jar (featured)
- Primary: N, P, K (all three)
- Secondary: Ca, Mg, S (all three)
- Micronutrients: Fe, Zn (both present)

## Technical Details

**Threshold Value:** 0.01g (10mg)
- Chosen to filter out trace/negligible amounts
- Low enough to capture meaningful contributions
- High enough to avoid visual clutter

**Performance:** No impact
- Filtering is done client-side with simple array operations
- Negligible computational overhead

**Backwards Compatibility:** Full
- Existing localStorage data works unchanged
- Summary calculations unchanged
- Only display logic affected

## Files Modified

1. **`app/components/CumulativeTracker.tsx`**
   - Added `THRESHOLD` constant
   - Added `relevantElements` filtering
   - Updated category filtering logic
   - Added conditional rendering for sections
   - Enhanced summary message logic
   - Added info message for low-nutrient sessions
   - Added CSS for info-message component

## Future Enhancements

1. **Adjustable Threshold:**
   - Allow users to customize the threshold
   - Show/hide trace amounts on demand

2. **Nutrient Insights:**
   - Highlight which foods contribute most to each nutrient
   - Show nutrient diversity score

3. **Category Collapsing:**
   - Expand/collapse nutrient sections
   - Focus on specific nutrient categories

## Testing Checklist

- [ ] Compost single low-nutrient food (lettuce) - verify filtering works
- [ ] Compost high-nutrient food (eggs) - verify all nutrients shown
- [ ] Compost mixed foods - verify selective display
- [ ] Check empty state still works
- [ ] Verify summary messages adapt correctly
- [ ] Test across all time periods (week/month/year/all-time)
- [ ] Verify info message appears when appropriate
- [ ] Check responsive layout still works

## Conclusion

This update makes the cumulative tracker more accurate and user-friendly by only showing nutrients that are actually present in meaningful amounts. Users now get a clearer picture of what they're contributing to their soil through composting.
