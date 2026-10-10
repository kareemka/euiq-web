export function productUrl(product:{slug?:string;title:string}) {
 return '/products/'+encodeURIComponent(product.slug??titleSlug(product.title));
}
export function categoryUrl(category:{slug?:string;title:string}) {
 return '/categories?category='+encodeURIComponent(category.slug??titleSlug(category.title));
}
export function titleSlug(title:string){return title.toLowerCase().replace(/[^a-z0-9ء-ي٠-٩]+/g,'-').replace(/^-+|-+$/g,'')||'منتج';}
export function decodeSlug(value:string){try{return decodeURIComponent(value);}catch{return value;}}
export function orderUrl(order:{slug:string}){return '/orders/'+encodeURIComponent(order.slug);}
