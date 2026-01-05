export const RECIPES = [
    {
        id: 'mon-dinner',
        day: 'Monday',
        theme: 'Fresh Start',
        title: 'Pan-Seared Salmon with Asparagus',
        titleVeg: 'Crispy Tofu with Asparagus',
        prepTime: '20 min',
        calories: '450 kcal',
        freshness: 1,
        image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=400&q=80',
        ingredients: [
            { name: 'Salmon Fillets', nameVeg: 'Firm Tofu', baseQty: 1, unit: 'fillet', aisle: 'Meat & Fish' },
            { name: 'Asparagus', baseQty: 100, unit: 'g', aisle: 'Produce' },
            { name: 'Lemon', baseQty: 0.25, unit: 'pc', aisle: 'Produce' },
            { name: 'Greek Yogurt', baseQty: 30, unit: 'g', aisle: 'Dairy' },
            { name: 'Fresh Dill', baseQty: 5, unit: 'g', aisle: 'Produce' }
        ],
        kidHack: "Call the asparagus 'mini trees' and let them dip the salmon 'blocks' into the 'cloud sauce' (yogurt).",
        steps: [
            "Pat the salmon dry and season with salt and pepper.",
            "Heat oil in a pan over medium-high heat.",
            "Sear salmon for 4-5 minutes skin-side down.",
            "Flip and cook for 2 more minutes.",
            "Sauté asparagus in the same pan until tender-crisp.",
            "Serve with a dollop of yogurt mixed with dill and lemon."
        ]
    },
    {
        id: 'tue-dinner',
        day: 'Tuesday',
        theme: 'Taco Night',
        title: 'Beef & Black Bean Tacos',
        titleVeg: 'Lentil & Black Bean Tacos',
        prepTime: '15 min',
        calories: '550 kcal',
        freshness: 2,
        image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=400&q=80',
        ingredients: [
            { name: 'Beef Mince', nameVeg: 'Canned Lentils', baseQty: 125, unit: 'g', aisle: 'Meat & Fish' },
            { name: 'Taco Shells', baseQty: 3, unit: 'pc', aisle: 'Bakery' },
            { name: 'Greek Yogurt', baseQty: 50, unit: 'g', aisle: 'Dairy' },
            { name: 'Canned Black Beans', baseQty: 0.25, unit: 'can', aisle: 'Pantry' },
            { name: 'Shredded Lettuce', baseQty: 30, unit: 'g', aisle: 'Produce' }
        ],
        kidHack: "Let them build their own 'taco mountain'. Use yogurt as 'snow'.",
        steps: [
            "Brown the mince (or lentils) in a large skillet.",
            "Add black beans and taco seasoning with a splash of water.",
            "Simmer for 5 minutes until thickened.",
            "Warm the taco shells in the oven for 2-3 minutes.",
            "Fill shells with meat, lettuce, and a dollop of yogurt."
        ]
    },
    {
        id: 'wed-dinner',
        day: 'Wednesday',
        theme: 'Traybake',
        title: 'Lemon Chicken & Root Veg Bake',
        titleVeg: 'Lemon Halloumi & Root Veg Bake',
        prepTime: '40 min',
        calories: '480 kcal',
        freshness: 2,
        image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=400&q=80',
        ingredients: [
            { name: 'Chicken Thighs', nameVeg: 'Halloumi', baseQty: 2, unit: 'pc', aisle: 'Meat & Fish' },
            { name: 'Potatoes', baseQty: 150, unit: 'g', aisle: 'Produce' },
            { name: 'Carrots', baseQty: 100, unit: 'g', aisle: 'Produce' },
            { name: 'Lemon', baseQty: 0.5, unit: 'pc', aisle: 'Produce' },
            { name: 'Olive Oil', baseQty: 1, unit: 'tbsp', aisle: 'PantryCheck' }
        ],
        kidHack: "Cut potatoes into 'chips' shapes to increase appeal.",
        steps: [
            "Preheat oven to 200°C.",
            "Chop vegetables into bite-sized chunks.",
            "Toss chicken and veg with oil, salt, and lemon slices on a large tray.",
            "Roast for 35-40 minutes until chicken is cooked and veg is golden."
        ]
    },
    {
        id: 'thu-dinner',
        day: 'Thursday',
        theme: 'Curry Night',
        title: 'Creamy Chicken Curry',
        titleVeg: 'Creamy Chickpea Curry',
        prepTime: '25 min',
        calories: '600 kcal',
        freshness: 3,
        image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=400&q=80',
        ingredients: [
            { name: 'Chicken Thighs', nameVeg: 'Canned Chickpeas', baseQty: 150, unit: 'g', aisle: 'Meat & Fish' },
            { name: 'Curry Paste', baseQty: 2, unit: 'tbsp', aisle: 'Pantry' },
            { name: 'Greek Yogurt', baseQty: 60, unit: 'g', aisle: 'Dairy' },
            { name: 'Rice', baseQty: 75, unit: 'g', aisle: 'PantryCheck' },
            { name: 'Spinach', baseQty: 50, unit: 'g', aisle: 'Produce' }
        ],
        kidHack: "Call it 'Magic Yellow Stew'. Use less spice for their portion.",
        steps: [
            "Cook rice according to package instructions.",
            "Sauté chicken (or chickpeas) with curry paste.",
            "Stir in yogurt and simmer gently for 10 minutes.",
            "Fold in spinach until wilted.",
            "Serve over rice."
        ]
    },
    {
        id: 'fri-dinner',
        day: 'Friday',
        theme: 'Fakeaway',
        title: 'Gourmet Beef Burger & Chips',
        titleVeg: 'Halloumi & Portobello Burger',
        prepTime: '25 min',
        calories: '650 kcal',
        freshness: 3,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80',
        ingredients: [
            { name: 'Beef Burger Patties', nameVeg: 'Halloumi Blocks', baseQty: 1, unit: 'pc', aisle: 'Meat & Fish' },
            { name: 'Burger Buns', baseQty: 1, unit: 'pc', aisle: 'Bakery' },
            { name: 'Potatoes', baseQty: 150, unit: 'g', aisle: 'Produce' },
            { name: 'Lettuce', baseQty: 20, unit: 'g', aisle: 'Produce' },
            { name: 'Onion', baseQty: 0.25, unit: 'pc', aisle: 'Produce' }
        ],
        kidHack: "Let them use 'squash' (ketchup) to draw faces on the burgers.",
        steps: [
            "Cut potatoes into chips and roast at 200°C for 25 minutes.",
            "Grill or pan-fry burger patties for 4-5 minutes per side.",
            "Toast the buns lightly.",
            "Assemble with lettuce, onion, and any remaining yogurt as a sauce.",
            "Serve hot with crispy fries."
        ]
    },
    {
        id: 'sat-brunch',
        day: 'Saturday',
        theme: 'Brunch Ritual',
        title: 'Blueberry & Greek Yogurt Pancakes',
        titleVeg: 'Blueberry & Greek Yogurt Pancakes',
        prepTime: '20 min',
        calories: '400 kcal',
        freshness: 3,
        image: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=400&q=80',
        ingredients: [
            { name: 'Flour', baseQty: 50, unit: 'g', aisle: 'Pantry' },
            { name: 'Eggs', baseQty: 0.5, unit: 'pc', aisle: 'Dairy' },
            { name: 'Greek Yogurt', baseQty: 40, unit: 'g', aisle: 'Dairy' },
            { name: 'Blueberries', baseQty: 30, unit: 'g', aisle: 'Produce' },
            { name: 'Maple Syrup', baseQty: 1, unit: 'tbsp', aisle: 'Pantry' }
        ],
        kidHack: "Make 'pancake people' using blueberries for eyes and syrup for hair.",
        steps: [
            "Whisk together flour, egg, and yogurt into a thick batter.",
            "Gently fold in half the blueberries.",
            "Heat a non-stick pan and drop spoonfuls of batter.",
            "Cook until bubbles appear, then flip.",
            "Serve with remaining berries and syrup."
        ]
    },
    {
        id: 'sun-roast',
        day: 'Sunday',
        theme: 'The Ritual Roast',
        title: 'Herb-Roasted Whole Chicken',
        titleVeg: 'Mushroom & Nut Roast',
        prepTime: '90 min',
        calories: '750 kcal',
        freshness: 2,
        image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=400&q=80',
        ingredients: [
            { name: 'Whole Chicken', nameVeg: 'Large Mushrooms', baseQty: 0.25, unit: 'pc', aisle: 'Meat & Fish' },
            { name: 'Potatoes', baseQty: 200, unit: 'g', aisle: 'Produce' },
            { name: 'Carrots', baseQty: 100, unit: 'g', aisle: 'Produce' },
            { name: 'Onion', baseQty: 0.5, unit: 'pc', aisle: 'Produce' },
            { name: 'Fresh Rosemary', baseQty: 5, unit: 'g', aisle: 'Produce' }
        ],
        kidHack: "Save the 'wishbone' for a special game after dinner.",
        steps: [
            "Preheat oven to 190°C.",
            "Season chicken thoroughly with salt, pepper, and rosemary.",
            "Place in a roasting tin surrounded by potatoes and carrots.",
            "Roast for 1 hour and 20 minutes, or until juices run clear.",
            "Rest for 10 minutes before carving."
        ]
    }
];

export const BUDGET_MODIFIERS = {
    savvy: { label: 'Savvy Saver', factor: 0.8, description: 'Budget & Frozen focus' },
    balanced: { label: 'Everyday Balanced', factor: 1.0, description: 'Fresh & Varied' },
    premium: { label: 'Premium Quality', factor: 1.5, description: 'Organic & Prime cuts' }
};

export const AISLES = [
    'Produce',
    'Meat & Fish',
    'Dairy',
    'Bakery',
    'Pantry',
    'PantryCheck'
];
