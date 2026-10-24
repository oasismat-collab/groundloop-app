# Groundwork - Food Waste Composting Impact Calculator

## Project Overview

A web application that helps people understand the tangible environmental benefits of composting food waste. Users input the food items they're composting and see measurable impacts in terms of nutrients returned to soil and water conservation.

**Current Status:** Task 1 Complete - Foundation established  
**Next:** Task 2 - Food Search and Selection Component

## Vision

Transform composting from an abstract environmental action into a quantified, rewarding experience where users can track their cumulative soil health contributions over time.

## Core Features

### Current Implementation (Existing)
- ✅ Fruit scrap explorer (banana, apple, orange)
- ✅ USDA FoodData Central API integration
- ✅ Server-side data fetching with local fallback
- ✅ Nutrient calculation engine
- ✅ Component-based breakdown (flesh, peel, core)
- ✅ Scientific data provenance tracking
- ✅ Evidence-first approach with confidence levels

### Planned Enhancements
- 🔄 **Task 2:** Food search with autocomplete (30+ foods)
- 🔄 **Task 3:** Nutrient calculator with retention factors
- 🔄 **Task 4:** Impact visualization with charts
- 🔄 **Task 5:** Local storage and cumulative tracking
- 🔄 **Task 6:** Expanded food database (100+ items)
- 🔄 **Task 7:** Polished UI/UX
- 🔄 **Task 8:** Optional user accounts (Phase 2)
- 🔄 **Task 9:** Deployment and monitoring

## Technology Stack

### Frontend
- **Framework:** Next.js 16.0.0
- **UI Library:** React 19.2.0
- **Language:** TypeScript 5.9.0
- **Styling:** CSS (future: Tailwind CSS)
- **State Management:** React hooks (future: Pinia/Zustand if needed)

### Backend
- **API Routes:** Next.js API routes
- **Runtime:** Node.js 20.9+
- **Data Sources:** USDA FoodData Central API
- **Storage:** Local JSON (future: PostgreSQL for accounts)

### Development
- **Build Tool:** Next.js (Turbopack)
- **Package Manager:** npm
- **Testing:** tsx + Node test runner
- **Type Checking:** TypeScript compiler

## Data Architecture

### Food Database Structure

```typescript
Material {
  id: string                    // 'banana-flesh'
  name: string                  // 'Banana flesh'
  aliases: string[]             // ['banana', 'bananas']
  category: Category            // 'fruit'
  part: string                  // 'flesh', 'peel', 'whole'
  preparation: string           // 'raw', 'cooked'
  typicalServing: number        // 118 (grams)
  moisture: number | null       // 0.7491 (74.91%)
  protein: Value                // With metadata
  minerals: {                   // P, K, Ca, Mg, S, Fe, Zn
    [element]: Value
  }
  source: SourceMetadata        // USDA attribution
}

CompositeFood {
  id: string                    // 'cheeseburger'
  name: string                  // 'Cheeseburger'
  typicalServing: number        // 200 (grams)
  components: [{
    materialId: string          // 'ground-beef'
    percentage: number          // 40 (percent)
  }]
}
```

### Value Metadata

Every nutrient value includes:
- `value`: Numerical amount or null
- `unit`: 'g/100g' or 'mg/100g'
- `basis`: 'fresh' or 'dry'
- `type`: 'measured' | 'derived' | 'assumed' | 'proxy'
- `source`: URL or citation
- `confidence`: 'high' | 'medium' | 'low'
- `reuse`: 'CC0' | 'project-assumption'

### Composting Retention Model

```typescript
RETENTION_FACTORS = {
  nitrogen: 0.70      // 70% retained
  phosphorus: 0.93    // 93% retained
  potassium: 0.85     // 85% retained
  calcium: 0.90       // 90% retained
  magnesium: 0.90     // 90% retained
  sulfur: 0.75        // 75% retained
  iron: 0.95          // 95% retained
  zinc: 0.95          // 95% retained
  water: 1.0          // 100% contribution
  organicMatter: 0.50 // 50% retained
  carbon: 0.55        // 55% retained
}
```

## Current Database

### Statistics
- **28 individual foods** with nutritional data
- **4 composite foods** (meals)
- **6 categories** (fruits, vegetables, grains, proteins, dairy, composite)
- **24 foods** with complete USDA data
- **2 foods** with project estimates (coffee grounds, eggshell)
- **4 foods** awaiting research (banana peel, apple peel/core, potato peel)

### Foods by Category

**Fruits (10):** Banana (flesh/peel), Apple (flesh/peel/core), Orange (flesh/peel), Strawberry, Tomato, Watermelon

**Vegetables (8):** Lettuce, Carrot, Potato (flesh/peel), Onion, Broccoli, Cucumber, Bell pepper

**Grains (4):** White bread, Rice (cooked), Pasta (cooked), Coffee grounds

**Proteins (4):** Egg (whole/shell), Chicken, Ground beef

**Dairy (2):** Cheddar cheese, Yogurt

**Composite (4):** Cheeseburger, Mixed salad, Fruit salad, Sandwich

## API Integration

### USDA FoodData Central
- **Base URL:** `https://api.nal.usda.gov/fdc/v1`
- **Authentication:** Free API key required
- **Rate Limit:** 1000 requests/hour
- **Data License:** Public domain (CC0)
- **Implementation:** `/app/api/usda/route.ts`
- **Fallback:** Local seed data when API unavailable

### Future APIs
- None planned currently
- All calculation done locally
- No external dependencies for core functionality

## Calculation Model

