'use client';

import Link from 'next/link';
import {ArrowLeft,ShieldCheck,Package,Truck,Money,Tag,Coins} from '@phosphor-icons/react';
import {money,priceSteps} from '@/lib/domain';
import {useStore} from './store-provider';
import {HeroBanner} from './hero-banner';
import {CatalogGrid} from './catalog-grid';
import {CategoryNavigation} from './category-navigation';

export default function Home(){
 const {products,categories,banners,loading,error,reload}=useStore();
 if(error)return <div className="wrap page"><div className="empty"><h1>{error}</h1><button className="button" onClick={()=>void reload()}>إعادة المحاولة</button></div></div>;
 const featured=[...products.filter(p=>p.featured),...products.filter(p=>!p.featured)].slice(0,5);
 const offers=products.filter(p=>p.compare_at_price&&p.compare_at_price>p.price);
 const steps=priceSteps(products.map(p=>p.price));
 return <div className="wrap home">
  <HeroBanner banners={banners} categories={categories} products={products}/>
  <section className="catalog-section featured-section" aria-labelledby="featured-title">
   <div className="section-heading"><h2 id="featured-title">منتجات مختارة</h2><Link href="/categories">عرض جميع المنتجات<ArrowLeft size={17}/></Link></div>
   {loading?<div className="skeleton-grid" aria-label="جارٍ تحميل المنتجات">{Array.from({length:5},(_,i)=><div key={i}/>)}</div>:<CatalogGrid products={featured} emptyTitle="لا توجد منتجات متاحة حالياً" emptyMessage="عد لاحقاً للاطلاع على الاختيارات الجديدة."/>}
  </section>
  <section className="browse-panel" aria-labelledby="browse-title">
   <div className="section-heading"><h2 id="browse-title">تصفّح حسب القسم والسعر</h2></div>
   <div className="browse-layout">
    <div className="browse-categories"><h3>الأقسام الشائعة</h3><CategoryNavigation categories={categories}/></div>
    {(steps.length>0||offers.length>0)&&<div className="browse-prices"><h3>التصفية حسب السعر</h3><div className="price-chips">{steps.map(step=><Link key={step} className="price-chip" href={`/categories?max=${step}`}><Coins size={23}/>حتى {money(step)}</Link>)}{offers.length>0&&<Link className="price-chip offers" href="/categories?offers=1"><Tag size={23}/>العروض والخصومات</Link>}</div></div>}
   </div>
  </section>
  {offers.length>0&&<Link href="/categories?offers=1" className="offers-callout"><div className="campaign-art" aria-hidden="true"/><div><h2>عروض تستحق الاهتمام</h2><p>منتجات مختارة بأسعار مميزة، اكتشف العروض المتاحة.</p></div><span className="offer-link">اكتشف العروض<ArrowLeft size={18}/></span></Link>}
  <section className="trust-strip" aria-label="لماذا تتسوّق معنا">
   <div><ShieldCheck size={32}/><strong>خصوصيتك أولويتنا</strong><span>بياناتك وتفاصيل طلبك محفوظة.</span></div>
   <div><Package size={32}/><strong>تغليف آمن</strong><span>تغليف يحافظ على خصوصيتك.</span></div>
   <div><Truck size={32}/><strong>توصيل للمحافظات المتاحة</strong><span>تابع حالة طلبك حتى يوصل لبابك.</span></div>
   <div><Money size={32}/><strong>الدفع عند الاستلام</strong><span>ادفع نقداً عند استلام طلبك.</span></div>
  </section>
 </div>;
}
