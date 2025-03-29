import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css'; // TODO - customize theme

interface MarkdownRendererProps {
  content: string;
}

const PostRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
      {content}
    </ReactMarkdown>
  );
};

export default PostRenderer;