// main.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, doc, getDoc, addDoc, setDoc, updateDoc, deleteDoc, onSnapshot, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// --- Global State Variables ---
let currentPage = 'home';
let cart = [];
let products = [
    { id: 'p1', category: 'Electronics', name: 'Wireless Headphones', price: 15000, description: 'Compact portable speaker with powerful sound and long battery life.', imageUrl: 'https://m.media-amazon.com/images/I/41JACWT-wWL._SX522_.jpg', reviews: [{ userName: 'Alice', rating: 5, comment: 'Amazing sound quality!' }] },
    { id: 'p17', category: 'Electronics', name: 'Portable Speaker', price: 9000, description: 'High-fidelity sound with noise cancellation, perfect for immersive audio experiences. Long-lasting battery life and comfortable earcups.', imageUrl: 'https://alhamdtech.pk/cdn/shop/files/jbl-partybox-110-portable-party-speaker-built-in-lights-961702.jpg?v=1722252487', reviews: [{ userName: 'manahil', rating: 5, comment: 'Amazing sound quality!' }] },
    { id: 'p18', category: 'Electronics', name: 'Gaming Mouse', price: 5000, description: 'Ergonomic gaming mouse with customizable RGB lighting and high DPI.', imageUrl: 'https://static1.xdaimages.com/wordpress/wp-content/uploads/wm/2024/03/gravastar-mercury-m1-pro-body.jpg', reviews: [{ userName: 'Ali', rating: 4, comment: 'It is a good product to use I love to use it!' }] },
    { id: 'p2', category: 'Electronics', name: 'Smartwatch', price: 30000, description: 'Track your fitness, receive notifications, and manage calls directly from your wrist. Features a vibrant display and durable design.', imageUrl: 'https://cdn.sectornolimits.com/i/huge/75561/9-sector-smartwatch-s-04-colours-r3253158008_v9n1b8.jpg', reviews: [{ userName: 'Bob', rating: 4, comment: 'Good features, battery could be better.' }] },
    { id: 'p3', category: 'Clothing', name: 'Casual T-Shirt', price: 3500, description: 'Comfortable 100% cotton t-shirt for everyday wear. Available in multiple colors and sizes.', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShey2AptKKhlWkQjttQUTrF0Z9rjCuWT5a1A&s', reviews: [{ userName: 'Charlie', rating: 5, comment: 'Very soft and fits perfectly.' }] },
    { id: 'p4', category: 'Clothing', name: 'Denim Jeans', price: 8500, description: 'Classic fit denim jeans, durable and stylish for any occasion. Features five pockets and a comfortable stretch.', imageUrl: 'https://diners.com.pk/cdn/shop/files/KBC-1012D-BLUERS2790-01.webp?v=1713951855', reviews: [{ userName: 'Diana', rating: 4, comment: 'Stylish and comfortable, a bit long.' }] },
    { id: 'p5', category: 'Home Goods', name: 'Coffee Maker', price: 12000, description: 'Brew perfect coffee every morning with this easy-to-use coffee maker. Features a programmable timer and a large capacity.', imageUrl: 'https://static-01.daraz.pk/p/734e0e5f553f74f146d6c5e2d3239455.jpg', reviews: [{ userName: 'Eve', rating: 5, comment: 'Makes excellent coffee, easy to clean.' }] },
    { id: 'p6', category: 'Home Goods', name: 'Desk Lamp', price: 5000, description: 'Modern desk lamp with adjustable brightness and color temperature. Perfect for reading or working.', imageUrl: 'https://apricot.com.pk/cdn/shop/products/Creative-Wooden-Iron-Table-Desk-Lamp-Grey-Apricot-531.jpg?v=1712099874', reviews: [{ userName: 'Frank', rating: 3, comment: 'Good for the price, but a bit flimsy.' }] },
    { id: 'p7', category: 'Books', name: 'Sci-Fi Epic Novel', price: 2500, description: 'A thrilling science fiction novel with intricate world-building and compelling characters.', imageUrl: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1725449764i/218471348.jpg', reviews: [{ userName: 'Grace', rating: 5, comment: 'Couldn\'t put it down!' }] },
    { id: 'p8', category: 'Sports & Outdoors', name: 'Yoga Mat', price: 4000, description: 'Durable and non-slip yoga mat, ideal for all types of yoga and fitness exercises.', imageUrl: 'https://photos.cdn-outlet.com/yo-images/userfiles/guide/image/brett/screen%20shot%202015-09-03%20at%209_54_51%20pm.png', reviews: [{ userName: 'Heidi', rating: 4, comment: 'Good grip, a bit thin for my knees.' }] },
    { id: 'p9', category: 'Beauty', name: 'Natural Face Serum', price: 6500, description: 'Organic face serum with hyaluronic acid for hydration and anti-aging benefits.', imageUrl: 'https://img.drz.lazcdn.com/static/pk/p/1a4c65d0ac1f86dd321acec45f8f6ca1.png_960x960q80.png_.webp', reviews: [{ userName: 'Ivy', rating: 5, comment: 'My skin feels amazing after just a week!' }] },
    { id: 'p10', category: 'Kids & Toys', name: 'Wooden Building Blocks', price: 5500, description: 'Classic wooden building blocks set for creative play and developing motor skills.', imageUrl: 'https://palletfurniture.in/cdn/shop/files/3_b1a72929-1f32-4ab7-a362-23b1d72c9de1.png?v=1714476592&width=533', reviews: [{ userName: 'Jack', rating: 5, comment: 'My kids love these, very sturdy.' }] },
    { id: 'p11', category: 'Pet Supplies', name: 'Orthopedic Dog Bed', price: 13000, description: 'Comfortable orthopedic dog bed designed for joint support and ultimate pet comfort.', imageUrl: 'https://m.media-amazon.com/images/I/91E5MptyF3L.jpg', reviews: [{ userName: 'Karen', rating: 4, comment: 'My dog sleeps soundly, but it\'s a bit bulky.' }] },
    { id: 'p12', category: 'Automotive', name: 'Car Vacuum Cleaner', price: 7000, description: 'Portable and powerful car vacuum cleaner for quick and easy interior cleaning.', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxfbw8BHNtrxbipwL96-IM0p7v5v5UnlPhiw&s', reviews: [{ userName: 'Liam', rating: 3, comment: 'Decent suction, battery life could be better.' }] },
    { id: 'p13', category: 'Garden & Outdoor', name: 'Smart Garden System', price: 18000, description: 'Automated indoor garden system for growing herbs and vegetables year-round.', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKAgiaSlpmnvGlhkKbj-1x-rerRq-Irbjtsg&s', reviews: [{ userName: 'Mia', rating: 5, comment: 'My herbs are thriving, so easy to use!' }] },
    { id: 'p14', category: 'Jewelry', name: 'Silver Pendant Necklace', price: 10000, description: 'Elegant sterling silver pendant necklace with a delicate chain, perfect for any outfit.', imageUrl: 'https://silverstones.pk/cdn/shop/files/PearlJewelrySpecialDiscountInstagramPost_16.jpg?v=1750294710&width=1080', reviews: [{ userName: 'Noah', rating: 5, comment: 'Beautiful and high quality, great gift.' }] },
    { id: 'p15', category: 'Food & Drink', name: 'Artisan Coffee Beans', price: 2300, description: 'Premium single-origin coffee beans, medium roast with notes of chocolate and caramel.', imageUrl: 'https://thewoods.net.in/wp-content/uploads/2021/02/hotcofee.jpg', reviews: [{ userName: 'Olivia', rating: 5, comment: 'Best coffee I\'ve had in a long time!' }] },
    { id: 'p16', category: 'Health & Wellness', name: 'Aromatherapy Diffuser', price: 5000, description: 'Ultrasonic essential oil diffuser with LED lighting, creates a relaxing ambiance.', imageUrl: 'https://static-01.daraz.pk/p/b8f274cde670aa36418a04027e523f8c.jpg', reviews: [{ userName: 'Peter', rating: 4, comment: 'Works well, but the light is a bit bright.' }] },
    { id: 'p19', category: 'Electronics', name: 'Security Camera', price: 8000, description: 'Indoor security camera with motion detection and night vision.', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-F63ObPvPD59x6rlrDfZ7RJBUBlIAIPAZtA&s', reviews: [{ userName: 'Maha', rating: 4, comment: 'Camera is very helpful and this camera quality is unbelieveable' }] },
    { id: 'p20', category: 'Electronics', name: 'laptop', price: 60000, description: 'Powerful laptop for work and entertainment, lightweight design.', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaOjXB0n2hAMtnMiQb4g6MZysNyyLQrZ2n7Q&s', reviews: [{ userName: 'ahmad', rating: 3, comment: 'good quality ' }] },
    { id: 'p21', category: 'Electronics', name: 'LED', price: 50000, description: 'LED TV shows clearer and brighter pictures with lower power use.', imageUrl: 'https://cdn.mos.cms.futurecdn.net/FnHWbSEffhzsKKsZeCsjBb-1200-80.jpg', reviews: [{ userName: 'sara', rating:4 , comment: 'Led is very usefull' }] },
    { id: 'p22', category: 'Electronics', name: 'Printer', price: 65000, description: 'A printer gives you a paper copy of your digital work, like notes or photos', imageUrl: 'https://i5.walmartimages.com/seo/Epson-Expression-Home-XP-4105-Wireless-All-in-One-Color-Inkjet-Printer-WiFi_a1e72e07-c525-45b9-a40a-0f9630f99f56_1.f4d8b0c17a102dae59da29d814bdbaf3.jpeg', reviews: [{ userName: 'ahmad', rating: 3, comment: 'good quality ' }] },
    { id: 'p23', category: 'Beauty', name: 'Moisturizing Cream', price: 2500, description: 'Hydrating and nourishing cream for all skin types.', imageUrl: 'https://faceitbyzk.com/cdn/shop/files/Serum_Edit_popopo.jpg?v=1720711496&width=1946', reviews: [{ userName: 'taha', rating: 4, comment: 'wonderful product!' }] },
    { id: 'p24', category: 'Beauty', name: 'Lipstick Set', price: 3500, description: 'Collection of long-lasting lipsticks in various shades.', imageUrl: 'https://ameena.pk/cdn/shop/files/131947851_139679754410120_5545256128237950133_n.webp?v=1721927387', reviews: [{ userName: 'manahil', rating: 5, comment: 'My skin feels soft and silky after few days!' }] },
    { id: 'p25', category: 'Beauty', name: 'Eye Shadow Palette', price: 4000, description: 'Versatile eye shadow palette with matte and shimmer shades.', imageUrl: 'https://onlinemart.com.pk/cdn/shop/files/48080684-de05-4c1c-9b26-703194ecf1a6_1445x.jpg?v=1750865672', reviews: [{ userName: 'maha', rating: 5, comment: 'good quality' }] },
    { id: 'p26', category: 'Beauty', name: 'Blush', price: 3000, description: 'A blush that gives a natural, healthy glow to your cheeks.', imageUrl: 'https://www.lorealparis.ca/sites/g/files/g392823/files/styles/product_image_large/public/images/p_pdp_12_3600523971439_17112022_9411.png?itok=8J8_w_zK', reviews: [{ userName: 'sara', rating:4, comment: 'nice color' }] },
    { id: 'p27', category: 'Beauty', name: 'Highlighter', price: 3500, description: 'A highlighter that gives a radiant glow and luminous finish.', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0k65E5Q-V6N05vX-X0h-0Y5h-6gR0c1eM9w&s', reviews: [{ userName: 'maha', rating: 5, comment: 'good' }] },
];
let user;
const ADMIN_PASSWORD = 'admin';
let isAdminAuthenticated = false;

// --- Firebase Initialization ---
// The app_id and firebase_config are provided by the Flask backend
// and injected into the HTML template. We parse them here.
const firebaseConfig = JSON.parse(document.body.getAttribute('data-firebase-config'));
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


// Get the app ID from the data attribute on the body tag
const appId = document.body.getAttribute('data-app-id');
// A user's private data will be stored under this path
let userCartPath = `artifacts/${appId}/users/${user?.uid || 'anonymous'}/cart`;

// --- DOM Elements ---
const contentArea = document.getElementById('content-area');
const authButtonsDiv = document.getElementById('auth-buttons');
const productDetailModal = document.getElementById('product-detail-modal');
const modalContentDiv = document.getElementById('modal-content');
const cartItemCountSpan = document.getElementById('cart-item-count');

// --- Helper Functions ---
// A custom alert message function to avoid `window.alert()`
function alertMessage(message, type = 'info') {
    const alertBox = document.createElement('div');
    alertBox.textContent = message;
    alertBox.className = 'fixed top-4 right-4 p-4 rounded-lg shadow-lg text-white font-bold animate-fade-in-down z-[100]';

    switch (type) {
        case 'success':
            alertBox.classList.add('bg-green-500');
            break;
        case 'error':
            alertBox.classList.add('bg-red-500');
            break;
        case 'info':
        default:
            alertBox.classList.add('bg-blue-500');
            break;
    }

    document.body.appendChild(alertBox);
    setTimeout(() => {
        alertBox.classList.add('animate-fade-out');
        alertBox.addEventListener('animationend', () => alertBox.remove());
    }, 3000);
}

// Function to render a product card
function renderProductCard(product) {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden flex flex-col cursor-pointer animate-fade-in-up';
    card.dataset.productId = product.id;
    card.innerHTML = `
        <img src="${product.imageUrl}" alt="${product.name}" class="w-full h-48 object-cover">
        <div class="p-4 flex-grow">
            <h3 class="text-xl font-bold text-gray-800">${product.name}</h3>
            <p class="text-gray-500 text-sm mt-1">${product.category}</p>
        </div>
        <div class="px-4 pb-4 flex items-center justify-between">
            <span class="text-2xl font-bold text-blue-600">PKR ${product.price.toLocaleString()}</span>
            <button class="add-to-cart-btn bg-blue-600 text-white rounded-full p-3 shadow-lg hover:bg-blue-700 transition-colors" data-product-id="${product.id}">
                <i data-lucide="shopping-cart" class="w-5 h-5"></i>
            </button>
        </div>
    `;

    // Ensure Lucide icons are rendered
    lucide.createIcons();

    card.querySelector('.add-to-cart-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        addToCart(product.id);
    });
    card.addEventListener('click', () => showProductDetail(product));
    return card;
}

// Function to render the home page
function renderHomePage() {
    currentPage = 'home';
    contentArea.innerHTML = `
        <div class="container mx-auto">
            <h2 class="text-4xl font-extrabold text-gray-800 mb-8 animate-fade-in-down">Featured Products</h2>
            <div id="product-list" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                <!-- Product cards will be injected here -->
            </div>
        </div>
    `;
    const productList = document.getElementById('product-list');
    products.forEach(product => {
        productList.appendChild(renderProductCard(product));
    });
    lucide.createIcons();
}

// Function to render the categories page
function renderCategoriesPage() {
    currentPage = 'categories';
    const categories = [...new Set(products.map(p => p.category))];
    contentArea.innerHTML = `
        <div class="container mx-auto animate-fade-in-down">
            <h2 class="text-4xl font-extrabold text-gray-800 mb-8">Product Categories</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                ${categories.map(category => `
                    <div class="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:shadow-2xl transition-shadow duration-300" data-category="${category}">
                        <h3 class="text-2xl font-bold text-blue-600">${category}</h3>
                        <p class="text-gray-500 mt-2">${products.filter(p => p.category === category).length} products</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    document.querySelectorAll('[data-category]').forEach(item => {
        item.addEventListener('click', () => renderCategoryProducts(item.dataset.category));
    });
}

// Function to render products of a specific category
function renderCategoryProducts(category) {
    currentPage = 'category-products';
    contentArea.innerHTML = `
        <div class="container mx-auto">
            <h2 class="text-4xl font-extrabold text-gray-800 mb-8 animate-fade-in-down">${category}</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                ${products.filter(p => p.category === category).map(product => renderProductCard(product).outerHTML).join('')}
            </div>
        </div>
    `;
    lucide.createIcons();
    // Re-attach event listeners for dynamically created cards
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            addToCart(button.dataset.productId);
        });
    });
    document.querySelectorAll('[data-product-id]').forEach(card => {
        const product = products.find(p => p.id === card.dataset.productId);
        if (product) {
            card.addEventListener('click', () => showProductDetail(product));
        }
    });
}

