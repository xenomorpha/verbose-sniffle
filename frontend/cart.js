// ============================================
// cart.js — shared cart functions
// Used by: app.js (US2, add to cart) and cart-page.js (US3, cart page)
//
// The cart is stored in the browser (localStorage) under the key "cart".
// Format: a list of items like
// { id: 3, name: "Heavy Hoodie Graphite", price: 89, image_url: "/images/hoodie.jpg", quantity: 2 }
// ============================================

const CART_KEY = "cart";

// Read the cart from localStorage (empty list if nothing is saved yet)
function getCart() {
  const saved = localStorage.getItem(CART_KEY);
  return saved ? JSON.parse(saved) : [];
}

// Save the cart and refresh the counter in the header
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCounter();
}

// US2: add a product from the API (or +1 if it is already in the cart)
function addToCart(product) {
  const cart = getCart();
  const existing = cart.find((item) => item.id === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image_url: product.image_url,
      quantity: 1,
    });
  }

  saveCart(cart);
}

// US3: change quantity by +1 or -1 (removes the item when it reaches 0)
function changeQuantity(id, change) {
  let cart = getCart();
  const item = cart.find((item) => item.id === id);
  if (!item) return;

  item.quantity += change;
  if (item.quantity <= 0) {
    cart = cart.filter((item) => item.id !== id);
  }

  saveCart(cart);
}

// US3: remove an item completely
function removeFromCart(id) {
  const cart = getCart().filter((item) => item.id !== id);
  saveCart(cart);
}

// Empty the cart (US4: after the order is placed)
function clearCart() {
  saveCart([]);
}

// Total number of pieces, e.g. 2 hoodies + 1 bag = 3
function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
}

// Total price of the cart
function getCartTotal() {
  return getCart().reduce((sum, item) => sum + item.price * item.quantity, 0);
}

// Format a number as a German price: 89 -> "89,00 €"
function formatPrice(value) {
  return Number(value).toLocaleString("de-DE", { style: "currency", currency: "EUR" });
}

// Update the counter in the header (element with id="cart-counter")
function updateCartCounter() {
  const counter = document.getElementById("cart-counter");
  if (counter) {
    counter.textContent = getCartCount();
  }
}

// Show the correct counter as soon as any page loads
document.addEventListener("DOMContentLoaded", updateCartCounter);