### Input Processing
1. Parse user input (food name, quantity, fraction)
2. Look up food in database
3. Handle composite foods by breaking into components
4. Calculate component masses

### Nutrient Calculation
```typescript
For each component:
  1. Get nutrient concentration (per 100g fresh)
  2. Apply moisture correction if needed (dry basis → fresh basis)
  3. Scale by actual mass: concentration × (mass / 100)
  4. Apply composting retention factor
  5. Apply application fraction (default: 100%)
  6. Sum across all components

returned_nutrient = mass × concentration × retention × applied
```

### Outputs
- Individual nutrient returns (N, P, K, Ca, Mg, S, Fe, Zn)
- Total organic matter returned
- Total carbon returned
- Water contribution
- Cumulative totals over time (future)

## Scientific Approach

### Data Provenance
- Every value traced to authoritative source
- USDA data preferred (public domain)
- Confidence levels assigned (high/medium/low)
- Unknown values explicitly marked as null
- No invented data presented as fact

### Conservative Estimates
- Retention factors based on EPA research
- Lower bounds chosen when ranges available
- Missing data not substituted with guesses
- Whole fruit totals only shown when all parts known

### Transparency
- Source URLs and record IDs included
- Calculation methodology documented
- Assumptions clearly labeled
- Limitations acknowledged

## Development Workflow

### Setup
```bash
npm install
cp .env.example .env.local
# Add USDA_API_KEY to .env.local
npm run dev
```

### Testing
```bash
npm test              # Run test suite
npm run typecheck     # Type checking
npx tsx scripts/test-data.ts  # Verify database
```

### Building
```bash
npm run build         # Production build
npm start            # Production server
```

## File Structure

```
/
├── app/
│   ├── api/usda/
│   │   └── route.ts              # USDA API proxy
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main app page
├── lib/
│   ├── calculate.ts              # Nutrient calculations
│   ├── catalogue.ts              # Original fruit database
│   ├── expanded-catalogue.ts     # 30+ food database
│   ├── parser.ts                 # Input parsing
│   ├── process.ts                # Retention factors
│   └── usda.ts                   # USDA integration
├── docs/
│   ├── DATA.md                   # Data provenance
│   ├── MODEL.md                  # Calculation model
│   ├── USDA_API.md              # API documentation
│   ├── TASK_1_COMPLETION.md     # Task 1 summary
│   └── PROJECT_OVERVIEW.md       # This file
├── tests/
│   └── model.test.ts             # Model tests
├── scripts/
│   └── test-data.ts              # Database verification
├── public/                        # Static assets
├── .env.example                   # Environment template
├── .gitignore                     # Git ignore rules
├── package.json                   # Dependencies
├── tsconfig.json                  # TypeScript config
└── README.md                      # Project readme
```

## Key Design Decisions

### Why Next.js?
- Server-side API routes protect USDA API key
- Built-in optimization and routing
- TypeScript support out of the box
- Easy deployment to Vercel/Netlify

### Why Local Database?
- Fast lookups without API calls
- Works offline
- Version controlled
- Scientific review possible
- No rate limit concerns

### Why TypeScript?
- Type safety for complex calculations
- Better developer experience
- Catches errors at compile time
- Self-documenting code

### Why Conservative Retention Factors?
- Better to underestimate benefits than overstate
- Based on peer-reviewed research
- Accounts for real-world variability
- Builds user trust

## Future Enhancements

### Short Term (Tasks 2-5)
- Food search and selection UI
- Calculator integration
- Impact visualization
- Cumulative tracking

### Medium Term (Tasks 6-7)
- Expand to 100+ foods
- Polish UI/UX
- Mobile optimization
- Accessibility improvements

### Long Term (Tasks 8-9)
- User accounts
- Cross-device sync
- Social features
- Deployment automation

### Research Needed
- Banana peel composition
- Apple peel and core composition
- Potato peel composition
- Validation of retention factors with experimental data
- Long-term soil carbon sequestration estimates

## Contributing

### Adding New Foods
1. Find authoritative nutritional data (USDA preferred)
2. Record source, FDC ID, confidence level
3. Add to `lib/expanded-catalogue.ts`
4. Include all metadata (moisture, serving size, etc.)
5. Mark missing data as null
6. Test with `npx tsx scripts/test-data.ts`

### Adding Composite Foods
1. Research typical recipe composition
2. Break into component materials (percentages must sum to 100)
3. Document source of recipe
4. Add to `compositeFoods` array
5. Test calculation accuracy

## License & Attribution

### USDA Data
- Public domain (CC0 1.0 Universal)
- No permission required
- Attribution: "U.S. Department of Agriculture, Agricultural Research Service. FoodData Central."

### Project Code
- [Specify project license]

### Third-Party Resources
- EPA composting research (public domain)
- Scientific literature (cited appropriately)

## Links

- **USDA FoodData Central:** https://fdc.nal.usda.gov/
- **API Documentation:** https://fdc.nal.usda.gov/api-guide/
- **EPA Composting:** https://www.epa.gov/sustainable-management-food/composting
- **Get API Key:** https://fdc.nal.usda.gov/api-key-signup/

## Support & Questions

For questions about:
- **Data sources:** See `docs/DATA.md`
- **Calculations:** See `docs/MODEL.md`
- **USDA API:** See `docs/USDA_API.md`
- **Project status:** See `docs/TASK_1_COMPLETION.md`

---

**Last Updated:** October 24, 2026  
**Project Version:** 1.0.0  
**Status:** Task 1 Complete ✅
