export function productUrl(product:{slug?:string;title:string}) {
 return '/products/'+encodeURIComponent(product.slug??titleSlug(product.title));
}
export function categoryUrl(category:{slug?:string;title:string}) {
 return '/categories?category='+encodeURIComponent(category.slug??titleSlug(category.title));
}
export function titleSlug(title:string){return title.toLowerCase().replace(/[^a-z0-9ء-ي٠-٩]+/g,'-').replace(/^-+|-+$/g,'')||'منتج';}
export function decodeSlug(value:string){try{return decodeURIComponent(value);}catch{return value;}}
export function orderUrl(order:{slug:string}){return '/orders/'+encodeURIComponent(order.slug);}
type Linkable={id:string;slug?:string;title:string};
export type BannerTarget={href:string;kind:'product'|'category'|'catalog'|'external'};
export function safeBannerExternalUrl(value?:string|null){
 if(!value||value.length>2048||/\s/.test(value))return null;
 try{const url=new URL(value);return url.protocol==='https:'&&!url.username&&!url.password?url.href:null;}catch{return null;}
}
export function bannerDelay(seconds?:number|null){return Number.isInteger(seconds)&&seconds!>=1&&seconds!<=120?seconds!*1000:6000;}
// The product wins if both are set. Unknown ids still link by id: the proxy and category page redirect them to the canonical slug.
export function bannerTarget(banner:{target_category_id:string|null;target_product_id?:string|null;target_product_slug?:string|null;external_url?:string|null},products:Linkable[],categories:Linkable[]):BannerTarget{
 const external=safeBannerExternalUrl(banner.external_url);
 if(external)return {kind:'external',href:external};
 const productId=banner.target_product_id,productSlug=banner.target_product_slug;
 if(productId||productSlug){
  const product=products.find(p=>(productId&&p.id===productId)||(productSlug&&p.slug===productSlug));
  return {kind:'product',href:product?productUrl(product):'/products/'+encodeURIComponent((productSlug||productId)!)};
 }
 if(banner.target_category_id){
  const category=categories.find(c=>c.id===banner.target_category_id);
  return {kind:'category',href:category?categoryUrl(category):'/categories?category='+encodeURIComponent(banner.target_category_id)};
 }
 return {kind:'catalog',href:'/categories'};
}
