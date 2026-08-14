/* ============================================
   AI ODYSSEY - Challenges Database
   ============================================ */

const ChallengesDB = [
    // ============ EASY CHALLENGES (1-20) ============
    
    // Challenge 1: Missing Closing Tag
    {
        id: 1,
        title: "Missing Closing Tag",
        category: "HTML",
        difficulty: "easy",
        points: 50,
        description: "The HTML structure has a missing closing tag causing the layout to break. Find and fix the missing tag.",
        objective: "Fix the HTML by adding the missing closing tag to restore proper document structure.",
        brokenHTML: `<!DOCTYPE html>\n<html>\n<head>\n    <title>My Page</title>\n</head>\n<body>\n    <div class="container">\n        <h1>Welcome</h1>\n        <p>This is a paragraph</p>\n    </div>\n</body>\n</html>`,
        brokenCSS: "",
        brokenJS: "",
        expectedOutput: "Properly closed HTML document with no validation errors",
        flag: "AIODYSSEY{missing_closing_tag}",
        hint1: "Check the nesting of HTML tags - every opening tag needs a matching closing tag",
        hint2: "Look at the end of the document - what tag might be missing?",
        solution: "</html>"
    },

    // Challenge 2: Navbar Broken
    {
        id: 2,
        title: "Navbar Broken",
        category: "CSS",
        difficulty: "easy",
        points: 50,
        description: "The navigation bar is not displaying properly. The links are stacked vertically instead of horizontally.",
        objective: "Fix the CSS to make the navbar display links in a horizontal row.",
        brokenHTML: `<nav class="navbar">\n    <div class="nav-container">\n        <div class="logo">Logo</div>\n        <ul class="nav-links">\n            <li><a href="#">Home</a></li>\n            <li><a href="#">About</a></li>\n            <li><a href="#">Contact</a></li>\n        </ul>\n    </div>\n</nav>`,
        brokenCSS: `.navbar { background: #333; padding: 1rem; }\n.nav-container { display: block; }\n.nav-links { display: block; }\n.nav-links li { display: block; margin: 0.5rem 0; }\n.nav-links a { color: white; text-decoration: none; }`,
        brokenJS: "",
        expectedOutput: "Navigation links displayed horizontally in a row",
        flag: "AIODYSSEY{navbar_fixed}",
        hint1: "Look at the display property of nav-container and nav-links",
        hint2: "Consider using flexbox for horizontal layout",
        solution: "display: flex"
    },

    // Challenge 3: Broken Footer
    {
        id: 3,
        title: "Broken Footer",
        category: "HTML",
        difficulty: "easy",
        points: 50,
        description: "The footer is displaying at the wrong position. It should stick to the bottom of the page.",
        objective: "Fix the footer so it stays at the bottom of the page.",
        brokenHTML: `<body>\n    <header>Header Content</header>\n    <main>Main Content Here</main>\n    <footer style="position: absolute; bottom: 0;">\n        <p>&copy; 2025 My Website</p>\n    </footer>\n</body>`,
        brokenCSS: `body { min-height: 100vh; margin: 0; }\nheader { padding: 1rem; background: #f0f0f0; }\nmain { padding: 2rem; }`,
        brokenJS: "",
        expectedOutput: "Footer positioned at the bottom of the page regardless of content height",
        flag: "AIODYSSEY{footer_fixed}",
        hint1: "The footer uses absolute positioning which doesn't account for page flow",
        hint2: "Consider using flexbox on the body to push the footer down",
        solution: "display: flex; flex-direction: column; margin-top: auto"
    },

    // Challenge 4: Image Not Showing
    {
        id: 4,
        title: "Image Not Showing",
        category: "HTML",
        difficulty: "easy",
        points: 50,
        description: "The image is not displaying on the webpage. The src attribute might be incorrect.",
        objective: "Fix the image path or attributes so the image displays correctly.",
        brokenHTML: `<div class="image-container">\n    <img src="images/photo.jpg" alt="Description">\n    <p>Beautiful scenery</p>\n</div>`,
        brokenCSS: `.image-container { text-align: center; padding: 2rem; }\nimg { max-width: 100%; height: auto; }`,
        brokenJS: "",
        expectedOutput: "Image displayed on the page with proper fallback",
        flag: "AIODYSSEY{<img src=\"images/photo.jpg\" alt=\"Description\">}",
        hint1: "Check if the image file exists at the specified path",
        hint2: "Consider adding an onerror handler or using a more reliable image source",
        solution: "https://picsum.photos/200"
    },

    // Challenge 5: Broken Contact Form
    {
        id: 5,
        title: "Broken Contact Form",
        category: "HTML",
        difficulty: "easy",
        points: 50,
        description: "The contact form is not submitting properly. The form fields are not correctly associated with labels.",
        objective: "Fix the form by properly associating labels with their input fields.",
        brokenHTML: `<form id="contactForm">\n    <div class="form-group">\n        <label>Name</label>\n        <input type="text" id="name">\n    </div>\n    <div class="form-group">\n        <label>Email</label>\n        <input type="email" id="email">\n    </div>\n    <button type="submit">Send</button>\n</form>`,
        brokenCSS: "",
        brokenJS: "",
        expectedOutput: "Form with properly associated labels and inputs that can be submitted",
        flag: "AIODYSSEY{form_fixed}",
        hint1: "Labels need a 'for' attribute that matches the input's 'id'",
        hint2: "Check the WAI-ARIA guidelines for accessible forms",
        solution: 'for="name"'
    },

    // Challenge 6: Login Validation
    {
        id: 6,
        title: "Login Validation",
        category: "JavaScript",
        difficulty: "easy",
        points: 50,
        description: "The login form doesn't validate inputs before submission. Empty fields are accepted.",
        objective: "Add validation to ensure username and password are not empty before submission.",
        brokenHTML: `<form id="loginForm">\n    <input type="text" id="username" placeholder="Username">\n    <input type="password" id="password" placeholder="Password">\n    <button type="submit">Login</button>\n</form>`,
        brokenCSS: "",
        brokenJS: `document.getElementById('loginForm').addEventListener('submit', function(e) {\n    e.preventDefault();\n    alert('Login submitted!');\n});`,
        expectedOutput: "Form validates that both fields have values before showing success",
        flag: "AIODYSSEY{login_validated}",
        hint1: "Check if the fields have values before proceeding",
        hint2: "Use .value.trim() to check for empty inputs",
        solution: "username.value.trim() && password.value.trim()"
    },

    // Challenge 7: Incorrect Flex Alignment
    {
        id: 7,
        title: "Incorrect Flex Alignment",
        category: "CSS",
        difficulty: "easy",
        points: 50,
        description: "Items inside a flex container are not centered as intended.",
        objective: "Fix the flexbox properties to center items both horizontally and vertically.",
        brokenHTML: `<div class="flex-container">\n    <div class="item">1</div>\n    <div class="item">2</div>\n    <div class="item">3</div>\n</div>`,
        brokenCSS: `.flex-container { display: flex; width: 100%; height: 300px; background: #f0f0f0; }\n.item { padding: 2rem; background: #007bff; color: white; margin: 0.5rem; }`,
        brokenJS: "",
        expectedOutput: "Items centered both horizontally and vertically in the container",
        flag: "AIODYSSEY{flex_centered}",
        hint1: "You need to use justify-content and align-items together",
        hint2: "Both properties need to be set to 'center'",
        solution: "justify-content: center; align-items: center"
    },

    // Challenge 8: Broken CSS Grid
    {
        id: 8,
        title: "Broken CSS Grid",
        category: "CSS",
        difficulty: "easy",
        points: 50,
        description: "The CSS Grid layout is not creating the expected 3-column layout.",
        objective: "Fix the grid properties to create a proper 3-column grid layout.",
        brokenHTML: `<div class="grid-container">\n    <div class="grid-item">A</div>\n    <div class="grid-item">B</div>\n    <div class="grid-item">C</div>\n    <div class="grid-item">D</div>\n    <div class="grid-item">E</div>\n</div>`,
        brokenCSS: `.grid-container { display: grid; gap: 1rem; }\n.grid-item { padding: 2rem; background: #007bff; color: white; text-align: center; }`,
        brokenJS: "",
        expectedOutput: "A 3-column grid layout with items arranged properly",
        flag: "AIODYSSEY{grid_fixed}",
        hint1: "Use grid-template-columns to define the column layout",
        hint2: "The value 'repeat(3, 1fr)' creates three equal columns",
        solution: "grid-template-columns: repeat(3, 1fr)"
    },

    // Challenge 9: Missing Hover Effect
    {
        id: 9,
        title: "Missing Hover Effect",
        category: "CSS",
        difficulty: "easy",
        points: 50,
        description: "The buttons should change appearance when hovered, but nothing happens.",
        objective: "Add CSS hover effects to make buttons interactive.",
        brokenHTML: `<button class="btn">Click Me</button>\n<button class="btn">Submit</button>`,
        brokenCSS: `.btn { padding: 1rem 2rem; background: #007bff; color: white; border: none; border-radius: 4px; font-size: 1rem; cursor: pointer; }`,
        brokenJS: "",
        expectedOutput: "Buttons change color, scale, or add shadow when hovered",
        flag: "AIODYSSEY{hover_added}",
        hint1: "Use the :hover pseudo-class to add hover effects",
        hint2: "Consider adding transform: scale() and background color change",
        solution: ".btn:hover { background: #0056b3; transform: scale(1.05); }"
    },

    // Challenge 10: Button Not Clickable
    {
        id: 10,
        title: "Button Not Clickable",
        category: "CSS",
        difficulty: "easy",
        points: 50,
        description: "The button appears but cannot be clicked. Something is blocking it.",
        objective: "Fix the z-index or pointer-events so the button responds to clicks.",
        brokenHTML: `<div class="overlay-container">\n    <div class="overlay"></div>\n    <button class="action-btn">Click Me</button>\n</div>`,
        brokenCSS: `.overlay-container { position: relative; width: 200px; height: 100px; }\n.overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1; }\n.action-btn { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); padding: 1rem 2rem; background: #007bff; color: white; border: none; cursor: pointer; z-index: 0; }`,
        brokenJS: "",
        expectedOutput: "Button is clickable and responds to user interaction",
        flag: "AIODYSSEY{button_fixed}",
        hint1: "The overlay has a higher z-index than the button",
        hint2: "Either increase the button's z-index or add pointer-events: none to the overlay",
        solution: "pointer-events: none"
    },

    // Challenge 11: Modal Doesn't Open
    {
        id: 11,
        title: "Modal Doesn't Open",
        category: "JavaScript",
        difficulty: "easy",
        points: 50,
        description: "Clicking the 'Open Modal' button doesn't show the modal overlay.",
        objective: "Fix the JavaScript so the modal opens when the button is clicked.",
        brokenHTML: `<button id="openModal">Open Modal</button>\n<div id="modal" class="modal-overlay">\n    <div class="modal">\n        <h2>Modal Title</h2>\n        <p>Modal content here</p>\n        <button id="closeModal">Close</button>\n    </div>\n</div>`,
        brokenCSS: `.modal-overlay { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); }\n.modal-overlay.active { display: block; }\n.modal { background: white; padding: 2rem; max-width: 500px; margin: 10% auto; }`,
        brokenJS: `document.getElementById('openModal').addEventListener('click', function() {\n    // Missing implementation\n});\ndocument.getElementById('closeModal').addEventListener('click', function() {\n    document.getElementById('modal').classList.remove('active');\n});`,
        expectedOutput: "Modal opens when button is clicked and closes when close button is clicked",
        flag: "AIODYSSEY{modal_fixed}",
        hint1: "The open handler needs to add the 'active' class to the modal",
        hint2: "Use classList.add('active') on the modal element",
        solution: "document.getElementById('modal').classList.add('active')"
    },

    // Challenge 12: Dropdown Broken
    {
        id: 12,
        title: "Dropdown Broken",
        category: "JavaScript",
        difficulty: "easy",
        points: 50,
        description: "The dropdown menu doesn't show when its toggle button is clicked.",
        objective: "Fix the dropdown toggle functionality to show/hide the menu.",
        brokenHTML: `<div class="dropdown">\n    <button id="dropdownToggle">Menu ▾</button>\n    <ul id="dropdownMenu" class="dropdown-menu">\n        <li>Option 1</li>\n        <li>Option 2</li>\n        <li>Option 3</li>\n    </ul>\n</div>`,
        brokenCSS: `.dropdown { position: relative; display: inline-block; }\n.dropdown-menu { display: none; position: absolute; background: white; list-style: none; padding: 0; margin: 0; border: 1px solid #ccc; }\n.dropdown-menu.show { display: block; }`,
        brokenJS: `document.getElementById('dropdownToggle').addEventListener('click', function() {\n    // Toggle dropdown\n});`,
        expectedOutput: "Dropdown menu toggles visibility when the toggle button is clicked",
        flag: "AIODYSSEY{dropdown_fixed}",
        hint1: "Use classList.toggle() to toggle the 'show' class",
        hint2: "Target the dropdown menu by its ID",
        solution: "document.getElementById('dropdownMenu').classList.toggle('show')"
    },

    // Challenge 13: Counter Doesn't Increase
    {
        id: 13,
        title: "Counter Doesn't Increase",
        category: "JavaScript",
        difficulty: "easy",
        points: 50,
        description: "The counter value stays at 0 when the increment button is clicked.",
        objective: "Fix the counter logic so it increments on each button click.",
        brokenHTML: `<div class="counter">\n    <span id="countValue">0</span>\n    <button id="incrementBtn">+</button>\n</div>`,
        brokenCSS: "",
        brokenJS: `let count = 0;\ndocument.getElementById('incrementBtn').addEventListener('click', function() {\n    // Count should increase\n});`,
        expectedOutput: "Counter increases by 1 each time the button is clicked",
        flag: "AIODYSSEY{counter_fixed}",
        hint1: "Increment the count variable and update the display",
        hint2: "Use count++; and then update the textContent of the display element",
        solution: "Add count++; document.getElementById('countValue').textContent = count;"
    },

    // Challenge 14: Calculator Wrong Output
    {
        id: 14,
        title: "Calculator Wrong Output",
        category: "JavaScript",
        difficulty: "easy",
        points: 50,
        description: "The calculator returns wrong results for basic arithmetic operations.",
        objective: "Fix the calculation logic to produce correct arithmetic results.",
        brokenHTML: `<div class="calculator">\n    <input type="number" id="num1" value="5">\n    <input type="number" id="num2" value="3">\n    <button id="addBtn">Add</button>\n    <p>Result: <span id="result">0</span></p>\n</div>`,
        brokenCSS: "",
        brokenJS: `document.getElementById('addBtn').addEventListener('click', function() {\n    const a = document.getElementById('num1').value;\n    const b = document.getElementById('num2').value;\n    document.getElementById('result').textContent = a + b;\n});`,
        expectedOutput: "Calculator shows 8 when adding 5 and 3",
        flag: "AIODYSSEY{calculator_fixed}",
        hint1: "Input values are strings - they need to be converted to numbers",
        hint2: "Use Number() or parseInt() to convert strings to numbers",
        solution: "Use Number(a) + Number(b) or parseFloat(a) + parseFloat(b)"
    },

    // Challenge 15: Clock Doesn't Update
    {
        id: 15,
        title: "Clock Doesn't Update",
        category: "JavaScript",
        difficulty: "easy",
        points: 50,
        description: "The digital clock displays the time but never updates.",
        objective: "Fix the clock to update every second.",
        brokenHTML: `<div class="clock">\n    <h1 id="clockDisplay">00:00:00</h1>\n</div>`,
        brokenCSS: ".clock { text-align: center; padding: 2rem; font-family: monospace; }",
        brokenJS: `function updateClock() {\n    const now = new Date();\n    const time = now.toLocaleTimeString();\n    document.getElementById('clockDisplay').textContent = time;\n}\nupdateClock();`,
        expectedOutput: "Clock updates every second to show current time",
        flag: "AIODYSSEY{clock_fixed}",
        hint1: "updateClock() is called once but needs to be called repeatedly",
        hint2: "Use setInterval() to call updateClock every 1000 milliseconds",
        solution: "Add setInterval(updateClock, 1000); after the initial call"
    },

    // Challenge 16: Theme Toggle Broken
    {
        id: 16,
        title: "Theme Toggle Broken",
        category: "CSS",
        difficulty: "easy",
        points: 50,
        description: "The theme toggle button doesn't change the page theme.",
        objective: "Fix the theme toggle to switch between light and dark modes.",
        brokenHTML: `<button id="themeBtn">Toggle Theme</button>\n<div class="content">\n    <h1>Theme Test</h1>\n    <p>This content should change with theme</p>\n</div>`,
        brokenCSS: `:root { --bg: white; --text: black; }\n[data-theme="dark"] { --bg: #1a1a2e; --text: #e0e0ff; }\nbody { background: var(--bg); color: var(--text); transition: all 0.3s; }`,
        brokenJS: `let isDark = false;\ndocument.getElementById('themeBtn').addEventListener('click', function() {\n    // Toggle theme\n});`,
        expectedOutput: "Page theme toggles between light and dark when button is clicked",
        flag: "AIODYSSEY{theme_fixed}",
        hint1: "Set the data-theme attribute on the documentElement",
        hint2: "Use document.documentElement.setAttribute('data-theme', 'dark')",
        solution: "Toggle: isDark = !isDark; document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')"
    },

    // Challenge 17: Todo Delete Fails
    {
        id: 17,
        title: "Todo Delete Fails",
        category: "JavaScript",
        difficulty: "easy",
        points: 50,
        description: "Items added to the todo list cannot be deleted using the delete button.",
        objective: "Fix the delete functionality to remove todo items from the list.",
        brokenHTML: `<div class="todo-app">\n    <input type="text" id="todoInput" placeholder="Add todo">\n    <button id="addTodo">Add</button>\n    <ul id="todoList"></ul>\n</div>`,
        brokenCSS: "",
        brokenJS: `document.getElementById('addTodo').addEventListener('click', function() {\n    const input = document.getElementById('todoInput');\n    if (input.value.trim()) {\n        const li = document.createElement('li');\n        li.textContent = input.value;\n        const delBtn = document.createElement('button');\n        delBtn.textContent = 'Delete';\n        delBtn.onclick = function() {\n            // Should remove this li\n        };\n        li.appendChild(delBtn);\n        document.getElementById('todoList').appendChild(li);\n        input.value = '';\n    }\n});`,
        expectedOutput: "Todo items can be deleted by clicking their delete button",
        flag: "AIODYSSEY{todo_fixed}",
        hint1: "The delete handler needs to remove the parent li element",
        hint2: "Use this.parentElement.remove() or this.closest('li').remove()",
        solution: "Change the delete handler to: this.parentElement.remove()"
    },

    // Challenge 18: Search Doesn't Filter
    {
        id: 18,
        title: "Search Doesn't Filter",
        category: "JavaScript",
        difficulty: "easy",
        points: 50,
        description: "Typing in the search box doesn't filter the list of items.",
        objective: "Fix the search filter to show only matching items.",
        brokenHTML: `<div class="search-app">\n    <input type="text" id="searchInput" placeholder="Search...">\n    <ul id="searchList">\n        <li>Apple</li>\n        <li>Banana</li>\n        <li>Orange</li>\n        <li>Grape</li>\n    </ul>\n</div>`,
        brokenCSS: "",
        brokenJS: `document.getElementById('searchInput').addEventListener('input', function() {\n    const query = this.value.toLowerCase();\n    const items = document.querySelectorAll('#searchList li');\n    items.forEach(item => {\n        // Filter items\n    });\n});`,
        expectedOutput: "List items filter in real-time as user types in the search box",
        flag: "AIODYSSEY{search_fixed}",
        hint1: "Check if the item text includes the search query",
        hint2: "Use item.textContent.toLowerCase().includes(query) and toggle display",
        solution: "Add: item.style.display = item.textContent.toLowerCase().includes(query) ? '' : 'none'"
    },

    // Challenge 19: Accordion Doesn't Expand
    {
        id: 19,
        title: "Accordion Doesn't Expand",
        category: "JavaScript",
        difficulty: "easy",
        points: 50,
        description: "Clicking on accordion headers doesn't expand the content panels.",
        objective: "Fix the accordion to toggle content visibility on header click.",
        brokenHTML: `<div class="accordion">\n    <div class="accordion-item">\n        <div class="accordion-header">Section 1</div>\n        <div class="accordion-content">Content 1</div>\n    </div>\n    <div class="accordion-item">\n        <div class="accordion-header">Section 2</div>\n        <div class="accordion-content">Content 2</div>\n    </div>\n</div>`,
        brokenCSS: `.accordion-content { display: none; }\n.accordion-content.active { display: block; }`,
        brokenJS: `document.querySelectorAll('.accordion-header').forEach(header => {\n    header.addEventListener('click', function() {\n        // Toggle content\n    });\n});`,
        expectedOutput: "Accordion content panels expand/collapse when headers are clicked",
        flag: "AIODYSSEY{accordion_fixed}",
        hint1: "Access the next sibling element (the content panel)",
        hint2: "Use this.nextElementSibling.classList.toggle('active')",
        solution: "Add: this.nextElementSibling.classList.toggle('active')"
    },

    // Challenge 20: Tabs Don't Switch
    {
        id: 20,
        title: "Tabs Don't Switch",
        category: "JavaScript",
        difficulty: "easy",
        points: 50,
        description: "Clicking on different tab buttons doesn't switch the visible content.",
        objective: "Fix the tabs functionality to switch between content panels.",
        brokenHTML: `<div class="tabs">\n    <div class="tab-buttons">\n        <button class="tab-btn active" data-tab="tab1">Tab 1</button>\n        <button class="tab-btn" data-tab="tab2">Tab 2</button>\n    </div>\n    <div class="tab-content">\n        <div id="tab1" class="tab-panel active">Content 1</div>\n        <div id="tab2" class="tab-panel">Content 2</div>\n    </div>\n</div>`,
        brokenCSS: `.tab-panel { display: none; }\n.tab-panel.active { display: block; }`,
        brokenJS: `document.querySelectorAll('.tab-btn').forEach(btn => {\n    btn.addEventListener('click', function() {\n        // Switch tabs\n    });\n});`,
        expectedOutput: "Clicking a tab button shows its corresponding content panel",
        flag: "AIODYSSEY{tabs_fixed}",
        hint1: "Remove 'active' from all buttons and panels, then add to clicked",
        hint2: "Use dataset to get the target tab ID: this.dataset.tab",
        solution: "Remove active from all, add active to clicked button and corresponding panel"
    },

    // ============ MEDIUM CHALLENGES (21-40) ============

    // Challenge 21: API Fetch Error
    {
        id: 21,
        title: "API Fetch Error",
        category: "JavaScript",
        difficulty: "medium",
        points: 100,
        description: "The fetch request to get data from an API is failing. No data is displayed.",
        objective: "Fix the fetch request and handle the response correctly.",
        brokenHTML: `<div id="apiData">\n    <p>Loading data...</p>\n</div>`,
        brokenCSS: "",
        brokenJS: `fetch('https://jsonplaceholder.typicode.com/posts/1')\n    .then(response => {\n        return response;\n    })\n    .then(data => {\n        document.getElementById('apiData').innerHTML = '<h2>' + data.title + '</h2>';\n    })\n    .catch(error => {\n        console.log('Error:', error);\n    });`,
        expectedOutput: "Data from the API is fetched and displayed on the page",
        flag: "AIODYSSEY{api_fixed}",
        hint1: "The response object needs to be converted to JSON",
        hint2: "Use response.json() to parse the response body",
        solution: "Change 'return response' to 'return response.json()'"
    },

    // Challenge 22: Promise Never Resolves
    {
        id: 22,
        title: "Promise Never Resolves",
        category: "JavaScript",
        difficulty: "medium",
        points: 100,
        description: "A custom promise is created but never resolves, so the code hangs.",
        objective: "Fix the promise to properly resolve with the expected value.",
        brokenHTML: `<div id="promiseResult">Waiting...</div>`,
        brokenCSS: "",
        brokenJS: `function waitAndReturn(value, delay) {\n    return new Promise((resolve, reject) => {\n        setTimeout(() => {\n            // Should resolve with value\n        }, delay);\n    });\n}\n\nwaitAndReturn('Success!', 1000).then(result => {\n    document.getElementById('promiseResult').textContent = result;\n});`,
        expectedOutput: "Promise resolves after the delay and displays the result",
        flag: "AIODYSSEY{promise_fixed}",
        hint1: "The resolve function needs to be called with the value",
        hint2: "Inside setTimeout, call: resolve(value)",
        solution: "Add 'resolve(value)' inside the setTimeout callback"
    },

    // Challenge 23: Async Await Bug
    {
        id: 23,
        title: "Async Await Bug",
        category: "JavaScript",
        difficulty: "medium",
        points: 100,
        description: "The async function using await is not working correctly.",
        objective: "Fix the async/await implementation to work properly.",
        brokenHTML: `<div id="asyncResult">Loading...</div>`,
        brokenCSS: "",
        brokenJS: `async function getData() {\n    const response = fetch('https://jsonplaceholder.typicode.com/users/1');\n    const data = response.json();\n    return data;\n}\n\ngetData().then(user => {\n    document.getElementById('asyncResult').textContent = user.name;\n});`,
        expectedOutput: "User data is fetched and displayed correctly",
        flag: "AIODYSSEY{async_fixed}",
        hint1: "The await keyword is missing before the fetch and json calls",
        hint2: "Both fetch() and response.json() are async operations that need await",
        solution: "Add 'await' before fetch() and before response.json()"
    },

    // Challenge 24: Weather Card Broken
    {
        id: 24,
        title: "Weather Card Broken",
        category: "CSS",
        difficulty: "medium",
        points: 100,
        description: "The weather card UI is completely misaligned and unstyled.",
        objective: "Fix the CSS to create a visually appealing weather card.",
        brokenHTML: `<div class="weather-card">\n    <div class="weather-header">\n        <h2>London</h2>\n        <p>Cloudy</p>\n    </div>\n    <div class="weather-body">\n        <span class="temperature">18°C</span>\n        <div class="weather-details">\n            <span>Humidity: 65%</span>\n            <span>Wind: 12 km/h</span>\n        </div>\n    </div>\n</div>`,
        brokenCSS: `.weather-card { max-width: 350px; }`,
        brokenJS: "",
        expectedOutput: "A polished, centered weather card with proper spacing and styling",
        flag: "AIODYSSEY{weather_fixed}",
        hint1: "Add padding, background, border-radius, and shadow to the card",
        hint2: "Use flexbox to align items properly within the card",
        solution: "Style the card with background gradient, padding, rounded corners, shadow, and flexbox layout"
    },

    // Challenge 25: Shopping Cart Total Wrong
    {
        id: 25,
        title: "Shopping Cart Total Wrong",
        category: "JavaScript",
        difficulty: "medium",
        points: 100,
        description: "The shopping cart total is calculated incorrectly.",
        objective: "Fix the cart total calculation to sum item prices correctly.",
        brokenHTML: `<div class="cart">\n    <div class="cart-items">\n        <div class="cart-item" data-price="10">Item 1 - $10</div>\n        <div class="cart-item" data-price="20">Item 2 - $20</div>\n        <div class="cart-item" data-price="15">Item 3 - $15</div>\n    </div>\n    <p>Total: $<span id="cartTotal">0</span></p>\n</div>`,
        brokenCSS: "",
        brokenJS: `function calculateTotal() {\n    const items = document.querySelectorAll('.cart-item');\n    let total = 0;\n    items.forEach(item => {\n        total += item.dataset.price;\n    });\n    document.getElementById('cartTotal').textContent = total;\n}\ncalculateTotal();`,
        expectedOutput: "Cart total displays 45 (sum of 10, 20, and 15)",
        flag: "AIODYSSEY{cart_fixed}",
        hint1: "dataset values are strings, not numbers",
        hint2: "Use Number() or parseInt() to convert prices to numbers",
        solution: "Change to: total += Number(item.dataset.price) or parseFloat(item.dataset.price)"
    },

    // Challenge 26: LocalStorage Doesn't Save
    {
        id: 26,
        title: "LocalStorage Doesn't Save",
        category: "JavaScript",
        difficulty: "medium",
        points: 100,
        description: "Data is not persisting in localStorage across page reloads.",
        objective: "Fix the localStorage save and load functionality.",
        brokenHTML: `<div class="storage-app">\n    <input type="text" id="storageInput" placeholder="Enter text">\n    <button id="saveBtn">Save</button>\n    <button id="loadBtn">Load</button>\n    <p>Saved: <span id="savedText"></span></p>\n</div>`,
        brokenCSS: "",
        brokenJS: `document.getElementById('saveBtn').addEventListener('click', function() {\n    const text = document.getElementById('storageInput').value;\n    localStorage.setItem('savedData', text);\n});\n\ndocument.getElementById('loadBtn').addEventListener('click', function() {\n    const saved = localStorage.getItem('savedData');\n    document.getElementById('savedText').textContent = saved;\n});`,
        expectedOutput: "Data persists in localStorage and can be loaded after page reload",
        flag: "AIODYSSEY{storage_fixed}",
        hint1: "Check if the save function is correctly called",
        hint2: "The code looks correct but may need auto-load on page refresh",
        solution: "Add an auto-load on page load: window.addEventListener('load', function() { ... })"
    },

    // Challenge 27: SessionStorage Bug
    {
        id: 27,
        title: "SessionStorage Bug",
        category: "JavaScript",
        difficulty: "medium",
        points: 100,
        description: "SessionStorage data retrieval is returning the wrong format.",
        objective: "Fix sessionStorage to properly store and retrieve objects.",
        brokenHTML: `<div class="session-app">\n    <button id="saveSession">Save User</button>\n    <button id="loadSession">Load User</button>\n    <div id="userDisplay"></div>\n</div>`,
        brokenCSS: "",
        brokenJS: `const user = { name: 'John', age: 30, role: 'Developer' };\n\ndocument.getElementById('saveSession').addEventListener('click', function() {\n    sessionStorage.setItem('user', user);\n    alert('User saved!');\n});\n\ndocument.getElementById('loadSession').addEventListener('click', function() {\n    const loaded = sessionStorage.getItem('user');\n    document.getElementById('userDisplay').textContent = loaded.name;\n});`,
        expectedOutput: "User object is stored and retrieved correctly displaying the name",
        flag: "AIODYSSEY{session_fixed}",
        hint1: "Objects need to be serialized before storing in sessionStorage",
        hint2: "Use JSON.stringify() to save and JSON.parse() to load",
        solution: "Save with JSON.stringify(user), load with JSON.parse(sessionStorage.getItem('user'))"
    },

    // Challenge 28: Form Regex Error
    {
        id: 28,
        title: "Form Regex Error",
        category: "JavaScript",
        difficulty: "medium",
        points: 100,
        description: "The email validation regex is incorrectly rejecting valid emails.",
        objective: "Fix the regex pattern to properly validate email addresses.",
        brokenHTML: `<div class="form-validation">\n    <input type="text" id="emailInput" placeholder="Enter email">\n    <button id="validateBtn">Validate</button>\n    <p id="validationResult"></p>\n</div>`,
        brokenCSS: "",
        brokenJS: `document.getElementById('validateBtn').addEventListener('click', function() {\n    const email = document.getElementById('emailInput').value;\n    const regex = /^\\w+@\\w+\\.\\w+$/;\n    if (regex.test(email)) {\n        document.getElementById('validationResult').textContent = 'Valid email!';\n        document.getElementById('validationResult').style.color = 'green';\n    } else {\n        document.getElementById('validationResult').textContent = 'Invalid email!';\n        document.getElementById('validationResult').style.color = 'red';\n    }\n});`,
        expectedOutput: "Valid email formats like test@example.com are accepted, invalid ones rejected",
        flag: "AIODYSSEY{regex_fixed}",
        hint1: "The regex doesn't allow dots in the domain name (like example.co.uk)",
        hint2: "Consider using a more comprehensive email regex pattern",
        solution: "Update regex to: /^[\\w.-]+@[\\w.-]+\\.\\w{2,}$/"
    },

    // Challenge 29: Password Meter Broken
    {
        id: 29,
        title: "Password Meter Broken",
        category: "JavaScript",
        difficulty: "medium",
        points: 100,
        description: "The password strength meter doesn't update as the user types.",
        objective: "Fix the password strength indicator to work in real-time.",
        brokenHTML: `<div class="password-meter">\n    <input type="password" id="passwordInput" placeholder="Enter password">\n    <div class="meter-bar">\n        <div id="meterFill" class="meter-fill"></div>\n    </div>\n    <p id="meterText">Enter a password</p>\n</div>`,
        brokenCSS: `.meter-bar { width: 100%; height: 10px; background: #ddd; border-radius: 5px; overflow: hidden; }\n.meter-fill { height: 100%; width: 0%; transition: all 0.3s; }`,
        brokenJS: `document.getElementById('passwordInput').addEventListener('input', function() {\n    const password = this.value;\n    const meter = document.getElementById('meterFill');\n    const text = document.getElementById('meterText');\n    // Should update meter\n});`,
        expectedOutput: "Password strength meter updates in real-time as user types",
        flag: "AIODYSSEY{meter_fixed}",
        hint1: "Calculate strength based on length and character types",
        hint2: "Check for numbers, uppercase, lowercase, and special characters",
        solution: "Calculate score: length > 8 (+25), has numbers (+25), has upper/lower (+25), has special chars (+25)"
    },

    // Challenge 30: Slider Doesn't Move
    {
        id: 30,
        title: "Slider Doesn't Move",
        category: "CSS",
        difficulty: "medium",
        points: 100,
        description: "The image slider is not sliding to show the next/previous images.",
        objective: "Fix the slider CSS and JavaScript to enable sliding functionality.",
        brokenHTML: `<div class="slider">\n    <div class="slider-container">\n        <div class="slide">Slide 1</div>\n        <div class="slide">Slide 2</div>\n        <div class="slide">Slide 3</div>\n    </div>\n    <button id="prevBtn">Previous</button>\n    <button id="nextBtn">Next</button>\n</div>`,
        brokenCSS: `.slider { width: 400px; overflow: hidden; }\n.slider-container { display: flex; transition: transform 0.3s; width: 300%; }\n.slide { width: 33.33%; padding: 2rem; background: #007bff; color: white; text-align: center; }`,
        brokenJS: `let currentSlide = 0;\nconst container = document.querySelector('.slider-container');\nconst slides = document.querySelectorAll('.slide');\n\ndocument.getElementById('nextBtn').addEventListener('click', function() {\n    if (currentSlide < slides.length - 1) {\n        currentSlide++;\n    }\n    // Update transform\n});\n\ndocument.getElementById('prevBtn').addEventListener('click', function() {\n    if (currentSlide > 0) {\n        currentSlide--;\n    }\n    // Update transform\n});`,
        expectedOutput: "Slides move left/right when navigation buttons are clicked",
        flag: "AIODYSSEY{slider_fixed}",
        hint1: "Use transform: translateX() to move the slider container",
        hint2: "Calculate: translateX(-${currentSlide * (100/3)}%)",
        solution: "Add: container.style.transform = `translateX(-${currentSlide * (100/3)}%)`"
    },

    // Challenge 31: Drag Drop Broken
    {
        id: 31,
        title: "Drag Drop Broken",
        category: "JavaScript",
        difficulty: "medium",
        points: 100,
        description: "The drag and drop functionality is not working for the list items.",
        objective: "Fix the drag and drop to allow reordering items.",
        brokenHTML: `<div class="drag-list">\n    <div class="drag-item" draggable="true">Item 1</div>\n    <div class="drag-item" draggable="true">Item 2</div>\n    <div class="drag-item" draggable="true">Item 3</div>\n</div>`,
        brokenCSS: `.drag-item { padding: 1rem; margin: 0.5rem; background: var(--bg-card); border: 1px solid var(--border-color); cursor: grab; }`,
        brokenJS: `const items = document.querySelectorAll('.drag-item');\nitems.forEach(item => {\n    item.addEventListener('dragstart', function(e) {\n        e.dataTransfer.setData('text', this.textContent);\n    });\n    \n    item.addEventListener('dragover', function(e) {\n        e.preventDefault();\n    });\n    \n    item.addEventListener('drop', function(e) {\n        e.preventDefault();\n        const data = e.dataTransfer.getData('text');\n        // Should swap or move items\n    });\n});`,
        expectedOutput: "Items can be dragged and dropped to reorder them",
        flag: "AIODYSSEY{drag_fixed}",
        hint1: "You need to properly insert the dragged element at the drop position",
        hint2: "Use this.parentElement.insertBefore() or insertAfter() to reorder",
        solution: "Get the dragged item reference and use insertBefore to move it"
    },

    // Challenge 32: Canvas Doesn't Draw
    {
        id: 32,
        title: "Canvas Doesn't Draw",
        category: "JavaScript",
        difficulty: "medium",
        points: 100,
        description: "The canvas element is not drawing any shapes or graphics.",
        objective: "Fix the canvas drawing code to render shapes properly.",
        brokenHTML: `<canvas id="myCanvas" width="400" height="300"></canvas>`,
        brokenCSS: "canvas { border: 1px solid #ccc; }",
        brokenJS: `const canvas = document.getElementById('myCanvas');\nconst ctx = canvas.getContext('2d');\n\n// Draw a circle\nctx.arc(200, 150, 50, 0, Math.PI * 2);\nctx.fillStyle = 'blue';\nctx.fill();`,
        expectedOutput: "A blue circle is drawn on the canvas",
        flag: "AIODYSSEY{canvas_fixed}",
        hint1: "Canvas paths need to begin before drawing",
        hint2: "Call ctx.beginPath() before drawing and ctx.closePath() after",
        solution: "Add ctx.beginPath() before arc() and ctx.closePath() after fill()"
    },

    // Challenge 33: SVG Animation Missing
    {
        id: 33,
        title: "SVG Animation Missing",
        category: "CSS",
        difficulty: "medium",
        points: 100,
        description: "The SVG element has CSS animation properties but doesn't animate.",
        objective: "Fix the SVG animation to rotate or move continuously.",
        brokenHTML: `<svg class="animated-svg" width="100" height="100" viewBox="0 0 100 100">\n    <circle cx="50" cy="50" r="40" fill="none" stroke="#00f0ff" stroke-width="4" />\n    <line x1="50" y1="50" x2="90" y2="50" stroke="#00f0ff" stroke-width="4" />\n</svg>`,
        brokenCSS: `.animated-svg { animation: spin 2s linear infinite; }`,
        brokenJS: "",
        expectedOutput: "SVG element rotates or animates continuously",
        flag: "AIODYSSEY{svg_fixed}",
        hint1: "The @keyframes for 'spin' might be missing",
        hint2: "Define @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }",
        solution: "Add @keyframes spin animation definition"
    },

    // Challenge 34: Infinite Loop
    {
        id: 34,
        title: "Infinite Loop",
        category: "JavaScript",
        difficulty: "medium",
        points: 100,
        description: "The JavaScript code is stuck in an infinite loop, freezing the page.",
        objective: "Fix the loop condition to prevent infinite execution.",
        brokenHTML: `<div id="loopResult">Computing...</div>`,
        brokenCSS: "",
        brokenJS: `function computeSum(n) {\n    let sum = 0;\n    for (let i = 0; i >= 0; i++) {\n        sum += i;\n        if (i >= n) break;\n    }\n    return sum;\n}\n\ndocument.getElementById('loopResult').textContent = computeSum(10);`,
        expectedOutput: "Function computes sum from 1 to n without freezing",
        flag: "AIODYSSEY{loop_fixed}",
        hint1: "Check the loop condition - 'i >= 0' is always true",
        hint2: "The condition should be 'i <= n' or 'i < n'",
        solution: "Change 'for (let i = 0; i >= 0; i++)' to 'for (let i = 0; i <= n; i++)'"
    },

    // Challenge 35: Event Bubbling Bug
    {
        id: 35,
        title: "Event Bubbling Bug",
        category: "JavaScript",
        difficulty: "medium",
        points: 100,
        description: "Clicking on inner elements triggers unexpected parent handlers.",
        objective: "Fix event propagation to prevent unwanted bubbling.",
        brokenHTML: `<div class="outer" id="outer">\n    Outer\n    <div class="middle" id="middle">\n        Middle\n        <div class="inner" id="inner">Inner</div>\n    </div>\n</div>`,
        brokenCSS: ".outer, .middle, .inner { padding: 2rem; margin: 0.5rem; border: 1px solid #ccc; cursor: pointer; }",
        brokenJS: `document.getElementById('outer').addEventListener('click', function() {\n    alert('Outer clicked!');\n});\n\ndocument.getElementById('middle').addEventListener('click', function() {\n    alert('Middle clicked!');\n});\n\ndocument.getElementById('inner').addEventListener('click', function() {\n    alert('Inner clicked!');\n});`,
        expectedOutput: "Only the clicked element's handler should fire",
        flag: "AIODYSSEY{bubbling_fixed}",
        hint1: "Use stopPropagation() to prevent event bubbling",
        hint2: "Add e.stopPropagation() in each event handler",
        solution: "Add e.stopPropagation() in each click handler"
    },

    // Challenge 36: Memory Leak
    {
        id: 36,
        title: "Memory Leak",
        category: "JavaScript",
        difficulty: "medium",
        points: 100,
        description: "The application is consuming increasing memory over time.",
        objective: "Fix the memory leak caused by improper cleanup.",
        brokenHTML: `<div id="leakContainer">\n    <button id="startLeak">Start Action</button>\n    <button id="stopLeak">Stop Action</button>\n</div>`,
        brokenCSS: "",
        brokenJS: `let interval = null;\nconst container = document.getElementById('leakContainer');\n\ndocument.getElementById('startLeak').addEventListener('click', function() {\n    interval = setInterval(() => {\n        const div = document.createElement('div');\n        div.textContent = 'New element';\n        container.appendChild(div);\n    }, 100);\n});\n\ndocument.getElementById('stopLeak').addEventListener('click', function() {\n    // Should stop adding elements\n});`,
        expectedOutput: "Elements stop being added when stop is clicked",
        flag: "AIODYSSEY{leak_fixed}",
        hint1: "The interval continues running even after stop is clicked",
        hint2: "Use clearInterval(interval) to stop the interval",
        solution: "Add 'clearInterval(interval)' in the stop button handler"
    },

    // Challenge 37: Lazy Loading Broken
    {
        id: 37,
        title: "Lazy Loading Broken",
        category: "JavaScript",
        difficulty: "medium",
        points: 100,
        description: "Images with lazy loading attribute are not loading when scrolled into view.",
        objective: "Fix the lazy loading implementation using IntersectionObserver.",
        brokenHTML: `<div class="lazy-gallery">\n    <img class="lazy-img" data-src="https://picsum.photos/400/300?random=1" alt="Image 1">\n    <img class="lazy-img" data-src="https://picsum.photos/400/300?random=2" alt="Image 2">\n    <img class="lazy-img" data-src="https://picsum.photos/400/300?random=3" alt="Image 3">\n</div>`,
        brokenCSS: ".lazy-img { display: block; width: 400px; height: 300px; margin: 2rem; background: #f0f0f0; }",
        brokenJS: `const images = document.querySelectorAll('.lazy-img');\nconst observer = new IntersectionObserver((entries) => {\n    entries.forEach(entry => {\n        if (entry.isIntersecting) {\n            const img = entry.target;\n            // Load the image\n        }\n    });\n});\n\nimages.forEach(img => observer.observe(img));`,
        expectedOutput: "Images load when they scroll into viewport",
        flag: "AIODYSSEY{lazy_fixed}",
        hint1: "Set img.src from img.dataset.src to trigger loading",
        hint2: "Also unobserve the image after loading to save resources",
        solution: "Add: img.src = img.dataset.src; observer.unobserve(img);"
    },

    // Challenge 38: Responsive Dashboard
    {
        id: 38,
        title: "Responsive Dashboard",
        category: "CSS",
        difficulty: "medium",
        points: 100,
        description: "The dashboard layout doesn't adapt to different screen sizes.",
        objective: "Fix the CSS to make the dashboard responsive.",
        brokenHTML: `<div class="dashboard-layout">\n    <div class="sidebar">Sidebar</div>\n    <div class="main-content">\n        <div class="widget">Widget 1</div>\n        <div class="widget">Widget 2</div>\n        <div class="widget">Widget 3</div>\n        <div class="widget">Widget 4</div>\n    </div>\n</div>`,
        brokenCSS: `.dashboard-layout { display: grid; grid-template-columns: 250px 1fr; gap: 1rem; }\n.sidebar { background: #f0f0f0; padding: 1rem; }\n.main-content { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }\n.widget { background: #fff; padding: 1rem; border: 1px solid #ddd; }`,
        brokenJS: "",
        expectedOutput: "Dashboard reflows to work on mobile, tablet, and desktop screens",
        flag: "AIODYSSEY{dashboard_fixed}",
        hint1: "Add media queries to change layout at different breakpoints",
        hint2: "Stack sidebar on top and use single column for widgets on mobile",
        solution: "Add @media queries: mobile sidebar collapses, widgets become single column"
    },

    // Challenge 39: Keyboard Accessibility
    {
        id: 39,
        title: "Keyboard Accessibility",
        category: "HTML",
        difficulty: "medium",
        points: 100,
        description: "The custom dropdown component is not accessible via keyboard.",
        objective: "Fix the component to support keyboard navigation (Tab, Enter, Escape).",
        brokenHTML: `<div class="custom-select" tabindex="0">\n    <div class="select-trigger">Select Option</div>\n    <ul class="select-options">\n        <li>Option 1</li>\n        <li>Option 2</li>\n        <li>Option 3</li>\n    </ul>\n</div>`,
        brokenCSS: ".select-options { display: none; position: absolute; background: white; border: 1px solid #ccc; list-style: none; padding: 0; }",
        brokenJS: `document.querySelector('.custom-select').addEventListener('click', function() {\n    this.querySelector('.select-options').classList.toggle('show');\n});`,
        expectedOutput: "Dropdown can be opened/closed and options selected using keyboard",
        flag: "AIODYSSEY{keyboard_fixed}",
        hint1: "Add keydown event listeners for Enter, Escape, and Arrow keys",
        hint2: "Use role='listbox' and aria attributes for accessibility",
        solution: "Add keyboard handlers with proper ARIA attributes and focus management"
    },

    // Challenge 40: Animation Stuck
    {
        id: 40,
        title: "Animation Stuck",
        category: "CSS",
        difficulty: "medium",
        points: 100,
        description: "A CSS animation plays once then stops instead of looping.",
        objective: "Fix the animation to play continuously.",
        brokenHTML: `<div class="animated-box">Loading...</div>`,
        brokenCSS: `.animated-box {\n    width: 100px;\n    height: 100px;\n    background: linear-gradient(135deg, #00f0ff, #7b2ff7);\n    border-radius: 16px;\n    animation: bounce 1s;\n}\n\n@keyframes bounce {\n    0%, 100% { transform: translateY(0); }\n    50% { transform: translateY(-30px); }\n}`,
        brokenJS: "",
        expectedOutput: "Box bounces continuously without stopping",
        flag: "AIODYSSEY{animation_fixed}",
        hint1: "The animation property needs an iteration count",
        hint2: "Add 'infinite' as the animation iteration value",
        solution: "Change 'animation: bounce 1s' to 'animation: bounce 1s infinite'"
    },

    // ============ HARD CHALLENGES (41-49) ============

    // Challenge 41: CSS Variable Conflict
    {
        id: 41,
        title: "CSS Variable Conflict",
        category: "CSS",
        difficulty: "hard",
        points: 200,
        description: "CSS custom properties are conflicting across different components.",
        objective: "Fix the CSS variable scoping to eliminate conflicts.",
        brokenHTML: `<div class="component-a">\n    <p>Component A should be blue</p>\n    <div class="component-b">\n        <p>Component B should be red</p>\n    </div>\n</div>`,
        brokenCSS: `:root { --theme-color: blue; }\n.component-a { --theme-color: blue; color: var(--theme-color); }\n.component-b { --theme-color: red; color: var(--theme-color); }`,
        brokenJS: "",
        expectedOutput: "Component A text is blue, Component B text is red",
        flag: "AIODYSSEY{variables_fixed}",
        hint1: "CSS variables inherit from parent - check scoping",
        hint2: "Component B inside Component A inherits A's variable",
        solution: "Move Component B outside or use different variable names for isolation"
    },

    // Challenge 42: Grid Overflow
    {
        id: 42,
        title: "Grid Overflow",
        category: "CSS",
        difficulty: "hard",
        points: 200,
        description: "Content in the grid container overflows instead of wrapping.",
        objective: "Fix the grid layout to properly wrap items without overflow.",
        brokenHTML: `<div class="grid-wrapper">\n    <div class="grid-item">Card 1</div>\n    <div class="grid-item">Card 2</div>\n    <div class="grid-item">Card 3</div>\n    <div class="grid-item">Card 4</div>\n    <div class="grid-item">Card 5</div>\n    <div class="grid-item">Card 6</div>\n</div>`,
        brokenCSS: `.grid-wrapper { display: grid; grid-template-columns: repeat(auto-fill, 300px); gap: 1rem; }\n.grid-item { padding: 2rem; background: var(--bg-card); border: 1px solid var(--border-color); white-space: nowrap; }`,
        brokenJS: "",
        expectedOutput: "Grid items wrap to next row without causing horizontal overflow",
        flag: "AIODYSSEY{grid_overflow_fixed}",
        hint1: "The grid items have white-space: nowrap causing overflow",
        hint2: "Also consider using minmax() for responsive column sizing",
        solution: "Remove white-space:nowrap and use grid-template-columns: repeat(auto-fill, minmax(300px, 1fr))"
    },

    // Challenge 43: Dark Theme Conflict
    {
        id: 43,
        title: "Dark Theme Conflict",
        category: "CSS",
        difficulty: "hard",
        points: 200,
        description: "Some elements don't respond properly to dark/light theme switching.",
        objective: "Fix the theme implementation so all elements respond correctly.",
        brokenHTML: `<div class="theme-demo">\n    <h1>Title</h1>\n    <p class="themed-text">This text should change with theme</p>\n    <div class="card-themed">Card with theme</div>\n    <button class="btn-themed">Themed Button</button>\n</div>`,
        brokenCSS: `:root { --text-color: #1a1a2e; --bg-color: #ffffff; }\n[data-theme="dark"] { --text-color: #e0e0ff; --bg-color: #0a0a1a; }\nbody { color: var(--text-color); background: var(--bg-color); }\n.themed-text { color: blue; }\n.card-themed { background: #f0f0f0; padding: 1rem; }\n.btn-themed { background: #007bff; color: white; padding: 0.5rem 1rem; border: none; }`,
        brokenJS: "",
        expectedOutput: "All elements properly adapt to theme changes",
        flag: "AIODYSSEY{dark_theme_fixed}",
        hint1: "Some elements have hardcoded colors instead of using CSS variables",
        hint2: "Replace hardcoded colors with var(--variable-name) references",
        solution: "Replace hardcoded colors with CSS variable references throughout"
    },

    // Challenge 44: API Timeout
    {
        id: 44,
        title: "API Timeout",
        category: "JavaScript",
        difficulty: "hard",
        points: 200,
        description: "The API request hangs indefinitely when the server is slow.",
        objective: "Implement a timeout mechanism for the fetch request.",
        brokenHTML: `<div id="timeoutDemo">\n    <button id="fetchWithTimeout">Fetch Data</button>\n    <div id="timeoutResult"></div>\n</div>`,
        brokenCSS: "",
        brokenJS: `document.getElementById('fetchWithTimeout').addEventListener('click', function() {\n    const resultDiv = document.getElementById('timeoutResult');\n    resultDiv.textContent = 'Loading...';\n    \n    fetch('https://jsonplaceholder.typicode.com/posts/1')\n        .then(response => response.json())\n        .then(data => {\n            resultDiv.textContent = 'Title: ' + data.title;\n        })\n        .catch(error => {\n            resultDiv.textContent = 'Error: ' + error.message;\n        });\n});`,
        expectedOutput: "Request times out after a specified duration if no response",
        flag: "AIODYSSEY{timeout_fixed}",
        hint1: "Use Promise.race() with a setTimeout promise to implement timeout",
        hint2: "Create a timeout promise that rejects after N milliseconds",
        solution: "Use Promise.race([fetch(url), new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))])"
    },

    // Challenge 45: Multi-step Form
    {
        id: 45,
        title: "Multi-step Form",
        category: "JavaScript",
        difficulty: "hard",
        points: 200,
        description: "The multi-step form doesn't properly navigate between steps.",
        objective: "Fix the multi-step form navigation with validation.",
        brokenHTML: `<form id="multiStepForm">\n    <div class="step" id="step1">\n        <h3>Step 1: Personal Info</h3>\n        <input type="text" placeholder="Name" required>\n        <button type="button" class="next-step">Next</button>\n    </div>\n    <div class="step" id="step2" style="display:none">\n        <h3>Step 2: Contact</h3>\n        <input type="email" placeholder="Email" required>\n        <button type="button" class="prev-step">Previous</button>\n        <button type="button" class="next-step">Next</button>\n    </div>\n    <div class="step" id="step3" style="display:none">\n        <h3>Step 3: Submit</h3>\n        <button type="submit">Submit</button>\n    </div>\n</form>`,
        brokenCSS: "",
        brokenJS: `// Navigation logic is incomplete\nlet currentStep = 1;\nconst totalSteps = 3;\n\ndocument.querySelectorAll('.next-step').forEach(btn => {\n    btn.addEventListener('click', function() {\n        // Should go to next step\n    });\n});\n\ndocument.querySelectorAll('.prev-step').forEach(btn => {\n    btn.addEventListener('click', function() {\n        // Should go to previous step\n    });\n});`,
        expectedOutput: "Form navigates between steps with proper validation at each step",
        flag: "AIODYSSEY{multistep_fixed}",
        hint1: "Hide current step and show next/previous step",
        hint2: "Add validation before allowing navigation to next step",
        solution: "Implement step navigation with showStep() function that hides all and shows current"
    },

    // Challenge 46: Quiz Logic Broken
    {
        id: 46,
        title: "Quiz Logic Broken",
        category: "JavaScript",
        difficulty: "hard",
        points: 200,
        description: "The quiz app doesn't track score or show correct/incorrect answers.",
        objective: "Fix the quiz logic to track score and provide feedback.",
        brokenHTML: `<div class="quiz-app">\n    <div id="question">Question text</div>\n    <div id="options">\n        <button class="option">Option 1</button>\n        <button class="option">Option 2</button>\n        <button class="option">Option 3</button>\n    </div>\n    <button id="nextQuestion">Next</button>\n    <p>Score: <span id="score">0</span></p>\n</div>`,
        brokenCSS: "",
        brokenJS: `const questions = [\n    { question: 'What is 2+2?', options: ['3', '4', '5'], correct: 1 },\n    { question: 'What is 3*3?', options: ['6', '9', '12'], correct: 1 },\n];\nlet currentQ = 0;\nlet score = 0;\n\nfunction loadQuestion() {\n    document.getElementById('question').textContent = questions[currentQ].question;\n    const buttons = document.querySelectorAll('.option');\n    buttons.forEach((btn, i) => {\n        btn.textContent = questions[currentQ].options[i];\n    });\n}\n\n// Missing: answer checking logic\nloadQuestion();`,
        expectedOutput: "Quiz correctly tracks score and shows feedback for each answer",
        flag: "AIODYSSEY{quiz_fixed}",
        hint1: "Add click handlers to option buttons to check answers",
        hint2: "Compare selected index with correct answer index and update score",
        solution: "Add click handlers to options, compare with correct index, update score, show feedback"
    },

    // Challenge 47: Notification System
    {
        id: 47,
        title: "Notification System",
        category: "JavaScript",
        difficulty: "hard",
        points: 200,
        description: "The notification system doesn't show notifications or clears them too fast.",
        objective: "Fix the notification system with proper timing and stacking.",
        brokenHTML: `<div class="notification-system">\n    <button id="showNotif">Show Notification</button>\n    <div id="notifContainer"></div>\n</div>`,
        brokenCSS: "",
        brokenJS: `document.getElementById('showNotif').addEventListener('click', function() {\n    const container = document.getElementById('notifContainer');\n    const notif = document.createElement('div');\n    notif.textContent = 'New notification!';\n    notif.style.cssText = 'padding: 1rem; margin: 0.5rem; background: #007bff; color: white; border-radius: 4px;';\n    container.appendChild(notif);\n    // Should auto-remove after timeout\n});`,
        expectedOutput: "Notifications appear stacked and auto-remove after a few seconds",
        flag: "AIODYSSEY{notifications_fixed}",
        hint1: "Use setTimeout to remove notifications after display duration",
        hint2: "Use requestAnimationFrame for smooth removal animation",
        solution: "Add setTimeout to remove the element after 3 seconds with fade-out animation"
    },

    // Challenge 48: Escape Room Puzzle
    {
        id: 48,
        title: "Escape Room Puzzle",
        category: "JavaScript",
        difficulty: "hard",
        points: 200,
        description: "The puzzle requires a specific sequence of actions but the logic is broken.",
        objective: "Fix the puzzle state machine to correctly track and validate the sequence.",
        brokenHTML: `<div class="puzzle">\n    <div class="puzzle-buttons">\n        <button data-key="A">A</button>\n        <button data-key="B">B</button>\n        <button data-key="C">C</button>\n    </div>\n    <p id="puzzleStatus">Enter the sequence: A-B-C</p>\n    <p id="puzzleResult"></p>\n</div>`,
        brokenCSS: "",
        brokenJS: `const sequence = ['A', 'B', 'C'];\nlet currentIndex = 0;\n\ndocument.querySelectorAll('.puzzle-buttons button').forEach(btn => {\n    btn.addEventListener('click', function() {\n        const key = this.dataset.key;\n        // Check if key matches expected\n    });\n});`,
        expectedOutput: "Puzzle validates the correct sequence and shows success",
        flag: "AIODYSSEY{puzzle_fixed}",
        hint1: "Compare the clicked key with sequence[currentIndex]",
        hint2: "Increment currentIndex on correct match, reset on wrong match",
        solution: "Add logic: if (key === sequence[currentIndex]) currentIndex++; else currentIndex = 0; check if complete"
    },

    // Challenge 49: Final Portal
    {
        id: 49,
        title: "Final Portal",
        category: "JavaScript",
        difficulty: "hard",
        points: 200,
        description: "The portal requires multiple conditions to be met before activating.",
        objective: "Fix all the conditions and logic checks to activate the portal.",
        brokenHTML: `<div class="portal">\n    <div class="portal-status">\n        <p>Condition 1: <span id="cond1">❌</span></p>\n        <p>Condition 2: <span id="cond2">❌</span></p>\n        <p>Condition 3: <span id="cond3">❌</span></p>\n    </div>\n    <button id="activatePortal" disabled>Activate Portal</button>\n    <p id="portalMessage"></p>\n</div>`,
        brokenCSS: "",
        brokenJS: `let conditions = { c1: false, c2: false, c3: false };\n\nfunction checkAllConditions() {\n    const allMet = conditions.c1 && conditions.c2 && conditions.c3;\n    document.getElementById('activatePortal').disabled = !allMet;\n    \n    if (allMet) {\n        document.getElementById('portalMessage').textContent = 'Portal is ready!';\n    }\n}\n\n// Simulate meeting conditions\nsetTimeout(() => {\n    conditions.c1 = true;\n    document.getElementById('cond1').textContent = '✅';\n}, 1000);\n\nsetTimeout(() => {\n    conditions.c2 = true;\n    // Missing status update\n}, 2000);\n\nsetTimeout(() => {\n    conditions.c3 = true;\n    document.getElementById('cond3').textContent = '✅';\n    // Missing check\n}, 3000);`,
        expectedOutput: "Portal activates when all conditions are met",
        flag: "AIODYSSEY{portal_fixed}",
        hint1: "checkAllConditions() needs to be called after each condition is met",
        hint2: "Condition 2 is not updating the display and check isn't called for conditions 2 and 3",
        solution: "Update condition 2's display and call checkAllConditions() after each condition"
    },

    // ============ BOSS CHALLENGE (50) ============

    // Challenge 50: Master Debug Arena
    {
        id: 50,
        title: "Master Debug Arena",
        category: "Boss",
        difficulty: "boss",
        points: 500,
        description: "THE FINAL BOSS. This challenge contains 25 hidden bugs across HTML, CSS, and JavaScript. Find and fix them all to claim victory.",
        objective: "Fix all 25 bugs in the master challenge to reveal the final flag.",
        brokenHTML: `<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <title>Master Arena</title>\n</head>\n<body>\n    <div class="master-arena">\n        <h1>Master Debug Arena</h1>\n        <div class="boss-stats">\n            <div class="stat">\n                <span class="stat-label">Bugs Found</span>\n                <span id="bugsFound">0</span>\n                <span class="stat-total">/25</span>\n            </div>\n        </div>\n        <div id="bossContent">\n            <div class="bug-section" data-bug="1">\n                <h2>Section 1</h2>\n                <p class="bug-text">This text should be visible</p>\n            </div>\n        </div>\n        <input type="text" id="finalFlag" placeholder="Enter flag">\n        <button id="submitFlag">Submit</button>\n        <p id="flagResult"></p>\n    </div>\n</body>\n</html>`,
        brokenCSS: `.master-arena { text-align: center; padding: 2rem; }\n.bug-section { margin: 1rem 0; padding: 1rem; border: 1px solid #ccc; }\n.bug-text { display: none; }`,
        brokenJS: `const bugs = {\n    found: 0,\n    total: 25\n};\n\nfunction findBug(id) {\n    bugs.found++;\n    document.getElementById('bugsFound').textContent = bugs.found;\n    \n    if (bugs.found === bugs.total) {\n        // Show flag input\n    }\n}\n\n// Fix all bugs to reveal the flag\n// Flag: AIODYSSEY{MASTER_DEBUGGER}`,
        expectedOutput: "All 25 bugs fixed, flag input revealed, and final flag accepted",
        flag: "AIODYSSEY{MASTER_DEBUGGER}",
        hint1: "Decode this: QUlPRFlTU0VZe01BU1RFUl9ERUJVR0dFUn0= (Base64)",
        hint2: "Check the console for hidden clues. The bugs are everywhere.",
        solution: "Fix all 25 bugs across HTML (missing tags, attributes), CSS (display:none, wrong selectors), and JS (logic, async, events)"
    }
];

