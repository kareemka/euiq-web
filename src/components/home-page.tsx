'use client';
import Link from 'next/link';
import {categoryUrl} from '@/lib/urls';
import {HeroBanner} from './hero-banner';
import {ArrowLeft,ShieldCheck,Heart,Drop,Gift,Sparkle,Diamond,MagnifyingGlass} from '@phosphor-icons/react';
import {useStore} from '@/components/store-provider';
import {CatalogGrid} from '@/components/catalog-grid';
export default function Home(){const {products,categories,banners,loading,error,reload}=useStore();const icons:Record<string,typeof Gift>={heart:Heart,drop:Drop,gift:Gift,sparkle:Sparkle,diamond:Diamond};
 if(error)return <div className="empty"><h1>{error}</h1><button className="button" onClick={()=>void reload()}>إعادة المحاولة</button></div>;
 return <div className="wrap home"><form action="/categories" className="search-bar" role="search" aria-label="البحث عن المنتجات"><MagnifyingGlass size={24}/><input type="search" name="q" aria-label="ابحث في المتجر" placeholder="ما الذي تبحث عنه اليوم؟"/><button aria-label="بحث" type="submit"><span>بحث</span><ArrowLeft size={20}/></button></form>
 <HeroBanner banners={banners} categories={categories}/>
 <section className="category-strip" aria-label="تصفح الأقسام"><Link href="/categories" className="category-tile all"><span><Sparkle size={31}/></span><strong>كل الاختيارات</strong><small>اكتشف ما يناسبك</small></Link>{categories.map(c=>{const Icon=icons[c.icon]||Gift;return <Link className="category-tile" key={c.id} href={categoryUrl(c)}><span>{c.image_url?<img src={c.image_url} alt=""/>:<Icon size={31} weight="duotone"/>}</span><strong>{c.title}</strong></Link>})}</section>
 <div className="browse-note"><ShieldCheck size={24}/><div><strong>تصفّح براحتك، خصوصيتك محفوظة.</strong><span>جميع المنتجات والأسعار متاحة للتصفح. سجّل دخولك عندما تكون مستعداً للشراء.</span></div><Link href="/privacy">اعرف المزيد <ArrowLeft size={16}/></Link></div>
 <section className="catalog-section"><div className="section-heading"><div><span className="eyebrow">اختيارات المتجر</span><h2>منتجات مختارة</h2></div><Link href="/categories">عرض الكل<ArrowLeft size={18}/></Link></div>{loading?<div className="skeleton-grid" aria-label="جارٍ تحميل المنتجات">{[1,2,3,4].map(i=><div key={i}/>)}</div>:<CatalogGrid products={(products.some(p=>p.featured)?products.filter(p=>p.featured):products).slice(0,4)} emptyTitle="لا توجد منتجات متاحة حالياً" emptyMessage="عد لاحقاً للاطلاع على الاختيارات الجديدة."/>}</section>
 {products.some(p=>p.compare_at_price)&&<section className="catalog-section offers-section"><div className="section-heading"><div><span className="eyebrow">فرصة لاختيارك القادم</span><h2>عروض تستحق الاهتمام</h2></div><Link href="/categories?offers=1">جميع العروض<ArrowLeft size={18}/></Link></div><CatalogGrid products={products.filter(p=>p.compare_at_price).slice(0,4)}/></section>}
 <section className="editorial-banner"><ShieldCheck size={42} weight="duotone"/><div><h2>من اختيارك، إلى باب منزلك.</h2><p>تغليف يحفظ خصوصيتك، ومتابعة واضحة لكل خطوة من طلبك.</p></div><Link className="button secondary" href="/categories">ابدأ التسوّق<ArrowLeft size={20}/></Link></section>
 {categories.filter(c=>products.some(p=>p.category_id===c.id)).slice(0,2).map(c=><section className="catalog-section" key={c.id}><div className="section-heading"><h2>{c.title}</h2><Link href={categoryUrl(c)}>عرض القسم<ArrowLeft size={18}/></Link></div><CatalogGrid products={products.filter(p=>p.category_id===c.id).slice(0,4)}/></section>)}
 </div>
}

