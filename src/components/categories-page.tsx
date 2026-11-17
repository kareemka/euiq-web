'use client';

import {Suspense,useState,useEffect,useRef} from 'react';
import {useSearchParams,useRouter} from 'next/navigation';
import {MagnifyingGlass,Funnel,X,Check,SquaresFour} from '@phosphor-icons/react';
import {useStore} from './store-provider';
import {CatalogGrid} from './catalog-grid';
import {usePagedProducts} from '@/lib/use-paged-products';
import {InfiniteTrigger} from './infinite-trigger';
import {CategoriesLoading,CategoryTabsLoading,LoadingStatus,ProductGridLoading} from './store-loading';
import {titleSlug} from '@/lib/urls';
import {money,priceSteps} from '@/lib/domain';
import {isDemo} from '@/lib/supabase';
import {demoCatalogPage} from '@/lib/demo';
import type {Product} from '@/lib/types';

type CatalogFilters={query:string;category:string;available:boolean;offers:boolean;sort:string;max:string};
export default function Page(){return <Suspense fallback={<CategoriesLoading/>}><CategoryRoute/></Suspense>}
function CategoryRoute(){const params=useSearchParams();return <Categories key={params.toString()}/>}

function Categories(){
 const params=useSearchParams(),router=useRouter();
 const {products,categories,storefront,loading,error,reload}=useStore();
 const [query,setQuery]=useState(params.get('q')??''),[category,setCategory]=useState(params.get('category')??'');
 const [available,setAvailable]=useState(params.get('available')==='1'),[offers,setOffers]=useState(params.get('offers')==='1');
 const [sort,setSort]=useState(params.get('sort')??'recommended'),[max,setMax]=useState(params.get('max')??'');
 const [filtersOpen,setFiltersOpen]=useState(false),[categorySearch,setCategorySearch]=useState('');
 const sheet=useRef<HTMLDialogElement>(null);
 const orderedCategories=[...categories].sort((a,b)=>a.sort_order-b.sort_order);
 const selectedCategory=categories.find(c=>c.id===category||(c.slug??titleSlug(c.title))===category);
 const categoryValue=(c:typeof categories[number])=>c.slug??titleSlug(c.title);
 const visibleCategories=orderedCategories.filter(c=>c.title.includes(categorySearch.trim()));
 const filters={query,category,available,offers,sort,max};
 const steps=priceSteps(products.map(p=>p.price));
 const active=[
  query.trim()&&{label:`بحث: ${query.trim()}`,clear:()=>setQuery('')},
  category&&{label:selectedCategory?.title??'القسم المختار',clear:()=>setCategory('')},
  Number(max)>0&&{label:`لحد ${money(Number(max))}`,clear:()=>setMax('')},
  available&&{label:'المتوفر فقط',clear:()=>setAvailable(false)},
  offers&&{label:'العروض فقط',clear:()=>setOffers(false)}
 ].filter(f=>!!f);
 const clearAll=()=>{setQuery('');setCategory('');setMax('');setAvailable(false);setOffers(false);setSort('recommended');setCategorySearch('')};
 const closeFilters=()=>{setFiltersOpen(false);sheet.current?.close();};

 useEffect(()=>{
  const original=params.get('category'),legacy=categories.find(c=>c.id===original);
  if(legacy){const next=new URLSearchParams(params.toString());next.set('category',legacy.slug??titleSlug(legacy.title));router.replace('/categories?'+next.toString(),{scroll:false});}
 },[categories,params,router]);
 useEffect(()=>{const dialog=sheet.current;if(!dialog)return;if(filtersOpen&&!dialog.open)dialog.showModal();if(!filtersOpen&&dialog.open)dialog.close();},[filtersOpen]);
 useEffect(()=>{const desktop=window.matchMedia('(min-width: 1200px)');const close=()=>{if(desktop.matches){setFiltersOpen(false);sheet.current?.close();}};desktop.addEventListener('change',close);return()=>desktop.removeEventListener('change',close);},[]);
 useEffect(()=>{if(window.location.hash==='#catalog-search')document.getElementById('catalog-search')?.focus();},[]);

 const filterControls=(scope:string)=><div className="filter-sheet-body">
  <fieldset className="filter-group category-filter-group"><legend>القسم</legend>
   {categories.length>5&&<label className="category-filter-search"><MagnifyingGlass size={18} aria-hidden="true"/><input type="search" value={categorySearch} onChange={e=>setCategorySearch(e.target.value)} placeholder="دوّر على قسم…" aria-label="البحث داخل الأقسام"/></label>}
   <div className="category-radio-list">
    <label className={`category-radio ${!category?'is-selected':''}`}><input type="radio" name={`category-${scope}`} checked={!category} onChange={()=>setCategory('')}/><SquaresFour size={18} aria-hidden="true"/><span>كل الأقسام</span></label>
    {visibleCategories.map(c=><label key={c.id} className={`category-radio ${selectedCategory?.id===c.id?'is-selected':''}`}><input type="radio" name={`category-${scope}`} checked={selectedCategory?.id===c.id} onChange={()=>setCategory(categoryValue(c))}/><span>{c.title}</span></label>)}
    {!visibleCategories.length&&categorySearch&&<p className="category-search-empty">ماكو قسم بهذا الاسم.</p>}
   </div>
  </fieldset>
  <fieldset className="filter-group"><legend>ميزانيتك</legend>
   {steps.length>0&&<div className="price-filter-choices">{steps.map(step=><button key={step} type="button" className="choice" aria-pressed={max===String(step)} onClick={()=>setMax(max===String(step)?'':String(step))}>لحد {money(step)}</button>)}</div>}
   <label className="filter-price-input">أعلى سعر (د.ع)<input type="number" inputMode="numeric" min={0} value={max} onChange={e=>setMax(e.target.value)} placeholder="أي سعر"/></label>
  </fieldset>
  <fieldset className="filter-group"><legend>خيارات إضافية</legend><label className="filter-check"><input type="checkbox" checked={available} onChange={e=>setAvailable(e.target.checked)}/><span>المتوفر فقط</span></label><label className="filter-check"><input type="checkbox" checked={offers} onChange={e=>setOffers(e.target.checked)}/><span>العروض والتخفيضات فقط</span></label></fieldset>
 </div>;

 return <div className="wrap page catalog-page">
  <div className="page-heading catalog-intro"><h1>{selectedCategory?.title??'كل المنتجات'}</h1><p>اختار القسم، وحدّد السعر والمواصفات اللي تناسبك.</p></div>
  <section className="catalog-category-bar" aria-labelledby="catalog-category-title">
   <div className="catalog-category-heading"><h2 id="catalog-category-title">تسوّق حسب القسم</h2><span>{category?selectedCategory?.title??'قسم محدد':'كل الأقسام'}</span></div>
   {loading&&!categories.length?<CategoryTabsLoading/>:<div className="catalog-category-tabs" role="group" aria-label="اختيار قسم المنتجات">
    <button type="button" aria-pressed={!category} onClick={()=>setCategory('')}><SquaresFour size={18} aria-hidden="true"/>كل الأقسام</button>
    {orderedCategories.map(c=><button key={c.id} type="button" aria-pressed={selectedCategory?.id===c.id} onClick={()=>setCategory(categoryValue(c))}>{selectedCategory?.id===c.id&&<Check size={16} weight="bold" aria-hidden="true"/>}{c.title}</button>)}
   </div>}
  </section>
  <div className="catalog-toolbar">
   <div className="search-bar"><MagnifyingGlass size={20} aria-hidden="true"/><input id="catalog-search" type="search" value={query} onChange={e=>setQuery(e.target.value)} aria-label="البحث في المنتجات" placeholder={selectedCategory?`دوّر داخل ${selectedCategory.title}…`:'دوّر على منتج…'}/></div>
   <button type="button" className="filter-toggle" aria-haspopup="dialog" aria-controls="catalog-filter-sheet" aria-expanded={filtersOpen} onClick={()=>setFiltersOpen(true)}><Funnel size={20}/>الفلاتر{active.length>0&&<b>{active.length}</b>}</button>
   <label className="catalog-sort"><span>ترتيب حسب</span><select className="sort-select" aria-label="ترتيب المنتجات" value={sort} onChange={e=>setSort(e.target.value)}><option value="recommended">الأنسب إلك</option><option value="low">السعر: الأقل أولًا</option><option value="high">السعر: الأعلى أولًا</option></select></label>
  </div>
  {active.length>0&&<div className="active-filters" role="group" aria-label="الفلاتر المطبّقة">{active.map(f=><button key={f.label} type="button" aria-label={`إزالة فلتر ${f.label}`} onClick={f.clear}>{f.label}<X size={14} aria-hidden="true"/></button>)}<button type="button" className="text-button" onClick={clearAll}>مسح الكل</button></div>}
  <div className="catalog-layout">
   <aside className="desktop-filters" aria-labelledby="desktop-filter-title"><div className="sidebar-heading"><h2 id="desktop-filter-title"><Funnel size={18}/>تصفية النتائج</h2>{active.length>0&&<button type="button" className="text-button" onClick={clearAll}>مسح</button>}</div>{filterControls('desktop')}</aside>
   <CatalogResults key={JSON.stringify({...filters,storefront})} filters={filters} initialProducts={products} categoryId={selectedCategory?.id} storefront={storefront} storeLoading={loading} storeError={error} reload={reload} onClear={clearAll}/>
  </div>
  <dialog ref={sheet} id="catalog-filter-sheet" className="filter-sheet" aria-labelledby="filter-title" onClose={()=>setFiltersOpen(false)} onClick={e=>{if(e.target!==e.currentTarget)return;const bounds=e.currentTarget.getBoundingClientRect();if(e.clientX<bounds.left||e.clientX>bounds.right||e.clientY<bounds.top||e.clientY>bounds.bottom)closeFilters();}}>
   <div className="filter-sheet-head"><div><h2 id="filter-title">فلترة المنتجات</h2><p>اختياراتك تحدّث النتائج مباشرة.</p></div><button type="button" className="icon-button" aria-label="إغلاق الفلاتر" autoFocus onClick={closeFilters}><X size={22}/></button></div>
   {filterControls('mobile')}
   <div className="filter-sheet-foot"><button type="button" className="button secondary" onClick={clearAll}>مسح الكل</button><button type="button" className="button" onClick={closeFilters}>شوف النتائج</button></div>
  </dialog>
 </div>;
}

