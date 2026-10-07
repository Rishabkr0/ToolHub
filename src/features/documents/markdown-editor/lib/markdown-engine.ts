/**
 * Lightweight, safe client-side Markdown to HTML converter.
 */
export function renderMarkdownToHtml(markdown: string): string {
  if (!markdown) return ""

  // Escape HTML tags to prevent XSS
  let html = markdown
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")

  // Code blocks (```language ... ```)
  html = html.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, (_, lang, code) => {
    return `<pre class="bg-surface-container-highest p-4 rounded-lg border-2 border-on-background font-mono text-xs overflow-x-auto my-4"><code class="language-${lang}">${code.trim()}</code></pre>`
  })

  // Inline code (`code`)
  html = html.replace(/`([^`]+)`/g, '<code class="bg-surface-container-high px-1.5 py-0.5 rounded text-primary font-mono text-xs border border-surface-variant">$1</code>')

  // Blockquotes (> quote)
  html = html.replace(/^\s*&gt;\s+(.*$)/gim, '<blockquote class="border-l-4 border-primary pl-4 py-1 italic my-3 text-on-surface-variant bg-surface-container-low rounded-r">$1</blockquote>')

  // Headers (H1-H6)
  html = html.replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mt-5 mb-2 font-display-md text-on-background">$1</h3>')
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-6 mb-3 font-display-md text-on-background border-b-2 border-surface-variant pb-1">$1</h2>')
  html = html.replace(/^# (.*$)/gim, '<h1 class="text-3xl font-extrabold mt-6 mb-4 font-display-lg text-on-background border-b-[3px] border-on-background pb-2">$1</h1>')

  // Horizontal rules (---)
  html = html.replace(/^\s*---\s*$/gim, '<hr class="my-6 border-t-2 border-on-background" />')

  // Bold & Italic
  html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-on-surface">$1</strong>')
  html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')

  // Links ([text](url))
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary font-bold underline hover:opacity-80">$1</a>')

  // Unordered lists (- or *)
  html = html.replace(/^\s*[\-\*]\s+(.*$)/gim, '<li class="ml-4 list-disc text-on-surface mb-1">$1</li>')

  // Paragraphs
  const paragraphs = html.split(/\n\s*\n/)
  html = paragraphs
    .map(p => {
      const trimmed = p.trim()
      if (!trimmed) return ""
      if (trimmed.startsWith("<h") || trimmed.startsWith("<pre") || trimmed.startsWith("<blockquote") || trimmed.startsWith("<hr") || trimmed.startsWith("<li")) {
        return trimmed
      }
      return `<p class="mb-3 leading-relaxed text-on-surface">${trimmed.replace(/\n/g, "<br/>")}</p>`
    })
    .join("\n")

  return html
}
