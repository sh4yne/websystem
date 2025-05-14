document.addEventListener("DOMContentLoaded", () => {
    const cartIcon = document.querySelector("#cart-icon");
    const cart = document.querySelector(".cart");
    const cartClose = document.querySelector("#cart-close");
    const addCartButtons = document.querySelectorAll(".add-cart");
    const cartContent = document.querySelector(".cart-content");
    const totalPriceElement = document.querySelector(".total-price");
    const checkoutForm = document.querySelector(".checkout-form");
    const productSection = document.querySelector(".product-content");
    let cartItemCount = 0;

    totalPriceElement.textContent = "$0";

    // Open and close cart
    cartIcon.addEventListener("click", () => cart.classList.add("active"));
    cartClose.addEventListener("click", () => cart.classList.remove("active"));

    addCartButtons.forEach(button => {
        button.addEventListener("click", event => {
            const productBox = event.target.closest(".product-box");
            addToCart(productBox);
        });
    });

    const addToCart = productBox => {
        const productImgSrc = productBox.querySelector("img").src;
        const productTitle = productBox.querySelector(".product-title").textContent;
        const productPrice = productBox.querySelector(".price").textContent;

        const cartItems = cartContent.querySelectorAll(".cart-product-title");
        let itemAlreadyInCart = false;

        cartItems.forEach(item => {
            const itemImgSrc = item.closest(".cart-box").querySelector(".cart-img").src;
            if (item.textContent === productTitle && itemImgSrc === productImgSrc) {
                itemAlreadyInCart = true;
            }
        });

        if (itemAlreadyInCart) {
            alert("This item is already in the cart.");
            return;
        }

        const cartBox = document.createElement("div");
        cartBox.classList.add("cart-box");
        cartBox.innerHTML = `
            <img src="${productImgSrc}" class="cart-img">
            <div class="cart-detail">
                <h2 class="cart-product-title">${productTitle}</h2>
                <span class="cart-price">${productPrice}</span>
                <div class="cart-quantity">
                    <button class="decrement">-</button>
                    <span class="number">1</span>
                    <button class="increment">+</button>
                </div>
            </div>
            <i class="ri-delete-bin-line cart-remove"></i>
        `;

        cartContent.appendChild(cartBox);
        updateCartCount(1);

        cartBox.querySelector(".cart-remove").addEventListener("click", () => {
            cartBox.remove();
            updateCartCount(-1);
            updateTotalPrice();
            updateOrderSummary(); // Rebuild the order summary after removal
        });

        cartBox.querySelector(".cart-quantity").addEventListener("click", event => {
            const numberElement = cartBox.querySelector(".number");
            const decrementButton = cartBox.querySelector(".decrement");
            let quantity = parseInt(numberElement.textContent);

            if (event.target.classList.contains("decrement") && quantity > 1) {
                quantity--;
                if (quantity === 1) decrementButton.style.color = "#999";
            } else if (event.target.classList.contains("increment")) {
                quantity++;
                decrementButton.style.color = "#333";
            }

            numberElement.textContent = quantity;
            updateTotalPrice();
            updateOrderSummary(); // Rebuild the order summary after quantity change
        });

        updateTotalPrice();
        updateOrderSummary(); // Update order summary when a new item is added
    };

    const updateCartCount = change => {
        const cartItemCountBadge = document.querySelector(".cart-item-count");
        cartItemCount += change;
        cartItemCountBadge.textContent = cartItemCount;
        cartItemCountBadge.style.visibility = cartItemCount > 0 ? "visible" : "hidden";
    };

    const updateTotalPrice = () => {
        const cartBoxes = cartContent.querySelectorAll(".cart-box");
        let total = 0;

        cartBoxes.forEach(cartBox => {
            const priceText = cartBox.querySelector(".cart-price").textContent.replace("$", "");
            const quantity = parseInt(cartBox.querySelector(".number").textContent);
            total += parseFloat(priceText) * quantity;
        });

        totalPriceElement.textContent = `$${total.toFixed(2)}`;
    };

    const updateOrderSummary = () => {
        const orderSummary = document.getElementById('order-summary');
        const cartBoxes = cartContent.querySelectorAll(".cart-box");
        let total = 0;

        // Clear the current order summary before updating
        orderSummary.innerHTML = "";

        if (cartBoxes.length === 0) {
            orderSummary.innerHTML = "<li>Your cart is empty!</li>";  // Show empty cart message
            document.getElementById("checkout-total-price").textContent = "$0.00"; // Set total to 0
            return;  // If cart is empty, stop further execution
        }

        cartBoxes.forEach(cartBox => {
            const title = cartBox.querySelector(".cart-product-title").textContent;
            const price = parseFloat(cartBox.querySelector(".cart-price").textContent.replace("$", ""));
            const quantity = parseInt(cartBox.querySelector(".number").textContent);
            const subtotal = price * quantity;
            total += subtotal;

            // Create and append new list item to order summary
            const li = document.createElement("li");
            li.textContent = `${title} × ${quantity} = $${subtotal.toFixed(2)}`;
            orderSummary.appendChild(li);
        });

        // Update the total price in the order summary
        document.getElementById("checkout-total-price").textContent = `$${total.toFixed(2)}`;
    };

    const buyNowButton = document.querySelector("#buy-now");
    buyNowButton.addEventListener("click", () => {
        if (cartItemCount === 0) {
            alert("Your cart is empty! Please add items to the cart before proceeding.");
            return; // Prevent going to the checkout page
        }

        // Hide the product section and its title
        document.querySelector(".shop").style.display = "none";
        document.querySelector(".section-title").style.display = "none";

        // Show the checkout form
        cart.classList.remove("active");
        checkoutForm.style.display = "block";

        updateOrderSummary(); // Update order summary when proceeding to checkout
    });

    // Handle order submission
    document.querySelector("#checkout-form").addEventListener("submit", e => {
        e.preventDefault();

        // Prevent submitting the form if the cart is empty
        if (cartItemCount === 0) {
            alert("Your cart is empty! Please add items to the cart before submitting the order.");
            return; // Prevent form submission
        }

        alert("Order submitted successfully!");
        clearCart();
        window.location.href = "cart.html"; // Adjust if necessary
        e.target.reset();
        checkoutForm.style.display = "none";
        productSection.style.display = 'block';
    });

    // Function to clear the cart
    const clearCart = () => {
        cartContent.innerHTML = "";  // Clear the cart content
        updateCartCount(-cartItemCount);  // Reset the cart item count to 0
        updateTotalPrice();  // Reset total price to $0
        updateOrderSummary();  // Reset the order summary
    };
});