// Function to render the cart page
function renderCartPage() {
    currentPage = 'cart';
    let total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    contentArea.innerHTML = `
        <div class="container mx-auto animate-fade-in-down">
            <h2 class="text-4xl font-extrabold text-gray-800 mb-8">Shopping Cart</h2>
            ${cart.length === 0
                ? '<p class="text-center text-xl text-gray-500">Your cart is empty.</p>'
                : `<div class="bg-white rounded-xl shadow-lg overflow-hidden">
                    <ul id="cart-list" class="divide-y divide-gray-200">
                        ${cart.map(item => `
                            <li class="p-4 flex items-center space-x-4">
                                <img src="${item.imageUrl}" alt="${item.name}" class="w-20 h-20 object-cover rounded-lg">
                                <div class="flex-grow">
                                    <h4 class="text-lg font-bold">${item.name}</h4>
                                    <p class="text-gray-600">PKR ${item.price.toLocaleString()} x ${item.quantity}</p>
                                </div>
                                <div class="text-lg font-bold text-blue-600">PKR ${(item.price * item.quantity).toLocaleString()}</div>
                                <button class="remove-from-cart-btn text-red-500 hover:text-red-700 transition-colors" data-product-id="${item.id}">
                                    <i data-lucide="x-circle" class="w-6 h-6"></i>
                                </button>
                            </li>
                        `).join('')}
                    </ul>
                    <div class="p-6 bg-gray-50 flex justify-between items-center">
                        <span class="text-2xl font-bold text-gray-800">Total: PKR ${total.toLocaleString()}</span>
                        <button id="checkout-btn" class="bg-green-500 text-white font-bold py-3 px-6 rounded-full hover:bg-green-600 transition-colors shadow-lg">Checkout</button>
                    </div>
                </div>`
            }
        </div>
    `;

    lucide.createIcons();

    if (cart.length > 0) {
        document.getElementById('checkout-btn').addEventListener('click', () => {
            if (user) {
                alertMessage('Proceeding to checkout...', 'info');
                // You would add real checkout logic here
                renderOrderConfirmation();
            } else {
                alertMessage('Please log in to proceed to checkout.', 'error');
                renderPage('login');
            }
        });
        document.querySelectorAll('.remove-from-cart-btn').forEach(button => {
            button.addEventListener('click', () => removeFromCart(button.dataset.productId));
        });
    }
}

