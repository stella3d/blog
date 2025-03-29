import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
// TODO - customize theme
import 'highlight.js/styles/base16/seti-ui.css'; 

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