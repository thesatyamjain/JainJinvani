## 2024-05-15 - Interactive Framer Motion Divs Need to be Buttons
**Learning:** Using `motion.div` with an `onClick` handler prevents native keyboard accessibility and lacks proper semantic ARIA roles by default, hindering screen reader and keyboard-only users.
**Action:** Changed interactive UI tiles (like Dock icons) from `<motion.div>` to `<motion.button>` and added appropriate `aria-label`s and `focus-visible` styles to ensure seamless keyboard navigation and screen reader support.
