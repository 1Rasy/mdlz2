
const grid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const categoryButtons = document.querySelectorAll(".category-btn");

const modal = document.getElementById("productModal");
const variantContainer = document.getElementById("variantContainer");
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");

const cartDrawer = document.getElementById("cartDrawer");
const cartButton = document.getElementById("cartButton");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");

let currentCategory = "全部";
let currentProduct = null;
let selectedVariant = null;
let variantQuantities = {}; // 记录每个规格的数量
let cart = [];

const STORAGE_KEY = "mdlz_cart";

// 从本地存储加载购物车数据
function loadCartFromStorage() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      cart = JSON.parse(saved);
      updateCart();
    } catch (e) {
      console.error("Failed to load cart from storage:", e);
    }
  }
}

// 保存购物车数据到本地存储
function saveCartToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

function renderProducts() {

  const keyword = searchInput.value.toLowerCase();

  const filtered = products.filter(product => {

    const matchKeyword =
      product.name.toLowerCase().includes(keyword);

    const matchCategory =
      currentCategory === "全部" ||
      product.category === currentCategory;

    return matchKeyword && matchCategory;
  });

  grid.innerHTML = "";

  filtered.forEach(product => {

    grid.innerHTML += `
      <div class="card">

        <img class="card-image" src="${product.image}">

        <div class="card-body">

          <div class="card-title">
            ${product.name}
          </div>

          <div class="card-sub">
            ${product.variants.length} 个规格可选
          </div>

          <div class="price">
            ${product.variants[0].price} 起
          </div>

          <div class="tag">
            ${product.tag}
          </div>

          <button
            class="open-btn"
            onclick="openProduct(${product.id})"
          >
            查看商品
          </button>

        </div>

      </div>
    `;
  });
}

renderProducts();
loadCartFromStorage();

searchInput.addEventListener("input", renderProducts);

categoryButtons.forEach(btn => {

  btn.addEventListener("click", () => {

    categoryButtons.forEach(b =>
      b.classList.remove("active")
    );

    btn.classList.add("active");

    currentCategory = btn.dataset.category;

    renderProducts();
  });
});

function openProduct(id) {

  currentProduct = products.find(p => p.id === id);

  modalImage.src = currentProduct.image;

  modalTitle.innerText = currentProduct.name;

  variantContainer.innerHTML = "";
  variantQuantities = {};

  currentProduct.variants.forEach((variant, index) => {

    const key = `variant-${id}-${index}`;
    variantQuantities[key] = 1;

    variantContainer.innerHTML += `
      <div class="variant-item ${index === 0 ? "active" : ""}" onclick="selectVariant(${index}, '${key}')" id="variant-${index}">
        <div class="variant-info">
          ${variant.flavor} ｜ ${variant.spec} ｜ ${variant.price}
        </div>
        <div class="variant-quantity">
          <button class="qty-btn-small" onclick="decreaseVariantQty('${key}', event)">−</button>
          <span class="qty-display" id="qty-${key}">1</span>
          <button class="qty-btn-small" onclick="increaseVariantQty('${key}', event)">+</button>
        </div>
      </div>
    `;
  });

  selectedVariant = currentProduct.variants[0];

  modal.classList.remove("hidden");
}

function selectVariant(index, key) {

  document.querySelectorAll(".variant-item")
    .forEach(item => item.classList.remove("active"));

  document.getElementById(`variant-${index}`)
    .classList.add("active");

  selectedVariant = currentProduct.variants[index];
  
  // 更新模态框中的图片
  modalImage.src = selectedVariant.image;
}

function increaseVariantQty(key, event) {
  event.stopPropagation();
  variantQuantities[key]++;
  document.getElementById(`qty-${key}`).innerText = variantQuantities[key];
}

function decreaseVariantQty(key, event) {
  event.stopPropagation();
  if (variantQuantities[key] > 1) {
    variantQuantities[key]--;
    document.getElementById(`qty-${key}`).innerText = variantQuantities[key];
  }
}

document.getElementById("closeModal")
  .addEventListener("click", () => {
    modal.classList.add("hidden");
  });

