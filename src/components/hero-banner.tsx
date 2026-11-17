'use client';
import Link from 'next/link';
import {useEffect,useRef,useState} from 'react';
import {CaretLeft,CaretRight,Pause,Play} from '@phosphor-icons/react';
import {bannerTarget,bannerDelay} from '@/lib/urls';
import type {Banner,Category,Product} from '@/lib/types';

export function HeroBanner({banners,categories,products}:{banners:Banner[];categories:Category[];products:Product[]}){
 const [position,setPosition]=useState(0),[paused,setPaused]=useState(false),[hovered,setHovered]=useState(false),[focused,setFocused]=useState(false),[hidden,setHidden]=useState(false),[reducedMotion,setReducedMotion]=useState(false);
 const touch=useRef<number|null>(null);
 const slides=banners.filter(item=>item.image_url?.trim());
 const count=slides.length,index=count?position%count:0,banner=slides[index];
 const rotating=count>1&&!paused&&!hovered&&!focused&&!hidden&&!reducedMotion;
 const target=bannerTarget(banner??{target_category_id:null},products,categories);
 const externalProps=target.kind==='external'?{target:'_blank',rel:'noopener noreferrer',prefetch:false}:{};
 useEffect(()=>{
  const media=window.matchMedia('(prefers-reduced-motion: reduce)');
  const motion=()=>setReducedMotion(media.matches),visibility=()=>setHidden(document.hidden);
  motion();visibility();media.addEventListener('change',motion);document.addEventListener('visibilitychange',visibility);
  return()=>{media.removeEventListener('change',motion);document.removeEventListener('visibilitychange',visibility);};
 },[]);
 useEffect(()=>{
  if(!rotating)return;
  const timer=window.setTimeout(()=>setPosition(i=>(i+1)%count),bannerDelay(banner?.display_seconds));
  return()=>window.clearTimeout(timer);
 },[rotating,count,position,banner?.id,banner?.display_seconds]);
 const move=(direction:number)=>setPosition(i=>(i+direction+count)%count);
 if(!count)return null;
 return <section className="store-banner" role="region" aria-roledescription="عرض شرائح" aria-label="بنرات المتجر"
  onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}
  onFocusCapture={()=>setFocused(true)} onBlurCapture={event=>{if(!event.currentTarget.contains(event.relatedTarget as Node|null))setFocused(false);}}
  onTouchStart={event=>{touch.current=event.touches[0].clientX;}}
  onTouchEnd={event=>{if(touch.current===null||count<2)return;const delta=event.changedTouches[0].clientX-touch.current;touch.current=null;if(Math.abs(delta)>45)move(delta>0?1:-1);}}
  onKeyDown={event=>{if(event.target!==event.currentTarget||count<2)return;if(event.key==='ArrowLeft'){event.preventDefault();move(1);}if(event.key==='ArrowRight'){event.preventDefault();move(-1);}}} tabIndex={0}>
  <div className="store-banner-slide" key={banner.id} aria-roledescription={count>1?'شريحة':undefined} aria-label={count>1?`${index+1} من ${count}`:undefined}>
   <Link className="store-banner-link" href={target.href} {...externalProps} aria-label={banner.title||`فتح البنر ${index+1}`}>
    <img className="store-banner-image" src={banner.image_url!} width={2095} height={751} alt={banner.title||`بنر المتجر ${index+1}`} fetchPriority={index===0?'high':'auto'}/>
   </Link>
  </div>
  {count>1&&<div className="store-banner-navigation" aria-label="التحكم بالبنرات">
   <button className="store-banner-arrow" aria-label="البنر السابق" onClick={()=>move(-1)}><CaretRight size={18}/></button>
   <div className="store-banner-pages">{slides.map((item,i)=><button key={item.id} className="store-banner-page" aria-label={`عرض البنر ${i+1}`} aria-current={i===index?'true':undefined} onClick={()=>setPosition(i)}><span/></button>)}</div>
   <button className="store-banner-arrow" aria-label="البنر التالي" onClick={()=>move(1)}><CaretLeft size={18}/></button>
   {!reducedMotion&&<button className="store-banner-play" aria-label={paused?'تشغيل التنقل التلقائي':'إيقاف التنقل التلقائي'} aria-pressed={paused} onClick={()=>setPaused(value=>!value)}>{paused?<Play size={16} weight="fill"/>:<Pause size={16} weight="fill"/>}</button>}
  </div>}
 </section>;
}
