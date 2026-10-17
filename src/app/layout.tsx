import type {Metadata,Viewport} from 'next';
import {connection} from 'next/server';
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
export const metadata:Metadata={metadataBase:new URL(siteUrl),title:{default:brandName,template:'%s | المتجر الأوربي'},description:'اختار اللي يعجبك من منتجاتنا بالعراق واطلبه بتغليف يحفظ خصوصيتك، والدفع يصير نقداً من يوصل طلبك.',applicationName:brandName,robots:{index:true,follow:true},openGraph:{type:'website',locale:'ar_IQ',siteName:brandName,images:[{url:'/assets/logo_official_black.png',alt:brandName}]},twitter:{card:'summary',title:brandName},formatDetection:{telephone:false}};
export const viewport:Viewport={width:'device-width',initialScale:1,themeColor:'#073f43'};
export default async function RootLayout({children}:{children:React.ReactNode}){await connection();const catalog=await serverCatalog();return <html lang="ar" dir="rtl" data-scroll-behavior="smooth"><body><ArabicValidation/><StoreProvider initialCatalog={catalog}>{children}</StoreProvider></body></html>}