// Function to render order confirmation page
function renderOrderConfirmation() {
    currentPage = 'order-confirmation';
    contentArea.innerHTML = `
        <div class="container mx-auto flex items-center justify-center min-h-[500px] animate-fade-in-down">
            <div class="bg-green-500 text-white rounded-full p-16 flex flex-col items-center shadow-xl">
                <svg class="checkmark-svg" xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 52 52">
                    <circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                    <path class="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                </svg>
                <h2 class="text-4xl font-bold mt-6">Order Placed!</h2>
                <p class="mt-2 text-xl">Thank you for your purchase.</p>
            </div>
        </div>
    `;
    cart = [];
    updateCartIcon();
}

// Function to render the login page with combined forms
function renderLoginPage() {
    currentPage = 'login';
    contentArea.innerHTML = `
        <div class="flex items-center justify-center p-4 min-h-[500px] animate-fade-in-down">
            <div class="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
                <h2 class="text-3xl font-bold text-center text-gray-800 mb-6">Login or Signup</h2>
                
                <!-- Login Form -->
                <form id="login-form" class="space-y-4 mb-8">
                    <h3 class="text-xl font-semibold text-gray-700">Login</h3>
                    <div>
                        <label for="login-email" class="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" id="login-email" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500">
                    </div>
                    <div>
                        <label for="login-password" class="block text-sm font-medium text-gray-700">Password</label>
                        <input type="password" id="login-password" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500">
                    </div>
                    <button type="submit" class="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                        Login
                    </button>
                </form>

                <div class="relative flex items-center justify-center my-6">
                    <span class="absolute px-3 bg-white text-gray-400 font-medium">or</span>
                    <hr class="w-full border-gray-300">
                </div>

                <!-- Signup Form -->
                <form id="signup-form" class="space-y-4">
                    <h3 class="text-xl font-semibold text-gray-700">Create an account</h3>
                    <div>
                        <label for="signup-email" class="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" id="signup-email" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500">
                    </div>
                    <div>
                        <label for="signup-password" class="block text-sm font-medium text-gray-700">Password</label>
                        <input type="password" id="signup-password" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500">
                    </div>
                    <button type="submit" class="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors">
                        Signup
                    </button>
                </form>
            </div>
        </div>
    `;

    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('signup-form').addEventListener('submit', handleSignup);
}

