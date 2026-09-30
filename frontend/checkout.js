const ORDERS_URL = 'http://localhost:3000/api/orders';
const form = document.getElementById('checkout-form');
const errorBox = document.getElementById('error');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorBox.textContent = '';

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem('cart')) || []; } catch {}

  // #38: required-field check
  if (!name || !email) { errorBox.textContent = 'Bitte Name und E-Mail ausfüllen.'; return; }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { errorBox.textContent = 'Bitte eine gültige E-Mail eingeben.'; return; }
  if (cart.length === 0) { errorBox.textContent = 'Dein Warenkorb ist leer.'; return; }

  // #39: submit, clear cart, go to confirmation
  try {
    const res = await fetch(ORDERS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, items: cart.map(i => ({ id: i.id, qty: i.qty })) })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'HTTP ' + res.status);

    localStorage.removeItem('cart');   // only after the server confirmed
    window.location.href = 'confirmation.html?order=' + data.orderId;
  } catch (err) {
    errorBox.textContent = 'Bestellung fehlgeschlagen: ' + err.message;
  }
});