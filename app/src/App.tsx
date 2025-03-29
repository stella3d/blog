import { useState, useEffect } from 'react'
import './App.css'
import PostRenderer from './PostRenderer'
import PostIndexSidebar from './PostIndexSidebar'
import { PostIndex } from './types'
import { getBlogIndex } from './client'

const MY_DID = 'did:plc:7mnpet2pvof2llhpcwattscf'; 
const INDEX_RKEY = '3lljxymbgil2r'; 

function App() {
  const [postContent, setPostContent] = useState('');
  const [indexContent, setIndexContent] = useState<PostIndex | null>(null);

  // Fetch default markdown content on mount
  useEffect(() => {
    fetch('/test_posts/helloworld.md')
      .then(res => res.text())
      .then(text => setPostContent(text))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    fetch('/test_posts/index_example.json')
      .then(res => res.json())
      .then(json => setIndexContent(json))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    getBlogIndex(MY_DID, INDEX_RKEY)
      .then(() => {
        // Handle the response if needed
        console.log('Blog index fetched successfully');
      })
      .catch((error) => {
        console.error('Error fetching blog index:', error);
      });
  })

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
