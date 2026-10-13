'use client';
import {useId,useState} from 'react';
import {birthYears,daysInMonth,isAdult,joinBirthDate,monthNames} from '@/lib/domain';
// Day / month / year dropdowns instead of a calendar, so customers reach their birth year in one tap.
// Submits the same YYYY-MM-DD value as before through a hidden "birth_date" field.
export function BirthDateField({defaultValue,hint}:{defaultValue?:string|null;hint:string}){
 const [savedYear=0,savedMonth=0,savedDay=0]=(defaultValue??'').split('-').map(Number);
 const [year,setYear]=useState(savedYear||0),[month,setMonth]=useState(savedMonth||0),[day,setDay]=useState(savedDay||0);
 const [years]=useState(()=>{const list=birthYears();return savedYear&&!list.includes(savedYear)?[...list,savedYear]:list;});
 const id=useId(),value=joinBirthDate(year,month,day),underage=!!value&&!isAdult(value);
 const days=Array.from({length:month?daysInMonth(year,month):31},(_,i)=>i+1);
 return <fieldset className="date-field" aria-describedby={`${id}-hint`}>
  <legend>تاريخ الميلاد</legend>
  <div className="date-selects">
   <select aria-label="يوم الميلاد" required value={day||''} onChange={e=>setDay(Number(e.target.value))}><option value="">اليوم</option>{days.map(d=><option key={d} value={d}>{d}</option>)}</select>
   <select aria-label="شهر الميلاد" required value={month||''} onChange={e=>{const next=Number(e.target.value);setMonth(next);if(next)setDay(d=>Math.min(d,daysInMonth(year,next)));}}><option value="">الشهر</option>{monthNames.map((name,i)=><option key={name} value={i+1}>{i+1} - {name}</option>)}</select>
   <select aria-label="سنة الميلاد" required value={year||''} onChange={e=>{const next=Number(e.target.value);setYear(next);if(month)setDay(d=>Math.min(d,daysInMonth(next,month)));}}><option value="">السنة</option>{years.map(y=><option key={y} value={y}>{y}</option>)}</select>
  </div>
  <input type="hidden" name="birth_date" value={value}/>
  {underage?<small id={`${id}-hint`} className="field-error" role="alert">الشراء متاح لمن أتمّ 18 سنة فقط. راجع تاريخ الميلاد.</small>:<small id={`${id}-hint`} className="field-hint">{hint}</small>}
 </fieldset>;
}
