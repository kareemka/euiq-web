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
import {siteUrl,brandName,marketBrandName,marketDescription,storefrontForHost} from '@/lib/seo';
export async function generateMetadata():Promise<Metadata>{
 const market=storefrontForHost((await headers()).get('host'))==='market';
 const name=market?marketBrandName:brandName;
 const title=market?marketBrandName:brandName;
 const origin=market?'https://market.euiq.store':siteUrl;
 return {metadataBase:new URL(origin),title:{default:title,template:`%s | ${market?marketBrandName:'المتجر الأوربي'}`},description:market?marketDescription: 'اختار اللي يعجبك من منتجاتنا بالعراق واطلبه بتغليف يحفظ خصوصيتك، والدفع يصير نقداً من يوصل طلبك.',applicationName:name,icons:{icon:market?'/assets/esi-logo.jpg':'/euiq-icon.png'},robots:{index:true,follow:true},openGraph:{type:'website',locale:'ar_IQ',siteName:name,description:market?marketDescription:undefined,images:[{url:market?'/assets/esi-logo.jpg':'/assets/logo_official_black.png',alt:name}]},twitter:{card:'summary',title,description:market?marketDescription:undefined},formatDetection:{telephone:false}};
}
export async function generateViewport():Promise<Viewport>{const market=storefrontForHost((await headers()).get('host'))==='market';return {width:'device-width',initialScale:1,maximumScale:5,themeColor:market?'#034D54':'#073f43',colorScheme:'light'};}
export default async function RootLayout({children}:{children:React.ReactNode}){await connection();const storefront=storefrontForHost((await headers()).get('host'));const catalog=await serverCatalog(storefront);return <html lang="ar" dir="rtl" data-storefront={storefront} data-scroll-behavior="smooth"><body><ArabicValidation/><StoreProvider initialCatalog={catalog} storefront={storefront}>{children}</StoreProvider></body></html>}
