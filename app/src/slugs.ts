export function slugify(title: string): string {
    return title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]+/g, '')   // remove accents
        .replace(/[^a-z0-9]+/g, '-')         // replace one or more invalid characters with a dash
        .replace(/^-+|-+$/g, '');            // trim dashes from start and end
}

export function getSlugFromUrl(): string {
    // Extract the slug from the current URL
    const path = window.location.pathname;
    const segments = path.split('/');
    // Assuming the slug is the last segment of the path
    const slug = segments[segments.length - 1];
    return slug && slug !== '/' ? slug : '';
}

export function getTagFromQuery(): string | null {
    // Extract the tag from the URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const tag = urlParams.get('tag');
    return tag ? tag.trim() : null;
}