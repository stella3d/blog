import { useState, useEffect, useLayoutEffect } from 'react'
import './App.css'
import PostRenderer from './PostRenderer'
import PostIndexSidebar from './PostIndexSidebar'
import { PostIndex, PostIndexEntry } from './types'
import { getBlogEntryFromAtUri, getBlogIndex } from './client'
import { getSlugFromUrl, slugify } from './slugs'

const MY_DID = 'did:plc:7mnpet2pvof2llhpcwattscf'; 
const INDEX_RKEY = '3lljxymbgil2r'; 

function App() {
  const [postContent, setPostContent] = useState('');
  const [indexContent, setIndexContent] = useState<PostIndex | null>(null);
  const [indexCursor, setIndexCursor] = useState<number>(0);

  const handlePostClick = (entry: PostIndexEntry, index: number) => {
    getBlogEntryFromAtUri(entry.post.uri)
      .then(entryData => {
        setPostContent(entryData.content);
        setIndexCursor(index);
      })
      .catch(err => {
        console.error('error fetching post content: ', err);
        setPostContent('failed to load post content 🙃');
      });
  };

  useLayoutEffect(() => {
    // light mode domain lol
    if (window.location.hostname === 'stellz.club') {
      document.documentElement.style.setProperty('color-scheme', 'dark light'); 
    }
  }, [])

  useEffect(() => {
    getBlogIndex(MY_DID, INDEX_RKEY)
      .then(json => {
        setIndexContent(json.value);
        let posts = json.value.posts;
        let postBySlug: PostIndexEntry | null | undefined = null; 
        if (posts.length > 0) {
          let slug = getSlugFromUrl();
          if (slug) {
            // Check for a specific slug in the posts
            postBySlug = posts.find(post => slugify(post.title) === slug);
          }

          const toLoad = postBySlug || posts[0]; // Fallback to the first post if no slug match

          getBlogEntryFromAtUri(toLoad.post.uri)
            .then(entry => {
              setPostContent(entry.content);
              setIndexCursor(0);
            })
            .catch(err => {
              console.error('error fetching latest post content: ', err);
              setPostContent('failed to load the latest post content 🙃');
          });
        }
      })
      .catch((error) => {
        console.error('error fetching blog index: ', error);
      });
  }, []);

  return (
    <div className="app-container"> {/* Container with flex styling */}
      {indexContent && (
        <PostIndexSidebar posts={indexContent.posts} cursor={indexCursor} onPostClick={handlePostClick}/>
      )}
      <div className="blog-post">
        <h1 id="headtext">stellz' blog</h1>
        <PostRenderer content={postContent} />
      </div>
    </div>
  )
}

export default App
