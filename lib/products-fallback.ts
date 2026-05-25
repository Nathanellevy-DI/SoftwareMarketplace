export interface ProductFallback {
  id: string
  title: string
  description: string
  price: number
  image_urls: string[]
  category: string
  tech_stack: string[]
  github_url?: string
  demo_url?: string
  download_url?: string
  features: string[]
  is_available: boolean
  product_variants?: {
    id: string
    size_name: string
    price: number
    license_details: string[]
  }[]
}

export const FALLBACK_PRODUCTS: ProductFallback[] = [
  {
    id: 'e29b41d4-1111-41d4-a716-446655440001',
    title: 'StreamBox',
    description: 'The ultimate sports fan multi-stream dashboard. Watch up to 4 matches simultaneously in a glossy, high-fidelity windowed screen layout with zero lag. Never choose between games again—experience every single buzzer-beater and touchdown in real-time.',
    price: 19.00,
    image_urls: ['/streambox.png'],
    category: 'Desktop App',
    tech_stack: ['Electron', 'React', 'Tailwind CSS', 'HLS.js', 'WebGL'],
    github_url: 'https://github.com/nathanellevy/StreamBox',
    demo_url: 'https://streambox.vercel.app',
    features: [
      'Multi-Grid Spectator Layout (Up to 4 Streams)',
      'Independent Audio Focus & Volume Mixers',
      'Reflective Glassmorphism Interactive Controls',
      'Dynamic Bookmark Stream Channel Lists',
      'Ultra Low Latency Hardware Decoding Integration'
    ],
    is_available: true,
    product_variants: [
      {
        id: 'sb-v1',
        size_name: 'Personal License',
        price: 19.00,
        license_details: ['1 User Installation', 'Free Minor Updates', 'Standard Support']
      },
      {
        id: 'sb-v2',
        size_name: 'Developer Source License',
        price: 49.00,
        license_details: ['Full Source Code Included', 'Modify for Personal Use', 'API Keys Integration']
      },
      {
        id: 'sb-v3',
        size_name: 'Commercial Redistribution License',
        price: 149.00,
        license_details: ['Commercial Resell Access', 'Priority Support SLA', 'Custom Feature Requests']
      }
    ]
  },
  {
    id: 'e29b41d4-2222-41d4-a716-446655440002',
    title: 'SayIt',
    description: 'A premium, ultra-fluid Text-to-Speech audio reader app. Converts web articles, PDF papers, and plain text documents into realistic, high-fidelity human-like synthesized reading voices with synced word highlighting.',
    price: 9.00,
    image_urls: ['/sayit.png'],
    category: 'Web App',
    tech_stack: ['HTML5 Speech API', 'Vanilla JavaScript', 'CSS Variables', 'Responsive UI'],
    github_url: 'https://github.com/nathanellevy/SayIt',
    demo_url: 'file:///Users/nathanellevy/Desktop/Text%20to%20speach/index.html',
    features: [
      'High-Fidelity Human-Like Reading Voices',
      'Dynamic Scrolling & Word Highlighting Sync',
      'Multi-Format PDF & Word Document Reader',
      'Precise Reading Speed & Tone Pitch Regulators',
      'Offline Audio Synthesis & Storage Cache'
    ],
    is_available: true,
    product_variants: [
      {
        id: 'si-v1',
        size_name: 'Standard Web License',
        price: 9.00,
        license_details: ['Lifetime Access', 'Standard Voice Tiers', 'Standard Updates']
      },
      {
        id: 'si-v2',
        size_name: 'Developer SDK License',
        price: 39.00,
        license_details: ['Speech Component Integration', 'Source Code Access', 'Support SLA']
      }
    ]
  },
  {
    id: 'e29b41d4-3333-41d4-a716-446655440003',
    title: 'yt-mp3',
    description: 'A blazing-fast, lightweight command-line and web YouTube-to-MP3 converter engine. Extracts audio from any media stream and converts it with high-fidelity metadata encapsulation and artwork tag integration.',
    price: 0.00,
    image_urls: ['/ytmp3.png'],
    category: 'CLI Tool',
    tech_stack: ['Node.js', 'FFmpeg', 'Axios', 'Commander.js'],
    github_url: 'https://github.com/nathanellevy/yt-mp3',
    demo_url: undefined,
    features: [
      'Lossless 320kbps High-Fidelity Conversion',
      'Automated ID3v2 Album Art & Meta Tagging',
      'Full YouTube Playlist & Channel Batch Downloading',
      'Lightweight Native Memory Footprint (CLI-optimized)',
      'Parallel Downloading with Worker Threads'
    ],
    is_available: true,
    product_variants: [
      {
        id: 'yt-v1',
        size_name: 'Community Open Source',
        price: 0.00,
        license_details: ['Free Forever', 'MIT Open-Source License', 'Community Support']
      },
      {
        id: 'yt-v2',
        size_name: 'Developer Sponsor Tier',
        price: 15.00,
        license_details: ['Priority Issue Solving', 'Private Discord Access', 'Backer Badge']
      }
    ]
  },
  {
    id: 'e29b41d4-4444-41d4-a716-446655440004',
    title: 'SplitTab',
    description: 'An elegant, high-performance expense partitioner for roommates, travel partners, and family groups. Input receipts, track group expenses, and let the optimizer compute the single mathematical path of minimal transaction settlements.',
    price: 5.00,
    image_urls: ['/splittab.png'],
    category: 'Web App',
    tech_stack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Tailwind CSS'],
    github_url: 'https://github.com/nathanellevy/SplitTab',
    demo_url: 'https://splittab.vercel.app',
    features: [
      'Minimal Path Settlement Calculator (Single-Click Math)',
      'Real-Time Multi-Currency Exchange Integration',
      'Interactive Group Activity Feed & Audit Logs',
      'Responsive Mobilized Layout optimized for Travel',
      'Secure SQLite / PostgreSQL Caching Layer'
    ],
    is_available: true,
    product_variants: [
      {
        id: 'st-v1',
        size_name: 'Standard License',
        price: 5.00,
        license_details: ['Lifetime personal use', 'Standard cloud backups', 'Updates Included']
      },
      {
        id: 'st-v2',
        size_name: 'Developer/Self-Host License',
        price: 25.00,
        license_details: ['Self-Host Source Code', 'Docker Deployment file', 'Developer API Hooks']
      }
    ]
  }
]
