import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
// TODO - customize theme
import 'highlight.js/styles/atom-one-dark.min.css'; 
import { StrongRef } from './types';


export type PostRenderingData = {
  body: string,
  ref: StrongRef | null
}

interface MarkdownRendererProps {
  defocus: boolean;
  content: PostRenderingData;
}


const PostRenderer: React.FC<MarkdownRendererProps> = ({ defocus, content }) => {
  const uri = content.ref ? content.ref.uri : '';
  const pdslsLink = uri ? `https://pdsls.dev/${uri}` : null;

  return (
    <div className={`post-renderer-container ${defocus ? 'sidebar-active' : ''}`}>
      <hr />
      <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
        {content.body}
      </ReactMarkdown>
      {content.ref && pdslsLink && (
        <div className="post-footer">
          <hr />
          <p style={{ fontSize: '0.8em', color: 'lightgrey' }}>
            <a href={pdslsLink} target="_blank">view record on PDSls</a>
          </p>
          <p title="post content ID (CID)" style={{ fontSize: '0.8em', color: 'grey' }}>
            {content.ref.cid}
          </p>
        </div>
      )}
    </div>

  );
};

export default PostRenderer;