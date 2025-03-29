import { XRPC, CredentialManager } from '@atcute/client';
import { isPostRecord, PostIndex, PostRecord } from './types';

// TODO - make service url configurable
const manager = new CredentialManager({ service: 'https://bsky.social' });
export const AT_RPC = new XRPC({ handler: manager });


/*
{
    "uri": "at://did:plc:7mnpet2pvof2llhpcwattscf/beauty.piss.blog.index/3lljxymbgil2r",
    "cid": "bafyreia7vnple5dza6oywe7w7q7p4sci7fun7h76fzq2zakfiora6vvc3m",
    "value": {
        "$type": "beauty.piss.blog.index",
        "posts": [
            {
                "post": {
                    "cid": "bafyreif3afke37uyykpui7z37yld4efvaw5kdxt6az7opcfrbj2ubvtipa",
                    "uri": "at://did:plc:7mnpet2pvof2llhpcwattscf/beauty.piss.blog.entry/3lljr3jdcjc26"
                },
                "tags": [
                    "rust",
                    "test"
                ],
                "title": "TEST POST",
                "createdAt": "2025-03-29T16:28:55.502Z"
            }
        ]
    }
}
*/
type GetIndexResponse = {
    uri: string; // URI of the record
    cid: string; // Content Identifier
    value: PostIndex;
};

function isGetIndexResponse(data: any): data is GetIndexResponse {
    return (
        data &&
        typeof data === 'object' &&
        'uri' in data &&
        'cid' in data &&
        'value' in data &&
        typeof data.value === 'object' &&
        Array.isArray(data.value.posts)
    );
}


export async function getBlogIndex(repo: string, rkey: string): Promise<GetIndexResponse> {
    const cacheKey = `blogIndex-${repo}-${rkey}`;
    const cachedResult = localStorage.getItem(cacheKey);

    if (cachedResult) {
        try {
            const { expiration, data } = JSON.parse(cachedResult);
            if (Date.now() < expiration) {
                if (!isGetIndexResponse(data)) {
                    // If the cached data does not match the expected type, fetch fresh data
                    console.warn('Cached data does not match expected type, fetching fresh data');
                } 
                return data; 
            }
        } catch {
            // Ignore JSON errors and fetch fresh data
        }
    }

    // Fetch data from server
    const { data } = await AT_RPC.get('com.atproto.repo.getRecord', {
        params: {
            repo, // Replace with actual repo DID
            collection: 'beauty.piss.blog.index', // Collection name
            rkey, // Record key, empty for the entire collection
        },
    });

    console.log('fetched data from server:', data);
    // Cache the data for 30 minutes (1800000 milliseconds)
    const expiration = Date.now() + 1800000;
    localStorage.setItem(cacheKey, JSON.stringify({ expiration, data }));

    if (!isGetIndexResponse(data)) {
        throw new Error('fetched data does not match expected type for GetIndexResponse');
    }
    return data;
}

const BLOG_ENTRY_CACHE_MS = 604800000; // 1 week 

// "at://did:plc:7mnpet2pvof2llhpcwattscf/beauty.piss.blog.entry/3lljr3jdcjc26" 
// get DID and rkey from strings that look like that
export async function getBlogEntryFromAtUri(atUri: string): Promise<PostRecord> {
    const regex = /at:\/\/([^\/]+)\/beauty\.piss\.blog\.entry\/([^\/]+)/;
    const match = atUri.match(regex);

    if (match && match.length === 3) {
        const repo = match[1]; // Extracted repo DID
        const rkey = match[2]; // Extracted record key
        return await getBlogEntry(repo, rkey);
    }

    throw new Error(
        `Invalid at-uri format or unable to extract repo and rkey from: ${atUri}`
    );
}

export async function getBlogEntry(repo: string, rkey: string): Promise<PostRecord> {
    const cacheKey = `blogEntry-${repo}-${rkey}`;
    const cachedResult = localStorage.getItem(cacheKey);

    if (cachedResult) {
        try {
            const { expiration, data } = JSON.parse(cachedResult);
            if (Date.now() < expiration) {
                if (!isPostRecord(data.value)) {
                    console.warn('Cached data does not match expected type, fetching fresh data');
                } 
                return data.value;
            }
        } catch {
            // Ignore JSON errors and fetch fresh data
        }
    }

    // Fetch data from server
    const { data } = await AT_RPC.get('com.atproto.repo.getRecord', {
        params: {
            repo,
            collection: 'beauty.piss.blog.entry',
            rkey,
        },
    });

    console.log('fetched blog entry record:', data);

    if (!isPostRecord(data.value)) {
        throw new Error('fetched data does not match expected type for PostRecord');
    }

    // Cache the data for a week (604800000 milliseconds)
    const expiration = Date.now() + BLOG_ENTRY_CACHE_MS;
    localStorage.setItem(cacheKey, JSON.stringify({ expiration, data }));

    return data.value;
}

export function purgeLocalCache() {
    Object.keys(localStorage)
        .forEach(key => localStorage.removeItem(key));
}