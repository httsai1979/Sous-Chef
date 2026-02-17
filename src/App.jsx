import React, { useState, useMemo, useEffect } from 'react';
import { RECIPES, ENERGY_RATES, SNACKS, LUNCHBOXES, AISLES } from './data/recipes';
import {
    FiCalendar, FiShoppingCart, FiMap, FiSettings, FiCheck,
    FiZap, FiAlertCircle, FiBox, FiDollarSign, FiSmile, FiShield
} from 'react-icons/fi';
import './index.css';

const useWakeLock = (isActive) => {
    useEffect(() => {
        let wakeLock = null;
        if (isActive && 'wakeLock' in navigator) {
            const requestWakeLock = async () => {
                try { wakeLock = await navigator.wakeLock.request('screen'); }
                catch (err) { console.error(err); }
            };
            requestWakeLock();
        }
        return () => { if (wakeLock) wakeLock.release(); };
    }, [isActive]);
};

// --- SUB-COMPONENTS ---

const FinanceIndicator = ({ value, label, icon: Icon, color }) => (
    <div className="finance-card">
        <div className="icon-wrap" style={{ backgroundColor: `${color}15`, color }}>
            <Icon size={20} />
        </div>
        <div>
            <div className="fin-val">{value}</div>
            <div className="fin-label">{label}</div>
        </div>
    </div>
);

