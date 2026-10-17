'use client';
import Link from 'next/link';
import {Heart,ArrowLeft} from '@phosphor-icons/react';
import {useStore} from '@/components/store-provider';
import {CatalogGrid} from '@/components/catalog-grid';
import {usePagedProducts} from '@/lib/use-paged-products';
import {InfiniteTrigger} from '@/components/infinite-trigger';

export default function FavoritesPage(){
 const {profile}=useStore();return <FavoritesContent key={profile?.id??'guest'}/>;
}
function FavoritesContent(){
 const {products,favorites,profile,authReady,authError,loading,error,reload,requireAuth}=useStore();
 const page=usePagedProducts({user:profile?.id,favorites:favorites.join(',')},products.filter(product=>favorites.includes(product.id)),true);
 const saved=page.rows;
 return <div className="wrap page favorites-page">
  <div className="page-heading"><h1><Heart size={28}/>المفضلة</h1><p>خلي المنتجات اللي عجبتك بالمفضلة، واختار اللون والكمية من تجهز.</p></div>
  {!authReady?<div className="page-loading" role="status">دا نرجّع حسابك…</div>:
   authError?<div className="empty"><p role="alert">{authError}</p><button className="button" onClick={()=>requireAuth(()=>{})}>جرّب مرة ثانية</button></div>:
   !profile?<div className="empty"><Heart size={48}/><h2>اختياراتك تبقى محفوظة بحسابك</h2><p>سجّل دخولك حتى تشوف مفضلتك وتتابعها من أي جهاز.</p><button className="button" onClick={()=>requireAuth(()=>{})}>سجّل دخولك</button></div>:
   (loading||page.loading)&&!saved.length?<div className="page-loading" role="status">دا نحمّل المفضلة…</div>:
   (error||page.error)&&!saved.length?<div className="empty"><p role="alert">{error||page.error}</p><button className="button" onClick={()=>{void reload();page.refresh();}}>جرّب مرة ثانية</button></div>:
   saved.length?<><div className="section-heading"><p className="muted">{favorites.length} منتج بمفضلتك</p><Link href="/categories">شوف بعد <ArrowLeft size={18}/></Link></div><CatalogGrid products={saved}/><InfiniteTrigger hasMore={page.hasMore} loading={page.loading} error={page.error} onMore={page.loadMore}/><p className="fine">دوس على القلب حتى تشيل المنتج من المفضلة. هنا تبين المنتجات المنشورة والمتوفرة.</p></>:
   <div className="empty"><Heart size={48}/><h2>مفضلتك تنتظر اختياراتك</h2><p>دوس على القلب بأي منتج حتى يبين هنا.</p><Link className="button" href="/categories">شوف المنتجات <ArrowLeft size={18}/></Link></div>}
 </div>;
}
