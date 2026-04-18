// ============================================================
// BONANZA SATRANGI — Product Search
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  const searchInput          = document.getElementById("search");
  const searchResultsSection = document.getElementById("search-results-section");
  const searchResultsGrid    = document.getElementById("search-results-grid");
  const searchQueryLabel     = document.getElementById("search-query-label");
  const noResults            = document.getElementById("no-results-msg");
  // FIX: mainContent now matches the id="main-content" wrapper div in index.html
  const mainContent          = document.getElementById("main-content");

  if (!searchInput) return;

  // FIX: Query .product-card — the class we added to every product swiper-slide
  function getAllProducts() {
    return Array.from(document.querySelectorAll(".product-card"));
  }

  function buildResultCard(card) {
    const img        = card.querySelector("img");
    // FIX: use .product-category class instead of the old wrong selector
    const category   = card.querySelector(".product-category")?.innerText.trim() || "";
    const title      = card.querySelector("h2")?.innerText.trim()                 || "";
    const oldPrice   = card.querySelector(".old-price")?.innerText.trim()         || "";
    const newPrice   = card.querySelector(".new-price")?.innerText.trim()         || "";
    const price      = card.querySelector(".price")?.innerText.trim()             || "";
    const saleBanner = card.querySelector(".sale-banner")?.innerText.trim()       || "";

    const priceHTML = newPrice
      ? `<span class="old-price">${oldPrice}</span><span class="new-price">${newPrice}</span>`
      : `<span class="price">${price}</span>`;

    const badgeHTML = saleBanner
      ? `<span class="result-sale-badge">${saleBanner}</span>`
      : "";

    const imgSrc = img ? img.getAttribute("src") : "";

    return `
      <div class="result-card">
        <div class="result-card-img-wrap">
          ${badgeHTML}
          <img src="${imgSrc}" alt="${title}" loading="lazy" />
        </div>
        <div class="result-card-body">
          <p class="result-category">${category}</p>
          <h3 class="result-title">${title}</h3>
          <div class="result-price">${priceHTML}</div>
        </div>
      </div>`;
  }

  function filterProducts(query) {
    const trimmed = query.trim().toLowerCase();

    if (!trimmed) {
      searchResultsSection.style.display = "none";
      // FIX: null check so no crash if main-content is somehow missing
      if (mainContent) mainContent.style.display = "";
      return;
    }

    const products = getAllProducts();
    const matched  = products.filter(card => {
      // FIX: use .product-category class for category matching
      const title    = card.querySelector("h2")?.innerText                   || "";
      const category = card.querySelector(".product-category")?.innerText    || "";
      return (title + " " + category).toLowerCase().includes(trimmed);
    });

    // FIX: null check before hiding main content
    if (mainContent) mainContent.style.display = "none";
    searchResultsSection.style.display = "block";

    if (searchQueryLabel) searchQueryLabel.textContent = `"${query}"`;

    // Result count badge
    let badge = document.getElementById("result-count-badge");
    if (!badge) {
      badge    = document.createElement("span");
      badge.id = "result-count-badge";
      searchQueryLabel?.parentNode?.appendChild(badge);
    }
    badge.textContent = matched.length
      ? `${matched.length} item${matched.length > 1 ? "s" : ""}`
      : "";

    if (matched.length === 0) {
      noResults.style.display         = "block";
      noResults.innerHTML             = `<strong>No results found.</strong> Try different keywords — e.g. "Tessa", "Fragrance", "Foundation"`;
      searchResultsGrid.style.display = "none";
      searchResultsGrid.innerHTML     = "";
    } else {
      noResults.style.display         = "none";
      searchResultsGrid.style.display = "grid";
      searchResultsGrid.innerHTML     = matched.map(buildResultCard).join("");
    }
  }

  function debounce(fn, delay) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  }

  const debouncedFilter = debounce(filterProducts, 220);

  searchInput.addEventListener("input", () => debouncedFilter(searchInput.value));

  searchInput.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      searchInput.value = "";
      filterProducts("");
    }
  });

  const clearBtn = document.getElementById("clear-search-btn");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      searchInput.value = "";
      filterProducts("");
      searchInput.focus();
    });
  }
});