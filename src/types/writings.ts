export interface Writing {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  tags: string[];
  fileName: string;
  content: string; // Markdown body
  pdfPath?: string; // Optional sibling PDF for download
}
