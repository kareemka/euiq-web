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
export type BannerTarget={href:string;kind:'product'|'category'|'catalog'};
// The product wins if both are set. Unknown ids still link by id: the proxy and category page redirect them to the canonical slug.
export function bannerTarget(banner:{target_category_id:string|null;target_product_id?:string|null;target_product_slug?:string|null},products:Linkable[],categories:Linkable[]):BannerTarget{
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
