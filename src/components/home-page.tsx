'use client';
import Link from 'next/link';
import {categoryUrl} from '@/lib/urls';
import {money,priceSteps} from '@/lib/domain';
import {HeroBanner} from './hero-banner';
import {ArrowLeft,ShieldCheck,Heart,Drop,Gift,Sparkle,Diamond,MagnifyingGlass,Package,Truck,Money,Tag} from '@phosphor-icons/react';
import {useStore} from '@/components/store-provider';
import {CatalogGrid} from '@/components/catalog-grid';
import type {Product} from '@/lib/types';
// Full rows of four: eight featured products when available, otherwise four (topped up with other products).
function featuredPicks(products:Product[]){const featured=products.filter(p=>p.featured);return featured.length>=4?featured.slice(0,featured.length>=8?8:4):[...featured,...products.filter(p=>!p.featured)].slice(0,4);}
export default function Home(){const {products,categories,banners,loading,error,reload}=useStore();const icons:Record<string,typeof Gift>={heart:Heart,drop:Drop,gift:Gift,sparkle:Sparkle,diamond:Diamond};
 if(error)return <div className="empty"><h1>{error}</h1><button className="button" onClick={()=>void reload()}>إعادة المحاولة</button></div>;
 const offers=products.filter(p=>p.compare_at_price),steps=priceSteps(products.map(p=>p.price));
 return <div className="wrap home">
 <HeroBanner banners={banners} categories={categories} products={products}/>
 <section className="catalog-section" aria-labelledby="featured-title"><div className="section-heading"><div><span className="eyebrow">اختيارات المتجر</span><h2 id="featured-title">منتجات مختارة</h2></div><Link href="/categories">عرض الكل<ArrowLeft size={18}/></Link></div>{loading?<div className="skeleton-grid" aria-label="جارٍ تحميل المنتجات">{Array.from({length:8},(_,i)=><div key={i}/>)}</div>:<CatalogGrid products={featuredPicks(products)} emptyTitle="لا توجد منتجات متاحة حالياً" emptyMessage="عد لاحقاً للاطلاع على الاختيارات الجديدة."/>}</section>
 <section className="browse-panel" aria-labelledby="browse-title">
  <div className="browse-head"><div><span className="eyebrow">اختر بطريقتك</span><h2 id="browse-title">تصفّح حسب القسم والسعر</h2></div><form action="/categories" className="search-bar" role="search" aria-label="البحث عن المنتجات"><MagnifyingGlass size={22}/><input type="search" name="q" aria-label="ابحث في المتجر" placeholder="ما الذي تبحث عنه اليوم؟"/><button type="submit">بحث<ArrowLeft size={18}/></button></form></div>
  <div className="browse-group"><h3>الأقسام</h3><div className="category-chips"><Link href="/categories" className="category-chip all"><span><Sparkle size={24}/></span>كل الأقسام</Link>{categories.map(c=>{const Icon=icons[c.icon]||Gift;return <Link className="category-chip" key={c.id} href={categoryUrl(c)}><span>{c.image_url?<img src={c.image_url} alt=""/>:<Icon size={24} weight="duotone"/>}</span>{c.title}</Link>})}</div></div>
  {(steps.length>0||offers.length>0)&&<div className="browse-group"><h3>حسب السعر</h3><div className="price-chips">{steps.map(step=><Link key={step} className="price-chip" href={`/categories?max=${step}`}>حتى {money(step)}</Link>)}{offers.length>0&&<Link className="price-chip offers" href="/categories?offers=1"><Tag size={18}/>العروض والخصومات</Link>}</div></div>}
 </section>
 {offers.length>0&&<section className="catalog-section offers-section" aria-labelledby="offers-title"><div className="section-heading"><div><span className="eyebrow">فرصة لاختيارك القادم</span><h2 id="offers-title">عروض تستحق الاهتمام</h2></div><Link href="/categories?offers=1">جميع العروض<ArrowLeft size={18}/></Link></div><CatalogGrid products={offers.slice(0,4)}/></section>}
 {categories.filter(c=>products.some(p=>p.category_id===c.id)).slice(0,2).map(c=><section className="catalog-section" key={c.id}><div className="section-heading"><h2>{c.title}</h2><Link href={categoryUrl(c)}>عرض القسم<ArrowLeft size={18}/></Link></div><CatalogGrid products={products.filter(p=>p.category_id===c.id).slice(0,4)}/></section>)}
 <section className="trust-strip" aria-label="لماذا تتسوّق معنا"><div><ShieldCheck size={28} weight="duotone"/><strong>خصوصية تامة</strong><span>تصفّح براحتك، وسجّل دخولك عندما تكون مستعداً للشراء.</span></div><div><Package size={28} weight="duotone"/><strong>تغليف آمن</strong><span>تغليف يحفظ خصوصيتك دون أي إشارة لمحتوى الطلب.</span></div><div><Truck size={28} weight="duotone"/><strong>توصيل داخل العراق</strong><span>متابعة واضحة لكل خطوة من طلبك.</span></div><div><Money size={28} weight="duotone"/><strong>الدفع عند الاستلام</strong><span>ادفع نقداً عند وصول طلبك.</span></div></section>
 <section className="editorial-banner"><ShieldCheck size={42} weight="duotone"/><div><h2>من اختيارك، إلى باب منزلك.</h2><p>جميع المنتجات والأسعار متاحة للتصفح، وخصوصيتك محفوظة في كل خطوة.</p></div><Link className="button" href="/categories">ابدأ التسوّق<ArrowLeft size={20}/></Link><Link className="button secondary" href="/privacy">اعرف المزيد</Link></section>
 </div>
}