// Function to render the admin page
function renderAdminPage() {
    currentPage = 'admin';
    if (user && isAdminAuthenticated) {
        contentArea.innerHTML = `
            <div class="container mx-auto p-6 bg-white rounded-xl shadow-lg animate-fade-in-down">
                <h2 class="text-4xl font-extrabold text-gray-800 mb-6">Admin Panel</h2>
                <p class="text-lg text-gray-600">Welcome, Admin! This is where you can manage products and orders. (Functionality not implemented yet)</p>
            </div>
        `;
    } else {
        renderAdminAuthPage();
    }
}

// Function to handle admin authentication
function renderAdminAuthPage() {
    currentPage = 'admin-auth';
    contentArea.innerHTML = `
        <div class="flex items-center justify-center p-4 min-h-[500px] animate-fade-in-down">
            <div class="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
                <h2 class="text-3xl font-bold text-center text-gray-800 mb-6">Admin Login</h2>
                <form id="admin-auth-form" class="space-y-4">
                    <div>
                        <label for="admin-password" class="block text-sm font-medium text-gray-700">Admin Password</label>
                        <input type="password" id="admin-password" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500">
                    </div>
                    <button type="submit" class="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                        Login as Admin
                    </button>
                </form>
            </div>
        </div>
    `;
    document.getElementById('admin-auth-form').addEventListener('submit', (event) => {
        event.preventDefault();
        const enteredPassword = document.getElementById('admin-password').value;
        if (enteredPassword === ADMIN_PASSWORD) {
            isAdminAuthenticated = true;
            alertMessage('Admin access granted!', 'success');
            renderPage('admin');
        } else {
            alertMessage('Incorrect admin password.', 'error');
        }
    });
}

