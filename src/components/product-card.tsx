'use client';
import Link from 'next/link';
import {productUrl} from '@/lib/urls';
import Image from 'next/image';
import {Heart,ShoppingCart,ArrowLeft,ImageSquare} from '@phosphor-icons/react';
import {money} from '@/lib/domain';
import type {Product} from '@/lib/types';
import {useStore} from './store-provider';
import {useState} from 'react';
export function ProductCard({product:p}:{product:Product}){
 const imageSources=p.images.filter((src):src is string=>typeof src==='string'&&src.trim().length>0);const [imageIndex,setImageIndex]=useState(0);const imageSrc=imageSources[imageIndex];
 const {toggleFavorite,favorites,categories}=useStore();const available=p.product_variants.some(v=>v.active&&v.stock_on_hand-v.reserved>0);const discount=p.compare_at_price?Math.round((1-p.price/p.compare_at_price)*100):0;const saved=favorites.includes(p.id);const category=categories.find(c=>c.id===p.category_id);
 return <article className={`product-card ${available?'':'soldout'}`}><div className="product-photo"><Link href={productUrl(p)} tabIndex={-1} aria-hidden="true">{imageSrc?<Image src={imageSrc} alt={p.title} width={600} height={600} sizes="(max-width: 359px) 100vw, (max-width: 760px) 50vw, (max-width: 1100px) 33vw, 22vw" unoptimized onError={()=>setImageIndex(index=>index+1)}/>:<span className="product-image-placeholder" aria-label={`ماكو صورة للمنتج ${p.title}`}><ImageSquare size={36}/></span>}</Link>{(discount>0||!available)&&<div className="badges">{!available&&<span className="soldout-badge">خلصت الكمية</span>}{discount>0&&<span className="discount">خصم {discount}%</span>}</div>}<button className={`favorite ${saved?'selected':''}`} aria-label={saved?`شيل ${p.title} من المفضلة`:`ضيف ${p.title} للمفضلة`} aria-pressed={saved} onClick={()=>toggleFavorite(p.id)}><Heart size={21} weight={saved?'fill':'regular'}/></button></div><div className="product-copy">{category&&<span className="product-category">{category.title}</span>}<Link className="product-name" href={productUrl(p)}>{p.title}</Link><div className="price-row"><strong>{money(p.price)}</strong>{p.compare_at_price&&<del>{money(p.compare_at_price)}</del>}</div><div className="product-meta"><div className="swatch-mini">{p.product_variants.filter(v=>v.active&&v.color_name&&v.color_hex).slice(0,5).map(v=><span key={v.id} title={v.color_name??''} style={{backgroundColor:v.color_hex!}}/>)}</div><span className={`availability ${available?'':'soldout'}`}>{available?'موجود':'خلص'}</span></div><Link className={`product-cta ${!available?'disabled':''}`} href={productUrl(p)} aria-label={`شوف التفاصيل: ${p.title}`}>{available?<><ShoppingCart size={18}/>شوف التفاصيل</>:'شوف التفاصيل'}<ArrowLeft size={16}/></Link></div></article>
}
