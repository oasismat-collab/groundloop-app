# Source register, reuse and evidence gaps

Dataset version: `fruit-seed-v1`, reviewed 2026-10-24. All composition is per 100 g raw fresh material. Individual values carry units, basis, type, source, reuse and confidence; null is unknown. Source metadata is attached to each material. Confidence labels are qualitative curation flags, not statistical intervals.

## Included source records

Primary verification: [USDA Standard Reference Release 28 fruit report (2015)](https://www.ars.usda.gov/ARSUserFiles/80400535/Data/SR/SR28/reports/sr28fg09.pdf). PDF page numbers below are one-based. This is the frozen seed version; FDC cross-references identify later SR Legacy records, not a claim that every later record has been synchronized.

| Material | NDB record | FDC cross-reference | PDF page | Protein g | P mg | K mg | Ca mg | Mg mg |
|---|---|---|---|---|---|---|---|---|
| Banana flesh | 09040 | 173944 | 147 | 1.09 | 22 | 358 | 5 | 27 |
| Apple flesh, without skin | 09004 | 171689 | 64 | 0.27 | 11 | 90 | 5 | 4 |
| Orange flesh, commercial varieties | 09200 | 169097 | 599 | 0.94 | 14 | 181 | 40 | 10 |
| Orange peel, raw | 09216 | not pinned | 589 | 1.50 | 21 | 212 | 161 | 22 |

USDA data is public domain / CC0; see [FoodData Central API guide](https://fdc.nal.usda.gov/api-guide/) and [downloads](https://fdc.nal.usda.gov/download-datasets/). The seed transcription is independently verified against the USDA report, rather than copied from third-party nutrition sites. SR28 is a compilation: the flesh values are treated as measured source averages at medium confidence, and orange-peel values as compiled/proxy values at low confidence (source derivation codes include NC/BFSN). Confirm analyte-specific derivation codes against the current USDA source during production review. Nitrogen is derived from protein / 6.25 as a rough fallback, not a direct total-N measurement.

Banana flesh moisture: 0.7491; orange flesh: 0.8675 (mass fraction, fresh basis, USDA report). Other moisture values are intentionally null in the reviewed seed. Dry-matter fraction is derived as 1 − moisture when needed. No USDA carbohydrate or fibre field is used for organic carbon or organic matter. Ash and total organic carbon are not populated in this release.

Banana flesh 118 g and orange flesh 131 g use USDA medium/common edible portion conventions. Banana peel 60 g, orange peel 45 g and apple components (154 g flesh, 26 g peel, 20 g core) are **assumed household defaults**, not measured refuse yields. Whole masses are their sums. Orange peel excludes a separate seed contribution in this simple model; portions and seed accounting need validation. Grams entered for whole fruit are distributed using the same proportions. “Small” and “large” are accepted but still use the visible medium default; users can adjust grams.

Banana peel, apple peel and apple core contain **no composition data**. An apple flesh record without skin is never used as peel/core data. Unknown component composition propagates to a whole-fruit total. No apple pomace or mixed citrus pulp is substituted.

## Sources researched but not promoted to production factors

- [Feedipedia banana peel](https://www.feedipedia.org/node/684) and [copyright terms](https://www.feedipedia.org/content/copyright): commercial reuse requests directed to AFZ. No numerical Feedipedia records are included. Obtain permission before introducing restricted values; do not bulk scrape. Feedtables is also a candidate, not an approved source in this dataset.
- [Mass and element balance in food waste composting facilities (2010)](https://pubmed.ncbi.nlm.nih.gov/20236815/): useful food/bulking-agent attribution research, but not a transferable per-fruit factor or an approved reusable dataset here.
- [Grape Skin Composting Process to Recycle Food Waste (2024)](https://pmc.ncbi.nlm.nih.gov/articles/PMC10968801/), CC BY 4.0: reusable research candidate, but grape skin and its experimental mixtures do not represent banana, apple or orange scraps. No values are imported.
- [Assessing the climate change mitigation potential from food waste composting (2023)](https://www.nature.com/articles/s41598-023-34174-z): process-emissions research, not a per-banana carbon-return factor. No values are imported.
- [EPA benefits](https://www.epa.gov/sustainable-management-food/benefits-using-compost) and [composting guidance](https://www.epa.gov/sustainable-management-food/composting): support qualitative functions only; no universal numerical conversion factors.

## Process register

`evidence-v1`: managed aerobic composting, all retention factors unknown. Application fraction 100% is the scenario boundary, not an empirical observation.

`illustrative-v1`: project-brief demonstration assumptions N 0.50, P 0.80, K 0.80, applied 1.00. These are assumed, low-confidence, reusable project parameters with no published validation claimed. Other nutrient, organic-matter and carbon retention remains null. Neither mode estimates moisture in finished compost, long-term soil carbon, avoided emissions, fertilizer displacement or growing-water recovery.
