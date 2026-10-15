'use client';

import {useEffect,useRef,useState} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {usePathname,useSearchParams} from 'next/navigation';
import {List,X,MagnifyingGlass,ShoppingCart,Heart,User,ArrowLeft,House,SquaresFour,Tag,Package} from '@phosphor-icons/react';

const links=[{href:'/',label:'الرئيسية',Icon:House},{href:'/categories',label:'جميع الأقسام',Icon:SquaresFour},{href:'/categories?offers=1',label:'العروض',Icon:Tag},{href:'/orders',label:'متابعة الطلبات',Icon:Package},{href:'/favorites',label:'المفضلة',Icon:Heart}];

export function StoreHeader({count,name,authReady,onAccount}:{count:number;name?:string;authReady:boolean;onAccount:()=>void}){
 const pathname=usePathname(),params=useSearchParams();
 const [open,setOpen]=useState(false);
 const menu=useRef<HTMLDialogElement>(null);
 const current=(href:string)=>href.includes('?')?pathname==='/categories'&&params.get('offers')==='1':pathname===href&&!(href==='/categories'&&params.get('offers')==='1');
 useEffect(()=>{const dialog=menu.current;if(!dialog)return;if(open&&!dialog.open)dialog.showModal();if(!open&&dialog.open)dialog.close();},[open]);
 return <>
  <a className="skip-link" href="#main-content">انتقل إلى المحتوى</a>
  <header className="site-header">
   <div className="header wrap">
    <button className="header-icon menu-trigger" aria-label="فتح قائمة المتجر" aria-haspopup="dialog" aria-expanded={open} onClick={()=>setOpen(true)}><List size={24}/></button>
    <Link className="brand" href="/" aria-label="المتجر الأوربي، الصفحة الرئيسية"><Image src="/assets/logo_official_black.png" alt="الشعار الرسمي للمتجر الأوربي" width={72} height={72} priority/><div><strong>المتجر الأوربي في العراق</strong><span>اختيارات بعناية. خصوصية بكل التفاصيل.</span></div></Link>
    <form action="/categories" className="search-bar header-search" role="search" aria-label="البحث في المتجر"><input type="search" name="q" aria-label="اسم المنتج أو وصفه" placeholder="دوّر على المنتج اللي تريده…"/><button aria-label="ابحث في المتجر"><MagnifyingGlass size={22}/></button></form>
    <div className="header-actions">
     <Link className="header-icon favorites-link" href="/favorites" aria-label="المفضلة" aria-current={pathname==='/favorites'?'page':undefined}><Heart size={23}/></Link>
     <button className="account-button" aria-label={name?`حساب ${name}`:'تسجيل الدخول إلى حسابك'} onClick={onAccount}><User size={23}/><span>{!authReady?'جارٍ استعادة الحساب…':name||'حسابي'}</span></button>
     <Link className="header-icon cart-icon" href="/cart" aria-label={`السلة، ${count} قطع`} aria-current={pathname==='/cart'?'page':undefined}><ShoppingCart size={24}/>{count>0&&<b>{count}</b>}</Link>
    </div>
   </div>
   <div className="header-navigation"><div className="wrap navigation-row"><nav className="desktop-nav" aria-label="التنقل الرئيسي">{links.map(link=><Link key={link.href} href={link.href} aria-current={current(link.href)?'page':undefined}><link.Icon size={18}/>{link.label}</Link>)}</nav><span className="nav-assurance">اختياراتك، بخصوصية تامة</span></div></div>
  </header>
  <dialog ref={menu} className="mobile-menu" aria-labelledby="menu-title" onClose={()=>setOpen(false)} onClick={e=>{if(e.target===e.currentTarget)setOpen(false)}}>
   <div className="filter-sheet-head"><h2 id="menu-title">المتجر الأوربي</h2><button className="icon-button" aria-label="إغلاق القائمة" onClick={()=>setOpen(false)}><X size={23}/></button></div>
   <nav aria-label="قائمة المتجر">{links.map(link=><Link key={link.href} href={link.href} aria-current={current(link.href)?'page':undefined} onClick={()=>setOpen(false)}>{link.label}<ArrowLeft size={18}/></Link>)}<Link href="/account" onClick={e=>{e.preventDefault();setOpen(false);onAccount()}}>حسابي<User size={20}/></Link><Link href="/privacy" onClick={()=>setOpen(false)}>الخصوصية والشروط<ArrowLeft size={18}/></Link></nav>
   <p>اختيارات بعناية. خصوصية بكل التفاصيل.</p>
  </dialog>
 </>;
}
