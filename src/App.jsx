import React, { useState, useMemo, useEffect } from 'react';
import { RECIPES, BUDGET_MODIFIERS, AISLES } from './data/recipes';
import './index.css';

const App = () => {
    // --- HELPERS ---
    const getStored = (key, fallback) => {
        const item = localStorage.getItem(key);
        try {
            return item ? JSON.parse(item) : fallback;
        } catch {
            return fallback;
        }
    };

    // --- STATE ---
    const [adults, setAdults] = useState(() => getStored('sc-adults', 2));
    const [kids, setKids] = useState(() => getStored('sc-kids', 2));
    const [budgetTier, setBudgetTier] = useState(() => getStored('sc-budget', 'balanced'));
    const [isVegetarian, setIsVegetarian] = useState(() => getStored('sc-veggie', false));
    const [activeTab, setActiveTab] = useState('plan'); // 'plan' | 'shop' | 'cook'
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [checkedItems, setCheckedItems] = useState(() => getStored('sc-checked', {}));

    // --- PERSISTENCE ---
    useEffect(() => { localStorage.setItem('sc-adults', JSON.stringify(adults)); }, [adults]);
    useEffect(() => { localStorage.setItem('sc-kids', JSON.stringify(kids)); }, [kids]);
    useEffect(() => { localStorage.setItem('sc-budget', JSON.stringify(budgetTier)); }, [budgetTier]);
    useEffect(() => { localStorage.setItem('sc-veggie', JSON.stringify(isVegetarian)); }, [isVegetarian]);
    useEffect(() => { localStorage.setItem('sc-checked', JSON.stringify(checkedItems)); }, [checkedItems]);

    // --- LOGIC ---
    const familyPoints = useMemo(() => adults + (kids * 0.7), [adults, kids]);

    const filteredRecipes = useMemo(() => {
        return RECIPES.map(recipe => ({
            ...recipe,
            displayTitle: isVegetarian ? recipe.titleVeg : recipe.title,
            displayIngredients: recipe.ingredients.map(ing => ({
                ...ing,
                name: (isVegetarian && ing.nameVeg) ? ing.nameVeg : ing.name,
                qty: (ing.baseQty * familyPoints).toFixed(ing.unit === 'pc' ? 0 : 1)
            }))
        }));
    }, [familyPoints, isVegetarian]);

    const shoppingList = useMemo(() => {
        const list = {};
        filteredRecipes.forEach(recipe => {
            recipe.displayIngredients.forEach(ing => {
                if (ing.aisle === 'PantryCheck') return;
                const key = `${ing.name}-${ing.unit}`;
                if (!list[key]) {
                    list[key] = { ...ing, totalQty: 0 };
                }
                list[key].totalQty += parseFloat(ing.qty);
            });
        });
        return Object.values(list).sort((a, b) => AISLES.indexOf(a.aisle) - AISLES.indexOf(b.aisle));
    }, [filteredRecipes]);

    const toggleChecked = (id) => {
        setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
    };

    // --- RENDER HELPERS ---
    const renderDashboard = () => (
        <div className="glass-card animate-fade" style={{ padding: '2rem', position: 'sticky', top: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>🍳 Settings</h2>

            <div className="control-group">
                <label className="label-fancy">Family Mix: {adults}A + {kids}K</label>
                <div style={{ marginBottom: '10px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Adults: {adults}</span>
                    <input
                        type="range" min="1" max="4" step="1"
                        value={adults}
                        onChange={(e) => setAdults(parseInt(e.target.value))}
                    />
                </div>
                <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Kids: {kids}</span>
                    <input
                        type="range" min="0" max="4" step="1"
                        value={kids}
                        onChange={(e) => setKids(parseInt(e.target.value))}
                    />
                </div>
            </div>

            <div className="control-group">
                <label className="label-fancy">Budget Tier</label>
                <div className="toggle-group">
                    {Object.entries(BUDGET_MODIFIERS).map(([key, value]) => (
                        <button
                            key={key}
                            className={`toggle-btn ${budgetTier === key ? 'active' : ''}`}
                            onClick={() => setBudgetTier(key)}
                        >
                            {value.label.split(' ')[0]}
                        </button>
                    ))}
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                    {BUDGET_MODIFIERS[budgetTier].description}
                </p>
            </div>

            <div className="control-group">
                <label className="label-fancy">Dietary Mode</label>
                <div className="toggle-group">
                    <button
                        className={`toggle-btn ${!isVegetarian ? 'active' : ''}`}
                        onClick={() => setIsVegetarian(false)}
                    >
                        Standard
                    </button>
                    <button
                        className={`toggle-btn ${isVegetarian ? 'active' : ''}`}
                        onClick={() => setIsVegetarian(true)}
                    >
                        Vegetarian
                    </button>
                </div>
            </div>

            <div className="stats" style={{ marginTop: '2rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.9rem' }}>Est. Weekly Cost:</span>
                    <span style={{ fontWeight: 700, color: 'var(--primary)' }}>
                        £{(familyPoints * (budgetTier === 'savvy' ? 12 : budgetTier === 'balanced' ? 22 : 35)).toFixed(2)}
                    </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.9rem' }}>Waste Reduced:</span>
                    <span style={{ fontWeight: 700, color: '#2d6a4f' }}>🌿 98%</span>
                </div>

                <div style={{ background: '#f1f3f5', padding: '12px', borderRadius: '8px', fontSize: '0.8rem' }}>
                    <strong style={{ color: 'var(--primary)', display: 'block', marginBottom: '4px' }}>💡 Pro Tip:</strong>
                    {budgetTier === 'savvy' ? "Swap fresh herbs for dried in the curry to save £2.50." : "Batch-cook your potatoes on Sunday for the Monday salmon side."}
                </div>
            </div>
        </div>
    );

    const renderPlan = () => (
        <div className="grid-recipes" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
            {filteredRecipes.map(recipe => (
                <div key={recipe.id} className="glass-card animate-fade" style={{ overflow: 'hidden', cursor: 'pointer', borderRadius: 'var(--radius-lg)' }} onClick={() => { setSelectedRecipe(recipe); setActiveTab('cook'); }}>
                    <div style={{ height: '220px', background: `url(${recipe.image}) center/cover`, position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(255,255,255,0.95)', padding: '6px 12px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 800, color: 'var(--primary)', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                            {recipe.freshness === 1 ? '❄️ High Freshness' : recipe.freshness === 2 ? '🥕 Mid-life' : '🥫 Pantry Hero'}
                        </div>
                        <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', background: 'linear-gradient(transparent, rgba(0,0,0,0.6))', padding: '20px 1.5rem', opacity: 0.8 }}>
                            <span style={{ color: 'white', fontWeight: 800, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                                {recipe.freshness === 1 ? 'Eat within 48h' : recipe.freshness === 2 ? 'Store in crisper' : 'Great fallback'}
                            </span>
                        </div>
                    </div>
                    <div style={{ padding: '1.5rem' }}>
                        <span style={{ color: 'var(--accent)', fontWeight: 800, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{recipe.day} • {recipe.theme}</span>
                        <h3 style={{ marginTop: '4px', fontSize: '1.2rem' }}>{recipe.displayTitle}</h3>
                        <div style={{ display: 'flex', gap: '15px', marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                            <span>⏱️ {recipe.prepTime}</span>
                            <span>🔥 {recipe.calories}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderShop = () => {
        const grouped = shoppingList.reduce((acc, item) => {
            if (!acc[item.aisle]) acc[item.aisle] = [];
            acc[item.aisle].push(item);
            return acc;
        }, {});

        return (
            <div className="animate-fade">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h2>🛒 Smart Shopping List</h2>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button className="btn btn-outline" onClick={() => window.print()}>🖨️ Print List</button>
                        <button className="btn btn-primary" onClick={() => {
                            const text = shoppingList.map(i => `- ${i.totalQty}${i.unit} ${i.name}`).join('\n');
                            navigator.clipboard.writeText(text);
                            alert('Copied to WhatsApp!');
                        }}>📱 WhatsApp</button>
                    </div>
                </div>

                {AISLES.filter(a => grouped[a]).map(aisle => (
                    <div key={aisle} style={{ marginBottom: '2rem' }}>
                        <h4 style={{ borderBottom: '2px solid var(--accent)', paddingBottom: '4px', marginBottom: '1rem', textTransform: 'uppercase', display: 'flex', justifyContent: 'space-between' }}>
                            <span>{aisle}</span>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{grouped[aisle].length} Items</span>
                        </h4>
                        <div className="shopping-grid" style={{ display: 'grid', gap: '10px' }}>
                            {grouped[aisle].map(item => (
                                <div
                                    key={item.name}
                                    className="glass-card"
                                    style={{
                                        padding: '1rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        opacity: checkedItems[item.name] ? 0.4 : 1,
                                        textDecoration: checkedItems[item.name] ? 'line-through' : 'none',
                                        borderLeft: checkedItems[item.name] ? '4px solid #ccc' : '4px solid var(--accent)'
                                    }}
                                    onClick={() => toggleChecked(item.name)}
                                >
                                    <input type="checkbox" checked={!!checkedItems[item.name]} readOnly />
                                    <span style={{ fontWeight: 600, minWidth: '80px' }}>{item.totalQty.toFixed(1)} {item.unit}</span>
                                    <span>{item.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const renderCook = () => {
        if (!selectedRecipe) return (
            <div className="flex-center landing-hero animate-fade">
                <div>
                    <h1>Get Cooking!</h1>
                    <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>Select a ritual from the planner to begin your interactive experience.</p>
                    <button className="btn btn-primary" style={{ marginTop: '2rem', background: 'white', color: 'var(--primary)' }} onClick={() => setActiveTab('plan')}>Open Planner</button>
                </div>
            </div>
        );

        return (
            <div className="animate-fade" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <button className="btn btn-outline" style={{ marginBottom: '1rem' }} onClick={() => setActiveTab('plan')}>← Back to Planner</button>
                <div className="glass-card" style={{ padding: '2rem' }}>
                    <img src={selectedRecipe.image} style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }} alt="" />
                    <h1>{selectedRecipe.displayTitle}</h1>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Perfect for {selectedRecipe.day} • {selectedRecipe.theme}</p>

                    <div style={{ background: '#fff9db', padding: '1.5rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', borderLeft: '5px solid #fcc419' }}>
                        <h4 style={{ color: '#856404' }}>👶 Kid Hack</h4>
                        <p style={{ fontStyle: 'italic', marginTop: '5px' }}>{selectedRecipe.kidHack}</p>
                    </div>

                    <div style={{ background: '#e9fac8', padding: '1.5rem', borderRadius: 'var(--radius-sm)', marginBottom: '2rem', borderLeft: '5px solid #82c91e' }}>
                        <h4 style={{ color: '#3b7602' }}>💡 Smart Swaps</h4>
                        <p style={{ fontSize: '0.9rem', marginTop: '5px' }}>
                            No {selectedRecipe.displayIngredients[0].name}? Try <strong>{isVegetarian ? 'Firm Tofu' : 'Chicken'}</strong> or <strong>Zucchini</strong> instead.
                        </p>
                    </div>

                    <h3>Ingredients</h3>
                    <ul style={{ listStyle: 'none', margin: '1.5rem 0 2rem' }}>
                        {selectedRecipe.displayIngredients.map(ing => (
                            <li key={ing.name} style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>
                                <strong>{ing.qty} {ing.unit}</strong> {ing.name}
                            </li>
                        ))}
                    </ul>

                    <h3>Step-by-Step</h3>
                    <div style={{ marginTop: '1.5rem' }}>
                        {selectedRecipe.steps.map((step, idx) => (
                            <div
                                key={idx}
                                className="glass-card"
                                style={{
                                    padding: '1.5rem',
                                    marginBottom: '1rem',
                                    display: 'flex',
                                    gap: '1rem',
                                    cursor: 'pointer',
                                    borderLeft: checkedItems[`step-${selectedRecipe.id}-${idx}`] ? '5px solid var(--accent)' : '5px solid transparent'
                                }}
                                onClick={() => toggleChecked(`step-${selectedRecipe.id}-${idx}`)}
                            >
                                <span style={{ fontWeight: 700, color: 'var(--accent)', fontSize: '1.2rem' }}>{idx + 1}</span>
                                <p style={{
                                    textDecoration: checkedItems[`step-${selectedRecipe.id}-${idx}`] ? 'line-through' : 'none',
                                    color: checkedItems[`step-${selectedRecipe.id}-${idx}`] ? 'var(--text-muted)' : 'var(--text-main)'
                                }}>{step}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="app-container">
            <header className="main-header">
                <div>
                    <h1 style={{ fontSize: '3.5rem', letterSpacing: '-2px', textTransform: 'uppercase', lineHeight: 0.9 }}>
                        Sous Chef <span style={{ color: '#52b788', fontWeight: 300 }}>UK</span>
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontWeight: 600, marginTop: '8px', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.8rem' }}>
                        The Digital Supply Chain for your Kitchen
                    </p>
                </div>
                <nav className="glass-card" style={{ padding: '0.4rem', display: 'flex', gap: '5px', borderRadius: '50px', background: 'var(--primary)' }}>
                    <button className={`btn ${activeTab === 'plan' ? 'btn-primary' : ''}`} style={{ background: activeTab === 'plan' ? 'var(--accent)' : 'transparent', color: 'white', borderRadius: '50px' }} onClick={() => setActiveTab('plan')}>📅 Plan</button>
                    <button className={`btn ${activeTab === 'shop' ? 'btn-primary' : ''}`} style={{ background: activeTab === 'shop' ? 'var(--accent)' : 'transparent', color: 'white', borderRadius: '50px' }} onClick={() => setActiveTab('shop')}>🛒 Shop</button>
                    <button className={`btn ${activeTab === 'cook' ? 'btn-primary' : ''}`} style={{ background: activeTab === 'cook' ? 'var(--accent)' : 'transparent', color: 'white', borderRadius: '50px' }} onClick={() => setActiveTab('cook')}>👨‍🍳 Cook</button>
                </nav>
            </header>

            <div className="grid-main">
                <aside>
                    {renderDashboard()}
                </aside>

                <main>
                    {activeTab === 'plan' && renderPlan()}
                    {activeTab === 'shop' && renderShop()}
                    {activeTab === 'cook' && renderCook()}
                </main>
            </div>
        </div>
    );
};

export default App;
