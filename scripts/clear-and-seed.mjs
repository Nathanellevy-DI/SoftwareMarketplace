import pg from 'pg'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const conString = process.env.DATABASE_URL || "postgresql://postgres:Cpxkjkaz5Nigl8CM@db.czdhymqvepshaysyyoed.supabase.co:5432/postgres"

// Valid UUID strings
const STREAMBOX_UUID = "e29b41d4-1111-41d4-a716-446655440001"
const SAYIT_UUID = "e29b41d4-2222-41d4-a716-446655440002"
const YTMP3_UUID = "e29b41d4-3333-41d4-a716-446655440003"
const SPLITTAB_UUID = "e29b41d4-4444-41d4-a716-446655440004"

async function run() {
  console.log("⚡ Starting Database Cleansing & Seeding (UUID & NOT NULL Mode)...")
  console.log(`Connecting to: ${conString.split('@')[1] || conString}`)

  const client = new pg.Client({ connectionString: conString })
  
  try {
    await client.connect()
    console.log("🚀 Connected to PostgreSQL database successfully.")

    // 1. Clear existing orders and products
    console.log("🧼 Cleaning up all existing physical products, variants, and order history...")
    await client.query("DELETE FROM order_items;")
    await client.query("DELETE FROM product_variants;")
    await client.query("DELETE FROM products;")
    await client.query("DELETE FROM orders;")
    console.log("✅ All old products and print tables cleared successfully.")

    // 2. Insert new Software products
    console.log("🌱 Seeding active Software MP products...")
    
    // Product 1: StreamBox
    await client.query(`
      INSERT INTO products (id, title, description, price, image_url, image_urls, category, tech_stack, github_url, demo_url, features, is_available)
      VALUES (
        '${STREAMBOX_UUID}',
        'StreamBox',
        'The ultimate sports fan multi-stream dashboard. Watch up to 4 matches simultaneously in a glossy, high-fidelity windowed screen layout with zero lag. Never choose between games again—experience every single buzzer-beater and touchdown in real-time.',
        19.00,
        '/streambox.png',
        ARRAY['/streambox.png'],
        'Desktop App',
        ARRAY['Electron', 'React', 'Tailwind CSS', 'HLS.js', 'WebGL'],
        'https://github.com/nathanellevy/StreamBox',
        'https://streambox.vercel.app',
        ARRAY['Multi-Grid Spectator Layout (Up to 4 Streams)', 'Independent Audio Focus & Volume Mixers', 'Reflective Glassmorphism Interactive Controls', 'Dynamic Bookmark Stream Channel Lists', 'Ultra Low Latency Hardware Decoding Integration'],
        true
      );
    `)
    console.log("✅ Seeded product: StreamBox")

    // Product 2: SayIt
    await client.query(`
      INSERT INTO products (id, title, description, price, image_url, image_urls, category, tech_stack, github_url, demo_url, features, is_available)
      VALUES (
        '${SAYIT_UUID}',
        'SayIt',
        'A premium, ultra-fluid Text-to-Speech audio reader app. Converts web articles, PDF papers, and plain text documents into realistic, high-fidelity human-like synthesized reading voices with synced word highlighting.',
        9.00,
        '/sayit.png',
        ARRAY['/sayit.png'],
        'Web App',
        ARRAY['HTML5 Speech API', 'Vanilla JavaScript', 'CSS Variables', 'Responsive UI'],
        'https://github.com/nathanellevy/SayIt',
        'file:///Users/nathanellevy/Desktop/Text%20to%20speach/index.html',
        ARRAY['High-Fidelity Human-Like Reading Voices', 'Dynamic Scrolling & Word Highlighting Sync', 'Multi-Format PDF & Word Document Reader', 'Precise Reading Speed & Tone Pitch Regulators', 'Offline Audio Synthesis & Storage Cache'],
        true
      );
    `)
    console.log("✅ Seeded product: SayIt")

    // Product 3: yt-mp3
    await client.query(`
      INSERT INTO products (id, title, description, price, image_url, image_urls, category, tech_stack, github_url, features, is_available)
      VALUES (
        '${YTMP3_UUID}',
        'yt-mp3',
        'A blazing-fast, lightweight command-line and web YouTube-to-MP3 converter engine. Extracts audio from any media stream and converts it with high-fidelity metadata encapsulation and artwork tag integration.',
        0.00,
        '/logo.png',
        ARRAY['/logo.png'],
        'CLI Tool',
        ARRAY['Node.js', 'FFmpeg', 'Axios', 'Commander.js'],
        'https://github.com/nathanellevy/yt-mp3',
        ARRAY['Lossless 320kbps High-Fidelity Conversion', 'Automated ID3v2 Album Art & Meta Tagging', 'Full YouTube Playlist & Channel Batch Downloading', 'Lightweight Native Memory Footprint (CLI-optimized)', 'Parallel Downloading with Worker Threads'],
        true
      );
    `)
    console.log("✅ Seeded product: yt-mp3")

    // Product 4: SplitTab
    await client.query(`
      INSERT INTO products (id, title, description, price, image_url, image_urls, category, tech_stack, github_url, demo_url, features, is_available)
      VALUES (
        '${SPLITTAB_UUID}',
        'SplitTab',
        'An elegant, high-performance expense partitioner for roommates, travel partners, and family groups. Input receipts, track group expenses, and let the optimizer compute the single mathematical path of minimal transaction settlements.',
        5.00,
        '/logo.png',
        ARRAY['/logo.png'],
        'Web App',
        ARRAY['Next.js', 'TypeScript', 'PostgreSQL', 'Tailwind CSS'],
        'https://github.com/nathanellevy/SplitTab',
        'https://splittab.vercel.app',
        ARRAY['Minimal Path Settlement Calculator (Single-Click Math)', 'Real-Time Multi-Currency Exchange Integration', 'Interactive Group Activity Feed & Audit Logs', 'Responsive Mobilized Layout optimized for Travel', 'Secure SQLite / PostgreSQL Caching Layer'],
        true
      );
    `)
    console.log("✅ Seeded product: SplitTab")


    // 3. Insert License Tiers (variants)
    console.log("🌱 Seeding software license tiers (variants)...")

    // StreamBox Variants
    await client.query(`
      INSERT INTO product_variants (product_id, size_name, price, license_details)
      VALUES 
        ('${STREAMBOX_UUID}', 'Personal License', 19.00, ARRAY['1 User Installation', 'Free Minor Updates', 'Standard Support']),
        ('${STREAMBOX_UUID}', 'Developer Source License', 49.00, ARRAY['Full Source Code Included', 'Modify for Personal Use', 'API Keys Integration']),
        ('${STREAMBOX_UUID}', 'Commercial Redistribution License', 149.00, ARRAY['Commercial Resell Access', 'Priority Support SLA', 'Custom Feature Requests']);
    `)

    // SayIt Variants
    await client.query(`
      INSERT INTO product_variants (product_id, size_name, price, license_details)
      VALUES 
        ('${SAYIT_UUID}', 'Standard Web License', 9.00, ARRAY['Lifetime Access', 'Standard Voice Tiers', 'Standard Updates']),
        ('${SAYIT_UUID}', 'Developer SDK License', 39.00, ARRAY['Speech Component Integration', 'Source Code Access', 'Support SLA']);
    `)

    // yt-mp3 Variants
    await client.query(`
      INSERT INTO product_variants (product_id, size_name, price, license_details)
      VALUES 
        ('${YTMP3_UUID}', 'Community Open Source', 0.00, ARRAY['Free Forever', 'MIT Open-Source License', 'Community Support']),
        ('${YTMP3_UUID}', 'Developer Sponsor Tier', 15.00, ARRAY['Priority Issue Solving', 'Private Discord Access', 'Backer Badge']);
    `)

    // SplitTab Variants
    await client.query(`
      INSERT INTO product_variants (product_id, size_name, price, license_details)
      VALUES 
        ('${SPLITTAB_UUID}', 'Standard License', 5.00, ARRAY['Lifetime personal use', 'Standard cloud backups', 'Updates Included']),
        ('${SPLITTAB_UUID}', 'Developer/Self-Host License', 25.00, ARRAY['Self-Host Source Code', 'Docker Deployment file', 'Developer API Hooks']);
    `)

    console.log("🎉 Database cleansing and software seeding completed successfully!")
  } catch (error) {
    console.error("💥 Error during database migration:", error)
  } finally {
    await client.end()
    console.log("🔌 Database connection closed.")
  }
}

run()
