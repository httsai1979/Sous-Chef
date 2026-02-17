export const AISLES = [
    'Produce',
    'Meat & Fish',
    'Dairy',
    'Bakery',
    'Pantry',
    'Frozen',
    'PantryCheck'
];

// Energy costs in UK (approx 29p/kWh)
export const ENERGY_RATES = {
    oven: 2.1, // kWh per hour
    air_fryer: 1.2, // kWh per hour
    hob: 1.5, // kWh per hour
    microwave: 0.8 // kWh per hour
};

export const SNACKS = [
    { id: 's1', name: 'Greek Yogurt & Honey Pots', aisle: 'Dairy', cost: 0.45, energy: 0 },
    { id: 's2', name: 'Carrot & Cucumber Ribbons', aisle: 'Produce', cost: 0.20, energy: 0 },
    { id: 's3', name: 'Air-Fried Apple Chips', aisle: 'Produce', cost: 0.30, energy: 0.2 },
    { id: 's4', name: 'Boiled Egg Protein Pack', aisle: 'Dairy', cost: 0.25, energy: 0.1 }
];

export const LUNCHBOXES = [
    { id: 'lb1', name: 'Leftover Chicken Wrap', uses: 'sun-roast', accessories: 'Apple, String Cheese' },
    { id: 'lb2', name: 'Pasta Salad Box', uses: 'mon-pasta', accessories: 'Cucumber, Yogurt' },
    { id: 'lb3', name: 'Mini Chili & Rice', uses: 'tue-chili', accessories: 'Orange, Oat Bar' }
];

export const RECIPES = [
    // --- WEEK 1: THE CHICKEN CHAIN ---
    {
        id: 'w1-d1', day: 'Sunday', mealType: 'dinner',
        title: 'Sunday Ritual Roast Chicken',
        kidHack: "The 'Cloud' Mashed Potatoes (Hidden Cauliflower) - Season with zero salt.",
        adultUpgrade: "Top with Fresh Rosemary & Black Pepper. Add a reduction of pan juices.",
        prepAlert: "Save the carcass! Tomorrow's lunch boxes depend on it.",
        chainId: 'chicken-chain', stepInChain: 1,
        energyType: 'air_fryer', cookingTime: 53, // mins
        costPerAdult: 2.5, costPerKid: 1.5,
        rationale: 'Primary protein source. Buying a whole 1.7kg bird saves 40% vs buying breast fillets.',
        image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=400&q=80',
        ingredients: [
            { name: 'Whole Chicken', baseQty: 1, unit: 'pc', aisle: 'Meat & Fish' },
            { name: 'Potatoes', baseQty: 250, unit: 'g', aisle: 'Produce' },
            { name: 'Carrots', baseQty: 100, unit: 'g', aisle: 'Produce' },
            { name: 'Cauliflower', baseQty: 50, unit: 'g', aisle: 'Produce' }
        ],
        steps: [
            "Prep: Mix potato and cauliflower for the mash (The Kid Hack).",
            "Cook: Chicken at 180°C in Air Fryer for 53 mins.",
            "Divide: Set aside portions for adults, keep kids' portions low-salt.",
            "Upgrade: Drizzle adult portions with rosemary butter."
        ]
    },
    {
        id: 'w1-d2', day: 'Monday', mealType: 'dinner',
        title: 'Hidden Veg Chicken Pasta',
        kidHack: "The 'Invisibles' Sauce - Veggies blended into tomato sauce.",
        adultUpgrade: "Stir in Balsamic Glaze and Chili Flakes for a deep umami hit.",
        chainId: 'chicken-chain', stepInChain: 2,
        energyType: 'hob', cookingTime: 15,
        costPerAdult: 1.8, costPerKid: 1.0,
        rationale: 'utilizes 250g of Sunday cold-meat. Prep time reduced by 70%.',
        image: 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?auto=format&fit=crop&w=400&q=80',
        ingredients: [
            { name: 'Pasta', baseQty: 80, unit: 'g', aisle: 'Pantry' },
            { name: 'Chopped Tomatoes', baseQty: 0.5, unit: 'can', aisle: 'Pantry' },
            { name: 'Celery', baseQty: 30, unit: 'g', aisle: 'Produce' },
            { name: 'Onion', baseQty: 0.25, unit: 'pc', aisle: 'Produce' }
        ],
        steps: [
            "Boil pasta according to pack instructions.",
            "Blend celery and onion into tomato sauce (Kid Hack).",
            "Mix in shredded leftover chicken (50g per head).",
            "Split: Adult bowls get the Balsamic & Chili upgrade."
        ]
    },
    // Adding 2 more for logic validation...
    {
        id: 'w1-d3', day: 'Tuesday', mealType: 'dinner',
        title: 'Chicken & Bean Burritos',
        kidHack: "The 'Treasure Scroll' - No spicy beans inside, extra cheese.",
        adultUpgrade: "Add Pickled Jalapeños & Sriracha Crème Fraîche.",
        chainId: 'chicken-chain', stepInChain: 3,
        energyType: 'microwave', cookingTime: 5,
        costPerAdult: 1.2, costPerKid: 0.8,
        image: 'https://images.unsplash.com/photo-1565299585093-997a9981da33?auto=format&fit=crop&w=400&q=80',
        ingredients: [
            { name: 'Tortilla Wraps', baseQty: 2, unit: 'pc', aisle: 'Bakery' },
            { name: 'Black Beans', baseQty: 0.25, unit: 'can', aisle: 'Pantry' },
            { name: 'Greek Yogurt', baseQty: 30, unit: 'g', aisle: 'Dairy' }
        ],
        steps: [
            "Warm wraps in microwave for 30s.",
            "Mash beans (mild for kids).",
            "Fill with chicken & yogurt (The DIY Wrap game).",
            "Upgrade: Spicy salsa for adults only."
        ]
    },
    {
        id: 'w1-d4', day: 'Wednesday', mealType: 'dinner',
        title: 'Garlic Butter Salmon',
        kidHack: "The 'Pink Fish Power' - Small bites, sweetcorn side.",
        adultUpgrade: "Lemon Zest & Capers with fresh dill.",
        energyType: 'hob', cookingTime: 10,
        costPerAdult: 4.0, costPerKid: 2.5,
        image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=400&q=80',
        ingredients: [
            { name: 'Salmon Fillets', baseQty: 1, unit: 'pc', aisle: 'Meat & Fish' },
            { name: 'Sweetcorn', baseQty: 30, unit: 'g', aisle: 'Pantry' },
            { name: 'Green Beans', baseQty: 50, unit: 'g', aisle: 'Produce' }
        ],
        steps: [
            "Pan-sear salmon for 4 mins each side.",
            "Blitz kid's portion with corn to make it familiar.",
            "Top adult salmon with capers and lemon zest."
        ]
    }
];
