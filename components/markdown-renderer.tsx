"use client";

import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({
  content,
  className = "",
}: MarkdownRendererProps) {
  return (
    <div className={`prose prose-sm dark:prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        components={{
          code: ({ node, inline, className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || "");
            const language = match ? match[1] : "text";

            return !inline ? (
              <SyntaxHighlighter
                style={tomorrow}
                language={language}
                PreTag="div"
                className="rounded-lg !mt-0 !mb-4"
                customStyle={
                  {
                    margin: 0,
                    borderRadius: "8px",
                    fontSize: "13px",
                    lineHeight: "1.4",
                  } as any
                }
                {...props}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code
                className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs font-mono"
                {...props}
              >
                {children}
              </code>
            );
          },
          h1: ({ children }) => (
            <h1 className="text-xl font-bold mt-6 mb-4 first:mt-0">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-semibold mt-5 mb-3 first:mt-0">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-medium mt-4 mb-2 first:mt-0">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-sm leading-relaxed mb-3">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="text-sm space-y-1 mb-3 ml-4">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="text-sm space-y-1 mb-3 ml-4">{children}</ol>
          ),
          li: ({ children }) => <li className="text-sm">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-500 pl-4 italic text-sm bg-blue-50 dark:bg-blue-950/20 py-2 my-3 rounded-r">
              {children}
            </blockquote>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-primary">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="text-blue-600 dark:text-blue-400">{children}</em>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}