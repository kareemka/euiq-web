'use client';
import {useEffect,useRef} from 'react';
export function InfiniteTrigger({hasMore,loading,error,onMore}:{hasMore:boolean;loading:boolean;error?:string;onMore:()=>void}){
 const ref=useRef<HTMLDivElement>(null);
 useEffect(()=>{if(!ref.current||!hasMore||loading||error)return;const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting))onMore();},{rootMargin:'400px'});observer.observe(ref.current);return()=>observer.disconnect();},[hasMore,loading,error,onMore]);
 return <div ref={ref} className="pagination-trigger" aria-live="polite">{loading?<p role="status">دا نحمّل بعد…</p>:error?<><p role="alert">{error}</p><button className="button secondary" onClick={onMore}>جرّب مرة ثانية</button></>:hasMore?<button className="button secondary" onClick={onMore}>شوف بعد</button>:null}</div>;
}
