import Link from 'next/link';
import {MagnifyingGlass} from '@phosphor-icons/react/ssr';
export default function NotFound(){return <div className="wrap page"><div className="empty"><MagnifyingGlass size={48}/><h1>الصفحة غير موجودة</h1><p>ربما تغيّر الرابط أو لم تعد الصفحة متاحة.</p><div className="empty-actions"><Link className="button" href="/">العودة للرئيسية</Link><Link className="button secondary" href="/categories">تصفّح المنتجات</Link></div></div></div>}
