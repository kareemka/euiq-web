'use client';
import {arabicError} from '@/lib/arabic-errors';
import {use,useState,useRef,useEffect} from 'react';
import {useRouter} from 'next/navigation';
import {productUrl,categoryUrl,titleSlug,decodeSlug} from '@/lib/urls';
import Link from 'next/link';
import {Heart,Minus,Plus,ShoppingCart,ShieldCheck,Package,Truck,Money,CaretLeft,ArrowLeft,MagnifyingGlass} from '@phosphor-icons/react';
import {useStore} from '@/components/store-provider';
import {useCart} from '@/lib/cart';
import {money} from '@/lib/domain';
import {CatalogGrid} from '@/components/catalog-grid';
import type {Product} from '@/lib/types';
export default function ProductPage({params,initialProduct}:{params:Promise<{slug:string}>;initialProduct?:Product}){const {slug:routeSlug}=use(params);const slug=decodeSlug(routeSlug);const router=useRouter();const {products,categories,settings,loading,error,reload,requireAuth,changeCart,notify,favorites,toggleFavorite}=useStore();const p=products.find(p=>(p.slug??titleSlug(p.title))===slug||p.id===slug)??initialProduct;const [selection,setSelection]=useState(''),[quantity,setQuantity]=useState(1),[image,setImage]=useState(0),[busy,setBusy]=useState(false);const touch=useRef(0);
 useEffect(()=>{if(p && p.id===slug)router.replace(productUrl(p));},[p,slug,router]);
 if(loading)return <div className="page-loading" role="status">دا نحمّل المنتج…</div>;
 if(error)return <div className="wrap page"><div className="empty"><p>{error}</p><button className="button" onClick={()=>void reload()}>جرّب مرة ثانية</button></div></div>;
 if(!p)return <div className="wrap page"><div className="empty"><MagnifyingGlass size={48}/><h1>ما لگينا المنتج</h1><p>يمكن انحذف المنتج أو رابطه تغيّر.</p><Link href="/categories" className="button">شوف المنتجات</Link></div></div>;
 const variants=p.product_variants.filter(v=>v.active);const variant=variants.find(v=>v.id===selection)??variants[0];const available=variant?variant.stock_on_hand-variant.reserved:0;
 const category=categories.find(c=>c.id===p.category_id),saved=favorites.includes(p.id),discount=p.compare_at_price?Math.round((1-p.price/p.compare_at_price)*100):0;
 // Same category first, topped up with other products so the row is never a lone card.
 const related=[...products.filter(x=>x.id!==p.id&&x.category_id===p.category_id),...products.filter(x=>x.id!==p.id&&x.category_id!==p.category_id)].slice(0,4);
 async function add(){if(!variant)return;setBusy(true);try{const old=useCart.getState().items.find(i=>i.variant_id===variant.id)?.quantity??0;await changeCart(variant.id,old+quantity);notify('انضاف للسلة');}catch(e){notify(arabicError(e))}finally{setBusy(false)}}
 return <div className="wrap page product-page">
 <nav className="breadcrumb" aria-label="مسار الصفحة"><Link href="/">الرئيسية</Link><CaretLeft size={14} aria-hidden="true"/>{category?<><Link href={categoryUrl(category)}>{category.title}</Link><CaretLeft size={14} aria-hidden="true"/></>:<><Link href="/categories">الكتالوج</Link><CaretLeft size={14} aria-hidden="true"/></>}<span aria-current="page">{p.title}</span></nav>
 <div className="product-detail"><div className="gallery"><div className="gallery-main" onTouchStart={e=>{touch.current=e.touches[0].clientX}} onTouchEnd={e=>{const delta=e.changedTouches[0].clientX-touch.current;if(Math.abs(delta)>40)setImage(i=>(i+(delta>0?1:-1)+p.images.length)%p.images.length)}}><img src={p.images[image]??p.images[0]} alt={`${p.title} — الصورة ${image+1}`}/>{discount>0&&<span className="discount">خصم {discount}%</span>}{p.images.length>1&&<span className="gallery-count">{image+1} / {p.images.length}</span>}</div>{p.images.length>1&&<div className="thumbnails">{p.images.map((src,i)=><button key={src+i} className={image===i?'selected':''} aria-label={`عرض الصورة ${i+1}`} aria-pressed={image===i} onClick={()=>setImage(i)}><img src={src} alt=""/></button>)}</div>}{p.video_url&&<section className="video-section"><h2>فيديو يشرح المنتج</h2><video controls preload="metadata" src={p.video_url} playsInline/></section>}</div>
 <div className="product-info">{category&&<Link className="eyebrow" href={categoryUrl(category)}>{category.title}</Link>}<h1>{p.title}</h1>{p.summary&&<p className="summary">{p.summary}</p>}
  <div className="detail-price"><strong>{money(p.price)}</strong>{p.compare_at_price&&<><del>{money(p.compare_at_price)}</del><span className="discount">وفّر {money(p.compare_at_price-p.price)}</span></>}</div>
  <p className={`stock-status ${available>0?'':'soldout'}`}><Package size={20}/>{available>0?<>متوفر بالمخزون<span>{variant?.color_name?`اللون ${variant.color_name} · `:''}باقي {available} قطع</span></>:'خلصت الكمية لهذا اللون'}</p>
  {variants.some(v=>v.color_name)&&<fieldset className="color-options"><legend>اختار اللون <span>{variant?.color_name}</span></legend><div>{variants.map(v=><button key={v.id} className={`${variant?.id===v.id?'selected':''} ${v.stock_on_hand===v.reserved?'unavailable':''}`} aria-pressed={variant?.id===v.id} onClick={()=>{setSelection(v.id);setQuantity(1)}}><i style={{backgroundColor:v.color_hex||'#aaa'}}/><strong>{v.color_name}</strong><small>{v.stock_on_hand-v.reserved>0?`${v.stock_on_hand-v.reserved} متوفر`:'نفد'}</small></button>)}</div></fieldset>}
  <div className="quantity-row"><div><strong>الكمية</strong><p>تگدر تطلب قطعتين بس من هالمنتج، مهما اختلف اللون</p></div><div className="quantity-control"><button aria-label="قلل الكمية" disabled={quantity<=1} onClick={()=>setQuantity(q=>q-1)}><Minus size={18}/></button><output aria-live="polite">{quantity}</output><button aria-label="زيد الكمية" disabled={quantity>=Math.min(2,available)} onClick={()=>setQuantity(q=>q+1)}><Plus size={18}/></button></div></div>
  <div className="purchase-row"><button className="button purchase-button" disabled={!available||busy} onClick={()=>requireAuth(()=>void add())}><ShoppingCart size={22}/>{busy?'دا نضيفه…':available?'أضف إلى السلة':'خلصت الكمية'}</button><button className={`icon-button favorite-toggle ${saved?'selected':''}`} aria-label={saved?'شيله من المفضلة':'ضيفه للمفضلة'} aria-pressed={saved} onClick={()=>toggleFavorite(p.id)}><Heart size={24} weight={saved?'fill':'regular'}/></button></div>
  <ul className="detail-assurance"><li><ShieldCheck size={20}/>تغليف آمن يحفظ خصوصيتك</li><li><Truck size={20}/>توصيل داخل العراق</li><li><Money size={20}/>{settings.payment_method||'الدفع من تستلم'}</li></ul>
  <section className="detail-card" aria-labelledby="about-title"><h2 id="about-title">عن المنتج</h2>{p.details&&<p className="details-text">{p.details}</p>}<dl className="specs"><div><dt>المادة</dt><dd>{p.material||'مو محدد'}</dd></div><div><dt>بلد المنشأ</dt><dd>{p.origin||'مو محدد'}</dd></div></dl></section>
 </div></div>
 {related.length>0&&<section className="catalog-section" aria-labelledby="related-title"><div className="section-heading"><h2 id="related-title">يمكن يعجبك هذا هم</h2><Link href={category?categoryUrl(category):'/categories'}>شوف بعد<ArrowLeft size={18}/></Link></div><CatalogGrid products={related}/></section>}
 </div>
}
