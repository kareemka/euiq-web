import Link from 'next/link';
import {MagnifyingGlass} from '@phosphor-icons/react/ssr';
export default function NotFound(){return <div className="wrap page"><div className="empty"><MagnifyingGlass size={48}/><h1>ما لگينا الصفحة</h1><p>يمكن الرابط تغيّر أو الصفحة ما عادت موجودة.</p><div className="empty-actions"><Link className="button" href="/">ارجع للرئيسية</Link><Link className="button secondary" href="/categories">شوف المنتجات</Link></div></div></div>}
