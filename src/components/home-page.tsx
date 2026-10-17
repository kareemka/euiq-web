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
 if(error)return <div className="wrap page"><div className="empty"><h1>{error}</h1><button className="button" onClick={()=>void reload()}>جرّب مرة ثانية</button></div></div>;
 const featured=[...products.filter(p=>p.featured),...products.filter(p=>!p.featured)].slice(0,5);
 const offers=products.filter(p=>p.compare_at_price&&p.compare_at_price>p.price);
 const steps=priceSteps(products.map(p=>p.price));
 return <div className="wrap home">
  <HeroBanner banners={banners} categories={categories} products={products}/>
  <section className="catalog-section featured-section" aria-labelledby="featured-title">
   <div className="section-heading"><h2 id="featured-title">منتجات تستاهل تشوفها</h2><Link href="/categories">شوف كل المنتجات<ArrowLeft size={17}/></Link></div>
   {loading?<div className="skeleton-grid" aria-label="دا نحمّل المنتجات">{Array.from({length:5},(_,i)=><div key={i}/>)}</div>:<CatalogGrid products={featured} emptyTitle="هسه ماكو منتجات موجودة" emptyMessage="ارجع بعدين، يمكن نضيف اختيارات جديدة."/>}
  </section>
  <section className="browse-panel" aria-labelledby="browse-title">
   <div className="section-heading"><h2 id="browse-title">دوّر حسب القسم والسعر</h2></div>
   <div className="browse-layout">
    <div className="browse-categories"><h3>أقسام المتجر</h3><CategoryNavigation categories={categories}/></div>
    {(steps.length>0||offers.length>0)&&<div className="browse-prices"><h3>فلتر حسب السعر</h3><div className="price-chips">{steps.map(step=><Link key={step} className="price-chip" href={`/categories?max=${step}`}><Coins size={23}/>لحد {money(step)}</Link>)}{offers.length>0&&<Link className="price-chip offers" href="/categories?offers=1"><Tag size={23}/>العروض والتخفيضات</Link>}</div></div>}
   </div>
  </section>
  {offers.length>0&&<Link href="/categories?offers=1" className="offers-callout"><div className="campaign-art" aria-hidden="true"/><div><h2>عروض حلوة تستاهل تشوفها</h2><p>أسعار أقل على منتجات مختارة، شوف العروض هسه.</p></div><span className="offer-link">شوف العروض<ArrowLeft size={18}/></span></Link>}
  <section className="trust-strip" aria-label="ليش تتسوّق ويانا">
   <div><ShieldCheck size={32}/><strong>خصوصيتك تهمنا</strong><span>بياناتك وتفاصيل طلبك تبقى محفوظة.</span></div>
   <div><Package size={32}/><strong>تغليف آمن</strong><span>نغلّف طلبك بطريقة تحفظ خصوصيتك.</span></div>
   <div><Truck size={32}/><strong>نوصل للمحافظات اللي نخدمها</strong><span>تابع طلبك لحد ما يوصل لبابك.</span></div>
   <div><Money size={32}/><strong>الدفع من تستلم</strong><span>حاسب كاش من تستلم طلبك.</span></div>
  </section>
 </div>;
}
