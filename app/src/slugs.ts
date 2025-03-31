export function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')                // separate accents from letters
    .replace(/[\u0300-\u036f]/g, '')   // remove accents
    .replace(/[^a-z0-9\s-]/g, '')      // remove invalid characters
    .trim()
    .replace(/\s+/g, '-')             // replace spaces with dashes
    .replace(/-+/g, '-');             // collapse multiple dashes
}


export function getSlugFromUrl(): string {
    // Extract the slug from the current URL
    const path = window.location.pathname;
    const segments = path.split('/');
    
    // Assuming the slug is the last segment of the path
    const slug = segments[segments.length - 1];
    
    // Return empty string if slug is not valid
    return slug && slug !== '/' ? slug : '';
}