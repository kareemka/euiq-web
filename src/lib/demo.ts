import type {Category,Product,Settings,Banner} from './types';
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
 id:'demo-'+(i+1),category_id:cat,title,summary,details:'هذا منتج توضيحي لمعاينة التصميم. تُضاف المواصفات والصور الأصلية من تطبيق إدارة المتجر قبل النشر.',material:'يُحدّد من الإدارة',origin:'يُحدّد من الإدارة',price,compare_at_price:i>3?Math.round(price*1.3):null,
 images:[`/assets/product-${img}.webp`],video_url:null,featured,
 product_variants:[{id:`demo-${i+1}-black`,product_id:'demo-'+(i+1),color_name:'أسود',color_hex:'#202322',stock_on_hand:5,reserved:0,active:true},{id:`demo-${i+1}-red`,product_id:'demo-'+(i+1),color_name:'أحمر',color_hex:'#a62b36',stock_on_hand:10,reserved:0,active:true},{id:`demo-${i+1}-teal`,product_id:'demo-'+(i+1),color_name:'فيروزي',color_hex:'#006c73',stock_on_hand:0,reserved:0,active:true}]
}));
export const demoBanners:Banner[]=[{id:'demo-banner',title:'خصوصيتك، تستحق عناية خاصة.',subtitle:'منتجات مختارة لحياة زوجية أفضل، وتسوّق براحة من منزلك.',image_url:'/assets/hero-still.webp',target_category_id:null}];
export const demoSettings:Settings={support_phone:'',whatsapp_phone:'',payment_method:'',checkout_enabled:false,delivery_fees:{},baghdad_hours:24,other_hours:72,cancellation_policy:''};
