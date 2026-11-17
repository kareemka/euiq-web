'use client';

import Link from 'next/link';
import {ArrowLeft,Package,Truck,Money,Tag,Coins} from '@phosphor-icons/react';
import {money,priceSteps} from '@/lib/domain';
import {useStore} from './store-provider';
import {HeroBanner} from './hero-banner';
import {CatalogGrid} from './catalog-grid';
import {CategoryNavigation} from './category-navigation';
import {ProductGridLoading} from './store-loading';

export default function Home(){
 const {products,categories,banners,loading,error,reload,storefront}=useStore();
 if(error)return <div className="wrap page"><div className="empty"><h1>ما گدرنا نحمّل المتجر</h1><p>{error}</p><button className="button" onClick={()=>void reload()}>جرّب مرة ثانية</button></div></div>;
 const featured=[...products.filter(p=>p.featured),...products.filter(p=>!p.featured)].slice(0,8);
 const offers=products.filter(p=>p.compare_at_price&&p.compare_at_price>p.price);
 const steps=priceSteps(products.map(p=>p.price));

 return <div className={`wrap home${storefront==='market'?' market-home':''}`}>
  <h1 className="visually-hidden">{storefront==='market'?'تسوق من ESI':'تسوق من المتجر الأوربي في العراق'}</h1>
  {loading&&!banners.length?<div className="skeleton-block skeleton-banner" role="status" aria-label="دا نحمّل البنرات…"/>:<HeroBanner banners={banners} categories={categories} products={products}/>}

  <section className="shop-benefits" aria-label="خدمات المتجر">
   <div><Package size={22}/><span><strong>تغليف يحفظ خصوصيتك</strong><small>طلبك يوصلك بكرتون محايد</small></span></div>
   <div><Truck size={22}/><span><strong>توصيل لبابك</strong><small>للمحافظات المتاحة عند الطلب</small></span></div>
   <div><Money size={22}/><span><strong>الدفع عند الاستلام</strong><small>تستلم طلبك وتحاسب نقداً</small></span></div>
  </section>

  <section className="shop-categories" aria-labelledby="home-categories-title">
   <div className="section-heading"><div><h2 id="home-categories-title">تسوّق حسب القسم</h2><p>وصل للي تريده بخطوة.</p></div><Link href="/categories">كل الأقسام<ArrowLeft size={18}/></Link></div>
   <CategoryNavigation categories={categories} includeOffers={offers.length>0} loading={loading}/>
  </section>

  <section className="catalog-section featured-section" aria-labelledby="featured-title">
   <div className="section-heading"><div><h2 id="featured-title">اختيارات من المتجر</h2><p>تصفّح المنتجات وشوف تفاصيلها وألوانها.</p></div><Link href="/categories">كل المنتجات<ArrowLeft size={18}/></Link></div>
   {loading&&!featured.length?<ProductGridLoading/>:<CatalogGrid products={featured} emptyTitle="قريباً، اختيارات جديدة" emptyMessage="المنتجات المتاحة راح تظهر هنا."/>}
  </section>

  {offers.length>0&&<section className="shop-offers" aria-labelledby="home-offers-title">
   <div className="section-heading"><div><h2 id="home-offers-title"><Tag size={24}/>أسعار تستاهل</h2><p>منتجات مختارة بسعر أقل.</p></div><Link href="/categories?offers=1">كل العروض<ArrowLeft size={18}/></Link></div>
   <CatalogGrid products={offers.slice(0,4)}/>
  </section>}

  {steps.length>0&&<section className="shop-budget" aria-labelledby="budget-title">
   <div><Coins size={26}/><h2 id="budget-title">على گد ميزانيتك</h2><p>اختار السعر، وشوف المنتجات المناسبة إلك.</p></div>
   <div className="shop-budget-links">{steps.map(step=><Link key={step} href={`/categories?max=${step}`}>لحد {money(step)}<ArrowLeft size={16}/></Link>)}</div>
  </section>}
 </div>;
}
