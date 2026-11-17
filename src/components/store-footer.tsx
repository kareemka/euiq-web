'use client';

import Image from 'next/image';
import Link from 'next/link';
import {ArrowUp,ArrowUpLeft,Headset,Package,Truck,Money} from '@phosphor-icons/react';
import {brandName,marketBrandName} from '@/lib/seo';

export function StoreFooter({isMarket=false,onSupport}:{isMarket?:boolean;onSupport:()=>void}){
 const name=isMarket?marketBrandName:brandName;
 function backToTop(){
  window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
 }
 return <footer className="store-footer" aria-label="معلومات المتجر وروابط المساعدة">
  <div className="wrap store-footer-inner">
   <ul className="store-footer-services" aria-label="خدمات المتجر">
    <li><Package size={21} aria-hidden="true"/><span>تغليف محايد يحفظ خصوصيتك</span></li>
    <li><Truck size={22} aria-hidden="true"/><span>توصيل للمحافظات المتاحة</span></li>
    <li><Money size={22} aria-hidden="true"/><span>الدفع نقدًا عند الاستلام</span></li>
   </ul>
   <div className="store-footer-main">
    <div className="store-footer-brand">
     <Link className="store-footer-logo" href="/" aria-label={`${name}، الرئيسية`}>
      <Image src={isMarket?'/assets/esi-logo.jpg':'/assets/logo_official_black.png'} alt="" width={56} height={56}/>
      <span><strong>{name}</strong><small>{isMarket?'اختيارات لكل يوم':'اختيارات تناسبك، وخصوصيتك محفوظة'}</small></span>
     </Link>
     <p>{isMarket?'تصفّح المنتجات، اختار اللي يناسبك، واطلبه لباب بيتك.':'تسوّق براحتك، وشوف تفاصيل كل منتج وألوانه. طلبك يوصلك بتغليف يحفظ خصوصيتك.'}</p>
    </div>
    <div className="store-footer-links">
     <nav aria-labelledby="footer-shop-title"><h2 id="footer-shop-title">تسوّق</h2><Link href="/categories">كل المنتجات</Link><Link href="/categories?offers=1">العروض والتخفيضات</Link><Link href="/favorites">المفضلة</Link></nav>
     <nav aria-labelledby="footer-help-title"><h2 id="footer-help-title">حسابك والمساعدة</h2><Link href="/orders">متابعة الطلبات</Link><Link href="/account">حسابي</Link><Link href="/privacy">الخصوصية والشروط</Link></nav>
    </div>
    <div className="store-footer-contact">
     <span className="store-footer-contact-icon" aria-hidden="true"><Headset size={26}/></span>
     <h2>عندك سؤال؟ حاضرين إلك</h2><p>نساعدك تختار المنتج أو تتابع طلبك.</p>
     <button type="button" onClick={onSupport} aria-haspopup="dialog" aria-controls="store-contact-panel">تواصل ويانا<ArrowUpLeft size={18} aria-hidden="true"/></button>
    </div>
   </div>
   <div className="store-footer-bottom"><small>© {new Date().getFullYear()} {name}. جميع الحقوق محفوظة.</small><button type="button" onClick={backToTop}>الرجوع للأعلى<ArrowUp size={17} aria-hidden="true"/></button></div>
  </div>
 </footer>;
}
