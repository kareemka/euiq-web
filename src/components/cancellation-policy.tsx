'use client';
import {useStore} from './store-provider';
export function CancellationPolicy(){const {settings}=useStore();return settings.cancellation_policy?<p>{settings.cancellation_policy}</p>:<p>من تتفعّل سياسة الإلغاء، راح نعرضها هنا. إذا عندك سؤال عن طلبك، احچي ويانا.</p>}
