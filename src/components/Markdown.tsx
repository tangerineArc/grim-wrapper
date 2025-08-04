import { useEffect, useState } from "react";

import { markdownToHtml } from "@/lib/markdown";

export default function CustomMarkdown({ content }: { content: string }) {
  const [renderedContent, setRenderedContent] = useState("");

  useEffect(() => {
    markdownToHtml(content + "\n[Link text](https://www.example.com)")
      .then((res) => setRenderedContent(res))
      .catch((err) => setRenderedContent(`Could not render content: ${err}`));
  }, [content]);

  return (
    <div
      className="custom-markdown"
      dangerouslySetInnerHTML={{ __html: renderedContent }}
    />
  );
}
