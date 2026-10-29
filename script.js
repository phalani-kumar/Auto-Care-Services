
/* =========================================================
   AUTO CARE WEBSITE
   Shared JavaScript for navigation, filters and demo forms
========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  // -------------------------------------------------------
  // 1. Automatically update copyright year
  // -------------------------------------------------------

  const currentYear = new Date().getFullYear();

    document.querySelectorAll("#currentYear, [data-year]").forEach((element) => {
        element.textContent = currentYear;
    });

  // -------------------------------------------------------
  // 2. Mobile navigation menu
  // -------------------------------------------------------

  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");

  if (menuToggle && mainNav) {
    menuToggle.setAttribute("aria-expanded", "false");

    menuToggle.addEventListener("click", function () {
      const isOpen = mainNav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation" : "Open navigation"
      );
    });

    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mainNav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  
  // -------------------------------------------------------
  // 3. Customer dashboard mobile sidebar
  // -------------------------------------------------------

  const dashboardSidebar = document.getElementById("dashboardSidebar");
  const dashboardMenuToggle = document.getElementById("dashboardMenuToggle");

  if (dashboardSidebar && dashboardMenuToggle) {
    dashboardMenuToggle.setAttribute("aria-expanded", "false");

    dashboardMenuToggle.addEventListener("click", function () {
      const isOpen = dashboardSidebar.classList.toggle("open");

      dashboardMenuToggle.setAttribute("aria-expanded", String(isOpen));
      dashboardMenuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close dashboard menu" : "Open dashboard menu"
      );
    });

    document.addEventListener("click", function (event) {
      if (
        window.innerWidth <= 900 &&
        dashboardSidebar.classList.contains("open") &&
        !dashboardSidebar.contains(event.target) &&
        !dashboardMenuToggle.contains(event.target)
      ) {
        dashboardSidebar.classList.remove("open");
        dashboardMenuToggle.setAttribute("aria-expanded", "false");
        dashboardMenuToggle.setAttribute("aria-label", "Open dashboard menu");
      }
    });
  }

  
  // Display the logged-in customer's name on dashboard pages
  
  // Display the logged-in customer's name on dashboard pages
  const loggedInUser = JSON.parse(
    localStorage.getItem("autoCareLoggedInUser") || "null"
  );

  const customerName = loggedInUser?.name || "Guest";

  const loggedInUserName = document.getElementById("loggedInUserName");
  const welcomeUserName = document.getElementById("welcomeUserName");
  const userAvatar = document.getElementById("userAvatar");

  if (loggedInUserName) {
    loggedInUserName.textContent = customerName;
  }

  if (welcomeUserName) {
    welcomeUserName.textContent = customerName;
  }

  if (userAvatar) {
    const initials = customerName
      .trim()
      .split(/\s+/)
      .map(part => part.charAt(0))
      .join("")
      .substring(0, 2)
      .toUpperCase();

    userAvatar.textContent = initials || "GU";
  }



  // -------------------------------------------------------
  // 4. Display service selected from services.html
  // Example: book-service.html?service=Oil%20Change
  // -------------------------------------------------------

  const bookingService = document.getElementById("bookingService");

  if (bookingService) {
    const params = new URLSearchParams(window.location.search);
    const requestedService = params.get("service");

    if (requestedService) {
      const normalizedRequest = requestedService
        .toLowerCase()
        .replaceAll("&", "and")
        .replaceAll("-", " ")
        .trim();

      const matchingOption = Array.from(bookingService.options).find(
        function (option) {
          const normalizedOption = option.textContent
            .toLowerCase()
            .replaceAll("&", "and")
            .replaceAll("-", " ")
            .trim();

          return (
            normalizedOption === normalizedRequest ||
            normalizedOption.includes(normalizedRequest) ||
            normalizedRequest.includes(normalizedOption)
          );
        }
      );

      if (matchingOption) {
        bookingService.value = matchingOption.value;
      }
    }
  }

  // -------------------------------------------------------
  // 5. Shop product search and category filter
  // -------------------------------------------------------

  const shopSearch = document.getElementById("shopSearch");
  const shopCategory = document.getElementById("shopCategory");
  const productGrid = document.getElementById("productGrid");
  const shopEmpty = document.getElementById("shopEmpty");

  function filterProducts() {
    if (!productGrid) return;

    const searchText = shopSearch
      ? shopSearch.value.trim().toLowerCase()
      : "";

    const selectedCategory = shopCategory
      ? shopCategory.value
      : "all";

    let visibleCount = 0;

    productGrid.querySelectorAll(".product-card").forEach(function (card) {
      const searchableText = (
        card.dataset.name +
        " " +
        card.textContent
      ).toLowerCase();

      const categoryMatches =
        selectedCategory === "all" ||
        card.dataset.category === selectedCategory;

      const searchMatches = searchableText.includes(searchText);
      const shouldShow = categoryMatches && searchMatches;

      card.hidden = !shouldShow;

      if (shouldShow) visibleCount++;
    });

    if (shopEmpty) {
      shopEmpty.hidden = visibleCount !== 0;
    }
  }

  if (shopSearch) {
    shopSearch.addEventListener("input", filterProducts);
  }

  if (shopCategory) {
    shopCategory.addEventListener("change", filterProducts);
  }

  // -------------------------------------------------------
  // 6. Add-to-cart demo buttons
  // -------------------------------------------------------

  document.querySelectorAll(".add-to-cart").forEach(function (button) {
    button.addEventListener("click", function () {
      const productName = button.dataset.product || "Product";

      const originalText = button.textContent;
      button.textContent = "Added ✓";
      button.disabled = true;

      window.alert(
        productName +
          " was added in this demo. A real shopping cart requires backend or cart storage."
      );

      button.textContent = originalText;
      button.disabled = false;
    });
  });

  // -------------------------------------------------------
  // 7. Booking status tabs
  // -------------------------------------------------------

  const bookingRows = document.getElementById("bookingRows");
  const bookingEmpty = document.getElementById("bookingEmpty");
  const bookingTabs = document.querySelectorAll("[data-tabs] .tab-button");

  bookingTabs.forEach(function (button) {
    button.addEventListener("click", function () {
      const selectedStatus = button.dataset.filter;
      let visibleCount = 0;

      bookingTabs.forEach(function (tab) {
        tab.classList.toggle("active", tab === button);
      });

      if (!bookingRows) return;

      bookingRows.querySelectorAll("tr").forEach(function (row) {
        const matches =
          selectedStatus === "all" ||
          row.dataset.status === selectedStatus;

        row.hidden = !matches;

        if (matches) visibleCount++;
      });

      if (bookingEmpty) {
        bookingEmpty.hidden = visibleCount !== 0;
      }
    });
  });

  // -------------------------------------------------------
  // 8. Cancel booking demo
  // -------------------------------------------------------

  document.querySelectorAll(".cancel-booking").forEach(function (button) {
    button.addEventListener("click", function () {
      const row = button.closest("tr");

      if (!row) return;

      const confirmed = window.confirm(
        "Are you sure you want to cancel this demo booking?"
      );

      if (!confirmed) return;

      row.dataset.status = "Cancelled";

      const statusCell = row.querySelector("td:nth-child(5)");

      if (statusCell) {
        statusCell.innerHTML =
          '<span class="status-badge">Cancelled</span>';
      }

      button.textContent = "Cancelled";
      button.disabled = true;

      // If the current tab is not All Bookings, hide the row.
      const activeTab = document.querySelector(
        "[data-tabs] .tab-button.active"
      );

      if (activeTab && activeTab.dataset.filter !== "all") {
        row.hidden = true;
      }

      if (bookingRows && bookingEmpty) {
        const visibleRows = Array.from(
          bookingRows.querySelectorAll("tr")
        ).filter(function (item) {
          return !item.hidden;
        });

        bookingEmpty.hidden = visibleRows.length !== 0;
      }

      window.alert(
        "The booking status was changed in this demo only. It was not saved to a server."
      );
    });
  });

  // -------------------------------------------------------
  // 9. Service history vehicle filter
  // -------------------------------------------------------

  const historyVehicleFilter = document.getElementById(
    "historyVehicleFilter"
  );
  const historyRows = document.getElementById("historyRows");
  const historyEmpty = document.getElementById("historyEmpty");

  if (historyVehicleFilter && historyRows) {
    historyVehicleFilter.addEventListener("change", function () {
      const selectedVehicle = historyVehicleFilter.value;
      let visibleCount = 0;

      historyRows.querySelectorAll("tr").forEach(function (row) {
        const matches =
          selectedVehicle === "all" ||
          row.dataset.vehicle === selectedVehicle;

        row.hidden = !matches;

        if (matches) visibleCount++;
      });

      if (historyEmpty) {
        historyEmpty.hidden = visibleCount !== 0;
      }
    });
  }

  // -------------------------------------------------------
  // 10. Orders status filter
  // -------------------------------------------------------

  const orderStatusFilter = document.getElementById("orderStatusFilter");
  const orderRows = document.getElementById("orderRows");
  const ordersEmpty = document.getElementById("ordersEmpty");

  if (orderStatusFilter && orderRows) {
    orderStatusFilter.addEventListener("change", function () {
      const selectedStatus = orderStatusFilter.value;
      let visibleCount = 0;

      orderRows.querySelectorAll("tr").forEach(function (row) {
        const matches =
          selectedStatus === "all" ||
          row.dataset.status === selectedStatus;

        row.hidden = !matches;

        if (matches) visibleCount++;
      });

      if (ordersEmpty) {
        ordersEmpty.hidden = visibleCount !== 0;
      }
    });
  }

  // -------------------------------------------------------
  // 11. Show/hide add vehicle form
  // -------------------------------------------------------

  const showVehicleForm = document.getElementById("showVehicleForm");
  const vehicleForm = document.getElementById("vehicleForm");

  if (showVehicleForm && vehicleForm) {
    showVehicleForm.addEventListener("click", function () {
      const willShow = vehicleForm.hidden;

      vehicleForm.hidden = !willShow;

      showVehicleForm.textContent = willShow
        ? "− Close Form"
        : "+ Add Vehicle";

      if (willShow) {
        vehicleForm.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

        const firstInput = vehicleForm.querySelector("input");

        if (firstInput) firstInput.focus();
      }
    });

    vehicleForm.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!vehicleForm.reportValidity()) return;

      const formData = new FormData(vehicleForm);
      const make = String(formData.get("make") || "").trim();
      const model = String(formData.get("model") || "").trim();
      const registration = String(
        formData.get("registration") || ""
      ).trim().toUpperCase();
      const year = String(formData.get("year") || "").trim();

      const newVehicle = document.createElement("article");
      newVehicle.className = "dashboard-card vehicle-card";

      const image = document.createElement("img");
      image.src =
        "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1000&q=80";
      image.alt = "Vehicle";

      const content = document.createElement("div");
      content.className = "vehicle-card-content";

      const heading = document.createElement("div");
      heading.className = "card-heading";

      const title = document.createElement("h2");
      title.textContent = (make + " " + model).trim();

      const badge = document.createElement("span");
      badge.className = "status-badge";
      badge.textContent = "Added in Demo";

      heading.append(title, badge);

      const registrationText = document.createElement("p");
      registrationText.className = "vehicle-registration";
      registrationText.textContent = registration;

      const specs = document.createElement("div");
      specs.className = "vehicle-specs";

      const yearText = document.createElement("span");
      yearText.textContent = "Year: " + year;

      const fuelText = document.createElement("span");
      fuelText.textContent = "Fuel: Not specified";

      specs.append(yearText, fuelText);

      const nextService = document.createElement("div");
      nextService.className = "vehicle-next-service";

      const serviceLabel = document.createElement("span");
      serviceLabel.textContent = "Next service";

      const serviceValue = document.createElement("strong");
      serviceValue.textContent = "Not scheduled";

      nextService.append(serviceLabel, serviceValue);

      const actions = document.createElement("div");
      actions.className = "button-row";

      const bookLink = document.createElement("a");
      bookLink.className = "btn btn-primary";
      bookLink.href = "book-service.html";
      bookLink.textContent = "Book Service";

      const historyLink = document.createElement("a");
      historyLink.className = "btn btn-outline";
      historyLink.href = "service-history.html";
      historyLink.textContent = "History";

      actions.append(bookLink, historyLink);
      content.append(heading, registrationText, specs, nextService, actions);
      newVehicle.append(image, content);

      let vehicleGrid = document.querySelector(".vehicle-grid");

      if (!vehicleGrid) {
        vehicleGrid = document.createElement("div");
        vehicleGrid.className = "vehicle-grid";
        vehicleForm.insertAdjacentElement("afterend", vehicleGrid);
      }

      vehicleGrid.appendChild(newVehicle);

      const message = vehicleForm.querySelector(".form-message");

      if (message) {
        message.textContent =
          "Vehicle added to the page. This data will disappear when you reload.";
        message.classList.remove("error");
      }

      vehicleForm.reset();
      vehicleForm.hidden = true;
      showVehicleForm.textContent = "+ Add Vehicle";
    });
  }

  // -------------------------------------------------------
  // 12. Password confirmation validation
  // -------------------------------------------------------

  document.querySelectorAll("form").forEach(function (form) {
    const password = form.querySelector(
      'input[name="password"], input[name="newPassword"]'
    );
    const confirmPassword = form.querySelector(
      'input[name="confirmPassword"]'
    );

    if (password && confirmPassword) {
      function validatePasswords() {
        if (
          confirmPassword.value &&
          password.value !== confirmPassword.value
        ) {
          confirmPassword.setCustomValidity(
            "Passwords do not match."
          );
        } else {
          confirmPassword.setCustomValidity("");
        }
      }

      password.addEventListener("input", validatePasswords);
      confirmPassword.addEventListener("input", validatePasswords);
    }
  });

  // -------------------------------------------------------
  // 13. Frontend-only form submissions
  // Supports forms with .demo-form or [data-demo-form]
  // -------------------------------------------------------

  document.querySelectorAll("form").forEach(function (form) {
    const isDemoForm =
      form.classList.contains("demo-form") ||
      form.hasAttribute("data-demo-form");

    if (!isDemoForm) return;

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!form.reportValidity()) return;

      // Recheck password confirmation before submitting.
      const password = form.querySelector(
        'input[name="password"], input[name="newPassword"]'
      );
      const confirmPassword = form.querySelector(
        'input[name="confirmPassword"]'
      );

      if (
        password &&
        confirmPassword &&
        password.value !== confirmPassword.value
      ) {
        confirmPassword.setCustomValidity("Passwords do not match.");
        confirmPassword.reportValidity();
        return;
      }

      const message = form.querySelector(".form-message");
      const successMessage =
        form.dataset.success ||
        "Your form was submitted in this frontend demo.";

        
      // Save signup details or verify the demo login
      const signupNameInput = form.querySelector("#signupName");
      const signupEmailInput = form.querySelector("#signupEmail");
      const loginEmailInput = form.querySelector("#loginEmail");

      if (signupNameInput && signupEmailInput) {
        const name = signupNameInput.value.trim();
        const email = signupEmailInput.value.trim().toLowerCase();
        const phone = form.querySelector("#signupPhone")?.value.trim() || "";
        const passwordValue = form.querySelector("#signupPassword")?.value || "";

        const customers = JSON.parse(
          localStorage.getItem("autoCareCustomers") || "{}"
        );

        if (customers[email]) {
          if (message) {
            message.textContent = "An account with this email already exists. Please sign in.";
            message.classList.add("error");
          }
          return;
        }

        customers[email] = { name, email, phone, password: passwordValue };

        localStorage.setItem("autoCareCustomers", JSON.stringify(customers));
        localStorage.setItem(
          "autoCareLoggedInUser",
          JSON.stringify({ name, email })
        );
      }

      if (loginEmailInput) {
        const email = loginEmailInput.value.trim().toLowerCase();
        const passwordValue = form.querySelector("#loginPassword")?.value || "";

        const customers = JSON.parse(
          localStorage.getItem("autoCareCustomers") || "{}"
        );

        const customer = customers[email];

        if (!customer || customer.password !== passwordValue) {
          if (message) {
            message.textContent = "Invalid email or password. Please sign up first or check your details.";
            message.classList.add("error");
          }
          return;
        }

        localStorage.setItem(
          "autoCareLoggedInUser",
          JSON.stringify({ name: customer.name, email: customer.email })
        );
      }


      if (message) {
        message.textContent = successMessage;
        message.classList.remove("error");
      } else {
        window.alert(successMessage);
      }

      // Redirect only for the demo login and registration forms.
      const redirectPage = form.dataset.redirect;

      if (redirectPage) {
        window.setTimeout(function () {
          window.location.href = redirectPage;
        }, 800);
      }

      // No fetch request is made. This is a frontend demonstration.
    });
  });
});


/* Image fallback: works on every page that loads script.js */
document.querySelectorAll("img").forEach((img) => {
  function showFallback() {
    img.classList.add("image-load-failed");

    const container = img.parentElement;
    if (container) {
      container.classList.add("image-fallback");
      container.setAttribute(
        "data-fallback",
        img.alt || "Auto Care"
      );
    }
  }

  img.addEventListener("error", showFallback);

  // Also handles images that failed before this code ran.
  if (img.complete && img.naturalWidth === 0) {
    showFallback();
  }
});
