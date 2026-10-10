import type { NextConfig } from 'next';
const storageUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publicKey=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if(process.env.NODE_ENV==='production' && (!storageUrl || !publicKey)) throw new Error('Production requires Supabase URL and public key');
if(publicKey) {
 let role:string|undefined;
 try {role=JSON.parse(Buffer.from(publicKey.split('.')[1]??'','base64url').toString()).role;} catch {}
 if(!publicKey.startsWith('sb_publishable_') && role!=='anon') throw new Error('Only a Supabase anon or publishable key may be exposed to the browser');
}
const config: NextConfig = { poweredByHeader: false, images: { remotePatterns: storageUrl ? [new URL('/storage/v1/object/public/**', storageUrl)] : [] }, async headers() { return [{ source: '/:path*', headers: [{ key: 'X-Content-Type-Options', value: 'nosniff' }, { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' }, { key: 'X-Frame-Options', value: 'DENY' },{key:'Permissions-Policy',value:'camera=(), microphone=(), geolocation=(), payment=()'},{key:'Cross-Origin-Opener-Policy',value:'same-origin'},{key:'Strict-Transport-Security',value:'max-age=31536000'}] }]; } };
export default config;
