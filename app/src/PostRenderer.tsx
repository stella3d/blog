import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
// TODO - customize theme
import 'highlight.js/styles/atom-one-dark.min.css'; 

interface MarkdownRendererProps {
  defocus: boolean;
  content: string;
}

const PostRenderer: React.FC<MarkdownRendererProps> = ({ defocus, content }) => {

  return (
    <div className={`post-renderer-container ${defocus ? 'sidebar-active' : ''}`}>
      <hr />
      <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default PostRenderer;