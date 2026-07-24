import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function stripEmojisAndMarkdown(text: string): string {
  // 1. Remove emojis (simpler regex for better compatibility)
  const noEmojis = text.replace(/[^\x00-\x7F]/g, '');
  
  // 2. Remove Markdown structural elements but keep content
  return noEmojis
    .replace(/^#+\s+/gm, '') // Headers
    .replace(/\*\*?|__?/g, '') // Bold/Italic
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Links
    .replace(/`{1,3}([a-zA-Z]*\n)?/g, '') // Code block markers and backticks
    .replace(/^\s*[-*+]\s+/gm, '') // Bullet points
    .replace(/\n+/g, ' ') // Flatten to single paragraph
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim();
}
