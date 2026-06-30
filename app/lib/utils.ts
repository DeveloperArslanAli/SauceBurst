export function getPublicImageUrl(path: string | null): string {
  if (!path) return 'https://via.placeholder.com/300x200?text=No+Image';
  // Remove leading slash if present to avoid double slashes (e.g., /images/bacon.jpg -> images/bacon.jpg)
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/items/${cleanPath}`;
}