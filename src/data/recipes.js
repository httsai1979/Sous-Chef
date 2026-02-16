export const RECIPES = [
    // --- SUNDAY: START OF CHAIN A (ROAST) ---
    {
        id: 'sun-bfast',
        day: 'Sunday',
        mealType: 'breakfast',
        theme: 'Slow Morning',
        title: 'Lemon & Honey Yogurt',
        titleVeg: 'Lemon & Honey Yogurt',
        energyUsage: 'none',
        energyEfficiency: { method: 'none', saving: '100%', note: 'Zero fuel cost' },
        prepTime: '5 min',
        calories: '200 kcal',
        freshness: 2,
        image: 'https://images.unsplash.com/photo-1522906456132-bf22adbc7079?auto=format&fit=crop&w=400&q=80',
        ingredients: [
            { name: 'Greek Yogurt', baseQty: 150, unit: 'g', aisle: 'Dairy' },
            { name: 'Lemon', baseQty: 0.25, unit: 'pc', aisle: 'Produce' },
            { name: 'Honey', baseQty: 1, unit: 'tbsp', aisle: 'Pantry' }
        ],
        kidHack: "It's 'Lemon Cloud Dessert' for breakfast!",
        adultUpgrade: "Add fresh zest and a sprig of dill for a sophisticated tang.",
        hiddenVeg: "High protein yogurt base supporting growth.",
        steps: ["Mix lemon juice and honey into yogurt."]
    },
    {
        id: 'sun-lunch',
        day: 'Sunday',
        mealType: 'lunch',
        theme: 'Easy Assembly',
        title: 'Sunday Salad Wraps',
        titleVeg: 'Sunday Salad Wraps',
        energyUsage: 'none',
        energyEfficiency: { method: 'none', saving: '100%', note: 'Zero fuel cost' },
        prepTime: '10 min',
        calories: '450 kcal',
        freshness: 2,
        image: 'https://images.unsplash.com/photo-1509722747041-619f3830c149?auto=format&fit=crop&w=400&q=80',
        ingredients: [
            { name: 'Taco Shells', baseQty: 2, unit: 'pc', aisle: 'Bakery' },
            { name: 'Shredded Lettuce', baseQty: 50, unit: 'g', aisle: 'Produce' }
        ],
        kidHack: "Let them roll their own 'Food Sleeping Bags'.",
        adultUpgrade: "Add pickled jalapeños and soured cream for a kick.",
        hiddenVeg: "High fiber wraps and raw crunchy veg.",
        steps: ["Assemble wraps with lettuce and surplus yogurt sauce."]
    },
    {
        id: 'sun-dinner',
        day: 'Sunday',
        mealType: 'dinner',
        theme: 'The Ritual Roast',
        title: 'Herb-Roasted Whole Chicken',
        titleVeg: 'Mushroom & Nut Roast',
        chainId: 'chain-a',
        stepInChain: 1,
        energyUsage: 'air_fryer',
        energyEfficiency: { method: 'air_fryer', saving: '58%', note: 'Air Fryer saves ~35 mins vs Oven' },
        prepTime: '60 min',
        calories: '750 kcal',
        freshness: 2,
        image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=400&q=80',
        ingredients: [
            { name: 'Whole Chicken', nameVeg: 'Large Mushrooms', baseQty: 0.25, unit: 'pc', aisle: 'Meat & Fish' },
            { name: 'Potatoes', baseQty: 200, unit: 'g', aisle: 'Produce' },
            { name: 'Carrots', baseQty: 100, unit: 'g', aisle: 'Produce' },
            { name: 'Fresh Rosemary', baseQty: 5, unit: 'g', aisle: 'Produce' }
        ],
        kidHack: "Save the 'wishbone' for a special game.",
        adultUpgrade: "Top with a reduction of the roasting juices and fresh rosemary.",
        hiddenVeg: "Root vegetables roasted in natural juices.",
        steps: ["Pat chicken dry and season.", "Roast at 180°C in Air Fryer for 53 mins.", "Rest for 10 mins."]
    },

    // --- MONDAY: CHAIN A PART 2 ---
    {
        id: 'mon-bfast',
        day: 'Monday',
        mealType: 'breakfast',
        theme: 'Quick Start',
        title: 'Greek Yogurt & Honey',
        titleVeg: 'Greek Yogurt & Honey',
        energyUsage: 'none',
        energyEfficiency: { method: 'none', saving: '100%', note: 'No energy needed' },
        prepTime: '5 min',
        calories: '250 kcal',
        freshness: 1,
        image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=400&q=80',
        ingredients: [
            { name: 'Greek Yogurt', baseQty: 150, unit: 'g', aisle: 'Dairy' },
            { name: 'Honey', baseQty: 1, unit: 'tbsp', aisle: 'Pantry' }
        ],
        kidHack: "Call it 'Cloud Soup'.",
        adultUpgrade: "Stir in a drop of vanilla or sprinkle of cinnamon.",
        hiddenVeg: "Probiotic support for early week gut health.",
        steps: ["Scoop yogurt into bowl.", "Drizzle with honey."]
    },
    {
        id: 'mon-lunch',
        day: 'Monday',
        mealType: 'lunch',
        theme: 'Zero Prep',
        title: 'Chicken & Lettuce Salad',
        titleVeg: 'Tofu & Lettuce Salad',
        chainId: 'chain-a',
        stepInChain: 2,
        energyUsage: 'none',
        energyEfficiency: { method: 'none', saving: '100%', note: 'Uses pre-cooked chicken' },
        prepTime: '5 min',
        calories: '350 kcal',
        freshness: 1,
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
        ingredients: [
            { name: 'Whole Chicken', nameVeg: 'Firm Tofu', baseQty: 0.1, unit: 'pc', aisle: 'Meat & Fish' },
            { name: 'Shredded Lettuce', baseQty: 50, unit: 'g', aisle: 'Produce' },
            { name: 'Lemon', baseQty: 0.25, unit: 'pc', aisle: 'Produce' }
        ],
        kidHack: "Use 'Sword' toothpicks.",
        adultUpgrade: "Add extra lemon zest and black pepper.",
        hiddenVeg: "Fresh leafy greens.",
        steps: ["Use leftover roasted chicken.", "Toss with lettuce and lemon."]
    },
    {
        id: 'mon-dinner',
        day: 'Monday',
        mealType: 'dinner',
        theme: 'Transformation',
        title: 'Chicken Tomato Pasta',
        titleVeg: 'Tofu Tomato Pasta',
        chainId: 'chain-a',
        stepInChain: 3,
        energyUsage: 'hob',
        energyEfficiency: { method: 'hob', saving: '20%', note: 'Pre-cooked meat cuts hob time' },
        prepTime: '15 min',
        calories: '450 kcal',
        freshness: 1,
        image: 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?auto=format&fit=crop&w=400&q=80',
        ingredients: [
            { name: 'Whole Chicken', nameVeg: 'Firm Tofu', baseQty: 0.15, unit: 'pc', aisle: 'Meat & Fish' },
            { name: 'Pasta', baseQty: 75, unit: 'g', aisle: 'Pantry' },
            { name: 'Canned Chopped Tomatoes', baseQty: 0.5, unit: 'can', aisle: 'Pantry' },
            { name: 'Spinach', baseQty: 50, unit: 'g', aisle: 'Produce' }
        ],
        kidHack: "Call the spinach 'Green Power Leaves'.",
        adultUpgrade: "Add Worcestershire sauce and chilli flakes for a deep umami kick.",
        hiddenVeg: "Finely chopped spinach 'disappears' in the tomato sauce.",
        steps: ["Boil pasta.", "Simmer tomatoes with leftover chicken.", "Stir in spinach."]
    },

    // --- TUESDAY: CHAIN A RECOVERY ---
    {
        id: 'tue-bfast',
        day: 'Tuesday',
        mealType: 'breakfast',
        theme: 'Pantry Power',
        title: 'Honey Yogurt with Oats',
        titleVeg: 'Honey Yogurt with Oats',
        energyUsage: 'none',
        energyEfficiency: { method: 'none', saving: '100%', note: 'Zero fuel' },
        prepTime: '2 min',
        calories: '300 kcal',
        freshness: 2,
        image: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=400&q=80',
        ingredients: [
            { name: 'Oats', baseQty: 40, unit: 'g', aisle: 'Pantry' },
            { name: 'Greek Yogurt', baseQty: 50, unit: 'g', aisle: 'Dairy' },
            { name: 'Honey', baseQty: 0.5, unit: 'tbsp', aisle: 'Pantry' }
        ],
        kidHack: "Call it 'Sleepy Porridge'.",
        adultUpgrade: "Add a pinch of sea salt to the honey.",
        hiddenVeg: "Whole grain oats for sustained energy.",
        steps: ["Mix oats and yogurt in a bowl."]
    },
    {
        id: 'tue-lunch',
        day: 'Tuesday',
        mealType: 'lunch',
        theme: 'Wrap It',
        title: 'Chicken & Bean Burrito Wrap',
        titleVeg: 'Tofu & Bean Burrito Wrap',
        chainId: 'chain-a',
        stepInChain: 4,
        energyUsage: 'none',
        energyEfficiency: { method: 'none', saving: '100%', note: 'Cold assembly' },
        prepTime: '5 min',
        calories: '400 kcal',
        freshness: 2,
        image: 'https://images.unsplash.com/photo-1626700051175-6818013e184f?auto=format&fit=crop&w=400&q=80',
        ingredients: [
            { name: 'Taco Shells', baseQty: 1, unit: 'pc', aisle: 'Bakery' },
            { name: 'Canned Black Beans', baseQty: 0.25, unit: 'can', aisle: 'Pantry' },
            { name: 'Whole Chicken', nameVeg: 'Firm Tofu', baseQty: 0.05, unit: 'pc', aisle: 'Meat & Fish' },
            { name: 'Greek Yogurt', baseQty: 20, unit: 'g', aisle: 'Dairy' }
        ],
        kidHack: "Roll it like a 'treasure scroll'.",
        adultUpgrade: "Add a squeeze of lime and hot sauce.",
        hiddenVeg: "Black beans provide hidden fiber and protein.",
        steps: ["Use leftover chicken.", "Spread yogurt, add chicken and beans, roll."]
    },
    {
        id: 'tue-dinner',
        day: 'Tuesday',
        mealType: 'dinner',
        theme: 'Recovery',
        title: 'Chicken Bone Soup',
        titleVeg: 'Vegetable Medley Soup',
        chainId: 'chain-a',
        stepInChain: 5,
        energyUsage: 'hob',
        energyEfficiency: { method: 'hob', saving: '100%', note: 'Resource recovery from Sunday carcasses' },
        prepTime: '30 min',
        calories: '300 kcal',
        freshness: 3,
        image: 'https://images.unsplash.com/photo-1547592110-8036d3c2851d?auto=format&fit=crop&w=400&q=80',
        ingredients: [
            { name: 'Whole Chicken', nameVeg: 'Large Mushrooms', baseQty: 0.1, unit: 'pc', aisle: 'Meat & Fish' },
            { name: 'Potatoes', baseQty: 100, unit: 'g', aisle: 'Produce' },
            { name: 'Carrots', baseQty: 50, unit: 'g', aisle: 'Produce' }
        ],
        kidHack: "Call it 'Adventure Broth' with potato islands.",
        adultUpgrade: "Add a splash of Balsamic Vinegar for depth.",
        hiddenVeg: "Nutrient-dense bone broth or vegetable reduction.",
        steps: ["Boil chicken carcass (or veg) for stock.", "Add chopped veg and simmer until soft."]
    },

    // --- REST OF WEEK (SIMPLIFIED FOR REFACTOR) ---
    {
        id: 'wed-dinner',
        day: 'Wednesday',
        mealType: 'dinner',
        theme: 'Traybake',
        title: 'Hidden Veg Beef Bolognese',
        titleVeg: 'Hidden Veg Lentil Bolognese',
        energyUsage: 'hob',
        energyEfficiency: { method: 'hob', saving: '30%', note: 'Bulk prep base' },
        prepTime: '25 min',
        calories: '550 kcal',
        freshness: 2,
        image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=400&q=80',
        ingredients: [
            { name: 'Beef Mince', nameVeg: 'Canned Lentils', baseQty: 125, unit: 'g', aisle: 'Meat & Fish' },
            { name: 'Pasta', baseQty: 75, unit: 'g', aisle: 'Pantry' },
            { name: 'Canned Chopped Tomatoes', baseQty: 0.5, unit: 'can', aisle: 'Pantry' },
            { name: 'Carrots', baseQty: 50, unit: 'g', aisle: 'Produce' }
        ],
        kidHack: "Vegetables are 'invisible' in the red sauce.",
        adultUpgrade: "Stir in Balsamic Glaze and extra chilli flakes.",
        hiddenVeg: "Finely diced carrots and celery blended into sauce.",
        steps: ["Brown mince/lentils.", "Simmer with tomatoes and diced veg.", "Serve over pasta."]
    },
    {
        id: 'thu-dinner',
        day: 'Thursday',
        mealType: 'dinner',
        theme: 'Curry Night',
        title: 'Creamy Mild Korma',
        titleVeg: 'Creamy Chickpea Korma',
        energyUsage: 'hob',
        energyEfficiency: { method: 'hob', saving: '25%', note: 'Microwave rice saves energy' },
        prepTime: '20 min',
        calories: '600 kcal',
        freshness: 3,
        image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=400&q=80',
        ingredients: [
            { name: 'Chicken Thighs', nameVeg: 'Canned Chickpeas', baseQty: 150, unit: 'g', aisle: 'Meat & Fish' },
            { name: 'Greek Yogurt', baseQty: 60, unit: 'g', aisle: 'Dairy' },
            { name: 'Rice', baseQty: 75, unit: 'g', aisle: 'PantryCheck' }
        ],
        kidHack: "Call it 'Magic Yellow Stew'.",
        adultUpgrade: "Add Lime Pickle and fresh coriander.",
        hiddenVeg: "Pureed cauliflower thickened into the curry base.",
        steps: ["Cook chicken/chickpeas.", "Stir in yogurt and mild curry paste.", "Serve with rice."]
    },
    {
        id: 'fri-dinner',
        day: 'Friday',
        mealType: 'dinner',
        theme: 'Fakeaway',
        title: 'Air Fryer Burgers & Chips',
        titleVeg: 'Air Fryer Halloumi Burgers',
        energyUsage: 'air_fryer',
        energyEfficiency: { method: 'air_fryer', saving: '62%', note: 'No oven pre-heat needed' },
        prepTime: '20 min',
        calories: '650 kcal',
        freshness: 3,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80',
        ingredients: [
            { name: 'Beef Burger Patties', nameVeg: 'Halloumi Blocks', baseQty: 1, unit: 'pc', aisle: 'Meat & Fish' },
            { name: 'Potatoes', baseQty: 150, unit: 'g', aisle: 'Produce' }
        ],
        kidHack: "Draw faces with ketchup.",
        adultUpgrade: "Add Harissa Paste and lemon zest to the yogurt sauce.",
        hiddenVeg: "Hand-cut potato wedges (skin on) for better fiber.",
        steps: ["Air fry chips for 15 mins.", "Air fry patties for 10 mins.", "Assemble."]
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
