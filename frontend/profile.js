const ORDERS_API = "http://localhost:3000/api/orders";

const STATUS_LABELS = {
  processing: "In Bearbeitung",
  shipped: "Versendet",
  delivered: "Zugestellt",
};

// Ask the backend for one order (needs number + e-mail)
async function fetchOrder(orderId, email) {
  const res = await fetch(`${ORDERS_API}/${orderId}?email=${encodeURIComponent(email)}`);
  if (!res.ok) return null;
  return res.json();
}

// Show all orders remembered in this browser
async function renderMyOrders() {
  const container = document.getElementById("my-orders");
  const myOrders = getMyOrders();

  if (myOrders.length === 0) {
    container.innerHTML = `<p class="cart-empty">Du hast noch keine Bestellungen. <a href="/">Jetzt shoppen</a></p>`;
    return;
  }

  container.innerHTML = "";

  for (const { orderId, email } of myOrders) {
    const order = await fetchOrder(orderId, email);
    if (!order) continue;

    const items = order.items
      .map((i) => `<li>${i.name} × ${i.quantity}</li>`)
      .join("");

    container.innerHTML += `
      <article class="order-card">
        <div class="order-head">
          <div>
            <h3>Bestellung #${order.id}</h3>
            <p class="order-date">${new Date(order.created_at).toLocaleDateString("de-CH")}</p>
          </div>
          <span class="status status-${order.status}">${STATUS_LABELS[order.status]}</span>
        </div>
        <ul class="order-items">${items}</ul>
        <p class="order-total">Total ${formatPrice(order.total)}</p>
      </article>
    `;
  }
}

// "Bestellung suchen": find an order by number + e-mail and add it to the list
document.getElementById("lookup-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = Number(document.getElementById("lookup-id").value);
  const email = document.getElementById("lookup-email").value.trim().toLowerCase();
  const errorBox = document.getElementById("lookup-error");

  const order = await fetchOrder(id, email);
  if (!order) {
    errorBox.textContent = "Keine Bestellung mit dieser Nummer und E-Mail gefunden.";
    return;
  }

  errorBox.textContent = "";
  saveMyOrder(id, email);
  e.target.reset();
  renderMyOrders();
});

renderMyOrders();
