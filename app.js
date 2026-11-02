// Product Catalog Data
const PRODUCTS = [
  {
    id: 1,
    name: "Aura Studio Wireless ANC Headphones",
    category: "Audio",
    price: 249.00,
    originalPrice: 299.00,
    rating: 4.9,
    reviews: 128,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
    badge: "Bestseller",
    description: "Custom titanium drivers with active noise cancellation and 40h battery."
  },
  {
    id: 2,
    name: "Minimalist Mechanical Keyboard 75%",
    category: "Desk Setup",
    price: 139.00,
    originalPrice: 169.00,
    rating: 4.8,
    reviews: 94,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80",
    badge: "Hot",
    description: "Gateron Pro switches, hot-swappable PCB, and CNC aluminum chassis."
  },
  {
    id: 3,
    name: "Ultra-Thin OLED Smart Fitness Watch",
    category: "Wearables",
    price: 199.00,
    originalPrice: 229.00,
    rating: 4.7,
    reviews: 210,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
    badge: null,
    description: "Heart-rate tracking, ECG sensor, GPS tracking with 7-day battery life."
  },
  {
    id: 4,
    name: "Retro 35mm Rangefinder Digital Camera",
    category: "Photography",
    price: 689.00,
    originalPrice: 799.00,
    rating: 5.0,
    reviews: 42,
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80",
    badge: "Editor's Choice",
    description: "Full-frame sensor packed into vintage rangefinder brass body."
  },
  {
    id: 5,
    name: "Magnetic MagSafe Power Bank 10,000mAh",
    category: "Desk Setup",
    price: 49.00,
    originalPrice: 65.00,
    rating: 4.6,
    reviews: 180,
    image: "https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=600&auto=format&fit=crop&q=80",
    badge: "Sale",
    description: "Slim 15W wireless charging with kickstand and aluminum finish."
  },
  {
    id: 6,
    name: "Hi-Res Spatial Audio Earbuds Pro",
    category: "Audio",
    price: 159.00,
    originalPrice: 189.00,
    rating: 4.8,
    reviews: 77,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80",
    badge: null,
    description: "Adaptive spatial audio with transparency mode and wireless charging case."
  },
  {
    id: 7,
    name: "Full-Grain Italian Leather Everyday Sling",
    category: "Wearables",
    price: 119.00,
    originalPrice: 149.00,
    rating: 4.9,
    reviews: 63,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=80",
    badge: "Popular",
    description: "Weatherproof zip pockets, quick-release magnetic buckle, fits 11' iPad."
  },
  {
    id: 8,
    name: "Solid Walnut Monitor Stand & Riser",
    category: "Desk Setup",
    price: 89.00,
    originalPrice: 110.00,
    rating: 4.7,
    reviews: 51,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80",
    badge: null,
    description: "Handcrafted sustainable North American walnut with cork protection feet."
  }
];

// App State
let currentCategory = "All";
let searchQuery = "";
let currentSort = "popular";
let cart = JSON.parse(localStorage.getItem("trendvault_cart") || "[]");

// DOM Elements
const productGrid = document.getElementById("product-grid");
const emptyState = document.getElementById("empty-state");
const searchInput = document.getElementById("search-input");
const sortSelect = document.getElementById("sort-select");
const cartBtn = document.getElementById("cart-btn");
const closeCartBtn = document.getElementById("close-cart-btn");
const cartDrawerOverlay = document.getElementById("cart-drawer-overlay");
const cartDrawer = document.getElementById("cart-drawer");
const cartBadge = document.getElementById("cart-badge");
const drawerItemCount = document.getElementById("drawer-item-count");
const cartItemsContainer = document.getElementById("cart-items-container");
const cartSubtotal = document.getElementById("cart-subtotal");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const checkoutModal = document.getElementById("checkout-modal");
const orderNumberEl = document.getElementById("order-number");
const toast = document.getElementById("toast");
const toastMsg = document.getElementById("toast-message");

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  updateCartUI();
  lucide.createIcons();
});

// Category Filter
function filterCategory(cat) {
  currentCategory = cat;
  const buttons = document.querySelectorAll("#category-tabs button");
  buttons.forEach(btn => {
    if (btn.textContent.trim().includes(cat) || (cat === "All" && btn.textContent.trim().includes("All"))) {
      btn.className = "cat-btn active-tab px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all";
    } else {
      btn.className = "cat-btn inactive-tab px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all";
    }
  });
  renderProducts();
}

// Search
searchInput.addEventListener("input", (e) => {
  searchQuery = e.target.value.toLowerCase().trim();
  renderProducts();
});

// Sort
sortSelect.addEventListener("change", (e) => {
  currentSort = e.target.value;
  renderProducts();
});

