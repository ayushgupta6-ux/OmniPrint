export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  categorySlug: string;
  description: string;
  image: string;
  filters: {
    label: string;
    options: string[];
  }[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  primaryFilters: string[];
  products: Product[];
}

export const categories: Category[] = [
  {
    id: "outdoor-signage",
    name: "Signs, Posters & Marketing Materials",
    slug: "outdoor-signage",
    description: "Custom signage with high print quality to keep your graphics sharp, vibrant, and true to colour.",
    image: "/images/categories/outdoor.jpg",
    primaryFilters: ["Material", "Size (ft)", "Weatherproofing"],
    products: [
      {
        id: "flex-banners",
        name: "Flex Banners",
        slug: "flex-banners",
        category: "Outdoor & Signage",
        categorySlug: "outdoor-signage",
        description: "Durable, weather-resistant banners perfect for outdoor advertising and events",
        image: "/images/products/flex-banner.jpg",
        filters: [
          { label: "Material", options: ["Star Flex", "Normal Flex", "Vinyl on Sunboard", "Backlit Flex"] },
          { label: "Size", options: ["3x2 ft", "6x3 ft", "8x4 ft", "10x5 ft", "Custom"] },
          { label: "Finish", options: ["Matte", "Glossy", "Semi-Gloss"] },
        ],
      },
      {
        id: "solvent-print",
        name: "Solvent Print",
        slug: "solvent-print",
        category: "Outdoor & Signage",
        categorySlug: "outdoor-signage",
        description: "High-quality solvent prints with vibrant colors and long-lasting durability",
        image: "/images/products/solvent-print.jpg",
        filters: [
          { label: "Material", options: ["Vinyl", "Canvas", "Flex", "Mesh"] },
          { label: "Size", options: ["2x2 ft", "4x3 ft", "6x4 ft", "Custom"] },
          { label: "Resolution", options: ["720 DPI", "1080 DPI", "1440 DPI"] },
        ],
      },
      {
        id: "standees",
        name: "Standees",
        slug: "standees",
        category: "Outdoor & Signage",
        categorySlug: "outdoor-signage",
        description: "Eye-catching promotional standees for retail and event displays",
        image: "/images/products/standee.jpg",
        filters: [
          { label: "Material", options: ["Sunboard", "Foam Board", "MDF", "Acrylic"] },
          { label: "Size", options: ["2.5x6 ft", "3x5 ft", "4x6 ft", "Custom"] },
          { label: "Stand Type", options: ["X-Stand", "Roll-up", "L-Stand", "Fixed Base"] },
        ],
      },
      {
        id: "backdrops",
        name: "Backdrops",
        slug: "backdrops",
        category: "Outdoor & Signage",
        categorySlug: "outdoor-signage",
        description: "Professional backdrops for events, photo booths, and exhibitions",
        image: "/images/products/backdrop.jpg",
        filters: [
          { label: "Material", options: ["Fabric", "Vinyl", "Flex", "Pop-up Frame"] },
          { label: "Size", options: ["8x8 ft", "10x8 ft", "12x8 ft", "Custom"] },
          { label: "Type", options: ["Step & Repeat", "Curved", "Straight", "Telescopic"] },
        ],
      },
      {
        id: "night-glow",
        name: "Night Glow Signs",
        slug: "night-glow",
        category: "Outdoor & Signage",
        categorySlug: "outdoor-signage",
        description: "Luminous signage that glows in low light conditions",
        image: "/images/products/night-glow.jpg",
        filters: [
          { label: "Material", options: ["Radium Vinyl", "Glow Film", "Phosphorescent"] },
          { label: "Size", options: ["A4", "A3", "A2", "Custom"] },
          { label: "Glow Duration", options: ["4 Hours", "8 Hours", "12 Hours"] },
        ],
      },
      {
        id: "fire-exit",
        name: "Fire Exit Signs",
        slug: "fire-exit",
        category: "Outdoor & Signage",
        categorySlug: "outdoor-signage",
        description: "Compliant safety signage for emergency exits and fire safety",
        image: "/images/products/fire-exit.jpg",
        filters: [
          { label: "Material", options: ["Acrylic", "ACP", "Sunboard", "Self-Adhesive"] },
          { label: "Size", options: ["6x12 inch", "8x16 inch", "12x24 inch"] },
          { label: "Type", options: ["Glow", "LED", "Standard"] },
        ],
      },
    ],
  },
  {
    id: "corporate-stationery",
    name: "Corporate & Stationery",
    slug: "corporate-stationery",
    description: "Professional printing solutions for business communications",
    image: "/images/categories/corporate.jpg",
    primaryFilters: ["Paper GSM", "Finish (Matte/Gloss)"],
    products: [
      {
        id: "certificates",
        name: "Certificates",
        slug: "certificates",
        category: "Corporate & Stationery",
        categorySlug: "corporate-stationery",
        description: "Premium certificates for achievements, awards, and recognition",
        image: "/images/products/certificate.jpg",
        filters: [
          { label: "Paper GSM", options: ["170 GSM", "220 GSM", "300 GSM", "350 GSM"] },
          { label: "Finish", options: ["Matte", "Glossy", "Matte Laminated", "Spot UV"] },
          { label: "Size", options: ["A4", "A3", "Letter", "Custom"] },
        ],
      },
      {
        id: "brochures",
        name: "Brochures",
        slug: "brochures",
        category: "Corporate & Stationery",
        categorySlug: "corporate-stationery",
        description: "Professionally designed brochures for marketing and information",
        image: "/images/products/brochure.jpg",
        filters: [
          { label: "Paper GSM", options: ["130 GSM", "170 GSM", "250 GSM"] },
          { label: "Finish", options: ["Matte", "Glossy", "Uncoated"] },
          { label: "Fold Type", options: ["Bi-fold", "Tri-fold", "Gate-fold", "Z-fold"] },
        ],
      },
      {
        id: "leaflets",
        name: "Leaflets",
        slug: "leaflets",
        category: "Corporate & Stationery",
        categorySlug: "corporate-stationery",
        description: "Cost-effective leaflets for mass distribution and promotions",
        image: "/images/products/leaflet.jpg",
        filters: [
          { label: "Paper GSM", options: ["80 GSM", "100 GSM", "130 GSM"] },
          { label: "Finish", options: ["Matte", "Glossy", "Uncoated"] },
          { label: "Size", options: ["A5", "A4", "DL", "Custom"] },
        ],
      },
      {
        id: "folders",
        name: "Folders",
        slug: "folders",
        category: "Corporate & Stationery",
        categorySlug: "corporate-stationery",
        description: "Professional presentation folders for corporate documents",
        image: "/images/products/folder.jpg",
        filters: [
          { label: "Paper GSM", options: ["300 GSM", "350 GSM", "400 GSM"] },
          { label: "Finish", options: ["Matte Laminated", "Gloss Laminated", "Soft Touch"] },
          { label: "Size", options: ["A4", "A3", "Custom"] },
        ],
      },
      {
        id: "clipboards",
        name: "Clipboards",
        slug: "clipboards",
        category: "Corporate & Stationery",
        categorySlug: "corporate-stationery",
        description: "Custom branded clipboards for professional use",
        image: "/images/products/clipboard.jpg",
        filters: [
          { label: "Material", options: ["MDF", "Acrylic", "Aluminum"] },
          { label: "Size", options: ["A4", "A5", "Letter"] },
          { label: "Clip Type", options: ["Standard", "Low Profile", "Wire"] },
        ],
      },
    ],
  },
  {
    id: "premium-acrylic",
    name: "Premium & Acrylic",
    slug: "premium-acrylic",
    description: "High-end acrylic and premium signage solutions",
    image: "/images/categories/acrylic.jpg",
    primaryFilters: ["Lighting (LED Y/N)", "Mounting Type"],
    products: [
      {
        id: "3d-letters",
        name: "3D Letters",
        slug: "3d-letters",
        category: "Premium & Acrylic",
        categorySlug: "premium-acrylic",
        description: "Dimensional lettering for impactful brand signage",
        image: "/images/products/3d-letters.jpg",
        filters: [
          { label: "Material", options: ["Acrylic", "Metal", "PVC", "Brass"] },
          { label: "Lighting", options: ["Front Lit LED", "Back Lit LED", "No Lighting"] },
          { label: "Height", options: ['6"', '8"', '12"', '18"', '24"', "Custom"] },
        ],
      },
      {
        id: "acrylic-molding",
        name: "Acrylic Molding",
        slug: "acrylic-molding",
        category: "Premium & Acrylic",
        categorySlug: "premium-acrylic",
        description: "Custom acrylic shapes and molded signage elements",
        image: "/images/products/acrylic-molding.jpg",
        filters: [
          { label: "Thickness", options: ["3mm", "5mm", "8mm", "12mm"] },
          { label: "Finish", options: ["Clear", "Frosted", "Colored", "Mirror"] },
          { label: "Shape", options: ["Custom Cut", "Standard Shapes"] },
        ],
      },
      {
        id: "sandwich-posters",
        name: "Sandwich Posters",
        slug: "sandwich-posters",
        category: "Premium & Acrylic",
        categorySlug: "premium-acrylic",
        description: "Layered poster displays with depth and dimension",
        image: "/images/products/sandwich-poster.jpg",
        filters: [
          { label: "Material", options: ["Acrylic", "Glass", "Polycarbonate"] },
          { label: "Size", options: ["A4", "A3", "A2", "Custom"] },
          { label: "Mounting", options: ["Standoff", "Rail", "Magnetic"] },
        ],
      },
      {
        id: "ss-engraving",
        name: "SS Engraving",
        slug: "ss-engraving",
        category: "Premium & Acrylic",
        categorySlug: "premium-acrylic",
        description: "Precision stainless steel engraving for lasting elegance",
        image: "/images/products/ss-engraving.jpg",
        filters: [
          { label: "Steel Grade", options: ["SS 304", "SS 316", "Mirror Finish"] },
          { label: "Depth", options: ["Surface Etch", "Deep Engrave"] },
          { label: "Fill", options: ["Paint Fill", "No Fill", "Gold Fill"] },
        ],
      },
      {
        id: "led-boards",
        name: "LED Boards",
        slug: "led-boards",
        category: "Premium & Acrylic",
        categorySlug: "premium-acrylic",
        description: "Illuminated display boards for maximum visibility",
        image: "/images/products/led-board.jpg",
        filters: [
          { label: "Type", options: ["Backlit", "Edge Lit", "Neon Flex", "Pixel LED"] },
          { label: "Size", options: ["2x2 ft", "4x2 ft", "6x3 ft", "Custom"] },
          { label: "Control", options: ["Static", "Dimmable", "RGB", "Animated"] },
        ],
      },
    ],
  },
  {
    id: "interior-decor",
    name: "Interior & Decor",
    slug: "interior-decor",
    description: "Stylish interior solutions for spaces and surfaces",
    image: "/images/categories/interior.jpg",
    primaryFilters: ["Surface Type", "Application Area"],
    products: [
      {
        id: "photo-frames",
        name: "Photo Frames",
        slug: "photo-frames",
        category: "Interior & Decor",
        categorySlug: "interior-decor",
        description: "Custom frames to showcase your memories and artwork",
        image: "/images/products/photo-frame.jpg",
        filters: [
          { label: "Material", options: ["Wood", "Metal", "Acrylic", "MDF"] },
          { label: "Size", options: ['4x6"', '5x7"', '8x10"', '11x14"', "Custom"] },
          { label: "Style", options: ["Modern", "Classic", "Floating", "Shadow Box"] },
        ],
      },
      {
        id: "frosted-film",
        name: "Frosted Film",
        slug: "frosted-film",
        category: "Interior & Decor",
        categorySlug: "interior-decor",
        description: "Privacy films and decorative glass treatments",
        image: "/images/products/frosted-film.jpg",
        filters: [
          { label: "Type", options: ["Plain Frost", "Etched Pattern", "Custom Design"] },
          { label: "Opacity", options: ["Light", "Medium", "Heavy"] },
          { label: "Application", options: ["Interior Glass", "Exterior Glass", "Partition"] },
        ],
      },
      {
        id: "cut-vinyl",
        name: "Cut Vinyl",
        slug: "cut-vinyl",
        category: "Interior & Decor",
        categorySlug: "interior-decor",
        description: "Precision-cut vinyl graphics for walls and surfaces",
        image: "/images/products/cut-vinyl.jpg",
        filters: [
          { label: "Vinyl Type", options: ["Matte", "Glossy", "Metallic", "Reflective"] },
          { label: "Application", options: ["Wall", "Glass", "Vehicle", "Floor"] },
          { label: "Durability", options: ["Indoor (3yr)", "Outdoor (5yr)", "Premium (7yr)"] },
        ],
      },
      {
        id: "pin-boards",
        name: "Pin Boards",
        slug: "pin-boards",
        category: "Interior & Decor",
        categorySlug: "interior-decor",
        description: "Cork and fabric pin boards for notices and displays",
        image: "/images/products/pin-board.jpg",
        filters: [
          { label: "Material", options: ["Cork", "Fabric", "Felt"] },
          { label: "Size", options: ["2x3 ft", "3x4 ft", "4x6 ft", "Custom"] },
          { label: "Frame", options: ["Aluminum", "Wood", "Frameless"] },
        ],
      },
      {
        id: "white-boards",
        name: "White Boards",
        slug: "white-boards",
        category: "Interior & Decor",
        categorySlug: "interior-decor",
        description: "Magnetic and non-magnetic whiteboards for offices",
        image: "/images/products/white-board.jpg",
        filters: [
          { label: "Type", options: ["Magnetic", "Non-Magnetic", "Glass"] },
          { label: "Size", options: ["2x3 ft", "3x4 ft", "4x6 ft", "Custom"] },
          { label: "Frame", options: ["Aluminum", "Wood", "Frameless"] },
        ],
      },
    ],
  },
  {
    id: "recognition-events",
    name: "Recognition & Events",
    slug: "recognition-events",
    description: "Awards, trophies, and event materials for special occasions",
    image: "/images/categories/recognition.jpg",
    primaryFilters: ["Material (Wood/Metal/Acrylic)"],
    products: [
      {
        id: "trophies",
        name: "Trophies",
        slug: "trophies",
        category: "Recognition & Events",
        categorySlug: "recognition-events",
        description: "Premium trophies for achievements and competitions",
        image: "/images/products/trophy.jpg",
        filters: [
          { label: "Material", options: ["Crystal", "Metal", "Wood", "Acrylic", "Resin"] },
          { label: "Size", options: ["Small (6-8\")", "Medium (9-12\")", "Large (13-18\")", "Custom"] },
          { label: "Engraving", options: ["Laser", "UV Print", "Metal Plate"] },
        ],
      },
      {
        id: "badges",
        name: "Badges",
        slug: "badges",
        category: "Recognition & Events",
        categorySlug: "recognition-events",
        description: "Custom badges for identification and branding",
        image: "/images/products/badge.jpg",
        filters: [
          { label: "Material", options: ["Metal", "Acrylic", "PVC", "Fabric"] },
          { label: "Size", options: ["Standard", "Large", "Custom"] },
          { label: "Attachment", options: ["Pin", "Magnetic", "Clip", "Lanyard"] },
        ],
      },
      {
        id: "easel-stands",
        name: "Easel Stands",
        slug: "easel-stands",
        category: "Recognition & Events",
        categorySlug: "recognition-events",
        description: "Display stands for presentations and events",
        image: "/images/products/easel-stand.jpg",
        filters: [
          { label: "Material", options: ["Wood", "Metal", "Aluminum"] },
          { label: "Size", options: ["Tabletop", "Floor Standing", "Adjustable"] },
          { label: "Style", options: ["A-Frame", "H-Frame", "Tripod"] },
        ],
      },
    ],
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  for (const category of categories) {
    const product = category.products.find(p => p.slug === slug);
    if (product) return product;
  }
  return undefined;
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find(c => c.slug === slug);
}

export function getAllProducts(): Product[] {
  return categories.flatMap(category => category.products);
}
