# Mobile-First Refactoring Plan for Sous Chef UK

## Context
User wants to transform the current desktop-centric React app into a mobile-first PWA experience that handles the "real life" stress of UK parents.

## 1. Dependency Installation
Please execute the following command to add responsive icons and PWA capabilities:
`npm install react-icons vite-plugin-pwa`

## 2. CSS Architecture Overhaul (`src/index.css`)
**Goal:** Implement a mobile-first grid system and bottom navigation support.

* **Define Breakpoints:**
    * Mobile: < 768px (Default styles)
    * Desktop: >= 768px (`@media (min-width: 768px)`)
* **Layout Changes:**
    * `app-container`: Remove fixed padding on mobile. Use `100vw`.
    * `grid-main`:
        * Mobile: `display: block`.
        * Desktop: `display: grid; grid-template-columns: 320px 1fr;`.
* **New Utility Classes:**
    * `.mobile-only`: `display: block` (Mobile), `display: none` (Desktop).
    * `.desktop-only`: `display: none` (Mobile), `display: block` (Desktop).
    * `.bottom-nav`: Fixed position at bottom, z-index 1000, glassmorphism effect.

## 3. Component Refactoring (`src/App.jsx`)

### A. Navigation Transformation
* **Action:** Replace the top `<header>` buttons with a conditional rendering system.
* **Desktop:** Keep the header nav.
* **Mobile:** Create a new `<BottomNav />` component containing:
    * Plan (Calendar Icon)
    * Shop (Cart Icon)
    * Cook (Chef Hat Icon)
    * Settings (Gear Icon) -> *New Tab!*

### B. Settings Migration
* **Current:** `renderDashboard` is a sidebar.
* **New Logic:**
    * Extract `renderDashboard` into a standalone component `<SettingsPanel />`.
    * On Desktop: Render inside `<aside>`.
    * On Mobile: Render only when `activeTab === 'settings'`.

### C. "Cook Mode" Enhancements (The 6 PM Panic Fix)
* **Wake Lock:** Implement a `useWakeLock` hook that activates when `activeTab === 'cook'`.
* **UI:** Increase font size of steps. Add a checkbox next to each step (not just a div) for easy tapping.

### D. Shopping List Optimization (The Tesco Chaos Fix)
* **WhatsApp Share:** Update the share function to format the text clearly:
    ```text
    🛒 Sous Chef List [Week 12]
    
    🥬 PRODUCE
    - [ ] 2.5kg Potatoes
    - [ ] 1kg Carrots
    
    🥩 MEAT
    - [ ] 1 Whole Chicken
    ```

## 4. Execution Prompts (Copy & Paste these to Agent)

**Prompt 1 (CSS):**
"Refactor `src/index.css` to be mobile-first. Move the current desktop layout styles into a `@media (min-width: 768px)` block. Create a `.bottom-nav` class for a fixed bottom bar on mobile."

**Prompt 2 (App Structure):**
"Refactor `src/App.jsx`. Extract the `renderDashboard` logic into a separate `SettingsPanel` component. Implement a bottom navigation bar for mobile that sets `activeTab`. Move the Dashboard logic to a new 'settings' tab on mobile, but keep it as a sidebar on desktop."

**Prompt 3 (Cook Mode):**
"Enhance the `renderCook` function. Add a 'Wake Lock' feature using the Screen Wake Lock API so the screen stays on. Increase the font size of the steps and make the active step highlighted."