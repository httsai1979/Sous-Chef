import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { RECIPES, BUDGET_MODIFIERS, AISLES } from './data/recipes';
import { FiCalendar, FiShoppingCart, FiMap, FiSettings, FiCheckCircle, FiShare2, FiZap, FiBox } from 'react-icons/fi';
import './index.css';

// --- SUB-COMPONENTS ---

const SettingsPanel = ({ adults, kids, setAdults, setKids, isVegetarian, setIsVegetarian, familyPoints, energySavingsScore, setUser, user, pantry, setPantry }) => (
    <div className="glass-card dashboard-card animate-fade">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
            <FiSettings /> Configuration Hub
        </h3>

        <div className="control-group">
            <div className="label-row">
                <span>👨‍👩‍👧‍👦 Family Population</span>
                <span className="value-highlight">{adults + kids} People</span>
            </div>
            <input type="range" min="1" max="6" value={adults + kids} onChange={(e) => {
                const val = parseInt(e.target.value);
                setAdults(Math.ceil(val / 2));
                setKids(Math.floor(val / 2));
            }} className="modern-range" />
        </div>

        <button className={`btn ${isVegetarian ? 'btn-primary' : 'btn-outline'}`}
            style={{ width: '100%', marginBottom: '1.5rem' }}
            onClick={() => setIsVegetarian(!isVegetarian)}>
            {isVegetarian ? '🌿 Plant-Based Strategy' : '🥩 Standard Strategy'}
        </button>

        <div className="pantry-section" style={{ marginBottom: '1.5rem' }}>
            <div className="label-row" style={{ marginBottom: '0.8rem' }}>
                <span>📦 Pantry Stock Check</span>
                <FiBox />
            </div>
            <div className="pantry-grid">
                {['Pasta', 'Rice', 'Oats', 'Honey', 'Canned Tomatoes'].map(item => (
                    <button key={item}
                        className={`pantry-chip ${pantry[item] ? 'active' : ''}`}
                        onClick={() => setPantry(prev => ({ ...prev, [item]: !prev[item] }))}>
                        {pantry[item] ? '✅' : '+'} {item}
                    </button>
                ))}
            </div>
        </div>

        <div className="stats-grid">
            <div className="stat-card">
                <div className="stat-label">Portion Efficiency</div>
                <div className="stat-value">£{(familyPoints * 14).toFixed(0)}</div>
                <div className="stat-sub">EST. Weekly Saving</div>
            </div>
            <div className="stat-card">
                <div className="stat-label">Eco Score</div>
                <div className="stat-value">{energySavingsScore}%</div>
                <div className="stat-sub">Air Fryer / Hob Mix</div>
            </div>
        </div>

        <button className="btn btn-ghost"
            style={{ marginTop: '2.5rem', width: '100%', fontSize: '0.8rem', color: '#999' }}
            onClick={() => setUser(null)}>
            Disconnect Strategy ({user?.name || 'James'})
        </button>
    </div>
);

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
    const [adults, setAdults] = useState(() => getStored('sc-adults', 2));
    const [kids, setKids] = useState(() => getStored('sc-kids', 2));
    const [isVegetarian, setIsVegetarian] = useState(() => getStored('sc-veggie', false));
    const [activeTab, setActiveTab] = useState('plan'); // 'plan' | 'shop' | 'cook' | 'settings'
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [checkedItems, setCheckedItems] = useState(() => getStored('sc-checked', {}));
    const [pantry, setPantry] = useState(() => getStored('sc-pantry', {}));

    // --- PERSISTENCE ---
    useEffect(() => { localStorage.setItem('sc-user', JSON.stringify(user)); }, [user]);
    useEffect(() => { localStorage.setItem('sc-adults', JSON.stringify(adults)); }, [adults]);
    useEffect(() => { localStorage.setItem('sc-kids', JSON.stringify(kids)); }, [kids]);
    useEffect(() => { localStorage.setItem('sc-veggie', JSON.stringify(isVegetarian)); }, [isVegetarian]);
    useEffect(() => { localStorage.setItem('sc-checked', JSON.stringify(checkedItems)); }, [checkedItems]);
    useEffect(() => { localStorage.setItem('sc-pantry', JSON.stringify(pantry)); }, [pantry]);

    // --- SCREEN WAKE LOCK ---
    useEffect(() => {
        let wakeLock = null;
        if (activeTab === 'cook' && 'wakeLock' in navigator) {
            const requestWakeLock = async () => {
                try {
                    wakeLock = await navigator.wakeLock.request('screen');
                } catch (err) { console.error(err); }
            };
            requestWakeLock();
        }
        return () => { if (wakeLock) wakeLock.release(); };
    }, [activeTab]);

    // --- LOGIC ---
    const familyPoints = useMemo(() => adults + (kids * 0.7), [adults, kids]);
    const currentMonth = new Date().getMonth() + 1;

    const filteredRecipes = useMemo(() => {
        return RECIPES.map(recipe => {
            const displayIngs = recipe.ingredients.map(ing => ({
                ...ing,
                name: (isVegetarian && ing.nameVeg) ? ing.nameVeg : ing.name,
                qty: (ing.baseQty * familyPoints).toFixed(ing.unit === 'pc' ? 0 : 1),
                inPantry: pantry[ing.name] || false
            }));

            const isSeasonal = recipe.seasonalMonths?.includes(currentMonth);
            const estCost = (recipe.costPerPortion * familyPoints).toFixed(2);

            return {
                ...recipe,
                displayTitle: isVegetarian ? recipe.titleVeg : recipe.title,
                displayIngredients: displayIngs,
                isSeasonal,
                estCost,
                shareFactor: displayIngs.filter(i => RECIPES.filter(r => r.id !== recipe.id).some(r => r.ingredients.some(ri => ri.name === i.name))).length
            };
        });
    }, [familyPoints, isVegetarian, pantry, currentMonth]);

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
                if (ing.aisle === 'PantryCheck' || ing.inPantry) return;
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

    const shareToWhatsApp = () => {
        const grouped = shoppingList.reduce((acc, item) => {
            if (!acc[item.aisle]) acc[item.aisle] = [];
            acc[item.aisle].push(item);
            return acc;
        }, {});

        let text = `🛒 *Sous Chef List [Zero-Waste]*\n\n`;
        AISLES.forEach(aisle => {
            if (grouped[aisle]) {
                text += `*${aisle.toUpperCase()}*\n`;
                grouped[aisle].forEach(i => {
                    text += `- [ ] ${i.totalQty.toFixed(1)}${i.unit} ${i.name}\n`;
                });
                text += `\n`;
            }
        });

        const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    };

    // --- RENDERERS ---

    const renderPlan = () => (
        <div className="animate-fade">
            {Object.entries(recipesByDay).map(([day, meals]) => (
                <div key={day} className="day-section">
                    <h2 className="day-header">📅 {day}</h2>
                    <div className="recipe-grid">
                        {['breakfast', 'lunch', 'dinner'].map(type => {
                            const recipe = meals[type];
                            if (!recipe) return null;
                            return (
                                <div key={recipe.id} className="glass-card recipe-card"
                                    onClick={() => { setSelectedRecipe(recipe); setActiveTab('cook'); window.scrollTo(0, 0); }}>
                                    <div className="recipe-image" style={{ backgroundImage: `url(${recipe.image})` }}>
                                        <div className="recipe-badge">{type}</div>
                                        {recipe.chainId && <div className="chain-badge">🔗 Chain {recipe.stepInChain}</div>}
                                        {recipe.isSeasonal && <div className="seasonal-badge">🌱 Seasonal Best</div>}
                                    </div>
                                    <div className="recipe-content">
                                        <div className="recipe-meta">
                                            <span>{recipe.prepTime} • {recipe.calories}</span>
                                            <span className="price-tag">£{recipe.estCost} total</span>
                                        </div>
                                        <h4>{recipe.displayTitle}</h4>
                                        <div className="recipe-footer">
                                            {recipe.energyUsage === 'air_fryer' && <span className="energy-tag">⚡ Air Fryer</span>}
                                            {recipe.shareFactor > 0 && <span className="share-tag">♻️ Reused</span>}
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
            <div className="animate-fade">
                <div className="view-header mobile-padding">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h2>🛒 Smart Shopping List</h2>
                            <p>Sorted by supermarket aisle flow.</p>
                        </div>
                        <button className="btn btn-primary btn-round" onClick={shareToWhatsApp}>
                            <FiShare2 /> WhatsApp
                        </button>
                    </div>
                </div>
                <div className="aisle-container">
                    {AISLES.filter(a => grouped[a]).map(aisle => (
                        <div key={aisle} className="aisle-section">
                            <h4>{aisle}</h4>
                            {grouped[aisle].map(item => (
                                <div key={item.name} className={`glass-card shop-item ${checkedItems[item.name] ? 'checked' : ''}`} onClick={() => toggleChecked(item.name)}>
                                    <div className="checkbox-hitarea">
                                        <div className="checkbox"><FiCheckCircle className="check-icon" /></div>
                                    </div>
                                    <span className="item-name">{item.totalQty.toFixed(1)}{item.unit} {item.name}</span>
                                    {item.usedIn.length > 1 && <span className="recycle-icon">♻️</span>}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
                {shoppingList.length === 0 && (
                    <div className="empty-state">
                        <FiCheckCircle size={48} color="var(--accent)" />
                        <p>Strategy fully stocked! No shopping required.</p>
                    </div>
                )}
            </div>
        );
    };

    const renderCook = () => {
        if (!selectedRecipe) return (
            <div className="flex-center cook-empty">
                <FiZap size={64} color="#ddd" />
                <p>Select a goal in Planner to activate Cook Focus Mode.</p>
                <button className="btn btn-primary" onClick={() => setActiveTab('plan')}>Open Planner</button>
            </div>
        );

        return (
            <div className="animate-fade cook-view">
                <div className="cook-header-actions mobile-only">
                    <button className="btn-back" onClick={() => setActiveTab('plan')}>← Back</button>
                    <div className="wakelock-pill">⚡ WAKE LOCK ACTIVE</div>
                </div>
                <div className="glass-card active-recipe focus-mode">
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

                    <div className="steps-section">
                        <h3>Methodology</h3>
                        {selectedRecipe.steps.map((step, idx) => (
                            <div key={idx}
                                className={`glass-card step-card ${checkedItems[`step-${selectedRecipe.id}-${idx}`] ? 'completed' : ''}`}
                                onClick={() => toggleChecked(`step-${selectedRecipe.id}-${idx}`)}>
                                <div className="step-check">
                                    <div className="step-number">{idx + 1}</div>
                                </div>
                                <p className="step-text">{step}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mobile-padding" style={{ paddingBottom: '2rem' }}>
                        <button className="btn btn-outline" style={{ width: '100%' }} onClick={() => setSelectedRecipe(null)}>Finish Meal</button>
                    </div>
                </div>
            </div>
        );
    };

    const renderLogin = () => (
        <div className="login-overlay animate-fade">
            <div className="glass-card login-modal">
                <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🥘</div>
                <h2>Sous Chef UK</h2>
                <p>Zero-Waste Family Logistics</p>
                <button className="btn btn-primary" style={{ width: '100%', padding: '1rem', borderRadius: '50px' }} onClick={() => setUser({ name: 'James' })}>
                    Authenticate for Strategy
                </button>
            </div>
        </div>
    );

    return (
        <div className="app-container">
            {!user && renderLogin()}
            <header className="app-header desktop-only">
                <div className="header-content">
                    <h1>Sous Chef <span className="accent-text">UK</span></h1>
                    <div className="header-stats">
                        <span>🛡️ PWA Enabled</span>
                        <span>🌿 {energySavingsScore}% Energy Efficient</span>
                    </div>
                </div>
            </header>

            <div className="main-layout">
                <aside className="desktop-aside">
                    {user && <SettingsPanel
                        {...{ adults, kids, setAdults, setKids, isVegetarian, setIsVegetarian, familyPoints, energySavingsScore, setUser, user, pantry, setPantry }}
                    />}
                </aside>
                <main className="content-area">
                    {activeTab === 'plan' && renderPlan()}
                    {activeTab === 'shop' && renderShop()}
                    {activeTab === 'cook' && renderCook()}
                    {activeTab === 'settings' && <div className="mobile-only">
                        <SettingsPanel
                            {...{ adults, kids, setAdults, setKids, isVegetarian, setIsVegetarian, familyPoints, energySavingsScore, setUser, user, pantry, setPantry }}
                        />
                    </div>}
                </main>
            </div>

            <nav className="bottom-nav mobile-only">
                <button className={`nav-item ${activeTab === 'plan' ? 'active' : ''}`} onClick={() => setActiveTab('plan')}>
                    <FiCalendar /> <span>Plan</span>
                </button>
                <button className={`nav-item ${activeTab === 'shop' ? 'active' : ''}`} onClick={() => setActiveTab('shop')}>
                    <FiShoppingCart /> <span>Shop</span>
                </button>
                <button className={`nav-item ${activeTab === 'cook' ? 'active' : ''}`} onClick={() => setActiveTab('cook')}>
                    <FiMap /> <span>Cook</span>
                </button>
                <button className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
                    <FiSettings /> <span>Setup</span>
                </button>
            </nav>
        </div>
    );
};

export default App;
