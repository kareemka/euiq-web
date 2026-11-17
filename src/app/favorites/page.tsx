'use client';
import Link from 'next/link';
import {Heart,ArrowLeft,WarningCircle} from '@phosphor-icons/react';
import {useStore} from '@/components/store-provider';
import {CatalogGrid} from '@/components/catalog-grid';
import {usePagedProducts} from '@/lib/use-paged-products';
import {InfiniteTrigger} from '@/components/infinite-trigger';
import {LoadingStatus,ProductGridLoading} from '@/components/store-loading';

export default function FavoritesPage(){
 const {profile,authReady,authError,requireAuth,favorites}=useStore();
 return <div className="wrap page favorites-page">
  <header className="personal-page-heading"><div><span className="eyebrow">اختياراتك</span><h1>المفضلة {authReady&&profile&&<span className="saved-count" aria-label={`${favorites.length} منتج محفوظ`}>{favorites.length}</span>}</h1><p>كل اللي عجبك بمكان واحد، ارجع له من تجهز للطلب.</p></div><Link className="button secondary" href="/categories">تصفّح المنتجات <ArrowLeft size={18}/></Link></header>
  {!authReady?<ProductGridLoading count={6} label="دا نرجّع مفضلتك…"/>:
   authError?<section className="personal-empty"><WarningCircle size={40} aria-hidden="true"/><h2>ما گدرنا نفتح مفضلتك</h2><p role="alert">{authError}</p><button className="button" onClick={()=>requireAuth(()=>{})}>جرّب مرة ثانية</button></section>:
   !profile?<section className="personal-empty"><span className="personal-empty-icon"><Heart size={32} aria-hidden="true"/></span><h2>اختياراتك تبقى محفوظة بحسابك</h2><p>سجّل دخولك حتى تشوف مفضلتك وتتابعها من أي جهاز.</p><button className="button" onClick={()=>requireAuth(()=>{})}>سجّل دخولك</button></section>:
   <FavoritesContent key={profile.id}/>}
 </div>;
}
function FavoritesContent(){
 const {products,favorites,profile,storefront,loading,error,reload}=useStore();
 const page=usePagedProducts({user:profile?.id,favorites:favorites.join(',')},products.filter(product=>favorites.includes(product.id)),true,storefront);
 const saved=page.rows.filter(product=>favorites.includes(product.id));
 return <section aria-label="المنتجات المفضلة">
  {(loading||page.loading)&&!saved.length?<ProductGridLoading count={6} label="دا نحمّل المفضلة…"/>:
   (error||page.error)&&!saved.length?<div className="personal-empty"><WarningCircle size={40} aria-hidden="true"/><h2>تعذّر تحميل المنتجات</h2><p role="alert">{error||page.error}</p><button className="button" onClick={()=>{void reload();page.refresh();}}>جرّب مرة ثانية</button></div>:
   saved.length?<><div className="favorites-help"><Heart size={18} aria-hidden="true"/><p>دوس على القلب حتى تشيل المنتج من المفضلة.</p>{page.loading&&<LoadingStatus label="دا نحدّث…"/>}</div><CatalogGrid products={saved}/><InfiniteTrigger hasMore={page.hasMore} loading={page.loading} error={page.error} onMore={page.loadMore}/><p className="favorites-footnote">هنا تظهر منتجات مفضلتك المنشورة والمتاحة للعرض.</p></>:
   <div className="personal-empty"><span className="personal-empty-icon"><Heart size={32} aria-hidden="true"/></span><h2>{favorites.length?'المنتجات المحفوظة غير متاحة للعرض حالياً':'مفضلتك تنتظر اختياراتك'}</h2><p>{favorites.length?'تگدر تتصفّح باقي المنتجات وتحفظ اللي يعجبك.':'دوس على القلب بأي منتج حتى ينحفظ هنا وتگدر ترجع له بسهولة.'}</p><Link className="button" href="/categories">شوف المنتجات <ArrowLeft size={18}/></Link></div>}
 </section>;
}
