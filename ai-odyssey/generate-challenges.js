/**
 * AI Odyssey - Challenge Generator
 * Run with: node generate-challenges.js
 * This script generates all 50 challenge folders with their files
 */

const fs = require('fs');
const path = require('path');

const challenges = [
    { id: 1, title: 'Missing Closing Tag', difficulty: 'easy', points: 50, desc: 'The HTML structure has a missing closing tag causing the layout to break.', objective: 'Fix the HTML by adding the missing closing tag to restore proper document structure.', flag: 'AIODYSSEY{missing_closing_tag}' },
    { id: 2, title: 'Navbar Broken', difficulty: 'easy', points: 50, desc: 'The navigation bar is not displaying properly. The links are stacked vertically instead of horizontally.', objective: 'Fix the CSS to make the navbar display links in a horizontal row.', flag: 'AIODYSSEY{navbar_fixed}' },
    { id: 3, title: 'Broken Footer', difficulty: 'easy', points: 50, desc: 'The footer is displaying at the wrong position. It should stick to the bottom of the page.', objective: 'Fix the footer so it stays at the bottom of the page.', flag: 'AIODYSSEY{footer_fixed}' },
    { id: 4, title: 'Image Not Showing', difficulty: 'easy', points: 50, desc: 'The image is not displaying on the webpage. The src attribute might be incorrect.', objective: 'Fix the image path or attributes so the image displays correctly.', flag: 'AIODYSSEY{image_fixed}' },
    { id: 5, title: 'Broken Contact Form', difficulty: 'easy', points: 50, desc: 'The contact form is not submitting properly. The form fields are not correctly associated with labels.', objective: 'Fix the form by properly associating labels with their input fields.', flag: 'AIODYSSEY{form_fixed}' },
    { id: 6, title: 'Login Validation', difficulty: 'easy', points: 50, desc: 'The login form doesn\'t validate inputs before submission.', objective: 'Add validation to ensure username and password are not empty.', flag: 'AIODYSSEY{login_validated}' },
    { id: 7, title: 'Incorrect Flex Alignment', difficulty: 'easy', points: 50, desc: 'Items inside a flex container are not centered as intended.', objective: 'Fix the flexbox properties to center items both horizontally and vertically.', flag: 'AIODYSSEY{flex_centered}' },
    { id: 8, title: 'Broken CSS Grid', difficulty: 'easy', points: 50, desc: 'The CSS Grid layout is not creating the expected 3-column layout.', objective: 'Fix the grid properties to create a proper 3-column grid layout.', flag: 'AIODYSSEY{grid_fixed}' },
    { id: 9, title: 'Missing Hover Effect', difficulty: 'easy', points: 50, desc: 'The buttons should change appearance when hovered, but nothing happens.', objective: 'Add CSS hover effects to make buttons interactive.', flag: 'AIODYSSEY{hover_added}' },
    { id: 10, title: 'Button Not Clickable', difficulty: 'easy', points: 50, desc: 'The button appears but cannot be clicked. Something is blocking it.', objective: 'Fix the z-index or pointer-events so the button responds to clicks.', flag: 'AIODYSSEY{button_fixed}' },
    { id: 11, title: 'Modal Doesn\'t Open', difficulty: 'easy', points: 50, desc: 'Clicking the button doesn\'t show the modal overlay.', objective: 'Fix the JavaScript so the modal opens when the button is clicked.', flag: 'AIODYSSEY{modal_fixed}' },
    { id: 12, title: 'Dropdown Broken', difficulty: 'easy', points: 50, desc: 'The dropdown menu doesn\'t show when its toggle button is clicked.', objective: 'Fix the dropdown toggle functionality to show/hide the menu.', flag: 'AIODYSSEY{dropdown_fixed}' },
    { id: 13, title: 'Counter Doesn\'t Increase', difficulty: 'easy', points: 50, desc: 'The counter value stays at 0 when the increment button is clicked.', objective: 'Fix the counter logic so it increments on each button click.', flag: 'AIODYSSEY{counter_fixed}' },
    { id: 14, title: 'Calculator Wrong Output', difficulty: 'easy', points: 50, desc: 'The calculator returns wrong results for basic arithmetic operations.', objective: 'Fix the calculation logic to produce correct arithmetic results.', flag: 'AIODYSSEY{calculator_fixed}' },
    { id: 15, title: 'Clock Doesn\'t Update', difficulty: 'easy', points: 50, desc: 'The digital clock displays the time but never updates.', objective: 'Fix the clock to update every second.', flag: 'AIODYSSEY{clock_fixed}' },
    { id: 16, title: 'Theme Toggle Broken', difficulty: 'easy', points: 50, desc: 'The theme toggle button doesn\'t change the page theme.', objective: 'Fix the theme toggle to switch between light and dark modes.', flag: 'AIODYSSEY{theme_fixed}' },
    { id: 17, title: 'Todo Delete Fails', difficulty: 'easy', points: 50, desc: 'Items added to the todo list cannot be deleted.', objective: 'Fix the delete functionality to remove todo items.', flag: 'AIODYSSEY{todo_fixed}' },
    { id: 18, title: 'Search Doesn\'t Filter', difficulty: 'easy', points: 50, desc: 'Typing in the search box doesn\'t filter the list of items.', objective: 'Fix the search filter to show only matching items.', flag: 'AIODYSSEY{search_fixed}' },
    { id: 19, title: 'Accordion Doesn\'t Expand', difficulty: 'easy', points: 50, desc: 'Clicking on accordion headers doesn\'t expand the content panels.', objective: 'Fix the accordion to toggle content visibility.', flag: 'AIODYSSEY{accordion_fixed}' },
    { id: 20, title: 'Tabs Don\'t Switch', difficulty: 'easy', points: 50, desc: 'Clicking on different tab buttons doesn\'t switch the visible content.', objective: 'Fix the tabs functionality to switch between content panels.', flag: 'AIODYSSEY{tabs_fixed}' },
    { id: 21, title: 'API Fetch Error', difficulty: 'medium', points: 100, desc: 'The fetch request to get data from an API is failing.', objective: 'Fix the fetch request and handle the response correctly.', flag: 'AIODYSSEY{api_fixed}' },
    { id: 22, title: 'Promise Never Resolves', difficulty: 'medium', points: 100, desc: 'A custom promise is created but never resolves.', objective: 'Fix the promise to properly resolve with the expected value.', flag: 'AIODYSSEY{promise_fixed}' },
    { id: 23, title: 'Async Await Bug', difficulty: 'medium', points: 100, desc: 'The async function using await is not working correctly.', objective: 'Fix the async/await implementation to work properly.', flag: 'AIODYSSEY{async_fixed}' },
    { id: 24, title: 'Weather Card Broken', difficulty: 'medium', points: 100, desc: 'The weather card UI is completely misaligned and unstyled.', objective: 'Fix the CSS to create a visually appealing weather card.', flag: 'AIODYSSEY{weather_fixed}' },
    { id: 25, title: 'Shopping Cart Total Wrong', difficulty: 'medium', points: 100, desc: 'The shopping cart total is calculated incorrectly.', objective: 'Fix the cart total calculation to sum item prices correctly.', flag: 'AIODYSSEY{cart_fixed}' },
    { id: 26, title: 'LocalStorage Doesn\'t Save', difficulty: 'medium', points: 100, desc: 'Data is not persisting in localStorage across page reloads.', objective: 'Fix the localStorage save and load functionality.', flag: 'AIODYSSEY{storage_fixed}' },
    { id: 27, title: 'SessionStorage Bug', difficulty: 'medium', points: 100, desc: 'SessionStorage data retrieval is returning the wrong format.', objective: 'Fix sessionStorage to properly store and retrieve objects.', flag: 'AIODYSSEY{session_fixed}' },
    { id: 28, title: 'Form Regex Error', difficulty: 'medium', points: 100, desc: 'The email validation regex is incorrectly rejecting valid emails.', objective: 'Fix the regex pattern to properly validate email addresses.', flag: 'AIODYSSEY{regex_fixed}' },
    { id: 29, title: 'Password Meter Broken', difficulty: 'medium', points: 100, desc: 'The password strength meter doesn\'t update as the user types.', objective: 'Fix the password strength indicator to work in real-time.', flag: 'AIODYSSEY{meter_fixed}' },
    { id: 30, title: 'Slider Doesn\'t Move', difficulty: 'medium', points: 100, desc: 'The image slider is not sliding to show the next/previous images.', objective: 'Fix the slider CSS and JavaScript to enable sliding functionality.', flag: 'AIODYSSEY{slider_fixed}' },
    { id: 31, title: 'Drag Drop Broken', difficulty: 'medium', points: 100, desc: 'The drag and drop functionality is not working for the list items.', objective: 'Fix the drag and drop to allow reordering items.', flag: 'AIODYSSEY{drag_fixed}' },
    { id: 32, title: 'Canvas Doesn\'t Draw', difficulty: 'medium', points: 100, desc: 'The canvas element is not drawing any shapes or graphics.', objective: 'Fix the canvas drawing code to render shapes properly.', flag: 'AIODYSSEY{canvas_fixed}' },
    { id: 33, title: 'SVG Animation Missing', difficulty: 'medium', points: 100, desc: 'The SVG element has CSS animation properties but doesn\'t animate.', objective: 'Fix the SVG animation to rotate or move continuously.', flag: 'AIODYSSEY{svg_fixed}' },
    { id: 34, title: 'Infinite Loop', difficulty: 'medium', points: 100, desc: 'The JavaScript code is stuck in an infinite loop, freezing the page.', objective: 'Fix the loop condition to prevent infinite execution.', flag: 'AIODYSSEY{loop_fixed}' },
    { id: 35, title: 'Event Bubbling Bug', difficulty: 'medium', points: 100, desc: 'Clicking on inner elements triggers unexpected parent handlers.', objective: 'Fix event propagation to prevent unwanted bubbling.', flag: 'AIODYSSEY{bubbling_fixed}' },
    { id: 36, title: 'Memory Leak', difficulty: 'medium', points: 100, desc: 'The application is consuming increasing memory over time.', objective: 'Fix the memory leak caused by improper cleanup.', flag: 'AIODYSSEY{leak_fixed}' },
    { id: 37, title: 'Lazy Loading Broken', difficulty: 'medium', points: 100, desc: 'Images with lazy loading are not loading when scrolled into view.', objective: 'Fix the lazy loading implementation.', flag: 'AIODYSSEY{lazy_fixed}' },
    { id: 38, title: 'Responsive Dashboard', difficulty: 'medium', points: 100, desc: 'The dashboard layout doesn\'t adapt to different screen sizes.', objective: 'Fix the CSS to make the dashboard responsive.', flag: 'AIODYSSEY{dashboard_fixed}' },
    { id: 39, title: 'Keyboard Accessibility', difficulty: 'medium', points: 100, desc: 'The custom dropdown is not accessible via keyboard.', objective: 'Fix the component to support keyboard navigation.', flag: 'AIODYSSEY{keyboard_fixed}' },
    { id: 40, title: 'Animation Stuck', difficulty: 'medium', points: 100, desc: 'A CSS animation plays once then stops instead of looping.', objective: 'Fix the animation to play continuously.', flag: 'AIODYSSEY{animation_fixed}' },
    { id: 41, title: 'CSS Variable Conflict', difficulty: 'hard', points: 200, desc: 'CSS custom properties are conflicting across different components.', objective: 'Fix the CSS variable scoping to eliminate conflicts.', flag: 'AIODYSSEY{variables_fixed}' },
    { id: 42, title: 'Grid Overflow', difficulty: 'hard', points: 200, desc: 'Content in the grid container overflows instead of wrapping.', objective: 'Fix the grid layout to properly wrap items.', flag: 'AIODYSSEY{grid_overflow_fixed}' },
    { id: 43, title: 'Dark Theme Conflict', difficulty: 'hard', points: 200, desc: 'Some elements don\'t respond properly to dark/light theme switching.', objective: 'Fix the theme implementation so all elements respond correctly.', flag: 'AIODYSSEY{dark_theme_fixed}' },
    { id: 44, title: 'API Timeout', difficulty: 'hard', points: 200, desc: 'The API request hangs indefinitely when the server is slow.', objective: 'Implement a timeout mechanism for the fetch request.', flag: 'AIODYSSEY{timeout_fixed}' },
    { id: 45, title: 'Multi-step Form', difficulty: 'hard', points: 200, desc: 'The multi-step form doesn\'t properly navigate between steps.', objective: 'Fix the multi-step form navigation with validation.', flag: 'AIODYSSEY{multistep_fixed}' },
    { id: 46, title: 'Quiz Logic Broken', difficulty: 'hard', points: 200, desc: 'The quiz app doesn\'t track score or show correct/incorrect answers.', objective: 'Fix the quiz logic to track score and provide feedback.', flag: 'AIODYSSEY{quiz_fixed}' },
    { id: 47, title: 'Notification System', difficulty: 'hard', points: 200, desc: 'The notification system doesn\'t show notifications or clears them too fast.', objective: 'Fix the notification system with proper timing and stacking.', flag: 'AIODYSSEY{notifications_fixed}' },
    { id: 48, title: 'Escape Room Puzzle', difficulty: 'hard', points: 200, desc: 'The puzzle requires a specific sequence of actions but the logic is broken.', objective: 'Fix the puzzle state machine.', flag: 'AIODYSSEY{puzzle_fixed}' },
    { id: 49, title: 'Final Portal', difficulty: 'hard', points: 200, desc: 'The portal requires multiple conditions to be met before activating.', objective: 'Fix all conditions and logic checks to activate the portal.', flag: 'AIODYSSEY{portal_fixed}' },
    { id: 50, title: 'Master Debug Arena', difficulty: 'boss', points: 500, desc: 'THE FINAL BOSS. Contains 25 hidden bugs across HTML, CSS, and JavaScript.', objective: 'Fix all 25 bugs in the master challenge to reveal the final flag.', flag: 'AIODYSSEY{MASTER_DEBUGGER}' }
];

