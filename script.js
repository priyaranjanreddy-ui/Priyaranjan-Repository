const products = [
  {
    id: 1,
    title: "Cloud-Knit Layer",
    category: "apparel",
    price: 92,
    badge: "Limited",
    image:
      "https://images.unsplash.com/photo-1528701800489-20be3c0da6c1?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 2,
    title: "Ceramic Calm Set",
    category: "home",
    price: 58,
    badge: "Bestseller",
    image:
      "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 3,
    title: "Botanical Mood Mist",
    category: "wellness",
    price: 42,
    badge: "Vegan",
    image:
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 4,
    title: "Weekend Carryall",
    category: "apparel",
    price: 128,
    badge: "New",
    image:
      "https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 5,
    title: "Glow Essentials Kit",
    category: "wellness",
    price: 64,
    badge: "Gift-ready",
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 6,
    title: "Sculpted Vase Duo",
    category: "home",
    price: 76,
    badge: "Handmade",
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=700&q=80",
  },
];

const productGrid = document.getElementById("productGrid");
const filterButtons = document.querySelectorAll(".filter-btn");
const cartCountLabel = document.getElementById("cartCount");
const newsletterForm = document.querySelector(".newsletter__form");

let cartCount = 0;

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

const createProductCard = (item) => {
  const article = document.createElement("article");
  article.className = "product-card";
  article.setAttribute("data-category", item.category);

  article.innerHTML = `
    <div class="product-card__image" style="background-image:url('${item.image}')"></div>
    <div class="product-card__meta">
      <p>${item.title}</p>
      <span class="badge">${item.badge}</span>
    </div>
    <div class="product-card__meta">
      <span class="price">${formatCurrency(item.price)}</span>
      <button class="secondary-btn add-btn" data-id="${item.id}">Add</button>
    </div>
  `;

  return article;
};

const renderProducts = (category = "all") => {
  productGrid.innerHTML = "";
  const fragment = document.createDocumentFragment();

  products
    .filter((item) => category === "all" || item.category === category)
    .forEach((item) => fragment.appendChild(createProductCard(item)));

  productGrid.appendChild(fragment);
};

const handleFilter = (event) => {
  const button = event.currentTarget;
  const category = button.dataset.filter;

  filterButtons.forEach((btn) => btn.classList.remove("active"));
  button.classList.add("active");

  renderProducts(category);
};

const updateCartCount = () => {
  cartCountLabel.textContent = cartCount;
};

const handleAddToCart = (event) => {
  const button = event.target.closest(".add-btn");
  if (!button) return;

  const productId = Number(button.dataset.id);
  const product = products.find((item) => item.id === productId);
  if (!product) return;

  cartCount += 1;
  updateCartCount();

  button.textContent = "Added";
  button.disabled = true;

  setTimeout(() => {
    button.textContent = "Add";
    button.disabled = false;
  }, 1400);
};

const handleNewsletterSubmit = (event) => {
  event.preventDefault();
  const emailInput = event.target.querySelector("input[type='email']");

  if (!emailInput.value.trim()) {
    emailInput.focus();
    return;
  }

  const previousLabel = event.submitter.textContent;
  event.submitter.textContent = "Thanks!";
  setTimeout(() => {
    event.submitter.textContent = previousLabel;
  }, 1600);

  emailInput.value = "";
};

renderProducts();
filterButtons.forEach((btn) => btn.addEventListener("click", handleFilter));
productGrid.addEventListener("click", handleAddToCart);
newsletterForm.addEventListener("submit", handleNewsletterSubmit);
