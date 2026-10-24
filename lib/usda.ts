import { materials } from './catalogue';
export async function lookupUSDA(id:string, key:string|undefined, fetcher:typeof fetch=fetch) {
 const seed=materials.find(m=>m.id===id);
 if(!seed) return {status:400,body:{error:'Choose a supported catalogue material.'}};
 const fallback=(reason:string)=>({status:200,body:{mode:'local-seed',reason,material:seed}});
 if(!key) return fallback('No server API key configured. Using versioned local seed.');
 if(!seed.source.fdcId) return fallback('No verified FDC cross-reference; using the local source record where available.');
 try {
 const url=new URL(`https://api.nal.usda.gov/fdc/v1/food/${seed.source.fdcId}`);url.searchParams.set('api_key',key);
 const response=await fetcher(url,{signal:AbortSignal.timeout(8000),next:{revalidate:86400}});
 if(!response.ok) return fallback('USDA is unavailable. Using versioned local seed.');
 const data=await response.json();
 if(data.fdcId!==seed.source.fdcId||data.dataType!=='SR Legacy'||!Array.isArray(data.foodNutrients)) return fallback('Unexpected USDA record. Local seed retained.');
 // This is a read-through source-inspection endpoint. Live values do not silently
 // mutate the reviewed calculation catalogue or bypass a composition review.
 return {status:200,body:{mode:'live-usda',fdcId:data.fdcId,description:data.description,dataType:data.dataType,publicationDate:data.publicationDate,nutrients:data.foodNutrients.map((n:{nutrient?:{id?:number;name?:string;unitName?:string};amount?:number})=>({id:n.nutrient?.id,name:n.nutrient?.name,unit:n.nutrient?.unitName,amount:n.amount??null})),calculationMaterial:seed,notice:'Calculations use the reviewed local seed. Live USDA data is for source comparison.'}};
 }catch {return fallback('USDA request failed or timed out. Using versioned local seed.');}
}
