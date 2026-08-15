export const INITIAL_VENDORS = [
  {
    id: 'v1',
    businessName: 'The Greenhouse Sandton',
    category: 'Venue',
    areasServed: ['Sandton', 'Johannesburg'],
    celebrationsServed: 'BOTH',
    priceFrom: 45000,
    rating: 4.9,
    reviewsCount: 28,
    description: 'A botanical glasshouse venue offering lush gardens and contemporary luxury for both traditional celebrations and white weddings.',
    tier: 'FEATURED',
    isLive: true,
    completenessScore: 95,
    coverPhoto: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80'
    ],
    brochurePdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    brochureFileName: 'The_Greenhouse_2026_Wedding_Packages.pdf',
    packages: [
      { id: 'p1_1', title: 'Full Glasshouse Hall Rental & Gardens', price: 45000, type: 'FIXED', description: 'Includes tables, gold Tiffany chairs, ambient lighting & bridal suite' },
      { id: 'p1_2', title: 'Gourmet 3-Course Plated Dinner', price: 420, type: 'PER_GUEST', description: 'Curated menu with wine pairings and welcome cocktails' },
      { id: 'p1_3', title: 'Late-Night Traditional Food Station Add-on', price: 150, type: 'PER_GUEST', description: 'Mogodu, Samp, Chakalaka & Braai platters for midnight snacking' }
    ]
  },
  {
    id: 'v2',
    businessName: 'Thando M. Photography',
    category: 'Photography',
    areasServed: ['Sandton', 'Johannesburg', 'Midrand'],
    celebrationsServed: 'BOTH',
    priceFrom: 18000,
    rating: 4.8,
    reviewsCount: 19,
    description: 'Documentary-style wedding photographer capturing rich textures, vibrant traditional attire, and timeless emotional moments.',
    tier: 'STANDARD',
    isLive: true,
    completenessScore: 90,
    coverPhoto: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=800&q=80'
    ],
    brochurePdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    brochureFileName: 'Thando_M_Photography_Pricing_2026.pdf',
    packages: [
      { id: 'p2_1', title: 'Full Day Double Wedding Photography (12 Hours)', price: 18000, type: 'FIXED', description: 'Covers traditional & white wedding celebrations with 500+ edited high-res photos' },
      { id: 'p2_2', title: 'Cinematic 4K Highlight Reel & Drone Coverage', price: 6500, type: 'FIXED', description: 'Aerial drone footage of venue and a 5-minute highlight video set to music' },
      { id: 'p2_3', title: 'Pre-Wedding Lobola / Couple Engagement Shoot', price: 3500, type: 'FIXED', description: '2-hour relaxed portrait session before the big celebrations' }
    ]
  },
  {
    id: 'v3',
    businessName: 'Ubuntu Culinary Art & Catering',
    category: 'Catering',
    areasServed: ['Soweto', 'Pretoria', 'Midrand'],
    celebrationsServed: 'TRADITIONAL',
    priceFrom: 25000,
    rating: 4.9,
    reviewsCount: 34,
    description: 'Master chefs specializing in authentic traditional South African wedding feasts, spit braais, and modern fusion banquets.',
    tier: 'FEATURED',
    isLive: true,
    completenessScore: 88,
    coverPhoto: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80'
    ],
    brochurePdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    brochureFileName: 'Ubuntu_Catering_Traditional_Menus_2026.pdf',
    packages: [
      { id: 'p3_1', title: 'Heritage Grand Feast Package (Per Guest)', price: 320, type: 'PER_GUEST', description: 'Spit braai lamb, tripe/mogodu, dumpling, pap, chakalaka & 4 salad varieties' },
      { id: 'p3_2', title: 'Traditional Craft Umqombothi & Beverage Bar Setup', price: 5000, type: 'FIXED', description: 'Full traditional beer stations with earthenware pots & server staff' }
    ]
  },
  {
    id: 'v4',
    businessName: 'Royal Heritage Traditional Attire',
    category: 'Attire',
    areasServed: ['Johannesburg', 'Soweto'],
    celebrationsServed: 'TRADITIONAL',
    priceFrom: 12000,
    rating: 4.7,
    reviewsCount: 15,
    description: 'Bespoke modern Zulu, Xhosa, Sotho and Tswana traditional wedding couture tailored with premium fabrics and beadwork.',
    tier: 'STANDARD',
    isLive: true,
    completenessScore: 82,
    coverPhoto: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80'
    ],
    brochurePdfUrl: '',
    brochureFileName: '',
    packages: [
      { id: 'p4_1', title: 'Bride & Groom Custom Traditional Outfit Set', price: 12000, type: 'FIXED', description: 'Tailored matching traditional outfits with custom bead accessories' },
      { id: 'p4_2', title: 'Bridal Party Outfit Package (5 Bridesmaids)', price: 15000, type: 'FIXED', description: 'Coordinated traditional dresses with headwraps' }
    ]
  },
  {
    id: 'v5',
    businessName: 'Elegance White Couture',
    category: 'Attire',
    areasServed: ['Pretoria', 'Sandton'],
    celebrationsServed: 'WHITE',
    priceFrom: 15000,
    rating: 4.8,
    reviewsCount: 22,
    description: 'Exclusive bridal gown boutique featuring hand-stitched lace, minimalist silhouettes, and custom veil fittings.',
    tier: 'STANDARD',
    isLive: true,
    completenessScore: 85,
    coverPhoto: 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=800&q=80'
    ],
    brochurePdfUrl: '',
    brochureFileName: '',
    packages: [
      { id: 'p5_1', title: 'Custom Couture White Wedding Gown & Veil', price: 15000, type: 'FIXED', description: 'Includes 3 fitting sessions, alteration work & cathedral veil' }
    ]
  }
];

