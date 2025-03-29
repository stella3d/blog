import { useState } from 'react'
import './App.css'
import PostRenderer from './PostRenderer'

function App() {
  const [postContent, setPostContent] = useState('');

  return (
    <>
      <h1>stellz' blog</h1>

      <textarea 
        id="postinput" 
        value={postContent} 
        onChange={(e) => setPostContent(e.target.value)}
      />

      <PostRenderer content={postContent}></PostRenderer>
    </>
  )
}

export default App
