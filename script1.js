const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    description: "Premium noise-cancelling wireless headphones",
    price: 199.99,
    image: "🎧",
    category: "audio",
  },
  {
    id: 2,
    name: "Smart Watch",
    description: "Advanced fitness tracking with heart rate monitor",
    price: 299.99,
    image: "⌚",
    category: "wearables",
  },
  {
    id: 3,
    name: "Gaming Laptop",
    description: "High-performance laptop with RTX graphics",
    price: 1299.99,
    image: "💻",
    category: "computers",
  },
  {
    id: 4,
    name: "Smartphone",
    description: "Latest flagship smartphone with triple camera system",
    price: 899.99,
    image: "📱",
    category: "mobile",
  },
];

let cart = [];
let currentFilter = "all";

function renderProducts(productsToRender = products) {
  const grid = document.getElementById("productsGrid");
  grid.innerHTML = "";

  productsToRender.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <div class="product-image">${product.image}</div>
      <div class="product-title">${product.name}</div>
      <div class="product-description">${product.description}</div>
      <div class="product-price">₹${product.price}</div>
      <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
    `;
    grid.appendChild(card);
  });
}

function addToCart(id) {
  const product = products.find((p) => p.id === id);
  const existing = cart.find((item) => item.id === id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  updateCartCount();
  showToast(`${product.name} added to cart`);
}

function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById("cartCount").textContent = count;
}

function renderCartItems() {
  const cartItems = document.getElementById("cartItems");
  if (cart.length === 0) {
    cartItems.innerHTML = '<div class="empty-cart">Cart is empty</div>';
    document.getElementById("cartTotal").textContent = "Total: ₹0.00";
    return;
  }

  let total = 0;
  cartItems.innerHTML = "";
  cart.forEach((item) => {
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <div>
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">₹${item.price}</div>
      </div>
      <div>
        <button onclick="changeQuantity(${item.id}, -1)">-</button>
        <span>${item.quantity}</span>
        <button onclick="changeQuantity(${item.id}, 1)">+</button>
      </div>
    `;
    total += item.price * item.quantity;
    cartItems.appendChild(div);
  });

  document.getElementById("cartTotal").textContent = `Total: ₹${total.toFixed(
    2
  )}`;
}

function changeQuantity(id, delta) {
  const item = cart.find((i) => i.id === id);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) cart = cart.filter((i) => i.id !== id);
  renderCartItems();
  updateCartCount();
}

function toggleCart() {
  const modal = document.getElementById("cartModal");
  modal.style.display = modal.style.display === "flex" ? "none" : "flex";
  if (modal.style.display === "flex") renderCartItems();
}

function searchProducts() {
  const term = document.getElementById("searchInput").value.toLowerCase();
  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(term) ||
      p.description.toLowerCase().includes(term)
  );
  renderProducts(filtered);
}

function filterByCategory(category) {
  currentFilter = category;
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  event.target.classList.add("active");

  if (category === "all") {
    renderProducts();
  } else {
    renderProducts(products.filter((p) => p.category === category));
  }
}

function checkout() {
  if (cart.length === 0) {
    showToast("Cart is empty!");
    return;
  }
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  showToast(`Checkout complete! Total: ₹${total.toFixed(2)}`);
  cart = [];
  updateCartCount();
  renderCartItems();
  toggleCart();
}

function showToast(msg) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = msg;
  document.getElementById("toastContainer").appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

document.addEventListener("DOMContentLoaded", renderProducts);
