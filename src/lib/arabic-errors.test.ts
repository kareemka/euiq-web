import {adultBirthDateMax} from './domain';
import {describe,it,expect} from 'vitest';
import {arabicError,validationMessage} from './arabic-errors';
describe('Arabic user messages',()=>{
 it('birth date limit follows Iraq time and leap years',()=>{
  expect(adultBirthDateMax(new Date('2026-10-09T21:00:00Z'))).toBe('2008-10-10');
  expect(adultBirthDateMax(new Date('2028-02-29T09:00:00Z'))).toBe('2010-02-28');
 });
 it('translates authentication, access, and transport errors without technical details',()=>{
  expect(arabicError({message:'Invalid login credentials'})).toBe('رقمك أو كلمة المرور مو صحيحة.');
  expect(arabicError({message:'permission denied for table profiles',code:'42501'})).toBe('ما عندك صلاحية تسوي هالشي.');
  expect(arabicError(new Error('Failed to fetch'))).toContain('ما گدرنا نتصل');
  expect(arabicError({message:'internal server secret detail'})).not.toMatch(/[A-Za-z]/);
 });
 it('preserves Arabic age restrictions',()=>expect(arabicError(new Error('لا يمكن إتمام الطلب لمن لم يتم 18 سنة.'))).toBe('لا يمكن إتمام الطلب لمن لم يتم 18 سنة.'));
 it('translates required fields and short names',()=>{
  expect(validationMessage({valueMissing:true} as ValidityState,'رقم الهاتف','tel',0,0)).toBe('اكتب رقم الهاتف.');
  expect(validationMessage({tooShort:true} as ValidityState,'الاسم','text',2,0)).toContain('أحرف على الأقل');
  expect(validationMessage({valueMissing:true} as ValidityState,'سنة الميلاد','select',0,0)).toBe('اختار سنة الميلاد.');
 });
});
