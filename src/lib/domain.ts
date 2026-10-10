import type { CartItem, Product, Profile, Settings } from './types';
export function deliveryGovernorates(settings: Settings) {
 return Object.keys(settings.delivery_fees).filter(name => name.trim() && Number.isInteger(settings.delivery_fees[name]) && settings.delivery_fees[name]>=0).sort((a,b)=>a.localeCompare(b,'ar'));
}
export const statuses: Record<string,string> = {pending:'قيد الموافقة',confirmed:'مؤكد',preparing:'قيد التجهيز',ready:'تم التجهيز',shipping:'في الطريق',delivered:'تم التوصيل',cancelled:'ملغى',returned:'راجع',postponed:'مؤجل',problem:'مشكلة'};
export const money = (n: number) => new Intl.NumberFormat('en-IQ').format(n) + ' د.ع';
export function normalizePhone(value: string) {
 const digits = value.replace(/[٠-٩]/g, d => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d))).replace(/[^0-9]/g,'');
 const normalized = digits.startsWith('00964') ? '+'+digits.slice(2) : digits.startsWith('964') ? '+'+digits : digits.startsWith('07') ? '+964'+digits.slice(1) : digits.startsWith('7') ? '+964'+digits : '';
 if (!/^\+9647\d{9}$/.test(normalized)) throw new Error('أدخل رقم هاتف عراقي صحيحاً مثل 07701234567');
 return normalized;
}
export function isAdult(date: string, now = new Date()) {
 if(!/^\d{4}-\d{2}-\d{2}$/.test(date))return false;
 const birth=new Date(date+'T00:00:00Z');
 if(Number.isNaN(birth.getTime())||birth.toISOString().slice(0,10)!==date)return false;
 const iraq=new Date(now.getTime()+3*3600000);
 let age=iraq.getUTCFullYear()-birth.getUTCFullYear();
 if(iraq.getUTCMonth()<birth.getUTCMonth()||(iraq.getUTCMonth()===birth.getUTCMonth()&&iraq.getUTCDate()<birth.getUTCDate()))age--;
 return age>=18;
}
export function completeProfile(p: Profile | null) { return !!p && p.name.trim().length>=2 && !!p.governorate && !!p.district.trim() && !!p.address_details.trim() && !!p.birth_date && isAdult(p.birth_date) && !!p.privacy_accepted_at; }
export function validateCartChange(items: CartItem[], products: Product[], variantId: string, quantity: number) {
 if (!Number.isInteger(quantity)||quantity<0) throw new Error('كمية غير صالحة');
 if(quantity===0)return;
 const product=products.find(p=>p.product_variants.some(v=>v.id===variantId)); const variant=product?.product_variants.find(v=>v.id===variantId);
 if (!product||!variant||!variant.active) throw new Error('المنتج غير متاح');
 if (!Number.isInteger(quantity)||quantity<0) throw new Error('كمية غير صالحة');
 const other=items.filter(i=>i.variant_id!==variantId && product.product_variants.some(v=>v.id===i.variant_id)).reduce((s,i)=>s+i.quantity,0);
 if(other+quantity>2) throw new Error('الحد الأعلى قطعتان من نفس المنتج بجميع ألوانه');
 if(quantity>variant.stock_on_hand-variant.reserved) throw new Error('الكمية المطلوبة غير متاحة لهذا اللون');
}

export function adultBirthDateMax(now = new Date()) {
 const iraq = new Date(now.getTime()+3*3600000);
 const year=iraq.getUTCFullYear()-18, month=iraq.getUTCMonth();
 const day=Math.min(iraq.getUTCDate(),new Date(Date.UTC(year,month+1,0)).getUTCDate());
 return new Date(Date.UTC(year,month,day)).toISOString().slice(0,10);
}
