// scripts/seed.ts
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function seed() {
  const { data: cats, error: catErr } = await supabase
    .from('categories')
    .insert([
      { name: 'Burgers', slug: 'burgers', description: 'Juicy, flame‑grilled burgers' },
      { name: 'Pizzas', slug: 'pizzas', description: 'Authentic wood‑fired pizzas' },
      { name: 'Drinks', slug: 'drinks', description: 'Refreshing beverages' },
    ])
    .select();

  if (catErr) throw catErr;

  const burgerId = cats.find(c => c.slug === 'burgers')!.id;
  const pizzaId = cats.find(c => c.slug === 'pizzas')!.id;
  const drinkId = cats.find(c => c.slug === 'drinks')!.id;

  const { error: itemErr } = await supabase
    .from('items')
    .insert([
      { category_id: burgerId, name: 'Classic Cheeseburger', slug: 'classic-cheeseburger', description: 'Beef patty, cheddar, lettuce, tomato', price: 9.99, image_url: '/images/cheeseburger.jpg' },
      { category_id: burgerId, name: 'Bacon Deluxe', slug: 'bacon-deluxe', description: 'Double beef, bacon, swiss cheese', price: 12.49, image_url: '/images/bacon-deluxe.jpg' },
      { category_id: pizzaId, name: 'Margherita', slug: 'margherita', description: 'Tomato, mozzarella, basil', price: 10.99, image_url: '/images/margherita.jpg' },
      { category_id: pizzaId, name: 'Pepperoni', slug: 'pepperoni', description: 'Spicy pepperoni, mozzarella, tomato', price: 12.99, image_url: '/images/pepperoni.jpg' },
      { category_id: drinkId, name: 'Coke', slug: 'coke', description: 'Classic Coca‑Cola', price: 2.49, image_url: '/images/coke.jpg' },
      { category_id: drinkId, name: 'Lemonade', slug: 'lemonade', description: 'Freshly squeezed', price: 3.49, image_url: '/images/lemonade.jpg' },
    ]);

  if (itemErr) throw itemErr;
  console.log('✅ Seed completed');
}

seed().catch(console.error);