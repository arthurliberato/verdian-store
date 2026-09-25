// Verdian product catalog — static data.
//
// Every product record is ONE SKU: a model in a single colorway (e.g. "Arco"
// in "Chalk"). Models are declared once below with their colorways, then
// expanded into the flat `products` array the store uses.

export type Line = "Classic" | "Performance" | "Street";
export type Category = "footwear" | "apparel" | "accessories";

/** Drawing used for the placeholder image (see app/images/products). */
export type Silhouette =
  | "low"
  | "chunky"
  | "slipon"
  | "court"
  | "boot"
  | "runner"
  | "trail"
  | "trainer"
  | "racer"
  | "tee"
  | "hoodie"
  | "sweat"
  | "jacket"
  | "pant"
  | "shorts"
  | "socks"
  | "cap"
  | "tote"
  | "backpack"
  | "crossbody"
  | "kit"
  | "blanket";

export type Product = {
  id: string;
  slug: string;
  name: string;
  model: string;
  line: Line;
  category: Category;
  subcategory: string;
  colorway: string;
  price: number;
  sizes: string[];
  description: string;
  /** Placeholder image URL. Swap for real photography later. */
  image: string;
  // Presentation helpers (not part of the analytics payload)
  swatch: { primary: string; secondary: string };
  silhouette: Silhouette;
  tag?: "New" | "Limited";
};

type Colorway = {
  name: string;
  primary: string;
  secondary: string;
  note: string; // one sentence describing this colorway
  price?: number; // overrides the model price (e.g. limited colorways)
  tag?: "New" | "Limited";
};

type Model = {
  code: string;
  model: string;
  line: Line;
  category: Category;
  subcategory: string;
  silhouette: Silhouette;
  price: number;
  sizes: string[];
  copy: string; // 1–2 sentences shared by every colorway
  colorways: Colorway[];
};

const SHOE = ["6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12", "13"];
const APPAREL = ["XS", "S", "M", "L", "XL", "XXL"];
const SOCKS = ["S", "M", "L"];
const ONE = ["One size"];

// ─── Footwear ────────────────────────────────────────────────────────────

