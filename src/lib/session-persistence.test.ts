import {expect,it} from 'vitest';
import {createClient} from '@supabase/supabase-js';
import {storeAuthOptions} from './supabase';

it('restores and refreshes a saved session after reopening without an OTP',async()=>{
 const saved=new Map<string,string>();
 const storage={getItem:(key:string)=>saved.get(key)??null,setItem:(key:string,value:string)=>{saved.set(key,value)},removeItem:(key:string)=>{saved.delete(key)}};
 const now=Math.floor(Date.now()/1000);
 const user={id:'11111111-1111-4111-8111-111111111111',aud:'authenticated',role:'authenticated',app_metadata:{},user_metadata:{},created_at:'2026-01-01T00:00:00Z'};
 const jwt=(exp:number)=>`${Buffer.from(JSON.stringify({alg:'HS256',typ:'JWT'})).toString('base64url')}.${Buffer.from(JSON.stringify({sub:user.id,exp})).toString('base64url')}.test-signature`;
 storage.setItem('session-test',JSON.stringify({access_token:jwt(now-60),refresh_token:'test-refresh',token_type:'bearer',expires_in:3600,expires_at:now-60,user}));
 let refreshes=0;
 const client=()=>createClient('https://session.example.test','public-test-key',{
  auth:{...storeAuthOptions,storage,storageKey:'session-test',autoRefreshToken:false,detectSessionInUrl:false},
  global:{fetch:async(input)=>{
   if(String(input).includes('/logout'))return new Response(null,{status:204});
   expect(String(input)).toContain('grant_type=refresh_token');refreshes++;
   return new Response(JSON.stringify({access_token:jwt(now+3600),refresh_token:'test-rotated-refresh',token_type:'bearer',expires_in:3600,user}),{status:200,headers:{'Content-Type':'application/json'}});
  }},
 });
 const first=client();
 const restored=await first.auth.getSession();
 expect(restored.error).toBeNull();
 expect(restored.data.session?.user.id).toBe(user.id);
 expect(restored.data.session?.refresh_token).toBe('test-rotated-refresh');
 expect(refreshes).toBe(1);
 const reopened=client();
 expect((await reopened.auth.getSession()).data.session?.user.id).toBe(user.id);
 expect(refreshes).toBe(1);
 await reopened.auth.signOut({scope:'local'});
 expect(storage.getItem('session-test')).toBeNull();
});
