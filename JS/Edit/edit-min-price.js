const editPrice = document.querySelector('.edit-mn-price');
const conPrice = document.querySelector('.con-mn-price');
const curPrice = document.querySelector('#min-price');
const newPrice = document.querySelector('#new-mn-price');
const swithPrice = function () {
    newPrice.value = '';
    editPrice.classList.toggle('hidden');
    conPrice.classList.toggle('hidden');
    curPrice.classList.toggle('hidden');
    newPrice.classList.toggle('hidden');
}

editPrice.addEventListener('click', function () {
    if (update) return;
    update = true;
    swithPrice();
    newPrice.focus();
})

conPrice.addEventListener('click', function () {
    async function updatePrice() {
        try {
            const response = await fetch(`https://pharmalink.runasp.net/api/profile/ChangeMinPrice`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // if needed  
                },

                body: JSON.stringify({
                    username: userName,
                    minPriceToOrder: Number(newPrice.value)
                })
            });

            if (!response.ok) {
                throw new Error(`Failed to update. Status: ${response.status}`);
            }
            update = false;
            showNotification('Price number updated successfully!', true);
            document.querySelector('#min-price').innerHTML = `${createPrice(Number(newPrice.value))}`;
            swithPrice();
        } catch (error) {
            showNotification('Price number is not valid!', false);
            console.error('Error updating user:', error);
        }
    }
    updatePrice();
})
