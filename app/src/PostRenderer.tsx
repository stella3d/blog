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
    <div className="post-renderer-container">
      <hr />
      <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default PostRenderer;