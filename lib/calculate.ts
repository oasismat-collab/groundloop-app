import { components, type Element, type Material, type Value } from './expanded-catalogue';
import type { Interpretation } from './parser';
import type { Process } from './process';
export function freshGrams(value:Value, moisture:number|null):number|null {
 if(value.value===null) return null;
 const amount=value.value*(value.unit==='mg/100g'?.001:1)/100;
 return value.basis==='fresh'?amount:moisture===null?null:amount*(1-moisture);
}
export function returned(mass:number,concentration:number|null,retention:number|null,applied:number):number|null {
 if(!Number.isFinite(mass)||mass<=0||!Number.isFinite(applied)||applied<0||applied>1|| (retention!==null&&(!Number.isFinite(retention)||retention<0||retention>1))) throw new Error('Invalid mass or process fraction');
 return concentration===null||retention===null?null:mass*concentration*retention*applied;
}
export const elements:Element[]=['N','P','K','Ca','Mg','S','Fe','Zn'];
export function concentration(m:Material,e:Element) { const c=freshGrams(e==='N'?m.protein:m.minerals[e],m.moisture); return c===null?null:e==='N'?c/m.nitrogenFactor:c; }
export function calculate(input:Interpretation,process:Process) {
 const selected=components(input.food,input.part); const defaultMass=selected.reduce((s,m)=>s+m.portionG,0);
 const rows=selected.map(m=>({material:m,mass:input.mass*m.portionG/defaultMass}));
 const sum=(fn:(m:Material,mass:number)=>number|null)=>{const values=rows.map(r=>fn(r.material,r.mass)).filter((v):v is number=>v!==null);return values.length===0?null:values.reduce((a,b)=>a+b,0);};
 return { rows, organicMatter:sum((m,w)=>returned(w,freshGrams(m.organicMatter,m.moisture),process.organicMatter,process.applied)),carbon:sum((m,w)=>returned(w,freshGrams(m.organicCarbon,m.moisture),process.carbon,process.applied)),nutrients:Object.fromEntries(elements.map(e=>[e,sum((m,w)=>returned(w,concentration(m,e),process.retention[e],process.applied))])) as Record<Element,number|null>, inputNutrients:Object.fromEntries(elements.map(e=>[e,sum((m,w)=>{const c=concentration(m,e);return c===null?null:w*c;})])) as Record<Element,number|null> };
}
export function formatMass(g:number|null) { if(g===null)return 'Not yet quantified';if(g===0)return '0 mg';return g<1?`roughly ${Number((g*1000).toPrecision(2))} mg`:`roughly ${Number(g.toPrecision(2))} g`; }
