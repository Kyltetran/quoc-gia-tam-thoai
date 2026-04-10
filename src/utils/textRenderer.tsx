import React from 'react';
import ReactMarkdown from 'react-markdown';

interface TextRendererProps {
  content: string;
  className?: string;
}

/**
 * Renders text content with proper markdown parsing and formatting.
 * Handles both plain text and markdown-formatted content.
 */
export const TextRenderer: React.FC<TextRendererProps> = ({ content, className = '' }) => {
  if (!content) return null;

  // Clean up the content
  const cleanedContent = content
    .trim()
    .replace(/\*\*\*/g, '') // Remove *** markers if any
    .replace(/^#+\s+/gm, '') // Remove markdown headers
    .replace(/\n\n+/g, '\n\n'); // Normalize multiple line breaks

  return (
    <ReactMarkdown
      className={`prose prose-sm max-w-none ${className}`}
      components={{
        // Style paragraphs with proper spacing
        p: ({ children }) => (
          <p className="mb-4 last:mb-0 leading-relaxed">
            {children}
          </p>
        ),
        // Style list items
        li: ({ children }) => (
          <li className="mb-2 ml-4">
            {children}
          </li>
        ),
        // Style bold text without strong markdown styling
        strong: ({ children }) => (
          <span className="font-semibold">
            {children}
          </span>
        ),
        // Style italic text without em markdown styling
        em: ({ children }) => (
          <span className="italic opacity-90">
            {children}
          </span>
        ),
        // Style headings (if any appear)
        h1: ({ children }) => (
          <h1 className="text-lg font-bold mb-3 mt-4 first:mt-0">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-base font-bold mb-2 mt-3">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-sm font-bold mb-2 mt-2">
            {children}
          </h3>
        ),
        // Style code blocks
        code: ({ children }) => (
          <code className="bg-black/10 px-2 py-1 rounded text-xs font-mono">
            {children}
          </code>
        ),
        // Style blockquotes
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-current/30 pl-4 italic opacity-80">
            {children}
          </blockquote>
        ),
      }}
    >
      {cleanedContent}
    </ReactMarkdown>
  );
};

/**
 * Formats plain text with proper paragraph breaks and readability.
 * Used when markdown parsing is not needed.
 */
export const PlainTextFormatter: React.FC<TextRendererProps> = ({ content, className = '' }) => {
  if (!content) return null;

  // Split by double newlines for paragraphs, then by single newlines for breaks
  const paragraphs = content.split(/\n\n+/).filter(Boolean);

  return (
    <div className={className}>
      {paragraphs.map((paragraph, idx) => (
        <p key={idx} className="mb-4 last:mb-0 leading-relaxed whitespace-pre-wrap">
          {paragraph.trim()}
        </p>
      ))}
    </div>
  );
};

/**
 * Smart text renderer that detects markdown syntax and renders appropriately.
 */
export const SmartTextRenderer: React.FC<TextRendererProps> = ({ content, className = '' }) => {
  if (!content) return null;

  // Check if content contains markdown syntax
  const hasMarkdown = /[\*_`\[\]#]/.test(content);

  return hasMarkdown ? (
    <TextRenderer content={content} className={className} />
  ) : (
    <PlainTextFormatter content={content} className={className} />
  );
};
