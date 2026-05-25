import postgres from 'postgres';
import { config } from 'dotenv';
config({ path: '.env.local' });

const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });

async function seed() {
  console.log('Creating tables...');

  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      title TEXT NOT NULL,
      description TEXT,
      price DECIMAL(10, 2) NOT NULL,
      image_url TEXT NOT NULL,
      category TEXT DEFAULT 'Print',
      is_available BOOLEAN DEFAULT TRUE
    )
  `;
  console.log('✓ products table created');

  await sql`
    CREATE TABLE IF NOT EXISTS orders (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      customer_email TEXT NOT NULL,
      stripe_session_id TEXT UNIQUE,
      total_amount DECIMAL(10, 2) NOT NULL,
      status TEXT DEFAULT 'pending'
    )
  `;
  console.log('✓ orders table created');

  await sql`
    CREATE TABLE IF NOT EXISTS order_items (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
      product_id UUID REFERENCES products(id),
      quantity INTEGER DEFAULT 1,
      price_at_purchase DECIMAL(10, 2) NOT NULL
    )
  `;
  console.log('✓ order_items table created');

  console.log('\nAll tables created successfully!');
  await sql.end();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
