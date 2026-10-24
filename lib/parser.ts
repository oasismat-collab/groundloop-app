import { foods, components, type Food } from './catalogue';
export type Interpretation = {food:Food; part:string; quantity:number; grams:number|null; mass:number; label:string};
const numbers: Record<string,number> = {a:1,an:1,one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10,half:.5,quarter:.25,'one-third':1/3,'a third':1/3,'one third':1/3,'a half':.5,'a quarter':.25};
export function parse(input:string): Interpretation {
 const text = input.toLowerCase().trim().replace(/\bskins?\b/g,'peel').replace(/\bpeels\b/g,'peel').replace(/\bcores\b/g,'core');
 if (!text || text.length>200) throw new Error('Try a short phrase, such as “one banana” or “two orange peels”.');
 const found = foods.filter(f => new RegExp(`\\b${f}s?\\b`).test(text));
 if(found.length!==1) throw new Error('Try one fruit at a time: banana, apple or orange. For example, “two orange peels”.');
 if(/\b(juice|cooked|dried|smoothie|cake|bread|rotten|mouldy|moldy)\b/.test(text)) throw new Error('This catalogue covers raw fruit only. Try “banana flesh” or “orange peel”.');
 const food=found[0];
 const parts = ['peel','core','flesh'].filter(p=>new RegExp(`\\b${p}\\b`).test(text));
 if(parts.length>1 || (/\bwhole\b/.test(text)&&parts.length)) throw new Error('Choose whole fruit, flesh, peel or core as a single portion.');
 const part = /\b(without peel|without skin|peeled)\b/.test(text) ? 'flesh' : parts[0] || 'whole';
 if(!components(food,part).length) throw new Error(`We do not yet have ${food} ${part}. Try “${food} peel” or “${food} flesh”.`);
 const g = text.match(/(\d+(?:\.\d+)?)\s*(?:g|grams?)\b/);
 const fraction=text.match(/\b(\d+)\s*\/\s*(\d+)\b/);
 const word=Object.keys(numbers).sort((a,b)=>b.length-a.length).find(w=>new RegExp(`\\b${w}\\b`).test(text));
 const numeric=text.match(/\b\d+(?:\.\d+)?\b/);
 const quantity=g ? 1 : fraction ? Number(fraction[1])/Number(fraction[2]) : word ? numbers[word] : numeric ? Number(numeric[0]) : 1;
 if(!Number.isFinite(quantity)||quantity<=0||quantity>10000||/-\s*\d/.test(text)) throw new Error('Please use a positive portion up to 10,000 fruits or grams.');
 const grams=g?Number(g[1]):null;
 if(grams!==null&&(grams<=0||grams>10000)) throw new Error('Please enter between 0 and 10,000 grams.');
 // Reject unmatched prose rather than guessing a composite food or quantity.
 let remainder=text.replace(new RegExp(`\\b${food}s?\\b`,'g'),'').replace(/\b(without peel|without skin|including|with|its|the|of|medium|small|large|whole|raw|peeled|peel|core|flesh|fruit|and)\b/g,'');
 if(g) remainder=remainder.replace(g[0],'');
 if(fraction) remainder=remainder.replace(fraction[0],'');
 for(const w of Object.keys(numbers).sort((a,b)=>b.length-a.length)) remainder=remainder.replace(new RegExp(`\\b${w}\\b`,'g'),'');
 remainder=remainder.replace(/\d+(?:\.\d+)?/g,'').replace(/[\s.,]/g,'');
 if(remainder) throw new Error('I couldn’t confidently interpret that. Try “half an apple”, “100 g banana flesh” or “a banana skin”.');
 const mass=grams??components(food,part).reduce((sum,m)=>sum+m.portionG,0)*quantity;
 const q=Number(quantity.toFixed(2));
 const label=grams!==null?`${grams} g ${food} ${part === 'whole' ? '(whole fruit)' : part}`:`${q} ${part==='whole'?'medium ':''}${food}${quantity>1?'s':''}${part==='whole'?', including '+(food==='apple'?'peel and core':'its peel'): ' '+part}`;
 return {food,part,quantity,grams,mass,label};
}
