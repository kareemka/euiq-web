import {supabase,isDemo} from './supabase';
import {demoCategories,demoProducts,demoSettings,demoBanners} from './demo';
import type {Category,Product,Settings,Banner} from './types';
export async function getCatalog():Promise<{products:Product[];categories:Category[];settings:Settings;banners:Banner[]}> {
 if(!supabase) {
  if(isDemo) return {products:demoProducts,categories:demoCategories,settings:demoSettings,banners:demoBanners};
  throw new Error('تعذر الاتصال بالمتجر، يرجى المحاولة لاحقًا');
 }
 const {data,error}=await supabase.rpc('catalog_page');
 if(error)throw new Error('تعذر تحميل المتجر، حاول مرة أخرى');
 return data as {products:Product[];categories:Category[];settings:Settings;banners:Banner[]};
}

export async function cartProducts(items:{variant_id:string}[]):Promise<Product[]> {
 if(!supabase||!items.length)return [];
 const variants=await supabase.from('product_variants').select('product_id').in('id',items.map(i=>i.variant_id));
 if(variants.error)throw variants.error;
 const ids=[...new Set((variants.data??[]).map(v=>v.product_id))];
 if(!ids.length)return [];
 const result=await supabase.rpc('catalog_products',{p_limit:100,p_ids:ids});
 if(result.error)throw result.error;
 return result.data as Product[];
}
