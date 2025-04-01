/// <reference types="node" />
import { AT_RPC } from '../src/client';
import { PostRecord, PostIndex, PostIndexEntry } from '../src/types';
import * as fs from 'fs';
import * as path from 'path';

// Environment variables or configuration (ensure these are set)
const MY_DID = process.env.MY_DID || 'did:plc:7mnpet2pvof2llhpcwattscf';
const INDEX_RKEY = process.env.INDEX_RKEY || '3lljxymbgil2r';

// Parse command line arguments
const args = process.argv.slice(2);
let markdownPath = '';
let title = '';
let tags: string[] = [];

// Simple argument parsing
for (let i = 0; i < args.length; i++) {
    if (args[i] === '--title' && args[i + 1]) {
        title = args[i + 1];
        i++;
    } else if (args[i] === '--tags' && args[i + 1]) {
        tags = args[i + 1].split(',').map(tag => tag.trim());
        i++;
    } else if (!markdownPath) {
        markdownPath = args[i];
    }
}

if (!markdownPath || !title) {
    console.error('Usage: node publishPost.js <markdownFilePath> --title "Your Title" [--tags tag1,tag2,...]');
    process.exit(1);
}

const resolvedPath = path.resolve(markdownPath);
if (!fs.existsSync(resolvedPath)) {
    console.error(`File not found: ${resolvedPath}`);
    process.exit(1);
}

const fileContent = fs.readFileSync(resolvedPath, 'utf8');

// Construct the post record with content from the markdown file, title, tags, and createdAt timestamp
const newPost: PostRecord = {
    $type: 'beauty.piss.blog.entry',
    title,
    content: fileContent,
    tags,
    createdAt: new Date().toISOString(),
};

async function publishPost(newPost: PostRecord) {
  console.log('\n', newPost, '\n');

  // Create the blog entry record using AT_RPC.create (fill in implementation details)
  const createResp = await AT_RPC.call('com.atproto.repo.createRecord', {
    data: {
      repo: MY_DID,
      collection: 'beauty.piss.blog.entry',
      rkey: '', // Let the server assign the rkey if applicable
      record: newPost,
    },
  });

  const cid: string = createResp.data.cid;
  let uriParts = createResp.data.uri.split("/");
  const rkey: string = uriParts[uriParts.length - 1];

  // Construct new PostIndexEntry
  const newIndexEntry: PostIndexEntry = {
    title: newPost.title,
    createdAt: newPost.createdAt,
    tags: newPost.tags,
    post: {
      cid,
      uri: `at://${MY_DID}/beauty.piss.blog.entry/${rkey}`,
    },
  };

  // Retrieve the existing blog index record
  const getIndexResp = await AT_RPC.get('com.atproto.repo.getRecord', {
    params: {
      repo: MY_DID,
      collection: 'beauty.piss.blog.index',
      rkey: INDEX_RKEY,
    },
  });
  const blogIndex: PostIndex = getIndexResp.data.value as PostIndex;

  
  // Append the new index entry
  blogIndex.posts.push(newIndexEntry);
  
  // Update the blog index record on the server
  await AT_RPC.call('com.atproto.repo.putRecord', {
      data: {
          collection: 'beauty.piss.blog.index',
          record: blogIndex,
          repo: MY_DID,
          rkey: INDEX_RKEY
      }
  });

  // Output the new identifiers and index entry
  console.log(JSON.stringify({
    cid,
    rkey,
    indexEntry: newIndexEntry,
  }));
}

publishPost(newPost).catch(err => {
  console.error('Error publishing post:', err);
  process.exit(1);
});
