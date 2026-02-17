import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { RECIPES, BUDGET_MODIFIERS, AISLES } from './data/recipes';
import { FiCalendar, FiShoppingCart, FiMap, FiSettings, FiCheckCircle, FiShare2, FiZap, FiBox, FiUser } from 'react-icons/fi';
import './index.css';

// --- CUSTOM HOOKS ---

const useWakeLock = (isActive) => {
    useEffect(() => {
        let wakeLock = null;
        if (isActive && 'wakeLock' in navigator) {
            const requestWakeLock = async () => {
                try {
                    wakeLock = await navigator.wakeLock.request('screen');
                    console.log('Wake Lock Activated');
                } catch (err) { console.error(`${err.name}, ${err.message}`); }
            };
            requestWakeLock();
        }
        return () => {
            if (wakeLock !== null) {
                wakeLock.release().then(() => { wakeLock = null; console.log('Wake Lock Released'); });
            }
        };
    }, [isActive]);
};

// --- SUB-COMPONENTS ---

const BottomNav = ({ activeTab, setActiveTab }) => (
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
);

const SettingsPanel = ({ adults, kids, setAdults, setKids, isVegetarian, setIsVegetarian, familyPoints, energySavingsScore, setUser, user, pantry, setPantry }) => (
    <div className="glass-card settings-panel animate-fade">
        <h3 className="panel-title"><FiSettings /> Strategy Configuration</h3>

        <div className="setting-group">
            <div className="label-row">
                <span>👨‍👩‍👧‍👦 Family Population</span>
                <span className="value-tag">{adults + kids} People</span>
            </div>
            <input type="range" min="1" max="6" value={adults + kids} onChange={(e) => {
                const val = parseInt(e.target.value);
                setAdults(Math.ceil(val / 2));
                setKids(Math.floor(val / 2));
            }} className="modern-slider" />
        </div>

        <button className={`btn-toggle ${isVegetarian ? 'active' : ''}`}
            onClick={() => setIsVegetarian(!isVegetarian)}>
            {isVegetarian ? '🌿 Plant-Based Strategy' : '🥩 Standard Strategy'}
        </button>

        <div className="stock-section">
            <h4 className="section-subtitle"><FiBox /> Pantry Stock (Pantry-First)</h4>
            <div className="stock-chips">
                {['Pasta', 'Rice', 'Oats', 'Honey', 'Canned Tomatoes'].map(item => (
                    <button key={item}
                        className={`chip ${pantry[item] ? 'checked' : ''}`}
                        onClick={() => setPantry(prev => ({ ...prev, [item]: !prev[item] }))}>
                        {pantry[item] && <FiCheckCircle />} {item}
                    </button>
                ))}
            </div>
        </div>

        <div className="efficiency-stats">
            <div className="efficiency-card">
                <span className="label">PORTION SAVING</span>
                <span className="value">£{(familyPoints * 14).toFixed(0)}</span>
                <span className="sub">Per Week</span>
            </div>
            <div className="efficiency-card">
                <span className="label">ECO OPTIMIZATION</span>
                <span className="value">{energySavingsScore}%</span>
                <span className="sub">Energy Grade</span>
            </div>
        </div>

        <button className="btn-logout" onClick={() => setUser(null)}>
            <FiUser /> Logout Strategy ({user?.name || 'User'})
        </button>
    </div>
);

