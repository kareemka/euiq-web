import {describe,it,expect} from 'vitest';
import {contentSecurityPolicy,demoEnabled} from './security';
describe('browser security',()=>{
 it('production allows only nonced scripts, blocks embedding and restricts backend connections',()=>{
  const csp=contentSecurityPolicy('random','https://backend.example',false,true);
  const scripts=csp.split('; ').find(x=>x.startsWith('script-src'))!;
  expect(scripts).toContain("'nonce-random' 'strict-dynamic'");
  expect(scripts).not.toContain('unsafe-inline');expect(scripts).not.toContain('unsafe-eval');
  expect(csp).toContain("frame-ancestors 'none'");expect(csp).toContain("object-src 'none'");
  expect(csp).toContain("connect-src 'self' https://backend.example wss://backend.example;");
  expect(csp).toContain('upgrade-insecure-requests');
 });
 it('requires HTTPS for production backend',()=>expect(()=>contentSecurityPolicy('n','http://example.com',false,true)).toThrow());
 it('permits development tooling without upgrading local HTTP',()=>{
  const csp=contentSecurityPolicy('n','https://backend.example',true,false);
  expect(csp).toContain('unsafe-eval');expect(csp).not.toContain('upgrade-insecure-requests');
 });
 it('never enables demo data in production or without explicit opt in',()=>{
  expect(demoEnabled('production','true')).toBe(false);expect(demoEnabled('development',undefined)).toBe(false);expect(demoEnabled('development','true')).toBe(true);
 });
});
