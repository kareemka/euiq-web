import type {Category,Product,Settings,Banner,Order} from './types';
export const demoCategories: Category[] = [
 {id:'essentials',title:'مستلزمات زوجية',icon:'heart',sort_order:1}, {id:'care',title:'عناية ومزلقات',icon:'drop',sort_order:2},
 {id:'gifts',title:'هدايا وعطور',icon:'gift',sort_order:3},{id:'devices',title:'أجهزة مساج',icon:'sparkle',sort_order:4},{id:'accessories',title:'إكسسوارات',icon:'diamond',sort_order:5}
];
const entries: [string,string,string,number,string,boolean][] = [
 ['واقيات عالية الجودة','essentials','راحة وثقة، في كل التفاصيل.',30000,'1',true],
 ['مجموعة رومانسية فاخرة','gifts','هدية مختارة للحظاتكما الخاصة.',120000,'2',true],
 ['مزلق مائي فاخر','care','تركيبة لطيفة للعناية اليومية.',25000,'3',true],
 ['جهاز تدليك متعدد الاستخدامات','devices','تصميم مريح لتجربة استرخاء هادئة.',75000,'4',true],
 ['مجموعة عناية متكاملة','care','تفاصيل صغيرة تصنع فارقاً.',40000,'5',false],
 ['مجموعة هدايا للزوجين','gifts','اختيار أنيق، وتغليف يليق بالمناسبة.',60000,'6',false],
 ['جهاز مساج فاخر','devices','لحظات من الراحة تستحقها.',70000,'7',false],
 ['جهاز عناية متطور','devices','عناية شخصية بتصميم عملي.',97000,'8',false]
];
export const demoProducts:Product[]=entries.map(([title,cat,summary,price,img,featured],i)=>({
 id:'demo-'+(i+1),category_id:cat,title,summary,details:'هذا المنتج للمعاينة بس. المتجر يضيف الصور والمواصفات الأصلية من تطبيق الإدارة.',material:'يضيفها المتجر',origin:'يحددها المتجر',price,compare_at_price:i>3?Math.round(price*1.3):null,
 images:[`/assets/product-${img}.webp`],video_url:null,featured,
 product_variants:[{id:`demo-${i+1}-black`,product_id:'demo-'+(i+1),color_name:'أسود',color_hex:'#202322',stock_on_hand:5,reserved:0,active:true},{id:`demo-${i+1}-red`,product_id:'demo-'+(i+1),color_name:'أحمر',color_hex:'#a62b36',stock_on_hand:10,reserved:0,active:true},{id:`demo-${i+1}-teal`,product_id:'demo-'+(i+1),color_name:'فيروزي',color_hex:'#006c73',stock_on_hand:0,reserved:0,active:true}]
}));
export const demoBanners:Banner[]=[
 {id:'demo-banner',title:'خصوصيتك تهمنا، وطلبك يوصل بتغليف يحفظها.',subtitle:'اختار اللي يعجبك واطلبه وإنت مرتاح.',image_url:'/assets/hero-still.webp',target_category_id:null},
 {id:'demo-banner-product',title:'هدية تليق بلحظاتكما الخاصة.',subtitle:'مجموعة رومانسية فاخرة بتغليف أنيق يحفظ خصوصيتك.',image_url:'/assets/banners/privacy-gift.png',target_category_id:null,target_product_id:'demo-2'},
 {id:'demo-banner-category',title:'اختياراتك توصلك بتغليف يحفظ خصوصيتك.',subtitle:'شوف منتجات العناية، وتوصلك لباب البيت بدون أي إشارة.',image_url:'/assets/banners/discreet-delivery.png',target_category_id:'care'}
];
export const demoSettings:Settings={support_phone:'',whatsapp_phone:'',payment_method:'',checkout_enabled:false,delivery_fees:{},baghdad_hours:24,other_hours:72,cancellation_policy:''};
// Preview mode has no backend to page through, so the categories page filters the demo catalog in the browser.
export function demoCatalogPage(products:Product[],filters:{query:string;category?:string;available:boolean;offers:boolean;sort:string;max:string}){
 const query=filters.query.trim(),max=Number(filters.max);
 const rows=products.filter(p=>(!query||p.title.includes(query)||p.summary.includes(query))&&(!filters.category||p.category_id===filters.category)&&(!filters.available||p.product_variants.some(v=>v.active&&v.stock_on_hand-v.reserved>0))&&(!filters.offers||!!p.compare_at_price)&&(!(max>0)||p.price<=max));
 return filters.sort==='low'?rows.sort((a,b)=>a.price-b.price):filters.sort==='high'?rows.sort((a,b)=>b.price-a.price):rows;
}
// Preview-mode orders so the tracking pages can be reviewed without a backend.
const hour=3600000,placed=Date.now()-20*hour;
const at=(offset:number)=>new Date(placed+offset*hour).toISOString();
const address={name:'زائر المعاينة',phone:'+9647701234567',governorate:'بغداد',district:'الكرادة',details:'عنوان توضيحي',contact_confirmed:true};
export const demoOrders:Order[]=[
 {id:'demo-order-1',slug:'demo-order-1',order_number:100245,status:'shipping',total:150000,delivery_fee:5000,payment_method:'نقداً عند الاستلام',created_at:at(0),delivery_due_at:at(26),shipping_snapshot:address,order_events:[{id:'e1',status:'pending',reason:null,problem_type:null,scheduled_at:null,created_at:at(0)},{id:'e2',status:'confirmed',reason:null,problem_type:null,scheduled_at:null,created_at:at(1)},{id:'e3',status:'shipping',reason:null,problem_type:null,scheduled_at:null,created_at:at(18)}],order_items:[{id:'i1',title:'مجموعة رومانسية فاخرة',color_name:'أسود',image_url:'/assets/product-2.webp',quantity:1,unit_price:120000},{id:'i2',title:'مزلق مائي فاخر',color_name:'أحمر',image_url:'/assets/product-3.webp',quantity:1,unit_price:25000}]},
 {id:'demo-order-2',slug:'demo-order-2',order_number:100198,status:'delivered',total:65000,delivery_fee:5000,payment_method:'نقداً عند الاستلام',created_at:at(-120),delivery_due_at:at(-96),shipping_snapshot:address,order_events:[{id:'e4',status:'pending',reason:null,problem_type:null,scheduled_at:null,created_at:at(-120)},{id:'e5',status:'delivered',reason:null,problem_type:null,scheduled_at:null,created_at:at(-100)}],order_items:[{id:'i3',title:'مجموعة هدايا للزوجين',color_name:'أحمر',image_url:'/assets/product-6.webp',quantity:1,unit_price:60000}]}
];
