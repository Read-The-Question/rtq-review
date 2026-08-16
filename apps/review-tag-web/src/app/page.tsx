import { FileBrowserPage } from '@/components/file-browser-page';
import { listPaperFiles } from '@/lib/paper-data';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const files = await listPaperFiles();

  return <FileBrowserPage files={files} />;
}
