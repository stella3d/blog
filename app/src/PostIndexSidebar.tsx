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
          <li key={idx} style={{ textAlign: "left" }}>
            {entry.title}
            <br />
            <span style={{ color: "grey", fontSize: "0.7em" }}>
              {isoDateToDisplay(entry.createdAt)}{" "}
            </span>
            <span style={{ color: "pink", fontSize: "0.7em", marginLeft: "0.5em" }}>
              {"🏷️ "}  
              {entry.tags.slice(0, 2).join(", ")}
              {entry.tags.length > 2 && " ..."}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostIndexSidebar;
