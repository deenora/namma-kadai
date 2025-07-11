// ===========================
// DEENORA Instagram Cart JS
// ===========================

// Updates the cart count in the navbar (just visual, not functional cart)
function updateCartCount() {
  const countEl = document.getElementById('cart-count');
  let cart = JSON.parse(localStorage.getItem('deenoraCart')) || [];
  let totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  if (countEl) countEl.textContent = totalQty;
}

// ===============================
// MAIN FUNCTION: Add to Instagram
// ===============================
function addToCartInstagram(name, price, quantity = 1) {
  const message = `Hi Deenora! I want to order ${quantity} x ${name} priced ₹${price} each. Please let me know the next steps. Thank you!`;
  const instaUrl = 'https://www.instagram.com/deenora_clothing';

  // Open Instagram in new tab
  window.open(instaUrl, '_blank');

  // Show message to copy
  alert(`Please send this message on Instagram DM:\n\n${message}`);
}

// ===============================
// OPTIONAL: If you're using a popup modal
// ===============================
function sendPopupToInstagram() {
  const name = document.getElementById("popup-title").innerText;
  const price = parseFloat(document.getElementById("popup-price").innerText.replace(/[₹₹]/g, ""));
  const qty = parseInt(document.getElementById("popup-qty").value) || 1;

  addToCartInstagram(name, price, qty);
}

// ===============================
// Cart Page: Show all items
// ===============================
function renderCart() {
  const cartContainer = document.getElementById('full-cart-items');
  let cart = JSON.parse(localStorage.getItem("deenoraCart")) || [];

  cartContainer.innerHTML = '';

  if (cart.length === 0) {
    cartContainer.innerHTML = `<p>Your cart is empty.</p>`;
    document.getElementById('full-cart-total').innerText = '0';
    document.getElementById('cart-copy-text').value = '';
    return;
  }

  let total = 0;
  let message = "Hi Deenora! I would like to order:\n";

  cart.forEach((item, index) => {
    total += item.price * item.qty;
    message += `- ${item.qty} x ${item.name} @ ₹${item.price} = ₹${item.qty * item.price}\n`;

    const card = document.createElement('div');
    card.className = 'cart-item-card';
    card.innerHTML = `
  <img src="${item.img}" alt="${item.name}" />
  <h3>${item.name}</h3>
  <div class="price-block">
    <span class="price-label">Price:</span>
    <span class="price-value">₹${item.price}</span>
  </div>
  <div class="quantity-control">
    <button onclick="updateQty(${index}, -1)">-</button>
    <span>${item.qty}</span>
    <button onclick="updateQty(${index}, 1)">+</button>
  </div>
    `;
    cartContainer.appendChild(card);
  });

  message += `\nTotal: ₹${total}\nPlease confirm availability.`;
  document.getElementById('cart-copy-text').value = message;
  document.getElementById('full-cart-total').innerText = total.toFixed(2);
}


// Updates quantity of cart item at index by delta (+1 or -1)
function updateQty(index, delta) {
  let cart = JSON.parse(localStorage.getItem("deenoraCart")) || [];
  if (!cart[index]) return;

  cart[index].qty += delta;
  if (cart[index].qty < 1) {
    // Remove item if qty < 1
    cart.splice(index, 1);
  }

  localStorage.setItem("deenoraCart", JSON.stringify(cart));
  renderCart();
  updateCartCount();
}

// Remove item from localStorage cart
function removeCartItem(index) {
  let cart = JSON.parse(localStorage.getItem('deenoraCart')) || [];
  cart.splice(index, 1);
  localStorage.setItem("deenoraCart", JSON.stringify(cart));
  renderCart();
  updateCartCount();
}

// Send full cart order to Instagram (used on cart.html)
function proceedToInstagramOrder() {
  let cart = JSON.parse(localStorage.getItem('deenoraCart')) || [];

  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  let message = "Hi Deenora! I would like to place the following order:%0A%0A";
  cart.forEach(item => {
    message += `- ${item.qty} x ${item.name} @ ₹${item.price} = ₹${item.qty * item.price}%0A`;
  });
  let total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  message += `%0ATotal: ₹${total}%0A%0APlease confirm availability.`;

  const instaUrl = "https://www.instagram.com/deenora_clothing";

  // Open Instagram profile in new tab
  window.open(instaUrl, "_blank");

  // Show alert with order message to copy
  alert("Copy and send this message on Instagram:\n\n" + decodeURIComponent(message.replace(/%0A/g, "\n")));
}

// ===============================
// Popup functions
// ===============================
function openPopup(imgEl, title, price) {
  document.getElementById("popup-img").src = imgEl.src || imgEl;
  document.getElementById("popup-title").innerText = title;
  document.getElementById("popup-price").innerText = `₹${price}`;
  document.getElementById("popup-qty").value = 1;
  document.getElementById("popup-overlay").style.display = "flex";
}

function closePopup() {
  document.getElementById("popup-overlay").style.display = "none";
}

