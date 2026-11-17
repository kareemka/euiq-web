import {Orders} from '@/components/orders';
import Link from 'next/link';
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;return <div className="wrap page orders-page"><header className="personal-page-heading"><div><span className="eyebrow">تفاصيل طلبك</span><h1>متابعة الطلب</h1><p>المنتجات، عنوان التوصيل وآخر تحديثات الطلب.</p></div><Link className="button secondary" href="/orders">كل طلباتي</Link></header><Orders slug={slug}/></div>}
