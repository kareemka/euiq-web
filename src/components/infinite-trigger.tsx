'use client';
import {useEffect,useRef} from 'react';
import {LoadingStatus} from './store-loading';
export function InfiniteTrigger({hasMore,loading,error,onMore,loadingLabel='دا نحمّل منتجات أكثر…'}:{hasMore:boolean;loading:boolean;error?:string;onMore:()=>void;loadingLabel?:string}){
 const ref=useRef<HTMLDivElement>(null);
 useEffect(()=>{if(!ref.current||!hasMore||loading||error)return;const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting))onMore();},{rootMargin:'400px'});observer.observe(ref.current);return()=>observer.disconnect();},[hasMore,loading,error,onMore]);
 return <div ref={ref} className="pagination-trigger">{loading?<LoadingStatus label={loadingLabel}/>:error?<><p role="alert">{error}</p><button className="button secondary" onClick={onMore}>جرّب مرة ثانية</button></>:hasMore?<button className="button secondary" onClick={onMore}>شوف بعد</button>:null}</div>;
}
