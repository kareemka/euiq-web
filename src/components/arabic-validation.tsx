'use client';
import {useEffect} from 'react';
import {validationMessage} from '@/lib/arabic-errors';
export function ArabicValidation() {
 useEffect(() => {
  const invalid = (event: Event) => {
   const field = event.target;
   if (!(field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement || field instanceof HTMLSelectElement)) return;
   const label = field.labels?.[0]?.childNodes[0]?.textContent?.trim() || field.getAttribute('aria-label') || 'هذا الحقل';
   const input = field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement ? field : null;
   field.setCustomValidity(validationMessage(field.validity, label, input?.type ?? '', input?.minLength ?? 0, input?.maxLength ?? 0));
   field.setAttribute('aria-invalid', 'true');
  };
  const reset = (event: Event) => {
   const field=event.target;
   if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement || field instanceof HTMLSelectElement) {field.setCustomValidity('');field.removeAttribute('aria-invalid');}
  };
  document.addEventListener('invalid', invalid, true);
  document.addEventListener('input', reset, true);
  document.addEventListener('change', reset, true);
  return () => {document.removeEventListener('invalid', invalid, true);document.removeEventListener('input', reset, true);document.removeEventListener('change', reset, true);};
 }, []);
 return null;
}
