import {describe,it,expect} from 'vitest';
import {normalizePhone,isAdult,validateCartChange,deliveryGovernorates} from './domain';
import {demoSettings} from './demo';
import {demoProducts} from './demo';
describe('governorates configured by the store',()=>{
 it('has no hardcoded destinations before setup',()=>expect(deliveryGovernorates(demoSettings)).toEqual([]));
 it('includes custom names and free delivery, omitting invalid fees',()=>expect(deliveryGovernorates({...demoSettings,delivery_fees:{'ذي قار':0,'محافظة جديدة':5000,'غير صالح':-1}})).toEqual(expect.arrayContaining(['ذي قار','محافظة جديدة'])));
 it('removes a destination immediately when its setting is deleted',()=>expect(deliveryGovernorates({...demoSettings,delivery_fees:{'بغداد':5000}})).toEqual(['بغداد']));
});
describe('Iraqi phone normalization',()=>{
 it('normalizes local, international, Arabic numerals',()=>{for(const p of ['07701234567','+9647701234567','009647701234567','٠٧٧٠١٢٣٤٥٦٧'])expect(normalizePhone(p)).toBe('+9647701234567')});
 it('rejects invalid numbers',()=>expect(()=>normalizePhone('12345')).toThrow());
});
describe('age boundary',()=>{
 const now=new Date('2026-10-09T12:00:00Z');
 it('accepts the eighteenth birthday',()=>expect(isAdult('2008-10-09',now)).toBe(true));
 it('uses the Iraq calendar at midnight',()=>expect(isAdult('2008-10-10',new Date('2026-10-09T21:30:00Z'))).toBe(true));
 it('handles leap dates without accepting a day too early',()=>{expect(isAdult('2010-03-01',new Date('2028-02-29T12:00:00Z'))).toBe(false);expect(isAdult('2008-02-31',now)).toBe(false)});
 it('rejects one day younger and future dates',()=>{expect(isAdult('2008-10-10',now)).toBe(false);expect(isAdult('2030-01-01',now)).toBe(false);expect(isAdult('',now)).toBe(false)});
});
describe('color stock and product cap',()=>{
 const p=demoProducts[0];const black=p.product_variants[0],red=p.product_variants[1],empty=p.product_variants[2];
 it('sums all colors toward the product limit',()=>expect(()=>validateCartChange([{variant_id:black.id,quantity:2}],demoProducts,red.id,1)).toThrow('قطعتان'));
 it('allows one piece of each color',()=>expect(()=>validateCartChange([{variant_id:black.id,quantity:1}],demoProducts,red.id,1)).not.toThrow());
 it('rejects unavailable color and fractional quantities',()=>{expect(()=>validateCartChange([],demoProducts,empty.id,1)).toThrow();expect(()=>validateCartChange([],demoProducts,black.id,1.5)).toThrow()});
 it('uses available stock after reservations',()=>{const products=structuredClone(demoProducts);products[0].product_variants[0].reserved=5;expect(()=>validateCartChange([],products,black.id,1)).toThrow()});
 it('allows removal of an unavailable color',()=>expect(()=>validateCartChange([{variant_id:empty.id,quantity:1}],demoProducts,empty.id,0)).not.toThrow());
});
