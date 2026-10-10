import type {Product} from '@/lib/types';
import {ProductCard} from './product-card';
export function CatalogGrid({products,emptyTitle='لا توجد منتجات هنا بعد',emptyMessage='جرّب قسماً آخر أو عدّل البحث.'}:{products:Product[];emptyTitle?:string;emptyMessage?:string}){return products.length?<div className="product-grid">{products.map(p=><ProductCard key={p.id} product={p}/>)}</div>:<div className="empty"><h3>{emptyTitle}</h3><p>{emptyMessage}</p></div>}
