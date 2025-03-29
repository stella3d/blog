import React from 'react';
import { PostIndexEntry } from './types';

interface PostIndexSidebarProps {
  posts: Array<PostIndexEntry>;
}

const PostIndexSidebar: React.FC<PostIndexSidebarProps> = ({ posts }) => {
  return (
    <div className="post-index-sidebar">
      <ul>
        {posts.map((entry, idx) => (
          <li key={idx}>{entry.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default PostIndexSidebar;
