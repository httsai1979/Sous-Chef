import React, { useState, useMemo, useEffect, useCallback } from 'react';
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
    const [activeTab, setActiveTab] = useState('plan'); // 'plan' | 'shop' | 'cook' | 'dashboard'
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

    // --- WAKE LOCK API ---
    useEffect(() => {
        let wakeLock = null;
        const requestWakeLock = async () => {
            if ('wakeLock' in navigator && selectedRecipe) {
                try {
                    wakeLock = await navigator.wakeLock.request('screen');
                    console.log('Wake Lock is active');
                } catch (err) {
                    console.error(`${err.name}, ${err.message}`);
                }
            }
        };

        if (selectedRecipe) {
            requestWakeLock();
        }

        return () => {
            if (wakeLock !== null) {
                wakeLock.release().then(() => {
                    wakeLock = null;
                    console.log('Wake Lock released');
                });
            }
        };
    }, [selectedRecipe]);

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

    const toggleChecked = useCallback((id) => {
        setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
    }, []);

    // --- RENDER HELPERS ---
    const renderLogin = () => (
        <div className="login-overlay animate-fade">
            <div className="glass-card login-modal">
                <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🥗</div>
                <h2 style={{ fontSize: '2.2rem', letterSpacing: '-1.5px' }}>Sous Chef <span style={{ color: 'var(--accent)' }}>UK</span></h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>Digital Supply Chain for Families</p>
                <button
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '1.2rem', borderRadius: '50px', fontSize: '1.1rem', boxShadow: '0 10px 30px rgba(27, 67, 50, 0.2)' }}
                    onClick={() => setUser({ name: 'James', email: 'james@example.com' })}
                >
                    Continue with Google
                </button>
            </div>
        </div>
    );

    const renderDashboard = () => (
        <div className="glass-card dashboard-card animate-fade">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.2rem' }}>⚙️</span> Family Setup
            </h3>
            <div className="control-group" style={{ background: 'rgba(0,0,0,0.02)', padding: '1.5rem', borderRadius: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.95rem', fontWeight: 600 }}>
                    <span>👨‍👩‍👧‍👦 Family Size</span>
                    <span style={{ color: 'var(--primary)' }}>{adults + kids} People</span>
                </div>
                <input type="range" min="1" max="6" value={adults + kids} onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setAdults(Math.ceil(val / 2));
                    setKids(Math.floor(val / 2));
                }} className="modern-range" />
            </div>

            <button className={`btn ${isVegetarian ? 'btn-primary' : 'btn-outline'}`} style={{ width: '100%', marginBottom: '1.5rem', padding: '1rem' }} onClick={() => setIsVegetarian(!isVegetarian)}>
                {isVegetarian ? '🌿 Plant-Based Mode Active' : '🥩 Standard Mode Active'}
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

            <button className="btn btn-outline" style={{ marginTop: '2.5rem', width: '100%', fontSize: '0.85rem', border: '1px solid #eee', color: '#999' }} onClick={() => setUser(null)}>Sign Out ({user?.name})</button>
        </div>
    );

    const renderPlan = () => (
        <div className="animate-fade">
            {Object.entries(recipesByDay).map(([day, meals]) => (
                <div key={day} style={{ marginBottom: '3.5rem' }}>
                    <h2 className="day-header" style={{ marginBottom: '1.2rem' }}>📅 {day}</h2>
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
                                        <h4 style={{ fontSize: '1.1rem', marginBottom: '10px' }}>{recipe.displayTitle}</h4>
                                        <div className="recipe-footer" style={{ marginTop: 'auto' }}>
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
                <div className="view-header" style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.8rem' }}>🛒 Smart Shopping List</h2>
                    <p style={{ color: 'var(--text-muted)' }}>1 weekly trip, 0 food waste. Optimized for UK logistics.</p>
                </div>
                {AISLES.filter(a => grouped[a]).map(aisle => (
                    <div key={aisle} className="aisle-section">
                        <h4 style={{ color: 'var(--primary)', marginBottom: '12px', fontSize: '0.9rem' }}>{aisle}</h4>
                        {grouped[aisle].map(item => (
                            <div key={item.name}
                                className={`glass-card shop-item ${checkedItems[item.name] ? 'checked' : ''}`}
                                onClick={() => toggleChecked(item.name)}>
                                <div className="checkbox-hitarea">
                                    <div className="checkbox"></div>
                                </div>
                                <span className="item-name" style={{ fontSize: '1.05rem' }}>{item.totalQty.toFixed(1)}{item.unit} {item.name}</span>
                                {item.usedIn.length > 1 && <span className="recycle-icon" title="Used in multiple meals">♻️</span>}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        );
    };

    const renderCook = () => {
        if (!selectedRecipe) return (
            <div className="flex-center empty-cook" style={{ padding: '3rem' }}>
                <span style={{ fontSize: '4rem' }}>🍳</span>
                <h2 style={{ margin: '1rem 0' }}>Chef Focus Mode</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Select a recipe from the Planner to start your zero-waste cooking journey.</p>
                <button className="btn btn-primary" onClick={() => setActiveTab('plan')}>Open Weekly Planner</button>
            </div>
        );

        return (
            <div className="animate-fade cook-view">
                <button className="btn-back" onClick={() => setActiveTab('plan')}>← Back to Strategy</button>
                <div className="glass-card active-recipe" style={{ position: 'relative' }}>
                    <div className="wakelock-indicator">
                        ⚡ Screen Always On
                    </div>
                    <div className="recipe-header-main" style={{ backgroundImage: `url(${selectedRecipe.image})` }}>
                        <div className="header-overlay">
                            <h1 style={{ fontSize: '2.2rem' }}>{selectedRecipe.displayTitle}</h1>
                            <p style={{ opacity: 0.9 }}>{selectedRecipe.day} • {selectedRecipe.theme} Protocol</p>
                        </div>
                    </div>

                    <div className="recipe-info-row">
                        <div className="info-box kids">
                            <strong style={{ display: 'block', marginBottom: '5px' }}>👶 Kid Hack</strong>
                            {selectedRecipe.kidHack}
                        </div>
                        {selectedRecipe.adultUpgrade && (
                            <div className="info-box adults">
                                <strong style={{ display: 'block', marginBottom: '5px' }}>🍷 Adult Upgrade</strong>
                                {selectedRecipe.adultUpgrade}
                            </div>
                        )}
                    </div>

                    <div className="ingredients-section" style={{ background: '#fafafa', padding: '2rem' }}>
                        <h3 style={{ marginBottom: '1rem' }}>Ingredients Needed</h3>
                        <div className="ing-grid">
                            {selectedRecipe.displayIngredients.map(ing => (
                                <div key={ing.name} className="ing-item" style={{ padding: '8px', background: 'white', borderRadius: '8px', border: '1px solid #eee' }}>
                                    • {ing.qty} {ing.unit} <strong>{ing.name}</strong>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="steps-section" style={{ padding: '2rem' }}>
                        <h3 style={{ marginBottom: '1.5rem' }}>Interactive Methodology</h3>
                        {selectedRecipe.steps.map((step, idx) => (
                            <div key={idx}
                                className={`glass-card step-card ${checkedItems[`step-${selectedRecipe.id}-${idx}`] ? 'completed' : ''}`}
                                onClick={() => toggleChecked(`step-${selectedRecipe.id}-${idx}`)}>
                                <div className="step-number">{idx + 1}</div>
                                <p style={{ fontSize: '1.05rem', lineHeight: '1.6' }}>{step}</p>
                            </div>
                        ))}
                    </div>
                    <div style={{ padding: '0 2rem 2rem' }}>
                        <button className="btn btn-primary" style={{ width: '100%', padding: '1.2rem', borderRadius: '16px' }} onClick={() => setSelectedRecipe(null)}>Complete Meal Protocol</button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="app-container">
            {!user && renderLogin()}
            <header className="app-header desktop-header">
                <div>
                    <h1 style={{ fontSize: '2.2rem', letterSpacing: '-2px' }}>Sous Chef <span className="accent-text">UK</span></h1>
                    <div className="header-stats">
                        <span>🛡️ Secure Supply Chain</span>
                        <span>🌿 {energySavingsScore}% Energy Efficiency</span>
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
                    <span className="label">Plan</span>
                </button>
                <button className={`nav-tab ${activeTab === 'shop' ? 'active' : ''}`} onClick={() => setActiveTab('shop')}>
                    <span className="icon">🛒</span>
                    <span className="label">Shop</span>
                </button>
                <button className={`nav-tab ${activeTab === 'cook' ? 'active' : ''}`} onClick={() => setActiveTab('cook')}>
                    <span className="icon">🍳</span>
                    <span className="label">Cook</span>
                </button>
                <button className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
                    <span className="icon">⚙️</span>
                    <span className="label">Setup</span>
                </button>
            </nav>
        </div>
    );
};

export default App;
