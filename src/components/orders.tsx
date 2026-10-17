'use client';
import {useEffect,useState,useCallback,useRef} from 'react';
import {InfiniteTrigger} from './infinite-trigger';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {orderUrl,decodeSlug} from '@/lib/urls';
import {Package,ArrowLeft,ArrowRight,Clock,MapPin} from '@phosphor-icons/react';
import {useStore} from './store-provider';
import {supabase,isDemo} from '@/lib/supabase';
import {demoOrders} from '@/lib/demo';
import {arabicError} from '@/lib/arabic-errors';
import {money,statuses,statusTones,completeProfile} from '@/lib/domain';
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
   } catch(e){if(!disposed)setError(arabicError(e,'ما گدرنا نحمّل الطلبات. جرّب مرة ثانية.'));}
   finally{inFlight=false;if(!disposed)setLoading(false);}
  };
  void load();const refresh=setInterval(()=>void load(),30000);
  const ch=supabase.channel('orders-'+(id??'all')).on('postgres_changes',{event:'*',schema:'public',table:'orders',filter:`user_id=eq.${profile!.id}`},()=>void load()).on('postgres_changes',{event:'INSERT',schema:'public',table:'order_events'},()=>void load()).subscribe();
  return()=>{disposed=true;invalidate();clearInterval(refresh);void supabase!.removeChannel(ch)};
 },[profile,id,revision,invalidate,router]);
 const list=isDemo?demoOrders.filter(o=>!id||o.slug===id):orders;
 const when=(value:string)=>new Date(value).toLocaleString('ar-IQ-u-nu-latn',{timeZone:'Asia/Baghdad',dateStyle:'medium',timeStyle:'short'});
 if(!authReady)return <div className="page-loading" role="status">دا نرجّع حسابك…</div>;
 if(!completeProfile(profile))return <div className="empty"><Package size={48}/><h2>كل طلباتك بمكان واحد</h2><p>{authError||'سجّل دخولك حتى تتابع طلباتك.'}</p><button className="button" onClick={()=>requireAuth(()=>setRevision(n=>n+1))}>{authError?'جرّب مرة ثانية':'سجّل دخولك'}</button></div>;
 if(loading&&supabase)return <div className="page-loading" role="status">دا نحمّل الطلبات…</div>;
 if(error)return <div className="empty"><p>{error}</p><button className="button" onClick={()=>setRevision(n=>n+1)}>جرّب مرة ثانية</button></div>;
 if(!list.length)return <div className="empty"><Package size={48}/><h2>{id?'الطلب غير متوفر':'ماكو طلبات هسه'}</h2><p>{id?'تحقق من الرابط أو افتح قائمة طلباتك.':'من تطلب شي، تگدر تتابع حالته من هنا.'}</p><Link href={id?'/orders':'/categories'} className="button">{id?'كل طلباتي':'تفرّج على المتجر'}</Link></div>;
 return <div className="order-list">{list.map(o=>{const remaining=Math.max(0,new Date(o.delivery_due_at).getTime()-(now+offset));const hours=Math.floor(remaining/3600000),minutes=Math.floor((remaining%3600000)/60000);const finished=['delivered','cancelled','returned'].includes(o.status);return <article className="order-card" key={o.id}>
  <header className="order-head"><div><span className="eyebrow">طلب #{o.order_number}</span><time dateTime={o.created_at}>{when(o.created_at)}</time></div><span className={`status-badge ${statusTones[o.status]??'info'}`}>{statuses[o.status]??o.status}</span></header>
  {!id?<><div className="order-preview">{o.order_items.slice(0,4).map(i=>i.image_url?<img key={i.id} src={i.image_url} alt=""/>:null)}<p>{o.order_items.map(i=>i.title).join('، ')}</p></div><footer className="order-foot"><strong>{money(o.total)}</strong><Link className="button secondary" href={orderUrl(o)}>تفاصيل الطلب ومتابعته<ArrowLeft size={18}/></Link></footer></>:<>
  <div className={`delivery-clock ${finished?'finished':''}`}><Clock size={26}/><div><strong>{finished?'خلصت متابعة هذا الطلب':remaining?`باقي ${hours} ساعة و${minutes} دقيقة`:'الطلب تأخر عن موعد التوصيل'}</strong><p>التوصيل متوقع يوم: {when(o.delivery_due_at)}</p></div></div>
  <h3>شنو بطلبك</h3><div className="ordered-items">{o.order_items.map(i=><div className="ordered-item" key={i.id}>{i.image_url&&<img src={i.image_url} alt=""/>}<div><strong>{i.title}</strong><p>{i.color_name?`${i.color_name} · `:''}{i.quantity} قطعة</p></div><strong>{money(i.unit_price*i.quantity)}</strong></div>)}</div>
  <div className="order-totals"><div><span>أجرة التوصيل</span><strong>{money(o.delivery_fee)}</strong></div>{(o.discount_amount??0)>0&&<div className="discount-row"><span>خصم {o.shipping_snapshot.governorate}</span><strong>−{money(o.discount_amount??0)}</strong></div>}<div className="total"><span>الإجمالي</span><strong>{money(o.total)}</strong></div><p>الدفع: {o.payment_method}</p></div>
  <div className="saved-address"><h3><MapPin size={20}/>عنوان التوصيل</h3><p>{o.shipping_snapshot.name} · <span dir="ltr">{o.shipping_snapshot.phone}</span></p><p>{o.shipping_snapshot.governorate}، {o.shipping_snapshot.district}، {o.shipping_snapshot.details}</p></div>
  <h3>شلون مشت حالة الطلب</h3><ol className="timeline">{[...o.order_events].sort((a,b)=>a.created_at.localeCompare(b.created_at)).map(e=><li key={e.id}><strong>{statuses[e.status]??e.status}</strong><time dateTime={e.created_at}>{when(e.created_at)}</time>{e.reason&&<p>{e.reason}</p>}{e.problem_type&&<p>{e.problem_type}</p>}{e.scheduled_at&&<p>موعد ثاني: {when(e.scheduled_at)}</p>}</li>)}</ol>
  <Link className="text-button" href="/orders"><ArrowRight size={18}/>كل طلباتي</Link></>}
 </article>})}{!id&&!isDemo&&<InfiniteTrigger hasMore={hasMore} loading={loadingMore} error={moreError} onMore={loadMore}/>}</div>
}
