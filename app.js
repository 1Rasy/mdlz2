
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
let cart = [];

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

  currentProduct.variants.forEach((variant, index) => {

    variantContainer.innerHTML += `
      <button
        class="variant-btn ${index === 0 ? "active" : ""}"
        onclick="selectVariant(${index})"
        id="variant-${index}"
      >
        ${variant.flavor} ｜ ${variant.spec} ｜ ${variant.price}
      </button>
    `;
  });

  selectedVariant = currentProduct.variants[0];

  modal.classList.remove("hidden");
}

function selectVariant(index) {

  document.querySelectorAll(".variant-btn")
    .forEach(btn => btn.classList.remove("active"));

  document.getElementById(`variant-${index}`)
    .classList.add("active");

  selectedVariant = currentProduct.variants[index];
  
  // 更新模态框中的图片
  modalImage.src = selectedVariant.image;
}

document.getElementById("closeModal")
  .addEventListener("click", () => {
    modal.classList.add("hidden");
  });

document.getElementById("addToCartBtn")
  .addEventListener("click", () => {

    cart.push({
      product: currentProduct.name,
      flavor: selectedVariant.flavor,
      spec: selectedVariant.spec
    });

    updateCart();

    modal.classList.add("hidden");
  });

function updateCart() {

  cartCount.innerText = cart.length;

  cartItems.innerHTML = "";

  cart.forEach(item => {

    cartItems.innerHTML += `
      <div class="cart-item">

        <div class="cart-item-title">
          ${item.product}
        </div>

        <div class="cart-item-sub">
          ${item.flavor} ｜ ${item.spec}
        </div>

      </div>
    `;
  });
}

cartButton.addEventListener("click", () => {
  cartDrawer.classList.remove("hidden");
});

document.getElementById("closeDrawer")
  .addEventListener("click", () => {
    cartDrawer.classList.add("hidden");
  });

document.getElementById("copyCart")
  .addEventListener("click", async () => {

    const text = cart.map(item =>
      `${item.product} ${item.flavor} ${item.spec}`
    ).join("\n");

    await navigator.clipboard.writeText(text);

    alert("已复制意愿单");
  });
