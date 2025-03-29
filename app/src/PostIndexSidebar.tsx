import React from 'react';
import { PostIndexEntry } from './types';
import { isoDateToDisplay } from './utils';

interface PostIndexSidebarProps {
  posts: Array<PostIndexEntry>;
}

const PostIndexSidebar: React.FC<PostIndexSidebarProps> = ({ posts }) => {
  return (
    <div className="post-index-sidebar">
      <ul>
        {posts.map((entry, idx) => (
          <li key={idx}>
            {entry.title}
            <small style={{ color: "grey", fontSize: "0.8em" }}>
              {isoDateToDisplay(entry.createdAt)}
            </small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostIndexSidebar;
