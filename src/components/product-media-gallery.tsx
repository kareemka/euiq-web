'use client';

import {useRef,useState} from 'react';
import {Play} from '@phosphor-icons/react';

type ProductMedia={type:'image'|'video';src:string};

type Props={
 title:string;
 images:string[];
 videoUrl:string|null;
 discount:number;
};

export function ProductMediaGallery({title,images,videoUrl,discount}:Props){
 const media:ProductMedia[]=[
  ...images.filter(src=>typeof src==='string'&&src.trim()).map(src=>({type:'image' as const,src})),
  ...(videoUrl?[{type:'video' as const,src:videoUrl}]:[]),
 ];
 const [activeIndex,setActiveIndex]=useState(0);
 const touchStart=useRef<number|null>(null);
 const active=media[activeIndex];
 const imageCount=media.filter(item=>item.type==='image').length;
 const imageNumber=media.slice(0,activeIndex+1).filter(item=>item.type==='image').length;
 const poster=media.find(item=>item.type==='image')?.src;

 function move(delta:number){
  if(media.length<2)return;
  setActiveIndex(index=>(index+delta+media.length)%media.length);
 }

 return <div className="gallery" role="region" aria-label={`صور وفيديو ${title}`}>
  <div className="gallery-media">
   <div
    className="gallery-main"
    role="group"
    aria-label={active?active.type==='video'?`فيديو ${title}`:`صورة ${imageNumber} من ${imageCount}`:`ماكو وسائط للمنتج ${title}`}
    tabIndex={media.length>1?0:-1}
    onTouchStart={event=>{if(active?.type==='image')touchStart.current=event.touches[0]?.clientX??null}}
    onTouchEnd={event=>{
     if(active?.type!=='image'||touchStart.current===null)return;
     const distance=event.changedTouches[0]?.clientX-touchStart.current;
     touchStart.current=null;
     if(typeof distance==='number'&&Math.abs(distance)>45)move(distance>0?1:-1);
    }}
    onKeyDown={event=>{
     if(event.target!==event.currentTarget)return;
     if(event.key==='ArrowLeft'){event.preventDefault();move(1)}
     if(event.key==='ArrowRight'){event.preventDefault();move(-1)}
    }}
   >
    {active?.type==='video'
     ? <video key={active.src} controls preload="metadata" src={active.src} poster={poster} playsInline aria-label={`فيديو يشرح ${title}`}/>
     : active?.type==='image'
      ? <img key={active.src} src={active.src} alt={`${title}، الصورة ${activeIndex+1}`}/>
      : <p className="gallery-empty">ماكو صور أو فيديو لهذا المنتج</p>}
    {discount>0&&<span className="discount">خصم {discount}%</span>}
    {media.length>1&&active?.type==='image'&&<span className="gallery-count" aria-live="polite">{imageNumber} / {imageCount}</span>}
   </div>

   {media.length>1&&<div className="gallery-thumbnails" role="group" aria-label="اختار صورة أو فيديو">
    {media.map((item,index)=><button
     key={`${item.type}-${item.src}-${index}`}
     type="button"
     className={`gallery-thumbnail ${activeIndex===index?'selected':''} ${item.type==='video'?'is-video':''}`}
     aria-label={item.type==='video'?'عرض فيديو المنتج':`عرض الصورة ${index+1}`}
     aria-pressed={activeIndex===index}
     onClick={()=>setActiveIndex(index)}
    >
     {item.type==='image'
      ? <img src={item.src} alt="" loading="lazy"/>
      : <>
       {poster?<img src={poster} alt="" loading="lazy"/>:<span className="gallery-thumbnail-empty"/>}
       <span className="media-play" aria-hidden="true"><Play size={18} weight="fill"/></span>
       <span className="media-video-label">فيديو</span>
      </>}
    </button>)}
   </div>}
  </div>
 </div>;
}
