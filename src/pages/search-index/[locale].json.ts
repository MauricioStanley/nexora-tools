import type { APIRoute, GetStaticPaths } from 'astro';
import { LOCALES, type Locale } from '@/config/site';
import { buildSearchDocuments } from '@/lib/search/documents';

export const getStaticPaths: GetStaticPaths = () => LOCALES.map((locale) => ({ params: { locale } }));

export const GET: APIRoute = ({ params }) => {
  const docs = buildSearchDocuments(params.locale as Locale);
  return new Response(JSON.stringify(docs), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
