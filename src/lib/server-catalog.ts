import 'server-only';
import {cache} from 'react';
import type {CatalogData} from './types';

// Public catalog only: no customer cookies, session or service-role credentials.
export const serverCatalog = cache(async (all=false):Promise<CatalogData|null> => {
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
 if(!url||!key)return null;
 try {
  const response=await fetch(new URL('/rest/v1/rpc/'+(all?'catalog_data':'catalog_page'),url),{method:'POST',headers:{apikey:key,Authorization:`Bearer ${key}`,'Content-Type':'application/json'},body:'{}',next:{revalidate:60},signal:AbortSignal.timeout(12000)});
  if(!response.ok)return null;
  const data=await response.json();
  if(!Array.isArray(data.products)||!Array.isArray(data.categories)||!data.settings)return null;
  return data as CatalogData;
 }catch{return null;}
});
export const serverProduct=cache(async (slug:string)=>{
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
 if(!url||!key)return null;
 try{const response=await fetch(new URL('/rest/v1/rpc/catalog_products',url),{method:'POST',headers:{apikey:key,Authorization:`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify({p_limit:1,p_filters:{slug}}),next:{revalidate:60},signal:AbortSignal.timeout(12000)});if(!response.ok)return null;return (await response.json())[0] as CatalogData['products'][number]??null;}catch{return null;}
});