// Function to add a product to the cart
async function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    // Save cart to Firestore if user is logged in
    if (user) {
        try {
            await setDoc(doc(db, userCartPath), { items: cart });
            alertMessage(`${product.name} added to cart!`, 'success');
        } catch (error) {
            console.error("Error writing document: ", error);
            alertMessage("Error adding to cart. Please try again.", 'error');
        }
    } else {
        alertMessage(`${product.name} added to cart!`, 'success');
    }

    updateCartIcon();
    if (currentPage === 'cart') {
        renderCartPage();
    }
}

// Function to remove a product from the cart
async function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);

    // Update cart in Firestore if user is logged in
    if (user) {
        try {
            await setDoc(doc(db, userCartPath), { items: cart });
            alertMessage('Item removed from cart.', 'info');
        } catch (error) {
            console.error("Error removing document: ", error);
            alertMessage("Error removing item from cart. Please try again.", 'error');
        }
    } else {
        alertMessage('Item removed from cart.', 'info');
    }

    updateCartIcon();
    renderCartPage();
}

// Function to update the cart icon with the total number of items
function updateCartIcon() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (totalItems > 0) {
        cartItemCountSpan.textContent = totalItems;
        cartItemCountSpan.classList.remove('hidden');
    } else {
        cartItemCountSpan.classList.add('hidden');
    }
}