const footwear: Model[] = [
  // Classic
  {
    code: "ARC",
    model: "Arco",
    line: "Classic",
    category: "footwear",
    subcategory: "Sneakers",
    silhouette: "low",
    price: 140,
    sizes: SHOE,
    copy: "Our flagship. A low-profile sneaker cut from full-grain leather, with a stitched cupsole and nothing that doesn't need to be there.",
    colorways: [
      { name: "Chalk", primary: "#f1eee7", secondary: "#d9d3c5", note: "Tonal off-white leather that wears in, not out." },
      { name: "Chalk Forest", primary: "#f1eee7", secondary: "#1f4d3a", note: "Off-white leather with a deep forest heel tab and side stripe." },
      { name: "Carbon", primary: "#232323", secondary: "#3a3a3a", note: "Tonal black leather on a black sole, for the days that call for it." },
      { name: "Bone Rust", primary: "#e9e1d0", secondary: "#a4502c", note: "Warm bone leather with rust suede accents and a natural gum sole." },
      { name: "Slate", primary: "#6f7780", secondary: "#e6e4de", note: "Cool grey nubuck finished with a cream midsole.", tag: "New" },
    ],
  },
  {
    code: "SND",
    model: "Senda",
    line: "Classic",
    category: "footwear",
    subcategory: "Sneakers",
    silhouette: "chunky",
    price: 150,
    sizes: SHOE,
    copy: "Senda takes the Arco's clean lines and adds weight: suede panels, a padded collar, and a slightly thicker sole for all-day comfort.",
    colorways: [
      { name: "Sand", primary: "#d6c3a0", secondary: "#f2ece0", note: "Sand suede overlays on a cream mesh base." },
      { name: "Forest", primary: "#1f4d3a", secondary: "#e9e1d0", note: "Deep forest suede with bone laces and midsole." },
      { name: "Cream Navy", primary: "#efe6d2", secondary: "#24304c", note: "Cream leather and navy suede, a nod to our 1980s archive." },
      { name: "Stone", primary: "#b9b3a6", secondary: "#8b8579", note: "Two tones of stone suede for an easy, understated pair." },
    ],
  },
  {
    code: "CLM",
    model: "Calma",
    line: "Classic",
    category: "footwear",
    subcategory: "Slip-ons",
    silhouette: "slipon",
    price: 110,
    sizes: SHOE,
    copy: "A laceless slip-on built on a soft knit collar and a cushioned footbed. Step in, step out, and get on with your day.",
    colorways: [
      { name: "Oat", primary: "#d9ccb4", secondary: "#f4efe6", note: "Oatmeal canvas on a natural rubber sole." },
      { name: "Ink", primary: "#1e2433", secondary: "#e8e6e1", note: "Deep ink canvas with a contrast white sole." },
      { name: "Moss", primary: "#5f6b45", secondary: "#efe9dc", note: "Washed moss canvas that looks better the more you wear it." },
    ],
  },
  {
    code: "PLT",
    model: "Plata",
    line: "Classic",
    category: "footwear",
    subcategory: "Court",
    silhouette: "court",
    price: 130,
    sizes: SHOE,
    copy: "A court shoe with crisp lines and a flat, vulcanized sole. Smooth leather, perforated toe, and a heel counter that holds its shape.",
    colorways: [
      { name: "White Forest", primary: "#f7f6f2", secondary: "#1f4d3a", note: "Bright white leather with a forest green heel." },
      { name: "White Silver", primary: "#f7f6f2", secondary: "#b8bcc2", note: "White leather with a subtle metallic silver heel tab." },
      { name: "Bone", primary: "#e9e1d0", secondary: "#cfc4ad", note: "Tonal bone leather with a vintage-yellowed sole." },
    ],
  },
  {
    code: "RAZ",
    model: "Raíz",
    line: "Classic",
    category: "footwear",
    subcategory: "Boots",
    silhouette: "boot",
    price: 190,
    sizes: SHOE,
    copy: "Raíz brings the Classic line into colder months. A water-resistant suede boot on a lugged rubber sole, lined for warmth.",
    colorways: [
      { name: "Tobacco", primary: "#7a4f2c", secondary: "#3c2a1c", note: "Rich tobacco suede with a dark brown sole." },
      { name: "Carbon", primary: "#262626", secondary: "#141414", note: "Black suede on a black lugged sole." },
      { name: "Wheat", primary: "#c9a66b", secondary: "#e8dcc5", note: "Classic wheat nubuck with a cream welt." },
    ],
  },

  // Performance
  {
    code: "PUL",
    model: "Pulso",
    line: "Performance",
    category: "footwear",
    subcategory: "Running",
    silhouette: "runner",
    price: 160,
    sizes: SHOE,
    copy: "Our hero running shoe. A lightweight technical mesh upper over a responsive foam midsole, tuned for daily miles at any pace.",
    colorways: [
      { name: "Glacier", primary: "#dfe8ec", secondary: "#2f6fbd", note: "Icy white mesh with cobalt details." },
      { name: "Carbon Volt", primary: "#1c1c1c", secondary: "#d4f24a", note: "Black mesh with high-visibility volt accents." },
      { name: "Ember", primary: "#e0552f", secondary: "#f4ece4", note: "Burnt orange mesh on a white midsole." },
      { name: "Forest Mint", primary: "#1f4d3a", secondary: "#9fe0c0", note: "Forest green mesh with a mint heel counter." },
      { name: "Fog", primary: "#c8cacb", secondary: "#8a8f94", note: "Soft grey mesh that works on the run and off it.", tag: "New" },
    ],
  },
  {
    code: "CIM",
    model: "Cima",
    line: "Performance",
    category: "footwear",
    subcategory: "Trail",
    silhouette: "trail",
    price: 180,
    sizes: SHOE,
    copy: "Cima is built for rough ground. A rugged outsole with 5mm lugs, a rock plate underfoot, and a reinforced toe cap.",
    colorways: [
      { name: "Moss Rust", primary: "#4f5b3a", secondary: "#b5562a", note: "Moss green upper with rust overlays." },
      { name: "Basalt", primary: "#3d4046", secondary: "#9aa0a6", note: "Dark basalt grey with ash accents." },
      { name: "Clay", primary: "#b77a55", secondary: "#2d2d2d", note: "Warm clay upper on a black outsole." },
    ],
  },
  {
    code: "IMP",
    model: "Impulso",
    line: "Performance",
    category: "footwear",
    subcategory: "Training",
    silhouette: "trainer",
    price: 130,
    sizes: SHOE,
    copy: "A training shoe with a flat, stable base for lifting and lateral work. Wraparound support keeps your foot locked in.",
    colorways: [
      { name: "Carbon", primary: "#1d1d1d", secondary: "#4a4a4a", note: "All-black for the gym floor." },
      { name: "Chalk", primary: "#efede8", secondary: "#1f4d3a", note: "Chalk white with a forest green heel." },
      { name: "Cobalt", primary: "#2f5fb3", secondary: "#f0f0f0", note: "Cobalt blue upper on a white base." },
    ],
  },
  {
    code: "VNT",
    model: "Viento",
    line: "Performance",
    category: "footwear",
    subcategory: "Racing",
    silhouette: "racer",
    price: 240,
    sizes: SHOE,
    copy: "Viento is our ultralight racing flat. A carbon-infused plate and a paper-thin upper, made for race day and nothing else.",
    colorways: [
      { name: "Signal", primary: "#ff5a1f", secondary: "#1a1a1a", note: "Signal orange, so you're easy to find at the finish line." },
      { name: "Ghost", primary: "#f2f2f0", secondary: "#c7ff3d", note: "Translucent white with an electric lime plate." },
      { name: "Carbon", primary: "#1a1a1a", secondary: "#ff5a1f", note: "Black with a flash of signal orange." },
    ],
  },
  {
    code: "CMP",
    model: "Campo",
    line: "Performance",
    category: "footwear",
    subcategory: "Court Sport",
    silhouette: "court",
    price: 150,
    sizes: SHOE,
    copy: "Campo crosses tennis and padel. A herringbone outsole grips any court, and a reinforced toe drag area handles quick stops.",
    colorways: [
      { name: "White Clay", primary: "#f7f6f2", secondary: "#c0643a", note: "White leather with clay-court accents." },
      { name: "Navy", primary: "#24304c", secondary: "#f7f6f2", note: "Navy mesh with a white sole." },
      { name: "Lime", primary: "#e7f5a4", secondary: "#2d2d2d", note: "Pale lime upper, a tennis-ball nod." },
    ],
  },

  // Street
  {
    code: "AMU",
    model: "Arco Muta",
    line: "Street",
    category: "footwear",
    subcategory: "Reinterpretations",
    silhouette: "chunky",
    price: 190,
    sizes: SHOE,
    copy: "The Arco, mutated. Our flagship silhouette rebuilt on a chunky stacked sole with mixed leather, mesh, and suede.",
    colorways: [
      { name: "Bone Carbon", primary: "#e9e1d0", secondary: "#1d1d1d", note: "Bone leather over a carbon black stacked sole." },
      { name: "Rust", primary: "#a4502c", secondary: "#efe6d2", note: "Rust suede with a cream sole." },
      { name: "Fog", primary: "#c8cacb", secondary: "#6f7780", note: "Layered greys from fog to slate." },
      { name: "Acid", primary: "#c7ff3d", secondary: "#1d1d1d", note: "Acid lime mesh under black leather overlays. Limited run.", price: 220, tag: "Limited" },
    ],
  },
  {
    code: "SNL",
    model: "Senda Low",
    line: "Street",
    category: "footwear",
    subcategory: "Reinterpretations",
    silhouette: "low",
    price: 160,
    sizes: SHOE,
    copy: "Senda, deconstructed. A lower cut with raw edges, exposed foam, and hand-finished stitching. No two pairs are exactly alike.",
    colorways: [
      { name: "Raw Canvas", primary: "#e3d8c2", secondary: "#8a7a5c", note: "Undyed canvas with raw, unfinished edges." },
      { name: "Ash", primary: "#9a9a96", secondary: "#e8e6e1", note: "Ash grey suede with exposed cream foam." },
      { name: "Oxblood", primary: "#5e1f25", secondary: "#e3d8c2", note: "Deep oxblood suede with a raw canvas tongue." },
    ],
  },
  {
    code: "BRU",
    model: "Bruma",
    line: "Street",
    category: "footwear",
    subcategory: "Originals",
    silhouette: "chunky",
    price: 200,
    sizes: SHOE,
    copy: "Bruma is an original Verdian silhouette, designed from scratch for the street. A sculpted midsole and a layered upper built to carry collaborations.",
    colorways: [
      { name: "Mist", primary: "#d6dad8", secondary: "#9aa39f", note: "Pale mist mesh with a sculpted grey sole." },
      { name: "Obsidian", primary: "#161616", secondary: "#3c3c3c", note: "Glossy black overlays on matte black mesh." },
      { name: "Atelier Sand", primary: "#d8c7a3", secondary: "#1f4d3a", note: "Our collaboration with Atelier Norte: premium sand suede and a co-branded heel. One-time release.", price: 260, tag: "Limited" },
    ],
  },
  {
    code: "FSC",
    model: "Fosco",
    line: "Street",
    category: "footwear",
    subcategory: "Originals",
    silhouette: "chunky",
    price: 180,
    sizes: SHOE,
    copy: "The dad shoe, done on purpose. Fosco stacks layers of mesh and leather on an oversized midsole. Maximalist, and comfortable with it.",
    colorways: [
      { name: "Cream Grey", primary: "#efe6d2", secondary: "#8b8f94", note: "Cream leather with grey mesh, straight out of 1998." },
      { name: "Forest Bone", primary: "#1f4d3a", secondary: "#e9e1d0", note: "Forest green layers on a bone midsole." },
      { name: "Triple Carbon", primary: "#1d1d1d", secondary: "#2c2c2c", note: "Every layer in black." },
    ],
  },
  {
    code: "ECO",
    model: "Eco",
    line: "Street",
    category: "footwear",
    subcategory: "Eco Capsule",
    silhouette: "low",
    price: 150,
    sizes: SHOE,
    copy: "Our sustainable capsule. The upper is made from recycled polyester and the sole from natural rubber, finished in undyed or plant-dyed colorways.",
    colorways: [
      { name: "Undyed", primary: "#ece6d9", secondary: "#c9bfa9", note: "Left completely undyed, showing the natural fiber." },
      { name: "Clay", primary: "#c08a6a", secondary: "#ece6d9", note: "Dyed with natural clay pigments." },
      { name: "Lichen", primary: "#8f9a72", secondary: "#ece6d9", note: "A soft green from plant-based dye." },
      { name: "Indigo", primary: "#34466e", secondary: "#ece6d9", note: "Plant-derived indigo that fades beautifully over time.", tag: "New" },
    ],
  },
];

