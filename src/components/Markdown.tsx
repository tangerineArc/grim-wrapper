import React from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function CustomMarkdown({ content }: { content: string }) {
  const components = {
    h1: ({ children }: { children: React.ReactNode }) => (
      <h1 className="scroll-m-20 text-4xl font-bold tracking-tight text-balance my-2">
        {children}
      </h1>
    ),
    h2: ({ children }: { children: React.ReactNode }) => (
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight my-2">
        {children}
      </h2>
    ),
    h3: ({ children }: { children: React.ReactNode }) => (
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight my-2">
        {children}
      </h3>
    ),
    h4: ({ children }: { children: React.ReactNode }) => (
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight my-2">
        {children}
      </h4>
    ),
    h5: ({ children }: { children: React.ReactNode }) => (
      <h5 className="scroll-m-20 text-lg font-semibold tracking-tight my-2">
        {children}
      </h5>
    ),
    h6: ({ children }: { children: React.ReactNode }) => (
      <h6 className="scroll-m-20 text-base font-semibold tracking-tight my-2">
        {children}
      </h6>
    ),
    p: ({ children }: { children: React.ReactNode }) => (
      <p className="leading-7 [&:not(:first-child)]:mt-6">{children}</p>
    ),
    blockquote: ({ children }: { children: React.ReactNode }) => (
      <blockquote className="mt-6 border-l-2 pl-6 italic">
        {children}
      </blockquote>
    ),
    table: ({ children }: { children: React.ReactNode }) => (
      <div className="my-6 w-full overflow-y-auto">
        <table className="w-full">{children}</table>
      </div>
    ),
    tr: ({ children }: { children: React.ReactNode }) => (
      <tr className="even:bg-muted m-0 border-t p-0">{children}</tr>
    ),
    th: ({ children }: { children: React.ReactNode }) => (
      <th className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
        {children}
      </th>
    ),
    td: ({ children }: { children: React.ReactNode }) => (
      <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
        {children}
      </td>
    ),
    ul: ({ children }: { children: React.ReactNode }) => (
      <ul className="my-6 ml-6 list-disc [&>li]:mt-2">{children}</ul>
    ),
    code: ({ children }: { children: React.ReactNode }) => (
      <code className="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
        {children}
      </code>
    ),
    a: ({ children, href }: { children: React.ReactNode; href: string }) => (
      <a
        href={href}
        className="text-sky-400"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
    strong: ({ children }: { children: React.ReactNode }) => (
      <strong className="font-bold">{children}</strong>
    ),
  };

  return (
    // @ts-expect-error don't check for every element
    <Markdown components={components} remarkPlugins={[remarkGfm]}>
      {content}
    </Markdown>
  );
}
