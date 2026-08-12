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
    ]
  }
];

export const INITIAL_BRIDE = {
  id: 'b1',
  name: '',
  email: '',
  role: 'BRIDE',
  overallBudget: 600000,
  celebrations: [
    {
      id: 'c1',
      type: 'TRADITIONAL',
      title: 'Traditional Day',
      date: '2026-11-14',
      area: 'Soweto',
      guestCount: 180,
      budget: 220000,
      checklist: [
        { id: 't1', title: 'Confirm traditional lobola agreement details with elders', dueDate: '2026-09-01', done: true },
        { id: 't2', title: 'Book authentic traditional catering & spit braai', dueDate: '2026-09-15', done: false },
        { id: 't3', title: 'Finalise family attire measurements & beadwork order', dueDate: '2026-10-01', done: false },
        { id: 't4', title: 'Arrange traditional tents, decor & seating for home venue', dueDate: '2026-10-15', done: false }
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
        { id: 'w1', title: 'Book reception venue & secure date deposit', dueDate: '2026-08-30', done: true },
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
  { id: 'sm1', category: 'Marimba Band', area: 'Pretoria', createdAt: '2026-08-02 14:10' },
  { id: 'sm2', category: 'Traditional Beer Brewing', area: 'Soweto', createdAt: '2026-08-03 09:25' }
];