export const INITIAL_BRIDE = {
  id: 'b1',
  name: 'Nomsa Khumalo',
  email: 'nomsa@example.com',
  role: 'BRIDE',
  overallBudget: 600000,
  celebrations: [
    {
      id: 'c1',
      type: 'TRADITIONAL',
      title: 'Traditional Day',
      date: '2026-09-01',
      area: 'Soweto',
      guestCount: 180,
      budget: 220000,
      checklist: [
        { id: 't1', title: 'Confirm traditional lobola agreement details with elders', dueDate: '2026-08-10', done: true },
        { id: 't2', title: 'Book authentic traditional catering & spit braai', dueDate: '2026-08-20', done: false },
        { id: 't3', title: 'Finalise family attire measurements & beadwork order', dueDate: '2026-08-25', done: false },
        { id: 't4', title: 'Arrange traditional tents, decor & seating for home venue', dueDate: '2026-08-28', done: false }
      ],
      budgetLines: [
        { id: 'bl1', category: 'Attire & Beadwork', planned: 45000, actuallySpent: 42000, linkedVendor: 'Royal Heritage Traditional Attire' },
        { id: 'bl2', category: 'Catering & Drinks', planned: 85000, actuallySpent: 0, linkedVendor: 'Ubuntu Culinary Art & Catering' },
        { id: 'bl3', category: 'Tents, Decor & Sound', planned: 55000, actuallySpent: 20000, linkedVendor: '' },
        { id: 'bl4', category: 'Photography & Videography', planned: 25000, actuallySpent: 0, linkedVendor: '' }
      ]
    },
    {
      id: 'c2',
      type: 'WHITE',
      title: 'White Wedding',
      date: '2026-12-05',
      area: 'Sandton',
      guestCount: 120,
      budget: 380000,
      checklist: [
        { id: 'w1', title: 'Book reception venue & secure date deposit', dueDate: '2026-08-01', done: true },
        { id: 'w2', title: 'Reserve photographer & videography team', dueDate: '2026-09-10', done: false },
        { id: 'w3', title: 'First bridal gown fitting & bridesmaid dress selection', dueDate: '2026-09-25', done: false },
        { id: 'w4', title: 'Send formal invitations & open online RSVP', dueDate: '2026-10-10', done: false }
      ],
      budgetLines: [
        { id: 'bl5', category: 'Venue & Food Package', planned: 160000, actuallySpent: 50000, linkedVendor: 'The Greenhouse Sandton' },
        { id: 'bl6', category: 'Bridal Gown & Suits', planned: 60000, actuallySpent: 25000, linkedVendor: 'Elegance White Couture' },
        { id: 'bl7', category: 'Photography & Film', planned: 40000, actuallySpent: 0, linkedVendor: 'Thando M. Photography' },
        { id: 'bl8', category: 'Floral Styling & Lighting', planned: 55000, actuallySpent: 15000, linkedVendor: '' },
        { id: 'bl9', category: 'DJ, MC & Live Entertainment', planned: 35000, actuallySpent: 0, linkedVendor: '' }
      ]
    }
  ]
};

