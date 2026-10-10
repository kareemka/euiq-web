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
 return <div className="wrap page">
  <div className="page-heading"><span className="eyebrow">اختيارات تعود إليها</span><h1>المفضلة</h1><p>احتفظ بالمنتجات التي أعجبتك، واختر اللون والكمية عندما تكون مستعدًا.</p></div>
  {!authReady?<div className="page-loading" role="status">جارٍ استعادة حسابك…</div>:
   authError?<div className="empty"><p role="alert">{authError}</p><button className="button" onClick={()=>requireAuth(()=>{})}>إعادة المحاولة</button></div>:
   !profile?<div className="empty"><Heart size={48}/><h2>اختياراتك محفوظة مع حسابك</h2><p>سجّل الدخول لعرض المفضلة ومتابعتها من أي جهاز.</p><button className="button" onClick={()=>requireAuth(()=>{})}>تسجيل الدخول</button></div>:
   (loading||page.loading)&&!saved.length?<div className="page-loading" role="status">جارٍ تحميل المفضلة…</div>:
   (error||page.error)&&!saved.length?<div className="empty"><p role="alert">{error||page.error}</p><button className="button" onClick={()=>{void reload();page.refresh();}}>إعادة المحاولة</button></div>:
   saved.length?<><div className="section-heading"><p className="muted">{favorites.length} منتج في مفضلتك</p><Link href="/categories">اكتشف المزيد <ArrowLeft size={18}/></Link></div><CatalogGrid products={saved}/><InfiniteTrigger hasMore={page.hasMore} loading={page.loading} error={page.error} onMore={page.loadMore}/><p className="fine">اضغط القلب لإزالة منتج من المفضلة. تظهر هنا المنتجات المنشورة والمتاحة للتصفح.</p></>:
   <div className="empty"><Heart size={48}/><h2>مفضلتك بانتظار اختياراتك</h2><p>اضغط علامة القلب على أي منتج ليظهر هنا.</p><Link className="button" href="/categories">تصفّح المنتجات <ArrowLeft size={18}/></Link></div>}
 </div>;
}
