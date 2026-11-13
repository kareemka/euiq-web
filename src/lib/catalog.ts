import {supabase,isDemo} from './supabase';
import {demoCategories,demoProducts,demoSettings,demoBanners} from './demo';
import type {Category,Product,Settings,Banner} from './types';
type Storefront='adult'|'market';
export async function getCatalog(storefront:Storefront='adult'):Promise<{products:Product[];categories:Category[];settings:Settings;banners:Banner[]}> {
 if(!supabase) {
  if(isDemo) return {products:demoProducts.filter(p=>(p.storefront??'adult')===storefront),categories:demoCategories.filter(c=>(c.storefront??'adult')===storefront),settings:demoSettings,banners:demoBanners.filter(b=>(b.storefront??'adult')===storefront)};
  throw new Error('ما گدرنا نتصل بالمتجر. جرّب مرة ثانية بعدين.');
 }
 const {data,error}=await supabase.rpc('catalog_page_for_store',{p_storefront:storefront});
 if(error)throw new Error('ما گدرنا نحمّل المتجر. جرّب مرة ثانية.');
 return data as {products:Product[];categories:Category[];settings:Settings;banners:Banner[]};
}

export async function cartProducts(items:{variant_id:string}[],storefront:Storefront='adult'):Promise<Product[]> {
 if(!supabase||!items.length)return [];
 const variants=await supabase.from('product_variants').select('product_id').in('id',items.map(i=>i.variant_id));
 if(variants.error)throw variants.error;
 const ids=[...new Set((variants.data??[]).map(v=>v.product_id))];
 if(!ids.length)return [];
 const result=await supabase.rpc('catalog_products',{p_limit:100,p_ids:ids,p_filters:{storefront}});
 if(result.error)throw result.error;
 return result.data as Product[];
}
