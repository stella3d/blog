import { useState, useEffect } from 'react'
import './App.css'
import PostRenderer from './PostRenderer'
import PostIndexSidebar from './PostIndexSidebar'
import { PostIndex } from './types'
import { getBlogEntryFromAtUri, getBlogIndex } from './client'

const MY_DID = 'did:plc:7mnpet2pvof2llhpcwattscf'; 
const INDEX_RKEY = '3lljxymbgil2r'; 

function App() {
  const [postContent, setPostContent] = useState('');
  const [indexContent, setIndexContent] = useState<PostIndex | null>(null);

  useEffect(() => {
    getBlogIndex(MY_DID, INDEX_RKEY)
      .then(json => {
        setIndexContent(json.value);
        console.log('index content: ', json.value); // Log the index content for debugging
        let posts = json.value.posts; 
        if (posts.length > 0) {
          let latest = posts[0]; 
          getBlogEntryFromAtUri(latest.post.uri)
            .then(entry => {
              setPostContent(entry.content);
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
        <PostIndexSidebar posts={indexContent.posts} />
      )}
      <div className="blog-post">
        <h1 id="headtext">stellz' blog</h1>
        <PostRenderer content={postContent} />
      </div>
    </div>
  )
}

export default App
