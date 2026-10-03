export type PaperPdf =
  | Readonly<{
      fileName: string;
      state: 'available';
      url: string;
    }>
  | Readonly<{
      fileName: string;
      state: 'unavailable';
    }>;
