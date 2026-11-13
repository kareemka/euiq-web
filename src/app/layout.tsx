import type {Metadata,Viewport} from 'next';
import {connection} from 'next/server';
import {headers} from 'next/headers';
import '@fontsource/noto-sans-arabic/400.css';
import '@fontsource/noto-sans-arabic/500.css';
import '@fontsource/noto-sans-arabic/600.css';
import '@fontsource/noto-sans-arabic/700.css';
import './globals.css';
import './reference-design.css';
import {ArabicValidation} from '@/components/arabic-validation';
import {StoreProvider} from '@/components/store-provider';
import {serverCatalog} from '@/lib/server-catalog';
import {siteUrl,brandName} from '@/lib/seo';
const marketName='EUIQ Market';
const marketArabic='سوق EUIQ';
function isMarketHost(host:string|null){return host?.split(':')[0].toLowerCase()==='market.euiq.store'}
export async function generateMetadata():Promise<Metadata>{
 const market=isMarketHost((await headers()).get('host'));
 const name=market?marketName:brandName;
 const title=market?marketArabic:brandName;
 const origin=market?'https://market.euiq.store':siteUrl;
 return {metadataBase:new URL(origin),title:{default:title,template:`%s | ${market?marketArabic:'المتجر الأوربي'}`},description:market?'تسوّق منتجات مختارة من EUIQ Market.': 'اختار اللي يعجبك من منتجاتنا بالعراق واطلبه بتغليف يحفظ خصوصيتك، والدفع يصير نقداً من يوصل طلبك.',applicationName:name,icons:{icon:market?'/market-icon.svg':'/euiq-icon.png'},robots:{index:true,follow:true},openGraph:{type:'website',locale:'ar_IQ',siteName:name,images:[{url:market?'/market-icon.svg':'/assets/logo_official_black.png',alt:name}]},twitter:{card:'summary',title},formatDetection:{telephone:false}};
}
export const viewport:Viewport={width:'device-width',initialScale:1,themeColor:'#073f43'};
export default async function RootLayout({children}:{children:React.ReactNode}){await connection();const market=isMarketHost((await headers()).get('host'));const catalog=await serverCatalog();return <html lang="ar" dir="rtl" data-scroll-behavior="smooth"><body><ArabicValidation/><StoreProvider initialCatalog={catalog} isMarket={market}>{children}</StoreProvider></body></html>}
