# ScrollReveal Animation Timing Issue

**Date:** January 8, 2026

## Problem

Homepage sections displayed headers immediately but card content below remained invisible until the user scrolled up and down multiple times. This created a poor user experience where content appeared inconsistent and users had to manually trigger reveals through repeated scrolling.

## Root Cause

The issue stemmed from Astro's component architecture combined with how the ScrollReveal script was implemented:

1. **Astro inlines `<script>` tags** in each component instance, causing the script to execute multiple times
2. **Global initialization guard** (`window.__scrollRevealInitialized = true`) prevented subsequent script executions after the first component loaded
3. **Elements never observed**: Only the first ScrollReveal component's elements were registered with the IntersectionObserver; all other elements remained unobserved
4. **No fallback mechanism**: Without observation, elements could only be revealed through manual scroll events (which weren't implemented initially)

## Diagnosis Process

1. **Playwright Testing**: Used browser automation to capture screenshots showing headers visible but cards missing
2. **DOM Inspection**: Checked element classes - found `.scroll-reveal` elements without the `.revealed` class despite being in viewport
3. **Manual Reveal Test**: Manually added `.revealed` class via console - content appeared immediately, confirming CSS was correct
4. **Script Execution Analysis**: Discovered the initialization guard was blocking subsequent script runs, preventing element observation

## Solution

Refactored from per-component observers to a **global singleton observer pattern**:

```javascript
// Global system initialized once
window.__scrollRevealSystem = {
  observer: new IntersectionObserver(...),
  checkVisibleElements: () => {...}
};

// Each component registers its elements with the global observer
elements.forEach(el => {
  if (!el.dataset.observed) {
    el.dataset.observed = 'true';
    window.__scrollRevealSystem.observer.observe(el);
  }
});
```

**Key improvements:**
- Single IntersectionObserver shared across all components
- Elements marked with `data-observed` to prevent duplicate observations
- Event listeners (scroll, load) attached only once globally
- Immediate visibility check runs 50ms after component initialization
- 100px rootMargin provides early triggering for smooth reveals

## Why This Fix

This solution aligns with Astro's SSG architecture where component scripts run at build time and are inlined. The singleton pattern ensures:
- **Performance**: One observer instead of N observers (one per component)
- **Correctness**: All elements get observed regardless of component order
- **Reliability**: Fallback checks ensure no elements are missed
- **Maintainability**: Clear separation between global initialization and per-component registration

The fix respects the framework's design while solving the multiple-execution challenge inherent to component-scoped scripts.
