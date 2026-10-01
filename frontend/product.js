const API = 'http://localhost:3000/api/products/';
const CART_KEY = 'cart';

function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}
function saveCart(cart) { localStorage.setItem(CART_KEY, JSON.stringify(cart)); }
function updateCartCounter() {
  const n = getCart().reduce((sum, i) => sum + i.quantity, 0);
  document.querySelector('.cart').textContent = 'Warenkorb (' + n + ')';
}
function addToCart(p) {
  const cart = getCart();
  const existing = cart.find(i => i.id === p.id);
  if (existing) existing.quantity += 1;
  else cart.push({ id: p.id, name: p.name, price: Number(p.price), image_url: p.image_url, quantity: 1 });
  saveCart(cart);
  updateCartCounter();
}

async function loadProduct() {
  const box = document.getElementById('product');
  const id = new URLSearchParams(location.search).get('id');
  try {
    const res = await fetch(API + encodeURIComponent(id));
    if (res.status === 404) { box.textContent = 'Produkt nicht gefunden.'; return; }
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const p = await res.json();

    document.title = p.name;
    box.innerHTML = '';

    const img = document.createElement('img');
    img.src = p.image_url; img.alt = p.name;
    img.className = 'detail-img';

    const info = document.createElement('div');
    const cat = document.createElement('p');   cat.textContent = p.category;
    const h1 = document.createElement('h1');   h1.textContent = p.name;
    const desc = document.createElement('p');  desc.textContent = p.description;
    const price = document.createElement('strong');
    price.textContent = 'CHF ' + Number(p.price).toFixed(2);
    const stock = document.createElement('p');
    stock.textContent = p.stock > 0 ? 'Auf Lager: ' + p.stock : 'Ausverkauft';

    const btn = document.createElement('button');
    btn.className = 'add-to-cart';
    btn.textContent = 'In den Warenkorb';
    btn.disabled = p.stock <= 0;
    btn.addEventListener('click', () => addToCart(p));

    info.append(cat, h1, desc, price, stock, btn);
    box.className = 'detail';
    box.append(img, info);
  } catch (err) {
    box.textContent = 'Could not load product: ' + err.message;
  }
}


loadProduct();
updateCartCounter();