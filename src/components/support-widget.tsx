'use client';

import {useEffect,useRef} from 'react';
import Link from 'next/link';
import {Headset,WhatsappLogo,Phone,X,ArrowUpLeft,CaretLeft,Package} from '@phosphor-icons/react';

export function SupportWidget({open,onOpenChange,whatsappPhone,supportPhone}:{open:boolean;onOpenChange:(open:boolean)=>void;whatsappPhone?:string;supportPhone?:string}){
 const panel=useRef<HTMLElement>(null);
 const whatsappDigits=(whatsappPhone??'').replace(/\D/g,'');
 const phoneDigits=(supportPhone??'').replace(/\D/g,'');
 const phoneHref=phoneDigits?`tel:${supportPhone?.trim().startsWith('+')?'+':''}${phoneDigits}`:undefined;

 useEffect(()=>{
  const element=panel.current;
  if(!element)return;
  if(open&&!element.matches(':popover-open'))element.showPopover();
  if(!open&&element.matches(':popover-open'))element.hidePopover();
 },[open]);

 return <>
  <div className="contact-launcher">
   <button type="button" className="contact-trigger" popoverTarget="store-contact-panel" popoverTargetAction="toggle" aria-label={open?'إغلاق خيارات التواصل':'افتح خيارات واتساب والدعم'} aria-controls="store-contact-panel" aria-haspopup="dialog" aria-expanded={open}>
    {open?<X size={22} aria-hidden="true"/>:<Headset size={24} aria-hidden="true"/>}<span>{open?'إغلاق':'تواصل ويانا'}</span>
   </button>
  </div>
  <section ref={panel} id="store-contact-panel" className="contact-panel" popover="auto" role="dialog" aria-labelledby="store-contact-title" onToggle={event=>onOpenChange(event.currentTarget.matches(':popover-open'))}>
   <div className="contact-panel-header">
    <span className="contact-header-icon" aria-hidden="true"><Headset size={25}/></span>
    <div><h2 id="store-contact-title">شلون نكدر نساعدك؟</h2><p>اختار الطريقة الأنسب إلك.</p></div>
    <button type="button" className="contact-close" aria-label="إغلاق خيارات التواصل" autoFocus onClick={()=>onOpenChange(false)}><X size={20}/></button>
   </div>
   <div className="contact-options">
    {whatsappDigits&&<a className="contact-option contact-whatsapp" href={`https://wa.me/${whatsappDigits}`} target="_blank" rel="noopener noreferrer" onClick={()=>onOpenChange(false)}>
     <span className="contact-option-icon" aria-hidden="true"><WhatsappLogo size={28}/></span><span className="contact-option-copy"><strong>راسلنا على واتساب</strong><small>استفسر عن منتج أو عن طلبك</small></span><ArrowUpLeft size={20} aria-hidden="true"/>
    </a>}
    {phoneHref&&<a className="contact-option contact-phone" href={phoneHref} onClick={()=>onOpenChange(false)}>
     <span className="contact-option-icon" aria-hidden="true"><Phone size={23}/></span><span className="contact-option-copy"><strong>اتصل بالمتجر</strong><small>تواصل ويانا بمكالمة مباشرة</small></span><ArrowUpLeft size={19} aria-hidden="true"/>
    </a>}
    {!whatsappDigits&&!phoneHref&&<p className="contact-unavailable">أرقام التواصل مو متاحة حاليًا. تگدر تتابع طلبك من صفحة الطلبات.</p>}
   </div>
   <div className="contact-panel-footer">
    <Link href="/orders" onClick={()=>onOpenChange(false)}><Package size={19} aria-hidden="true"/><span>تابع طلباتك من هنا</span><CaretLeft size={16} aria-hidden="true"/></Link>
    {(whatsappDigits||phoneHref)&&<p>جهّز رقم طلبك حتى نساعدك بمتابعته.</p>}
   </div>
  </section>
 </>;
}
