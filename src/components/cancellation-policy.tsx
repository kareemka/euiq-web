'use client';
import {useStore} from './store-provider';
export function CancellationPolicy(){const {settings}=useStore();return settings.cancellation_policy?<p>{settings.cancellation_policy}</p>:<p>تُعرض سياسة الإلغاء المعتمدة عند تفعيل المتجر؛ تواصل مع الدعم بخصوص أي طلب.</p>}
