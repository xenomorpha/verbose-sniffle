// ============================================
// cart.js — shared functions for the whole shop
// Load this file BEFORE any other script on every page.
//
// Cart is stored in localStorage under "cart":
// [{ id, name, price, image_url, quantity }, ...]
// ============================================

const CART_KEY = "cart";

// Read the cart (empty list if nothing is saved yet)
function getCart() {
  try {
    const saved = localStorage.getItem(CART_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

// Save the cart and refresh the counter in the header
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCounter();
}

// Add a product from the API (or +1 if it is already in the cart)
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

// Change quantity by +1 or -1 (removes the item when it reaches 0)
function changeQuantity(id, change) {
  let cart = getCart();
  const item = cart.find((entry) => entry.id === id);
  if (!item) return;

  item.quantity += change;
  if (item.quantity <= 0) {
    cart = cart.filter((entry) => entry.id !== id);
  }

  saveCart(cart);
}

// Remove an item completely
function removeFromCart(id) {
  const cart = getCart().filter((item) => item.id !== id);
  saveCart(cart);
}

// Empty the cart (after an order is placed)
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

// Format a number as a Swiss price: 89 -> "CHF 89.00"
function formatPrice(value) {
  return Number(value).toLocaleString("de-CH", { style: "currency", currency: "CHF" });
}

// Update the counter in the header (element with id="cart-counter")
function updateCartCounter() {
  const counter = document.getElementById("cart-counter");
  if (counter) {
    counter.textContent = getCartCount();
  }
}

// ============================================
// My orders: remembered in this browser after checkout (used by profile page)
// Stored in localStorage under "myOrders": [{ orderId, email }, ...]
// ============================================
const MY_ORDERS_KEY = "myOrders";

function getMyOrders() {
  try {
    const saved = localStorage.getItem(MY_ORDERS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveMyOrder(orderId, email) {
  const orders = getMyOrders();
  const alreadySaved = orders.some((o) => o.orderId === orderId);
  if (!alreadySaved) {
    orders.unshift({ orderId, email });
    localStorage.setItem(MY_ORDERS_KEY, JSON.stringify(orders));
  }
}

// Show the correct counter as soon as any page loads
document.addEventListener("DOMContentLoaded", updateCartCounter);