import type {Metadata} from 'next';
import {headers} from 'next/headers';
import {notFound,permanentRedirect} from 'next/navigation';
import ProductDetail from '@/components/product-detail';
import {serverCatalog,serverProduct} from '@/lib/server-catalog';
import {productUrl,decodeSlug} from '@/lib/urls';
import {absoluteUrl,jsonLd} from '@/lib/seo';
type Props={params:Promise<{slug:string}>};
async function findProduct(params:Props['params']){const {slug}=await params;const catalog=await serverCatalog();return {catalog,product:await serverProduct(decodeSlug(slug))};}
export async function generateMetadata({params}:Props):Promise<Metadata>{const {product:p}=await findProduct(params);if(!p)return {title:'المنتج غير متوفر',robots:{index:false}};return {title:p.title,description:(p.summary||p.details||p.title).slice(0,160),alternates:{canonical:productUrl(p)},openGraph:{title:p.title,description:p.summary,url:productUrl(p),images:p.images.map(url=>({url,alt:p.title}))},twitter:{card:'summary_large_image',title:p.title,description:p.summary,images:p.images}};}
export default async function Page({params}:Props){
 const {catalog,product:p}=await findProduct(params);
 if(!catalog)return <ProductDetail params={params}/>;
 if(!p)notFound();
 const {slug}=await params;if(p.id===slug)permanentRedirect(productUrl(p));
 const nonce=(await headers()).get('x-nonce')??undefined;
 const data={'@context':'https://schema.org','@type':'Product',name:p.title,description:p.summary||p.details,image:p.images,offers:{'@type':'Offer',url:absoluteUrl(productUrl(p)),priceCurrency:'IQD',price:p.price,availability:p.product_variants.some(v=>v.active&&v.stock_on_hand>v.reserved)?'https://schema.org/InStock':'https://schema.org/OutOfStock',itemCondition:'https://schema.org/NewCondition'}};
 return <><script type="application/ld+json" nonce={nonce} dangerouslySetInnerHTML={{__html:jsonLd(data)}}/><ProductDetail params={params} initialProduct={p}/></>;
}
