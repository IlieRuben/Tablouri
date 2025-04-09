document.addEventListener('DOMContentLoaded', () => {
      // console.log("SCRIPT START: DOM fully loaded."); // DEBUG

      // --- Elements ---
      const body = document.body;

      // Common Elements
      const reviewItems = document.querySelectorAll('.review-slider .review-item');
      const viewGalleryBtn = document.getElementById('view-gallery-btn');
      const galleryOverlay = document.getElementById('gallery-overlay');
      const closeGalleryBtn = document.getElementById('close-gallery-btn');
      const filterBtns = document.querySelectorAll('.gallery-filters .filter-btn');
      const miniGalleryItems = document.querySelectorAll('.mini-gallery-grid .mini-gallery-item');
      const miniPopup = document.getElementById('mini-order-popup');
      const popupCloseBtn = miniPopup?.querySelector('.popup-close-btn');
      const popupTitle = document.getElementById('popup-title');
      const popupSizeSelect = document.getElementById('popup-size-select');
      const popupDelivery = document.getElementById('popup-delivery-time');
      const popupPrice = document.getElementById('popup-price-value');
      const popupOrderBtn = miniPopup?.querySelector('.popup-order-btn');

      // Page Specific Content Check
      const productPageContent = body.querySelector('.product-page-content:not(.events-page-content):not(.gender-reveal-page):not(.flori-page-content):not(.flori-categorie-page-content)');
      const genderRevealPageContent = body.querySelector('.gender-reveal-page');
      const eventsPageContent = body.querySelector('.events-page-content');
      const floriCategoriePageContent = body.querySelector('.flori-categorie-page-content');
      const floriPageContent = body.querySelector('.flori-page-content:not(.flori-categorie-page-content)');

      // Product Page Elements
      let productTitleMain, productStarsContainer, productReviewCountSpan,
          productPriceMainSpan, productShortDesc, productDimensionSelect, productPersonsSelect,
          productColorSelect, productProcessingTimeSpan, resetOptionsBtn, productFinalPriceSpan,
          productFileUpload, productObservations, productKitCheckbox, buyNowBtn,
          accordionDesc, accordionCaract, accordionInfo, accordionFaq, accordionRecenzii,
          metaCategorieLink, metaEticheta1, metaEticheta2, relatedProductsGrid, productCourierRadios;

      // Gender Reveal Page Elements
      let grDimensionSelect, grConfettiColorRadios, grFumigenaColorRadios,
          grAddConfettiBtn, grAddFumigenaBtn, grFinalPriceSpan, grBuyNowBtn;

      // Event Page Elements
      let eventCategoryBtns, eventOrderPanel, eventPanelOverlay, closeEventPanelBtn,
          eventPanelTitle, eventDimensionSelect, eventFileUpload, eventObservations,
          eventDesignSelect, eventThemeSelect, eventFinalPriceSpan, eventBuyNowBtn;

      // Flori Categorie Page Elements
      let floriResultsCountSpan, floriSortSelect, floriProductGrid,
          flowerOrderPanel, flowerPanelOverlay, closeFlowerPanelBtn,
          flowerPanelTitle, flowerPanelImg1, flowerPanelImg2, flowerPanelPriceRange,
          flowerPanelDesc, flowerPackageOptionsContainer, flowerFinalPriceSpan, flowerBuyNowBtn,
          flowerPanelTags;


      // --- State Variables ---
      let currentReviewIndex = 0;
      let reviewInterval;
      let currentPopupBasePrice = 0;
      let productData = {}; // For produse.html
      let grAddonPrices = { confetti: 0, fumigena: 0 }; // For gender-reveal.html
      let currentEventBasePrice = 0; // For evenimente.html panel
      let currentFlowerBasePrice = 0; // For flori-categorie.html panel
      let currentFlowerAddonPrice = 0; // For flori-categorie.html panel

      // --- Default Dimension Options ---
      const defaultDimensions = [
          { text: "30x40 cm", modifier: 0 },
          { text: "40x60 cm (+50)", modifier: 50 },
          { text: "50x70 cm (+90)", modifier: 90 }
      ];

      // --- Simulated Product Data ---
      const allProductsData = { /* ... existing data ... */ };
      const eventTypeData = { /* ... existing data ... */ };
      const allFlowerData = { /* ... existing data ... */ };


      // --- Functions ---

      function updateProductPrice() {
          // console.log("--- updateProductPrice CALLED ---");
          const finalPriceSpan = document.getElementById('product-final-price-value');
          const dimensionSelect = document.getElementById('product-dimension-select');
          const personsSelect = document.getElementById('product-persons-select');
          const colorSelect = document.getElementById('product-color-select');
          const kitCheckbox = document.getElementById('product-kit-checkbox');

          if (!productData || typeof productData.basePrice === 'undefined' || !finalPriceSpan || !dimensionSelect || !personsSelect || !colorSelect || !kitCheckbox) {
              // console.error("Exiting updateProductPrice: Missing elements or basePrice in productData.");
              if(finalPriceSpan) finalPriceSpan.textContent = 'ERR';
              return;
          }

          let finalPrice = parseFloat(productData.basePrice);
          // console.log("Base price:", finalPrice);

          const dimOption = dimensionSelect.options[dimensionSelect.selectedIndex];
          if (dimOption && typeof dimOption.dataset.modifier !== 'undefined') {
              const modifier = parseFloat(dimOption.dataset.modifier);
              if (!isNaN(modifier)) {
                  // console.log(`Dimension: ${dimOption.value}, Modifier: ${modifier}`);
                  finalPrice += modifier;
              } else { console.warn("Dimension modifier is NaN for:", dimOption.value); }
          } else { console.log("No valid dimension option selected or modifier missing/undefined."); }

          if (productData.personsApplicable) {
              const persOption = personsSelect.options[personsSelect.selectedIndex];
               if (persOption && persOption.dataset.modifier) {
                  const modifier = parseFloat(persOption.dataset.modifier);
                  if (!isNaN(modifier)) finalPrice += modifier;
               }
          }
          if (productData.colorsApplicable) {
              const colorOption = colorSelect.options[colorSelect.selectedIndex];
               if (colorOption && colorOption.dataset.modifier) {
                  const modifier = parseFloat(colorOption.dataset.modifier);
                  if (!isNaN(modifier)) finalPrice += modifier;
               }
          }
          if (kitCheckbox.checked && kitCheckbox.dataset.priceModifier) {
              const modifier = parseFloat(kitCheckbox.dataset.priceModifier);
              if (!isNaN(modifier)) finalPrice += modifier;
          }

          // console.log("Final calculated price:", finalPrice);
          finalPriceSpan.textContent = finalPrice.toFixed(2);
          // console.log("Updated productFinalPriceSpan textContent to:", finalPrice.toFixed(2));
      }


      function resetOptions() {
          // console.log("resetOptions called");
          const dimensionSelect = document.getElementById('product-dimension-select');
          const personsSelect = document.getElementById('product-persons-select');
          const colorSelect = document.getElementById('product-color-select');
          const kitCheckbox = document.getElementById('product-kit-checkbox');
          const fileUpload = document.getElementById('product-file-upload');
          const observations = document.getElementById('product-observations');

          if (dimensionSelect) dimensionSelect.selectedIndex = 0;
          if (personsSelect) personsSelect.selectedIndex = 0;
          if (colorSelect) colorSelect.selectedIndex = 0;
          if (kitCheckbox) kitCheckbox.checked = false;
          if (fileUpload) fileUpload.value = '';
          if (observations) observations.value = '';
          updateProductPrice();
      }

      function loadProductDetails(category) {
          // console.log("Loading details for category:", category);
          productData = allProductsData[category] || allProductsData['default'];
          // console.log("Loaded productData:", productData);

          if (!productData || !productData.title) {
              console.error("Failed to load valid product data for category:", category);
              if (productTitleMain) productTitleMain.textContent = "Produs Indisponibil";
              if (productShortDesc) productShortDesc.textContent = "Ne pare rău, detaliile pentru acest produs nu au putut fi încărcate.";
              return;
          }

          // Assign elements specific to product page (re-fetch here)
          productTitleMain = document.getElementById('product-title-main');
          productStarsContainer = document.getElementById('product-stars');
          productReviewCountSpan = document.getElementById('product-review-count');
          productPriceMainSpan = document.getElementById('product-price-value-main');
          productShortDesc = document.getElementById('product-short-desc');
          productDimensionSelect = document.getElementById('product-dimension-select');
          productPersonsSelect = document.getElementById('product-persons-select');
          productColorSelect = document.getElementById('product-color-select');
          productProcessingTimeSpan = document.getElementById('product-processing-time');
          resetOptionsBtn = document.getElementById('reset-options-btn');
          productFinalPriceSpan = document.getElementById('product-final-price-value');
          productFileUpload = document.getElementById('product-file-upload');
          productObservations = document.getElementById('product-observations');
          productKitCheckbox = document.getElementById('product-kit-checkbox');
          buyNowBtn = document.getElementById('buy-now-btn');
          accordionDesc = document.getElementById('accordion-descriere');
          accordionCaract = document.getElementById('accordion-caracteristici');
          accordionInfo = document.getElementById('accordion-info');
          accordionFaq = document.getElementById('accordion-faq');
          accordionRecenzii = document.getElementById('accordion-recenzii');
          metaCategorieLink = document.getElementById('meta-categorie');
          metaEticheta1 = document.getElementById('meta-eticheta1');
          metaEticheta2 = document.getElementById('meta-eticheta2');
          relatedProductsGrid = document.getElementById('related-products-grid');
          productCourierRadios = document.querySelectorAll('.product-options-form input[name="courier"]');
          const productImageMain = document.getElementById('product-image-main');


          // --- Now populate the elements ---
          document.title = `${productData.title} - DavidGift`;
          if (productTitleMain) productTitleMain.textContent = productData.title;
          if (productImageMain) {
              productImageMain.src = productData.image;
              productImageMain.alt = productData.title;
          }
          if (productStarsContainer) {
              let starsHTML = '';
              let fullStars = Math.floor(productData.rating);
              let halfStar = productData.rating % 1 >= 0.5;
              let emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
              for(let i=0; i<fullStars; i++) starsHTML += '<i class="fas fa-star"></i>';
              if(halfStar) starsHTML += '<i class="fas fa-star-half-alt"></i>';
              for(let i=0; i<emptyStars; i++) starsHTML += '<i class="far fa-star"></i>';
              productStarsContainer.innerHTML = starsHTML;
          }
          if (productReviewCountSpan) productReviewCountSpan.textContent = productData.reviews;
          if (productPriceMainSpan) productPriceMainSpan.textContent = productData.basePrice.toFixed(2);
          if (productShortDesc) productShortDesc.textContent = productData.description;

          // Populate Dimension Select
          if (productDimensionSelect) {
              // console.log("Populating dimensions select...");
              productDimensionSelect.innerHTML = ''; // Clear existing
              if (Array.isArray(productData.dimensions)) {
                  // console.log("Dimensions data is array:", productData.dimensions);
                  productData.dimensions.forEach((dim, index) => {
                      const option = document.createElement('option');
                      option.value = dim.text;
                      option.textContent = dim.text;
                      const modifierValue = parseFloat(dim.modifier);
                      option.dataset.modifier = isNaN(modifierValue) ? '0' : modifierValue.toString();
                      productDimensionSelect.appendChild(option);
                      // console.log(`Added dimension option: ${option.textContent} (Modifier: ${option.dataset.modifier})`);
                  });
                  productDimensionSelect.selectedIndex = 0;
                  // console.log("Finished populating dimensions. Options count:", productDimensionSelect.options.length);
              } else {
                  productDimensionSelect.innerHTML = '<option value="N/A" data-modifier="0">N/A</option>';
                  console.error("Dimensions data is missing or invalid for category:", category);
              }
          } else {
              // console.error("CRITICAL: productDimensionSelect element NOT FOUND!");
          }


           if (productPersonsSelect) {
               productPersonsSelect.closest('.option-group').style.display = productData.personsApplicable ? 'block' : 'none';
               productPersonsSelect.selectedIndex = 0;
           }
           if (productColorSelect) {
               productColorSelect.closest('.option-group').style.display = productData.colorsApplicable ? 'block' : 'none';
               productColorSelect.selectedIndex = 0;
           }
           if (productKitCheckbox) {
                productKitCheckbox.closest('.option-group').style.display = productData.kitPrice > 0 ? 'block' : 'none';
                productKitCheckbox.checked = false;
                productKitCheckbox.dataset.priceModifier = productData.kitPrice;
           }

          if (productProcessingTimeSpan) productProcessingTimeSpan.textContent = productData.processingTime;

          // Populate Accordion
          if (accordionDesc) accordionDesc.innerHTML = productData.accordion.desc || 'N/A';
          if (accordionCaract) accordionCaract.innerHTML = productData.accordion.caract || 'N/A';
          if (accordionInfo) accordionInfo.innerHTML = productData.accordion.info || 'N/A';
          if (accordionFaq) accordionFaq.innerHTML = productData.accordion.faq || 'N/A';
          if (accordionRecenzii) accordionRecenzii.innerHTML = productData.accordion.recenzii || 'N/A';


          if (metaCategorieLink) {
              metaCategorieLink.textContent = productData.category;
              metaCategorieLink.href = `produse.html?categorie=${category}`;
          }
          if(metaEticheta1) metaEticheta1.textContent = productData.tags[0] || 'tablou';
          if(metaEticheta2) metaEticheta2.textContent = productData.tags[1] || 'cadou';

          if (relatedProductsGrid) {
              relatedProductsGrid.innerHTML = '';
              let count = 0;
              for (const key in allProductsData) {
                  if (key !== category && key !== 'default' && count < 3) {
                      const relatedProd = allProductsData[key];
                      const cardHTML = `
                          <div class="product-card">
                              <div class="product-image">
                                  <a href="produse.html?categorie=${key}"> <img src="${relatedProd.image.replace('600x500', '300x300')}" alt="${relatedProd.title}"></a>
                                  <div class="product-overlay">
                                      <a href="produse.html?categorie=${key}" class="quick-view" aria-label="Vizualizare Rapida"><i class="fas fa-eye"></i></a>
                                      <a href="#" class="add-to-wishlist" aria-label="Adauga la Favorite"><i class="fas fa-heart"></i></a>
                                  </div>
                              </div>
                              <div class="product-info">
                                  <h3 class="product-title"><a href="produse.html?categorie=${key}">${relatedProd.title}</a></h3>
                                  <p class="product-price">${relatedProd.basePrice.toFixed(2)} RON</p>
                                  <a href="produse.html?categorie=${key}" class="add-to-cart-btn">Vezi Detalii</a>
                              </div>
                          </div>`;
                      relatedProductsGrid.innerHTML += cardHTML;
                      count++;
                  }
              }
          }

          updateProductPrice(); // Calculate initial final price AFTER populating selects
          // console.log("Product details loaded.");
      }

      // --- Other Functions (Reviews, Gallery, etc.) ---
      function showNextReview() { /* ... */ }
      function startReviewSlider() { /* ... */ }
      function stopReviewSlider() { /* ... */ }
      function openGallery() { /* ... */ }
      function closeGallery() { /* ... */ }
      function filterGallery(filter) { /* ... */ }
      function updatePopupPrice() { /* ... */ }
      function openMiniPopup(button, event) { /* ... */ }
      function closeMiniPopup() { /* ... */ }
      function updateEventPanelPrice() { /* ... */ }
      function openEventOrderPanel(button) { /* ... */ }
      function closeEventOrderPanel() { /* ... */ }
      function loadFlowerCategoryPage(categoryType) { /* ... */ }
      function updateFlowerPanelPrice() { /* ... */ }
      function openFlowerOrderPanel(button) { /* ... */ }
      function closeFlowerOrderPanel() { /* ... */ }


      // --- Event Listeners ---

      // Home Page Specific Listeners
      if (reviewItems.length > 0) { startReviewSlider(); }
      if (viewGalleryBtn) { viewGalleryBtn.addEventListener('click', (e) => { e.preventDefault(); openGallery(); }); }
      if (closeGalleryBtn) { closeGalleryBtn.addEventListener('click', closeGallery); }
      if (galleryOverlay) { galleryOverlay.addEventListener('click', (e) => { if (e.target === galleryOverlay) { closeGallery(); } }); }

      // About Page Mini Gallery Listeners
      if (filterBtns.length > 0) { /* ... */ }

      // Product Page Specific Listeners
      if (productPageContent) {
          // console.log("Product page detected. Assigning elements and adding listeners...");

          // Assign product page elements
          productTitleMain = document.getElementById('product-title-main');
          productStarsContainer = document.getElementById('product-stars');
          productReviewCountSpan = document.getElementById('product-review-count');
          productPriceMainSpan = document.getElementById('product-price-value-main');
          productShortDesc = document.getElementById('product-short-desc');
          productDimensionSelect = document.getElementById('product-dimension-select');
          productPersonsSelect = document.getElementById('product-persons-select');
          productColorSelect = document.getElementById('product-color-select');
          productProcessingTimeSpan = document.getElementById('product-processing-time');
          resetOptionsBtn = document.getElementById('reset-options-btn');
          productFinalPriceSpan = document.getElementById('product-final-price-value');
          productFileUpload = document.getElementById('product-file-upload');
          productObservations = document.getElementById('product-observations');
          productKitCheckbox = document.getElementById('product-kit-checkbox');
          buyNowBtn = document.getElementById('buy-now-btn');
          accordionDesc = document.getElementById('accordion-descriere');
          accordionCaract = document.getElementById('accordion-caracteristici');
          accordionInfo = document.getElementById('accordion-info');
          accordionFaq = document.getElementById('accordion-faq');
          accordionRecenzii = document.getElementById('accordion-recenzii');
          metaCategorieLink = document.getElementById('meta-categorie');
          metaEticheta1 = document.getElementById('meta-eticheta1');
          metaEticheta2 = document.getElementById('meta-eticheta2');
          relatedProductsGrid = document.getElementById('related-products-grid');
          productCourierRadios = document.querySelectorAll('.product-options-form input[name="courier"]');

          if (!productDimensionSelect || !productFinalPriceSpan) {
              console.error("CRITICAL ERROR: Dimension select or Final Price Span not found on product page!");
              return;
          }

          const urlParams = new URLSearchParams(window.location.search);
          const category = urlParams.get('categorie') || 'default';

          loadProductDetails(category);

          // --- Add listeners AFTER elements are assigned and populated ---
          // console.log("Attempting to add 'change' listener to productDimensionSelect:", productDimensionSelect);
          productDimensionSelect.addEventListener('change', updateProductPrice); // Directly call updateProductPrice

          if (productPersonsSelect) {
              // console.log("Adding 'change' listener to productPersonsSelect");
              productPersonsSelect.addEventListener('change', updateProductPrice);
          }
          if (productColorSelect) {
              // console.log("Adding 'change' listener to productColorSelect");
              productColorSelect.addEventListener('change', updateProductPrice);
          }
          if (productKitCheckbox) {
              // console.log("Adding 'change' listener to productKitCheckbox");
              productKitCheckbox.addEventListener('change', updateProductPrice);
          }
          if (resetOptionsBtn) {
              // console.log("Adding 'click' listener to resetOptionsBtn");
              resetOptionsBtn.addEventListener('click', resetOptions);
          }
          // ... (rest of the listeners) ...

          if (buyNowBtn) { buyNowBtn.addEventListener('click', (e) => { /* ... alert logic ... */ });
          } else { console.error("Buy Now button not found."); }
      }

      // Event Page Specific Listeners
      if (eventsPageContent) {
          // console.log("Events page detected. Adding listeners...");
          eventCategoryBtns = document.querySelectorAll('.event-add-btn');
          eventOrderPanel = document.getElementById('event-order-panel');
          eventPanelOverlay = document.getElementById('event-panel-overlay');
          closeEventPanelBtn = document.getElementById('close-event-panel-btn');

          eventCategoryBtns.forEach(btn => {
              btn.addEventListener('click', (e) => openEventOrderPanel(btn));
          });

          if (closeEventPanelBtn) closeEventPanelBtn.addEventListener('click', closeEventOrderPanel);
          if (eventPanelOverlay) eventPanelOverlay.addEventListener('click', closeEventOrderPanel);

          const panelDimSelect = document.getElementById('event-dimension-select');
           if(panelDimSelect) {
               panelDimSelect.addEventListener('change', updateEventPanelPrice);
           }

           const panelBuyNowBtn = document.getElementById('event-buy-now-btn');
           if(panelBuyNowBtn) {
               panelBuyNowBtn.addEventListener('click', () => { /* ... alert logic ... */ });
           }
      }

      // Flori Categorie Page Specific Listeners
      if (floriCategoriePageContent) {
          // console.log("Flori Categorie page detected.");
          const urlParams = new URLSearchParams(window.location.search);
          const categoryType = urlParams.get('tip') || 'all';
          loadFlowerCategoryPage(categoryType);
      }

      // Flori Page Specific Listeners (for price filter toggle)
      if (floriPageContent || floriCategoriePageContent) {
          const priceToggle = document.getElementById('price-toggle-checkbox');
          const priceOptionsList = document.getElementById('price-options-list');
          if (priceToggle && priceOptionsList) {
              // Initial state check might be needed if checkbox can be pre-checked
              if (!priceToggle.checked) {
                  priceOptionsList.style.display = 'none'; // Ensure hidden initially if not checked
              }
              priceToggle.addEventListener('change', () => {
                  if (priceToggle.checked) {
                      priceOptionsList.style.display = 'block';
                      // Optional: Animate max-height for smooth opening
                      // priceOptionsList.style.maxHeight = priceOptionsList.scrollHeight + "px";
                  } else {
                      priceOptionsList.style.display = 'none';
                      // Optional: Animate max-height for smooth closing
                      // priceOptionsList.style.maxHeight = '0';
                  }
              });
          }
      }


    });