// Additional sample brides/weddings roster for Admin dashboard date tracking
export const SAMPLE_BRIDES_ROSTER = [
  {
    id: 'b1',
    name: 'Nomsa Khumalo',
    email: 'nomsa@example.com',
    weddings: [
      { title: 'Traditional Day', date: '2026-09-01', type: 'TRADITIONAL', area: 'Soweto', guestCount: 180, budget: 220000, isCompleted: false },
      { title: 'White Wedding', date: '2026-12-05', type: 'WHITE', area: 'Sandton', guestCount: 120, budget: 380000, isCompleted: false }
    ]
  },
  {
    id: 'b2',
    name: 'Zanele Dlamini',
    email: 'zanele.d@example.com',
    weddings: [
      { title: 'Zanele & Sipho Lobola Celebration', date: '2026-05-10', type: 'TRADITIONAL', area: 'Pretoria', guestCount: 150, budget: 180000, isCompleted: true },
      { title: 'White Wedding Celebration', date: '2026-06-20', type: 'WHITE', area: 'Johannesburg', guestCount: 100, budget: 310000, isCompleted: true }
    ]
  },
  {
    id: 'b3',
    name: 'Thulisile Mokoena',
    email: 'thuli.m@example.com',
    weddings: [
      { title: 'Traditional Umembeso', date: '2026-07-04', type: 'TRADITIONAL', area: 'Soweto', guestCount: 200, budget: 250000, isCompleted: true },
      { title: 'Garden White Wedding', date: '2026-11-20', type: 'WHITE', area: 'Midrand', guestCount: 130, budget: 350000, isCompleted: false }
    ]
  }
];

export const INITIAL_ENQUIRIES = [
  {
    id: 'e1',
    brideId: 'b1',
    brideName: 'Nomsa Khumalo',
    vendorId: 'v1',
    vendorName: 'The Greenhouse Sandton',
    celebrationId: 'c2',
    celebrationType: 'White Wedding',
    date: '2026-12-05',
    area: 'Sandton',
    guestCount: 120,
    budgetBand: 'R150 000 - R200 000',
    status: 'REPLIED',
    messages: [
      { id: 'm1', sender: 'Nomsa', body: 'Hi! We love The Greenhouse. Are you available for a white wedding reception on 5 December 2026 for 120 guests?', createdAt: '2026-08-01 10:15' },
      { id: 'm2', sender: 'The Greenhouse Sandton', body: 'Hi Nomsa! Yes, 5 December is currently open. Our main botanical glasshouse package fits 120 guests comfortably. Would you like to schedule a site walkthrough next weekend?', createdAt: '2026-08-01 11:30' }
    ]
  }
];

export const INITIAL_SEARCH_MISSES = [
  { id: 'sm1', category: 'Marimba Band', area: 'Pretoria', createdAt: '2026-08-02 14:10', status: 'PENDING', notes: 'High priority for spring weddings' },
  { id: 'sm2', category: 'Traditional Beer Brewing', area: 'Soweto', createdAt: '2026-08-03 09:25', status: 'IN_OUTREACH', notes: 'Contacted 2 local suppliers' }
];

