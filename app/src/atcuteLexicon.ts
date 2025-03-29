/* eslint-disable */

/**
 * @module
 * Contains type declarations for piss.beauty blog lexicons
 */

import '@atcute/client/lexicons';

declare module '@atcute/client/lexicons' {
	namespace BeautyPissBlogIndex {
		/** A declaration of the blog index. */
        interface Record {
            $type: 'beauty.piss.blog.index';
            /** Array of posts in the blog index */
            posts: Array<{
                title: string;
                createdAt: string; // ISO date string
                tags?: Array<string>;
                post: {
                    cid: string; // Content Identifier
                    uri: string; // URI for accessing the post
                };
            }>;
        }
	}

	namespace BeautyPissBlogEntry {
		/** A declaration of a post. */
		interface Record {
			$type: 'beauty.piss.blog.entry';
            /** Maximum string length: 420 */
			title: string;
			/** Maximum string length: 200000 */
			content: string;
			images?: BeautyPissEmbedImages.Record;
            tags?: string[]; 
			createdAt: string;
		}
	}

    namespace BeautyPissEmbedImages {
        interface Record {
            $type: 'beauty.piss.embed.images';
            images: Array<BeautyPissEmbedImages.Image>;
        }
        interface Image {
            [Brand.Type]?: 'beauty.piss.embed.images#image';
            image: At.Blob;
            /** alt text */
            alt: string;
            /** Optional blurhash of the image */
            blurhash?: string;
        }
    }

	interface Records {
		'beauty.piss.blog.entry': BeautyPissBlogEntry.Record;
        'beauty.piss.blog.index': BeautyPissBlogIndex.Record;
        'beauty.piss.embed.images': BeautyPissEmbedImages.Record;
	}
}