document.addEventListener("DOMContentLoaded", function() {
    const apiUrl = 'https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889';
    
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            displayCartItems(data.cartItems);
            calculateTotals(data.cartItems);
        });

    function displayCartItems(items) {
        const cartContent = document.getElementById('cart-content');
        cartContent.innerHTML = '';

        items.forEach(item => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>
                    <img src="${item.image}" alt="${item.name}" width="50" /> 
                    ${item.name}
                </td>
                <td>Rs. ${item.price}</td>
                <td>
                    <input type="number" value="${item.quantity}" min="1" class="quantity-input" data-id="${item.id}" />
                </td>
                <td>Rs. ${item.price * item.quantity}</td>
                <td><button class="remove-btn" data-id="${item.id}">🗑️</button></td>
            `;
            cartContent.appendChild(row);
        });

        addEventListeners();
    }

    function addEventListeners() {
        const quantityInputs = document.querySelectorAll('.quantity-input');
        const removeButtons = document.querySelectorAll('.remove-btn');

        quantityInputs.forEach(input => {
            input.addEventListener('change', updateQuantity);
        });

        removeButtons.forEach(button => {
            button.addEventListener('click', removeItem);
        });
    }

    function updateQuantity(event) {
        const id = event.target.dataset.id;
        const newQuantity = event.target.value;

        // Update the quantity in the JSON (simulated here)
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const updatedItems = data.cartItems.map(item => {
                    if (item.id === parseInt(id)) {
                        item.quantity = parseInt(newQuantity);
                    }
                    return item;
                });

                displayCartItems(updatedItems);
                calculateTotals(updatedItems);
            });
    }

    function removeItem(event) {
        const id = event.target.dataset.id;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const updatedItems = data.cartItems.filter(item => item.id !== parseInt(id));

                displayCartItems(updatedItems);
                calculateTotals(updatedItems);
            });
    }

    function calculateTotals(items) {
        let subtotal = 0;
        items.forEach(item => {
            subtotal += item.price * item.quantity;
        });

        document.getElementById('subtotal').innerText = `Rs. ${subtotal}`;
        document.getElementById('total').innerText = `Rs. ${subtotal}`;
    }
});
