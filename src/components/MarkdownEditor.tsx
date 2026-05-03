"use client";
import { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function MarkdownEditor({ value, onChange }: Props) {
  const [tab, setTab] = useState<"write" | "preview">("write");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertText = (before: string, after: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);
    const replacement = before + selected + after;
    
    onChange(text.substring(0, start) + replacement + text.substring(end));
    
    // Reset focus
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  return (
    <div className="border rounded-xl overflow-hidden bg-white shadow-sm focus-within:ring-2 focus-within:ring-gray-900 transition-all">
      {/* Tab navigation & Toolbar */}
      <div className="flex flex-col border-b bg-gray-50/50">
        <div className="flex border-b border-gray-100">
          {(["write", "preview"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`px-6 py-3 text-sm font-medium capitalize transition-all ${
                tab === t
                  ? "bg-white text-gray-900 border-r border-l first:border-l-0 border-gray-100"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {t === "write" ? "Write" : "Preview"}
            </button>
          ))}
        </div>
        
        {tab === "write" && (
          <div className="flex items-center gap-1 p-2 bg-white">
            <button type="button" onClick={() => insertText("**", "**")} className="p-2 hover:bg-gray-100 rounded text-sm font-bold w-8 h-8 flex items-center justify-center" title="Bold">B</button>
            <button type="button" onClick={() => insertText("*", "*")} className="p-2 hover:bg-gray-100 rounded text-sm italic w-8 h-8 flex items-center justify-center" title="Italic">I</button>
            <button type="button" onClick={() => insertText("[", "](url)")} className="p-2 hover:bg-gray-100 rounded text-sm w-8 h-8 flex items-center justify-center" title="Link">🔗</button>
            <button type="button" onClick={() => insertText("\n- ")} className="p-2 hover:bg-gray-100 rounded text-sm w-8 h-8 flex items-center justify-center" title="List">•</button>
            <button type="button" onClick={() => insertText("\n### ")} className="p-2 hover:bg-gray-100 rounded text-sm font-bold w-8 h-8 flex items-center justify-center" title="Heading">H</button>
          </div>
        )}
      </div>

      {/* Editor */}
      {tab === "write" ? (
        <textarea
          ref={textareaRef}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-6 min-h-[400px] font-mono text-base resize-y focus:outline-none border-0"
          placeholder="Tulis konten artikel dalam format Markdown...

# Judul H1
## Judul H2
**Bold**, *Italic*
- List item"
        />
      ) : (
        <div className="prose prose-lg prose-serif max-w-none p-8 min-h-[400px] bg-white font-serif 
          prose-headings:text-gray-900 prose-headings:font-bold
          prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl
          prose-p:text-gray-800 leading-relaxed">
          {value ? (
            <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{value}</ReactMarkdown>
          ) : (
            <p className="text-gray-400 italic">Belum ada konten...</p>
          )}
        </div>
      )}
    </div>
  );
}