// Render Products
function renderProducts() {
  let filtered = PRODUCTS.filter(p => {
    const matchCat = currentCategory === "All" || p.category === currentCategory;
    const matchSearch = p.name.toLowerCase().includes(searchQuery) || p.description.toLowerCase().includes(searchQuery);
    return matchCat && matchSearch;
  });

  // Sort
  if (currentSort === "price-low") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (currentSort === "price-high") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (currentSort === "rating") {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  if (filtered.length === 0) {
    productGrid.innerHTML = "";
    emptyState.classList.remove("hidden");
  } else {
    emptyState.classList.add("hidden");
    productGrid.innerHTML = filtered.map(p => `
      <div class="product-card bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col group">
        <div class="relative aspect-square overflow-hidden bg-slate-100">
          <img
            src="${p.image}"
            alt="${p.name}"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 select-none"
            loading="lazy"
          />
          ${p.badge ? `
            <span class="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-full border border-white/10">
              ${p.badge}
            </span>
          ` : ""}
        </div>

        <div class="p-4 flex-1 flex flex-col justify-between space-y-3">
          <div class="space-y-1">
            <div class="flex items-center justify-between text-xs text-slate-400">
              <span>${p.category}</span>
              <div class="flex items-center text-amber-500 font-semibold gap-1">
                <i data-lucide="star" class="w-3.5 h-3.5 fill-current"></i>
                <span>${p.rating}</span>
                <span class="text-slate-400 font-normal">(${p.reviews})</span>
              </div>
            </div>
            <h3 class="font-semibold text-slate-900 text-sm line-clamp-1 group-hover:text-brand-600 transition-colors">
              ${p.name}
            </h3>
            <p class="text-xs text-slate-500 line-clamp-2 leading-relaxed">
              ${p.description}
            </p>
          </div>

          <div class="flex items-center justify-between pt-2 border-t border-slate-100">
            <div>
              <span class="text-base font-bold text-slate-900">$${p.price.toFixed(2)}</span>
              ${p.originalPrice ? `<span class="text-xs text-slate-400 line-through ml-1.5">$${p.originalPrice.toFixed(2)}</span>` : ""}
            </div>
            <button
              onclick="addToCart(${p.id})"
              class="flex items-center space-x-1.5 bg-slate-900 hover:bg-brand-600 text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer"
            >
              <i data-lucide="plus" class="w-3.5 h-3.5"></i>
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>
    `).join("");
  }

  lucide.createIcons();
}

// Cart Functions
function addToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart();
  updateCartUI();
  showToast(`Added "${product.name.slice(0, 22)}..." to cart`);
}

function updateQuantity(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    cart = cart.filter(i => i.id !== productId);
  }

  saveCart();
  updateCartUI();
}

function removeFromCart(productId) {
  cart = cart.filter(i => i.id !== productId);
  saveCart();
  updateCartUI();
}

function saveCart() {
  localStorage.setItem("trendvault_cart", JSON.stringify(cart));
}

function updateCartUI() {
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  cartBadge.textContent = totalItems;
  drawerItemCount.textContent = `${totalItems} items`;
  cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
  cartTotal.textContent = `$${subtotal.toFixed(2)}`;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="h-full flex flex-col items-center justify-center text-center space-y-3 py-16">
        <div class="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
          <i data-lucide="shopping-cart" class="w-7 h-7"></i>
        </div>
        <p class="font-medium text-slate-700 text-sm">Your cart is empty</p>
        <p class="text-xs text-slate-400 max-w-xs">Explore our curated collection and add your favorite gear.</p>
      </div>
    `;
    checkoutBtn.disabled = true;
  } else {
    checkoutBtn.disabled = false;
    cartItemsContainer.innerHTML = cart.map(item => `
      <div class="flex items-center space-x-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
        <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded-xl bg-slate-200" />
        <div class="flex-1 min-w-0">
          <h4 class="font-semibold text-slate-800 text-xs truncate">${item.name}</h4>
          <span class="text-xs font-bold text-slate-900">$${item.price.toFixed(2)}</span>
          <div class="flex items-center space-x-2 mt-2">
            <button
              onclick="updateQuantity(${item.id}, -1)"
              class="w-6 h-6 rounded-lg bg-white border border-slate-200 text-slate-600 flex items-center justify-center hover:bg-slate-100 text-xs font-bold"
            >
              -
            </button>
            <span class="text-xs font-semibold text-slate-800 w-4 text-center">${item.quantity}</span>
            <button
              onclick="updateQuantity(${item.id}, 1)"
              class="w-6 h-6 rounded-lg bg-white border border-slate-200 text-slate-600 flex items-center justify-center hover:bg-slate-100 text-xs font-bold"
            >
              +
            </button>
          </div>
        </div>
        <button
          onclick="removeFromCart(${item.id})"
          class="text-slate-400 hover:text-red-500 p-1 transition-colors"
          title="Remove"
        >
          <i data-lucide="trash-2" class="w-4 h-4"></i>
        </button>
      </div>
    `).join("");
  }

  lucide.createIcons();
}

// Drawer Toggle
cartBtn.addEventListener("click", () => {
  cartDrawerOverlay.classList.remove("opacity-0", "pointer-events-none");
  cartDrawer.classList.remove("translate-x-full");
});

closeCartBtn.addEventListener("click", closeDrawer);
cartDrawerOverlay.addEventListener("click", (e) => {
  if (e.target === cartDrawerOverlay) closeDrawer();
});

function closeDrawer() {
  cartDrawerOverlay.classList.add("opacity-0", "pointer-events-none");
  cartDrawer.classList.add("translate-x-full");
}

// Checkout Flow
checkoutBtn.addEventListener("click", () => {
  closeDrawer();
  const randomOrder = "TV-" + Math.floor(1000 + Math.random() * 9000);
  orderNumberEl.textContent = "#" + randomOrder;

  // Clear cart
  cart = [];
  saveCart();
  updateCartUI();

  // Show confirmation modal
  checkoutModal.classList.remove("opacity-0", "pointer-events-none");
  checkoutModal.querySelector("div").classList.remove("scale-95");
});

function closeCheckoutModal() {
  checkoutModal.classList.add("opacity-0", "pointer-events-none");
  checkoutModal.querySelector("div").classList.add("scale-95");
}

// Toast
function showToast(msg) {
  toastMsg.textContent = msg;
  toast.classList.remove("translate-y-20", "opacity-0");
  setTimeout(() => {
    toast.classList.add("translate-y-20", "opacity-0");
  }, 2200);
}
