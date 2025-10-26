import type { Writing } from "../types/writings";

export class WritingsService {
  // Get all writing files from the data folder
  static getAllWritings(): Writing[] {
    // In Vite, we can use import.meta.glob to get all files
    const writingFiles = import.meta.glob("/src/data/writings/*.pdf", {
      eager: true,
      query: "?url",
      import: "default",
    });

    return Object.entries(writingFiles)
      .map(([path, url]) => {
        const fileName = path.split("/").pop() || "";
        const { title, date, tags } = this.parseFileName(fileName);

        return {
          id: this.generateId(fileName),
          title,
          date,
          tags,
          fileName,
          filePath: url as string,
        };
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  private static parseFileName(fileName: string): {
    title: string;
    date: string;
    tags: string[];
  } {
    // "My Philosophy on Life@2024-10-15@Essay,Personal.pdf"
    // → title: "My Philosophy on Life", date: "2024-10-15", tags: ["Essay", "Personal"]
    const nameWithoutExt = fileName.replace(".pdf", "");
    const parts = nameWithoutExt.split("@");

    if (parts.length < 2) {
      // Fallback if filename doesn't follow convention
      return {
        title: nameWithoutExt,
        date: new Date().toISOString().split("T")[0],
        tags: [],
      };
    }

    const title = parts[0].trim();
    const date = parts[1].trim();

    // Parse tags from third part (if exists)
    let tags: string[] = [];
    if (parts.length >= 3 && parts[2].trim()) {
      tags = parts[2]
        .trim()
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);
    }

    return {
      title,
      date,
      tags,
    };
  }

  private static generateId(fileName: string): string {
    // Convert filename to URL-safe ID
    return fileName
      .replace(".pdf", "")
      .replace("@", "-")
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-");
  }

  static getWritingById(id: string): Writing | null {
    const writings = this.getAllWritings();
    return writings.find((w) => w.id === id) || null;
  }
}