document.getElementById("addToCartBtn")
  .addEventListener("click", () => {

    // 找到被选中的规格
    const activeVariant = document.querySelector(".variant-item.active");
    if (!activeVariant) return;

    // 获取该规格的数量
    const qtySpan = activeVariant.querySelector(".qty-display");
    const quantity = parseInt(qtySpan.innerText);

    // 添加到购物车
    for (let i = 0; i < quantity; i++) {
      cart.push({
        product: currentProduct.name,
        flavor: selectedVariant.flavor,
        spec: selectedVariant.spec,
        price: selectedVariant.price,
        id: Date.now() + Math.random()
      });
    }

    saveCartToStorage();
    updateCart();

    modal.classList.add("hidden");
  });

function updateCart() {

  cartCount.innerText = cart.length;

  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = '<div style="padding: 20px; text-align: center; color: #999;">意愿单是空的</div>';
    return;
  }

  // 合并相同的商品
  const itemMap = {};
  
  cart.forEach(item => {
    const key = `${item.product}_${item.flavor}_${item.spec}`;
    if (!itemMap[key]) {
      itemMap[key] = {
        product: item.product,
        flavor: item.flavor,
        spec: item.spec,
        price: item.price,
        quantity: 0,
        items: []
      };
    }
    itemMap[key].quantity++;
    itemMap[key].items.push(item.id);
  });

  Object.values(itemMap).forEach(group => {
    cartItems.innerHTML += `
      <div class="cart-item">

        <div class="cart-item-title">
          ${group.product}
        </div>

        <div class="cart-item-sub">
          ${group.flavor} ｜ ${group.spec}
        </div>

        <div class="cart-item-price">
          ${group.price} × ${group.quantity}
        </div>

        <div class="cart-item-controls">
          <button class="cart-item-btn" onclick="decreaseItemQuantity('${group.product}', '${group.flavor}', '${group.spec}')">−</button>
          <span class="cart-item-qty">${group.quantity}</span>
          <button class="cart-item-btn" onclick="increaseItemQuantity('${group.product}', '${group.flavor}', '${group.spec}')">+</button>
          <button class="cart-item-delete" onclick="removeItem('${group.product}', '${group.flavor}', '${group.spec}')">删除</button>
        </div>

      </div>
    `;
  });
}

function increaseItemQuantity(product, flavor, spec) {
  const item = cart.find(
    i => i.product === product && i.flavor === flavor && i.spec === spec
  );
  if (item) {
    cart.push({
      product: item.product,
      flavor: item.flavor,
      spec: item.spec,
      price: item.price,
      id: Date.now() + Math.random()
    });
    saveCartToStorage();
    updateCart();
  }
}

function decreaseItemQuantity(product, flavor, spec) {
  const index = cart.findIndex(
    i => i.product === product && i.flavor === flavor && i.spec === spec
  );
  if (index > -1) {
    cart.splice(index, 1);
    saveCartToStorage();
    updateCart();
  }
}

function removeItem(product, flavor, spec) {
  cart = cart.filter(
    i => !(i.product === product && i.flavor === flavor && i.spec === spec)
  );
  saveCartToStorage();
  updateCart();
}

cartButton.addEventListener("click", () => {
  cartDrawer.classList.remove("hidden");
});

document.getElementById("closeDrawer")
  .addEventListener("click", () => {
    cartDrawer.classList.add("hidden");
  });

document.getElementById("clearCart")
  .addEventListener("click", () => {
    if (cart.length === 0) {
      alert("意愿单已经是空的");
      return;
    }
    if (confirm("确定要清空所有意愿单吗？")) {
      cart = [];
      saveCartToStorage();
      updateCart();
    }
  });

document.getElementById("copyCart")
  .addEventListener("click", async () => {

    if (cart.length === 0) {
      alert("意愿单是空的，没有可复制的内容");
      return;
    }

    // 合并相同的商品
    const itemMap = {};
    
    cart.forEach(item => {
      const key = `${item.product}_${item.flavor}_${item.spec}`;
      if (!itemMap[key]) {
        itemMap[key] = {
          product: item.product,
          flavor: item.flavor,
          spec: item.spec,
          quantity: 0
        };
      }
      itemMap[key].quantity++;
    });

    const text = Object.values(itemMap).map(item =>
      `${item.product} ${item.flavor} ${item.spec} × ${item.quantity}`
    ).join("\n");

    await navigator.clipboard.writeText(text);

    alert("已复制意愿单");
  });
