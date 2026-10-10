import {createClient} from '@supabase/supabase-js';
import {demoEnabled} from './security';
const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export const storeAuthOptions={persistSession:true,autoRefreshToken:true,detectSessionInUrl:true};
export const supabase = url && key ? createClient(url,key,{
 auth:storeAuthOptions,
}) : null;
export const isDemo = !supabase && demoEnabled(process.env.NODE_ENV,process.env.NEXT_PUBLIC_DEMO_MODE);