const App = () => {
    // --- HELPERS ---
    const getStored = (key, fallback) => {
        const item = localStorage.getItem(key);
        try { return item ? JSON.parse(item) : fallback; } catch { return fallback; }
    };

    // --- STATE ---
    const [user, setUser] = useState(() => getStored('sc-user', null));
    const [adults, setAdults] = useState(() => getStored('sc-adults', 2));
    const [kids, setKids] = useState(() => getStored('sc-kids', 2));
    const [isVegetarian, setIsVegetarian] = useState(() => getStored('sc-veggie', false));
    const [activeTab, setActiveTab] = useState('plan');
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [checkedItems, setCheckedItems] = useState(() => getStored('sc-checked', {}));
    const [pantry, setPantry] = useState(() => getStored('sc-pantry', {}));

    // --- PERSISTENCE ---
    useEffect(() => {
        localStorage.setItem('sc-user', JSON.stringify(user));
        localStorage.setItem('sc-adults', JSON.stringify(adults));
        localStorage.setItem('sc-kids', JSON.stringify(kids));
        localStorage.setItem('sc-veggie', JSON.stringify(isVegetarian));
        localStorage.setItem('sc-checked', JSON.stringify(checkedItems));
        localStorage.setItem('sc-pantry', JSON.stringify(pantry));
    }, [user, adults, kids, isVegetarian, checkedItems, pantry]);

    // --- HOOKS ---
    useWakeLock(activeTab === 'cook' && !!selectedRecipe);

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

        let text = `🛒 *Sous Chef List [Strategy Week]*\n\n`;
        AISLES.forEach(aisle => {
            if (grouped[aisle]) {
                text += `*${aisle.toUpperCase()}*\n`;
                grouped[aisle].forEach(i => {
                    text += `- [ ] ${i.totalQty.toFixed(1)}${i.unit} ${i.name}\n`;
                });
                text += `\n`;
            }
        });

        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    // --- PAGE RENDERERS ---

    const renderPlan = () => (
        <div className="view-container animate-fade">
            {Object.entries(recipesByDay).map(([day, meals]) => (
                <div key={day} className="day-block">
                    <h2 className="section-title">📅 {day}</h2>
                    <div className="card-grid">
                        {['breakfast', 'lunch', 'dinner'].map(type => {
                            const recipe = meals[type];
                            if (!recipe) return null;
                            return (
                                <div key={recipe.id} className="recipe-card glass-card"
                                    onClick={() => { setSelectedRecipe(recipe); setActiveTab('cook'); window.scrollTo(0, 0); }}>
                                    <div className="card-media" style={{ backgroundImage: `url(${recipe.image})` }}>
                                        <span className="meal-tag">{type}</span>
                                        {recipe.chainId && <span className="chain-tag">🔗 Chain {recipe.stepInChain}</span>}
                                        {recipe.isSeasonal && <span className="season-tag">🌱 Seasonal</span>}
                                    </div>
                                    <div className="card-body">
                                        <div className="meta-row">
                                            <span>{recipe.prepTime} • {recipe.calories}</span>
                                            <span className="cost-tag">£{recipe.estCost}</span>
                                        </div>
                                        <h4 className="title">{recipe.displayTitle}</h4>
                                        <div className="tag-row">
                                            {recipe.energyUsage === 'air_fryer' && <FiZap className="energy-icon" />}
                                            {recipe.shareFactor > 0 && <span className="shared-badge">♻️ Reused</span>}
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
            <div className="view-container animate-fade">
                <div className="view-header">
                    <div className="title-block">
                        <h2>🛒 Smart Strategy List</h2>
                        <p>Aggregated by Tesco/Sainsbury's aisle flow.</p>
                    </div>
                    <button className="btn-share" onClick={shareToWhatsApp}><FiShare2 /> Export</button>
                </div>
                <div className="list-content">
                    {AISLES.filter(a => grouped[a]).map(aisle => (
                        <div key={aisle} className="aisle-lane">
                            <h4 className="aisle-title">{aisle}</h4>
                            {grouped[aisle].map(item => (
                                <div key={item.name} className={`shop-item glass-card ${checkedItems[item.name] ? 'done' : ''}`}
                                    onClick={() => toggleChecked(item.name)}>
                                    <div className="target-hitbox"><FiCheckCircle className="check-ui" /></div>
                                    <span className="name">{item.totalQty.toFixed(1)}{item.unit} {item.name}</span>
                                    {item.usedIn.length > 1 && <span className="reuse-ui">♻️</span>}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderCook = () => {
        if (!selectedRecipe) return (
            <div className="empty-state animate-fade">
                <FiMap size={48} />
                <p>Activate Chef Focus Mode by selecting a meal from your plan.</p>
                <button className="btn-primary" onClick={() => setActiveTab('plan')}>Open Planner</button>
            </div>
        );

        return (
            <div className="cook-view animate-fade">
                <div className="cook-controls mobile-only">
                    <button className="btn-back" onClick={() => setActiveTab('plan')}>← Back</button>
                    <div className="pill-wake">⚡ WAKE LOCK ACTIVE</div>
                </div>
                <div className="focus-card glass-card">
                    <div className="cook-hero" style={{ backgroundImage: `url(${selectedRecipe.image})` }}>
                        <div className="hero-data">
                            <h1>{selectedRecipe.displayTitle}</h1>
                            <p>{selectedRecipe.day} Protocol</p>
                        </div>
                    </div>

                    <div className="feature-row">
                        <div className="feature-box kid">
                            <strong>👶 Kid Hack</strong> {selectedRecipe.kidHack}
                        </div>
                        {selectedRecipe.adultUpgrade && (
                            <div className="feature-box adult">
                                <strong>🍷 Adult Upgrade</strong> {selectedRecipe.adultUpgrade}
                            </div>
                        )}
                    </div>

                    <div className="method-section">
                        <h3>Methodology</h3>
                        {selectedRecipe.steps.map((step, idx) => (
                            <div key={idx}
                                className={`step-item glass-card ${checkedItems[`step-${selectedRecipe.id}-${idx}`] ? 'active' : ''}`}
                                onClick={() => toggleChecked(`step-${selectedRecipe.id}-${idx}`)}>
                                <div className="step-ui">
                                    <div className="num-circle">{idx + 1}</div>
                                </div>
                                <p className="step-label">{step}</p>
                            </div>
                        ))}
                    </div>
                    <div className="footer-action">
                        <button className="btn-outline" style={{ width: '100%', padding: '1.2rem' }} onClick={() => setSelectedRecipe(null)}>Finish Goal</button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="app-root">
            {!user && (
                <div className="login-screen">
                    <div className="login-box glass-card">
                        <span className="logo-emoji">🥘</span>
                        <h2>Sous Chef <span className="accent">UK</span></h2>
                        <p>Zero-Waste Family Supply Chain</p>
                        <button className="btn-primary" onClick={() => setUser({ name: 'James' })}>
                            Link Strategy
                        </button>
                    </div>
                </div>
            )}

            <header className="desktop-header desktop-only">
                <div className="header-inner">
                    <h1>Sous Chef <span className="accent">UK</span></h1>
                    <div className="header-meta">
                        <span>PWA V2.0</span>
                        <span>{energySavingsScore}% SAVING</span>
                    </div>
                </div>
            </header>

            <div className="layout-engine">
                <aside className="sidebar desktop-only">
                    {user && <SettingsPanel {...{ adults, kids, setAdults, setKids, isVegetarian, setIsVegetarian, familyPoints, energySavingsScore, setUser, user, pantry, setPantry }} />}
                </aside>
                <main className="viewer">
                    {activeTab === 'plan' && renderPlan()}
                    {activeTab === 'shop' && renderShop()}
                    {activeTab === 'cook' && renderCook()}
                    {activeTab === 'settings' && <div className="mobile-only">
                        <SettingsPanel {...{ adults, kids, setAdults, setKids, isVegetarian, setIsVegetarian, familyPoints, energySavingsScore, setUser, user, pantry, setPantry }} />
                    </div>}
                </main>
            </div>

            <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
    );
};

export default App;
