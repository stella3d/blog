import { useState, useEffect, useLayoutEffect } from 'react'
import './App.css'
import PostRenderer from './PostRenderer'
import PostIndexSidebar from './PostIndexSidebar'
import { PostIndex, PostIndexEntry, PostRecord } from './types'
import { getBlogEntryFromAtUri, getBlogIndex } from './client'
import { getSlugFromUrl, slugify } from './slugs'

const MY_DID = 'did:plc:7mnpet2pvof2llhpcwattscf'; 
const INDEX_RKEY = '3lljxymbgil2r'; 

function App() {
  const [postContent, setPostContent] = useState('');
  const [indexContent, setIndexContent] = useState<PostIndex | null>(null);
  const [indexCursor, setIndexCursor] = useState<number>(0);

  const getPostIndexOnLoad = (posts: PostIndexEntry[]) => {
    let slug = getSlugFromUrl()
    if (slug) {
      // find the post with the matching slug if specified
      const slugIndex = posts.findIndex(p => slugify(p.title) === slug)
      if (slugIndex == -1) {
        // remove the slug from the url - there's no post with that label
        window.history.pushState({ path: '/' }, '', '/') // reset to root
      }
      else {
        return slugIndex;
      }
    }
    return 0; // default to the 1st post if no slug is matched
  }

  const loadPost = (entry: PostIndexEntry, index: number) => {
    getBlogEntryFromAtUri(entry.post.uri)
      .then(record => {
        setPost(record, index, entry)
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
        if (posts.length < 1) {
          setPostContent('no posts found (this is an error, sorry)');
        }

        let postIndex = getPostIndexOnLoad(posts)
        loadPost(posts[postIndex], postIndex);
      })
      .catch((error) => {
        console.error('error fetching blog index: ', error);
      });
  }, []);

  return (
    <div className="app-container"> {/* Container with flex styling */}
      {indexContent && (
        <PostIndexSidebar posts={indexContent.posts} cursor={indexCursor} onPostClick={loadPost}/>
      )}
      <div className="blog-post">
        <h1 id="headtext">stellz' blog</h1>
        <PostRenderer content={postContent} />
      </div>
    </div>
  )

  function setPost(record: PostRecord, index: number, entry: PostIndexEntry) {
    setPostContent(record.content)
    setIndexCursor(index)
    // set the URL path to the post slug so it can be shared by copying
    const slug = slugify(entry.title)
    window.history.pushState({ path: slug }, '', `/${slug}`)
  }
}

export default App
