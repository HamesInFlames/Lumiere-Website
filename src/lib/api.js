// App/src/lib/api.js
// Embedded product data - works without backend in production

const PRODUCTS = [
  // One Biters
  { id: "1", slug: "one-biter-assortment-box-4-pcs", name: "One Biter Assortment Box (4 pcs)", price: 16, imageUrl: "/Lumiere/4 One Biters.png", category: "onebite", description: "" },
  { id: "2", slug: "one-biter-assortment-box-12-pcs", name: "One Biter Assortment Box (12 pcs)", price: 48, imageUrl: "/Lumiere/12 One Biters.png", category: "onebite", description: "" },
  
  // Cakes
  { id: "3", slug: "blackcurrant-queen-cake", name: "Blackcurrant Queen Cake", price: 50, imageUrl: "/Lumiere/Cake/Blackcurrant Queen Cake.png", category: "cakes", description: "Blackcurrant Diplomat, Blackcurrant Mousse, Hazelnut Crunch. Gluten Free, Dairy Free." },
  { id: "4", slug: "chocohazelnut-cake", name: "ChocoHazelnut Cake", price: 49, imageUrl: "/Lumiere/Cake/ChocoHazelnut Cake.png", category: "cakes", description: "Milk Chocolate Ganache, Milk Chocolate Mousse, Hazelnut Crunch." },
  { id: "5", slug: "cleopatre-cake", name: "Cleopatre Cake", price: 48, imageUrl: "/Lumiere/Cake/Cleopatre Cake.png", category: "cakes", description: "Blackcurrant Compote, Blackcurrant Mousse, Hazelnut Crunch." },
  { id: "6", slug: "coconut-dream-cake", name: "Coconut Dream Cake", price: 44, imageUrl: "/Lumiere/Cake/Coconut Dream Cake.png", category: "cakes", description: "Coconut Diplomat, Coconut Mousse, Toasted Coconut." },
  { id: "7", slug: "lemon-pistachio-meringue-cake", name: "Lemon Pistachio Meringue Cake", price: 50, imageUrl: "/Lumiere/Cake/Lemon Pistachio Meringue Cake.png", category: "cakes", description: "Pistachio Almond Cream, Raspberry Mousse, Almond Short Dough. Gluten Free." },
  { id: "8", slug: "raspberry-pistachio-cake", name: "Raspberry Pistachio Cake", price: 49, imageUrl: "/Lumiere/Cake/Raspberry Pistachio Cake.png", category: "cakes", description: "Pistachio Almond Cream, Raspberry Mousse, Almond Short Dough. Gluten Free." },
  { id: "9", slug: "strawberry-cheesecake", name: "Strawberry Cheesecake", price: 46, imageUrl: "/Lumiere/Cake/Strawberry Cheesecake.png", category: "cakes", description: "Light Cheesecake, Strawberry Mousse, Buttery Crumb. Gluten Free." },
  { id: "10", slug: "tiramisu-cake", name: "Tiramisu Cake", price: 50, imageUrl: "/Lumiere/Cake/Tiramisu Cake.png", category: "cakes", description: "Tiramisu Mousse, Soft Chocolate Sponge, Coffee Syrup, Cappuccino Chantilly." },
  { id: "11", slug: "cream-crumb-cake", name: "Cream & Crumb Cake", price: 44, imageUrl: "/Lumiere/Cake/Cream & Crumb Cake.png", category: "cakes", description: "Light No-Bake Cheesecake, Buttery Crumble, Graham Cracker Crust." },

  // Personal Desserts
  { id: "12", slug: "sweet-pleasure", name: "Sweet Pleasure", price: 11.5, imageUrl: "/Lumiere/Personal Desserts/Sweet Pleasure.png", category: "personal-desserts", description: "Dark Chocolate Mousse, Chocolate Ganache, Chocolate Insert." },
  { id: "13", slug: "tiramichoux", name: "Tiramichoux", price: 10.5, imageUrl: "/Lumiere/Personal Desserts/Tiramichoux.png", category: "personal-desserts", description: "Cocoa Craquelin Choux Pastry, Sabayon Mascarpone Cream, Espresso Biscotti Savoiardi, Cappuccino Chantilly." },
  { id: "14", slug: "raspberry-pistachio-tart", name: "Raspberry Pistachio Tart", price: 10, imageUrl: "/Lumiere/Personal Desserts/Raspberry Pistachio Tart.png", category: "personal-desserts", description: "Pistachio Almond Cream, Raspberry Mousse, Almond Short Dough. Gluten Free." },
  { id: "15", slug: "black-forest", name: "Black Forest", price: 10.5, imageUrl: "/Lumiere/Personal Desserts/Black Forest.png", category: "personal-desserts", description: "Chocolate Sponge, Cherry Compote, Kirsch Cream, Chocolate Chantilly." },
  { id: "16", slug: "dubai-chocolate", name: "Dubai Chocolate", price: 11.5, imageUrl: "/Lumiere/Personal Desserts/Dubai Chocolate.png", category: "personal-desserts", description: "Cocoa Tart Shell, Hazelnut Praliné, Dark Chocolate Ganache, Milk Chocolate Mousse." },
  { id: "17", slug: "rings-of-paris", name: "Rings of Paris", price: 11, imageUrl: "/Lumiere/Personal Desserts/Rings of Paris.png", category: "personal-desserts", description: "Pistachio Almond Cream, Raspberry Compote, Ruby Chocolate Ganache, Cocoa Tart." },
  { id: "18", slug: "lemon-pistachio-meringue", name: "Lemon Pistachio Meringue", price: 11.5, imageUrl: "/Lumiere/Personal Desserts/Lemon Pistachio Meringue.png", category: "personal-desserts", description: "Pistachio Diplomat, Dairy-Free Lemon Cream, Meringue. Gluten Free." },
  { id: "19", slug: "peaches-cream", name: "Peaches & Cream", price: 11, imageUrl: "/Lumiere/Personal Desserts/Peaches & Cream.png", category: "personal-desserts", description: "Passion Fruit Mousse, Coconut Bavaroise, Peach Mousse, Cocoa Tart." },
  { id: "20", slug: "cream-crumb", name: "Cream & Crumb", price: 9.5, imageUrl: "/Lumiere/Personal Desserts/Cream & Crumb.png", category: "personal-desserts", description: "Light No-Bake Cheesecake, Buttery Crumbles, Graham Cracker Crust" },
  { id: "21", slug: "blackcurrant-queen", name: "Blackcurrant Queen", price: 11, imageUrl: "/Lumiere/Personal Desserts/Blackcurrant Queen.png", category: "personal-desserts", description: "Blackcurrant Compote, Blackcurrant Mousse, Hazelnut Crunch. Gluten Free." },
  { id: "22", slug: "coconut-dream", name: "Coconut Dream", price: 10.5, imageUrl: "/Lumiere/Personal Desserts/Coconut Dream.png", category: "personal-desserts", description: "Coconut Diplomat, Coconut Mousse, Toasted Coconut." },
  { id: "23", slug: "personal-heart", name: "Personal Heart", price: 10.5, imageUrl: "/Lumiere/Personal Desserts/Personal Heart.png", category: "personal-desserts", description: "Raspberry Rose Mousse, Lychee Insert" },
  { id: "24", slug: "strawberry-cheesecake-tart", name: "Strawberry Cheesecake Tart", price: 10, imageUrl: "/Lumiere/Personal Desserts/Strawberry Cheesecake Tart.png", category: "personal-desserts", description: "Light Cheesecake, Strawberry Mousse, Buttery Crumble, Almond Short Dough" },
  { id: "25", slug: "cleopatra", name: "Cleopatra", price: 11.5, imageUrl: "/Lumiere/Personal Desserts/Cleopatra.png", category: "personal-desserts", description: "Milk Chocolate Ganache, Milk Chocolate Cream, Hazelnut Wafer" },
  { id: "26", slug: "creme-berry-tart", name: "Creme Berry Tart", price: 9, imageUrl: "/Lumiere/Personal Desserts/Creme Berry Tart.png", category: "personal-desserts", description: "Almond Short Crust, Vanilla Crème Pâtissier, Fresh Ontario Berries" },
  { id: "27", slug: "daisy", name: "Daisy", price: 11.5, imageUrl: "/Lumiere/Personal Desserts/Daisy.png", category: "personal-desserts", description: "Light Vanilla Mousse, Fresh Berries, Almond Crumble." },

  // Pastries
  { id: "28", slug: "almond-croissant", name: "Almond Croissant", price: 6.85, imageUrl: "/Lumiere/Pastry/Almond Criossant.png", category: "pastries", description: "Flaky croissant filled with almond cream and topped with toasted almonds." },
  { id: "29", slug: "double-milk-chocolate-croissant", name: "Double Milk Chocolate Croissant", price: 6.85, imageUrl: "/Lumiere/Pastry/Double Chocolate Criossant.png", category: "pastries", description: "Rich buttery croissant layered with double milk chocolate filling." },
  { id: "30", slug: "butter-croissant", name: "Butter Croissant", price: 4.5, imageUrl: "/Lumiere/Pastry/Butter Croissant.png", category: "pastries", description: "Classic French croissant with a flaky crust and soft buttery interior." },
  { id: "31", slug: "salted-caramel-croissant", name: "Salted Caramel Croissant", price: 6.85, imageUrl: "/Lumiere/Pastry/Salted Caramel Criossant.png", category: "pastries", description: "Golden croissant filled with salted caramel and topped with glaze." },
  { id: "32", slug: "raspberry-cheesecake-croissant", name: "Raspberry Cheesecake Croissant", price: 6.85, imageUrl: "/Lumiere/Pastry/Raspberry Cheesecake Criossant.png", category: "pastries", description: "Filled with raspberry compote and cheesecake cream." },
  { id: "33", slug: "pistachio-croissant", name: "Pistachio Croissant", price: 6.85, imageUrl: "/Lumiere/Pastry/Pistachio Croissant.png", category: "pastries", description: "Rich pistachio cream inside buttery croissant layers." },
  { id: "34", slug: "creme-diplomat-croissant", name: "Creme Diplomat Croissant", price: 6.85, imageUrl: "/Lumiere/Pastry/DIplomat Criossant.png", category: "pastries", description: "Croissant filled with smooth crème diplomat and dusted with icing sugar." },
  { id: "35", slug: "chocolatine", name: "Chocolatine", price: 5.5, imageUrl: "/Lumiere/Pastry/Chocolatin.png", category: "pastries", description: "Classic chocolate-filled pastry with crisp golden layers." },
  { id: "36", slug: "sweet-cheese-danish", name: "Sweet Cheese Danish", price: 5.1, imageUrl: "/Lumiere/Pastry/Cheese Danish.png", category: "pastries", description: "Soft Danish pastry filled with smooth sweet cheese." },
  { id: "37", slug: "cherry-danish", name: "Cherry Danish", price: 5.75, imageUrl: "/Lumiere/Pastry/Fruit Danish.png", category: "pastries", description: "Danish topped with cherry compote and light glaze." },
  { id: "38", slug: "cinnamon-roll", name: "Cinnamon Roll", price: 5.25, imageUrl: "/Lumiere/Pastry/Cinnamon Lemon Roll.png", category: "pastries", description: "Soft roll with buttery cinnamon sugar filling and icing drizzle." },
  { id: "39", slug: "pecan-salted-caramel-danish", name: "Pecan Salted Caramel Danish", price: 6.25, imageUrl: "/Lumiere/Pastry/Pecan Salted Caramel Danish.png", category: "pastries", description: "Sweet Danish pastry topped with pecans and caramel glaze." },
  { id: "40", slug: "coconut-passion-fruit-croissant", name: "Coconut Passion Fruit Croissant", price: 6.85, imageUrl: "/Lumiere/Pastry/Coconut Passion Fruit Croissant.png", category: "pastries", description: "Tropical combination of coconut cream and passion fruit filling." },
  { id: "41", slug: "chocolate-chip-croissant", name: "Chocolate Chip Croissant", price: 6.85, imageUrl: "/Lumiere/Pastry/Chocolate Chip Croissant.png", category: "pastries", description: "Buttery croissant with chocolate chips and light sugar glaze." },

  // Breads
  { id: "42", slug: "wholewheat-seeds-sourdough", name: "Wholewheat & Seeds Sourdough", price: 7.5, imageUrl: "/Lumiere/Breads/Multigrain Sourdough.png", category: "bread", description: "Hearty sourdough made with a blend of grains and seeds for extra flavor." },
  { id: "43", slug: "olive-sourdough", name: "Olive Sourdough", price: 7.5, imageUrl: "/Lumiere/Breads/Olive Sourdough.png", category: "bread", description: "Rustic sourdough loaf enriched with Kalamata olives." },
  { id: "44", slug: "plain-sourdough", name: "Plain Sourdough", price: 7, imageUrl: "/Lumiere/Breads/Plain Sourdough.png", category: "bread", description: "Classic country-style sourdough with a crispy crust and chewy crumb." },
  { id: "45", slug: "rye-walnut-sourdough", name: "Rye & Walnut Sourdough", price: 7, imageUrl: "/Lumiere/Breads/Rye Sourdough.png", category: "bread", description: "Dense rye loaf with earthy flavor, perfect for sandwiches." },
  { id: "46", slug: "sun-dried-tomatoes-garlic-sourdough", name: "Sun-dried Tomatoes & Garlic Sourdough", price: 8.5, imageUrl: "/Lumiere/Breads/Sun-dried tomatoes & Garlic Sourdough.png", category: "bread", description: "Savory sourdough loaf packed with sun-dried tomatoes and roasted garlic." },

  // Bakery Shelf
  { id: "47", slug: "chocolate-crinkles", name: "Chocolate Crinkles", price: 3.5, imageUrl: "/baker_shelf/Chocolate Crinkles.png", category: "bakery-shelf", description: "Fudgy chocolate cookies coated in powdered sugar with a crackled top." },
  { id: "48", slug: "chocolate-nemesis", name: "Chocolate Nemesis", price: 8, imageUrl: "/baker_shelf/Chocolate Nemesis.png", category: "bakery-shelf", description: "Rich, dense flourless chocolate cake with an intense chocolate flavor." },
  { id: "49", slug: "hazelnut-cookies", name: "Hazelnut Cookies", price: 4, imageUrl: "/baker_shelf/Hazelnut Cookies.png", category: "bakery-shelf", description: "Buttery cookies studded with toasted hazelnuts and a hint of vanilla." },
  { id: "50", slug: "pear-breton", name: "Pear Breton", price: 6.5, imageUrl: "/baker_shelf/Pear Breton.png", category: "bakery-shelf", description: "Traditional French butter cake with caramelized pear and almond cream." },
];

/**
 * Normalizes product objects so the frontend always receives consistent field names.
 */
function normalizeProduct(p) {
  return {
    id: p.id,
    slug: p.slug,
    title: p.name,
    price: p.price,
    image: p.imageUrl,
    images: [p.imageUrl],
    category: p.category,
    description: p.description || "",
    ingredients: p.ingredients || "",
    allergens: p.allergens || "",
    serving_size: p.serving_size || "",
  };
}

/**
 * Fetch list of products with optional filtering:
 * - category
 * - q (search)
 */
export async function fetchProducts({ category, q } = {}) {
  // Simulate async for consistency
  await Promise.resolve();
  
  let filtered = [...PRODUCTS];
  
  if (category) {
    filtered = filtered.filter(p => p.category === category);
  }
  
  if (q) {
    const query = q.toLowerCase();
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.description.toLowerCase().includes(query)
    );
  }
  
  return filtered.map(normalizeProduct);
}

/**
 * Fetch a single product using its slug.
 */
export async function fetchProduct(slug) {
  await Promise.resolve();
  
  const product = PRODUCTS.find(p => p.slug === slug);
  
  if (!product) {
    throw new Error("Product not found");
  }
  
  return normalizeProduct(product);
}
