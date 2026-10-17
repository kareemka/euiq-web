'use client';
import {Suspense,useState,useEffect,useRef} from 'react';
import {useSearchParams,useRouter} from 'next/navigation';
import {MagnifyingGlass,Funnel,X} from '@phosphor-icons/react';
import {useStore} from '@/components/store-provider';
import {CategoryNavigation} from './category-navigation';
import {HeroBanner} from './hero-banner';
import {CatalogGrid} from '@/components/catalog-grid';
import {usePagedProducts} from '@/lib/use-paged-products';
import {InfiniteTrigger} from './infinite-trigger';
import {titleSlug} from '@/lib/urls';
import {money,priceSteps} from '@/lib/domain';
import {isDemo} from '@/lib/supabase';
import {demoCatalogPage} from '@/lib/demo';
export default function Page(){return <Suspense fallback={<div className="page-loading">دا نحمّل الصفحة…</div>}><CategoryRoute/></Suspense>}
function CategoryRoute(){const params=useSearchParams();return <Categories key={params.toString()}/>}
function Categories(){const params=useSearchParams();const {products,categories,banners,loading,error,reload}=useStore();const [query,setQuery]=useState(params.get('q')??''),[category,setCategory]=useState(params.get('category')??''),[available,setAvailable]=useState(params.get('available')==='1'),[offers,setOffers]=useState(params.get('offers')==='1'),[sort,setSort]=useState('recommended'),[max,setMax]=useState(params.get('max')??''),[filtersOpen,setFiltersOpen]=useState(false);
 const selectedCategory=categories.find(c=>c.id===category||(c.slug??titleSlug(c.title))===category);const router=useRouter();const sheet=useRef<HTMLDialogElement>(null);
 useEffect(()=>{const original=params.get('category');const legacy=categories.find(c=>c.id===original);if(legacy){const next=new URLSearchParams(params.toString());next.set('category',legacy.slug??titleSlug(legacy.title));router.replace('/categories?'+next.toString());}},[categories,params,router]);
 useEffect(()=>{const dialog=sheet.current;if(!dialog)return;if(filtersOpen&&!dialog.open)dialog.showModal();if(!filtersOpen&&dialog.open)dialog.close();},[filtersOpen]);
 useEffect(()=>{if(window.location.hash==='#catalog-search')document.getElementById('catalog-search')?.focus();},[]);
 const remote=usePagedProducts({query,category,available,offers,sort,max},products);
 const page=isDemo?{...remote,rows:demoCatalogPage(products,{query,category:selectedCategory?.id,available,offers,sort,max}),loading:false,hasMore:false,error:''}:remote;
 const list=page.rows,steps=priceSteps(products.map(p=>p.price));
 const active=[selectedCategory&&{label:selectedCategory.title,clear:()=>setCategory('')},Number(max)>0&&{label:`لحد ${money(Number(max))}`,clear:()=>setMax('')},available&&{label:'المتوفر بس',clear:()=>setAvailable(false)},offers&&{label:'العروض بس',clear:()=>setOffers(false)}].filter(f=>!!f);
 const clearAll=()=>{setQuery('');setCategory('');setMax('');setAvailable(false);setOffers(false);setSort('recommended')};
 const filterControls=(<div className="filter-sheet-body">
   <fieldset className="filter-group"><legend>القسم</legend><div className="choice-list"><button type="button" className="choice" aria-pressed={!selectedCategory} onClick={()=>setCategory('')}>كل الأقسام</button>{categories.map(c=><button key={c.id} type="button" className="choice" aria-pressed={selectedCategory?.id===c.id} onClick={()=>setCategory(c.slug??titleSlug(c.title))}>{c.title}</button>)}</div></fieldset>
   <fieldset className="filter-group"><legend>السعر</legend>{steps.length>0&&<div className="choice-list">{steps.map(step=><button key={step} type="button" className="choice" aria-pressed={max===String(step)} onClick={()=>setMax(max===String(step)?'':String(step))}>لحد {money(step)}</button>)}</div>}<label>أعلى سعر (د.ع)<input type="number" inputMode="numeric" min={0} value={max} onChange={e=>setMax(e.target.value)} placeholder="أي سعر"/></label></fieldset>
   <fieldset className="filter-group"><legend>الحالة</legend><label className="check"><input type="checkbox" checked={available} onChange={e=>setAvailable(e.target.checked)}/>المتوفر بس</label><label className="check"><input type="checkbox" checked={offers} onChange={e=>setOffers(e.target.checked)}/>العروض بس</label></fieldset>
  </div>);
 return <div className="wrap page catalog-page"><div className="page-heading catalog-intro"><h1>{selectedCategory?.title??'تفرّج على المتجر'}</h1><p>دوّر على اللي يناسبك، واختار اللون اللي يعجبك.</p></div>
 <HeroBanner banners={banners} categories={categories} products={products}/>
 <CategoryNavigation categories={categories} selected={selectedCategory?.id??''} onSelect={id=>{const selected=categories.find(c=>c.id===id);setCategory(selected?(selected.slug??titleSlug(selected.title)):'')}}/>
 <div className="catalog-toolbar"><div className="search-bar"><MagnifyingGlass size={21}/><input id="catalog-search" type="search" value={query} onChange={e=>setQuery(e.target.value)} aria-label="دوّر على منتج" placeholder="اسم المنتج أو شوية من وصفه…"/></div><button type="button" className="filter-toggle" aria-haspopup="dialog" aria-expanded={filtersOpen} aria-label={active.length?`فلترة، ${active.length} شغالة`:undefined} onClick={()=>setFiltersOpen(true)}><Funnel size={20}/>فلترة{active.length>0&&<b>{active.length}</b>}</button><select className="sort-select" aria-label="رتّب النتائج" value={sort} onChange={e=>setSort(e.target.value)}><option value="recommended">الترتيب الأنسب</option><option value="low">السعر من الأرخص</option><option value="high">السعر من الأغلى</option></select></div>
 {active.length>0&&<div className="active-filters" role="group" aria-label="الفلاتر الشغالة">{active.map(f=><button key={f.label} type="button" aria-label={`شيل ${f.label}`} onClick={f.clear}>{f.label}<X size={14}/></button>)}<button type="button" className="text-button" onClick={clearAll}>امسح الكل</button></div>}
 <div className="catalog-layout"><aside className="desktop-filters" aria-label="فلترة المنتجات"><div className="sidebar-heading"><h2>فلترة المنتجات</h2><button className="text-button" onClick={clearAll}>امسح الكل</button></div>{filterControls}</aside><div className="catalog-results"><p className="results-count" aria-live="polite">{list.length} منتج</p>
 {(loading||page.loading)&&!list.length?<div className="page-loading">دا نحمّل المنتجات…</div>:(error||page.error)&&!list.length?<div className="empty"><p>{error||page.error}</p><button className="button" onClick={()=>{void reload();page.refresh();}}>جرّب مرة ثانية</button></div>:<><CatalogGrid products={list}/><InfiniteTrigger hasMore={page.hasMore} loading={page.loading} error={page.error} onMore={page.loadMore}/></>}
 </div></div>
 <dialog ref={sheet} className="filter-sheet" aria-labelledby="filter-title" onClose={()=>setFiltersOpen(false)} onClick={e=>{if(e.target===e.currentTarget)setFiltersOpen(false);}}>
  <div className="filter-sheet-head"><h2 id="filter-title">فلترة المنتجات</h2><button type="button" className="icon-button" aria-label="إغلاق" onClick={()=>setFiltersOpen(false)}><X size={22}/></button></div>
  {filterControls}
  <div className="filter-sheet-foot"><button type="button" className="button secondary" onClick={clearAll}>امسح الفلترة</button><button type="button" className="button" onClick={()=>setFiltersOpen(false)}>شوف النتائج</button></div>
 </dialog>
 </div>
}
