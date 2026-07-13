import type { Writing } from "../types/writings";

interface ParsedMarkdown {
  title?: string;
  date?: string;
  tags?: string[];
  content: string;
}

export class WritingsService {
  static getAllWritings(): Writing[] {
    const markdownFiles = import.meta.glob("/src/data/writings/*.md", {
      eager: true,
      query: "?raw",
      import: "default",
    }) as Record<string, string>;

    const pdfFiles = import.meta.glob("/src/data/writings/*.pdf", {
      eager: true,
      query: "?url",
      import: "default",
    }) as Record<string, string>;

    const pdfByBaseName = new Map<string, string>();
    for (const [path, url] of Object.entries(pdfFiles)) {
      const fileName = path.split("/").pop() || "";
      const baseName = fileName.replace(/\.pdf$/i, "");
      pdfByBaseName.set(baseName, url);
    }

    return Object.entries(markdownFiles)
      .map(([path, raw]) => {
        const fileName = path.split("/").pop() || "";
        const baseName = fileName.replace(/\.md$/i, "");
        const fromName = this.parseFileName(fileName);
        const parsed = this.parseMarkdown(raw);

        const title = parsed.title || fromName.title;
        const date = parsed.date || fromName.date;
        const tags =
          parsed.tags && parsed.tags.length > 0 ? parsed.tags : fromName.tags;

        return {
          id: this.generateId(fileName),
          title,
          date,
          tags,
          fileName,
          content: parsed.content,
          pdfPath: pdfByBaseName.get(baseName),
        };
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  private static parseMarkdown(raw: string): ParsedMarkdown {
    const trimmed = raw.replace(/^\uFEFF/, "");
    if (!trimmed.startsWith("---")) {
      return { content: trimmed.trim() };
    }

    const endIndex = trimmed.indexOf("\n---", 3);
    if (endIndex === -1) {
      return { content: trimmed.trim() };
    }

    const frontmatter = trimmed.slice(3, endIndex).trim();
    const content = trimmed.slice(endIndex + 4).trim();

    let title: string | undefined;
    let date: string | undefined;
    const tags: string[] = [];
    let inTags = false;

    for (const line of frontmatter.split("\n")) {
      const trimmedLine = line.trimEnd();
      if (/^tags:\s*$/.test(trimmedLine)) {
        inTags = true;
        continue;
      }

      if (inTags) {
        const tagMatch = trimmedLine.match(/^-\s+(.+)$/);
        if (tagMatch) {
          tags.push(tagMatch[1].trim().replace(/^["']|["']$/g, ""));
          continue;
        }
        inTags = false;
      }

      const titleMatch = trimmedLine.match(/^title:\s*(.+)$/);
      if (titleMatch) {
        title = titleMatch[1].trim().replace(/^["']|["']$/g, "");
        continue;
      }

      const dateMatch = trimmedLine.match(/^date:\s*(.+)$/);
      if (dateMatch) {
        date = dateMatch[1].trim().replace(/^["']|["']$/g, "");
        continue;
      }

      const inlineTags = trimmedLine.match(/^tags:\s*\[(.*)\]\s*$/);
      if (inlineTags) {
        tags.push(
          ...inlineTags[1]
            .split(",")
            .map((t) => t.trim().replace(/^["']|["']$/g, ""))
            .filter(Boolean)
        );
      }
    }

    return {
      title,
      date,
      tags: tags.length > 0 ? tags : undefined,
      content,
    };
  }

  private static parseFileName(fileName: string): {
    title: string;
    date: string;
    tags: string[];
  } {
    // "Title@2024-10-15@Essay,Personal.md"
    const nameWithoutExt = fileName.replace(/\.md$/i, "");
    const parts = nameWithoutExt.split("@");

    if (parts.length < 2) {
      return {
        title: nameWithoutExt,
        date: new Date().toISOString().split("T")[0],
        tags: [],
      };
    }

    const title = parts[0].trim();
    const date = parts[1].trim();

    let tags: string[] = [];
    if (parts.length >= 3 && parts[2].trim()) {
      tags = parts[2]
        .trim()
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);
    }

    return { title, date, tags };
  }

  private static generateId(fileName: string): string {
    return fileName
      .replace(/\.md$/i, "")
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
