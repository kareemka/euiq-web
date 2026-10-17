import {Orders} from '@/components/orders';
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;return <div className="wrap page"><div className="page-heading"><span className="eyebrow">ويّاك بكل خطوة</span><h1>متابعة الطلب</h1><p>شوف حالة الطلب، شنو بيه، ووين راح يوصلك.</p></div><Orders slug={slug}/></div>}
