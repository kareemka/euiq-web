'use client';
import {useEffect,useState,useCallback,useRef} from 'react';
import {InfiniteTrigger} from './infinite-trigger';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {orderUrl,decodeSlug} from '@/lib/urls';
import {Package,ArrowLeft,Clock,MapPin,WarningCircle} from '@phosphor-icons/react';
import {OrdersLoading} from './store-loading';
import {useStore} from './store-provider';
import {supabase,isDemo} from '@/lib/supabase';
import {demoOrders} from '@/lib/demo';
import {arabicError} from '@/lib/arabic-errors';
import {money,statuses,statusTones,completeProfile} from '@/lib/domain';
import type {Order} from '@/lib/types';
export function Orders({slug}:{slug?:string}){const {profile,storefront}=useStore();return <OrdersContent key={(profile?.id??'guest')+storefront+(slug??'')} slug={slug}/>;}
function OrdersContent({slug}:{slug?:string}){const id=slug?decodeSlug(slug):undefined;const router=useRouter();const {profile,storefront,authReady,authError,requireAuth}=useStore();const [orders,setOrders]=useState<Order[]>([]),[loading,setLoading]=useState(true),[error,setError]=useState(''),[now,setNow]=useState(0),[offset,setOffset]=useState(0),[revision,setRevision]=useState(0);
 const [hasMore,setHasMore]=useState(false),[loadingMore,setLoadingMore]=useState(false),[moreError,setMoreError]=useState('');
 const rowsRef=useRef(orders),pageOffset=useRef(0),moreBusy=useRef(false),generation=useRef(0);
 useEffect(()=>{rowsRef.current=orders;},[orders]);
 const invalidate=useCallback(()=>{generation.current++;moreBusy.current=false;},[]);
 const loadMore=useCallback(()=>{if(!supabase||id||moreBusy.current||!hasMore)return;const version=generation.current;moreBusy.current=true;setLoadingMore(true);setMoreError('');void(async()=>{try{const r=await supabase!.rpc('list_orders_page',{p_limit:20,p_offset:pageOffset.current,p_filters:{storefront}});if(r.error)throw r.error;if(version!==generation.current)return;const next=r.data as Order[];pageOffset.current+=next.length;setOrders(current=>[...current,...next.filter(o=>!current.some(x=>x.id===o.id))]);setHasMore(next.length===20);}catch(e){if(version===generation.current)setMoreError(arabicError(e));}finally{moreBusy.current=false;if(version===generation.current)setLoadingMore(false);}})();},[id,hasMore,storefront]);
 useEffect(()=>{const t=setInterval(()=>setNow(Date.now()),1000);return()=>clearInterval(t)},[]);
 useEffect(()=>{
  if(!completeProfile(profile)||!supabase)return;
  let disposed=false,inFlight=false;invalidate();pageOffset.current=0;
  const load=async()=>{
   if(disposed||inFlight||moreBusy.current)return;inFlight=true;
   try {
    const target=id?1:Math.max(20,rowsRef.current.length),batches:Order[]=[];let more=false;
    for(let start=0;start<target;start+=20){const r=id?await supabase!.rpc('order_by_slug_for_store',{p_slug:id,p_storefront:storefront}):await supabase!.rpc('list_orders_page',{p_limit:20,p_offset:start,p_filters:{storefront}});if(r.error)throw r.error;const rows=r.data as Order[];batches.push(...rows);more=!id&&rows.length===20;if(!more)break;}
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
 },[profile,id,revision,invalidate,router,storefront]);
 const list=isDemo?demoOrders.filter(o=>!id||o.slug===id):orders;
 const when=(value:string)=>new Date(value).toLocaleString('ar-IQ-u-nu-latn',{timeZone:'Asia/Baghdad',dateStyle:'medium',timeStyle:'short'});
 if(!authReady)return <OrdersLoading label="دا نرجّع حسابك…"/>;
 if(!completeProfile(profile))return <section className="personal-empty"><span className="personal-empty-icon"><Package size={32} aria-hidden="true"/></span><h2>كل طلباتك بمكان واحد</h2><p role={authError?'alert':undefined}>{authError||'سجّل دخولك حتى تشوف طلباتك وتتابع توصيلها.'}</p><button className="button" onClick={()=>requireAuth(()=>setRevision(n=>n+1))}>{authError?'جرّب مرة ثانية':'سجّل دخولك'}</button></section>;
 if(loading&&supabase)return <OrdersLoading/>;
 if(error)return <section className="personal-empty"><WarningCircle size={40} aria-hidden="true"/><h2>تعذّر تحميل الطلبات</h2><p role="alert">{error}</p><button className="button" onClick={()=>setRevision(n=>n+1)}>جرّب مرة ثانية</button></section>;
 if(!list.length)return <section className="personal-empty"><span className="personal-empty-icon"><Package size={32} aria-hidden="true"/></span><h2>{id?'الطلب مو موجود':'بعدك ما طلبت'}</h2><p>{id?'تأكد من الرابط أو افتح قائمة طلباتك.':'من تكمّل أول طلب، تفاصيله وحالته راح تظهر هنا.'}</p><Link href={id?'/orders':'/categories'} className="button">{id?'كل طلباتي':'شوف المنتجات'}<ArrowLeft size={18}/></Link></section>;
 return <div className={`order-list ${id?'order-detail-list':'order-summary-list'}`}>{list.map(o=>{const remaining=Math.max(0,new Date(o.delivery_due_at).getTime()-(now+offset));const hours=Math.floor(remaining/3600000),minutes=Math.floor((remaining%3600000)/60000);const finished=['delivered','cancelled','returned'].includes(o.status);const pieces=o.order_items.reduce((sum,item)=>sum+item.quantity,0);return <article className={`order-card ${!id?'order-history-card':''}`} key={o.id} aria-label={`طلب رقم ${o.order_number}`}>
  {!id?<>
   <div className="order-history-image" aria-hidden="true">
    {o.order_items[0]?.image_url?<img src={o.order_items[0].image_url} alt="" loading="lazy"/>:<Package size={32}/>}
    {o.order_items.length>1&&<span>+{o.order_items.length-1}</span>}
   </div>
   <div className="order-history-body">
    <header className="order-history-meta"><strong>طلب <bdi>#{o.order_number}</bdi></strong><span className={`status-badge ${statusTones[o.status]??'info'}`}>{statuses[o.status]??o.status}</span></header>
    <h2 className="order-history-title"><Link href={orderUrl(o)}>{o.order_items[0]?.title||`طلب #${o.order_number}`}</Link></h2>
    {o.order_items.length>1&&<p className="order-history-more">{o.order_items.length===2?'ومنتج آخر ضمن الطلب':`و${o.order_items.length-1} منتجات أخرى ضمن الطلب`}</p>}
   </div>
   <div className="order-history-facts">
    <span><Package size={16} aria-hidden="true"/>{pieces===1?'قطعة واحدة':pieces===2?'قطعتين':`${pieces} قطع`}</span>
    <span><MapPin size={16} aria-hidden="true"/>{o.shipping_snapshot.governorate}</span>
    <span><Clock size={16} aria-hidden="true"/><time dateTime={o.created_at}>{when(o.created_at)}</time></span>
   </div>
   <footer className="order-history-footer"><div><span>الإجمالي مع التوصيل</span><strong>{money(o.total)}</strong></div><Link className={`button ${finished?'secondary':''}`} href={orderUrl(o)} aria-label={`تفاصيل ومتابعة الطلب ${o.order_number}`}>{finished?'تفاصيل الطلب':'متابعة الطلب'}<ArrowLeft size={18}/></Link></footer>
  </>:<>
  <header className="order-head"><div><span className="eyebrow">طلب #{o.order_number}</span><time dateTime={o.created_at}>{when(o.created_at)}</time></div><span className={`status-badge ${statusTones[o.status]??'info'}`}>{statuses[o.status]??o.status}</span></header>
  <div className={`delivery-clock ${finished?'finished':''}`}><Clock size={26} aria-hidden="true"/><div><strong>{finished?'انتهت متابعة التوصيل لهذا الطلب':remaining?`باقي ${hours} ساعة و${minutes} دقيقة على الموعد المتوقع`:'مرّ موعد التوصيل المتوقع'}</strong><p>{finished?'الموعد المتوقع سابقاً: ':'التوصيل متوقع يوم: '}{when(o.delivery_due_at)}</p></div></div>
  <div className="order-detail-grid"><div className="order-detail-main"><section className="order-detail-section"><h3><Package size={21} aria-hidden="true"/>منتجات الطلب <span>({pieces} قطع)</span></h3><div className="ordered-items">{o.order_items.map(i=><div className="ordered-item" key={i.id}><span className="ordered-item-image">{i.image_url?<img src={i.image_url} alt="" loading="lazy"/>:<Package size={24} aria-hidden="true"/>}</span><div><strong>{i.title}</strong><p>{i.color_name?`${i.color_name} · `:''}{i.quantity} قطعة</p><small>{money(i.unit_price)} للقطعة</small></div><strong className="ordered-item-total">{money(i.unit_price*i.quantity)}</strong></div>)}</div></section>
  <section className="order-detail-section"><h3>تحديثات الطلب</h3>{o.order_events.length?<ol className="timeline">{[...o.order_events].sort((a,b)=>a.created_at.localeCompare(b.created_at)).map((e,index,events)=><li key={e.id} className={index===events.length-1?'latest':''}><strong>{statuses[e.status]??e.status}</strong><time dateTime={e.created_at}>{when(e.created_at)}</time>{e.reason&&<p>{e.reason}</p>}{e.problem_type&&<p>{e.problem_type}</p>}{e.scheduled_at&&<p>موعد ثاني: {when(e.scheduled_at)}</p>}</li>)}</ol>:<p className="fine">بعد ما انضافت تحديثات لهذا الطلب.</p>}</section></div>
  <aside className="order-detail-aside"><section className="order-totals"><h3>ملخّص المبلغ</h3><div><span>مجموع المنتجات</span><strong>{money(o.order_items.reduce((sum,item)=>sum+item.unit_price*item.quantity,0))}</strong></div><div><span>أجرة التوصيل</span><strong>{money(o.delivery_fee)}</strong></div>{(o.discount_amount??0)>0&&<div className="discount-row"><span>خصم {o.shipping_snapshot.governorate}</span><strong>−{money(o.discount_amount??0)}</strong></div>}<div className="total"><span>الإجمالي</span><strong>{money(o.total)}</strong></div><p>الدفع: {o.payment_method}</p></section>
  <section className="saved-address"><h3><MapPin size={20} aria-hidden="true"/>عنوان التوصيل</h3><strong>{o.shipping_snapshot.name}</strong><p><bdi>{o.shipping_snapshot.phone}</bdi></p><p>{o.shipping_snapshot.governorate}، {o.shipping_snapshot.district}</p><p>{o.shipping_snapshot.details}</p></section></aside></div></>}
 </article>})}{!id&&!isDemo&&<InfiniteTrigger hasMore={hasMore} loading={loadingMore} error={moreError} onMore={loadMore} loadingLabel="دا نحمّل طلبات أكثر…"/>}</div>
}
