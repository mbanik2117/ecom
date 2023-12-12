document.addEventListener("DOMContentLoaded", async function () {
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const cartTotalElement = document.getElementById('cartTotal');

    const updateCart = async () => {
        try {
            const response = await fetch('/get_user_cart/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch cart data');
            }

            const cartData = await response.json();
            displayCartItems(cartData);
        } catch (error) {
            console.error('Error updating cart:', error);
        }
    };

    const displayCartItems = (cartData) => {
        cartItemsContainer.innerHTML = ''; // Clear existing items

        cartData.cart_items.forEach((item) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="py-2 px-4">
                    <img src="${item.product.image}" alt="${item.product.name}" class="w-16 h-16 object-cover rounded">
                </td>
                <td class="py-2 px-4">${item.product.name}</td>
                <td class="py-2 px-4">${item.quantity}</td>
                <td class="py-2 px-4">${item.product.price}</td>
                <td class="py-2 px-4">${item.quantity * item.product.price}</td>
                <td class="py-2 px-4">
                    <button 
                        class="bg-blue-500 text-white px-2 py-1 rounded" 
                        data-product-id="${item.product.id}"
                        onclick="updateCartItem(event, 1)">+</button>
                    <button 
                        class="bg-red-500 text-white px-2 py-1 rounded" 
                        data-product-id="${item.product.id}"
                        onclick="updateCartItem(event, -1)">-</button>
                    <button 
                        class="bg-gray-500 text-white px-2 py-1 rounded" 
                        data-product-id="${item.product.id}"
                        onclick="removeCartItem(event)">Remove</button>
                </td>
            `;

            // Append the row to the container
            cartItemsContainer.appendChild(row);
        });

        cartTotalElement.textContent = `Total: Rs${cartData.cart_total}`;

    };
        const getCSRFToken = () => {
            const csrfCookie = document.cookie
                .split("; ")
                .find((cookie) => cookie.startsWith("csrftoken="));
    
            if (csrfCookie) {
                return csrfCookie.split("=")[1];
            }
    
            return django.middleware.csrf.get_token();
        };
        const getCartItemData = async (productId) => {
        try {
            const response = await fetch('/get_cart_item/' + productId + '/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to get cart item data for product ID: ${productId}`);
            }

            return response.json();
        } catch (error) {
            console.error('Error getting cart item data:', error);
            return null;
        }
    };
    const updateCartItem = async (event, quantityChange) => {
    try {
        const productId = event.target.dataset.productId;

        if (!productId) {
            console.error('Product ID is undefined');
            return;
        }

        const response = await fetch(`/get_cart_item/${productId}/`);
        const cartItemData = await response.json();

        if (!cartItemData) {
            throw new Error(`Failed to update cart item (${productId})`);
        }

        const newQuantity = cartItemData.quantity + quantityChange;

        const updateResponse = await fetch(`/update_cart/${productId}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken(),
            },
            body: JSON.stringify({
                quantity: newQuantity,
            }),
        });

        if (!updateResponse.ok) {
            throw new Error(`Failed to update cart item (${productId})`);
        }

        // Assuming the response from the server is a JSON object with a 'success' key
        const updateData = await updateResponse.json();

        if (updateData.success) {
            // Update the entire cart
            updateCart();
        } else {
            console.error(`Failed to update cart item (${productId})`);
        }
    } catch (error) {
        console.error('Error updating cart item:', error);
    }
};

        
        const removeCartItem = async (event) => {
            const productId = event.target.dataset.productId;
            
            if (!productId) {
        console.error('Product ID is undefined');
        return;
    }
            try {
                const response = await fetch('/remove_from_cart/' + productId + '/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCSRFToken(),
                    },
                });
    
                if (!response.ok) {
                    throw new Error(`Failed to remove cart item (${productId})`);
                }
    
                updateCart();
            } catch (error) {
                console.error('Error removing cart item:', error);
            }
        };
    
        window.updateCartItem = updateCartItem;
        window.removeCartItem = removeCartItem;
    
        updateCart();
    });