function generateChallengeFiles(challenge) {
    const id = String(challenge.id).padStart(2, '0');
    const dir = path.join(__dirname, 'challenges', `challenge${id}`);
    
    // Create directory
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    // Read template
    let template = fs.readFileSync(path.join(__dirname, 'challenges', 'template.html'), 'utf8');
    
    // Replace placeholders
    template = template
        .replace(/%ID%/g, challenge.id)
        .replace(/%ID_PADDED%/g, id)
        .replace(/%TITLE%/g, challenge.title)
        .replace(/%DIFFICULTY%/g, challenge.difficulty)
        .replace(/%DIFFICULTY_UPPER%/g, challenge.difficulty.toUpperCase())
        .replace(/%POINTS%/g, challenge.points)
        .replace(/%DESCRIPTION%/g, challenge.desc)
        .replace(/%OBJECTIVE%/g, challenge.objective);

    // Write index.html
    fs.writeFileSync(path.join(dir, 'index.html'), template);

    // Write flag.txt
    fs.writeFileSync(path.join(dir, 'flag.txt'), challenge.flag);

    console.log(`✅ Generated challenge${id}: ${challenge.title}`);
}

// Generate all challenges
console.log('🚀 Generating AI Odyssey Challenges...\n');
challenges.forEach(challenge => generateChallengeFiles(challenge));
console.log('\n✅ All 50 challenges generated successfully!');

