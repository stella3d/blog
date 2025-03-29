/*
{
  "$type": "beauty.piss.blog.index",
  "posts": [
    {
      "title": "TEST POST",
      "createdAt": "2025-03-29T16:28:55.502Z",
      "tags": ["rust", "test"],
      "post": {
        "cid": "bafyreif3afke37uyykpui7z37yld4efvaw5kdxt6az7opcfrbj2ubvtipa",
        "uri": "at://did:plc:7mnpet2pvof2llhpcwattscf/beauty.piss.blog.entry/3lljr3jdcjc26"
      }
    }
  ]
}
*/
export type PostIndex = {
  $type: "beauty.piss.blog.index";
  posts: Array<PostIndexEntry>;
}

/*
{
    "title": "TEST POST",
    "createdAt": "2025-03-29T16:28:55.502Z",
    "tags": ["rust", "test"],
    "post": {
    "cid": "bafyreif3afke37uyykpui7z37yld4efvaw5kdxt6az7opcfrbj2ubvtipa",
    "uri": "at://did:plc:7mnpet2pvof2llhpcwattscf/beauty.piss.blog.entry/3lljr3jdcjc26"
    }
}
*/
export type PostIndexEntry = {
  title: string;
  createdAt: string; // ISO date string
  tags?: Array<string>;
  post: {
    cid: string; // Content Identifier
    uri: string; // URI for accessing the post
  };
}

export type PostRecord = {
    $type: 'beauty.piss.blog.entry';
    /** Maximum string length: 420 */
    title: string;
    /** Maximum string length: 200000 */
    content: string;
    //images?: BeautyPissEmbedImages.Record;
    tags?: string[]; 
    /** ISO string */
    createdAt: string;
}

export function isPostRecord(obj: any): obj is PostRecord {
    return (
        obj &&
        typeof obj === 'object' &&
        '$type' in obj &&
        obj.$type === 'beauty.piss.blog.entry' &&
        'title' in obj &&
        typeof obj.title === 'string' &&
        'content' in obj &&
        typeof obj.content === 'string' &&
        'createdAt' in obj &&
        typeof obj.createdAt === 'string'
    );
}