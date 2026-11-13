export const siteUrl = 'https://euiq.store';
export const brandName = 'المتجر الأوربي في العراق';
export type Storefront = 'adult'|'market';
export const storefrontForHost = (host:string|null):Storefront => host?.split(':')[0].toLowerCase()==='market.euiq.store'?'market':'adult';
export const siteOrigin = (host:string|null) => storefrontForHost(host)==='market'?'https://market.euiq.store':siteUrl;
export const absoluteUrl = (path:string,host?:string|null) => new URL(path,host===undefined?siteUrl:siteOrigin(host)).toString();
export function jsonLd(value:unknown){return JSON.stringify(value).replace(/</g,'\\u003c');}
