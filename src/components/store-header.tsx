'use client';

import {useEffect,useRef,useState} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {usePathname,useSearchParams} from 'next/navigation';
import {List,X,MagnifyingGlass,ShoppingCart,Heart,User,CaretLeft,House,SquaresFour,Tag,Package,ShieldCheck,WhatsappLogo} from '@phosphor-icons/react';
import {marketBrandName,marketTagline} from '@/lib/seo';

const links=[
 {href:'/',label:'الرئيسية',Icon:House},
 {href:'/categories',label:'كل الأقسام',Icon:SquaresFour},
 {href:'/categories?offers=1',label:'العروض',Icon:Tag,isOffer:true},
 {href:'/orders',label:'طلباتي',Icon:Package},
 {href:'/favorites',label:'المفضلة',Icon:Heart}
];

export function StoreHeader({count,name,authReady,isMarket=false,whatsappPhone,onAccount}:{count:number;name?:string;authReady:boolean;isMarket?:boolean;whatsappPhone?:string;onAccount:()=>void}){
 const pathname=usePathname(),params=useSearchParams();
 const [open,setOpen]=useState(false);
 const menu=useRef<HTMLDialogElement>(null);
 const closeMenu=()=>{setOpen(false);menu.current?.close();};
 const [ageConfirmationOpen,setAgeConfirmationOpen]=useState(false);
 const ageConfirmation=useRef<HTMLDialogElement>(null);
 const current=(href:string)=>href.includes('?')?pathname==='/categories'&&params.get('offers')==='1':pathname===href&&!(href==='/categories'&&params.get('offers')==='1');

 const whatsappDigits=(whatsappPhone??'').replace(/\D/g,'');

 useEffect(()=>{const dialog=menu.current;if(!dialog)return;if(open&&!dialog.open)dialog.showModal();if(!open&&dialog.open)dialog.close();},[open]);
 useEffect(()=>{const desktop=window.matchMedia('(min-width: 769px)');const closeMenu=()=>{if(!desktop.matches)return;setOpen(false);if(menu.current?.open)menu.current.close();};desktop.addEventListener('change',closeMenu);closeMenu();return()=>desktop.removeEventListener('change',closeMenu);},[]);
 useEffect(()=>{const dialog=ageConfirmation.current;if(!dialog)return;if(ageConfirmationOpen&&!dialog.open)dialog.showModal();if(!ageConfirmationOpen&&dialog.open)dialog.close();},[ageConfirmationOpen]);

 return <>
  <a className="skip-link" href="#main-content">روح للمحتوى</a>
  <header className="site-header">
   <div className="header wrap">
    <button className="header-icon menu-trigger" aria-label="افتح قائمة المتجر" aria-haspopup="dialog" aria-controls="mobile-store-menu" aria-expanded={open} onClick={()=>setOpen(true)}><List size={24}/></button>

    <Link className="brand" href="/" aria-label={isMarket?`${marketBrandName}، الرئيسية`:'المتجر الأوربي، الرئيسية'}>
     <div className="brand-logo-frame">
      <Image src={isMarket?'/assets/esi-logo.jpg':'/assets/logo_official_black.png'} alt={isMarket?'شعار ESI Online Store':'شعار المتجر الأوربي'} width={64} height={64} priority/>
     </div>
     <div className="brand-text">
      <strong>{isMarket?marketBrandName:'المتجر الأوربي في العراق'}</strong>
      <span>{isMarket?marketTagline:'اختيارات تناسبك، وخصوصيتك محفوظة بكل خطوة.'}</span>
     </div>
    </Link>

    <form action="/categories" className="search-bar header-search" role="search" aria-label="البحث في المتجر">
     <MagnifyingGlass size={20} className="search-input-icon"/>
     <input type="search" name="q" aria-label="البحث عن منتج" placeholder="شنو تدور عليه؟"/>
     <button type="submit" aria-label="دوّر بالمتجر"><MagnifyingGlass size={18}/></button>
    </form>

    <div className="header-actions">
     <Link className="header-icon favorites-link" href="/favorites" aria-label="المفضلة" aria-current={pathname==='/favorites'?'page':undefined}><Heart size={22}/></Link>
     {isMarket&&<button type="button" className="adult-category-button" onClick={()=>setAgeConfirmationOpen(true)} aria-haspopup="dialog" aria-expanded={ageConfirmationOpen} aria-label="منتجات +18، تأكيد العمر قبل الانتقال"><Image src="/assets/age-18-category.png" alt="" width={318} height={320}/></button>}
     <button className="account-button" aria-label={name?`حساب ${name}`:'سجّل دخولك لحسابك'} onClick={onAccount}>
      <User size={20}/>
      <span>{!authReady?'دا نرجّع حسابك…':name||'حسابي'}</span>
     </button>
     <Link className="cart-pill-button" href="/cart" aria-label={`السلة، ${count} قطع`} aria-current={pathname==='/cart'?'page':undefined}>
      <ShoppingCart size={20} weight="fill"/>
      <span>السلة ({count})</span>
     </Link>
    </div>
   </div>

   <div className="header-navigation">
    <div className="wrap navigation-row">
     <nav className="desktop-nav" aria-label="القائمة الرئيسية">
      {links.map(link=><Link key={link.href} href={link.href} className={link.isOffer?'nav-offer-link':''} aria-current={current(link.href)?'page':undefined}>
       <link.Icon size={18} weight={link.isOffer?'bold':'regular'}/>
       <span>{link.label}</span>
      </Link>)}
     </nav>
     {whatsappDigits?<a href={`https://wa.me/${whatsappDigits}`} target="_blank" rel="noreferrer" className="header-whatsapp-pill" aria-label="خدمة العملاء متوفرة عبر واتساب">

      <WhatsappLogo size={18} weight="fill"/>
      <span>تواصل ويانا</span>
     </a>:<span className="nav-assurance">{isMarket?marketTagline:'اختيار براحتك وخصوصيتك محفوظة'}</span>}
    </div>
   </div>
  </header>

  <dialog ref={menu} id="mobile-store-menu" className="mobile-menu" dir="rtl" aria-labelledby="menu-title" onClose={()=>setOpen(false)} onClick={event=>{
   if(event.target!==event.currentTarget)return;
   const bounds=event.currentTarget.getBoundingClientRect();
   if(event.clientX<bounds.left||event.clientX>bounds.right||event.clientY<bounds.top||event.clientY>bounds.bottom)closeMenu();
  }}>
   <div className="mobile-menu-header">
    <Image src={isMarket?'/assets/esi-logo.jpg':'/assets/logo_official_black.png'} alt="" width={44} height={44}/>
    <div><h2 id="menu-title">{isMarket?marketBrandName:'المتجر الأوربي'}</h2><p>كل اللي تحتاجه بمكان واحد</p></div>
    <button type="button" className="icon-button mobile-menu-close" aria-label="إغلاق القائمة" autoFocus onClick={closeMenu}><X size={22}/></button>
   </div>
   <div className="mobile-menu-content">
    <button type="button" className="mobile-menu-account" onClick={()=>{closeMenu();onAccount();}}>
     <span className="mobile-account-icon"><User size={24}/></span>
     <span><strong>{!authReady?'دا نرجّع حسابك…':name?`هلا، ${name}`:'هلا بيك بالمتجر'}</strong><small>{name?'حسابي وبيانات التوصيل':'سجّل دخولك وتابع طلباتك'}</small></span>
     <CaretLeft size={18} aria-hidden="true"/>
    </button>
    <p className="mobile-menu-label">تسوّق</p>
    <nav aria-label="القائمة الرئيسية للهاتف">
     {[...links.slice(0,3),{href:'/cart',label:'سلة التسوق',Icon:ShoppingCart},...links.slice(3)].map(link=><Link key={link.href} href={link.href} aria-current={current(link.href)?'page':undefined} onClick={closeMenu}>
      <span className="mobile-menu-link-icon"><link.Icon size={22} weight={current(link.href)?'fill':'regular'} aria-hidden="true"/></span>
      <span className="mobile-menu-link-label">{link.label}</span>
      {link.href==='/cart'&&count>0&&<span className="mobile-menu-count" aria-label={`${count} قطع بالسلة`}>{count}</span>}
      <CaretLeft size={16} className="mobile-menu-chevron" aria-hidden="true"/>
     </Link>)}
    </nav>
   </div>
   <div className="mobile-menu-footer">
    {whatsappDigits&&<a href={`https://wa.me/${whatsappDigits}`} target="_blank" rel="noopener noreferrer" className="mobile-menu-support" onClick={closeMenu}><WhatsappLogo size={22}/><span>تحتاج مساعدة؟ تواصل ويانا</span><CaretLeft size={16} aria-hidden="true"/></a>}
    <Link className="mobile-menu-privacy" href="/privacy" aria-current={pathname==='/privacy'?'page':undefined} onClick={closeMenu}><ShieldCheck size={18} aria-hidden="true"/><span>الخصوصية والشروط</span></Link>
   </div>
  </dialog>

  {isMarket&&<dialog ref={ageConfirmation} className="age-confirmation" aria-labelledby="age-confirmation-title" onClose={()=>setAgeConfirmationOpen(false)}>
   <div className="age-confirmation-mark" aria-hidden="true"><ShieldCheck size={28}/></div>
   <h2 id="age-confirmation-title">تأكيد العمر</h2>
   <p>هل عمرك 18 سنة أو أكثر؟ يلزم تأكيد عمرك قبل الانتقال إلى منتجات +18.</p>
   <div className="age-confirmation-actions">
    <button type="button" className="age-confirmation-cancel" onClick={()=>setAgeConfirmationOpen(false)}>لا، أعود إلى ESI</button>
    <a className="age-confirmation-confirm" href="https://euiq.store">نعم، عمري 18 سنة أو أكثر</a>
   </div>
  </dialog>}
 </>;
}
