import {NextRequest,NextResponse} from 'next/server';
import {createServerClient,type CookieOptions} from '@supabase/ssr';
import {contentSecurityPolicy} from './lib/security';
import {storefrontForHost} from './lib/seo';

export async function proxy(request:NextRequest) {
 const nonce=Buffer.from(crypto.randomUUID()).toString('base64');
 const policy=contentSecurityPolicy(nonce,process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NODE_ENV==='development',request.nextUrl.protocol==='https:');
 const headers=new Headers(request.headers);
 // Never trust a nonce or policy supplied by the caller.
 headers.set('x-nonce',nonce);
 headers.set('Content-Security-Policy',policy);
 const backend=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
 const host=request.nextUrl.hostname.toLowerCase();
 const sharesStoreDomain=host==='euiq.store'||host.endsWith('.euiq.store');
 const authCookies:{name:string;value:string;options:CookieOptions}[]=[];
 const storageKey=backend?`sb-${new URL(backend).hostname.split('.')[0]}-auth-token`:'';
 const hasAuthCookie=storageKey&&request.cookies.getAll().some(({name})=>name===storageKey||name.startsWith(`${storageKey}.`));
 if(sharesStoreDomain&&backend&&key&&hasAuthCookie){
  try{
   const authClient=createServerClient(backend,key,{
    cookieOptions:{domain:'.euiq.store',path:'/',sameSite:'lax',secure:request.nextUrl.protocol==='https:'},
    cookies:{
     getAll:()=>request.cookies.getAll(),
     setAll:(cookies)=>{
      cookies.forEach(({name,value})=>request.cookies.set(name,value));
      headers.set('cookie',request.cookies.toString());
      authCookies.push(...cookies.map(({name,value,options})=>({name,value,options:{...options,domain:'.euiq.store',path:'/',sameSite:'lax' as const,secure:request.nextUrl.protocol==='https:'}})));
     },
    },
   });
   await authClient.auth.getUser();
  }catch{/* A temporary auth outage must not prevent storefront pages from loading. */}
 }
 const response=NextResponse.next({request:{headers}});
 const applyAuthCookies=(target:NextResponse)=>{for(const {name,value,options} of authCookies)target.cookies.set(name,value,options);return target;};
 // Resolve legacy URLs and missing products before streaming starts so crawlers
 // receive actual 308/404 responses rather than a late client redirect.
 const match=request.nextUrl.pathname.match(/^\/products\/([^/]+)\/?$/);
 if(match&&backend&&key){
  try{
   const slug=decodeURIComponent(match[1]);
   const endpoint=new URL('/rest/v1/products',backend);
   endpoint.searchParams.set('select','slug');
   endpoint.searchParams.set(/^[0-9a-f-]{36}$/i.test(slug)?'id':'slug','eq.'+slug);
   endpoint.searchParams.set('status','eq.published');
   endpoint.searchParams.set('storefront',`eq.${storefrontForHost(request.nextUrl.hostname)}`);
   const result=await fetch(endpoint,{headers:{apikey:key,Authorization:`Bearer ${key}`},signal:AbortSignal.timeout(8000)});
   if(result.ok){
    const products=await result.json();
    if(!products.length){
     // TLS terminates at Nginx; the internal Next.js listener uses HTTP.
     const missingUrl=new URL('/not-found',request.url);
     if(process.env.NODE_ENV==='production'&&['localhost','127.0.0.1','[::1]'].includes(missingUrl.hostname))missingUrl.protocol='http:';
     const missing=applyAuthCookies(NextResponse.rewrite(missingUrl,{status:404,request:{headers}}));missing.headers.set('Content-Security-Policy',policy);missing.headers.set('Cache-Control','private, no-store');return missing;
    }
    if(products[0].slug!==slug){const redirect=applyAuthCookies(NextResponse.redirect(new URL('/products/'+encodeURIComponent(products[0].slug),request.url),308));redirect.headers.set('Content-Security-Policy',policy);return redirect;}
   }
  }catch{ /* A backend outage must not turn an existing product into a 404. */ }
 }
 applyAuthCookies(response);
 response.headers.set('Content-Security-Policy',policy);
 response.headers.set('Cache-Control','private, no-store');
 return response;
}
export const config={matcher:['/((?!_next/static|_next/image|assets/|favicon.ico|icon.png).*)']};
