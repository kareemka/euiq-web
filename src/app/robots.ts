import type {MetadataRoute} from 'next';
import {headers} from 'next/headers';
import {siteOrigin} from '@/lib/seo';
export default async function robots():Promise<MetadataRoute.Robots>{const origin=siteOrigin((await headers()).get('host'));return {rules:{userAgent:'*',allow:'/',disallow:['/account','/cart','/orders','/favorites','/api/']},sitemap:origin+'/sitemap.xml',host:origin};}
