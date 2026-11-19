import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-sneaker-mcqueen",
    name: {
      fr: "Baskets Alexander McQueen Court Classic",
      ar: "حذاء ألكسندر ماكوين كورت كلاسيك"
    },
    brand: "Alexander McQueen",
    category: "sneakers",
    price: 14500,
    originalPrice: 16500,
    image: "/images/product_sneaker_luxury_1794272552580.jpg",
    sizes: ["40", "41", "42", "43", "44", "45"],
    colors: [
      { name: { fr: "Noir Mat & Charbon", ar: "أسود وفحم" }, hex: "#1f1f23" },
      { name: { fr: "Blanc Épuré", ar: "أبيض ناصع" }, hex: "#f4f4f5" }
    ],
    description: {
      fr: "Sneaker en cuir de veau souple avec semelle sculpturale surdimensionnée. Finition haut de gamme avec logo discret en relief et languette rembourrée pour un confort supérieur au quotidien.",
      ar: "حذاء سنيكرز فاخر من جلد العجل الطبيعي مع نعل منحوت ومميز. تفاصيل دقيقة وتشطيب عالي الجودة يوفر راحة فائقة ومظهراً فخماً طوال اليوم."
    },
    features: {
      fr: [
        "Cuir véritable de première qualité",
        "Semelle sculpturale ergonomique et légère",
        "Lacets en coton ciré premium",
        "Fabrication soignée et durable"
      ],
      ar: [
        "جلد طبيعي عالي الجودة 100%",
        "نعل خفيف الوزن بتصميم مريح",
        "أربطة قطنية معالجة ومتينة",
        "تشطيب فاخر مع كعب معزز"
      ]
    },
    inStock: true,
    stockCount: 12,
    isNewArrival: true,
    isBestSeller: true
  },
  {
    id: "prod-blazer-tony-moro",
    name: {
      fr: "Veste Blazer Électron Tony Moro Tailleur",
      ar: "سترة بلايزر توني مورو إيطالية فاخرة"
    },
    brand: "Tony Moro",
    category: "jackets",
    price: 12500,
    originalPrice: 14000,
    image: "/images/product_jacket_suit_1794272553427.jpg",
    sizes: ["48", "50", "52", "54", "56"],
    colors: [
      { name: { fr: "Gris Anthracite Chiné", ar: "رمادي فحمي مائل" }, hex: "#373a40" },
      { name: { fr: "Bleu Nuit Profond", ar: "أزرق كحلي داكن" }, hex: "#141c2b" }
    ],
    description: {
      fr: "Blazer masculin à coupe italienne structurée, confectionné dans un mélange de laine texturé de haute tenue. Idéal pour les occasions formelles ou le style smart-casual moderne.",
      ar: "سترة بلايزر رجالية بقصة إيطالية متناسقة وقماش صوف منسوج فاخر. مثالية للمناسبات الرسمية أو الإطلالة الأنيقة اليومية."
    },
    features: {
      fr: [
        "Coupe italienne semi-ajustée très seyante",
        "Doublure intérieure en satin respirant",
        "Poches passepoilées et fentes d'aisance au dos",
        "Boutons de manchette en corne travaillée"
      ],
      ar: [
        "قصة إيطالية شبه مجسمة ومريحة",
        "بطانة داخلية من الساتان الفاخر تسمح بالتهوية",
        "جيوب مصممة بدقة وفتحات خلفية مريحة",
        "أزرار أكمام كلاسيكية فاخرة"
      ]
    },
    inStock: true,
    stockCount: 8,
    isNewArrival: true,
    isBestSeller: true
  },
  {
    id: "prod-shirt-boss-black",
    name: {
      fr: "Chemise Popeline Slim-Fit Hugo Boss",
      ar: "قميص هوغو بوس بقصة عصرية سلم فيت"
    },
    brand: "Hugo Boss",
    category: "shirts",
    price: 5400,
    originalPrice: 6200,
    image: "/images/product_jacket_suit_1794272553427.jpg",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: { fr: "Blanc Optique", ar: "أبيض ناصع" }, hex: "#ffffff" },
      { name: { fr: "Noir Intense", ar: "أسود داكن" }, hex: "#121212" },
      { name: { fr: "Bleu Ciel", ar: "أزرق سماوي" }, hex: "#7ba7cc" }
    ],
    description: {
      fr: "Chemise intemporelle en popeline de pur coton égyptien au toucher soyeux avec col italien raffiné. Traitement easy-iron pour un repassage sans effort.",
      ar: "قميص كلاسيكي أنيق مصنوع من قطن البوبلين الفاخر ذي الملمس الناعم وياقة إيطالية متناسقة. معالج لتسهيل الكي والحفاظ على النضارة."
    },
    features: {
      fr: [
        "100% Coton peigné d'Égypte",
        "Coupe cintrée moderne slim-fit",
        "Col boutonné rigide et finitions impeccables",
        "Résistant au lavage répété"
      ],
      ar: [
        "قطن مصري ممشوط 100%",
        "قصة عصرية مشدودة ومريحة",
        "ياقة متينة وتشطيبات خياطة مزدوجة",
        "يحافظ على لمعانه وثبات ألوانه"
      ]
    },
    inStock: true,
    stockCount: 24,
    isNewArrival: false,
    isBestSeller: true
  },
  {
    id: "prod-watch-boss-chrono",
    name: {
      fr: "Montre Chronographe Hugo Boss Acier & Cuir",
      ar: "ساعة كرونوغراف هوغو بوس الفولاذية"
    },
    brand: "Hugo Boss",
    category: "watches",
    price: 13900,
    originalPrice: 15500,
    image: "/images/product_watch_perfume_1794272553139.jpg",
    sizes: ["Taille Unique (42mm)"],
    colors: [
      { name: { fr: "Cadran Noir / Bracelet Cuir Brun", ar: "ميناء أسود وحزام بني" }, hex: "#3e2723" },
      { name: { fr: "Acier Argenté", ar: "فولاذ فضي" }, hex: "#9e9e9e" }
    ],
    description: {
      fr: "Montre chronographe masculine de 42 mm en acier inoxydable brossé avec cadran noir soleillé, 3 compteurs sportifs et bracelet en cuir véritable gaufré crocodile.",
      ar: "ساعة كرونوغراف رجالية بقطر 42 مم من الفولاذ المقاوم للصدأ وميناء أسود عاكس للضوء مع 3 عدادات دقيقة وحزام جلد طبيعي فاخر بنقشة التمساح."
    },
    features: {
      fr: [
        "Mouvement à quartz japonais de haute précision",
        "Boîtier acier 316L étanche 5 ATM (50m)",
        "Verre minéral trempé anti-rayures",
        "Livrée dans son écrin de luxe original avec garantie"
      ],
      ar: [
        "محرك كوارتز ياباني فائق الدقة",
        "هيكل فولاذي 316L مقاوم للماء حتى عمق 50 متراً",
        "زجاج معدني مقوى مقاوم للخدوش",
        "تأتي في علبة OD WEAR الفاخرة مع بطاقة الضمان"
      ]
    },
    inStock: true,
    stockCount: 5,
    isNewArrival: true,
    isBestSeller: true
  },
  {
    id: "prod-perfume-homme-ete",
    name: {
      fr: "Parfum L'Homme d'Été - Eau de Parfum 100ml",
      ar: "عطر رجالي لوم ديتي - تركيز بارفان 100مل"
    },
    brand: "OD WEAR Signature",
    category: "perfumes",
    price: 6500,
    originalPrice: 7500,
    image: "/images/product_watch_perfume_1794272553139.jpg",
    sizes: ["Flacon 100 ml"],
    colors: [
      { name: { fr: "Ambre Vétiver", ar: "عنبر ونجيل الهند" }, hex: "#8d6e63" }
    ],
    description: {
      fr: "Un sillage boisé et épicé d'une rare élégance associant les notes de bergamote de Calabre, de poivre noir, de cèdre de l'Atlas et de vétiver fumé. Tenue exceptionnelle de plus de 12 heures.",
      ar: "توليفة عطرية خشبية فاخرة تجمع بين نفحات البرغموت الإيطالي، الفلفل الأسود، خشب الأرز والعنبر الدافئ. ثبات قوي يدوم لأكثر من 12 ساعة وفوحان ملفت."
    },
    features: {
      fr: [
        "Concentration Eau de Parfum (22% essence)",
        "Notes de tête : Bergamote & Poivre rose",
        "Notes de cœur : Cèdre de l'Atlas & Sauge",
        "Notes de fond : Vétiver, Ambre gris & Cuir"
      ],
      ar: [
        "تركيز عالي أو دو بارفان (22%)",
        "القمة: برغموت وفلفل وردي",
        "القلب: خشب الأرز والميرمية",
        "القاعدة: نجيل الهند، عنبر وجلد فاخر"
      ]
    },
    inStock: true,
    stockCount: 15,
    isNewArrival: false,
    isBestSeller: true
  },
  {
    id: "prod-sneaker-offwhite-low",
    name: {
      fr: "Baskets Off-White Low Vulcanized Streetwear",
      ar: "حذاء سنيكرز أوف وايت ستريت وير"
    },
    brand: "Off-White",
    category: "sneakers",
    price: 13800,
    originalPrice: 15200,
    image: "/images/product_sneaker_luxury_1794272552580.jpg",
    sizes: ["40", "41", "42", "43", "44"],
    colors: [
      { name: { fr: "Noir & Blanc", ar: "أسود وأبيض" }, hex: "#111111" },
      { name: { fr: "Blanc & Fluo", ar: "أبيض ومميز" }, hex: "#f5f5f5" }
    ],
    description: {
      fr: "Baskets iconiques à semelle vulcanisée ornées des rayures diagonales signatures et de la flèche brodée latérale. Une silhouette urbaine plébiscitée par les amateurs de mode de rue de luxe.",
      ar: "سنيكرز أيقوني بنعل فلكانيز متين وتفاصيل خطوط مائلة وسهم جانبي مميز. الحذاء المفضل لرواد أسلوب الستريت وير الفاخر."
    },
    features: {
      fr: [
        "Toile épaisse et empiècements en cuir suédé",
        "Semelle en caoutchouc vulcanisé anti-dérapante",
        "Détail Zip-Tie iconique amovible",
        "Confort optimal pour la marche urbaine"
      ],
      ar: [
        "قماش كانفاس سميك مع تطعيمات جلدية شامواه",
        "نعل مطاطي عالي التحمل مانع للانزلاق",
        "الملحق الأيقوني المميز القابل للإزالة",
        "تبطين داخلي فائق الراحة طوال اليوم"
      ]
    },
    inStock: true,
    stockCount: 7,
    isNewArrival: true,
    isBestSeller: false
  },
  {
    id: "prod-pants-zara-cargo",
    name: {
      fr: "Pantalon Cargo Relaxed Zara Man Premium",
      ar: "سروال كارغو زارا مان المريح"
    },
    brand: "Zara Man",
    category: "pants",
    price: 4800,
    originalPrice: 5500,
    image: "/images/hero_menswear_chlef_1794272552067.jpg",
    sizes: ["38", "40", "42", "44", "46"],
    colors: [
      { name: { fr: "Kaki Militaire", ar: "زيتي عسكري" }, hex: "#4b5320" },
      { name: { fr: "Noir Mat", ar: "أسود مطفأ" }, hex: "#18181b" },
      { name: { fr: "Beige Sable", ar: "بيج رملي" }, hex: "#d2b48c" }
    ],
    description: {
      fr: "Pantalon cargo contemporain en sergé de coton robuste avec poches utilitaires à soufflet et bas de jambe ajustables. La pièce essentielle pour un look décontracté haut de gamme.",
      ar: "سروال كارغو عصري مصنوع من قماش قطني متين مع جيوب جانبية عريضة وأطراف قابلة للتعديل. القطعة المثالية لإطلالة كاجوال راقية ومريحة."
    },
    features: {
      fr: [
        "100% Coton ripstop résistant",
        "6 poches fonctionnelles avec rabats",
        "Taille mi-haute avec passants de ceinture renforcés",
        "Lavable en machine à 30°C"
      ],
      ar: [
        "قطن متين مقاوم للتآكل 100%",
        "6 جيوب عملية مع أقفال محكمة",
        "خصر مريح مع حلقات حزام مدعمة",
        "قصة مرنة ومناسبة لكافة النشاطات"
      ]
    },
    inStock: true,
    stockCount: 19,
    isNewArrival: false,
    isBestSeller: true
  },
  {
    id: "prod-pants-zegna-formal",
    name: {
      fr: "Pantalon Habillé Élastique Style Zegna",
      ar: "سروال كلاسيكي رسمي بقماش زينيا الفاخر"
    },
    brand: "Zegna Style",
    category: "pants",
    price: 5900,
    originalPrice: 6800,
    image: "/images/hero_menswear_chlef_1794272552067.jpg",
    sizes: ["40", "42", "44", "46", "48"],
    colors: [
      { name: { fr: "Bleu Marine", ar: "أزرق كحلي" }, hex: "#1a237e" },
      { name: { fr: "Gris Moyen", ar: "رمادي متوسط" }, hex: "#616161" }
    ],
    description: {
      fr: "Pantalon de ville raffiné avec pli marqué au fer et taille mi-élastiquée discrète assurant un confort sans compromis sur l'élégance sartoriale.",
      ar: "سروال رسمي أنيق بكسرة مكواة حادة وخصر مريح مطاطي مخفي يضمن لك الراحة المطلقة دون التنازل عن فخامة المظهر."
    },
    features: {
      fr: [
        "Mélange laine froide et élasthanne infroissable",
        "Poches italiennes latérales et poches arrières boutonnées",
        "Ourlet prêt à porter avec marge de retouche",
        "Idéal avec blazer ou chemise cintrée"
      ],
      ar: [
        "مزيج صوف ناعم مرن مضاد للتجعد",
        "جيوب إيطالية جانبية وجيوب خلفية بأزرار",
        "حاشية جاهزة ومناسبة للتعديل السريع",
        "يتناسق بسهولة مع البلايزر والقمصان"
      ]
    },
    inStock: true,
    stockCount: 11,
    isNewArrival: false,
    isBestSeller: false
  },
  {
    id: "prod-tracksuit-urban-jogging",
    name: {
      fr: "Ensemble Jogging Techwear Urban Comfort",
      ar: "طقم جوجينغ رياضي عصري تيك وير"
    },
    brand: "OD WEAR Edition",
    category: "tracksuits",
    price: 6800,
    originalPrice: 7900,
    image: "/images/hero_menswear_chlef_1794272552067.jpg",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: { fr: "Noir Mat & Zip Gold", ar: "أسود وسحاب ذهبي" }, hex: "#1e1e1e" },
      { name: { fr: "Gris Chiné", ar: "رمادي فاتح" }, hex: "#9e9e9e" }
    ],
    description: {
      fr: "Ensemble complet sweatshirt à capuche zippé et pantalon de survêtement fuselé en molleton épais de coton biologique. Finitions thermocollées et coupes nettes.",
      ar: "طقم كامل مكوّن من سترة بسحاب وغطاء رأس مع سروال رياضي متناسق من القطن العضوي السميك. درزات متينة وتفاصيل مريحة لمظهر رياضي فخم."
    },
    features: {
      fr: [
        "Molleton gratté 380 g/m² très doux",
        "Zips métalliques étanches haute résistance",
        "Cordons de serrage avec embouts gravés",
        "Poches zippées sécurisées pour téléphone et clés"
      ],
      ar: [
        "قماش قطني سميك بوزن 380 غ/م² فائق النعومة",
        "سحابات معدنية متينة ومقاومة",
        "أربطة خصر متينة بأطراف منقوشة",
        "جيوب بسحاب لحفظ الهاتف والمفاتيح بأمان"
      ]
    },
    inStock: true,
    stockCount: 16,
    isNewArrival: true,
    isBestSeller: true
  },
  {
    id: "prod-sneaker-oncloud-5",
    name: {
      fr: "Baskets On Cloud 5 Waterproof All-Black",
      ar: "حذاء أون كلاود 5 ووتربروف المقاوم للماء"
    },
    brand: "On Cloud",
    category: "sneakers",
    price: 12900,
    originalPrice: 14200,
    image: "/images/product_sneaker_luxury_1794272552580.jpg",
    sizes: ["41", "42", "43", "44", "45"],
    colors: [
      { name: { fr: "All Black", ar: "أسود بالكامل" }, hex: "#0a0a0a" },
      { name: { fr: "Gris Glacier", ar: "رمادي ثلجي" }, hex: "#e0e0e0" }
    ],
    description: {
      fr: "La référence suisse de l'amorti CloudTec combinée à une membrane imperméable respirante et au système de laçage rapide. Parfait pour rester actif avec style.",
      ar: "التقنية السويسرية الشهيرة بنعل كلاود تيك الماص للصدمات مع غشاء مقاوم للماء وأربطة سريعة الشد. خيارك الأمثل للراحة في كل الأجواء."
    },
    features: {
      fr: [
        "Semelle Zero-Gravity brevetée avec plots CloudTec",
        "Membrane 100% coupe-vent et imperméable",
        "Système de laçage rapide sans nœud inclus",
        "Ultra léger (environ 280 grammes)"
      ],
      ar: [
        "نعل كلاود تيك السويسري الحاصل على براءة اختراع",
        "مقاوم للمطر والرياح بنسبة 100%",
        "نظام إغلاق سريع ومريح بدون الحاجة للربط",
        "وزن خفيف جداً يمنحك شعور المشي على السحاب"
      ]
    },
    inStock: true,
    stockCount: 6,
    isNewArrival: false,
    isBestSeller: true
  }
];

