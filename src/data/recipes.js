export const AISLES = [
    'Produce',
    'Meat & Fish',
    'Dairy',
    'Bakery',
    'Pantry',
    'Frozen',
    'PantryCheck'
];

export const ENERGY_RATES = {
    oven: 2.1,
    air_fryer: 1.2,
    hob: 1.5,
    microwave: 0.8
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

export const FAQ = [
    { q: "How do I save money with this app?", a: "Follow the 'Supply Chains'. We design weekly plans where a Sunday roast's leftovers become Monday's lunch and Tuesday's dinner, reducing waste and bulk-buy costs." },
    { q: "What is a 'Kid Hack' (HECK)?", a: "It's a way to modify the meal for children—usually by blending veggies into sauces (Hidden Veg) or keeping spices separate until the very end." },
    { q: "How is energy cost calculated?", a: "We use average UK energy rates (29p/kWh) multiplied by the appliance wattage and cooking time for each recipe." },
    { q: "Can I share my list?", a: "Yes! Use the 'Share to WhatsApp' button in the Grocery Run tab to send a formatted list to your partner." }
];

export const RECIPES = [
    // --- WEEK 1: THE CHICKEN CHAIN ---
    {
        id: 'w1-d1', day: 'Sunday', week: 1, mealType: 'dinner',
        title: 'Sunday Ritual Roast Chicken',
        kidHack: "The 'Cloud' Mashed Potatoes (Hidden Cauliflower) - Season with zero salt.",
        adultUpgrade: "Top with Fresh Rosemary & Black Pepper. Add a reduction of pan juices.",
        prepAlert: "Save the carcass! Tomorrow's lunch boxes depend on it.",
        chainId: 'chicken-chain', stepInChain: 1,
        energyType: 'air_fryer', cookingTime: 53,
        costPerAdult: 2.5, costPerKid: 1.5,
        rationale: 'Core protein for the week. Whole bird is 40% cheaper than pre-cut fillets.',
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
        id: 'w1-d2', day: 'Monday', week: 1, mealType: 'dinner',
        title: 'Hidden Veg Chicken Pasta',
        kidHack: "The 'Invisibles' Sauce - Veggies blended into tomato sauce.",
        adultUpgrade: "Stir in Balsamic Glaze and Chili Flakes for a deep umami hit.",
        chainId: 'chicken-chain', stepInChain: 2,
        energyType: 'hob', cookingTime: 15,
        costPerAdult: 1.8, costPerKid: 1.0,
        rationale: 'Uses 250g of Sunday cold-meat. Prep time reduced by 70%.',
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
    {
        id: 'w1-d3', day: 'Tuesday', week: 1, mealType: 'dinner',
        title: 'Zero-Waste Chicken Bone Soup',
        kidHack: "The 'Golden Potion' - Serve with fun star-shaped croutons.",
        adultUpgrade: "Stir in Fresh Parsley and Lemon Zest. Add 1 tsp of Wholegrain Mustard.",
        chainId: 'chicken-chain', stepInChain: 3,
        energyType: 'hob', cookingTime: 45,
        costPerAdult: 0.8, costPerKid: 0.5,
        rationale: 'Extracting final value from the Sunday carcass. Zero extra meat cost.',
        image: 'https://images.unsplash.com/photo-1547592110-8036d3c2851d?auto=format&fit=crop&w=400&q=80',
        ingredients: [
            { name: 'Onion', baseQty: 0.5, unit: 'pc', aisle: 'Produce' },
            { name: 'Carrots', baseQty: 100, unit: 'g', aisle: 'Produce' },
            { name: 'Potatoes', baseQty: 100, unit: 'g', aisle: 'Produce' }
        ],
        steps: [
            "Boil the carcass with veg scraps for 45 mins to make broth.",
            "Remove bones and strain.",
            "Add diced fresh veg and simmer until soft.",
            "Adults: Add mustard and lemon at the table."
        ]
    },
    {
        id: 'w1-d4', day: 'Wednesday', week: 1, mealType: 'dinner',
        title: 'Chicken & Lime Street Tacos',
        kidHack: "The 'Treasure Scroll' - No spicy beans inside, extra cheese.",
        adultUpgrade: "Add Pickled Jalapeños & Sriracha Crème Fraîche.",
        chainId: 'chicken-chain', stepInChain: 4,
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
            "Fill with remaining shredded chicken & yogurt.",
            "Upgrade: Spicy salsa and pickles for adults only."
        ]
    },
    {
        id: 'w1-d5', day: 'Thursday', week: 1, mealType: 'dinner',
        title: 'Garlic Butter Salmon & Greens',
        kidHack: "The 'Pink Fish Power' - Small bites, sweetcorn side.",
        adultUpgrade: "Lemon Zest & Capers with fresh dill and extra garlic.",
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
    },
    {
        id: 'w1-d6', day: 'Friday', week: 1, mealType: 'dinner',
        title: 'Homemade Pepperoni Pizza',
        kidHack: "The 'Smile Pie' - Let kids place olives/tomatoes in shapes.",
        adultUpgrade: "Drizzle with Hot Honey and extra oregano.",
        energyType: 'oven', cookingTime: 15,
        costPerAdult: 1.5, costPerKid: 1.0,
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80',
        ingredients: [
            { name: 'Pizza Dough', baseQty: 0.5, unit: 'ball', aisle: 'Bakery' },
            { name: 'Mozzarella', baseQty: 60, unit: 'g', aisle: 'Dairy' },
            { name: 'Pepperoni', baseQty: 20, unit: 'g', aisle: 'Meat & Fish' }
        ],
        steps: [
            "Roll out dough and top with sauce and cheese.",
            "Kids: Make faces with the toppings.",
            "Bake at 220°C for 12-15 mins.",
            "Adults: Add hot honey before serving."
        ]
    },
    {
        id: 'w1-d7', day: 'Saturday', week: 1, mealType: 'dinner',
        title: 'Everything Fridge Stir-Fry',
        kidHack: "The 'Magic Rainbow' - Noodles colored with soy and sweet sauce.",
        adultUpgrade: "Sriracha Mayo and Fried Shallots topping.",
        energyType: 'hob', cookingTime: 10,
        costPerAdult: 1.0, costPerKid: 0.6,
        image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=400&q=80',
        ingredients: [
            { name: 'Egg Noodles', baseQty: 1, unit: 'nest', aisle: 'Pantry' },
            { name: 'Mixed Veggies', baseQty: 150, unit: 'g', aisle: 'Produce' },
            { name: 'Soy Sauce', baseQty: 1, unit: 'tbsp', aisle: 'Pantry' }
        ],
        steps: [
            "Toss noodles and all remaining veg from the week.",
            "Flash-fry for 10 mins.",
            "Serve kids with mild soy sauce.",
            "Adults: Spicy Mayo and shallot upgrade."
        ]
    },
    // --- WEEK 2: THE GROUND BEEF BATCH (Chain B) ---
    {
        id: 'w2-d1', day: 'Sunday', week: 2, mealType: 'dinner',
        title: 'Batch-Cook Bolognese',
        kidHack: "Hidden Veg - Celery and Carrots blended into the meat sauce.",
        adultUpgrade: "Stir in Red Wine reduction and extra parmesan.",
        chainId: 'beef-batch', stepInChain: 1,
        energyType: 'hob', cookingTime: 60,
        costPerAdult: 2.0, costPerKid: 1.2,
        rationale: 'Big batch cook. Save 50% for Tuesday and Thursday transformation.',
        image: 'https://images.unsplash.com/photo-1622973536968-3ead9e780960?auto=format&fit=crop&w=400&q=80',
        ingredients: [
            { name: 'Beef Mince', baseQty: 150, unit: 'g', aisle: 'Meat & Fish' },
            { name: 'Canned Tomatoes', baseQty: 1, unit: 'can', aisle: 'Pantry' },
            { name: 'Celery', baseQty: 30, unit: 'g', aisle: 'Produce' }
        ],
        steps: [
            "Brown meat and add blended veg/tomatoes.",
            "Simmer for 1 hour.",
            "Serve 2 portions per person, save half in the fridge."
        ]
    },
    {
        id: 'w2-d2', day: 'Monday', week: 2, mealType: 'dinner',
        title: 'Sausage & Mash with Gravy',
        kidHack: "The 'Wiggly Snakes' - Sausages cut into fun shapes.",
        adultUpgrade: "Caramelized Onion Gravy and Dijon Mustard in the mash.",
        energyType: 'hob', cookingTime: 25,
        costPerAdult: 1.5, costPerKid: 1.0,
        image: 'https://images.unsplash.com/photo-1534939561126-855b8675edd2?auto=format&fit=crop&w=400&q=80',
        ingredients: [
            { name: 'Pork Sausages', baseQty: 3, unit: 'pc', aisle: 'Meat & Fish' },
            { name: 'Potatoes', baseQty: 250, unit: 'g', aisle: 'Produce' }
        ],
        steps: [
            "Boil and mash potatoes.",
            "Pan-fry sausages.",
            "Divide: Adults get caramelized onions and mustard."
        ]
    },
    {
        id: 'w2-d3', day: 'Tuesday', week: 2, mealType: 'dinner',
        title: 'Bolognese Transformation: Tacos',
        kidHack: "Mild Spice - Keep the chili powder low for kids.",
        adultUpgrade: "Add Fresh Coriander and Pickled Red Onions.",
        chainId: 'beef-batch', stepInChain: 2,
        energyType: 'microwave', cookingTime: 10,
        costPerAdult: 0.5, costPerKid: 0.3,
        image: 'https://images.unsplash.com/photo-1565299585093-997a9981da33?auto=format&fit=crop&w=400&q=80',
        ingredients: [
            { name: 'Tortilla Wraps', baseQty: 2, unit: 'pc', aisle: 'Bakery' },
            { name: 'Kidney Beans', baseQty: 0.5, unit: 'can', aisle: 'Pantry' }
        ],
        steps: [
            "Reheat some of Sunday's Bolognese base.",
            "Add beans and mild taco seasoning.",
            "Fill wraps - Adults add cilantro and extra onions."
        ]
    },
    {
        id: 'w2-d4', day: 'Wednesday', week: 2, mealType: 'dinner',
        title: 'Sticky Honey Chicken Thighs',
        kidHack: "Sweet & Savory - Extra honey for a kid-friendly glaze.",
        adultUpgrade: "Toasted Sesame Seeds and Spring Onion strips.",
        energyType: 'air_fryer', cookingTime: 25,
        costPerAdult: 2.2, costPerKid: 1.5,
        image: 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?auto=format&fit=crop&w=400&q=80',
        ingredients: [
            { name: 'Chicken Thighs', baseQty: 2, unit: 'pc', aisle: 'Meat & Fish' },
            { name: 'Honey', baseQty: 1, unit: 'tbsp', aisle: 'Pantry' }
        ],
        steps: [
            "Air fry thighs at 180°C for 25 mins.",
            "Glaze with honey and soy sauce.",
            "Adults: Top with sesame and onions."
        ]
    },
    {
        id: 'w2-d5', day: 'Thursday', week: 2, mealType: 'dinner',
        title: 'Beef & Bean Chili Bowl',
        kidHack: "The 'Cheese Volcano' - Top with a mountain of mild cheddar.",
        adultUpgrade: "A dollop of Sour Cream and fresh Jalapeño slices.",
        chainId: 'beef-batch', stepInChain: 3,
        energyType: 'hob', cookingTime: 15,
        costPerAdult: 0.4, costPerKid: 0.2,
        image: 'https://images.unsplash.com/photo-1585238341267-7ccf80064f5f?auto=format&fit=crop&w=400&q=80',
        ingredients: [
            { name: 'Rice', baseQty: 75, unit: 'g', aisle: 'Pantry' }
        ],
        steps: [
            "Simmer the final portion of the batch meat base.",
            "Serve over fluffy rice.",
            "Kids: Cheddar volcano. Adults: Jalapeño fire."
        ]
    },
    {
        id: 'w2-d6', day: 'Friday', week: 2, mealType: 'dinner',
        title: 'Fish Finger Tacos',
        kidHack: "The 'Sailor Boat' - Fish fingers in soft wrap 'boats'.",
        adultUpgrade: "Lime juice and tartare sauce under the wrap.",
        energyType: 'air_fryer', cookingTime: 15,
        costPerAdult: 1.2, costPerKid: 0.8,
        image: 'https://images.unsplash.com/photo-1522036667432-88f7075fb393?auto=format&fit=crop&w=400&q=80',
        ingredients: [
            { name: 'Fish Fingers', baseQty: 4, unit: 'pc', aisle: 'Frozen' },
            { name: 'Wraps', baseQty: 2, unit: 'pc', aisle: 'Bakery' }
        ],
        steps: [
            "Cook fingers in air fryer for 15 mins.",
            "Place in wraps with lettuce.",
            "Adults: Squeeze lime and add tartare."
        ]
    },
    {
        id: 'w2-d7', day: 'Saturday', week: 2, mealType: 'dinner',
        title: 'Omelette Night',
        kidHack: "The 'Egg Roll' - Roll up the omelette like a wrap.",
        adultUpgrade: "Spinach and Feta filling.",
        energyType: 'hob', cookingTime: 10,
        costPerAdult: 0.8, costPerKid: 0.5,
        image: 'https://images.unsplash.com/photo-1510629954389-c1e0da47d415?auto=format&fit=crop&w=400&q=80',
        ingredients: [
            { name: 'Eggs', baseQty: 3, unit: 'pc', aisle: 'Dairy' },
            { name: 'Cheese', baseQty: 30, unit: 'g', aisle: 'Dairy' }
        ],
        steps: [
            "Whisk eggs and fry in a pan.",
            "Add cheese. For adults, add spinach and feta.",
            "Fold and serve."
        ]
    },
    // --- WEEK 3: THE PORK SHOULDER CHAIN (Chain C) ---
    {
        id: 'w3-d1', day: 'Sunday', week: 3, mealType: 'dinner',
        title: 'Slow-Cooked Pulled Pork',
        kidHack: "The 'Sweet Strings' - Use apple sauce for a mild sweet flavor.",
        adultUpgrade: "Harissa Paste coating and smoked paprika.",
        chainId: 'pork-chain', stepInChain: 1,
        energyType: 'oven', cookingTime: 240,
        costPerAdult: 2.8, costPerKid: 1.8,
        image: 'https://images.unsplash.com/photo-1502364292189-6611c4463309?auto=format&fit=crop&w=400&q=80',
        ingredients: [
            { name: 'Pork Shoulder', baseQty: 250, unit: 'g', aisle: 'Meat & Fish' },
            { name: 'Apple Sauce', baseQty: 1, unit: 'tbsp', aisle: 'Pantry' }
        ],
        steps: [
            "Bake pork at 150°C for 4 hours until tender.",
            "Save 60% of meat for Monday and Wednesday.",
            "Adults: Add harissa to your portions."
        ]
    },
    {
        id: 'w3-d2', day: 'Monday', week: 3, mealType: 'dinner',
        title: 'Pulled Pork Baps',
        kidHack: "The 'Bun-derful' - Soft brioche buns with plenty of apple sauce.",
        adultUpgrade: "Crunchy Coleslaw and Pickled Cucumber.",
        chainId: 'pork-chain', stepInChain: 2,
        energyType: 'microwave', cookingTime: 3,
        costPerAdult: 0.6, costPerKid: 0.4,
        image: 'https://images.unsplash.com/photo-1521305916504-4a1121188589?auto=format&fit=crop&w=400&q=80',
        ingredients: [
            { name: 'Brioche Buns', baseQty: 2, unit: 'pc', aisle: 'Bakery' },
            { name: 'Lettuce', baseQty: 50, unit: 'g', aisle: 'Produce' }
        ],
        steps: [
            "Toast buns and reheat 100g of pork per person.",
            "Assemble with lettuce. Adults add coleslaw."
        ]
    },
    {
        id: 'w3-d3', day: 'Tuesday', week: 3, mealType: 'dinner',
        title: 'Speedy Pantry Bolognese',
        kidHack: "Fun Shapes - Use Fusilli or Farfalle pasta.",
        adultUpgrade: "Pesto swirl and Parmesan flakes.",
        energyType: 'hob', cookingTime: 15,
        costPerAdult: 1.2, costPerKid: 0.8,
        image: 'https://images.unsplash.com/photo-1622973536968-3ead9e780960?auto=format&fit=crop&w=400&q=80',
        ingredients: [
            { name: 'Pasta', baseQty: 80, unit: 'g', aisle: 'Pantry' },
            { name: 'Canned Tomatoes', baseQty: 0.5, unit: 'can', aisle: 'Pantry' }
        ],
        steps: [
            "Boil pasta and mix with tomato sauce.",
            "Add any leftover meats. Adults add pesto."
        ]
    },
    {
        id: 'w3-d4', day: 'Wednesday', week: 3, mealType: 'dinner',
        title: 'Pork Shoulder Stir-Fry',
        kidHack: "The 'Crunchy Veg' - Keep the peppers and carrots bite-sized.",
        adultUpgrade: "Toasted Chili Oil and Peanut drizzle.",
        chainId: 'pork-chain', stepInChain: 3,
        energyType: 'hob', cookingTime: 10,
        costPerAdult: 0.7, costPerKid: 0.5,
        image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=400&q=80',
        ingredients: [
            { name: 'Egg Noodles', baseQty: 1, unit: 'nest', aisle: 'Pantry' },
            { name: 'Carrots', baseQty: 50, unit: 'g', aisle: 'Produce' }
        ],
        steps: [
            "Stir fry final pork bits with noodles and veg.",
            "Adults add chili oil and peanuts."
        ]
    },
    {
        id: 'w3-d5', day: 'Thursday', week: 3, mealType: 'dinner',
        title: 'Baked Sweet Potato & Beans',
        kidHack: "The 'Orange Boat' - Baked potato topped with mild beans.",
        adultUpgrade: "Sriracha and Spring Onions.",
        energyType: 'oven', cookingTime: 45,
        costPerAdult: 0.8, costPerKid: 0.5,
        image: 'https://images.unsplash.com/photo-1596097488258-322195743a05?auto=format&fit=crop&w=400&q=80',
        ingredients: [
            { name: 'Sweet Potato', baseQty: 1, unit: 'pc', aisle: 'Produce' },
            { name: 'Baked Beans', baseQty: 0.5, unit: 'can', aisle: 'Pantry' }
        ],
        steps: [
            "Bake potato at 200°C for 45 mins.",
            "Top with warmed beans. Adults add sriracha."
        ]
    },
    {
        id: 'w3-d6', day: 'Friday', week: 3, mealType: 'dinner',
        title: 'Steak & Salad Night',
        kidHack: "The 'Meat Sticks' - Cut steak into thin strips for kids.",
        adultUpgrade: "Garlic Butter and Peppercorn sauce.",
        energyType: 'hob', cookingTime: 10,
        costPerAdult: 4.5, costPerKid: 2.8,
        image: 'https://images.unsplash.com/photo-1546241072-48010ad28c2c?auto=format&fit=crop&w=400&q=80',
        ingredients: [
            { name: 'Rump Steak', baseQty: 1, unit: 'pc', aisle: 'Meat & Fish' },
            { name: 'Lettuce', baseQty: 100, unit: 'g', aisle: 'Produce' }
        ],
        steps: [
            "Sear steak for 3 mins side.",
            "Serve with fresh salad. Adults add garlic butter."
        ]
    },
    {
        id: 'w3-d7', day: 'Saturday', week: 3, mealType: 'dinner',
        title: 'Saturday Buffet',
        kidHack: "The 'Party Plate' - Let kids pick 3 things from the fridge.",
        adultUpgrade: "Assorted Dips and Warm Pittas.",
        energyType: 'microwave', cookingTime: 5,
        costPerAdult: 0.5, costPerKid: 0.3,
        image: 'https://images.unsplash.com/photo-1510629954389-c1e0da47d415?auto=format&fit=crop&w=400&q=80',
        ingredients: [
            { name: 'Leftover Everything', baseQty: 1, unit: 'logic', aisle: 'PantryCheck' }
        ],
        steps: [
            "Empty the fridge into a buffet-style spread.",
            "Warm anything necessary.",
            "Adults add fancy dips."
        ]
    },
    // --- WEEK 4: THE TURKEY CHAIN (Chain D) ---
    {
        id: 'w4-d1', day: 'Sunday', week: 4, mealType: 'dinner',
        title: 'Sunday Turkey Roast',
        kidHack: "The 'White Cloud' - Turkey breast with creamy mash.",
        adultUpgrade: "Cranberry Sauce and Sage stuffing.",
        chainId: 'turkey-chain', stepInChain: 1,
        energyType: 'oven', cookingTime: 70,
        costPerAdult: 2.4, costPerKid: 1.6,
        image: 'https://images.unsplash.com/photo-1518492104633-c3ed9e7a7c6a?auto=format&fit=crop&w=400&q=80',
        ingredients: [
            { name: 'Turkey Crown', baseQty: 200, unit: 'g', aisle: 'Meat & Fish' },
            { name: 'Potatoes', baseQty: 250, unit: 'g', aisle: 'Produce' }
        ],
        steps: [
            "Roast turkey at 180°C for 1 hour 10 mins.",
            "Mash potatoes with milk (no salt for kids).",
            "Save 40% of turkey meat for sandwiches/stir-fry."
        ]
    },
    {
        id: 'w4-d2', day: 'Monday', week: 4, mealType: 'dinner',
        title: 'Turkey Club Sandwiches',
        kidHack: "The 'Super Stack' - Turkey and bacon in layers.",
        adultUpgrade: "Mayo and Wholegrain Mustard.",
        chainId: 'turkey-chain', stepInChain: 2,
        energyType: 'microwave', cookingTime: 2,
        costPerAdult: 1.1, costPerKid: 0.8,
        image: 'https://images.unsplash.com/photo-1521390188846-e2a3a974530d?auto=format&fit=crop&w=400&q=80',
        ingredients: [
            { name: 'Sliced Bread', baseQty: 3, unit: 'pc', aisle: 'Bakery' },
            { name: 'Bacon', baseQty: 2, unit: 'pc', aisle: 'Meat & Fish' }
        ],
        steps: [
            "Toast bread and layer with turkey and bacon.",
            "Adults add mayo/mustard."
        ]
    },
    {
        id: 'w4-d3', day: 'Tuesday', week: 4, mealType: 'dinner',
        title: 'Tuna & Sweetcorn Pasta',
        kidHack: "The 'Sea Pasta' - Tuna with plenty of sweetcorn.",
        adultUpgrade: "Black Pepper and Capers.",
        energyType: 'hob', cookingTime: 12,
        costPerAdult: 1.2, costPerKid: 0.8,
        image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=400&q=80',
        ingredients: [
            { name: 'Canned Tuna', baseQty: 0.5, unit: 'can', aisle: 'Pantry' },
            { name: 'Pasta', baseQty: 80, unit: 'g', aisle: 'Pantry' },
            { name: 'Sweetcorn', baseQty: 30, unit: 'g', aisle: 'Pantry' }
        ],
        steps: [
            "Boil pasta and mix with tuna/corn.",
            "Adults add capers."
        ]
    },
    {
        id: 'w4-d4', day: 'Wednesday', week: 4, mealType: 'dinner',
        title: 'Turkey Stir-Fry',
        kidHack: "The 'Colorful Bowl' - Use a mix of frozen veggies.",
        adultUpgrade: "Sriracha drizzle and crushed peanuts.",
        chainId: 'turkey-chain', stepInChain: 3,
        energyType: 'hob', cookingTime: 10,
        costPerAdult: 0.8, costPerKid: 0.5,
        image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=400&q=80',
        ingredients: [
            { name: 'Egg Noodles', baseQty: 1, unit: 'nest', aisle: 'Pantry' },
            { name: 'Mixed Veggies', baseQty: 100, unit: 'g', aisle: 'Produce' }
        ],
        steps: [
            "Stir fry final turkey leftovers with noodles.",
            "Adults add spice."
        ]
    },
    {
        id: 'w4-d5', day: 'Thursday', week: 4, mealType: 'dinner',
        title: 'Mild Chicken Korma',
        kidHack: "Creamy Curry - Use coconut milk for a mild taste.",
        adultUpgrade: "Fresh Chili and Lime juice.",
        energyType: 'hob', cookingTime: 20,
        costPerAdult: 2.1, costPerKid: 1.4,
        image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=400&q=80',
        ingredients: [
            { name: 'Chicken Breast', baseQty: 125, unit: 'g', aisle: 'Meat & Fish' },
            { name: 'Coconut Milk', baseQty: 100, unit: 'ml', aisle: 'Pantry' }
        ],
        steps: [
            "Cook chicken in curry sauce.",
            "Stir in coconut milk. Adults add chili/lime."
        ]
    },
    {
        id: 'w4-d6', day: 'Friday', week: 4, mealType: 'dinner',
        title: 'Gourmet Burger Night',
        kidHack: "The 'Monster Burger' - Stack it high with cheese.",
        adultUpgrade: "Blue Cheese and Red Onion Jam.",
        energyType: 'hob', cookingTime: 15,
        costPerAdult: 3.2, costPerKid: 2.0,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80',
        ingredients: [
            { name: 'Beef Burgers', baseQty: 1, unit: 'pc', aisle: 'Meat & Fish' },
            { name: 'Cheese', baseQty: 30, unit: 'g', aisle: 'Dairy' }
        ],
        steps: [
            "Fry burgers for 5 mins side.",
            "Melt cheese on top. Adults add blue cheese."
        ]
    },
    {
        id: 'w4-d7', day: 'Saturday', week: 4, mealType: 'dinner',
        title: 'Month-End Clean Out',
        kidHack: "The 'Snack Plate' - A little bit of everything left.",
        adultUpgrade: "Warm Pittas and Olives.",
        energyType: 'microwave', cookingTime: 5,
        costPerAdult: 0.2, costPerKid: 0.1,
        image: 'https://images.unsplash.com/photo-1510629954389-c1e0da47d415?auto=format&fit=crop&w=400&q=80',
        ingredients: [
            { name: 'Leftover Everything', baseQty: 1, unit: 'logic', aisle: 'PantryCheck' }
        ],
        steps: [
            "Final clear out of the freezer and pantry.",
            "Reheat and assemble."
        ]
    }
];