// Add from popup to cart
function addPopupToCart() {
  const name = document.getElementById("popup-title").innerText;
  const price = parseFloat(document.getElementById("popup-price").innerText.replace(/[₹₹]/g, ""));
  const qty = parseInt(document.getElementById("popup-qty").value);
  const img = document.getElementById("popup-img").src;

  let cart = JSON.parse(localStorage.getItem("deenoraCart")) || [];

  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ name, price, qty, img });
  }

  localStorage.setItem("deenoraCart", JSON.stringify(cart));
  updateCartCount();
  alert(`${qty} x ${name} added to cart!`);
  closePopup();
}

// Add direct from product button (without popup)
function addToCartDirect(name, price, img) {
  let cart = JSON.parse(localStorage.getItem("deenoraCart")) || [];

  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ name, price, qty: 1, img });
  }

  localStorage.setItem("deenoraCart", JSON.stringify(cart));
  updateCartCount();
  alert(`1 x ${name} added to cart!`);
}

// ===============================
// Initialize on page load
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  renderCart();
});
function updatePopupMessageBox() {
  const name = document.getElementById("popup-title").innerText;
  const price = parseFloat(document.getElementById("popup-price").innerText.replace(/[₹₹]/g, ""));
  const qty = parseInt(document.getElementById("popup-qty").value);
  const message = `Hi Deenora! I want to order ${qty} x ${name} (₹${price} each). Please let me know the next steps.`;

  const messageBox = document.getElementById("insta-message");
  if (messageBox) {
    messageBox.value = message;
  }
}

// Call when popup opens and when quantity changes
function openPopup(imgEl, title, price) {
  document.getElementById("popup-img").src = imgEl.src;
  document.getElementById("popup-title").innerText = title;
  document.getElementById("popup-price").innerText = `₹${price}`;
  document.getElementById("popup-qty").value = 1;
  document.getElementById("popup-overlay").style.display = "flex";
  updatePopupMessageBox();
}

function decreaseQty() {
  const input = document.getElementById("popup-qty");
  if (parseInt(input.value) > 1) input.value--;
  updatePopupMessageBox();
}

function increaseQty() {
  const input = document.getElementById("popup-qty");
  input.value++;
  updatePopupMessageBox();
}
// Update cart count on all pages
function updateCartCount() {
  const countEl = document.getElementById('cart-count');
  let cart = JSON.parse(localStorage.getItem('deenoraCart')) || [];
  let totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  countEl.textContent = totalQty;
}

// For popup Instagram message
function addToCartInstagram(name, price, quantity = 1) {
  const message = `Hi Deenora! I want to order ${quantity} x ${name} priced ₹${price} each.`;
  const instaUrl = 'https://www.instagram.com/deenora_clothing';
  window.open(instaUrl, '_blank');
  alert("Send this on Instagram:\n\n" + message);
}

// Popup send button
function sendPopupToInstagram() {
  const name = document.getElementById("popup-title").innerText;
  const price = parseFloat(document.getElementById("popup-price").innerText.replace(/[₹₹]/g, ""));
  const qty = parseInt(document.getElementById("popup-qty").value);
  addToCartInstagram(name, price, qty);
}

// Popup cart button
function addPopupToCart() {
  const name = document.getElementById("popup-title").innerText;
  const price = parseFloat(document.getElementById("popup-price").innerText.replace(/[₹₹]/g, ""));
  const qty = parseInt(document.getElementById("popup-qty").value);
  const img = document.getElementById("popup-img").src;

  let cart = JSON.parse(localStorage.getItem("deenoraCart")) || [];

  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ name, price, qty, img });
  }

  localStorage.setItem("deenoraCart", JSON.stringify(cart));
  updateCartCount();
  alert(`${qty} x ${name} added to cart!`);
  closePopup();
}

// Quantity handlers
function increaseQty() {
  const input = document.getElementById("popup-qty");
  input.value++;
}
function decreaseQty() {
  const input = document.getElementById("popup-qty");
  if (parseInt(input.value) > 1) input.value--;
}

// Popup open/close
function openPopup(imgEl, title, price) {
  document.getElementById("popup-img").src = imgEl.src;
  document.getElementById("popup-title").innerText = title;
  document.getElementById("popup-price").innerText = `₹${price}`;
  document.getElementById("popup-qty").value = 1;
  document.getElementById("popup-overlay").style.display = "flex";
}
function closePopup() {
  document.getElementById("popup-overlay").style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
});
// Open Popup
function openPopup(imgPath, title, price) {
  document.getElementById("popup-img").src = imgPath;
  document.getElementById("popup-title").innerText = title;
  document.getElementById("popup-price").innerText = `₹${price}`;
  document.getElementById("popup-qty").value = 1;
  document.getElementById("popup-overlay").style.display = "flex";
  updatePopupMessageBox(); // optional: update the message box too
}



// Close Popup
document.querySelector('.close-btn').addEventListener('click', () => {
  document.querySelector('.popup-overlay').style.display = 'none';
});
// Example function when clicking a product
function openProductPopup(productElement) {
  const imageSrc = productElement.querySelector('img')?.src;
  const productName = productElement.querySelector('h3')?.textContent;
  const price = productElement.querySelector('.price')?.textContent;

  document.querySelector('.popup-overlay').style.display = 'flex';

  document.querySelector('.popup-card img').src = imageSrc;
  document.querySelector('.popup-card h3').textContent = productName;
  document.querySelector('.popup-card p').textContent = price;
}    