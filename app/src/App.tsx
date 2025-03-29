import { useState, useEffect } from 'react'
import './App.css'
import PostRenderer from './PostRenderer'

function App() {
  const [postContent, setPostContent] = useState('');

  // Fetch default markdown content on mount
  useEffect(() => {
    fetch('/test_posts/helloworld.md')
      .then(res => res.text())
      .then(text => setPostContent(text))
      .catch(err => console.error(err));
  }, []);

  return (
    <>
      <h1 id="headtext">stellz' blog</h1>

      <PostRenderer content={postContent}></PostRenderer>
    </>
  )
}

export default App