// ─── Apparel ─────────────────────────────────────────────────────────────

const apparel: Model[] = [
  // Basics (Classic)
  {
    code: "TEE",
    model: "Essential Tee",
    line: "Classic",
    category: "apparel",
    subcategory: "Tees",
    silhouette: "tee",
    price: 60,
    sizes: APPAREL,
    copy: "A midweight organic cotton tee with a clean crew neck and a small embroidered crest.",
    colorways: [
      { name: "White", primary: "#f7f6f2", secondary: "#1f4d3a", note: "Crisp white, the one you'll reach for first." },
      { name: "Carbon", primary: "#232323", secondary: "#e9e1d0", note: "Washed black that stays black." },
      { name: "Forest", primary: "#1f4d3a", secondary: "#e9e1d0", note: "Deep forest with a bone crest." },
    ],
  },
  {
    code: "PKT",
    model: "Heavyweight Pocket Tee",
    line: "Classic",
    category: "apparel",
    subcategory: "Tees",
    silhouette: "tee",
    price: 70,
    sizes: APPAREL,
    copy: "Heavyweight 260gsm cotton with a boxy fit and a chest pocket. Built to hold its shape wash after wash.",
    colorways: [
      { name: "Bone", primary: "#e9e1d0", secondary: "#8b8579", note: "Warm bone with a tonal pocket." },
      { name: "Slate", primary: "#6f7780", secondary: "#4d545c", note: "Cool slate grey." },
    ],
  },
  {
    code: "HOD",
    model: "Loopback Hoodie",
    line: "Classic",
    category: "apparel",
    subcategory: "Hoodies & Sweats",
    silhouette: "hoodie",
    price: 120,
    sizes: APPAREL,
    copy: "A heavyweight loopback cotton hoodie with a double-layer hood and ribbed cuffs. Soft inside, structured outside.",
    colorways: [
      { name: "Heather Grey", primary: "#b3b3b0", secondary: "#1f4d3a", note: "Classic heather grey with a forest crest." },
      { name: "Forest", primary: "#1f4d3a", secondary: "#e9e1d0", note: "Deep forest with bone drawcords." },
      { name: "Carbon", primary: "#232323", secondary: "#6f7780", note: "Washed black with tonal details." },
    ],
  },
  {
    code: "CRW",
    model: "Crewneck Sweatshirt",
    line: "Classic",
    category: "apparel",
    subcategory: "Hoodies & Sweats",
    silhouette: "sweat",
    price: 110,
    sizes: APPAREL,
    copy: "A relaxed crewneck in brushed-back fleece, finished with a V-insert at the neck.",
    colorways: [
      { name: "Oat", primary: "#d9ccb4", secondary: "#8b7d63", note: "Soft oatmeal marl." },
      { name: "Navy", primary: "#24304c", secondary: "#e9e1d0", note: "Deep navy with a bone crest." },
    ],
  },
  {
    code: "TRP",
    model: "Track Pant",
    line: "Classic",
    category: "apparel",
    subcategory: "Pants",
    silhouette: "pant",
    price: 110,
    sizes: APPAREL,
    copy: "A heritage track pant in brushed tricot with side stripes and zip ankles. Relaxed through the leg, tapered at the hem.",
    colorways: [
      { name: "Carbon", primary: "#232323", secondary: "#f1eee7", note: "Black with chalk side stripes." },
      { name: "Forest", primary: "#1f4d3a", secondary: "#f1eee7", note: "Forest with chalk side stripes." },
      { name: "Navy", primary: "#24304c", secondary: "#c0643a", note: "Navy with rust side stripes." },
    ],
  },
  {
    code: "TRJ",
    model: "Track Jacket",
    line: "Classic",
    category: "apparel",
    subcategory: "Jackets",
    silhouette: "jacket",
    price: 140,
    sizes: APPAREL,
    copy: "The matching top to our Track Pant. Brushed tricot, a stand collar, and contrast sleeve stripes.",
    colorways: [
      { name: "Forest Cream", primary: "#1f4d3a", secondary: "#efe6d2", note: "Forest body with cream stripes." },
      { name: "Carbon", primary: "#232323", secondary: "#f1eee7", note: "Black body with chalk stripes." },
    ],
  },

  // Performance
  {
    code: "PRJ",
    model: "Pulso Running Jacket",
    line: "Performance",
    category: "apparel",
    subcategory: "Jackets",
    silhouette: "jacket",
    price: 180,
    sizes: APPAREL,
    copy: "A packable, water-resistant running shell that weighs next to nothing. Laser-cut vents and reflective details for early and late miles.",
    colorways: [
      { name: "Volt", primary: "#d4f24a", secondary: "#1c1c1c", note: "High-visibility volt." },
      { name: "Carbon", primary: "#1c1c1c", secondary: "#d4f24a", note: "Black with volt reflective trims." },
    ],
  },
  {
    code: "PRT",
    model: "Pulso Run Tee",
    line: "Performance",
    category: "apparel",
    subcategory: "Tees",
    silhouette: "tee",
    price: 70,
    sizes: APPAREL,
    copy: "An ultralight, sweat-wicking running tee with flatlock seams that won't rub on long runs.",
    colorways: [
      { name: "Glacier", primary: "#dfe8ec", secondary: "#2f6fbd", note: "Icy white with a cobalt logo." },
      { name: "Carbon", primary: "#1c1c1c", secondary: "#d4f24a", note: "Black with a volt logo." },
    ],
  },
  {
    code: "TSH",
    model: "Training Short 7\"",
    line: "Performance",
    category: "apparel",
    subcategory: "Shorts",
    silhouette: "shorts",
    price: 75,
    sizes: APPAREL,
    copy: "A 7-inch training short in four-way stretch fabric with a zip pocket and a built-in liner.",
    colorways: [
      { name: "Carbon", primary: "#1d1d1d", secondary: "#4a4a4a", note: "Everyday black." },
      { name: "Slate", primary: "#6f7780", secondary: "#1d1d1d", note: "Slate grey with black trims." },
      { name: "Forest", primary: "#1f4d3a", secondary: "#9fe0c0", note: "Forest with a mint waistband." },
    ],
  },
  {
    code: "CSJ",
    model: "Cima Shell Jacket",
    line: "Performance",
    category: "apparel",
    subcategory: "Jackets",
    silhouette: "jacket",
    price: 220,
    sizes: APPAREL,
    copy: "A fully waterproof three-layer shell for trail running in bad weather. Taped seams, an adjustable hood, and a stowable design.",
    colorways: [
      { name: "Moss", primary: "#4f5b3a", secondary: "#b5562a", note: "Moss green with rust zip pulls." },
      { name: "Rust", primary: "#a4502c", secondary: "#2d2d2d", note: "Rust with black taping." },
    ],
  },
  {
    code: "ITT",
    model: "Impulso Training Tight",
    line: "Performance",
    category: "apparel",
    subcategory: "Pants",
    silhouette: "pant",
    price: 90,
    sizes: APPAREL,
    copy: "A compressive training tight with a high, secure waistband and a side phone pocket.",
    colorways: [
      { name: "Carbon", primary: "#1d1d1d", secondary: "#3a3a3a", note: "Black on black." },
      { name: "Navy", primary: "#24304c", secondary: "#2f6fbd", note: "Navy with cobalt details." },
    ],
  },
  {
    code: "HZM",
    model: "Half-Zip Midlayer",
    line: "Performance",
    category: "apparel",
    subcategory: "Hoodies & Sweats",
    silhouette: "sweat",
    price: 140,
    sizes: APPAREL,
    copy: "A grid-fleece half-zip that traps warmth without the bulk. The layer you'll wear from warm-up to cool-down.",
    colorways: [
      { name: "Slate", primary: "#6f7780", secondary: "#d4f24a", note: "Slate grey with a volt zip." },
      { name: "Forest", primary: "#1f4d3a", secondary: "#9fe0c0", note: "Forest with a mint zip." },
    ],
  },

  // Street capsule
  {
    code: "BRH",
    model: "Bruma Oversized Hoodie",
    line: "Street",
    category: "apparel",
    subcategory: "Hoodies & Sweats",
    silhouette: "hoodie",
    price: 190,
    sizes: APPAREL,
    copy: "Cut to match the Bruma sneaker's layered shape. A 500gsm oversized hoodie with dropped shoulders and a puff-print back graphic.",
    colorways: [
      { name: "Mist", primary: "#d6dad8", secondary: "#9aa39f", note: "Pale mist grey." },
      { name: "Obsidian", primary: "#161616", secondary: "#3c3c3c", note: "Deep black with a tonal graphic." },
    ],
  },
  {
    code: "FNJ",
    model: "Fosco Nylon Jacket",
    line: "Street",
    category: "apparel",
    subcategory: "Jackets",
    silhouette: "jacket",
    price: 260,
    sizes: APPAREL,
    copy: "Late-90s color blocking on a crinkle nylon shell, in the same palette as the Fosco sneaker. Mesh-lined with a packaway hood.",
    colorways: [
      { name: "Bone Rust", primary: "#e9e1d0", secondary: "#a4502c", note: "Bone and rust panels.", tag: "Limited" },
      { name: "Carbon", primary: "#1d1d1d", secondary: "#8b8f94", note: "Black with grey panels." },
    ],
  },
  {
    code: "MCP",
    model: "Muta Cargo Pant",
    line: "Street",
    category: "apparel",
    subcategory: "Pants",
    silhouette: "pant",
    price: 180,
    sizes: APPAREL,
    copy: "A wide-leg cargo in heavy cotton ripstop, with articulated knees and mixed-material pockets that echo the Arco Muta.",
    colorways: [
      { name: "Olive", primary: "#556045", secondary: "#232323", note: "Olive ripstop with black hardware." },
      { name: "Carbon", primary: "#1d1d1d", secondary: "#c7ff3d", note: "Black with acid lime pulls." },
    ],
  },
  {
    code: "ERT",
    model: "Eco Recycled Tee",
    line: "Street",
    category: "apparel",
    subcategory: "Tees",
    silhouette: "tee",
    price: 65,
    sizes: APPAREL,
    copy: "Part of the Eco capsule. Made from recycled cotton and polyester, with a boxy fit and a water-based print.",
    colorways: [
      { name: "Undyed", primary: "#ece6d9", secondary: "#8f9a72", note: "Left undyed, showing the natural fiber." },
      { name: "Clay", primary: "#c08a6a", secondary: "#ece6d9", note: "Dyed with natural clay pigments." },
    ],
  },
  {
    code: "SGT",
    model: "Senda Low Graphic Tee",
    line: "Street",
    category: "apparel",
    subcategory: "Tees",
    silhouette: "tee",
    price: 70,
    sizes: APPAREL,
    copy: "A heavyweight tee with a raw-edge hem and a distressed Senda Low graphic on the back.",
    colorways: [
      { name: "Bone", primary: "#e9e1d0", secondary: "#5e1f25", note: "Bone with an oxblood graphic." },
      { name: "Carbon", primary: "#232323", secondary: "#e3d8c2", note: "Black with a canvas-colored graphic." },
    ],
  },
];

