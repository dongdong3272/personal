export interface Writing {
  id: string; // Generated from filename
  title: string; // Extracted from filename
  date: string; // Extracted from filename (YYYY-MM-DD)
  tags: string[]; // Extracted from filename (after second @)
  fileName: string; // Full filename
  filePath: string; // Path to file
}
