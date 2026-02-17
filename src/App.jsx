import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { RECIPES, BUDGET_MODIFIERS, AISLES } from './data/recipes';
import { FiCalendar, FiShoppingCart, FiMap, FiSettings, FiCheck, FiChevronRight, FiUser, FiInfo } from 'react-icons/fi';
import './index.css';

// --- CUSTOM HOOKS ---

const useWakeLock = (isActive) => {
    useEffect(() => {
        let wakeLock = null;
        if (isActive && 'wakeLock' in navigator) {
            const requestWakeLock = async () => {
                try {
                    wakeLock = await navigator.wakeLock.request('screen');
                    console.log('🍎 iOS Wake Lock Active');
                } catch (err) { console.error(err); }
            };
            requestWakeLock();
        }
        return () => { if (wakeLock) wakeLock.release(); };
    }, [isActive]);
};

// --- COMPONENTS ---

const AppleToggle = ({ label, value, onToggle }) => (
    <div className="ios-item" onClick={onToggle}>
        <span style={{ flex: 1, fontSize: '17px' }}>{label}</span>
        <div style={{
            width: '51px', height: '31px', borderRadius: '15.5px',
            backgroundColor: value ? '#34C759' : '#E9E9EB',
            position: 'relative', transition: '0.3s'
        }}>
            <div style={{
                width: '27px', height: '27px', borderRadius: '50%', backgroundColor: 'white',
                position: 'absolute', top: '2px', left: value ? '22px' : '2px',
                transition: '0.3s', boxShadow: '0 3px 8px rgba(0,0,0,0.15)'
            }} />
        </div>
    </div>
);

