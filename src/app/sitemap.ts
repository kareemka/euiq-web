import type {MetadataRoute} from 'next';
import {headers} from 'next/headers';
import {serverCatalog} from '@/lib/server-catalog';
import {absoluteUrl} from '@/lib/seo';
import {productUrl,categoryUrl} from '@/lib/urls';
export const dynamic='force-dynamic';
export default async function sitemap():Promise<MetadataRoute.Sitemap>{
 const host=(await headers()).get('host');
 const catalog=await serverCatalog(true);
 if(!catalog)throw new Error('Catalog unavailable for sitemap');
 return [{url:absoluteUrl('/',host),priority:1},{url:absoluteUrl('/categories',host),priority:0.9},{url:absoluteUrl('/privacy',host),priority:0.3},...catalog.categories.map(c=>({url:absoluteUrl(categoryUrl(c),host),priority:0.8})),...catalog.products.map(p=>({url:absoluteUrl(productUrl(p),host),priority:0.7}))];
}