// Function to show a product detail modal
function showProductDetail(product) {
    modalContentDiv.innerHTML = `
        <div class="md:w-1/2">
            <img src="${product.imageUrl}" alt="${product.name}" class="w-full h-auto object-cover rounded-lg">
        </div>
        <div class="md:w-1/2 flex flex-col">
            <h3 class="text-3xl font-bold text-gray-800">${product.name}</h3>
            <p class="text-gray-500 text-lg mt-2">${product.category}</p>
            <p class="text-gray-700 mt-4">${product.description}</p>
            <div class="flex items-center mt-4 space-x-2">
                <span class="text-4xl font-bold text-blue-600">PKR ${product.price.toLocaleString()}</span>
            </div>
            <button id="modal-add-to-cart" class="mt-6 bg-blue-600 text-white font-bold py-3 px-6 rounded-full hover:bg-blue-700 transition-colors shadow-lg">
                Add to Cart
            </button>
            <h4 class="text-xl font-bold text-gray-800 mt-6">Reviews</h4>
            <div class="mt-2 space-y-4 max-h-48 overflow-y-auto">
                ${product.reviews.map(review => `
                    <div class="bg-gray-100 p-4 rounded-lg">
                        <div class="flex items-center text-sm font-bold text-gray-800">
                            <span>${review.userName}</span>
                            <span class="ml-2 text-yellow-500">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</span>
                        </div>
                        <p class="text-gray-600 mt-1">${review.comment}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    document.getElementById('modal-add-to-cart').addEventListener('click', () => {
        addToCart(product.id);
        productDetailModal.classList.add('hidden');
    });

    productDetailModal.classList.remove('hidden');
}

