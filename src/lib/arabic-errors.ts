export function arabicError(error: unknown, fallback = 'ما گدرنا نكمّل العملية. جرّب مرة ثانية.') {
 const detail = error && typeof error === 'object' ? error as {message?: string; code?: string; status?: number} : {};
 const message = detail.message ?? (typeof error === 'string' ? error : '');
 const code = detail.code ?? '';
 if (/WHATSAPP_DAILY_LIMIT/i.test(message+code)) return 'وصل واتساب للحد اليومي. يتجدد الحد الساعة 3 الفجر بتوقيت بغداد.';
 if (/invalid.*(credential|login)|invalid_credentials/i.test(message + code)) return 'رقمك أو كلمة المرور مو صحيحة.';
 if (/otp_expired|token.*expired|invalid.*otp/i.test(message + code)) return 'رمز التحقق مو صحيح أو انتهى وقته. اطلب رمز ثاني.';
 if (/rate.limit|too many|over_.*rate_limit|429|security purposes/i.test(message + code)) return 'طلباتك صارت هواية. انتظر دقيقة وجرب مرة ثانية.';
 if (/fetch|network|timeout|hook_timeout|hook.*failed/i.test(message + code)) return 'ما گدرنا نتصل بالخدمة. تأكد من الإنترنت وجرب مرة ثانية.';
 if (/permission|row.level|42501|not authorized/i.test(message + code)) return 'ما عندك صلاحية تسوي هالشي.';
 if (/duplicate|23505|already exists/i.test(message + code)) return 'هالبيانات موجودة من قبل. تأكد من اللي كتبته.';
 if (/check constraint|23514|invalid input|22P02|not.null|23502/i.test(message + code)) return 'تأكد من الحقول والقيم اللي كتبتها وجرب مرة ثانية.';
 // Preserve authored Arabic business messages, without technical prefixes/details.
 if (/^[\u0600-\u06ff]/.test(message.trim()) && !/[A-Za-z_]/.test(message)) return message;
 return fallback;
}

export function validationMessage(validity: ValidityState, label: string, type: string, minLength: number, maxLength: number) {
 if (validity.valueMissing) return type === 'checkbox' ? 'أكد موافقتك حتى تكمل.' : type === 'select' ? `اختار ${label}.` : `اكتب ${label}.`;
 if (validity.tooShort) return `اكتب ${minLength} أحرف على الأقل بحقل ${label}.`;
 if (validity.tooLong) return `أكثر شي تگدر تكتب بهالحقل ${maxLength} أحرف.`;
 if (validity.typeMismatch) return type === 'email' ? 'اكتب بريد إلكتروني صحيح.' : 'اكتب رابط يبدي بـ https://.';
 if (validity.patternMismatch) return type === 'tel' ? 'اكتب رقم تلفون عراقي صحيح.' : 'تأكد من الصيغة اللي كتبتها.';
 if (validity.rangeOverflow || validity.rangeUnderflow) return type === 'date' ? 'اكتب تاريخ ميلاد صحيح. ما تگدر تطلب إلا إذا عمرك 18 سنة وفوك.' : 'القيمة طالعة عن المجال المسموح.';
 if (validity.badInput || validity.stepMismatch) return 'اكتب رقم صحيح.';
 return 'تأكد من قيمة هالحقل.';
}
