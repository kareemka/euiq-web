'use client';
import {WarningCircle} from '@phosphor-icons/react';
export default function ErrorPage({reset}:{reset:()=>void}){return <div className="wrap page"><div className="empty"><WarningCircle size={48}/><h1>ما گدرنا نفتح الصفحة</h1><p>تأكد من اتصالك وجرب مرة ثانية.</p><button className="button" onClick={reset}>جرّب مرة ثانية</button></div></div>}
