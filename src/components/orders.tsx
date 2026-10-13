'use client';
import {useEffect,useState,useCallback,useRef} from 'react';
import {InfiniteTrigger} from './infinite-trigger';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {orderUrl,decodeSlug} from '@/lib/urls';
import {Package,ArrowLeft,Clock} from '@phosphor-icons/react';
import {useStore} from './store-provider';
import {supabase} from '@/lib/supabase';
import {arabicError} from '@/lib/arabic-errors';
import {money,statuses,completeProfile} from '@/lib/domain';
import type {Order} from '@/lib/types';
export function Orders({slug}:{slug?:string}){const {profile}=useStore();return <OrdersContent key={(profile?.id??'guest')+(slug??'')} slug={slug}/>;}
function OrdersContent({slug}:{slug?:string}){const id=slug?decodeSlug(slug):undefined;const router=useRouter();const {profile,authReady,authError,requireAuth}=useStore();const [orders,setOrders]=useState<Order[]>([]),[loading,setLoading]=useState(true),[error,setError]=useState(''),[now,setNow]=useState(0),[offset,setOffset]=useState(0),[revision,setRevision]=useState(0);
 const [hasMore,setHasMore]=useState(false),[loadingMore,setLoadingMore]=useState(false),[moreError,setMoreError]=useState('');
 const rowsRef=useRef(orders),pageOffset=useRef(0),moreBusy=useRef(false),generation=useRef(0);
 useEffect(()=>{rowsRef.current=orders;},[orders]);
 const invalidate=useCallback(()=>{generation.current++;moreBusy.current=false;},[]);
 const loadMore=useCallback(()=>{if(!supabase||id||moreBusy.current||!hasMore)return;const version=generation.current;moreBusy.current=true;setLoadingMore(true);setMoreError('');void(async()=>{try{const r=await supabase!.rpc('list_orders_page',{p_limit:20,p_offset:pageOffset.current});if(r.error)throw r.error;if(version!==generation.current)return;const next=r.data as Order[];pageOffset.current+=next.length;setOrders(current=>[...current,...next.filter(o=>!current.some(x=>x.id===o.id))]);setHasMore(next.length===20);}catch(e){if(version===generation.current)setMoreError(arabicError(e));}finally{moreBusy.current=false;if(version===generation.current)setLoadingMore(false);}})();},[id,hasMore]);
 useEffect(()=>{const t=setInterval(()=>setNow(Date.now()),1000);return()=>clearInterval(t)},[]);
 useEffect(()=>{
  if(!completeProfile(profile)||!supabase)return;
  let disposed=false,inFlight=false;invalidate();pageOffset.current=0;
  const load=async()=>{
   if(disposed||inFlight||moreBusy.current)return;inFlight=true;
   try {
    const target=id?1:Math.max(20,rowsRef.current.length),batches:Order[]=[];let more=false;
    for(let start=0;start<target;start+=20){const r=id?await supabase!.rpc('order_by_slug',{p_slug:id}):await supabase!.rpc('list_orders_page',{p_limit:20,p_offset:start});if(r.error)throw r.error;const rows=r.data as Order[];batches.push(...rows);more=!id&&rows.length===20;if(!more)break;}
    const r={data:batches,error:null},time=await supabase!.rpc('server_time');
    if(disposed)return;if(r.error)throw r.error;
    if(id&&batches[0]?.slug&&id!==batches[0].slug)router.replace(orderUrl(batches[0]));setOrders(r.data as Order[]);pageOffset.current=batches.length;setHasMore(more);setError('');
    if(time.data)setOffset(new Date(time.data).getTime()-Date.now());setNow(Date.now());
   } catch(e){if(!disposed)setError(arabicError(e,'تعذر تحميل الطلبات. حاول مجدداً.'));}
   finally{inFlight=false;if(!disposed)setLoading(false);}
  };
  void load();const refresh=setInterval(()=>void load(),30000);
  const ch=supabase.channel('orders-'+(id??'all')).on('postgres_changes',{event:'*',schema:'public',table:'orders',filter:`user_id=eq.${profile!.id}`},()=>void load()).on('postgres_changes',{event:'INSERT',schema:'public',table:'order_events'},()=>void load()).subscribe();
  return()=>{disposed=true;invalidate();clearInterval(refresh);void supabase!.removeChannel(ch)};
 },[profile,id,revision,invalidate,router]);
 if(!authReady)return <div className="page-loading" role="status">جارٍ استعادة حسابك…</div>;
 if(!completeProfile(profile))return <div className="empty"><Package size={48}/><h2>طلباتك في مكان واحد</h2><p>{authError||'سجّل الدخول لمتابعة طلباتك.'}</p><button className="button" onClick={()=>requireAuth(()=>setRevision(n=>n+1))}>{authError?'إعادة المحاولة':'تسجيل الدخول'}</button></div>;
 if(loading&&supabase)return <div className="page-loading">جارٍ تحميل الطلبات…</div>;
 if(error)return <div className="empty"><p>{error}</p><button className="button" onClick={()=>setRevision(n=>n+1)}>إعادة المحاولة</button></div>;
 if(!orders.length)return <div className="empty"><Package size={48}/><h2>{id?'الطلب غير متاح':'لا توجد طلبات بعد'}</h2><Link href="/categories" className="button">تصفّح المتجر</Link></div>;
 return <div className="order-list">{orders.map(o=>{const remaining=Math.max(0,new Date(o.delivery_due_at).getTime()-(now+offset));const hours=Math.floor(remaining/3600000),minutes=Math.floor((remaining%3600000)/60000);return <article className="order-card" key={o.id}><div className="section-heading"><div><span className="eyebrow">طلب #{o.order_number}</span><h2>{statuses[o.status]}</h2><p className="muted">{new Date(o.created_at).toLocaleString('ar-IQ',{timeZone:'Asia/Baghdad'})}</p></div><strong>{money(o.total)}</strong></div>{!id?<Link className="text-button" href={orderUrl(o)}>تفاصيل ومتابعة الطلب<ArrowLeft size={18}/></Link>:<><div className="delivery-clock"><Clock size={25}/><div><strong>{['delivered','cancelled','returned'].includes(o.status)?'انتهت متابعة هذا الطلب':remaining?`${hours} ساعة و${minutes} دقيقة`:'تجاوز الطلب موعد التوصيل المتوقع'}</strong><p>موعد التوصيل: {new Date(o.delivery_due_at).toLocaleString('ar-IQ',{timeZone:'Asia/Baghdad'})}</p></div></div><h3>محتويات الطلب</h3>{o.order_items.map(i=><div className="ordered-item" key={i.id}>{i.image_url&&<img src={i.image_url} alt=""/>}<div><strong>{i.title}</strong><p>{i.color_name} · {i.quantity} قطعة</p></div><strong>{money(i.unit_price*i.quantity)}</strong></div>)}<div className="saved-address"><h3>عنوان التوصيل</h3><p>{o.shipping_snapshot.name} · {o.shipping_snapshot.phone}</p><p>{o.shipping_snapshot.governorate}، {o.shipping_snapshot.district}، {o.shipping_snapshot.details}</p><p>التوصيل: {money(o.delivery_fee)} · الدفع: {o.payment_method}</p></div>{(o.discount_amount??0)>0&&<p className="discount-row">خصم {o.shipping_snapshot.governorate}: −{money(o.discount_amount??0)}</p>}<h3>سجل الطلب</h3><ol className="timeline">{[...o.order_events].sort((a,b)=>a.created_at.localeCompare(b.created_at)).map(e=><li key={e.id}><strong>{statuses[e.status]}</strong><time>{new Date(e.created_at).toLocaleString('ar-IQ',{timeZone:'Asia/Baghdad'})}</time>{e.reason&&<p>{e.reason}</p>}{e.problem_type&&<p>{e.problem_type}</p>}{e.scheduled_at&&<p>الموعد الجديد: {new Date(e.scheduled_at).toLocaleString('ar-IQ',{timeZone:'Asia/Baghdad'})}</p>}</li>)}</ol></>}</article>})}{!id&&<InfiniteTrigger hasMore={hasMore} loading={loadingMore} error={moreError} onMore={loadMore}/>}</div>
}
