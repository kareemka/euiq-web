'use client';

import Link from 'next/link';
import {useState} from 'react';
import {CategoryGridLoading} from './store-loading';
import {SquaresFour,Package,Flag,Percent,Sparkle,Drop,Heart,ArrowUpLeft,Check} from '@phosphor-icons/react';
import {categoryUrl} from '@/lib/urls';
import type {Category} from '@/lib/types';

function pickCategoryIcon(title:string){
 const t=title.toLowerCase();
 if(t.includes('عرض')||t.includes('تخفيض')||t.includes('خصم'))return Percent;
 if(t.includes('لانجري')||t.includes('ملابس')||t.includes('هزاز'))return Sparkle;
 if(t.includes('عناية')||t.includes('مزلق')||t.includes('طبي')||t.includes('مساج')||t.includes('زيت'))return Drop;
 if(t.includes('صيني')||t.includes('أمريكي')||t.includes('عراقي')||t.includes('علم'))return Flag;
 if(t.includes('زوجي')||t.includes('رومانسي')||t.includes('حب'))return Heart;
 return Package;
}

function CategoryArt({image,Icon}:{image?:string;Icon:typeof Package}){
 const [failed,setFailed]=useState(false);
 return <span className="category-art" aria-hidden="true">{image&&!failed?<img src={image} alt="" loading="lazy" width={80} height={80} onError={()=>setFailed(true)}/>:<Icon size={26}/>}</span>;
}

export function CategoryNavigation({categories,selected,onSelect,includeOffers=false,loading=false}:{categories:Category[];selected?:string;onSelect?:(value:string)=>void;includeOffers?:boolean;loading?:boolean}){
 if(loading&&!categories.length)return <CategoryGridLoading/>;
 const items=[
  ...(onSelect?[{id:'',title:'كل الأقسام',href:'/categories',Icon:SquaresFour,isOffer:false,image:undefined as string|undefined}]:[]),
  ...[...categories].sort((a,b)=>a.sort_order-b.sort_order).map(c=>({id:c.id,title:c.title,href:categoryUrl(c),Icon:pickCategoryIcon(c.title),isOffer:false,image:c.image_url})),
  ...(includeOffers?[{id:'offers',title:'العروض والتخفيضات',href:'/categories?offers=1',Icon:Percent,isOffer:true,image:undefined}]:[])
 ];
 if(!items.length)return <p className="categories-empty">الأقسام الجديدة راح تظهر هنا.</p>;
 return <nav className={`reference-categories ${onSelect?'category-selector':'category-directory'}`} aria-label="أقسام المتجر">
  {items.map(({id,title,href,Icon,isOffer,image})=>{
   const active=Boolean(onSelect&&selected===id);
   const content=<><CategoryArt key={image??id} image={image} Icon={Icon}/><span className="category-name">{title}</span><span className="category-action" aria-hidden="true">{active?<Check size={17} weight="bold"/>:<ArrowUpLeft size={17}/>}</span></>;
   return onSelect?<button key={id} type="button" className={isOffer?'category-offer-card':''} aria-pressed={active} onClick={()=>onSelect(id)}>{content}</button>:<Link key={id} href={href} className={isOffer?'category-offer-card':''}>{content}</Link>;
  })}
 </nav>;
}
