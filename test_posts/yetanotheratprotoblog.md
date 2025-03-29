# yet another atproto blog

I, like many others in the bluesky dev community, have built a personal blog on top of atproto. The CSS is not good yet, please forgive me. 

Here's a little about it for the curious:

## custom lexicons

This blog uses 2 lexicons (with a 3rd composed but unused).

### `beauty.piss.blog.entry`

fairly standard blog post lexicon, similar to WhiteWnd, with the addition of tags, and requiring more fields.

this record stores Markdown that the frontend renders.

### `beauty.piss.blog.index`

a reverse-chronological list of all posts in the blog, used to do navigation.

this is fetched on load, and then the latest post is loaded by default.


## future plans

* automate the process of updating the index when i make a new post
* make images work
* write a bunch of posts about computers and dance music.