// A new filter selection starts its own result set so previous-category products never flash under a new heading.
function CatalogResults({filters,initialProducts,categoryId,storefront,storeLoading,storeError,reload,onClear}:{filters:CatalogFilters;initialProducts:Product[];categoryId?:string;storefront:'adult'|'market';storeLoading:boolean;storeError:string;reload:()=>Promise<void>;onClear:()=>void}){
 const filtered=Boolean(filters.query.trim()||filters.category||filters.available||filters.offers||Number(filters.max)>0||filters.sort!=='recommended');
 const remote=usePagedProducts(filters,filtered?[]:initialProducts,false,storefront);
 const page=isDemo?{...remote,rows:demoCatalogPage(initialProducts,{...filters,category:categoryId}),loading:false,hasMore:false,error:''}:remote;
 const list=page.rows,busy=storeLoading||page.loading,error=storeError||page.error;
 return <div className="catalog-results" aria-busy={busy}>
  <div className="catalog-result-status">{busy&&!list.length?<LoadingStatus label="دا نحمّل المنتجات…"/>:<p className="results-count">{page.hasMore?'معروض ':''}{list.length} منتج</p>}</div>
  {error&&!list.length?<div className="empty"><h2>ما گدرنا نحمّل المنتجات</h2><p role="alert">{error}</p><button type="button" className="button" onClick={()=>{void reload();page.refresh();}}>جرّب مرة ثانية</button></div>:busy&&!list.length?<ProductGridLoading count={6}/>:<>
   <CatalogGrid products={list} emptyTitle="ماكو منتجات تطابق اختياراتك" emptyMessage="جرّب قسم ثاني أو غيّر السعر وكلمة البحث."/>
   {!list.length&&filtered&&<button type="button" className="button secondary catalog-clear-empty" onClick={onClear}>مسح الفلاتر وعرض كل المنتجات</button>}
   <InfiniteTrigger hasMore={page.hasMore} loading={page.loading} error={page.error} onMore={page.loadMore}/>
  </>}
 </div>;
}
