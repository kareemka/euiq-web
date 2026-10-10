export function contentSecurityPolicy(nonce:string, backend:string|undefined, development:boolean, https:boolean) {
 const connections = ["'self'"];
 if(backend) {
  const url=new URL(backend);
  if(url.protocol!=='https:' && !(development && ['localhost','127.0.0.1'].includes(url.hostname))) throw new Error('Supabase must use HTTPS');
  connections.push(url.origin,url.origin.replace(/^http/,'ws'));
 }
 if(development) connections.push('ws://localhost:*','ws://127.0.0.1:*');
 return ["default-src 'self'",`script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${development?" 'unsafe-eval'":''}`,"style-src 'self' 'unsafe-inline'",`connect-src ${connections.join(' ')}`,"img-src 'self' data: blob: https:","media-src 'self' blob: https:","font-src 'self'","object-src 'none'","base-uri 'self'","form-action 'self'","frame-ancestors 'none'",...(https?['upgrade-insecure-requests']:[])].join('; ');
}

export function demoEnabled(environment:string|undefined, explicitFlag:string|undefined) {
 return environment!=='production' && explicitFlag==='true';
}