/* ============================================
   AI ODYSSEY - Accepted Simple Answers (Tags)
   ============================================ */

// Simple one-word/tag answers accepted per challenge.
// Users can submit these short answers (in addition to the full solution).
const ChallengeAcceptedAnswers = {
    1: ['</html>', 'html', 'closing tag'],
    2: ['flex', 'display:flex', 'display: flex'],
    3: ['margin-top:auto', 'margin-top: auto', 'footer'],
    4: ['src', 'src attribute', 'image path'],
    5: ['for', 'label for', 'for attribute'],
    6: ['trim()', 'trim', 'validation'],
    7: ['center', 'justify-content', 'align-items'],
    8: ['grid-template-columns', 'repeat(3, 1fr)'],
    9: [':hover', 'hover'],
    10: ['pointer-events', 'z-index'],
    11: ['classList.add()', 'classList.add', 'active'],
    12: ['classList.toggle()', 'classList.toggle', 'show'],
    13: ['count++', 'count'],
    14: ['Number()', 'parseInt()', 'parseFloat()', 'number'],
    15: ['setInterval', 'interval'],
    16: ['data-theme', 'theme'],
    17: ['parentElement.remove()', 'parentElement.remove', 'remove()'],
    18: ['includes()', 'includes', 'filter'],
    19: ['nextElementSibling', 'toggle'],
    20: ['dataset', 'data-tab'],
    21: ['response.json()', 'response.json', 'json()'],
    22: ['resolve()', 'resolve'],
    23: ['await', 'async/await'],
    24: ['flexbox', 'flex'],
    25: ['Number()', 'parseInt()', 'parseFloat()', 'number'],
    26: ['load', 'window.load', 'auto-load'],
    27: ['JSON.stringify', 'JSON.parse', 'stringify'],
    28: ['regex', 'pattern'],
    29: ['length', 'password strength'],
    30: ['translateX', 'transform'],
    31: ['insertBefore', 'drag'],
    32: ['beginPath()', 'beginPath', 'canvas'],
    33: ['@keyframes', 'keyframes', 'spin'],
    34: ['i <= n', 'loop condition', 'i < n'],
    35: ['stopPropagation()', 'stopPropagation'],
    36: ['clearInterval', 'interval'],
    37: ['data-src', 'lazy', 'dataset.src'],
    38: ['@media', 'media query', 'media'],
    39: ['ARIA', 'keyboard', 'accessibility'],
    40: ['infinite', 'animation'],
    41: ['scoping', 'css variables'],
    42: ['minmax()', 'minmax'],
    43: ['var()', 'css variables', 'variables'],
    44: ['Promise.race', 'timeout'],
    45: ['showStep()', 'showStep', 'step'],
    46: ['index', 'correct'],
    47: ['setTimeout', 'timeout'],
    48: ['currentIndex', 'sequence'],
    49: ['checkAllConditions()', 'checkAllConditions'],
    50: ['25 bugs', '25', 'all bugs']
};

