# AI Odyssey - Challenge Answers

> **Copy and paste the answer text below into the submission box.** Each answer is case-insensitive and ignores extra whitespace.

---

## Easy Challenges (1-20)

### Challenge 1: Missing Closing Tag
**Answer:** `Add </html> at the end of the document`

### Challenge 2: Navbar Broken
**Answer:** `Change .nav-container display to flex and .nav-links display to flex, and .nav-links li display to inline-block or remove it`

### Challenge 3: Broken Footer
**Answer:** `Add display:flex, flex-direction:column to body, and margin-top:auto to footer`

### Challenge 4: Image Not Showing
**Answer:** `Add a valid image URL or use an online image as src, and add an onerror handler with a fallback image`

### Challenge 5: Broken Contact Form
**Answer:** `Add for attributes to labels matching their input ids: for='name', for='email'`

### Challenge 6: Login Validation
**Answer:** `Add validation checking username.value.trim() and password.value.trim() before submitting`

### Challenge 7: Incorrect Flex Alignment
**Answer:** `Add justify-content: center and align-items: center to .flex-container`

### Challenge 8: Broken CSS Grid
**Answer:** `Add grid-template-columns: repeat(3, 1fr) to .grid-container`

### Challenge 9: Missing Hover Effect
**Answer:** `Add .btn:hover { background: #0056b3; transform: scale(1.05); }`

### Challenge 10: Button Not Clickable
**Answer:** `Change .action-btn z-index to 2, or add pointer-events: none to .overlay`

### Challenge 11: Modal Doesn't Open
**Answer:** `Add document.getElementById('modal').classList.add('active') to the open button handler`

### Challenge 12: Dropdown Broken
**Answer:** `Add document.getElementById('dropdownMenu').classList.toggle('show') in the click handler`

### Challenge 13: Counter Doesn't Increase
**Answer:** `Add count++; document.getElementById('countValue').textContent = count;`

### Challenge 14: Calculator Wrong Output
**Answer:** `Use Number(a) + Number(b) or parseFloat(a) + parseFloat(b)`

### Challenge 15: Clock Doesn't Update
**Answer:** `Add setInterval(updateClock, 1000); after the initial call`

### Challenge 16: Theme Toggle Broken
**Answer:** `Toggle: isDark = !isDark; document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')`

### Challenge 17: Todo Delete Fails
**Answer:** `Change the delete handler to: this.parentElement.remove()`

### Challenge 18: Search Doesn't Filter
**Answer:** `Add: item.style.display = item.textContent.toLowerCase().includes(query) ? '' : 'none'`

### Challenge 19: Accordion Doesn't Expand
**Answer:** `Add: this.nextElementSibling.classList.toggle('active')`

### Challenge 20: Tabs Don't Switch
**Answer:** `Remove active from all, add active to clicked button and corresponding panel`

---

## Medium Challenges (21-40)

### Challenge 21: API Fetch Error
**Answer:** `Change 'return response' to 'return response.json()'`

### Challenge 22: Promise Never Resolves
**Answer:** `Add 'resolve(value)' inside the setTimeout callback`

### Challenge 23: Async Await Bug
**Answer:** `Add 'await' before fetch() and before response.json()`

### Challenge 24: Weather Card Broken
**Answer:** `Style the card with background gradient, padding, rounded corners, shadow, and flexbox layout`

### Challenge 25: Shopping Cart Total Wrong
**Answer:** `Change to: total += Number(item.dataset.price) or parseFloat(item.dataset.price)`

### Challenge 26: LocalStorage Doesn't Save
**Answer:** `Add an auto-load on page load: window.addEventListener('load', function() { ... })`

### Challenge 27: SessionStorage Bug
**Answer:** `Save with JSON.stringify(user), load with JSON.parse(sessionStorage.getItem('user'))`

### Challenge 28: Form Regex Error
**Answer:** `Update regex to: /^[\\w.-]+@[\\w.-]+\\.\\w{2,}$/`

### Challenge 29: Password Meter Broken
**Answer:** `Calculate score: length > 8 (+25), has numbers (+25), has upper/lower (+25), has special chars (+25)`

### Challenge 30: Slider Doesn't Move
**Answer:** `Add: container.style.transform = \`translateX(-${currentSlide * (100/3)}%)\``

### Challenge 31: Drag Drop Broken
**Answer:** `Get the dragged item reference and use insertBefore to move it`

### Challenge 32: Canvas Doesn't Draw
**Answer:** `Add ctx.beginPath() before arc() and ctx.closePath() after fill()`

### Challenge 33: SVG Animation Missing
**Answer:** `Add @keyframes spin animation definition`

### Challenge 34: Infinite Loop
**Answer:** `Change 'for (let i = 0; i >= 0; i++)' to 'for (let i = 0; i <= n; i++)'`

### Challenge 35: Event Bubbling Bug
**Answer:** `Add e.stopPropagation() in each click handler`

### Challenge 36: Memory Leak
**Answer:** `Add 'clearInterval(interval)' in the stop button handler`

### Challenge 37: Lazy Loading Broken
**Answer:** `Add: img.src = img.dataset.src; observer.unobserve(img);`

### Challenge 38: Responsive Dashboard
**Answer:** `Add @media queries: mobile sidebar collapses, widgets become single column`

### Challenge 39: Keyboard Accessibility
**Answer:** `Add keyboard handlers with proper ARIA attributes and focus management`

### Challenge 40: Animation Stuck
**Answer:** `Change 'animation: bounce 1s' to 'animation: bounce 1s infinite'`

---

## Hard Challenges (41-49)

### Challenge 41: CSS Variable Conflict
**Answer:** `Move Component B outside or use different variable names for isolation`

### Challenge 42: Grid Overflow
**Answer:** `Remove white-space:nowrap and use grid-template-columns: repeat(auto-fill, minmax(300px, 1fr))`

### Challenge 43: Dark Theme Conflict
**Answer:** `Replace hardcoded colors with CSS variable references throughout`

### Challenge 44: API Timeout
**Answer:** `Use Promise.race([fetch(url), new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))])`

### Challenge 45: Multi-step Form
**Answer:** `Implement step navigation with showStep() function that hides all and shows current`

### Challenge 46: Quiz Logic Broken
**Answer:** `Add click handlers to options, compare with correct index, update score, show feedback`

### Challenge 47: Notification System
**Answer:** `Add setTimeout to remove the element after 3 seconds with fade-out animation`

### Challenge 48: Escape Room Puzzle
**Answer:** `Add logic: if (key === sequence[currentIndex]) currentIndex++; else currentIndex = 0; check if complete`

### Challenge 49: Final Portal
**Answer:** `Update condition 2's display and call checkAllConditions() after each condition`

---

## Boss Challenge (50)

### Challenge 50: Master Debug Arena
**Answer:** `Fix all 25 bugs across HTML (missing tags, attributes), CSS (display:none, wrong selectors), and JS (logic, async, events)`
