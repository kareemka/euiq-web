import {describe,it,expect} from 'vitest';
import {productUrl,categoryUrl,titleSlug,decodeSlug,bannerTarget} from './urls';
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
describe('banner destinations',()=>{
 const products=[{id:'11111111-1111-1111-1111-111111111111',slug:'هدية-فاخرة',title:'هدية فاخرة'}],categories=[{id:'c1',slug:'عطور',title:'عطور'}];
 it('opens the chosen product by its stored slug',()=>{
  expect(decodeURIComponent(bannerTarget({target_category_id:null,target_product_id:products[0].id},products,categories).href)).toBe('/products/هدية-فاخرة');
  expect(bannerTarget({target_category_id:'c1',target_product_id:products[0].id},products,categories).kind).toBe('product');
 });
 it('links a product outside the loaded page by slug, then by id',()=>{
  expect(decodeURIComponent(bannerTarget({target_category_id:null,target_product_id:'x',target_product_slug:'منتج-آخر'},[],categories).href)).toBe('/products/منتج-آخر');
  expect(bannerTarget({target_category_id:null,target_product_id:'22222222-2222-2222-2222-222222222222'},[],categories).href).toBe('/products/22222222-2222-2222-2222-222222222222');
 });
 it('opens the chosen category, or the whole catalog when nothing is chosen',()=>{
  expect(bannerTarget({target_category_id:'c1'},products,categories)).toEqual({kind:'category',href:categoryUrl(categories[0])});
  expect(bannerTarget({target_category_id:'missing',target_product_id:null},products,categories).href).toBe('/categories?category=missing');
  expect(bannerTarget({target_category_id:null},products,categories)).toEqual({kind:'catalog',href:'/categories'});
 });
});
