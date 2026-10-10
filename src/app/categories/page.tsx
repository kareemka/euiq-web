import type {Metadata} from 'next';
import CategoriesPage from '@/components/categories-page';
import {serverCatalog} from '@/lib/server-catalog';
import {categoryUrl} from '@/lib/urls';
import {notFound,permanentRedirect} from 'next/navigation';
type Props={searchParams:Promise<Record<string,string|string[]|undefined>>};
export async function generateMetadata({searchParams}:Props):Promise<Metadata>{
 const params=await searchParams,catalog=await serverCatalog();
 const category=catalog?.categories.find(c=>c.slug===params.category||c.id===params.category);
 const canonical=category?categoryUrl(category):'/categories';
 return {title:category?.title??'جميع الأقسام',description:category?`تسوّق ${category.title} من المتجر الأوربي في العراق، واختر اللون والكمية المناسبة.`:'تصفّح أقسام ومنتجات المتجر الأوربي في العراق.',alternates:{canonical},openGraph:{url:canonical,title:category?.title??'جميع الأقسام'},robots:params.q||params.offers||params.max||params.available||Array.isArray(params.category)?{index:false,follow:true}:undefined};
}
export default async function Page({searchParams}:Props){const params=await searchParams,catalog=await serverCatalog();if(catalog&&params.category){const category=catalog.categories.find(c=>c.slug===params.category||c.id===params.category);if(!category)notFound();if(category.id===params.category)permanentRedirect(categoryUrl(category));}return <CategoriesPage/>;}
