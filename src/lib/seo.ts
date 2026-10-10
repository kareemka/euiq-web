export const siteUrl = 'https://euiq.store';
export const brandName = 'المتجر الأوربي في العراق';
export const absoluteUrl = (path:string) => new URL(path,siteUrl).toString();
export function jsonLd(value:unknown){return JSON.stringify(value).replace(/</g,'\\u003c');}
