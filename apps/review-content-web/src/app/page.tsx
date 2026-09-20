import { PaperIndex } from '@/components/paper-index';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{
    content?: string | string[];
    'content-scope'?: string | string[];
    q?: string | string[];
  }>;
}) {
  const parameters = await searchParams;
  return (
    <PaperIndex
      initialContentPattern={
        typeof parameters.content === 'string' ? parameters.content : undefined
      }
      initialContentScope={
        typeof parameters['content-scope'] === 'string'
          ? parameters['content-scope']
          : undefined
      }
      initialQuery={typeof parameters.q === 'string' ? parameters.q : undefined}
    />
  );
}