// ─── Accessories ─────────────────────────────────────────────────────────

const accessories: Model[] = [
  {
    code: "SCK",
    model: "Crew Sock 3-Pack",
    line: "Classic",
    category: "accessories",
    subcategory: "Socks",
    silhouette: "socks",
    price: 60,
    sizes: SOCKS,
    copy: "Three pairs of combed cotton crew socks with a cushioned sole and a ribbed cuff that stays up.",
    colorways: [
      { name: "White", primary: "#f7f6f2", secondary: "#1f4d3a", note: "Three pairs of white with a forest stripe." },
      { name: "Carbon", primary: "#232323", secondary: "#6f7780", note: "Three pairs of black." },
      { name: "Mixed", primary: "#d9ccb4", secondary: "#1f4d3a", note: "One oat, one forest, one bone." },
    ],
  },
  {
    code: "RSK",
    model: "Pulso Run Sock 3-Pack",
    line: "Performance",
    category: "accessories",
    subcategory: "Socks",
    silhouette: "socks",
    price: 60,
    sizes: SOCKS,
    copy: "Three pairs of lightweight, anatomical running socks with arch compression and mesh ventilation.",
    colorways: [{ name: "Carbon Volt", primary: "#1c1c1c", secondary: "#d4f24a", note: "Black with a volt toe." }],
  },
  {
    code: "CAP",
    model: "Six-Panel Cap",
    line: "Classic",
    category: "accessories",
    subcategory: "Caps",
    silhouette: "cap",
    price: 60,
    sizes: ONE,
    copy: "A washed cotton twill cap with an embroidered crest and a brass buckle strap.",
    colorways: [
      { name: "Forest", primary: "#1f4d3a", secondary: "#e9e1d0", note: "Forest with a bone crest." },
      { name: "Bone", primary: "#e9e1d0", secondary: "#1f4d3a", note: "Bone with a forest crest." },
    ],
  },
  {
    code: "RCP",
    model: "Pulso Running Cap",
    line: "Performance",
    category: "accessories",
    subcategory: "Caps",
    silhouette: "cap",
    price: 65,
    sizes: ONE,
    copy: "An ultralight, quick-dry running cap with a perforated crown and a soft, packable brim.",
    colorways: [{ name: "Carbon", primary: "#1c1c1c", secondary: "#d4f24a", note: "Black with a reflective volt logo." }],
  },
  {
    code: "TOT",
    model: "Canvas Tote",
    line: "Classic",
    category: "accessories",
    subcategory: "Bags",
    silhouette: "tote",
    price: 80,
    sizes: ONE,
    copy: "A heavyweight organic canvas tote with leather handles and an inside zip pocket. Big enough for a pair of shoes.",
    colorways: [
      { name: "Natural", primary: "#e3d8c2", secondary: "#7a4f2c", note: "Natural canvas with tan leather handles." },
      { name: "Forest", primary: "#1f4d3a", secondary: "#7a4f2c", note: "Forest canvas with tan leather handles." },
    ],
  },
  {
    code: "BPK",
    model: "Everyday Backpack",
    line: "Classic",
    category: "accessories",
    subcategory: "Bags",
    silhouette: "backpack",
    price: 140,
    sizes: ONE,
    copy: "A 22-liter backpack in water-resistant recycled nylon, with a padded laptop sleeve and a separate shoe compartment.",
    colorways: [
      { name: "Carbon", primary: "#1d1d1d", secondary: "#3a3a3a", note: "Black with tonal hardware." },
      { name: "Forest", primary: "#1f4d3a", secondary: "#e9e1d0", note: "Forest with bone webbing." },
    ],
  },
  {
    code: "XBD",
    model: "Bruma Crossbody Bag",
    line: "Street",
    category: "accessories",
    subcategory: "Bags",
    silhouette: "crossbody",
    price: 90,
    sizes: ONE,
    copy: "A compact crossbody in layered nylon and mesh, designed alongside the Bruma sneaker.",
    colorways: [{ name: "Obsidian", primary: "#161616", secondary: "#9aa39f", note: "Black with mist-grey webbing." }],
  },
  {
    code: "KIT",
    model: "Sneaker Care Kit",
    line: "Classic",
    category: "accessories",
    subcategory: "Lifestyle",
    silhouette: "kit",
    price: 60,
    sizes: ONE,
    copy: "Everything you need to keep leather and suede looking right: plant-based cleaner, a horsehair brush, a suede eraser, and a microfiber cloth.",
    colorways: [{ name: "Natural", primary: "#e3d8c2", secondary: "#1f4d3a", note: "Packed in a recycled cardboard box." }],
  },
  {
    code: "BLK",
    model: "Wool Throw Blanket",
    line: "Classic",
    category: "accessories",
    subcategory: "Lifestyle",
    silhouette: "blanket",
    price: 90,
    sizes: ONE,
    copy: "A recycled wool throw, woven in Portugal, with a jacquard Verdian crest and fringed edges.",
    colorways: [{ name: "Forest", primary: "#1f4d3a", secondary: "#e9e1d0", note: "Forest with a bone crest." }],
  },
];

