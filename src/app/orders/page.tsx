import {Orders} from '@/components/orders';
import Link from 'next/link';
export default function Page(){return <div className="wrap page orders-page"><header className="personal-page-heading"><div><span className="eyebrow">ويّاك بكل خطوة</span><h1>طلباتي</h1><p>شوف حالة كل طلب، تفاصيله وموعد توصيله المتوقع.</p></div><Link href="/categories" className="button secondary">تصفّح المنتجات</Link></header><Orders/></div>}
