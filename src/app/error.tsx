'use client';
export default function ErrorPage({reset}:{reset:()=>void}){return <div className="empty"><h1>تعذر فتح الصفحة</h1><p>حاول مجدداً بعد التحقق من الاتصال.</p><button className="button" onClick={reset}>إعادة المحاولة</button></div>}
