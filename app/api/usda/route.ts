import { lookupUSDA } from '@/lib/usda';
export async function GET(request:Request){const id=new URL(request.url).searchParams.get('material')??'banana-flesh';const result=await lookupUSDA(id,process.env.USDA_API_KEY);return Response.json(result.body,{status:result.status,headers:{'Cache-Control':'private, no-store'}});}
