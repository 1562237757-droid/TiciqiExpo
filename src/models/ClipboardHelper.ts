import * as Clipboard from 'expo-clipboard';

export async function getClipboardString(): Promise<string | null> {
  return await Clipboard.getStringAsync();
}

export async function hasClipboardContent(): Promise<boolean> {
  const content = await Clipboard.getStringAsync();
  return content.length > 0;
}

export function parseContentToCards(content: string): string[] {
  return content
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
}

export function generateDefaultTitle(): string {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  return `文案 ${hours}:${minutes}`;
}