// Main render function based on page state
function renderPage(page) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    contentArea.innerHTML = '';
    switch (page) {
        case 'home':
            renderHomePage();
            break;
        case 'categories':
            renderCategoriesPage();
            break;
        case 'cart':
            renderCartPage();
            break;
        case 'admin':
            renderAdminPage();
            break;
        case 'login':
            renderLoginPage();
            break;
        case 'order-confirmation':
            renderOrderConfirmation();
            break;
        default:
            renderHomePage();
    }
}

// --- Authentication Functions ---
async function handleSignup(event) {
    event.preventDefault();
    const email = event.target['signup-email'].value;
    const password = event.target['signup-password'].value;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        user = userCredential.user;
        alertMessage('Signup successful! Welcome.', 'success');
        renderPage('home');
    } catch (error) {
        const errorMessage = error.message;
        console.error("Signup error: ", errorMessage);
        alertMessage(`Signup failed: ${errorMessage}`, 'error');
    }
}

async function handleLogin(event) {
    event.preventDefault();
    const email = event.target['login-email'].value;
    const password = event.target['login-password'].value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        user = userCredential.user;
        alertMessage('Login successful! Welcome back.', 'success');
        renderPage('home');
    } catch (error) {
        const errorMessage = error.message;
        console.error("Login error: ", errorMessage);
        alertMessage(`Login failed: ${errorMessage}`, 'error');
    }
}

function handleLogout() {
    signOut(auth).then(() => {
        alertMessage('You have been logged out.', 'info');
        renderPage('home');
    }).catch((error) => {
        console.error("Logout error: ", error);
        alertMessage('Logout failed. Please try again.', 'error');
    });
}

// Function to render the login/logout buttons
function renderAuthButtons() {
    authButtonsDiv.innerHTML = '';
    if (user) {
        // User is logged in, show logout button
        const logoutButton = document.createElement('button');
        logoutButton.id = 'nav-logout';
        logoutButton.className = 'flex items-center space-x-2 text-lg font-medium hover:text-blue-200 transition-colors';
        logoutButton.innerHTML = `<i data-lucide="log-out" class="w-5 h-5"></i><span>Logout</span>`;
        logoutButton.addEventListener('click', handleLogout);
        authButtonsDiv.appendChild(logoutButton);
        
        // Update userCartPath for Firestore
        userCartPath = `artifacts/${appId}/users/${user.uid}/cart`;
    } else {
        // No user logged in, show login/signup button
        const loginButton = document.createElement('button');
        loginButton.id = 'nav-login';
        loginButton.className = 'flex items-center space-x-2 text-lg font-medium hover:text-blue-200 transition-colors';
        loginButton.innerHTML = `<i data-lucide="user" class="w-5 h-5"></i><span>Login / Signup</span>`;
        loginButton.addEventListener('click', () => renderPage('login'));
        authButtonsDiv.appendChild(loginButton);
        
        // Use anonymous user path for cart
        userCartPath = `artifacts/${appId}/users/anonymous/cart`;
    }
    lucide.createIcons();
}

// --- Event Listeners & Initializers ---
window.onload = function () {
    // Check auth state on load
    onAuthStateChanged(auth, (authUser) => {
        if (authUser) {
            user = authUser;
            // Fetch user cart from Firestore if user is authenticated
            // This is a placeholder; real-time listener is recommended for production.
            const userCartDocRef = doc(db, userCartPath);
            getDoc(userCartDocRef).then((docSnap) => {
                if (docSnap.exists() && docSnap.data().items) {
                    cart = docSnap.data().items;
                    updateCartIcon();
                }
            });
        } else {
            user = null;
            cart = [];
            updateCartIcon();
        }
        renderAuthButtons();
        renderPage('home');
    });

    document.getElementById('home-link').addEventListener('click', () => renderPage('home'));
    document.getElementById('nav-home').addEventListener('click', () => renderPage('home'));
    document.getElementById('nav-categories').addEventListener('click', () => renderPage('categories'));
    document.getElementById('nav-cart').addEventListener('click', () => renderPage('cart'));
    document.getElementById('nav-admin').addEventListener('click', () => renderPage('admin'));
    document.getElementById('close-product-modal').addEventListener('click', () => productDetailModal.classList.add('hidden'));

    // Initial render
    renderPage('home');
    
    const firebaseConfig = {
    apiKey: "AIzaSyC...",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "...",
    messagingSenderId: "...",
    appId: "..."
};
}
