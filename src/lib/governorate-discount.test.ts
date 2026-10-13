import {describe,it,expect} from 'vitest';
import {governorateDiscount} from './governorate-discount';
describe('fixed governorate discounts',()=>{
 it('uses the selected province and includes delivery in the ceiling',()=>{
  expect(governorateDiscount(20000,5000,'بغداد',{'بغداد':3000,'البصرة':7000})).toBe(3000);
  expect(governorateDiscount(20000,5000,'البصرة',{'بغداد':3000,'البصرة':7000})).toBe(7000);
  expect(governorateDiscount(20000,5000,'بغداد',{'بغداد':50000})).toBe(25000);
 });
 it('does not discount unknown shipping destinations or accept malformed values',()=>{
  expect(governorateDiscount(20000,undefined,'بغداد',{'بغداد':3000})).toBe(0);
  expect(governorateDiscount(20000,5000,'بغداد',{'بغداد':-5})).toBe(0);
  expect(governorateDiscount(20000,5000,'بغداد',{})).toBe(0);
 });
});
