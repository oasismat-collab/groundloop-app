# USDA FoodData Central API Documentation

## Overview

The [USDA FoodData Central API](https://fdc.nal.usda.gov/) provides REST access to comprehensive food composition data. All data is public domain (CC0 1.0 Universal).

**Base URL:** `https://api.nal.usda.gov/fdc/v1`

**API Key Required:** Get a free key at https://fdc.nal.usda.gov/api-key-signup/

## Available Endpoints

### 1. Food Search
**Endpoint:** `POST /v1/foods/search`

Searches for foods matching criteria and returns a list with basic nutritional info.

**Request Body:**
```json
{
  "query": "banana",
  "dataType": ["Foundation", "SR Legacy"],
  "pageSize": 25,
  "pageNumber": 1,
  "sortBy": "dataType.keyword",
  "sortOrder": "asc"
}
```

**Example:**
```bash
curl -X POST "https://api.nal.usda.gov/fdc/v1/foods/search?api_key=YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"banana","pageSize":10}'
```

### 2. Food Details
**Endpoint:** `GET /v1/food/{fdcId}`

Returns complete nutritional information for a specific food by its FDC ID.

**Parameters:**
- `fdcId` (path, required): FoodData Central ID
- `format` (query, optional): `abridged` or `full` (default: `full`)
- `nutrients` (query, optional): Comma-separated nutrient IDs to return

**Example:**
```bash
curl "https://api.nal.usda.gov/fdc/v1/food/173944?api_key=YOUR_KEY"
```

### 3. Foods (Bulk)
**Endpoint:** `POST /v1/foods`

Retrieves details for multiple foods at once.

**Request Body:**
```json
{
  "fdcIds": [173944, 171689, 169097],
  "format": "full"
}
```

### 4. Foods List
**Endpoint:** `GET /v1/foods/list`

Returns a paged list of foods.

**Parameters:**
- `dataType` (query, optional): Filter by data type
- `pageSize` (query, optional): Number of results per page (default: 50, max: 200)
- `pageNumber` (query, optional): Page number (default: 1)

## Data Types

FoodData Central includes five distinct data types:

1. **Foundation Foods** - Core analytical data on commodity foods
2. **SR Legacy** - Historical Standard Reference data (frozen as of 2018)
3. **Survey (FNDDS)** - Foods from What We Eat in America surveys
4. **Experimental** - Research data from peer-reviewed journals
5. **Branded Foods** - Commercial products with label data

**For composting calculations, use:** Foundation Foods or SR Legacy for most accurate base composition data.

## Key Nutrient IDs

The API uses numeric IDs for nutrients. Common ones for composting calculations:

| Nutrient | ID | Unit | Description |
|----------|----|----|-------------|
| Water | 1051 | g | Moisture content |
| Protein | 1003 | g | Total protein |
| Nitrogen | 1002 | g | Total nitrogen (when available) |
| Phosphorus (P) | 1093 | mg | Elemental phosphorus |
| Potassium (K) | 1092 | mg | Elemental potassium |
| Calcium (Ca) | 1087 | mg | Elemental calcium |
| Magnesium (Mg) | 1090 | mg | Elemental magnesium |
| Sulfur (S) | 1094 | mg | Elemental sulfur |
| Iron (Fe) | 1089 | mg | Elemental iron |
| Zinc (Zn) | 1095 | mg | Elemental zinc |
| Ash | 1007 | g | Total ash (mineral content) |
| Fiber | 1079 | g | Total dietary fiber |

## Response Structure

**Food Details Response:**
```json
{
  "fdcId": 173944,
  "description": "Bananas, raw",
  "dataType": "SR Legacy",
  "publicationDate": "4/1/2019",
  "foodNutrients": [
    {
      "nutrientId": 1051,
      "nutrientName": "Water",
      "nutrientNumber": "255",
      "unitName": "g",
      "value": 74.91
    },
    {
      "nutrientId": 1003,
      "nutrientName": "Protein",
      "nutrientNumber": "203",
      "unitName": "g",
      "value": 1.09
    },
    {
      "nutrientId": 1092,
      "nutrientName": "Potassium, K",
      "nutrientNumber": "306",
      "unitName": "mg",
      "value": 358
    }
  ],
  "foodPortions": [
    {
      "gramWeight": 118.0,
      "modifier": "medium (7\" to 7-7/8\" long)"
    }
  ]
}
```

## Rate Limits

- **With API Key:** 1000 requests per hour
- **Without API Key (DEMO_KEY):** Limited to 30 requests per hour per IP

**Best Practices:**
- Cache responses locally to minimize API calls
- Use bulk endpoints when fetching multiple foods
- Implement exponential backoff for retry logic
- Store versioned datasets for offline functionality

## Error Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad request (invalid parameters) |
| 401 | Unauthorized (invalid or missing API key) |
| 403 | Forbidden (rate limit exceeded) |
| 404 | Food not found |
| 429 | Too many requests |
| 500 | Internal server error |

## Implementation in This Project

See `/app/api/usda/route.ts` for server-side API integration. The endpoint:
- Accepts `material` parameter (e.g., `banana-flesh`)
- Returns live USDA data when API key is configured
- Falls back to local seed data if unavailable
- Never exposes API key to client

**Environment Setup:**
```bash
# Get API key from https://fdc.nal.usda.gov/api-key-signup/
# Add to .env.local (never commit this file)
USDA_API_KEY=your_key_here
```

## Data Attribution

When using USDA FoodData Central data, include this citation:

> U.S. Department of Agriculture, Agricultural Research Service. FoodData Central. [Internet]. [cited 2026-10-24]. Available from https://fdc.nal.usda.gov/

**License:** Public domain / CC0 1.0 Universal - no permission needed, attribution appreciated.

## Additional Resources

- [API Guide](https://fdc.nal.usda.gov/api-guide/)
- [API Spec (OpenAPI)](https://api.nal.usda.gov/fdc/v1/yaml-spec?api_key=DEMO_KEY)
- [Download Datasets](https://fdc.nal.usda.gov/download-datasets/)
- [API Key Signup](https://fdc.nal.usda.gov/api-key-signup/)
