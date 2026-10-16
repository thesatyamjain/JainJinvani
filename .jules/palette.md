## 2024-10-16 - Avoiding placeholder selectors for Hindi text in Playwright scripts
**Learning:** When writing Playwright automation scripts for UI verification, selecting elements by Hindi `placeholder` attributes (e.g., `input[placeholder='खोजें...']`) can be brittle and lead to timeout errors, possibly due to encoding mismatches, dynamic rendering, or trailing ellipsis differences.
**Action:** Always favor more robust, language-agnostic selectors like `input[type="text"]` or specifically defined `data-testid` attributes when writing tests for localized UI elements.
