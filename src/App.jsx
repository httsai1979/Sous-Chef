import React, { useState, useMemo, useEffect } from 'react';
import { RECIPES, ENERGY_RATES, SNACKS, LUNCHBOXES, AISLES, FAQ } from './data/recipes';
import {
    FiCalendar, FiShoppingCart, FiMap, FiSettings, FiCheck,
    FiZap, FiAlertCircle, FiBox, FiDollarSign, FiSmile, FiShield,
    FiChevronRight, FiShare2, FiHelpCircle, FiArrowRight, FiMail, FiHeart, FiGrid, FiList
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
        return () => { if (wakeLock && wakeLock.release) wakeLock.release(); };
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
    const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'list'
    const [selectedRecipe, setSelectedRecipe] = useState(() => JSON.parse(localStorage.getItem('sc-active-recipe')) || null);
    const [activeWeek, setActiveWeek] = useState(1);
    const [checkedItems, setCheckedItems] = useState(() => JSON.parse(localStorage.getItem('sc-checked')) || {});
    const [planSelection, setPlanSelection] = useState(() => JSON.parse(localStorage.getItem('sc-plan-selection')) || RECIPES.map(r => r.id));

    // --- PERSISTENCE ---
    useEffect(() => {
        localStorage.setItem('sc-user', JSON.stringify(user));
        localStorage.setItem('sc-adult-count', adults);
        localStorage.setItem('sc-kid-count', kids);
        localStorage.setItem('sc-checked', JSON.stringify(checkedItems));
        localStorage.setItem('sc-plan-selection', JSON.stringify(planSelection));
        localStorage.setItem('sc-active-recipe', JSON.stringify(selectedRecipe));
    }, [user, adults, kids, checkedItems, planSelection, selectedRecipe]);

    // --- HOOKS ---
    useWakeLock(activeTab === 'cook' && !!selectedRecipe);

    // --- LOGIC ---
    const familyPoints = adults + (kids * 0.7);

    const stats = useMemo(() => {
        let totalCost = 0;
        let totalEnergyKWh = 0;
        const selectedRecipes = RECIPES.filter(r => planSelection.includes(r.id));
        selectedRecipes.forEach(r => {
            totalCost += (r.costPerAdult * adults) + (r.costPerKid * kids);
            const rate = ENERGY_RATES[r.energyType] || 1;
            totalEnergyKWh += (rate * (r.cookingTime / 60));
        });
        return {
            cost: totalCost.toFixed(2),
            energyCost: (totalEnergyKWh * 0.29).toFixed(2),
            savings: (totalCost * 0.35).toFixed(2)
        };
    }, [adults, kids, planSelection]);

    const activeShoppingList = useMemo(() => {
        const list = {};
        const selectedRecipes = RECIPES.filter(r => planSelection.includes(r.id));
        selectedRecipes.forEach(recipe => {
            recipe.ingredients.forEach(ing => {
                const key = `${ing.name}-${ing.unit}`;
                if (!list[key]) list[key] = { ...ing, totalQty: 0 };
                list[key].totalQty += parseFloat(ing.baseQty * familyPoints);
            });
        });
        if (SNACKS && selectedRecipes.length > 0) {
            SNACKS.forEach(s => {
                if (!list[s.name]) list[s.name] = { name: s.name, unit: 'pc', totalQty: (kids + adults), aisle: s.aisle };
            });
        }
        return Object.values(list).sort((a, b) => AISLES.indexOf(a.aisle) - AISLES.indexOf(b.aisle));
    }, [familyPoints, adults, kids, planSelection]);

    const togglePlanItem = (id) => {
        setPlanSelection(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const shareAction = async () => {
        const text = `🛒 *Sous Chef Monthly Strategy*\n\n` +
            activeShoppingList.map(i => `• ${i.totalQty.toFixed(1)}${i.unit} ${i.name}`).join('\n');

        if (navigator.share) {
            try { await navigator.share({ title: 'Sous Chef Shopping List', text }); } catch (e) { }
        } else {
            window.open(`whatsapp://send?text=${encodeURIComponent(text)}`);
        }
    };

    // --- RENDERERS ---

    const renderCalendar = () => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return (
            <div className="calendar-grid-container fade-in">
                <div className="calendar-header-row">
                    {days.map(d => <div key={d} className="day-name">{d.substring(0, 3)}</div>)}
                </div>
                {[1, 2, 3, 4].map(weekNum => (
                    <div key={weekNum} className="week-row">
                        <div className="week-label">W{weekNum}</div>
                        <div className="days-container">
                            {days.map(day => {
                                const recipe = RECIPES.find(r => r.week === weekNum && r.day === day);
                                const isSelected = recipe && planSelection.includes(recipe.id);
                                return (
                                    <div key={day}
                                        className={`calendar-cell ${isSelected ? 'active' : ''} ${selectedRecipe?.id === recipe?.id ? 'current' : ''}`}
                                        onClick={() => recipe && togglePlanItem(recipe.id)}
                                        onDoubleClick={() => { if (recipe) { setSelectedRecipe(recipe); setActiveTab('cook'); } }}
                                    >
                                        {recipe ? (
                                            <>
                                                <div className="cell-thumb" style={{ backgroundImage: `url(${recipe.image})` }}></div>
                                                {isSelected && <div className="cell-check"><FiCheck size={10} /></div>}
                                            </>
                                        ) : <div className="cell-empty"></div>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
                <p className="hint-text">Tapped: Select | Double Tap: Cook</p>
            </div>
        );
    };

    const renderPlan = () => (
        <div className="tab-content fade-in">
            <div className="large-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>28-Day Strategy</h1>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => setViewMode(viewMode === 'calendar' ? 'list' : 'calendar')} className="icon-btn-ios">
                        {viewMode === 'calendar' ? <FiList size={22} /> : <FiGrid size={22} />}
                    </button>
                    <button onClick={() => setShowFAQ(true)} className="icon-btn-ios"><FiHelpCircle size={22} /></button>
                </div>
            </div>

            <div className="stat-grid">
                <FinanceIndicator value={`£${stats.cost}`} label="Month Budget" icon={FiShoppingCart} color="#007AFF" />
                <FinanceIndicator value={`£${stats.energyCost}`} label="Energy Est." icon={FiZap} color="#FFCC00" />
                <FinanceIndicator value={`£${stats.savings}`} label="Month Saving" icon={FiShield} color="#34C759" />
            </div>

            {viewMode === 'calendar' ? renderCalendar() : (
                <>
                    <div className="ios-week-picker">
                        {[1, 2, 3, 4].map(w => (
                            <button key={w} className={activeWeek === w ? 'active' : ''} onClick={() => setActiveWeek(w)}>Week {w}</button>
                        ))}
                    </div>
                    <div className="section-header">Week {activeWeek} Line-up</div>
                    {RECIPES.filter(r => r.week === activeWeek).map(recipe => (
                        <div key={recipe.id} className={`recipe-card-ios ${!planSelection.includes(recipe.id) ? 'deselected' : ''}`}>
                            <div className="recipe-image-ios" style={{ backgroundImage: `url(${recipe.image})` }} onClick={() => { setSelectedRecipe(recipe); setActiveTab('cook'); window.scrollTo(0, 0); }}>
                                <div className="energy-pill">ECO {recipe.energyType.replace('_', ' ')}</div>
                            </div>
                            <div className="recipe-info-ios">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ flex: 1 }} onClick={() => { setSelectedRecipe(recipe); setActiveTab('cook'); window.scrollTo(0, 0); }}>
                                        <h3 style={{ fontSize: '16px' }}>{recipe.day}: {recipe.title}</h3>
                                        <p className="rationale">{recipe.rationale}</p>
                                    </div>
                                    <div className={`ios-checkbox ${planSelection.includes(recipe.id) ? 'checked' : ''}`} onClick={() => togglePlanItem(recipe.id)}>
                                        <FiCheck />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </>
            )}
        </div>
    );

    const renderShop = () => (
        <div className="tab-content fade-in">
            <div className="large-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Master List</h1>
                <button onClick={shareAction} className="icon-btn-ios"><FiShare2 size={24} color="#007AFF" /></button>
            </div>
            {planSelection.length === 0 ? (
                <div className="center-msg"><FiAlertCircle size={40} /><p>Strategic selections are empty.<br />Please pick meals in Planner.</p></div>
            ) : (
                <>
                    <div className="section-header">Optimized Monthly Grocery Volume</div>
                    <div className="ios-list">
                        {activeShoppingList.map(item => (
                            <div key={item.name} className="ios-item" onClick={() => setCheckedItems({ ...checkedItems, [item.name]: !checkedItems[item.name] })}>
                                <div className={`chk ${checkedItems[item.name] ? 'on' : ''}`}><FiCheck /></div>
                                <span style={{ flex: 1, textDecoration: checkedItems[item.name] ? 'line-through' : 'none' }}>{item.totalQty.toFixed(1)} {item.unit} {item.name}</span>
                                <div className="aisle-lbl">{item.aisle}</div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );

    const renderCook = () => {
        const currentRecipe = selectedRecipe;
        if (!currentRecipe) return (
            <div className="tab-content center-msg">
                <FiMap size={48} />
                <h2 style={{ margin: '20px 0' }}>Operation Center</h2>
                <div className="ios-list" style={{ width: '100%' }}>
                    <div className="section-header">Pinned Strategy</div>
                    {RECIPES.filter(r => planSelection.includes(r.id)).slice(0, 3).map(r => (
                        <div key={r.id} className="ios-item" onClick={() => setSelectedRecipe(r)}>
                            <div className="mini-thumb" style={{ backgroundImage: `url(${r.image})` }}></div>
                            <span style={{ flex: 1, marginLeft: '12px', fontWeight: 600 }}>{r.day}: {r.title}</span>
                            <FiChevronRight color="#C7C7CC" />
                        </div>
                    ))}
                </div>
                <button className="btn-ios" style={{ marginTop: '30px' }} onClick={() => setActiveTab('plan')}>Explore Planner</button>
            </div>
        );
        return (
            <div className="tab-content fade-in">
                <button className="back-btn" onClick={() => setSelectedRecipe(null)}><FiArrowRight style={{ transform: 'rotate(180deg)', marginRight: '8px' }} /> Strategy Hub</button>
                <div className="cook-header">
                    <h1>{currentRecipe.title}</h1>
                    <div className="ios-alert">
                        <FiZap color="#FFCC00" />
                        <span><strong>Energy Mode:</strong> {currentRecipe.energyType.replace('_', ' ')} logic active.</span>
                    </div>
                </div>

                <div className="flavor-split">
                    <div className="flavor-card kit">
                        <FiSmile size={24} />
                        <div>
                            <strong>THE KID HACK (HECK)</strong>
                            <p>{currentRecipe.kidHack}</p>
                        </div>
                    </div>
                    <div className="flavor-card adult">
                        <FiZap size={24} />
                        <div>
                            <strong>ADULT UPGRADE</strong>
                            <p>{currentRecipe.adultUpgrade}</p>
                        </div>
                    </div>
                </div>

                <div className="section-header">Logistics: {adults}A | {kids}K</div>
                <div className="ios-list">
                    {currentRecipe.ingredients.map(ing => (
                        <div key={ing.name} className="ios-item">
                            <span style={{ flex: 1 }}>{ing.name}</span>
                            <span className="qty-tag">{(ing.baseQty * familyPoints).toFixed(1)} {ing.unit}</span>
                        </div>
                    ))}
                </div>

                <div className="section-header">Execution Loop</div>
                {currentRecipe.steps.map((s, i) => (
                    <div key={i} className={`step-bubble ${checkedItems[`cook-${currentRecipe.id}-${i}`] ? 'checked' : 'active'}`} onClick={() => setCheckedItems({ ...checkedItems, [`cook-${currentRecipe.id}-${i}`]: !checkedItems[`cook-${currentRecipe.id}-${i}`] })}>
                        <div className="step-num">{i + 1}</div>
                        <p>{s}</p>
                    </div>
                ))}
            </div>
        );
    };

    const renderSettings = () => (
        <div className="tab-content fade-in">
            <div className="large-title"><h1>Setup</h1></div>
            <div className="section-header">Profile Selection</div>
            <div className="ios-list">
                <div className="ios-item">
                    <span style={{ flex: 1, fontWeight: 500 }}>Adult Count</span>
                    <div className="stepper">
                        <button onClick={() => setAdults(Math.max(1, adults - 1))}>-</button>
                        <span>{adults}</span>
                        <button onClick={() => setAdults(adults + 1)}>+</button>
                    </div>
                </div>
                <div className="ios-item">
                    <span style={{ flex: 1, fontWeight: 500 }}>Kid Count</span>
                    <div className="stepper">
                        <button onClick={() => setKids(Math.max(0, kids - 1))}>-</button>
                        <span>{kids}</span>
                        <button onClick={() => setKids(kids + 1)}>+</button>
                    </div>
                </div>
            </div>

            <div className="section-header">Support</div>
            <div className="ios-list">
                <div className="ios-item" onClick={() => setShowFAQ(true)}><FiHelpCircle style={{ color: '#007AFF', marginRight: '12px' }} /><span>Knowledge Base</span><FiChevronRight style={{ marginLeft: 'auto' }} color="#C7C7CC" /></div>
                <a href="mailto:support@souschef.uk" className="ios-item" style={{ textDecoration: 'none', color: 'inherit' }}><FiMail style={{ color: '#34C759', marginRight: '12px' }} /><span>Email Support</span><FiChevronRight style={{ marginLeft: 'auto' }} color="#C7C7CC" /></a>
            </div>

            <button className="ios-danger-btn" onClick={() => setUser(null)}>Clear Session & Exit</button>
        </div>
    );

    return (
        <div className="app-container">
            {!user ? (
                <div className="login-screen fade-in">
                    <div className="login-box">
                        <div className="logo">🥘</div>
                        <h1>Sous Chef 2.0</h1>
                        <button className="btn-ios" onClick={() => setUser({ name: 'James' })}>Enable Strategy</button>
                    </div>
                </div>
            ) : (
                <>
                    {showFAQ && (
                        <div className="faq-overlay fade-in" onClick={() => setShowFAQ(false)}>
                            <div className="faq-modal" onClick={e => e.stopPropagation()}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                    <h2>Guidance</h2>
                                    <button onClick={() => setShowFAQ(false)} className="back-btn" style={{ padding: 0 }}>Close</button>
                                </div>
                                {FAQ.map((f, i) => (
                                    <div key={i} style={{ marginBottom: '24px' }}>
                                        <div style={{ fontWeight: 800, color: '#007AFF', marginBottom: '8px' }}>{f.q}</div>
                                        <div style={{ fontSize: '14px', lineHeight: 1.6 }}>{f.a}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    <main>
                        {activeTab === 'plan' && renderPlan()}
                        {activeTab === 'shop' && renderShop()}
                        {activeTab === 'cook' && renderCook()}
                        {activeTab === 'settings' && renderSettings()}
                    </main>
                    <nav className="tab-bar">
                        <div className={`tab-item ${activeTab === 'plan' ? 'active' : ''}`} onClick={() => setActiveTab('plan')}><FiCalendar /><span>Planner</span></div>
                        <div className={`tab-item ${activeTab === 'shop' ? 'active' : ''}`} onClick={() => setActiveTab('shop')}><FiShoppingCart /><span>Grocery</span></div>
                        <div className={`tab-item ${activeTab === 'cook' ? 'active' : ''}`} onClick={() => setActiveTab('cook')}><FiMap /><span>Cook Mode</span></div>
                        <div className={`tab-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}><FiSettings /><span>Setup</span></div>
                    </nav>
                </>
            )}
        </div>
    );
};

export default App;
