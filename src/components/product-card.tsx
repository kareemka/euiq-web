'use client';

import {useState} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {Heart,ArrowLeft,ImageSquare} from '@phosphor-icons/react';
import {productUrl} from '@/lib/urls';
import {money} from '@/lib/domain';
import type {Product} from '@/lib/types';
import {useStore} from './store-provider';

export function ProductCard({product:p}:{product:Product}){
 const imageSources=p.images.filter((src):src is string=>typeof src==='string'&&src.trim().length>0);
 const [imageIndex,setImageIndex]=useState(0);
 const [loadedImage,setLoadedImage]=useState('');
 const imageSrc=imageSources[imageIndex];
 const {toggleFavorite,favorites,categories}=useStore();
 const available=p.product_variants.some(v=>v.active&&v.stock_on_hand-v.reserved>0);
 const discount=p.compare_at_price&&p.compare_at_price>p.price?Math.round((1-p.price/p.compare_at_price)*100):0;
 const saved=favorites.includes(p.id);
 const category=categories.find(c=>c.id===p.category_id);

 return <article className={`product-card ${available?'':'soldout'}`}>
  <div className="product-photo">
   {imageSrc&&loadedImage!==imageSrc&&<span className="product-image-loading skeleton-block" aria-hidden="true"/>}
   <Link href={productUrl(p)} tabIndex={-1} aria-hidden="true" className="product-photo-link">
    {imageSrc?(
     <Image src={imageSrc} alt={p.title} width={600} height={600} sizes="(max-width: 768px) calc((100vw - 48px) / 3), (max-width: 1000px) 33vw, 25vw" unoptimized onLoad={()=>setLoadedImage(imageSrc)} onError={()=>setImageIndex(index=>index+1)}/>
    ):(
     <span className="product-image-placeholder" aria-label={`ماكو صورة للمنتج ${p.title}`}><ImageSquare size={36}/></span>
    )}
   </Link>

   {(discount>0||!available)&&(
    <div className="badges">
     {discount>0&&<span className="discount">خصم {discount}%</span>}
     {!available&&<span className="soldout-badge">نفدت الكمية</span>}
    </div>
   )}

   <button className={`favorite ${saved?'selected':''}`} aria-label={saved?`شيل ${p.title} من المفضلة`:`ضيف ${p.title} للمفضلة`} aria-pressed={saved} onClick={()=>toggleFavorite(p.id)}>
    <Heart size={19} weight={saved?'fill':'regular'}/>
   </button>
  </div>

  <div className="product-copy">
   {category&&<span className="product-category">{category.title}</span>}
   <Link className="product-name" href={productUrl(p)} title={p.title}>
    {p.title}
   </Link>

   <div className="price-row">
    <strong className="product-price"><bdi className="product-price-amount">{money(p.price).replace(' د.ع','')}</bdi>{' '}<span className="product-price-currency">د.ع</span></strong>
    {discount>0&&p.compare_at_price!==null&&<del className="product-old-price">{money(p.compare_at_price)}</del>}
   </div>

   <div className="product-meta">
    <div className="swatch-mini">
     {p.product_variants.filter(v=>v.active&&v.color_name&&v.color_hex).slice(0,5).map(v=>(
      <span key={v.id} title={v.color_name??''} style={{backgroundColor:v.color_hex!}}/>
     ))}
    </div>
    <span className={`availability ${available?'':'soldout'}`}>
     <span className="availability-dot" aria-hidden="true"/>
     <span>{available?'موجود':'خلص'}</span>
    </span>
   </div>

   <Link className="product-cta" href={productUrl(p)} aria-label={`شوف تفاصيل ${p.title}`}>
    <span>شوف التفاصيل</span><ArrowLeft size={17}/>
   </Link>
  </div>
 </article>;
}
