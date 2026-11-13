import {createBrowserClient} from '@supabase/ssr';
import {demoEnabled} from './security';
const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export const storeAuthOptions={persistSession:true,autoRefreshToken:true,detectSessionInUrl:true};
function migrateLocalStorageSession(){
 if(typeof window==='undefined'||!url)return;
 const host=window.location.hostname;
 if(host!=='euiq.store'&&!host.endsWith('.euiq.store'))return;
 const storageKey=`sb-${new URL(url).hostname.split('.')[0]}-auth-token`;
 if(document.cookie.split('; ').some(cookie=>cookie.startsWith(`${storageKey}=`)||cookie.startsWith(`${storageKey}.0=`)))return;
 try{
  const legacy=window.localStorage.getItem(storageKey);
  if(!legacy)return;
  const encoded='base64-'+btoa(new TextEncoder().encode(legacy).reduce((value,byte)=>value+String.fromCharCode(byte),'' )).replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_');
  const parts:string[]=[];let remaining=encodeURIComponent(encoded);
  while(remaining){let part=remaining.slice(0,3180),percent=part.lastIndexOf('%');if(percent>part.length-3)part=part.slice(0,percent);while(part){try{decodeURIComponent(part);break}catch{part=part.slice(0,-3)}}parts.push(decodeURIComponent(part));remaining=remaining.slice(part.length);}
  const secure=window.location.protocol==='https:'?'; Secure':'';
  for(let index=0;index<parts.length;index++)document.cookie=`${storageKey}${parts.length>1?'.'+index:''}=${encodeURIComponent(parts[index])}; Domain=.euiq.store; Path=/; SameSite=Lax; Max-Age=34560000${secure}`;
  if(document.cookie.split('; ').some(cookie=>cookie.startsWith(`${storageKey}=`)||cookie.startsWith(`${storageKey}.0=`)))window.localStorage.removeItem(storageKey);
 }catch{/* Keep the legacy session if it cannot be safely migrated. */}
}
if(typeof window!=='undefined')migrateLocalStorageSession();
const sharedCookieOptions=typeof window!=='undefined'&&(window.location.hostname==='euiq.store'||window.location.hostname.endsWith('.euiq.store'))
 ?{domain:'.euiq.store',path:'/',sameSite:'lax' as const,secure:window.location.protocol==='https:'}
 :undefined;
export const supabase = url && key ? createBrowserClient(url,key,{
 auth:storeAuthOptions,
 cookieOptions:sharedCookieOptions,
}) : null;
export const isDemo = !supabase && demoEnabled(process.env.NODE_ENV,process.env.NEXT_PUBLIC_DEMO_MODE);
