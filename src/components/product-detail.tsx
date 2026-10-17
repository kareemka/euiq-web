'use client';

import {use,useEffect,useState} from 'react';
import {useRouter} from 'next/navigation';
import Link from 'next/link';
import {Heart,Minus,Plus,ShoppingCart,ShieldCheck,Package,Truck,Money,CaretLeft,ArrowLeft,MagnifyingGlass} from '@phosphor-icons/react';
import {arabicError} from '@/lib/arabic-errors';
import {productUrl,categoryUrl,titleSlug,decodeSlug} from '@/lib/urls';
import {useStore} from '@/components/store-provider';
import {useCart} from '@/lib/cart';
import {money} from '@/lib/domain';
import {CatalogGrid} from '@/components/catalog-grid';
import {ProductMediaGallery} from '@/components/product-media-gallery';
import type {Product} from '@/lib/types';

export default function ProductPage({params,initialProduct}:{params:Promise<{slug:string}>;initialProduct?:Product}){
 const {slug:routeSlug}=use(params);
 const slug=decodeSlug(routeSlug);
 const router=useRouter();
 const {products,categories,settings,loading,error,reload,requireAuth,changeCart,notify,favorites,toggleFavorite}=useStore();
 const product=products.find(item=>(item.slug??titleSlug(item.title))===slug||item.id===slug)??initialProduct;
 const [selection,setSelection]=useState('');
 const [quantity,setQuantity]=useState(1);
 const [busy,setBusy]=useState(false);

 useEffect(()=>{
  if(product&&product.id===slug)router.replace(productUrl(product));
 },[product,slug,router]);

 if(loading)return <div className="page-loading" role="status">دا نحمّل المنتج…</div>;
 if(error)return <div className="wrap page"><div className="empty"><p>{error}</p><button className="button" onClick={()=>void reload()}>جرّب مرة ثانية</button></div></div>;
 if(!product)return <div className="wrap page"><div className="empty"><MagnifyingGlass size={48}/><h1>ما لگينا المنتج</h1><p>يمكن انحذف المنتج أو رابطه تغيّر.</p><Link href="/categories" className="button">شوف المنتجات</Link></div></div>;

 const variants=product.product_variants.filter(variant=>variant.active);
 const variant=variants.find(item=>item.id===selection)??variants[0];
 const available=variant?variant.stock_on_hand-variant.reserved:0;
 const category=categories.find(item=>item.id===product.category_id);
 const saved=favorites.includes(product.id);
 const discount=product.compare_at_price?Math.round((1-product.price/product.compare_at_price)*100):0;
 const related=[
  ...products.filter(item=>item.id!==product.id&&item.category_id===product.category_id),
  ...products.filter(item=>item.id!==product.id&&item.category_id!==product.category_id),
 ].slice(0,4);

 async function add(){
  if(!variant)return;
  setBusy(true);
  try{
   const old=useCart.getState().items.find(item=>item.variant_id===variant.id)?.quantity??0;
   await changeCart(variant.id,old+quantity);
   notify('انضاف للسلة');
  }catch(error){
   notify(arabicError(error));
  }finally{
   setBusy(false);
  }
 }

 return <div className="wrap page product-page">
  <nav className="breadcrumb" aria-label="مسار الصفحة">
   <Link href="/">الرئيسية</Link><CaretLeft size={14} aria-hidden="true"/>
   {category?<><Link href={categoryUrl(category)}>{category.title}</Link><CaretLeft size={14} aria-hidden="true"/></>:<><Link href="/categories">الكتالوج</Link><CaretLeft size={14} aria-hidden="true"/></>}
   <span aria-current="page">{product.title}</span>
  </nav>

  <div className="product-detail">
   <ProductMediaGallery key={product.id} title={product.title} images={product.images} videoUrl={product.video_url} discount={discount}/>
   <div className="product-info">
    {category&&<Link className="eyebrow" href={categoryUrl(category)}>{category.title}</Link>}
    <h1>{product.title}</h1>
    {product.summary&&<p className="summary">{product.summary}</p>}
    <div className="detail-price">
     <strong>{money(product.price)}</strong>
     {product.compare_at_price&&<><del>{money(product.compare_at_price)}</del><span className="discount">وفّر {money(product.compare_at_price-product.price)}</span></>}
    </div>
    <p className={`stock-status ${available>0?'':'soldout'}`}>
     <Package size={20}/>{available>0?<>متوفر بالمخزون<span>{variant?.color_name?`اللون ${variant.color_name} · `:''}باقي {available} قطع</span></>:'خلصت الكمية لهذا اللون'}
    </p>
    {variants.some(item=>item.color_name)&&<fieldset className="color-options">
     <legend>اختار اللون <span>{variant?.color_name}</span></legend>
     <div>{variants.map(item=><button
      key={item.id}
      className={`${variant?.id===item.id?'selected':''} ${item.stock_on_hand===item.reserved?'unavailable':''}`}
      aria-pressed={variant?.id===item.id}
      onClick={()=>{setSelection(item.id);setQuantity(1)}}
     ><i style={{backgroundColor:item.color_hex||'#aaa'}}/><strong>{item.color_name}</strong><small>{item.stock_on_hand-item.reserved>0?`${item.stock_on_hand-item.reserved} متوفر`:'نفد'}</small></button>)}</div>
    </fieldset>}
    <div className="quantity-row">
     <div><strong>الكمية</strong><p>تگدر تطلب قطعتين بس من هالمنتج، مهما اختلف اللون</p></div>
     <div className="quantity-control"><button aria-label="قلل الكمية" disabled={quantity<=1} onClick={()=>setQuantity(value=>value-1)}><Minus size={18}/></button><output aria-live="polite">{quantity}</output><button aria-label="زيد الكمية" disabled={quantity>=Math.min(2,available)} onClick={()=>setQuantity(value=>value+1)}><Plus size={18}/></button></div>
    </div>
    <div className="purchase-row">
     <button className="button purchase-button" disabled={!available||busy} onClick={()=>requireAuth(()=>void add())}><ShoppingCart size={22}/>{busy?'دا نضيفه…':available?'أضف إلى السلة':'خلصت الكمية'}</button>
     <button className={`icon-button favorite-toggle ${saved?'selected':''}`} aria-label={saved?'شيله من المفضلة':'ضيفه للمفضلة'} aria-pressed={saved} onClick={()=>toggleFavorite(product.id)}><Heart size={24} weight={saved?'fill':'regular'}/></button>
    </div>
    <ul className="detail-assurance"><li><ShieldCheck size={20}/>تغليف آمن يحفظ خصوصيتك</li><li><Truck size={20}/>توصيل داخل العراق</li><li><Money size={20}/>{settings.payment_method||'الدفع من تستلم'}</li></ul>
    <section className="detail-card" aria-labelledby="about-title"><h2 id="about-title">عن المنتج</h2>{product.details&&<p className="details-text">{product.details}</p>}<dl className="specs"><div><dt>المادة</dt><dd>{product.material||'مو محدد'}</dd></div><div><dt>بلد المنشأ</dt><dd>{product.origin||'مو محدد'}</dd></div></dl></section>
   </div>
  </div>

  {related.length>0&&<section className="catalog-section" aria-labelledby="related-title"><div className="section-heading"><h2 id="related-title">يمكن يعجبك هذا هم</h2><Link href={category?categoryUrl(category):'/categories'}>شوف بعد<ArrowLeft size={18}/></Link></div><CatalogGrid products={related}/></section>}
 </div>;
}