/* ============================================
   AI ODYSSEY - Dynamic Per-Participant Flags
   ============================================ */

// Simple deterministic string hash
function hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0; // convert to 32-bit integer
    }
    return Math.abs(hash);
}

// Generate a 6-character personal code from a username
function getPersonalCode(username) {
    if (!username) return '';
    return hashCode(username).toString(36).toUpperCase().slice(0, 6);
}

// Generate a unique flag for a specific (challenge, participant) pair.
// Format: AIODYSSEY{<base_solution>_<PERSONAL_CODE>}
function generateUserFlag(challenge, username) {
    const code = getPersonalCode(username);
    if (!code) return challenge.flag;
    const base = challenge.flag.replace('AIODYSSEY{', '').replace('}', '');
    return `AIODYSSEY{${base}_${code}}`;
}

// Deterministically shuffle challenge order per participant (seeded by username)
function getShuffledChallenges(username) {
    const arr = ChallengesDB.slice();
    if (!username) return arr;
    let s = hashCode(username + ':arena');
    for (let i = arr.length - 1; i > 0; i--) {
        s = (s * 1103515245 + 12345) & 0x7fffffff;
        const j = s % (i + 1);
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChallengesDB;
    module.exports.hashCode = hashCode;
    module.exports.getPersonalCode = getPersonalCode;
    module.exports.generateUserFlag = generateUserFlag;
    module.exports.getShuffledChallenges = getShuffledChallenges;
}


