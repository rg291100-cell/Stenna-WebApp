
import { Wallpaper, Collection, JournalEntry, ColorOption } from './types';

const MOCK_COLORS: ColorOption[] = [
  { name: 'Ivory', hex: '#F5F5F0', image: 'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?auto=format&fit=crop&q=80&w=1200' },
  { name: 'Stone', hex: '#A8A899', image: 'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?auto=format&fit=crop&q=80&w=1200' },
  { name: 'Charcoal', hex: '#363636', image: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&q=80&w=1200' },
  { name: 'Clay', hex: '#B59F8B', image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200' },
  { name: 'Sage', hex: '#879184', image: 'https://images.unsplash.com/photo-1615529328331-f8917597711f?auto=format&fit=crop&q=80&w=1200' }
];

export const WALLPAPERS: Wallpaper[] = [
  // MODERN SELECTION
  {
    id: 'm1',
    name: 'Statuary Marble',
    collection: 'Stone & Earth',
    price: '$180 / Roll',
    description: 'Bespoke marble patterns inspired by the Carrara quarries.',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200',
    roomPreview: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200',
    texture: 'https://images.unsplash.com/photo-1533154683836-84ea7a0bc310?auto=format&fit=crop&q=80&w=800',
    category: 'Modern',
    gallery: [
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1618221381711-42ca8ab6e908?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1533154683836-84ea7a0bc310?auto=format&fit=crop&q=80&w=1200'
    ],
    colors: [MOCK_COLORS[0], MOCK_COLORS[1], MOCK_COLORS[2], MOCK_COLORS[3]]
  },
  {
    id: 'm2',
    name: 'Linear Shadow',
    collection: 'Modern Minimal',
    price: '$130 / Roll',
    description: 'Architectural lines creating subtle depth through shadow play.',
    image: 'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?auto=format&fit=crop&q=80&w=1200',
    roomPreview: 'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?auto=format&fit=crop&q=80&w=1200',
    texture: 'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?auto=format&fit=crop&q=80&w=800',
    category: 'Modern',
    gallery: ['https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?auto=format&fit=crop&q=80&w=1200'],
    colors: [MOCK_COLORS[1], MOCK_COLORS[2], MOCK_COLORS[4]]
  },
  {
    id: 'm3',
    name: 'Concrete Study',
    collection: 'Modern Minimal',
    price: '$110 / Roll',
    description: 'Industrial elegance with raw mineral texture.',
    image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=1200',
    roomPreview: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=1200',
    texture: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=800',
    category: 'Modern',
    gallery: ['https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=1200'],
    colors: [MOCK_COLORS[1], MOCK_COLORS[2], MOCK_COLORS[3]]
  },
  {
    id: 'm4',
    name: 'Obsidian Matte',
    collection: 'Modern Minimal',
    price: '$150 / Roll',
    description: 'Deep charcoal with architectural presence.',
    image: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&q=80&w=1200',
    roomPreview: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&q=80&w=1200',
    texture: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&q=80&w=800',
    category: 'Modern',
    gallery: ['https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&q=80&w=1200']
  },
  {
    id: 'm5',
    name: 'Ivory Gradient',
    collection: 'Modern Minimal',
    price: '$115 / Roll',
    description: 'Soft transitions from bone to ivory.',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=1200',
    roomPreview: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=1200',
    texture: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800',
    category: 'Modern',
    gallery: ['https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=1200']
  },
  {
    id: 'm6',
    name: 'Brutalist Block',
    collection: 'Modern Minimal',
    price: '$140 / Roll',
    description: 'Geometric intersections inspired by modernist architecture.',
    image: 'https://images.unsplash.com/photo-1533154683836-84ea7a0bc310?auto=format&fit=crop&q=80&w=1200',
    roomPreview: 'https://images.unsplash.com/photo-1533154683836-84ea7a0bc310?auto=format&fit=crop&q=80&w=1200',
    texture: 'https://images.unsplash.com/photo-1533154683836-84ea7a0bc310?auto=format&fit=crop&q=80&w=800',
    category: 'Modern',
    gallery: ['https://images.unsplash.com/photo-1533154683836-84ea7a0bc310?auto=format&fit=crop&q=80&w=1200']
  },
  {
    id: 'm7',
    name: 'Slate Monolith',
    collection: 'Modern Minimal',
    price: '$165 / Roll',
    description: 'Continuous mineral surface with a refined dark finish.',
    image: 'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&q=80&w=1200',
    roomPreview: 'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&q=80&w=1200',
    texture: 'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&q=80&w=800',
    category: 'Modern',
    gallery: ['https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&q=80&w=1200']
  },
  {
    id: 'm8',
    name: 'Tectonic Rift',
    collection: 'Stone & Earth',
    price: '$190 / Roll',
    description: 'Bold geological divisions rendered in soft grey.',
    image: 'https://images.unsplash.com/photo-1615529328331-f8917597711f?auto=format&fit=crop&q=80&w=1200',
    roomPreview: 'https://images.unsplash.com/photo-1615529328331-f8917597711f?auto=format&fit=crop&q=80&w=1200',
    texture: 'https://images.unsplash.com/photo-1615529328331-f8917597711f?auto=format&fit=crop&q=80&w=800',
    category: 'Modern',
    gallery: ['https://images.unsplash.com/photo-1615529328331-f8917597711f?auto=format&fit=crop&q=80&w=1200']
  },

  // CLASSIC SELECTION
  {
    id: 'c1',
    name: 'Antique Damask',
    collection: 'Signature Collection',
    price: '$145 / Roll',
    description: 'A heritage pattern reimagined with contemporary restraint.',
    image: 'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?auto=format&fit=crop&q=80&w=1200',
    roomPreview: 'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?auto=format&fit=crop&q=80&w=1200',
    texture: 'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?auto=format&fit=crop&q=80&w=800',
    category: 'Classic',
    gallery: ['https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?auto=format&fit=crop&q=80&w=1200'],
    colors: [MOCK_COLORS[0], MOCK_COLORS[4]]
  },
  {
    id: 'c2',
    name: 'Ivory Scroll',
    collection: 'Signature Collection',
    price: '$135 / Roll',
    description: 'Delicate ornamental rhythms on an ivory ground.',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200',
    roomPreview: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200',
    texture: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=800',
    category: 'Classic',
    gallery: ['https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200']
  },
  {
    id: 'c3',
    name: 'Noble Toile',
    collection: 'Signature Collection',
    price: '$160 / Roll',
    description: 'Traditional influences reinterpreted in a modern way.',
    image: 'https://images.unsplash.com/photo-1615873968403-89e068629275?auto=format&fit=crop&q=80&w=1200',
    roomPreview: 'https://images.unsplash.com/photo-1615873968403-89e068629275?auto=format&fit=crop&q=80&w=1200',
    texture: 'https://images.unsplash.com/photo-1615873968403-89e068629275?auto=format&fit=crop&q=80&w=800',
    category: 'Classic',
    gallery: ['https://images.unsplash.com/photo-1615873968403-89e068629275?auto=format&fit=crop&q=80&w=1200']
  },
  {
    id: 'c4',
    name: 'Regency Stripe',
    collection: 'Signature Collection',
    price: '$125 / Roll',
    description: 'Timeless vertical symmetry for refined spatial volume.',
    image: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&q=80&w=1200',
    roomPreview: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&q=80&w=1200',
    texture: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&q=80&w=800',
    category: 'Classic',
    gallery: ['https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&q=80&w=1200']
  },
  {
    id: 'c5',
    name: 'Golden Ratio',
    collection: 'Signature Collection',
    price: '$175 / Roll',
    description: 'Restrained geometry with a subtle metallic sheen.',
    image: 'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&q=80&w=1200',
    roomPreview: 'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&q=80&w=1200',
    texture: 'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&q=80&w=800',
    category: 'Classic',
    gallery: ['https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&q=80&w=1200']
  },
  {
    id: 'c6',
    name: 'Sovereign Linen',
    collection: 'Signature Collection',
    price: '$130 / Roll',
    description: 'Classic textile feel with high-end editorial finish.',
    image: 'https://images.unsplash.com/photo-1617104424032-b9bd6972d0e4?auto=format&fit=crop&q=80&w=1200',
    roomPreview: 'https://images.unsplash.com/photo-1617104424032-b9bd6972d0e4?auto=format&fit=crop&q=80&w=1200',
    texture: 'https://images.unsplash.com/photo-1617104424032-b9bd6972d0e4?auto=format&fit=crop&q=80&w=800',
    category: 'Classic',
    gallery: ['https://images.unsplash.com/photo-1617104424032-b9bd6972d0e4?auto=format&fit=crop&q=80&w=1200']
  },
  {
    id: 'c7',
    name: 'Palladian White',
    collection: 'Signature Collection',
    price: '$140 / Roll',
    description: 'Inspired by classical architecture and pure forms.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
    roomPreview: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
    texture: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
    category: 'Classic',
    gallery: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200']
  },
  {
    id: 'c8',
    name: 'Tudor Mist',
    collection: 'Signature Collection',
    price: '$155 / Roll',
    description: 'Heritage atmosphere rendered in misty, tonal layers.',
    image: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&q=80&w=1200',
    roomPreview: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&q=80&w=1200',
    texture: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&q=80&w=800',
    category: 'Classic',
    gallery: ['https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&q=80&w=1200']
  },

  // TEXTURED SELECTION
  {
    id: 't1',
    name: 'Silk Linen - Pearl',
    collection: 'Textured Neutrals',
    price: '$120 / Roll',
    description: 'A delicate, hand-woven silk texture with pearlescent sheen.',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=1200',
    roomPreview: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=1200',
    texture: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=800',
    category: 'Textured',
    gallery: ['https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=1200'],
    colors: [MOCK_COLORS[0], MOCK_COLORS[1], MOCK_COLORS[3]]
  },
  {
    id: 't2',
    name: 'Limewash Sand',
    collection: 'Modern Minimal',
    price: '$125 / Roll',
    description: 'A hand-applied plaster look with organic tonal variations.',
    image: 'https://images.unsplash.com/photo-1536566482680-fca31930a0bd?auto=format&fit=crop&q=80&w=1200',
    roomPreview: 'https://images.unsplash.com/photo-1536566482680-fca31930a0bd?auto=format&fit=crop&q=80&w=1200',
    texture: 'https://images.unsplash.com/photo-1536566482680-fca31930a0bd?auto=format&fit=crop&q=80&w=800',
    category: 'Textured',
    gallery: ['https://images.unsplash.com/photo-1536566482680-fca31930a0bd?auto=format&fit=crop&q=80&w=1200'],
    colors: [MOCK_COLORS[1], MOCK_COLORS[3]]
  },
  {
    id: 't3',
    name: 'Raw Muslin',
    collection: 'Textured Neutrals',
    price: '$110 / Roll',
    description: 'Honest material depth with a tactile, fabric-inspired finish.',
    image: 'https://images.unsplash.com/photo-1554034483-04fda0d3507b?auto=format&fit=crop&q=80&w=1200',
    roomPreview: 'https://images.unsplash.com/photo-1554034483-04fda0d3507b?auto=format&fit=crop&q=80&w=1200',
    texture: 'https://images.unsplash.com/photo-1554034483-04fda0d3507b?auto=format&fit=crop&q=80&w=800',
    category: 'Textured',
    gallery: ['https://images.unsplash.com/photo-1554034483-04fda0d3507b?auto=format&fit=crop&q=80&w=1200']
  },
  {
    id: 't4',
    name: 'Travertine Clay',
    collection: 'Textured Neutrals',
    price: '$150 / Roll',
    description: 'Inspired by the porous elegance of travertine stone.',
    image: 'https://images.unsplash.com/photo-1615529328331-f8917597711f?auto=format&fit=crop&q=80&w=1200',
    roomPreview: 'https://images.unsplash.com/photo-1615529328331-f8917597711f?auto=format&fit=crop&q=80&w=1200',
    texture: 'https://images.unsplash.com/photo-1615529328331-f8917597711f?auto=format&fit=crop&q=80&w=800',
    category: 'Textured',
    gallery: ['https://images.unsplash.com/photo-1615529328331-f8917597711f?auto=format&fit=crop&q=80&w=1200']
  },
  {
    id: 't5',
    name: 'Slate Fabric',
    collection: 'Textured Neutrals',
    price: '$140 / Roll',
    description: 'A fusion of mineral color and textile softness.',
    image: 'https://images.unsplash.com/photo-1505691938895-1758d7eaa511?auto=format&fit=crop&q=80&w=1200',
    roomPreview: 'https://images.unsplash.com/photo-1505691938895-1758d7eaa511?auto=format&fit=crop&q=80&w=1200',
    texture: 'https://images.unsplash.com/photo-1505691938895-1758d7eaa511?auto=format&fit=crop&q=80&w=800',
    category: 'Textured',
    gallery: ['https://images.unsplash.com/photo-1505691938895-1758d7eaa511?auto=format&fit=crop&q=80&w=1200']
  },
  {
    id: 't6',
    name: 'Mineral Wash',
    collection: 'Textured Neutrals',
    price: '$135 / Roll',
    description: 'Organic tonal shifts inspired by hand-painted plaster.',
    image: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&q=80&w=1200',
    roomPreview: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&q=80&w=1200',
    texture: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&q=80&w=800',
    category: 'Textured',
    gallery: ['https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&q=80&w=1200']
  },
  {
    id: 't7',
    name: 'Burlap Sand',
    collection: 'Textured Neutrals',
    price: '$120 / Roll',
    description: 'Woven architectural depth with a matte, grounding feel.',
    image: 'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?auto=format&fit=crop&q=80&w=1200',
    roomPreview: 'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?auto=format&fit=crop&q=80&w=1200',
    texture: 'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?auto=format&fit=crop&q=80&w=800',
    category: 'Textured',
    gallery: ['https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?auto=format&fit=crop&q=80&w=1200']
  },
  {
    id: 't8',
    name: 'Woven Bone',
    collection: 'Textured Neutrals',
    price: '$115 / Roll',
    description: 'A study in tactile minimalism and soft lighting.',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=1200',
    roomPreview: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=1200',
    texture: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800',
    category: 'Textured',
    gallery: ['https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=1200']
  },

  // NATURE SELECTION
  {
    id: 'n1',
    name: 'Forest Mist',
    collection: 'Botanical Luxury',
    price: '$145 / Roll',
    description: 'A moody, atmospheric woodland scene in watercolor tones.',
    image: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&q=80&w=1200',
    roomPreview: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&q=80&w=1200',
    texture: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=800',
    category: 'Nature',
    gallery: ['https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&q=80&w=1200'],
    colors: [MOCK_COLORS[4], MOCK_COLORS[0]]
  },
  {
    id: 'n2',
    name: 'Abstract Sage',
    collection: 'Botanical Luxury',
    price: '$130 / Roll',
    description: 'Poetic leaf silhouettes rendering a calm, airy atmosphere.',
    image: 'https://images.unsplash.com/photo-1615529328331-f8917597711f?auto=format&fit=crop&q=80&w=1200',
    roomPreview: 'https://images.unsplash.com/photo-1615529328331-f8917597711f?auto=format&fit=crop&q=80&w=1200',
    texture: 'https://images.unsplash.com/photo-1615529328331-f8917597711f?auto=format&fit=crop&q=80&w=800',
    category: 'Nature',
    gallery: ['https://images.unsplash.com/photo-1615529328331-f8917597711f?auto=format&fit=crop&q=80&w=1200'],
    colors: [MOCK_COLORS[4], MOCK_COLORS[1]]
  },
  {
    id: 'n3',
    name: 'Ethereal Cloud',
    collection: 'Botanical Luxury',
    price: '$160 / Roll',
    description: 'Nature suggested through hand-painted watercolor softness.',
    image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=1200',
    roomPreview: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=1200',
    texture: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=800',
    category: 'Nature',
    gallery: ['https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=1200']
  },
  {
    id: 'n4',
    name: 'Misty Woodland',
    collection: 'Botanical Luxury',
    price: '$150 / Roll',
    description: 'A serene interior atmosphere inspired by winter light.',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1200',
    roomPreview: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1200',
    texture: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=800',
    category: 'Nature',
    gallery: ['https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1200']
  },
  {
    id: 'n5',
    name: 'Botanical Trace',
    collection: 'Botanical Luxury',
    price: '$140 / Roll',
    description: 'Delicate organic movement captured in hand-drawn lines.',
    image: 'https://images.unsplash.com/photo-1617806118233-f8e187c44b5c?auto=format&fit=crop&q=80&w=1200',
    roomPreview: 'https://images.unsplash.com/photo-1617806118233-f8e187c44b5c?auto=format&fit=crop&q=80&w=1200',
    texture: 'https://images.unsplash.com/photo-1617806118233-f8e187c44b5c?auto=format&fit=crop&q=80&w=800',
    category: 'Nature',
    gallery: ['https://images.unsplash.com/photo-1617806118233-f8e187c44b5c?auto=format&fit=crop&q=80&w=1200']
  },
  {
    id: 'n6',
    name: 'Shadow Palm',
    collection: 'Botanical Luxury',
    price: '$135 / Roll',
    description: 'Atmospheric nature shadows for a serene residential mood.',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1200',
    roomPreview: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1200',
    texture: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800',
    category: 'Nature',
    gallery: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1200']
  },
  {
    id: 'n7',
    name: 'Wilderness Echo',
    collection: 'Botanical Luxury',
    price: '$120 / Roll',
    description: 'Subtle landscapes rendered with artisanal softness.',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200',
    roomPreview: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200',
    texture: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800',
    category: 'Nature',
    gallery: ['https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200']
  },
  {
    id: 'n8',
    name: 'Morning Dew',
    collection: 'Botanical Luxury',
    price: '$125 / Roll',
    description: 'Poetic, airy compositions that celebrate natural light.',
    image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&q=80&w=1200',
    roomPreview: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&q=80&w=1200',
    texture: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&q=80&w=800',
    category: 'Nature',
    gallery: ['https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&q=80&w=1200']
  }
];

export const COLLECTIONS: Collection[] = [
  {
    id: 'signature',
    title: 'Signature Collection',
    description: 'The foundation of Stenna aesthetics. Timeless patterns reimagined for the contemporary eye.',
    image: 'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?auto=format&fit=crop&q=80&w=1600'
  },
  {
    id: 'marble-stone',
    title: 'Marble & Stone',
    description: 'Cold surfaces, warm atmosphere. The geological beauty of rare minerals, printed with precision.',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1600'
  },
  {
    id: 'textured-neutrals',
    title: 'Textured Neutrals',
    description: 'A study in tactile minimalism. Wallpapers that invite touch and define quiet luxury.',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=1600'
  },
  {
    id: 'modern-minimal',
    title: 'Modern Minimal',
    description: 'Restraint as an art form. Pure geometric compositions and monochromatic explorations.',
    image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=1600'
  },
  {
    id: 'luxury-florals',
    title: 'Luxury Florals',
    description: 'A botanical revival. Atmospheric florals rendered with the depth of an old master painting.',
    image: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&q=80&w=1600'
  }
];

export const JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: '1',
    title: 'The Art of Layering Textures',
    excerpt: 'How to combine silk and stone wallpapers for a multidimensional living space.',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800',
    date: 'OCT 12, 2024'
  },
  {
    id: '2',
    title: 'Modern Minimalist Interiors',
    excerpt: 'Defining luxury through restraint and high-quality materials.',
    image: 'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&q=80&w=800',
    date: 'SEP 28, 2024'
  }
];
