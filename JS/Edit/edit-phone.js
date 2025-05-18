const editPhone = document.querySelector('.edit-phone');
const conPhone = document.querySelector('.con-phone');
const curPhone = document.querySelector('#phone');
const newPhone = document.querySelector('#new-phone');
const swithPhone = function () {
    newPhone.value = '';
    editPhone.classList.toggle('hidden');
    conPhone.classList.toggle('hidden');
    curPhone.classList.toggle('hidden');
    newPhone.classList.toggle('hidden');
}

editPhone.addEventListener('click', function () {
    if (update) return;
    update = true;
    swithPhone();
    newPhone.focus();
})

conPhone.addEventListener('click', function () {
    async function updatePhone() {
        try {
            const response = await fetch(`https://pharmalink.runasp.net/api/profile/ChangePhoneNumber`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // if needed  
                },

                body: JSON.stringify({
                    username: userName,
                    newPhone: document.querySelector('#new-phone').value
                })
            });

            if (!response.ok) {
                throw new Error(`Failed to update. Status: ${response.status}`);
            }
            update = false;
            showNotification('Phone number updated successfully!', true);
            document.querySelector('#phone').innerHTML = document.querySelector('#new-phone').value;
            swithPhone();
        } catch (error) {
            showNotification('Phone number is not valid!', false);
            console.error('Error updating user:', error);
        }
    }
    updatePhone();
})
