const products = [
  {
    id: "mod-desk",
    name: "Orbit Desk System",
    category: "workspace",
    price: 640,
    rating: 4.9,
    ship: "Fast ship",
    image:
      "https://images.unsplash.com/photo-1487017159836-4e23ece2e4cf?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "sup-chair",
    name: "Cloudform Chair",
    category: "workspace",
    price: 320,
    rating: 4.7,
    ship: "Made to order",
    image:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "travel-kit",
    name: "Transit Ritual Kit",
    category: "travel",
    price: 118,
    rating: 4.8,
    ship: "Fast ship",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "brew-set",
    name: "Steady Brew Set",
    category: "home",
    price: 92,
    rating: 4.6,
    ship: "Ships this week",
    image:
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "well-pad",
    name: "Reset Floor Cushion",
    category: "wellness",
    price: 210,
    rating: 4.5,
    ship: "Fast ship",
    image:
      "https://images.unsplash.com/photo-1455778977538-0459e1b7413c?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "lamp",
    name: "Glowform Table Lamp",
    category: "home",
    price: 280,
    rating: 4.9,
    ship: "Limited drop",
    image:
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80",
  },
];

const state = {
  search: "",
  category: "all",
  sort: "featured",
  cart: [],
};

const els = {
  navToggle: document.querySelector(".nav-toggle"),
  navMenu: document.querySelector(".site-nav ul"),
  productGrid: document.querySelector("[data-product-grid]"),
  searchInput: document.querySelector("[data-search]"),
  categorySelect: document.querySelector("[data-filter-category]"),
  sortSelect: document.querySelector("[data-sort]"),
  cartButton: document.querySelector("[data-cart-toggle]"),
  cartPanel: document.querySelector("[data-cart-panel]"),
  cartClose: document.querySelector("[data-cart-close]"),
  cartItems: document.querySelector("[data-cart-items]"),
  cartTotal: document.querySelector("[data-cart-total]"),
  cartCount: document.querySelector("[data-cart-count]"),
  checkoutButton: document.querySelector("[data-checkout]"),
  year: document.querySelector("[data-year]"),
  filterShortcut: document.querySelector("[data-open-filter]"),
  ctaForm: document.querySelector(".cta-form"),
  formStatus: document.querySelector(".form-status"),
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);

const renderProducts = () => {
  if (!els.productGrid) return;

  const filtered = products
    .filter((product) => {
      const matchesCategory =
        state.category === "all" || product.category === state.category;
      const matchesSearch = product.name
        .toLowerCase()
        .includes(state.search.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (state.sort === "price-asc") return a.price - b.price;
      if (state.sort === "price-desc") return b.price - a.price;
      return b.rating - a.rating;
    });

  els.productGrid.innerHTML = filtered
    .map(
      (product) => `
        <article class="product-card">
          <figure>
            <img src="${product.image}" alt="${product.name}" loading="lazy" />
          </figure>
          <div>
            <p class="eyebrow">${product.category}</p>
            <h3>${product.name}</h3>
            <p>${product.ship}</p>
          </div>
          <div class="product-meta">
            <span>${formatCurrency(product.price)}</span>
            <span>⭐ ${product.rating.toFixed(1)}</span>
          </div>
          <button class="btn btn-primary" data-add="${product.id}">
            Add to bag
          </button>
        </article>
      `,
    )
    .join("");
};

const updateCartUI = () => {
  if (!els.cartItems) return;

  if (state.cart.length === 0) {
    els.cartItems.innerHTML =
      '<p class="cart-empty">Your bag is feeling light. Add something!</p>';
    els.cartTotal.textContent = "$0";
    els.checkoutButton?.setAttribute("disabled", "disabled");
  } else {
    els.checkoutButton?.removeAttribute("disabled");
    els.cartItems.innerHTML = state.cart
      .map(
        (item) => `
          <div class="cart-item">
            <div>
              <p>${item.name}</p>
              <small>${item.quantity} × ${formatCurrency(item.price)}</small>
            </div>
            <button class="btn-close" data-remove="${item.id}" aria-label="Remove ${
              item.name
            }">×</button>
          </div>
        `,
      )
      .join("");
    const total = state.cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    els.cartTotal.textContent = formatCurrency(total);
  }

  const count = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  if (els.cartCount) {
    els.cartCount.textContent = count;
  }
};

const addToCart = (productId) => {
  const product = products.find((p) => p.id === productId);
  if (!product) return;
  const existing = state.cart.find((item) => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    state.cart.push({ ...product, quantity: 1 });
  }
  updateCartUI();
};

const removeFromCart = (productId) => {
  state.cart = state.cart.filter((item) => item.id !== productId);
  updateCartUI();
};

const toggleCart = (forceOpen) => {
  if (!els.cartPanel) return;
  const shouldOpen =
    typeof forceOpen === "boolean"
      ? forceOpen
      : !els.cartPanel.classList.contains("open");
  els.cartPanel.setAttribute("aria-hidden", shouldOpen ? "false" : "true");
  els.cartPanel.classList.toggle("open", shouldOpen);
};

const wireEvents = () => {
  if (els.navToggle && els.navMenu) {
    els.navToggle.addEventListener("click", () => {
      const isOpen = els.navMenu.classList.toggle("open");
      els.navToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  if (els.searchInput) {
    els.searchInput.addEventListener("input", (event) => {
      state.search = event.target.value;
      renderProducts();
    });
  }

  els.categorySelect?.addEventListener("change", (event) => {
    state.category = event.target.value;
    renderProducts();
  });

  els.sortSelect?.addEventListener("change", (event) => {
    state.sort = event.target.value;
    renderProducts();
  });

  els.productGrid?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-add]");
    if (button) {
      addToCart(button.getAttribute("data-add"));
      toggleCart(true);
    }
  });

  els.cartItems?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove]");
    if (button) {
      removeFromCart(button.getAttribute("data-remove"));
    }
  });

  els.cartButton?.addEventListener("click", () => toggleCart());
  els.cartClose?.addEventListener("click", () => toggleCart(false));

  els.filterShortcut?.addEventListener("click", () => {
    els.searchInput?.focus();
  });

  els.checkoutButton?.addEventListener("click", () => {
    alert("Checkout coming soon. For now, enjoy the browsing!"); // Basic placeholder
  });

  els.ctaForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name").toString().trim();
    const email = formData.get("email").toString().trim();
    const message = formData.get("message").toString().trim();

    if (!name || !email || !message) {
      els.formStatus.textContent =
        "Please share your name, email, and wishlist so we can prep for you.";
      els.formStatus.style.color = "#ff7d7d";
      return;
    }

    els.formStatus.textContent =
      "Booked! Expect a calendar invite from Priyaranjan within 24 hours.";
    els.formStatus.style.color = "var(--muted)";
    event.currentTarget.reset();
  });

  document.addEventListener("keyup", (event) => {
    if (event.key === "Escape") {
      toggleCart(false);
      els.navMenu?.classList.remove("open");
      els.navToggle?.setAttribute("aria-expanded", "false");
    }
  });
};

const init = () => {
  renderProducts();
  updateCartUI();
  wireEvents();
  if (els.year) {
    els.year.textContent = new Date().getFullYear().toString();
  }
};

document.addEventListener("DOMContentLoaded", init);
