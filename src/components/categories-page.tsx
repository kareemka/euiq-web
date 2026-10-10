'use client';
import {Suspense,useState,useEffect} from 'react';
import {useSearchParams,useRouter} from 'next/navigation';
import {MagnifyingGlass} from '@phosphor-icons/react';
import {useStore} from '@/components/store-provider';
import {CatalogGrid} from '@/components/catalog-grid';
import {usePagedProducts} from '@/lib/use-paged-products';
import {InfiniteTrigger} from './infinite-trigger';
import {titleSlug} from '@/lib/urls';
export default function Page(){return <Suspense fallback={<div className="page-loading">جارٍ التحميل…</div>}><CategoryRoute/></Suspense>}
function CategoryRoute(){const params=useSearchParams();return <Categories key={params.toString()}/>}
function Categories(){const params=useSearchParams();const {products,categories,loading,error,reload}=useStore();const [query,setQuery]=useState(params.get('q')??''),[category,setCategory]=useState(params.get('category')??''),[available,setAvailable]=useState(false),[offers,setOffers]=useState(params.get('offers')==='1'),[sort,setSort]=useState('recommended'),[max,setMax]=useState('');
 const selectedCategory=categories.find(c=>c.id===category||(c.slug??titleSlug(c.title))===category);const router=useRouter();
 useEffect(()=>{const original=params.get('category');const legacy=categories.find(c=>c.id===original);if(legacy){const next=new URLSearchParams(params.toString());next.set('category',legacy.slug??titleSlug(legacy.title));router.replace('/categories?'+next.toString());}},[categories,params,router]);
 const page=usePagedProducts({query,category,available,offers,sort,max},products);
 const list=page.rows;
 return <div className="wrap page"><div className="page-heading"><span className="eyebrow">اختياراتك تبدأ هنا</span><h1>{selectedCategory?.title??'تصفّح المتجر'}</h1><p>ابحث عمّا يناسبك، واختر اللون الذي تفضّله.</p></div><div className="catalog-layout"><aside className="filters"><h2>تصفية المنتجات</h2><label>القسم<select value={selectedCategory?.slug??category} onChange={e=>setCategory(e.target.value)}><option value="">جميع الأقسام</option>{categories.map(c=><option key={c.id} value={c.slug??titleSlug(c.title)}>{c.title}</option>)}</select></label><label>السعر الأقصى (د.ع)<input type="number" min={0} value={max} onChange={e=>setMax(e.target.value)} placeholder="بدون حد"/></label><label className="check"><input type="checkbox" checked={available} onChange={e=>setAvailable(e.target.checked)}/>المتوفر فقط</label><label className="check"><input type="checkbox" checked={offers} onChange={e=>setOffers(e.target.checked)}/>العروض فقط</label><button className="text-button" onClick={()=>{setQuery('');setCategory('');setMax('');setAvailable(false);setOffers(false);setSort('recommended')}}>مسح التصفية</button></aside><section className="catalog-results"><div className="results-toolbar"><div className="search-bar"><MagnifyingGlass size={21}/><input value={query} onChange={e=>setQuery(e.target.value)} aria-label="ابحث عن منتج" placeholder="اسم المنتج أو وصفه…"/></div><select aria-label="ترتيب النتائج" value={sort} onChange={e=>setSort(e.target.value)}><option value="recommended">الترتيب المقترح</option><option value="low">السعر: الأقل أولاً</option><option value="high">السعر: الأعلى أولاً</option></select></div><p className="muted results-count">{list.length} منتج محمّل</p>{(loading||page.loading)&&!list.length?<div className="page-loading">جارٍ تحميل المنتجات…</div>:(error||page.error)&&!list.length?<div className="empty"><p>{error||page.error}</p><button className="button" onClick={()=>{void reload();page.refresh();}}>إعادة المحاولة</button></div>:<><CatalogGrid products={list}/><InfiniteTrigger hasMore={page.hasMore} loading={page.loading} error={page.error} onMore={page.loadMore}/></>}</section></div></div>
}

