'use client';
import {useCallback,useEffect,useRef,useState} from 'react';
import {supabase} from './supabase';
import {arabicError} from './arabic-errors';
import type {Product} from './types';
export function usePagedProducts(filters:Record<string,unknown>,initial:Product[]=[],favorites=false){
 const signature=JSON.stringify(filters),[state,setState]=useState({rows:initial,loading:!initial.length,hasMore:initial.length===24,error:''});
 const generation=useRef(0),busy=useRef(false),offset=useRef(initial.length);
 const load=useCallback(async (reset=false)=>{
  if(!supabase)return;
  if(!reset&&busy.current)return;
  const version=reset?++generation.current:generation.current;
  busy.current=true;
  setState(s=>({...s,loading:true,error:''}));
  try{
   const {data,error}=await supabase.rpc(favorites?'favorite_products_page':'catalog_products',{p_limit:24,p_offset:reset?0:offset.current,...(!favorites?{p_filters:JSON.parse(signature)}:{})});
   if(error)throw error;if(version!==generation.current)return;
   const rows=data as Product[];offset.current=(reset?0:offset.current)+rows.length;
   setState(s=>({rows:reset?rows:[...s.rows,...rows.filter(p=>!s.rows.some(x=>x.id===p.id))],hasMore:rows.length===24,loading:false,error:''}));
  }catch(e){if(version===generation.current)setState(s=>({...s,loading:false,error:arabicError(e)}));}
  finally{if(version===generation.current)busy.current=false;}
 },[signature,favorites]);
 const invalidate=useCallback(()=>{generation.current++;busy.current=false;},[]);
 useEffect(()=>{const timer=setTimeout(()=>void load(true),250);return()=>{clearTimeout(timer);invalidate();};},[load,invalidate]);
 return {...state,loadMore:useCallback(()=>void load(false),[load]),refresh:useCallback(()=>void load(true),[load])};
}