const App = () => {
    // --- STATE ---
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('sc-user')) || null);
    const [adults, setAdults] = useState(() => Number(localStorage.getItem('sc-adult-count')) || 2);
    const [kids, setKids] = useState(() => Number(localStorage.getItem('sc-kid-count')) || 2);
    const [activeTab, setActiveTab] = useState('plan');
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [checkedItems, setCheckedItems] = useState(() => JSON.parse(localStorage.getItem('sc-checked')) || {});
    const [isVegetarian, setIsVegetarian] = useState(() => localStorage.getItem('sc-veggie') === 'true');

    // --- PERSISTENCE ---
    useEffect(() => {
        localStorage.setItem('sc-user', JSON.stringify(user));
        localStorage.setItem('sc-adult-count', adults);
        localStorage.setItem('sc-kid-count', kids);
        localStorage.setItem('sc-veggie', isVegetarian);
        localStorage.setItem('sc-checked', JSON.stringify(checkedItems));
    }, [user, adults, kids, isVegetarian, checkedItems]);

    // --- HOOKS ---
    useWakeLock(activeTab === 'cook' && !!selectedRecipe);

    // --- LOGIC ---
    const familyPoints = adults + (kids * 0.7);

    const stats = useMemo(() => {
        let totalCost = 0;
        let totalEnergyKWh = 0;
        RECIPES.forEach(r => {
            totalCost += (r.costPerAdult * adults) + (r.costPerKid * kids);
            const rate = ENERGY_RATES[r.energyType] || 1;
            totalEnergyKWh += (rate * (r.cookingTime / 60));
        });
        return {
            cost: totalCost.toFixed(2),
            energyCost: (totalEnergyKWh * 0.29).toFixed(2),
            savings: (totalCost * 0.35).toFixed(2) // Est. vs. Takeaway
        };
    }, [adults, kids]);

    const activeShoppingList = useMemo(() => {
        const list = {};
        RECIPES.forEach(recipe => {
            recipe.ingredients.forEach(ing => {
                const key = `${ing.name}-${ing.unit}`;
                if (!list[key]) list[key] = { ...ing, totalQty: 0 };
                list[key].totalQty += parseFloat(ing.baseQty * familyPoints);
            });
        });
        // Add Snacks to list
        SNACKS.forEach(s => {
            if (!list[s.name]) list[s.name] = { name: s.name, unit: 'pc', totalQty: kids + adults, aisle: s.aisle };
        });
        return Object.values(list).sort((a, b) => AISLES.indexOf(a.aisle) - AISLES.indexOf(b.aisle));
    }, [familyPoints, adults, kids]);

    // --- RENDERERS ---

    const renderPlan = () => (
        <div className="tab-content fade-in">
            <div className="large-title"><h1>Strategy Hub</h1></div>

            <div className="stat-grid">
                <FinanceIndicator value={`£${stats.cost}`} label="Weekly Groceries" icon={FiShoppingCart} color="#007AFF" />
                <FinanceIndicator value={`£${stats.energyCost}`} label="Est. Energy" icon={FiZap} color="#FFCC00" />
                <FinanceIndicator value={`£${stats.savings}`} label="Estimated Saving" icon={FiShield} color="#34C759" />
            </div>

            <div className="section-header">Weekly Meal Cycle</div>
            {RECIPES.map(recipe => (
                <div key={recipe.id} className="recipe-card-ios" onClick={() => { setSelectedRecipe(recipe); setActiveTab('cook'); window.scrollTo(0, 0); }}>
                    <div className="recipe-image-ios" style={{ backgroundImage: `url(${recipe.image})` }}>
                        <div className="energy-pill">ECO {recipe.energyType.replace('_', ' ')}</div>
                    </div>
                    <div className="recipe-info-ios">
                        <h3>{recipe.title}</h3>
                        <p className="rationale">{recipe.rationale}</p>
                    </div>
                </div>
            ))}

            <div className="section-header">School Lunch Boxes</div>
            <div className="ios-list">
                {LUNCHBOXES.map(lb => (
                    <div key={lb.id} className="ios-item">
                        <FiBox style={{ marginRight: '12px', color: '#007AFF' }} />
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600 }}>{lb.name}</div>
                            <div style={{ fontSize: '12px', color: '#8E8E93' }}>Side: {lb.accessories}</div>
                        </div>
                        <FiChevronRight color="#C7C7CC" />
                    </div>
                ))}
            </div>
        </div>
    );

    const renderCook = () => {
        if (!selectedRecipe) return <div className="tab-content center-msg"><FiMap size={48} /><p>Select a strategy from Plan</p></div>;
        return (
            <div className="tab-content fade-in">
                <button className="back-btn" onClick={() => setSelectedRecipe(null)}>Close Action</button>
                <div className="cook-header">
                    <h1>{selectedRecipe.title}</h1>
                    <div className="ios-alert">
                        <FiZap color="#FFCC00" />
                        <span><strong>Energy Tip:</strong> Using the {selectedRecipe.energyType.replace('_', ' ')} saves ~20p vs. Oven.</span>
                    </div>
                </div>

                <div className="flavor-split">
                    <div className="flavor-card kit">
                        <FiSmile />
                        <div>
                            <strong>THE KID HACK (HECK)</strong>
                            <p>{selectedRecipe.kidHack}</p>
                        </div>
                    </div>
                    <div className="flavor-card adult">
                        <FiZap />
                        <div>
                            <strong>ADULT UPGRADE</strong>
                            <p>{selectedRecipe.adultUpgrade}</p>
                        </div>
                    </div>
                </div>

                <div className="section-header">Ingredients for {adults + kids} Persons</div>
                <div className="ios-list">
                    {selectedRecipe.ingredients.map(ing => (
                        <div key={ing.name} className="ios-item">
                            <span style={{ flex: 1 }}>{ing.name}</span>
                            <span className="qty-tag">{(ing.baseQty * familyPoints).toFixed(1)} {ing.unit}</span>
                        </div>
                    ))}
                </div>

                <div className="section-header">Precision Execution</div>
                {selectedRecipe.steps.map((s, i) => (
                    <div key={i} className={`step-bubble ${checkedItems[`cook-${selectedRecipe.id}-${i}`] ? 'checked' : 'active'}`} onClick={() => setCheckedItems({ ...checkedItems, [`cook-${selectedRecipe.id}-${i}`]: !checkedItems[`cook-${selectedRecipe.id}-${i}`] })}>
                        <div className="step-num">{i + 1}</div>
                        <p>{s}</p>
                    </div>
                ))}
            </div>
        );
    };

    const renderSettings = () => (
        <div className="tab-content fade-in">
            <div className="large-title"><h1>Household Setup</h1></div>

            <div className="section-header">Household Configuration</div>
            <div className="ios-list">
                <div className="ios-item">
                    <span style={{ flex: 1 }}>Adults</span>
                    <div className="stepper">
                        <button onClick={() => setAdults(Math.max(1, adults - 1))}>-</button>
                        <span>{adults}</span>
                        <button onClick={() => setAdults(adults + 1)}>+</button>
                    </div>
                </div>
                <div className="ios-item">
                    <span style={{ flex: 1 }}>Kids (NHS Healthy Plan)</span>
                    <div className="stepper">
                        <button onClick={() => setKids(Math.max(0, kids - 1))}>-</button>
                        <span>{kids}</span>
                        <button onClick={() => setKids(kids + 1)}>+</button>
                    </div>
                </div>
            </div>

            <div className="section-header">Supply Chain Efficiency</div>
            <div className="ios-list">
                <div className="ios-item">
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600 }}>Zero Waste Protocol</div>
                        <div style={{ fontSize: '12px', color: '#8E8E93' }}>Automatically use carcasses/scraps for broths</div>
                    </div>
                    <div className="toggle active"></div>
                </div>
            </div>

            <button className="ios-danger-btn" onClick={() => setUser(null)}>Reset Strategy</button>
        </div>
    );

    return (
        <div className="app-container">
            {user ? (
                <>
                    <main>
                        {activeTab === 'plan' && renderPlan()}
                        {activeTab === 'shop' && <div className="tab-content fade-in"><div className="large-title"><h1>Grocery Run</h1></div>
                            <div className="ios-list">
                                {activeShoppingList.map(item => (
                                    <div key={item.name} className="ios-item" onClick={() => setCheckedItems({ ...checkedItems, [item.name]: !checkedItems[item.name] })}>
                                        <div className={`chk ${checkedItems[item.name] ? 'on' : ''}`}><FiCheck /></div>
                                        <span style={{ flex: 1, textDecoration: checkedItems[item.name] ? 'line-through' : 'none' }}>{item.totalQty.toFixed(1)} {item.unit} {item.name}</span>
                                        <div className="aisle-lbl">{item.aisle}</div>
                                    </div>
                                ))}
                            </div>
                        </div>}
                        {activeTab === 'cook' && renderCook()}
                        {activeTab === 'settings' && renderSettings()}
                    </main>
                    <nav className="tab-bar">
                        <div className={`tab-item ${activeTab === 'plan' ? 'active' : ''}`} onClick={() => setActiveTab('plan')}><FiCalendar /><span>Plan</span></div>
                        <div className={`tab-item ${activeTab === 'shop' ? 'active' : ''}`} onClick={() => setActiveTab('shop')}><FiShoppingCart /><span>Shop</span></div>
                        <div className={`tab-item ${activeTab === 'cook' ? 'active' : ''}`} onClick={() => setActiveTab('cook')}><FiMap /><span>Cook</span></div>
                        <div className={`tab-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}><FiSettings /><span>Setup</span></div>
                    </nav>
                </>
            ) : (
                <div className="login-screen fade-in">
                    <div className="login-box">
                        <div className="logo">🥘</div>
                        <h1>Sous Chef 2.0</h1>
                        <p>Strategic Domestic Management</p>
                        <button className="btn-ios" onClick={() => setUser({ name: 'James' })}>Activate Strategy</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;
