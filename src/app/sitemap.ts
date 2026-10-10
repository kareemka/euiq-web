import type {MetadataRoute} from 'next';
import {serverCatalog} from '@/lib/server-catalog';
import {absoluteUrl} from '@/lib/seo';
import {productUrl,categoryUrl} from '@/lib/urls';
export const dynamic='force-dynamic';
export default async function sitemap():Promise<MetadataRoute.Sitemap>{
 const catalog=await serverCatalog(true);
 if(!catalog)throw new Error('Catalog unavailable for sitemap');
 return [{url:absoluteUrl('/'),priority:1},{url:absoluteUrl('/categories'),priority:0.9},{url:absoluteUrl('/privacy'),priority:0.3},...catalog.categories.map(c=>({url:absoluteUrl(categoryUrl(c)),priority:0.8})),...catalog.products.map(p=>({url:absoluteUrl(productUrl(p)),priority:0.7}))];
}
