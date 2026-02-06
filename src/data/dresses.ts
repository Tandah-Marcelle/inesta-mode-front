

export const dresses: Dress[] = [
  {
    id: 'ev001',
    name: 'Rose Noir',
    category: 'rose-noir',
    price: 299.99,
    images: [],
    description: 'Une somptueuse robe longue noire ornée de sequins étincelants, de perles argentées et de fleurs brodées à la main. Sa silhouette sirène épouse gracieusement les courbes du corps, tandis que les manches transparentes ajoutent une touche d’élégance raffinée. Idéale pour les galas prestigieux, les événements de tapis rouge et les soirées de haute couture.',
    details: [
    'Design longueur au sol',

'Sequins noirs cousus à la main',

'Fleurs perlées en relief sur le buste et les épaules',

'Manches longues en tulle transparent orné de perles',

'Fermeture invisible au dos',

'Bas de robe orné de fleurs en tissu en relief',

'Silhouette sirène avec traîne légère',

'Bonnets intégrés pour un bon maintien',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Midnight Blue', 'Black', 'Burgundy'],
    featured: true,
    new: false,
    likes: 245
  },
  {
    id: 'ev002',
    name: 'Homme Elegant',
    category: 'homme',
    price: 349.99,
    images: [],
  description: 'Un ensemble traditionnel moderne d’un noir profond, rehaussé de détails dorés et de finitions métalliques. Cette tenue allie élégance contemporaine et raffinement culturel, idéale pour des cérémonies, des mariages ou des soirées habillées. La coupe ajustée met en valeur la silhouette masculine tout en garantissant confort et prestance.',
details: [
  'Tissu noir de qualité supérieure',
  'Boutons œillets dorés sur le plastron et les manches',
  'Ornements dorés en pointe sur les extrémités',
  'Plastron décoratif cousu à l’avant',
  'Coupe droite et confortable pour une élégance moderne'
],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Gold', 'Silver', 'Rose Gold'],
    featured: true,
    new: false,
    likes: 189
  },

  {
    id: 'ev003',
    name: 'Homme Confiant',
    category: 'homme',
    price: 349.99,
    images: [],
  description: 'Un ensemble de cérémonie majestueux et coordonné, composé de tenues vert émeraude rehaussées de broderies dorées raffinées. Ce look, à la fois royal et contemporain, incarne l’élégance masculine pour les grandes occasions comme les mariages traditionnels. Les coupes ajustées et les accessoires harmonisés, tels que les cannes dorées et les coiffes, renforcent l’allure noble et sophistiquée du groupe.',
details: [
  'Costumes vert émeraude à coupe droite',
  'Épaulières brodées de motifs dorés',
  'Pantalons assortis parfaitement taillés',
  'Coiffes traditionnelles aux motifs dorés',
  'Cannes dorées en accessoire élégant',
  'Chaussures noires classiques pour une finition soignée'
],

    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Gold', 'Silver', 'Rose Gold'],
    featured: true,
    new: false,
    likes: 189
  },

  {
    id: 'dn001',
    name: 'Dame Nature',
    category: 'dame-nature',
    price: 179.99,
    images: [],
   description: 'Une robe féerique et artistique ornée de fleurs multicolores, de franges et de détails inspirés de la nature. Parfaite pour des événements à thème, des concours de costumes ou des séances photo créatives.',
details: [
'Robe courte, au-dessus du genou',
'Corsage ajusté décoré de fleurs en tissu et feuillage',
'Manches longues en tulle transparent',
'Franges beiges ornées de fleurs tombant sur le bas de la robe',
'Grandes ailes décoratives vert foncé avec bordures dorées',
'Accessoires floraux dans les cheveux',
'Baguette magique étoilée avec une rose rouge'
],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Ruby Red', 'Emerald Green', 'Black'],
    featured: false,
    new: true,
    likes: 127
  },
  {
    id: 'brd008',
    name: 'Robe Orange Claire',
    category: 'enfants',
    price: 899.99,
    images: [],
    description: 'Une somptueuse robe de cérémonie pour enfant en tulle orange vif, ornée d’un corsage richement décoré de fleurs et de perles. Idéale pour les fêtes, mariages ou occasions spéciales.',
details: [
'Longueur au sol',
'Jupe volumineuse à volants en tulle',
'Corsage ajusté décoré de fleurs en relief et de perles',
'Manches courtes ornées de chaînes de perles',
'Fermeture discrète au dos',
'Accessoire assorti : petit sac à main doré'
]

,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'Custom'],
    colors: ['Ivory', 'White', 'Champagne'],
    featured: true,
    new: false,
    likes: 423
  },

  {
    id: 'brd007',
    name: 'Marronne Claire',
    category: 'enfants',
    price: 899.99,
    images: [],
   description: 'Une somptueuse robe de bal couleur champagne, à l’allure princière, avec un bustier orné de dentelle et un spectaculaire col à volants. Parfaite pour les cérémonies, galas ou occasions royales.',
details: [
'Longueur au sol',
'Jupe volumineuse en tulle scintillant',
'Bustier ajusté avec motifs de dentelle',
'Col large à volants spectaculaires',
'Épaules dégagées',
'Fermeture discrète au dos',
'Accessoire : diadème élégant'
],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'Custom'],
    colors: ['Ivory', 'White', 'Champagne'],
    featured: true,
    new: false,
    likes: 423
  },

  {
    id: 'brd006',
    name: 'Robe Bleu Claire',
    category: 'enfants',
    price: 899.99,
    images: [],
  description: "Une somptueuse robe de princesse bleu ciel, sublimée par des broderies florales bleu royal et un corsage à décolleté en illusion. Cette tenue féerique évoque l'élégance et la magie des contes de fées, parfaite pour un anniversaire, une cérémonie ou une séance photo mémorable. Le volume spectaculaire de la jupe en tulle apporte une touche royale et majestueuse à l'ensemble.",
details: [
  "Corsage en dentelle brodée florale",
  "Décolleté en illusion avec transparence subtile",
  "Jupe volumineuse en tulle multicouche",
  "Couronne scintillante assortie",
  "Bijoux délicats pour compléter le look"
],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'Custom'],
    colors: ['Ivory', 'White', 'Champagne'],
    featured: true,
    new: false,
    likes: 423
  },

  {
    id: 'brd005',
    name: 'Robe Blanche',
    category: 'enfants',
    price: 899.99,
    images: [],
    description: "Élégante robe de princesse blanche à corsage en dentelle raffinée, dotée d’un col illusion transparent et d'une jupe ample en tulle. Parfaite pour les grandes occasions comme les anniversaires ou les défilés, cette tenue incarne grâce, pureté et raffinement. La finition du bustier et les accessoires scintillants ajoutent une touche féerique à l’ensemble.",
details: [
  "Corsage brodé en dentelle blanche",
  "Décolleté illusion transparent",
  "Jupe large et fluide en tulle doux",
  "Accessoires royaux : couronne et collier rose",
  "Ballon chiffre doré pour une célébration joyeuse"
]
,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'Custom'],
    colors: ['Ivory', 'White', 'Champagne'],
    featured: true,
    new: false,
    likes: 423
  },

  {
    id: 'brd004',
    name: 'Robe Blanc Rose',
    category: 'enfants',
    price: 899.99,
    images: [],
   description: "Robe féerique à motif licorne pour petite fille, parfaite pour les fêtes d'anniversaire, les séances photo et les jeux de rôle magiques. Elle se distingue par ses ailes de papillon roses, ses broderies licorne multicolores et ses fleurs en relief, offrant une allure de petite fée tout droit sortie d’un conte.",
details: [
  "Robe blanche ornée de licornes brodées",
  "Fleurs roses en 3D sur le buste",
  "Ailes papillon roses à pois fleuris",
  "Bandeau avec papillons roses assortis",
  "Tissu scintillant pour un effet magique"
]
,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'Custom'],
    colors: ['Ivory', 'White', 'Champagne'],
    featured: true,
    new: false,
    likes: 423
  },

  {
    id: 'brd003',
    name: 'Robe Rose',
    category: 'enfants',
    price: 899.99,
    images: [],
    description: 'A breathtaking white wedding gown with delicate lace appliqués and a flowing train. The perfect dress for your special day.',
    details: [
      'Cathedral-length train',
      'Hand-applied lace details',
      'Illusion neckline',
      'Button-up back',
      'Optional detachable sleeves'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'Custom'],
    colors: ['Ivory', 'White', 'Champagne'],
    featured: true,
    new: false,
    likes: 423
  },

  {
    id: 'brd002',
    name: 'Robe Orange Claire',
    category: 'enfants',
    price: 899.99,
    images: [],
    description: 'A breathtaking white wedding gown with delicate lace appliqués and a flowing train. The perfect dress for your special day.',
    details: [
      'Cathedral-length train',
      'Hand-applied lace details',
      'Illusion neckline',
      'Button-up back',
      'Optional detachable sleeves'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'Custom'],
    colors: ['Ivory', 'White', 'Champagne'],
    featured: true,
    new: false,
    likes: 423
  },

  {
    id: 'autres1',
    name: 'Autres',
    category: 'enfants',
    price: 899.99,
    images: [],
    description: 'A breathtaking white wedding gown with delicate lace appliqués and a flowing train. The perfect dress for your special day.',
    details: [
      'Cathedral-length train',
      'Hand-applied lace details',
      'Illusion neckline',
      'Button-up back',
      'Optional detachable sleeves'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'Custom'],
    colors: ['Ivory', 'White', 'Champagne'],
    featured: true,
    new: false,
    likes: 423
  },

  {
    id: 'g1',
    name: 'Deux Pieces',
    category: 'enfants',
    price: 899.99,
    images: [],
    description: 'A breathtaking white wedding gown with delicate lace appliqués and a flowing train. The perfect dress for your special day.',
    details: [
      'Cathedral-length train',
      'Hand-applied lace details',
      'Illusion neckline',
      'Button-up back',
      'Optional detachable sleeves'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'Custom'],
    colors: ['Ivory', 'White', 'Champagne'],
    featured: true,
    new: false,
    likes: 423
  },

  {
    id: 'sum001',
    name: 'Mariage',
    category: 'marrige',
    price: 129.99,
    images: [],
    description: 'A light, airy summer dress perfect for beach days and warm evenings. Made from 100% cotton for maximum comfort in hot weather.',
    details: [
      'Midi length',
      '100% cotton fabric',
      'Adjustable straps',
      'Side pockets',
      'Elastic back panel for comfort'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Sky Blue', 'Coral', 'White', 'Yellow'],
    featured: false,
    new: true,
    likes: 156
  },

  {
    id: 'sum002',
    name: 'Mariage',
    category: 'marrige',
    price: 129.99,
    images: [],
    description: 'A light, airy summer dress perfect for beach days and warm evenings. Made from 100% cotton for maximum comfort in hot weather.',
    details: [
      'Midi length',
      '100% cotton fabric',
      'Adjustable straps',
      'Side pockets',
      'Elastic back panel for comfort'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Sky Blue', 'Coral', 'White', 'Yellow'],
    featured: false,
    new: true,
    likes: 156
  },

  {
    id: 'sum003',
    name: 'Mariage',
    category: 'marrige',
    price: 129.99,
    images: [],
    description: 'A light, airy summer dress perfect for beach days and warm evenings. Made from 100% cotton for maximum comfort in hot weather.',
    details: [
      'Midi length',
      '100% cotton fabric',
      'Adjustable straps',
      'Side pockets',
      'Elastic back panel for comfort'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Sky Blue', 'Coral', 'White', 'Yellow'],
    featured: false,
    new: true,
    likes: 156
  },

  {
    id: 'sum004',
    name: 'Mariage',
    category: 'marrige',
    price: 129.99,
    images: [],
    description: 'A light, airy summer dress perfect for beach days and warm evenings. Made from 100% cotton for maximum comfort in hot weather.',
    details: [
      'Midi length',
      '100% cotton fabric',
      'Adjustable straps',
      'Side pockets',
      'Elastic back panel for comfort'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Sky Blue', 'Coral', 'White', 'Yellow'],
    featured: false,
    new: true,
    likes: 156
  },

  {
    id: 'sum005',
    name: 'Mariage',
    category: 'marrige',
    price: 129.99,
    images: [],
    description: 'A light, airy summer dress perfect for beach days and warm evenings. Made from 100% cotton for maximum comfort in hot weather.',
    details: [
      'Midi length',
      '100% cotton fabric',
      'Adjustable straps',
      'Side pockets',
      'Elastic back panel for comfort'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Sky Blue', 'Coral', 'White', 'Yellow'],
    featured: false,
    new: true,
    likes: 156
  },

  {
    id: 'sum006',
    name: 'Mariage',
    category: 'marrige',
    price: 129.99,
    images: [],
    description: 'A light, airy summer dress perfect for beach days and warm evenings. Made from 100% cotton for maximum comfort in hot weather.',
    details: [
      'Midi length',
      '100% cotton fabric',
      'Adjustable straps',
      'Side pockets',
      'Elastic back panel for comfort'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Sky Blue', 'Coral', 'White', 'Yellow'],
    featured: false,
    new: true,
    likes: 156
  },

  {
    id: 'sum007',
    name: 'marrige',
    category: 'marrige',
    price: 129.99,
    images: [],
    description: 'A light, airy summer dress perfect for beach days and warm evenings. Made from 100% cotton for maximum comfort in hot weather.',
    details: [
      'Midi length',
      '100% cotton fabric',
      'Adjustable straps',
      'Side pockets',
      'Elastic back panel for comfort'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Sky Blue', 'Coral', 'White', 'Yellow'],
    featured: false,
    new: true,
    likes: 156
  },

  {
    id: 'sum008',
    name: 'Mariage',
    category: 'marrige',
    price: 129.99,

    images: [],
    description: 'A light, airy summer dress perfect for beach days and warm evenings. Made from 100% cotton for maximum comfort in hot weather.',
    details: [
      'Midi length',
      '100% cotton fabric',
      'Adjustable straps',
      'Side pockets',
      'Elastic back panel for comfort'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Sky Blue', 'Coral', 'White', 'Yellow'],
    featured: false,
    new: true,
    likes: 156
  },

  {
    id: 'sum0010',
    name: 'Marriage',
    category: 'marrige',
    price: 129.99,

    images: [],
    description: 'A light, airy summer dress perfect for beach days and warm evenings. Made from 100% cotton for maximum comfort in hot weather.',
    details: [
      'Midi length',
      '100% cotton fabric',
      'Adjustable straps',
      'Side pockets',
      'Elastic back panel for comfort'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Sky Blue', 'Coral', 'White', 'Yellow'],
    featured: false,
    new: true,
    likes: 156
  },

  {
    id: 'sum0044',
    name: 'Autres',
    category: 'marrige',
    price: 129.99,
    images: [],
    description: 'A light, airy summer dress perfect for beach days and warm evenings. Made from 100% cotton for maximum comfort in hot weather.',
    details: [
      'Midi length',
      '100% cotton fabric',
      'Adjustable straps',
      'Side pockets',
      'Elastic back panel for comfort'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Sky Blue', 'Coral', 'White', 'Yellow'],
    featured: false,
    new: true,
    likes: 156
  },

  {
    id: 'sum0011',
    name: 'Sac Perle',
    category: 'sac-perle',
    price: 129.99,

    images: [],
    description: 'A light, airy summer dress perfect for beach days and warm evenings. Made from 100% cotton for maximum comfort in hot weather.',
    details: [
      'Midi length',
      '100% cotton fabric',
      'Adjustable straps',
      'Side pockets',
      'Elastic back panel for comfort'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Sky Blue', 'Coral', 'White', 'Yellow'],
    featured: false,
    new: true,
    likes: 156
  },

  {
    id: 'sum0017',
    name: 'Belle Fleure',
    category: 'belle-fleur',
    price: 129.99,

    images: [],
    description: 'A light, airy summer dress perfect for beach days and warm evenings. Made from 100% cotton for maximum comfort in hot weather.',
    details: [
      'Midi length',
      '100% cotton fabric',
      'Adjustable straps',
      'Side pockets',
      'Elastic back panel for comfort'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Sky Blue', 'Coral', 'White', 'Yellow'],
    featured: false,
    new: true,
    likes: 156
  },

  {
    id: 'sum00177',
    name: 'Country Flag',
    category: 'country-flag',
    price: 129.99,

    images: [],
    description: 'A light, airy summer dress perfect for beach days and warm evenings. Made from 100% cotton for maximum comfort in hot weather.',
    details: [
      'Midi length',
      '100% cotton fabric',
      'Adjustable straps',
      'Side pockets',
      'Elastic back panel for comfort'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Sky Blue', 'Coral', 'White', 'Yellow'],
    featured: false,
    new: true,
    likes: 156
  },

  {
    id: 'tardi001',
    name: 'Habit Traditionnel',
    category: 'mariage-coutumier',
    price: 129.99,

    images: [],
    description: 'A light, airy summer dress perfect for beach days and warm evenings. Made from 100% cotton for maximum comfort in hot weather.',
    details: [
      'Midi length',
      '100% cotton fabric',
      'Adjustable straps',
      'Side pockets',
      'Elastic back panel for comfort'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Sky Blue', 'Coral', 'White', 'Yellow'],
    featured: false,
    new: true,
    likes: 156
  },

  {
    id: 'tardi002',
    name: 'Habit Traditionnel ',
    category: 'mariage-coutumier',
    price: 129.99,

    images: [],
    description: 'A light, airy summer dress perfect for beach days and warm evenings. Made from 100% cotton for maximum comfort in hot weather.',
    details: [
      'Midi length',
      '100% cotton fabric',
      'Adjustable straps',
      'Side pockets',
      'Elastic back panel for comfort'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Sky Blue', 'Coral', 'White', 'Yellow'],
    featured: false,
    new: true,
    likes: 156
  },

    {
    id: 'tardi002',
    name: 'Mariage Coutumier',
    category: 'mariage-coutumier',
    price: 129.99,

    images: [],
    description: 'A light, airy summer dress perfect for beach days and warm evenings. Made from 100% cotton for maximum comfort in hot weather.',
    details: [
      'Midi length',
      '100% cotton fabric',
      'Adjustable straps',
      'Side pockets',
      'Elastic back panel for comfort'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Sky Blue', 'Coral', 'White', 'Yellow'],
    featured: false,
    new: true,
    likes: 156
  },

  {
    id: 'tardi003',
    name: 'Habit Traditionnel',
    category: 'Habit Traditionnel',
    price: 129.99,

    images: [],
    description: 'A light, airy summer dress perfect for beach days and warm evenings. Made from 100% cotton for maximum comfort in hot weather.',
    details: [
      'Midi length',
      '100% cotton fabric',
      'Adjustable straps',
      'Side pockets',
      'Elastic back panel for comfort'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Sky Blue', 'Coral', 'White', 'Yellow'],
    featured: false,
    new: true,
    likes: 156
  },

  {
    id: 'tardi004',
    name: 'Habit Traditionnel',
    category: 'mariage-coutumier',
    price: 129.99,

    images: [],
    description: 'A light, airy summer dress perfect for beach days and warm evenings. Made from 100% cotton for maximum comfort in hot weather.',
    details: [
      'Midi length',
      '100% cotton fabric',
      'Adjustable straps',
      'Side pockets',
      'Elastic back panel for comfort'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Sky Blue', 'Coral', 'White', 'Yellow'],
    featured: false,
    new: true,
    likes: 156
  },

    {
    id: 'tardi005',
    name: 'Habit Traditionnel',
    category: 'mariage-coutumier',
    price: 129.99,

    images: [],
    description: 'A light, airy summer dress perfect for beach days and warm evenings. Made from 100% cotton for maximum comfort in hot weather.',
    details: [
      'Midi length',
      '100% cotton fabric',
      'Adjustable straps',
      'Side pockets',
      'Elastic back panel for comfort'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Sky Blue', 'Coral', 'White', 'Yellow'],
    featured: false,
    new: true,
    likes: 156
  },

  {
    id: 'tardi006',
    name: 'Habit Traditionnel',
    category: 'mariage-coutumier',
    price: 129.99,

    images: [],
    description: 'A light, airy summer dress perfect for beach days and warm evenings. Made from 100% cotton for maximum comfort in hot weather.',
    details: [
      'Midi length',
      '100% cotton fabric',
      'Adjustable straps',
      'Side pockets',
      'Elastic back panel for comfort'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Sky Blue', 'Coral', 'White', 'Yellow'],
    featured: false,
    new: true,
    likes: 156
  },

  {
    id: 'tardi006',
    name: 'Habit Traditionnel',
    category: 'mariage-coutumier',
    price: 129.99,

    images: [],
    description: 'A light, airy summer dress perfect for beach days and warm evenings. Made from 100% cotton for maximum comfort in hot weather.',
    details: [
      'Midi length',
      '100% cotton fabric',
      'Adjustable straps',
      'Side pockets',
      'Elastic back panel for comfort'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Sky Blue', 'Coral', 'White', 'Yellow'],
    featured: false,
    new: true,
    likes: 156
  },

    {
    id: 'tardi007',
    name: 'Habit Traditionnel',
    category: 'mariage-coutumier',
    price: 129.99,

    images: [],
    description: 'A light, airy summer dress perfect for beach days and warm evenings. Made from 100% cotton for maximum comfort in hot weather.',
    details: [
      'Midi length',
      '100% cotton fabric',
      'Adjustable straps',
      'Side pockets',
      'Elastic back panel for comfort'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Sky Blue', 'Coral', 'White', 'Yellow'],
    featured: false,
    new: true,
    likes: 156
  },

    {
    id: 'tardi008',
    name: 'Habit Traditionnel',
    category: 'mariage-coutumier',
    price: 129.99,

    images: [],
    description: 'A light, airy summer dress perfect for beach days and warm evenings. Made from 100% cotton for maximum comfort in hot weather.',
    details: [
      'Midi length',
      '100% cotton fabric',
      'Adjustable straps',
      'Side pockets',
      'Elastic back panel for comfort'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Sky Blue', 'Coral', 'White', 'Yellow'],
    featured: false,
    new: true,
    likes: 156
  },

  {
    id: 'tardi009',
    name: 'Habit Traditionnel',
    category: 'mariage-coutumier',
    price: 129.99,

    images: [],
    description: 'A light, airy summer dress perfect for beach days and warm evenings. Made from 100% cotton for maximum comfort in hot weather.',
    details: [
      'Midi length',
      '100% cotton fabric',
      'Adjustable straps',
      'Side pockets',
      'Elastic back panel for comfort'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Sky Blue', 'Coral', 'White', 'Yellow'],
    featured: false,
    new: true,
    likes: 156
  },

  {
    id: 'tardi0010',
    name: 'Habit Traditionnel',
    category: 'mariage-coutumier',
    price: 129.99,

    images: [],
    description: 'A light, airy summer dress perfect for beach days and warm evenings. Made from 100% cotton for maximum comfort in hot weather.',
    details: [
      'Midi length',
      '100% cotton fabric',
      'Adjustable straps',
      'Side pockets',
      'Elastic back panel for comfort'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Sky Blue', 'Coral', 'White', 'Yellow'],
    featured: false,
    new: true,
    likes: 156
  },

  {
    id: 'tardi006',
    name: 'Autres tenues traditionnelles',
    category: 'mariage-coutumier',
    price: 129.99,

    images: [],
    description: 'A light, airy summer dress perfect for beach days and warm evenings. Made from 100% cotton for maximum comfort in hot weather.',
    details: [
      'Midi length',
      '100% cotton fabric',
      'Adjustable straps',
      'Side pockets',
      'Elastic back panel for comfort'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Sky Blue', 'Coral', 'White', 'Yellow'],
    featured: false,
    new: true,
    likes: 156
  },

  {
    id: 'miss1',
    name: 'Miss Julia Samantha',
    category: 'special-miss',
    price: 129.99,

    images: [],
    description: 'A light, airy summer dress perfect for beach days and warm evenings. Made from 100% cotton for maximum comfort in hot weather.',
    details: [
      'Midi length',
      '100% cotton fabric',
      'Adjustable straps',
      'Side pockets',
      'Elastic back panel for comfort'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Sky Blue', 'Coral', 'White', 'Yellow'],
    featured: false,
    new: true,
    likes: 156
  },

  {
    id: 'miss2',
    name: 'Miss Princess Issie',
    category: 'special-miss',
    price: 129.99,

    images: [],
    description: 'A light, airy summer dress perfect for beach days and warm evenings. Made from 100% cotton for maximum comfort in hot weather.',
    details: [
      'Midi length',
      '100% cotton fabric',
      'Adjustable straps',
      'Side pockets',
      'Elastic back panel for comfort'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Sky Blue', 'Coral', 'White', 'Yellow'],
    featured: false,
    new: true,
    likes: 156
  },

  {
    id: 'miss3',
    name: 'Miss Ngueleu Raissa',
    category: 'special-miss',
    price: 129.99,

    images: [],
    description: 'A light, airy summer dress perfect for beach days and warm evenings. Made from 100% cotton for maximum comfort in hot weather.',
    details: [
      'Midi length',
      '100% cotton fabric',
      'Adjustable straps',
      'Side pockets',
      'Elastic back panel for comfort'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Sky Blue', 'Coral', 'White', 'Yellow'],
    featured: false,
    new: true,
    likes: 156
  },

  {
    id: 'miss4',
    name: 'Miss Aïchatou Bobo',
    category: 'special-miss',
    price: 129.99,

    images: [],
    description: 'A light, airy summer dress perfect for beach days and warm evenings. Made from 100% cotton for maximum comfort in hot weather.',
    details: [
      'Midi length',
      '100% cotton fabric',
      'Adjustable straps',
      'Side pockets',
      'Elastic back panel for comfort'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Sky Blue', 'Coral', 'White', 'Yellow'],
    featured: false,
    new: true,
    likes: 156
  },

  {
    id: 'journee-jeunesse',
    name: 'Journee Jeunesse',
    category: 'journee-jeunesse',
    price: 129.99,

    images: [],
    description: 'A light, airy summer dress perfect for beach days and warm evenings. Made from 100% cotton for maximum comfort in hot weather.',
    details: [
      'Midi length',
      '100% cotton fabric',
      'Adjustable straps',
      'Side pockets',
      'Elastic back panel for comfort'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Sky Blue', 'Coral', 'White', 'Yellow'],
    featured: false,
    new: true,
    likes: 156
  },

    {
    id: 'RM1',
    name: 'Robe Mixte',
    category: 'robe-mixte',
    price: 129.99,

    images: [],
    description: 'A light, airy summer dress perfect for beach days and warm evenings. Made from 100% cotton for maximum comfort in hot weather.',
    details: [
      'Midi length',
      '100% cotton fabric',
      'Adjustable straps',
      'Side pockets',
      'Elastic back panel for comfort'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Sky Blue', 'Coral', 'White', 'Yellow'],
    featured: false,
    new: true,
    likes: 156
  }

];

// Create 15 more dresses to have a total of 20 dresses (4 per page with 5 pages)
export const allDresses: Dress[] = [
  ...dresses,
  // Additional evening gowns

];