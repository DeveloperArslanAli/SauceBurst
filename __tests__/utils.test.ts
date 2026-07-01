import { getPublicImageUrl } from '@/app/lib/utils';

describe('Utility Functions', () => {
  const mockUrl = 'https://supabase.co';
  
  beforeAll(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = mockUrl;
  });

  test('getPublicImageUrl returns correct URL with clean path', () => {
    const result = getPublicImageUrl('/images/burger.jpg');
    expect(result).toBe(`${mockUrl}/storage/v1/object/public/items/images/burger.jpg`);
  });

  test('getPublicImageUrl handles null path', () => {
    const result = getPublicImageUrl(null);
    expect(result).toBe('https://via.placeholder.com/300x200?text=No+Image');
  });
});