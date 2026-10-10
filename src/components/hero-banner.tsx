'use client';
import Link from 'next/link';
import {useEffect,useState} from 'react';
import {ArrowLeft,CaretLeft,CaretRight,Pause,Play,ShieldCheck,Package,Truck} from '@phosphor-icons/react';
import {categoryUrl} from '@/lib/urls';
import type {Banner,Category} from '@/lib/types';

export function HeroBanner({banners,categories}:{banners:Banner[];categories:Category[]}){
 const [position,setPosition]=useState(0),[paused,setPaused]=useState(false),[hovered,setHovered]=useState(false),[focused,setFocused]=useState(false),[hidden,setHidden]=useState(false),[reducedMotion,setReducedMotion]=useState(false);
 const count=banners.length,index=count?position%count:0,banner=banners[index];
 const rotating=count>1&&!paused&&!hovered&&!focused&&!hidden&&!reducedMotion;
 const category=categories.find(c=>c.id===banner?.target_category_id);
 useEffect(()=>{
  const media=window.matchMedia('(prefers-reduced-motion: reduce)');
  const motion=()=>setReducedMotion(media.matches),visibility=()=>setHidden(document.hidden);
  motion();visibility();media.addEventListener('change',motion);document.addEventListener('visibilitychange',visibility);
  return()=>{media.removeEventListener('change',motion);document.removeEventListener('visibilitychange',visibility);};
 },[]);
 useEffect(()=>{
  if(!rotating)return;
  const timer=window.setTimeout(()=>setPosition(i=>(i+1)%count),6000);
  return()=>window.clearTimeout(timer);
 },[rotating,count,position]);
 const move=(direction:number)=>setPosition(i=>(i+direction+count)%count);
 return <section className="hero hero-carousel" role="region" aria-roledescription="عرض شرائح" aria-label="بنرات المتجر"
  onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}
  onFocusCapture={()=>setFocused(true)} onBlurCapture={event=>{if(!event.currentTarget.contains(event.relatedTarget as Node|null))setFocused(false);}}
  onKeyDown={event=>{if(event.target!==event.currentTarget||count<2)return;if(event.key==='ArrowLeft'){event.preventDefault();move(1);}if(event.key==='ArrowRight'){event.preventDefault();move(-1);}}} tabIndex={0}>
  <div className="hero-copy" aria-live={rotating?'off':'polite'} aria-atomic="true">
   <span className="eyebrow">اختيارات خاصة، بكل عناية</span>
   <h1>{banner?.title??'خصوصية تامة، واختيار بعناية.'}</h1>
   <p>{banner?.subtitle??'منتجات مختارة لحياة زوجية أفضل، وتسوّق براحة من منزلك.'}</p>
   <Link href={category?categoryUrl(category):'/categories'} className="button">اكتشف المنتجات<ArrowLeft size={21}/></Link>
   <div className="hero-trust"><span><ShieldCheck size={19}/>خصوصية تامة</span><span><Package size={19}/>تغليف آمن</span><span><Truck size={19}/>توصيل داخل العراق</span></div>
  </div>
  <div className="hero-art"><img key={banner?.image_url??'default'} src={banner?.image_url||'/assets/hero-still.webp'} width={1536} height={1024} alt="" fetchPriority="high"/><span className="hero-art-label">لحظاتكما تستحق الأفضل</span></div>
  {count>1&&<div className="carousel-navigation" aria-label="التحكم بالبنرات">
   <button className="carousel-arrow" aria-label="البنر السابق" onClick={()=>move(-1)}><CaretRight size={20}/></button>
   <div className="carousel-pages">{banners.map((item,i)=><button key={item.id} className="carousel-page" aria-label={`عرض البنر ${i+1}`} aria-current={i===index?'true':undefined} onClick={()=>setPosition(i)}><span/></button>)}</div>
   <button className="carousel-arrow" aria-label="البنر التالي" onClick={()=>move(1)}><CaretLeft size={20}/></button>
   {!reducedMotion&&<button className="carousel-play" aria-label={paused?'تشغيل التنقل التلقائي':'إيقاف التنقل التلقائي'} aria-pressed={paused} onClick={()=>setPaused(value=>!value)}>{paused?<Play size={17} weight="fill"/>:<Pause size={17} weight="fill"/>}</button>}
  </div>}
 </section>;
}
