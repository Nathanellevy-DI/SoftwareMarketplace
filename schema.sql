-- Table for Software Products
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL, -- Serves as the base "starting at" price.
  image_urls TEXT[], -- Array of image URLs for the software screenshots
  category TEXT DEFAULT 'Web App', -- e.g., 'Web App', 'CLI Tool', 'Extension'
  tech_stack TEXT[] DEFAULT '{}', -- e.g., ['Next.js', 'React', 'Tailwind']
  github_url TEXT,
  demo_url TEXT,
  download_url TEXT,
  features TEXT[] DEFAULT '{}', -- Array of key product features
  is_available BOOLEAN DEFAULT TRUE
);

-- Table for Software License Tiers (Variants)
CREATE TABLE product_variants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  size_name TEXT NOT NULL, -- Keep 'size_name' for compatibility with base code (represents License name, e.g., 'Personal License', 'Commercial License')
  price DECIMAL(10, 2) NOT NULL,
  printful_sync_variant_id TEXT, -- Keep for compatibility, can store a download file path/id
  license_details TEXT[] DEFAULT '{}', -- e.g., ['1 Developer', 'Updates Included', 'Commercial Use']
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for Orders
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  stripe_session_id TEXT UNIQUE,
  total_amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending', -- e.g., 'pending', 'paid', 'delivered'
  license_key TEXT -- Generated license key for this purchase
);

-- Join Table for Order Items (to see what was in each order)
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL, -- Track the exact license purchased
  quantity INTEGER DEFAULT 1,
  price_at_purchase DECIMAL(10, 2) NOT NULL
);

