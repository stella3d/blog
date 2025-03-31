# on the `.blog.index` record

In response to my post introducing this blog, Bryan Newbold [asked about the index record](https://bsky.app/profile/bnewbold.net/post/3llmomdgu6c2w) it uses. he was curious, basically, whether the index could be constructed by calling [`com.atproto.repo.listRecords`](https://docs.bsky.app/docs/api/com-atproto-repo-list-records), which it can. 

there's a few reasons i went with the index record instead!

## index size rules everything around me

our startup's business is very data/indexing heavy, and i'm the one designing the databases, so i spend a lot of time thinking about the literal size of my PostgreSQL indices, and i pretty much applied this same mindset to the lexicon design.

`listRecords` returns the entire record for each result, which sounded like it could get big, and thus slow, if the blog had a significant number of posts.

by contrast, the index record doesn't store the `content` of the `.blog.entry` records (which is most of the size), just metadata and links, so its growth rate should be much slower. it's also only asking for a single record, instead of asking the pds / relay to enumerate the records in the collection, and that seemed like it would also be easier on the server.

a version of `listRecords` that doesn't return the whole record was idly proposed, and i agree that it would make not having an explicit index record easier.

## more customization

`listRecords` can change its ordering, but it doesn't support any sort of other custom stuff like filtering by tag. in addition, implementing this sort of custom functionality might require more than one page of requests once you have over 100 posts (imagine being this prolific, great problem to have)

## less frontend logic

i don't want to do a lot of frontend logic to assemble the index - i pretty much want this to be a a "renderer" of what's in the records rather than having it do any significant logic. i'm not saying it's objectively better, it just aligns better with my own mental model

#### ciao!

