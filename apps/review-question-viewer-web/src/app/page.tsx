import type { Metadata } from 'next';

import { QuestionViewerApp } from '@/components/question-viewer-app';

export const dynamic = 'force-dynamic';

type HomeProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function firstSearchParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

async function getInitialSessionId(searchParams: HomeProps['searchParams']) {
  const params = await searchParams;

  return (
    firstSearchParam(params.session) ??
    firstSearchParam(params.sessionId) ??
    firstSearchParam(params.context) ??
    firstSearchParam(params.contextId) ??
    '1'
  );
}

export async function generateMetadata({
  searchParams,
}: HomeProps): Promise<Metadata> {
  const sessionId = await getInitialSessionId(searchParams);

  return {
    title: `Session ${sessionId} - RTQ Question Viewer`,
  };
}

export default async function Home({ searchParams }: HomeProps) {
  const initialSessionId = await getInitialSessionId(searchParams);

  return <QuestionViewerApp initialSessionId={initialSessionId} />;
}
