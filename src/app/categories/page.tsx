import type {Metadata} from 'next';
import {headers} from 'next/headers';
import CategoriesPage from '@/components/categories-page';
import {serverCatalog} from '@/lib/server-catalog';
import {categoryUrl} from '@/lib/urls';
import {absoluteUrl,storefrontForHost} from '@/lib/seo';
import {notFound,permanentRedirect} from 'next/navigation';
type Props={searchParams:Promise<Record<string,string|string[]|undefined>>};
export async function generateMetadata({searchParams}:Props):Promise<Metadata>{
 const params=await searchParams,host=(await headers()).get('host'),storefront=storefrontForHost(host),catalog=await serverCatalog(storefront);
 const category=catalog?.categories.find(c=>c.slug===params.category||c.id===params.category);
 const canonical=category?categoryUrl(category):'/categories';
 return {title:category?.title??'كل الأقسام',description:category?`شوف ${category.title} من المتجر الأوربي بالعراق، واختار اللون والكمية اللي تناسبك.`:'شوف أقسام ومنتجات المتجر الأوربي بالعراق.',alternates:{canonical:absoluteUrl(canonical,host)},openGraph:{url:absoluteUrl(canonical,host),title:category?.title??'كل الأقسام'},robots:params.q||params.offers||params.max||params.available||Array.isArray(params.category)?{index:false,follow:true}:undefined};
}
export default async function Page({searchParams}:Props){const params=await searchParams,storefront=storefrontForHost((await headers()).get('host')),catalog=await serverCatalog(storefront);if(catalog&&params.category){const category=catalog.categories.find(c=>c.slug===params.category||c.id===params.category);if(!category)notFound();if(category.id===params.category)permanentRedirect(categoryUrl(category));}return <CategoriesPage/>;}
