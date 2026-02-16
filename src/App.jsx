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
    const [user, setUser] = useState(() => getStored('sc-user', null));
    const [isSyncing, setIsSyncing] = useState(false);
    const [lastSynced, setLastSynced] = useState(() => getStored('sc-last-sync', null));

    const [adults, setAdults] = useState(() => getStored('sc-adults', 2));
    const [kids, setKids] = useState(() => getStored('sc-kids', 2));
    const [budgetTier, setBudgetTier] = useState(() => getStored('sc-budget', 'balanced'));
    const [isVegetarian, setIsVegetarian] = useState(() => getStored('sc-veggie', false));
    const [activeTab, setActiveTab] = useState('plan'); // 'plan' | 'shop' | 'cook'
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [checkedItems, setCheckedItems] = useState(() => getStored('sc-checked', {}));

    // --- PERSISTENCE ---
    useEffect(() => { localStorage.setItem('sc-user', JSON.stringify(user)); }, [user]);
    useEffect(() => { localStorage.setItem('sc-adults', JSON.stringify(adults)); }, [adults]);
    useEffect(() => { localStorage.setItem('sc-kids', JSON.stringify(kids)); }, [kids]);
    useEffect(() => { localStorage.setItem('sc-budget', JSON.stringify(budgetTier)); }, [budgetTier]);
    useEffect(() => { localStorage.setItem('sc-veggie', JSON.stringify(isVegetarian)); }, [isVegetarian]);
    useEffect(() => { localStorage.setItem('sc-checked', JSON.stringify(checkedItems)); }, [checkedItems]);
    useEffect(() => { localStorage.setItem('sc-last-sync', JSON.stringify(lastSynced)); }, [lastSynced]);

    // --- LOGIC ---
    const familyPoints = useMemo(() => adults + (kids * 0.7), [adults, kids]);

    const filteredRecipes = useMemo(() => {
        return RECIPES.map(recipe => {
            const displayIngs = recipe.ingredients.map(ing => ({
                ...ing,
                name: (isVegetarian && ing.nameVeg) ? ing.nameVeg : ing.name,
                qty: (ing.baseQty * familyPoints).toFixed(ing.unit === 'pc' ? 0 : 1)
            }));
            return {
                ...recipe,
                displayTitle: isVegetarian ? recipe.titleVeg : recipe.title,
                displayIngredients: displayIngs,
                shareFactor: displayIngs.filter(i => RECIPES.filter(r => r.id !== recipe.id).some(r => r.ingredients.some(ri => ri.name === i.name))).length
            };
        });
    }, [familyPoints, isVegetarian]);

    const recipesByDay = useMemo(() => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const grouped = {};
        days.forEach(d => grouped[d] = { breakfast: null, lunch: null, dinner: null });
        filteredRecipes.forEach(r => {
            if (grouped[r.day]) grouped[r.day][r.mealType] = r;
        });
        return grouped;
    }, [filteredRecipes]);

    const energySavingsScore = useMemo(() => {
        const totalMeals = filteredRecipes.length || 1;
        const efficientMeals = filteredRecipes.filter(r =>
            r.energyUsage === 'none' || r.energyUsage === 'air_fryer' || r.energyUsage === 'microwave'
        ).length;
        return Math.round((efficientMeals / totalMeals) * 100);
    }, [filteredRecipes]);

    const shoppingList = useMemo(() => {
        const list = {};
        filteredRecipes.forEach(recipe => {
            recipe.displayIngredients.forEach(ing => {
                if (ing.aisle === 'PantryCheck') return;
                const key = `${ing.name}-${ing.unit}`;
                if (!list[key]) list[key] = { ...ing, totalQty: 0, usedIn: [] };
                list[key].totalQty += parseFloat(ing.qty);
                if (!list[key].usedIn.includes(recipe.displayTitle)) list[key].usedIn.push(recipe.displayTitle);
            });
        });
        return Object.values(list).sort((a, b) => AISLES.indexOf(a.aisle) - AISLES.indexOf(b.aisle));
    }, [filteredRecipes]);

    const toggleChecked = (id) => {
        setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
    };

    // --- RENDER HELPERS ---
    const renderLogin = () => (
        <div className="login-overlay animate-fade">
            <div className="glass-card login-modal">
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🥗</div>
                <h2>Sous Chef UK</h2>
                <p>Digital Supply Chain for Families</p>
                <button
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '1rem', borderRadius: '50px' }}
                    onClick={() => setUser({ name: 'James', email: 'james@example.com' })}
                >
                    Continue with Google
                </button>
            </div>
        </div>
    );

    const renderDashboard = () => (
        <div className="glass-card dashboard-card animate-fade">
            <h3>⚙️ Family Setup</h3>
            <div className="control-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.9rem' }}>
                    <span>👨‍👩‍👧‍👦 Family Size</span>
                    <span style={{ fontWeight: 800, color: 'var(--primary)' }}>{adults + kids} People</span>
                </div>
                <input type="range" min="1" max="6" value={adults + kids} onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setAdults(Math.ceil(val / 2));
                    setKids(Math.floor(val / 2));
                }} />
            </div>

            <button className={`btn ${isVegetarian ? 'btn-primary' : 'btn-outline'}`} style={{ width: '100%', marginBottom: '1.5rem' }} onClick={() => setIsVegetarian(!isVegetarian)}>
                {isVegetarian ? '🌿 Plant-Based Mode' : '🥩 Standard Mode'}
            </button>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-label">Efficiency</div>
                    <div className="stat-value">£{(familyPoints * 14).toFixed(0)}</div>
                    <div className="stat-sub">Weekly Saving</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Eco Score</div>
                    <div className="stat-value">{energySavingsScore}%</div>
                    <div className="stat-sub">Low Energy</div>
                </div>
            </div>

            <button className="btn btn-outline" style={{ marginTop: '2rem', width: '100%', fontSize: '0.8rem', border: 'none', color: '#888' }} onClick={() => setUser(null)}>Sign Out</button>
        </div>
    );

    const renderPlan = () => (
        <div className="animate-fade">
            {Object.entries(recipesByDay).map(([day, meals]) => (
                <div key={day} style={{ marginBottom: '3rem' }}>
                    <h2 className="day-header">📅 {day}</h2>
                    <div className="recipe-grid">
                        {['breakfast', 'lunch', 'dinner'].map(type => {
                            const recipe = meals[type];
                            if (!recipe) return null;
                            return (
                                <div key={recipe.id} className="glass-card recipe-card" onClick={() => { setSelectedRecipe(recipe); setActiveTab('cook'); window.scrollTo(0, 0); }}>
                                    <div className="recipe-image" style={{ backgroundImage: `url(${recipe.image})` }}>
                                        <div className="recipe-badge">{type}</div>
                                        {recipe.chainId && <div className="chain-badge">🔗 Chain {recipe.stepInChain}</div>}
                                    </div>
                                    <div className="recipe-content">
                                        <div className="recipe-meta">{recipe.prepTime} • {recipe.calories}</div>
                                        <h4>{recipe.displayTitle}</h4>
                                        <div className="recipe-footer">
                                            {recipe.energyEfficiency && <span className="energy-tag">⚡ {recipe.energyEfficiency.saving} Saving</span>}
                                            {recipe.shareFactor > 2 && <span className="share-tag">♻️ Shared</span>}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
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
            <div className="animate-fade shop-view">
                <div className="view-header">
                    <h2>🛒 Smart Shopping List</h2>
                    <p>Optimized for zero-waste ingredient flow.</p>
                </div>
                {AISLES.filter(a => grouped[a]).map(aisle => (
                    <div key={aisle} className="aisle-section">
                        <h4>{aisle}</h4>
                        {grouped[aisle].map(item => (
                            <div key={item.name} className={`glass-card shop-item ${checkedItems[item.name] ? 'checked' : ''}`} onClick={() => toggleChecked(item.name)}>
                                <div className="checkbox"></div>
                                <span className="item-name">{item.totalQty.toFixed(1)}{item.unit} {item.name}</span>
                                {item.usedIn.length > 1 && <span className="recycle-icon">♻️</span>}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        );
    };

    const renderCook = () => {
        if (!selectedRecipe) return (
            <div className="flex-center empty-cook">
                <h1>🍳</h1>
                <p>Select a recipe from the Planner to start cooking.</p>
                <button className="btn btn-primary" onClick={() => setActiveTab('plan')}>Open Planner</button>
            </div>
        );

        return (
            <div className="animate-fade cook-view">
                <button className="btn-back" onClick={() => setActiveTab('plan')}>← Back to Planner</button>
                <div className="glass-card active-recipe">
                    <div className="recipe-header-main" style={{ backgroundImage: `url(${selectedRecipe.image})` }}>
                        <div className="header-overlay">
                            <h1>{selectedRecipe.displayTitle}</h1>
                            <p>{selectedRecipe.day} • {selectedRecipe.theme}</p>
                        </div>
                    </div>

                    <div className="recipe-info-row">
                        <div className="info-box kids">
                            <strong>👶 Kid Hack:</strong> {selectedRecipe.kidHack}
                        </div>
                        {selectedRecipe.adultUpgrade && (
                            <div className="info-box adults">
                                <strong>🍷 Adult Upgrade:</strong> {selectedRecipe.adultUpgrade}
                            </div>
                        )}
                    </div>

                    <div className="ingredients-section">
                        <h3>Ingredients Needed</h3>
                        <div className="ing-grid">
                            {selectedRecipe.displayIngredients.map(ing => (
                                <div key={ing.name} className="ing-item">• {ing.qty} {ing.unit} <strong>{ing.name}</strong></div>
                            ))}
                        </div>
                    </div>

                    <div className="steps-section">
                        <h3>Method</h3>
                        {selectedRecipe.steps.map((step, idx) => (
                            <div key={idx} className={`glass-card step-card ${checkedItems[`step-${selectedRecipe.id}-${idx}`] ? 'completed' : ''}`} onClick={() => toggleChecked(`step-${selectedRecipe.id}-${idx}`)}>
                                <div className="step-number">{idx + 1}</div>
                                <p>{step}</p>
                            </div>
                        ))}
                    </div>
                    <button className="btn btn-outline" style={{ width: '100%', marginTop: '2rem' }} onClick={() => setSelectedRecipe(null)}>Finish Cooking</button>
                </div>
            </div>
        );
    };

    return (
        <div className="app-container">
            {!user && renderLogin()}
            <header className="app-header">
                <div>
                    <h1>Sous Chef <span className="accent-text">UK</span></h1>
                    <div className="header-stats">
                        <span>🛡️ Cloud Sync</span>
                        <span>🌿 {energySavingsScore}% Savings</span>
                    </div>
                </div>
            </header>

            <div className="main-layout">
                <aside className="desktop-aside">
                    {user && renderDashboard()}
                </aside>
                <main className="content-area">
                    {activeTab === 'dashboard' && <div className="mobile-only">{renderDashboard()}</div>}
                    {activeTab === 'plan' && renderPlan()}
                    {activeTab === 'shop' && renderShop()}
                    {activeTab === 'cook' && renderCook()}
                </main>
            </div>

            <nav className="mobile-tab-nav">
                <button className={`nav-tab ${activeTab === 'plan' ? 'active' : ''}`} onClick={() => setActiveTab('plan')}>
                    <span className="icon">📅</span>
                    <span className="label">Planner</span>
                </button>
                <button className={`nav-tab ${activeTab === 'shop' ? 'active' : ''}`} onClick={() => setActiveTab('shop')}>
                    <span className="icon">🛒</span>
                    <span className="label">Shop</span>
                </button>
                <button className={`nav-tab ${activeTab === 'cook' ? 'active' : ''}`} onClick={() => setActiveTab('cook')}>
                    <span className="icon">🍳</span>
                    <span className="label">Cook</span>
                </button>
                <button className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''} mobile-only`} onClick={() => setActiveTab('dashboard')}>
                    <span className="icon">⚙️</span>
                    <span className="label">Setup</span>
                </button>
            </nav>
        </div>
    );
};

export default App;
