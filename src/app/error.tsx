'use client';
import {WarningCircle} from '@phosphor-icons/react';
export default function ErrorPage({reset}:{reset:()=>void}){return <div className="wrap page"><div className="empty"><WarningCircle size={48}/><h1>تعذر فتح الصفحة</h1><p>حاول مجدداً بعد التحقق من الاتصال.</p><button className="button" onClick={reset}>إعادة المحاولة</button></div></div>}
