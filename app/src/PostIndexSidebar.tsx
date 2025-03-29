import React from 'react';
import { PostIndexEntry } from './types';
import { isoDateToDisplay } from './utils';

export interface PostIndexSidebarProps {
  posts: Array<PostIndexEntry>;
  cursor: number;
}

const PostIndexSidebar: React.FC<PostIndexSidebarProps> = ({ posts, cursor }) => {
  return (
    <div className="post-index-sidebar">
      <ul>
        {posts.map((entry, idx) => (
          <li key={idx} style={{
            textAlign: "left",
            backgroundColor: cursor === idx ? "#252525" : "#181818",
          }}>
            {entry.title}
          <br />
          <span style={{ color: "grey", fontSize: "0.7em" }}>
          <span style={{ display: "inline-block", paddingLeft: "0.5em" }}>
            {isoDateToDisplay(entry.createdAt)}
          </span>
          </span>
            {entry.tags && entry.tags.length > 0 && (
              <span style={{ color: "pink", fontSize: "0.7em", marginLeft: "0.5em", fontWeight: "bold" }}>
                {"🏷️ "}
                {entry.tags.slice(0, 2).join(", ")}
                {entry.tags.length > 2 && " ..."}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostIndexSidebar;