const App = () => {
    // --- STATE ---
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('sc-user')) || null);
    const [adults, setAdults] = useState(() => Number(localStorage.getItem('sc-adults')) || 2);
    const [kids, setKids] = useState(() => Number(localStorage.getItem('sc-kids')) || 2);
    const [isVegetarian, setIsVegetarian] = useState(() => localStorage.getItem('sc-veggie') === 'true');
    const [activeTab, setActiveTab] = useState('plan');
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [checkedItems, setCheckedItems] = useState(() => JSON.parse(localStorage.getItem('sc-checked')) || {});
    const [pantry, setPantry] = useState(() => JSON.parse(localStorage.getItem('sc-pantry')) || {});

    // --- PERSISTENCE ---
    useEffect(() => {
        localStorage.setItem('sc-user', JSON.stringify(user));
        localStorage.setItem('sc-adults', adults);
        localStorage.setItem('sc-kids', kids);
        localStorage.setItem('sc-veggie', isVegetarian);
        localStorage.setItem('sc-checked', JSON.stringify(checkedItems));
        localStorage.setItem('sc-pantry', JSON.stringify(pantry));
    }, [user, adults, kids, isVegetarian, checkedItems, pantry]);

    // --- HOOKS ---
    useWakeLock(activeTab === 'cook' && !!selectedRecipe);

    // --- LOGIC ---
    const familyPoints = useMemo(() => adults + (kids * 0.7), [adults, kids]);

    const processedRecipes = useMemo(() => {
        return RECIPES.map(recipe => {
            const ings = recipe.ingredients.map(ing => ({
                ...ing,
                name: (isVegetarian && ing.nameVeg) ? ing.nameVeg : ing.name,
                qty: (ing.baseQty * familyPoints).toFixed(ing.unit === 'pc' ? 0 : 1)
            }));
            return {
                ...recipe,
                displayTitle: isVegetarian ? recipe.titleVeg : recipe.title,
                displayIngredients: ings,
                estCost: (recipe.costPerPortion * familyPoints).toFixed(2)
            };
        });
    }, [familyPoints, isVegetarian]);

    const recipesByDay = useMemo(() => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const grouped = {};
        days.forEach(d => grouped[d] = processedRecipes.filter(r => r.day === d));
        return grouped;
    }, [processedRecipes]);

    const activeShoppingList = useMemo(() => {
        const list = {};
        processedRecipes.forEach(recipe => {
            recipe.displayIngredients.forEach(ing => {
                if (pantry[ing.name]) return;
                const key = `${ing.name}-${ing.unit}`;
                if (!list[key]) list[key] = { ...ing, totalQty: 0 };
                list[key].totalQty += parseFloat(ing.qty);
            });
        });
        return Object.values(list).sort((a, b) => AISLES.indexOf(a.aisle) - AISLES.indexOf(b.aisle));
    }, [processedRecipes, pantry]);

    const toggleChecked = (id) => setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));

    // --- NAVIGATION ---
    const renderTabBar = () => (
        <div className="tab-bar">
            <button className={`tab-item ${activeTab === 'plan' ? 'active' : ''}`} onClick={() => setActiveTab('plan')}>
                <FiCalendar /> <span>Plan</span>
            </button>
            <button className={`tab-item ${activeTab === 'shop' ? 'active' : ''}`} onClick={() => setActiveTab('shop')}>
                <FiShoppingCart /> <span>Shop</span>
            </button>
            <button className={`tab-item ${activeTab === 'cook' ? 'active' : ''}`} onClick={() => setActiveTab('cook')}>
                <FiMap /> <span>Cook</span>
            </button>
            <button className={`tab-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
                <FiSettings /> <span>Settings</span>
            </button>
        </div>
    );

    // --- VIEWS ---

    const renderPlan = () => (
        <div className="tab-content fade-in">
            <div className="large-title"><h1>Meal Plan</h1></div>
            {Object.entries(recipesByDay).map(([day, meals]) => (
                <div key={day}>
                    <div className="section-header">{day}</div>
                    {meals.map(recipe => (
                        <div key={recipe.id} className="recipe-card-ios" onClick={() => { setSelectedRecipe(recipe); setActiveTab('cook'); window.scrollTo(0, 0); }}>
                            <div className="recipe-image-ios" style={{ backgroundImage: `url(${recipe.image})` }} />
                            <div className="recipe-info-ios">
                                <div style={{ fontSize: '13px', color: '#007AFF', fontWeight: 600, textTransform: 'uppercase' }}>{recipe.mealType} • £{recipe.estCost}</div>
                                <div style={{ fontSize: '19px', fontWeight: 700, margin: '4px 0' }}>{recipe.displayTitle}</div>
                                <div style={{ fontSize: '14px', color: '#8E8E93' }}>{recipe.prepTime} • {recipe.calories}</div>
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );

    const renderShop = () => (
        <div className="tab-content fade-in">
            <div className="large-title"><h1>Grocery List</h1></div>
            <div className="section-header">Based on {adults + kids} people</div>
            <div className="ios-list">
                {activeShoppingList.map(item => (
                    <div key={item.name} className={`ios-item ${checkedItems[item.name] ? 'checked' : ''}`} onClick={() => toggleChecked(item.name)}>
                        <div className="checkbox-ios">{checkedItems[item.name] && <FiCheck />}</div>
                        <span style={{ fontSize: '17px', flex: 1, color: checkedItems[item.name] ? '#8E8E93' : 'inherit' }}>
                            {item.totalQty.toFixed(1)}{item.unit} {item.name}
                        </span>
                        <div style={{ fontSize: '12px', color: '#8E8E93' }}>{item.aisle}</div>
                    </div>
                ))}
            </div>
            {activeShoppingList.length === 0 && <div style={{ textAlign: 'center', padding: '40px', color: '#8E8E93' }}>No items to buy!</div>}
        </div>
    );

    const renderCook = () => {
        if (!selectedRecipe) return (
            <div className="tab-content fade-in" style={{ textAlign: 'center', paddingTop: '100px' }}>
                <FiMap size={64} color="#C7C7CC" />
                <h2 style={{ marginTop: '20px' }}>No Meal Selected</h2>
                <p style={{ color: '#8E8E93' }}>Pick a meal from Plan to start cooking.</p>
                <button className="btn-ios" style={{ marginTop: '30px' }} onClick={() => setActiveTab('plan')}>Go to Plan</button>
            </div>
        );

        return (
            <div className="tab-content fade-in">
                <div style={{ position: 'relative' }}>
                    <button onClick={() => setSelectedRecipe(null)} style={{ background: 'none', border: 'none', color: '#007AFF', fontSize: '17px', padding: '10px 0' }}>Done</button>
                    <div className="wakelock-pill-ios">SCREEN ON</div>
                    <div className="large-title" style={{ paddingLeft: 0 }}><h1>Cook</h1></div>
                </div>

                <div className="recipe-card-ios" style={{ marginBottom: '24px' }}>
                    <div className="recipe-image-ios" style={{ backgroundImage: `url(${selectedRecipe.image})`, height: '150px' }} />
                    <div className="recipe-info-ios">
                        <h2 style={{ marginBottom: '4px' }}>{selectedRecipe.displayTitle}</h2>
                        <p style={{ color: '#8E8E93', fontSize: '15px' }}>{selectedRecipe.day} Strategy</p>
                    </div>
                </div>

                <div className="section-header">Ingredients Needed</div>
                <div className="prep-list">
                    {selectedRecipe.displayIngredients.map(ing => (
                        <div key={ing.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '0.5px solid rgba(0,0,0,0.05)' }}>
                            <span style={{ fontWeight: 600 }}>{ing.name}</span>
                            <span style={{ color: '#007AFF', fontWeight: 700 }}>{ing.qty} {ing.unit}</span>
                        </div>
                    ))}
                </div>

                <div className="section-header">Cooking Steps</div>
                {selectedRecipe.steps.map((step, idx) => (
                    <div key={idx} className={`step-bubble ${checkedItems[`cook-${selectedRecipe.id}-${idx}`] ? 'checked' : 'active'}`} onClick={() => toggleChecked(`cook-${selectedRecipe.id}-${idx}`)}>
                        <div style={{ display: 'flex', gap: '15px' }}>
                            <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#007AFF', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 700 }}>{idx + 1}</div>
                            <p style={{ fontSize: '18px', lineHeight: '1.5', fontWeight: 500 }}>{step}</p>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const renderSettings = () => (
        <div className="tab-content fade-in">
            <div className="large-title"><h1>Settings</h1></div>

            <div className="section-header">Household</div>
            <div className="ios-list">
                <div className="ios-item">
                    <span style={{ flex: 1 }}>Family Members</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <button onClick={() => setAdults(Math.max(1, adults - 1))} style={{ width: '30px', height: '30px', borderRadius: '50%', border: '1px solid #007AFF', background: 'none', color: '#007AFF' }}>-</button>
                        <span style={{ fontWeight: 700 }}>{adults + kids}</span>
                        <button onClick={() => setAdults(adults + 1)} style={{ width: '30px', height: '30px', borderRadius: '50%', border: '1px solid #007AFF', background: 'none', color: '#007AFF' }}>+</button>
                    </div>
                </div>
                <AppleToggle label="Vegetarian Mode" value={isVegetarian} onToggle={() => setIsVegetarian(!isVegetarian)} />
            </div>

            <div className="section-header">Pantry (I already have these)</div>
            <div className="ios-list">
                {['Pasta', 'Rice', 'Oats', 'Honey', 'Lemon', 'Chicken'].map(item => (
                    <AppleToggle key={item} label={item} value={pantry[item]} onToggle={() => setPantry(prev => ({ ...prev, [item]: !prev[item] }))} />
                ))}
            </div>

            <div className="section-header">Account</div>
            <div className="ios-list">
                <div className="ios-item" onClick={() => setUser(null)} style={{ color: '#FF3B30', justifyContent: 'center', fontWeight: 600 }}>Sign Out</div>
            </div>
        </div>
    );

    const renderLogin = () => (
        <div className="login-overlay fade-in">
            <div className="recipe-card-ios" style={{ width: '90%', maxWidth: '350px', padding: '40px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: '60px', marginBottom: '10px' }}>🥗</div>
                <h1 style={{ fontSize: '28px' }}>Sous Chef UK</h1>
                <p style={{ color: '#8E8E93', marginBottom: '40px' }}>Zero-Waste Meal Strategy</p>
                <button className="btn-ios" onClick={() => setUser({ name: 'James' })}>Get Started</button>
            </div>
        </div>
    );

    return (
        <div className="app-container">
            {!user && renderLogin()}
            <main>
                {activeTab === 'plan' && renderPlan()}
                {activeTab === 'shop' && renderShop()}
                {activeTab === 'cook' && renderCook()}
                {activeTab === 'settings' && renderSettings()}
            </main>
            {renderTabBar()}
        </div>
    );
};

export default App;
