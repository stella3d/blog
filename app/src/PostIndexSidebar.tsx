import React, { useState } from 'react';
import { PostIndexEntry } from './types';
import { isoDateToDisplay } from './utils';

export interface PostIndexSidebarProps {
  enabled: boolean;
  posts: Array<PostIndexEntry>;
  cursor: number;
  tag: string | null | undefined; 
  onPostClick: (entry: PostIndexEntry, index: number) => void;
}

const PostIndexSidebar: React.FC<PostIndexSidebarProps> = ({ enabled, posts, cursor, tag, onPostClick }) => {
  const [selectedTag, setSelectedTag] = useState(tag ? tag : 'all');
  const allTags = Array.from(new Set(posts.flatMap(post => post.tags || []))).sort((a, b) => a.localeCompare(b));
  const filteredPosts = selectedTag === 'all'
    ? posts
    : posts.filter(post => post.tags && post.tags.includes(selectedTag));

  return (
    <div className={`post-index-sidebar ${enabled ? 'active' : ''}`}>
      <div style={{ marginBottom: '0.2em' }}>
        <select
          className="tag-select"
          value={selectedTag}
          onChange={setTagWithQuery(setSelectedTag)}
        >
          <option value="all">all tags</option>
          {allTags.map(tag => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>
      <ul>
        {filteredPosts.map((entry, idx) => (
          <li key={idx}
            onClick={() => onPostClick(entry, idx)}
            style={{
              textAlign: "left",
              backgroundColor: cursor === idx ? "#252525" : "#181818",
              cursor: "pointer",
            }}>
            {entry.title}
            <br />
            <span style={{ color: "grey", fontSize: "0.7em" }}>
              <span style={{ display: "inline-block", paddingLeft: "0.5em" }}>
                {isoDateToDisplay(entry.createdAt)}
              </span>
            </span>
            {entry.tags && entry.tags.length > 0 && (
              <span style={{ color: "rgb(251, 192, 255)", fontSize: "0.7em", marginLeft: "0.5em", fontWeight: "bold" }}>
                {"🏷️ "}
                {entry.tags.slice(0, 3).join(", ")}
                {entry.tags.length > 3 && (
                  ", +" + (entry.tags.length - 3).toString()
                )}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

function setTagWithQuery(setSelectedTag: React.Dispatch<React.SetStateAction<string>>): React.ChangeEventHandler<HTMLSelectElement> | undefined {
  return (e) => {
    const value = e.target.value;
    setSelectedTag(value);
    const searchParams = new URLSearchParams(window.location.search);
    if (value === 'all') {
      searchParams.delete("tag");
    } else {
      searchParams.set("tag", value);
    }
    const query = searchParams.toString();
    const newUrl = window.location.pathname + (query ? "?" + query : "");
    window.history.pushState(null, "", newUrl);
  };
}

export default PostIndexSidebar;


