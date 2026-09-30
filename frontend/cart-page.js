function renderCart() {
  const cart = getCart();
  const container = document.getElementById("cart-items");
  const totalElement = document.getElementById("cart-total");

    if (cart.length === 0) {
    container.innerHTML = `<p class="cart-empty">Dein Warenkorb ist leer. <a href="/">Weiter shoppen</a></p>`;
    totalElement.textContent = formatPrice(0);
    document.getElementById("checkout-button").style.display = "none";
    return;
  }

  container.innerHTML = "";

  for (const item of cart) {
    container.innerHTML += `
      <div class="cart-item">
        <img src="${item.image_url}" alt="${item.name}">
        <div class="cart-item-info">
          <h3>${item.name}</h3>
          <p>${formatPrice(item.price)}</p>
        </div>
        <div class="quantity">
          <button onclick="changeQuantity(${item.id}, -1); renderCart();">−</button>
          <span>${item.quantity}</span>
          <button onclick="changeQuantity(${item.id}, 1); renderCart();">+</button>
        </div>
        <p class="cart-item-total">${formatPrice(item.price * item.quantity)}</p>
        <button class="remove" onclick="removeFromCart(${item.id}); renderCart();">Entfernen</button>
      </div>
    `;
  }

    totalElement.textContent = formatPrice(getCartTotal());
  document.getElementById("checkout-button").style.display = "block";
}

renderCart();