export type Element = 'N' | 'P' | 'K' | 'Ca' | 'Mg' | 'S' | 'Fe' | 'Zn';
export type Value = { value: number | null; unit: 'g/100g' | 'mg/100g'; basis: 'fresh' | 'dry'; type: 'measured' | 'derived' | 'assumed' | 'proxy'; source: string; confidence: 'medium' | 'low'; reuse: 'CC0' | 'project-assumption' };
export type Material = { id: string; aliases: string[]; food: string; part: string; preparation: 'raw'; portionG: number; moisture: number | null; organicMatter: Value; organicCarbon: Value; protein: Value; minerals: Record<Exclude<Element,'N'>, Value>; nitrogenFactor: number; source: { url: string; recordId: string | null; fdcId: number | null; version: string; publication: string; reuse: string }; };
export const USDA_REPORT = 'https://www.ars.usda.gov/ARSUserFiles/80400535/Data/SR/SR28/reports/sr28fg09.pdf';
const v = (value: number | null, unit: Value['unit'] = 'mg/100g'): Value => ({ value, unit, basis: 'fresh', type: 'measured', source: USDA_REPORT, confidence: 'medium', reuse: 'CC0' });
function material(food: string, part: string, portionG: number, recordId: string | null, fdcId: number | null, protein: number | null, p: number | null, k: number | null, ca: number | null, mg: number | null, moisture: number | null): Material {
 return { id: `${food}-${part}`, aliases: [food, `${food}s`, ...(part === 'peel' ? ['skin','peels','skins'] : [])], food, part, preparation: 'raw', portionG, moisture, organicMatter: v(null,'g/100g'), organicCarbon: v(null,'g/100g'), protein: v(protein,'g/100g'), minerals: {P:v(p), K:v(k), Ca:v(ca), Mg:v(mg), S:v(null), Fe:v(null), Zn:v(null)}, nitrogenFactor: 6.25, source: {url: USDA_REPORT, recordId, fdcId, version:'USDA SR28 (2015); FDC SR Legacy cross-reference (2019-04)', publication:'2015-09', reuse: recordId ? 'USDA public domain / CC0' : 'No composition included; awaiting reusable evidence'} };
}
export const materials: Material[] = [
 material('banana','flesh',118,'09040',173944,1.09,22,358,5,27,.7491),
 material('banana','peel',60,null,null,null,null,null,null,null,null),
 material('apple','flesh',154,'09004',171689,.27,11,90,5,4,null),
 material('apple','peel',26,null,null,null,null,null,null,null,null),
 material('apple','core',20,null,null,null,null,null,null,null,null),
 material('orange','flesh',131,'09200',169097,.94,14,181,40,10,.8675),
 material('orange','peel',45,'09216',null,1.5,21,212,161,22,null),
];
// SR28 orange-peel values are compiled/estimated (NC/BFSN), not all direct measurements.
for (const m of materials.filter(m => m.id === 'orange-peel')) {
 for (const value of [m.protein, ...Object.values(m.minerals)]) { value.type = 'proxy'; value.confidence = 'low'; }
}
export const foods = ['banana','apple','orange'] as const;
export type Food = typeof foods[number];
// Household defaults: component masses sum to whole mass. These are assumptions,
// not USDA whole-fruit weights. Edible defaults: banana 118g, orange 131g;
// apple split is a project scenario, not a measured peel/core yield.
export const portionEvidence = 'portion-v1: banana flesh 118g (USDA medium); orange flesh 131g (USDA common portion). Banana peel 60g, orange peel 45g, apple flesh 154g / peel 26g / core 20g are assumed household defaults. No weighing required; editable.';
export function components(food: Food, part: string) { return materials.filter(m => m.food === food && (part === 'whole' || m.part === part)); }
