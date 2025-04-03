import { useState, useEffect } from 'react'
import './App.css'
import PostRenderer from './PostRenderer'
import PostIndexSidebar from './PostIndexSidebar'
import { PostIndex, PostIndexEntry, PostRecord } from './types'
import { getBlogEntryFromAtUri, getBlogIndex } from './client'
import { getSlugFromUrl, slugify } from './slugs'

const MY_DID = 'did:plc:7mnpet2pvof2llhpcwattscf'; 
const INDEX_RKEY = '3lljxymbgil2r'; 

const getPostPath = (slug: string): string => {
  return slug ? `/post/${slug}` : '/';
}

const entryAtUriFromRkey = (rkey: string): string => {
  return `at://${MY_DID}/beauty.piss.blog.entry/${rkey}`;
}

function App() {
  const [postContent, setPostContent] = useState('');
  const [indexContent, setIndexContent] = useState<PostIndex | null>(null);
  const [indexCursor, setIndexCursor] = useState<number>(0);
  const [isSidebarOpen, setSidebarOpen] = useState(false); // Added state for toggling the sidebar on mobile

  const getPostIndexOnLoad = (posts: PostIndexEntry[]): number => {
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

  const setPost = (record: PostRecord, index: number) => {
    setPostContent(record.content)
    setIndexCursor(index);
    const slug = slugify(record.title);
    const path = getPostPath(slug);
    window.history.pushState({ path }, '', path);
  }

  const loadPost = (entry: PostIndexEntry, index: number) => {
    getBlogEntryFromAtUri(entry.post.uri)
      .then(record => {
        setPost(record, index);
      })
      .catch(err => {
        console.error('error fetching post content: ', err);
        setPostContent('failed to load post content 🙃');
      });
  };

  const loadPostRkey = (rkey: string) => {
    let uri = entryAtUriFromRkey(rkey);
    getBlogEntryFromAtUri(uri)
      .then(record => {
        setPostContent(record.content)
        const slug = slugify(record.title);
        const path = getPostPath(slug);
        window.history.pushState({ path }, '', path);
      })
      .catch(err => {
        console.error('error fetching post content: ', err);
        setPostContent('failed to load post content 🙃');
      });
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  }

  useEffect(() => {
    // check for rkey param in url
    const urlParams = new URLSearchParams(window.location.search);
    const rkeyParam = urlParams.get('rkey')?.trim();

    const loadingFromRkey = !!rkeyParam && rkeyParam !== '';
    if (loadingFromRkey) {
      // If there's a rkey param, load that post directly
      loadPostRkey(rkeyParam);
    }

    getBlogIndex(MY_DID, INDEX_RKEY)
      .then(json => {
        setIndexContent(json.value);

        if (loadingFromRkey) { return; }

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

  useEffect(() => {
    let debounceTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        setSidebarOpen(prev => {
          if (window.innerWidth <= 768 && prev) {
            //console.log('closing bar: ', window.innerWidth);
            return false;
          }
          if (window.innerWidth > 768 && !prev) {
            //console.log('opening bar: ', window.innerWidth);
            return true;
          }
          return prev;
        });
      }, 20);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(debounceTimer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className={`app-container ${isSidebarOpen ? "sidebar-open" : ""}`}> {/* Container with flex styling */}
      {/* Toggle button visible on mobile */}
      <button
        className={`toggle-sidebar ${isSidebarOpen ? 'open' : ''}`}
        style={{ left: isSidebarOpen ? '220px' : '0px' }} // conditionally move button based on sidebar state
        onClick={toggleSidebar}>
        ☰
      </button>
      {indexContent && (
        // Wrap sidebar with a container that toggles its "active" class
        //<div className={`${isSidebarOpen ? 'active' : ''}`}>
          <PostIndexSidebar enabled={isSidebarOpen} posts={indexContent.posts} cursor={indexCursor} onPostClick={loadPost}/>
        //</div>
      )}
      <div className="blog-post">
        <h1 id="headtext">stellz' blog</h1>
        <PostRenderer content={postContent} defocus={isSidebarOpen && window.innerWidth <= 768}/>
      </div>
    </div>
  )
}

export default App
