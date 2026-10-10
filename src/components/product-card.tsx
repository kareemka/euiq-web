'use client';
import Link from 'next/link';
import {productUrl} from '@/lib/urls';
import Image from 'next/image';
import {Heart,ShoppingCart,ArrowLeft} from '@phosphor-icons/react';
import {money} from '@/lib/domain';
const storageOrigin = process.env.NEXT_PUBLIC_SUPABASE_URL;
function canOptimizeImage(src: string) {
 if (src.startsWith('/')) return true;
 if (!storageOrigin) return false;
 try { const image = new URL(src); return image.origin === new URL(storageOrigin).origin && image.pathname.startsWith('/storage/v1/object/public/') && !image.search; } catch { return false; }
}
import type {Product} from '@/lib/types';
import {useStore} from './store-provider';
export function ProductCard({product:p}:{product:Product}){
 const {toggleFavorite,favorites}=useStore();const available=p.product_variants.some(v=>v.active&&v.stock_on_hand-v.reserved>0);const discount=p.compare_at_price?Math.round((1-p.price/p.compare_at_price)*100):0;
 return <article className="product-card"><div className="product-photo"><Link href={productUrl(p)} tabIndex={-1}><Image src={p.images[0]} alt={p.title} width={640} height={500} sizes="(max-width: 760px) 45vw, 300px" unoptimized={!canOptimizeImage(p.images[0])}/></Link><button className={`favorite ${favorites.includes(p.id)?'selected':''}`} aria-label={favorites.includes(p.id)?'إزالة من المفضلة':'إضافة للمفضلة'} onClick={()=>toggleFavorite(p.id)}><Heart size={22} weight={favorites.includes(p.id)?'fill':'regular'}/></button>{discount>0&&<span className="discount">خصم {discount}%</span>}</div><div className="product-copy"><div className="swatch-mini">{p.product_variants.filter(v=>v.active&&v.color_name&&v.color_hex).map(v=><span key={v.id} title={v.color_name??''} style={{backgroundColor:v.color_hex!}}/>)}</div><Link className="product-name" href={productUrl(p)}>{p.title}</Link><div className="price-row"><strong>{money(p.price)}</strong>{p.compare_at_price&&<del>{money(p.compare_at_price)}</del>}</div><span className={`availability ${available?'':'soldout'}`}>{available?'متوفر بالمخزون':'نفدت الكمية'}</span><Link className={`product-cta ${!available?'disabled':''}`} href={productUrl(p)}><ShoppingCart size={18}/>{available?'اختر اللون وأضف للسلة':'عرض التفاصيل'}<ArrowLeft size={16}/></Link></div></article>
}

