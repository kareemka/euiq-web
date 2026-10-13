export function arabicError(error: unknown, fallback = 'تعذر إكمال العملية. حاول مرة أخرى.') {
 const detail = error && typeof error === 'object' ? error as {message?: string; code?: string; status?: number} : {};
 const message = detail.message ?? (typeof error === 'string' ? error : '');
 const code = detail.code ?? '';
 if (/WHATSAPP_DAILY_LIMIT/i.test(message+code)) return 'بلغت خدمة واتساب الحد؛ يتجدد الساعة 3 فجرًا بتوقيت بغداد.';
 if (/invalid.*(credential|login)|invalid_credentials/i.test(message + code)) return 'رقم الهاتف أو كلمة المرور غير صحيحة.';
 if (/otp_expired|token.*expired|invalid.*otp/i.test(message + code)) return 'رمز التحقق غير صحيح أو انتهت صلاحيته. اطلب رمزًا جديدًا.';
 if (/rate.limit|too many|over_.*rate_limit|429|security purposes/i.test(message + code)) return 'أرسلت طلبات متكررة. انتظر دقيقة ثم حاول مجددًا.';
 if (/fetch|network|timeout|hook_timeout|hook.*failed/i.test(message + code)) return 'تعذر الاتصال بالخدمة. تحقق من الإنترنت وحاول مرة أخرى.';
 if (/permission|row.level|42501|not authorized/i.test(message + code)) return 'لا تملك صلاحية تنفيذ هذا الإجراء.';
 if (/duplicate|23505|already exists/i.test(message + code)) return 'هذه البيانات موجودة بالفعل. راجع القيم المدخلة.';
 if (/check constraint|23514|invalid input|22P02|not.null|23502/i.test(message + code)) return 'راجع الحقول المطلوبة والقيم المدخلة ثم حاول مجددًا.';
 // Preserve authored Arabic business messages, without technical prefixes/details.
 if (/^[\u0600-\u06ff]/.test(message.trim()) && !/[A-Za-z_]/.test(message)) return message;
 return fallback;
}

export function validationMessage(validity: ValidityState, label: string, type: string, minLength: number, maxLength: number) {
 if (validity.valueMissing) return type === 'checkbox' ? 'يرجى تأكيد الموافقة للمتابعة.' : type === 'select' ? `يرجى اختيار ${label}.` : `يرجى إدخال ${label}.`;
 if (validity.tooShort) return `أدخل ${minLength} أحرف على الأقل في ${label}.`;
 if (validity.tooLong) return `الحد الأعلى لهذا الحقل ${maxLength} أحرف.`;
 if (validity.typeMismatch) return type === 'email' ? 'أدخل بريدًا إلكترونيًا صحيحًا.' : 'أدخل رابطًا صحيحًا يبدأ بـhttps://.';
 if (validity.patternMismatch) return type === 'tel' ? 'أدخل رقم هاتف عراقي صحيحًا.' : 'راجع صيغة القيمة المدخلة.';
 if (validity.rangeOverflow || validity.rangeUnderflow) return type === 'date' ? 'أدخل تاريخ ميلاد صحيحًا. الطلب متاح لمن أتم 18 سنة فقط.' : 'القيمة خارج النطاق المسموح.';
 if (validity.badInput || validity.stepMismatch) return 'أدخل قيمة رقمية صحيحة.';
 return 'راجع قيمة هذا الحقل.';
}
