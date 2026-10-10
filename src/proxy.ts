import {NextRequest,NextResponse} from 'next/server';
import {contentSecurityPolicy} from './lib/security';

export async function proxy(request:NextRequest) {
 const nonce=Buffer.from(crypto.randomUUID()).toString('base64');
 const policy=contentSecurityPolicy(nonce,process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NODE_ENV==='development',request.nextUrl.protocol==='https:');
 const headers=new Headers(request.headers);
 // Never trust a nonce or policy supplied by the caller.
 headers.set('x-nonce',nonce);
 headers.set('Content-Security-Policy',policy);
 const response=NextResponse.next({request:{headers}});
 // Resolve legacy URLs and missing products before streaming starts so crawlers
 // receive actual 308/404 responses rather than a late client redirect.
 const match=request.nextUrl.pathname.match(/^\/products\/([^/]+)\/?$/);
 const backend=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
 if(match&&backend&&key){
  try{
   const slug=decodeURIComponent(match[1]);
   const endpoint=new URL('/rest/v1/products',backend);
   endpoint.searchParams.set('select','slug');
   endpoint.searchParams.set(/^[0-9a-f-]{36}$/i.test(slug)?'id':'slug','eq.'+slug);
   endpoint.searchParams.set('status','eq.published');
   const result=await fetch(endpoint,{headers:{apikey:key,Authorization:`Bearer ${key}`},signal:AbortSignal.timeout(8000)});
   if(result.ok){
    const products=await result.json();
    if(!products.length){const missing=NextResponse.rewrite(new URL('/not-found',request.url),{status:404,request:{headers}});missing.headers.set('Content-Security-Policy',policy);missing.headers.set('Cache-Control','private, no-store');return missing;}
    if(products[0].slug!==slug){const redirect=NextResponse.redirect(new URL('/products/'+encodeURIComponent(products[0].slug),request.url),308);redirect.headers.set('Content-Security-Policy',policy);return redirect;}
   }
  }catch{ /* A backend outage must not turn an existing product into a 404. */ }
 }
 response.headers.set('Content-Security-Policy',policy);
 response.headers.set('Cache-Control','private, no-store');
 return response;
}
export const config={matcher:['/((?!_next/static|_next/image|assets/|favicon.ico|icon.png).*)']};
