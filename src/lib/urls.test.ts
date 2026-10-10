import {describe,it,expect} from 'vitest';
import {productUrl,categoryUrl,titleSlug,decodeSlug} from './urls';
describe('public catalog links',()=>{
 it('uses stored slug rather than title or UUID',()=>{
  expect(decodeURIComponent(productUrl({title:'اسم جديد',slug:'اسم-ثابت'}))).toBe('/products/اسم-ثابت');
  expect(decodeURIComponent(categoryUrl({title:'قسم جديد',slug:'هدايا-وعطور'}))).toBe('/categories?category=هدايا-وعطور');
 });
 it('encodes unsafe characters and supports Arabic demo titles',()=>{
  expect(productUrl({title:'x',slug:'a/b?c'})).toBe('/products/a%2Fb%3Fc');
  expect(titleSlug('  عناية و مزلقات! ')).toBe('عناية-و-مزلقات');
  expect(decodeSlug(encodeURIComponent('منتج-عربي'))).toBe('منتج-عربي');
  expect(decodeSlug('%invalid')).toBe('%invalid');
 });
});