export const INITIAL_ORDERS: import('../types').Order[] = [
  {
    id: "ord-1048",
    orderNumber: "BSC-26-1048",
    createdAt: "2026-11-09T14:22:00Z",
    customerName: "Mohamed Cherif",
    customerPhone: "0550 44 19 82",
    wilayaCode: 2,
    wilayaName: "02 - Chlef (Local)",
    communeAddress: "Chlef Centre, Cité El Mokrani, Bât 04",
    deliveryType: "home",
    deliveryFee: 350,
    items: [
      {
        product: INITIAL_PRODUCTS[0],
        selectedSize: "42",
        selectedColor: "Noir Mat & Charbon",
        quantity: 1
      }
    ],
    subtotal: 14500,
    total: 14850,
    status: "delivered",
    paymentMethod: "cod",
    notes: "Appeler avant 16h"
  },
  {
    id: "ord-1049",
    orderNumber: "BSC-26-1049",
    createdAt: "2026-11-09T15:45:00Z",
    customerName: "Yacine Belkacem",
    customerPhone: "0661 88 23 09",
    wilayaCode: 16,
    wilayaName: "16 - Alger",
    communeAddress: "Hydra, Boulevard du 11 Décembre",
    deliveryType: "desk",
    deliveryFee: 400,
    items: [
      {
        product: INITIAL_PRODUCTS[1],
        selectedSize: "52",
        selectedColor: "Gris Anthracite Chiné",
        quantity: 1
      },
      {
        product: INITIAL_PRODUCTS[2],
        selectedSize: "L",
        selectedColor: "Blanc Optique",
        quantity: 1
      }
    ],
    subtotal: 17900,
    total: 18300,
    status: "shipped",
    paymentMethod: "cod",
    notes: "Bureau Yalidine Hydra"
  },
  {
    id: "ord-1050",
    orderNumber: "BSC-26-1050",
    createdAt: "2026-11-09T16:10:00Z",
    customerName: "Khaled Mansouri",
    customerPhone: "0770 12 94 33",
    wilayaCode: 31,
    wilayaName: "31 - Oran",
    communeAddress: "Akid Lotfi, Résidence Les Palmiers",
    deliveryType: "home",
    deliveryFee: 650,
    items: [
      {
        product: INITIAL_PRODUCTS[3],
        selectedSize: "Taille Unique (42mm)",
        selectedColor: "Cadran Noir / Bracelet Cuir Brun",
        quantity: 1
      }
    ],
    subtotal: 13900,
    total: 14550,
    status: "confirmed",
    paymentMethod: "whatsapp"
  },
  {
    id: "ord-1051",
    orderNumber: "BSC-26-1051",
    createdAt: "2026-11-09T16:55:00Z",
    customerName: "Amine Bouzid",
    customerPhone: "0541 77 62 10",
    wilayaCode: 9,
    wilayaName: "09 - Blida",
    communeAddress: "Ouled Yaïch, Rue Principale",
    deliveryType: "home",
    deliveryFee: 650,
    items: [
      {
        product: INITIAL_PRODUCTS[8],
        selectedSize: "L",
        selectedColor: "Noir Mat & Zip Gold",
        quantity: 1
      }
    ],
    subtotal: 6800,
    total: 7450,
    status: "pending",
    paymentMethod: "cod"
  }
];
