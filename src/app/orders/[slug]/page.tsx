import {Orders} from '@/components/orders';
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;return <div className="wrap page"><div className="page-heading"><span className="eyebrow">معك في كل خطوة</span><h1>متابعة الطلب</h1><p>حالة الطلب ومحتوياته وعنوان التوصيل.</p></div><Orders slug={slug}/></div>}
