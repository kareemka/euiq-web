import type { CartItem, Product, Profile, Settings } from './types';
export function deliveryGovernorates(settings: Settings) {
 return Object.keys(settings.delivery_fees).filter(name => name.trim() && Number.isInteger(settings.delivery_fees[name]) && settings.delivery_fees[name]>=0).sort((a,b)=>a.localeCompare(b,'ar'));
}
export const statuses: Record<string,string> = {pending:'قيد الموافقة',confirmed:'مؤكد',preparing:'قيد التجهيز',ready:'تم التجهيز',shipping:'في الطريق',delivered:'تم التوصيل',cancelled:'ملغى',returned:'راجع',postponed:'مؤجل',problem:'مشكلة'};
export const money = (n: number) => new Intl.NumberFormat('en-IQ').format(n) + ' د.ع';
// Price shortcuts on the home page: only limits that leave some products in and some out.
const priceLimits=[25000,50000,100000,200000,500000];
export function priceSteps(prices: number[]) { const top=Math.max(0,...prices); return priceLimits.filter(limit=>limit<top&&prices.some(price=>price<=limit)); }
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

// Iraqi month names, as shown on the birth date picker.
export const monthNames = ['كانون الثاني','شباط','آذار','نيسان','أيار','حزيران','تموز','آب','أيلول','تشرين الأول','تشرين الثاني','كانون الأول'];
// month is 1–12; with no year yet, February allows the 29th.
export function daysInMonth(year: number, month: number) { return new Date(Date.UTC(year || 2000, month, 0)).getUTCDate(); }
// Newest first, from the youngest allowed age (18) back to age 100.
export function birthYears(now = new Date()) { const latest = Number(adultBirthDateMax(now).slice(0, 4)); return Array.from({length: 83}, (_, i) => latest - i); }
export function joinBirthDate(year: number, month: number, day: number) { return year && month && day ? `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}` : ''; }

export function adultBirthDateMax(now = new Date()) {
 const iraq = new Date(now.getTime()+3*3600000);
 const year=iraq.getUTCFullYear()-18, month=iraq.getUTCMonth();
 const day=Math.min(iraq.getUTCDate(),new Date(Date.UTC(year,month+1,0)).getUTCDate());
 return new Date(Date.UTC(year,month,day)).toISOString().slice(0,10);
}
