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

export type PaperPdfOption = Readonly<{
  key: string;
  label: string;
  matchCount: number;
  pdf: PaperPdf;
}>;