// ─── Expansion ───────────────────────────────────────────────────────────

function slugify(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // Raíz → Raiz
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function colorCode(name: string): string {
  return slugify(name).toUpperCase();
}

function expand(models: Model[]): Product[] {
  return models.flatMap((m) =>
    m.colorways.map((c) => {
      const id = `VRD-${m.code}-${colorCode(c.name)}`;
      return {
        id,
        slug: slugify(`${m.model} ${c.name}`),
        name: `${m.model} ${c.name}`,
        model: m.model,
        line: m.line,
        category: m.category,
        subcategory: m.subcategory,
        colorway: c.name,
        price: c.price ?? m.price,
        sizes: m.sizes,
        description: `${m.copy} ${c.note}`,
        image: `/images/products/${id}`,
        swatch: { primary: c.primary, secondary: c.secondary },
        silhouette: m.silhouette,
        ...(c.tag ? { tag: c.tag } : {}),
      };
    }),
  );
}

export const products: Product[] = [...expand(footwear), ...expand(apparel), ...expand(accessories)];

export const lines: { name: Line; slug: string; tagline: string; description: string }[] = [
  {
    name: "Classic",
    slug: "classic",
    tagline: "Timeless silhouettes",
    description: "Heritage shapes in full-grain leather and suede, made to be worn every day and to last for years.",
  },
  {
    name: "Performance",
    slug: "performance",
    tagline: "Built to move",
    description: "Technical footwear and apparel for running, training, trail and court.",
  },
  {
    name: "Street",
    slug: "street",
    tagline: "New shapes, limited drops",
    description: "Reinterpretations of our classics, original silhouettes, and small-batch releases.",
  },
];

export const categoryLabels: Record<Category, string> = {
  footwear: "Footwear",
  apparel: "Apparel",
  accessories: "Accessories",
};

export function getLine(slug: string) {
  return lines.find((l) => l.slug === slug);
}

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getProductById(id: string) {
  return products.find((p) => p.id === id);
}

/** Every colorway of the same model, for the color selector. */
export function siblingColorways(product: Product) {
  return products.filter((p) => p.model === product.model);
}

export function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}
