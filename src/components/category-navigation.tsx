'use client';

import Link from 'next/link';
import {SquaresFour,Package,Bank,Flag} from '@phosphor-icons/react';
import {categoryUrl} from '@/lib/urls';
import type {Category} from '@/lib/types';

export function CategoryNavigation({categories,selected,onSelect}:{categories:Category[];selected?:string;onSelect?:(value:string)=>void}){
 const items=[{id:'',title:'كل الأقسام',href:'/categories',Icon:SquaresFour},...categories.map(c=>({id:c.id,title:c.title,href:categoryUrl(c),Icon:c.title.includes('صينية')?Bank:c.title.includes('أمريكية')?Flag:Package}))];
 return <div className="reference-categories" aria-label="أقسام المتجر">{items.map(({id,title,href,Icon})=>onSelect?<button key={id} type="button" aria-pressed={selected===id} onClick={()=>onSelect(id)}><Icon size={30}/><span>{title}</span></button>:<Link key={id} href={href}><Icon size={30}/><span>{title}</span></Link>)}</div>;
}
