const editPass = document.querySelector('.edit-password');
const conPass = document.querySelector('.con-password');
const swithPassword = function () {
    const password = document.querySelector('#password');
    const curPassword = document.querySelector('#current-password');
    const newPassword = document.querySelector('#new-password');
    const confirmPassword = document.querySelector('#confirm-password');
    curPassword.value = '';
    newPassword.value = '';
    confirmPassword.value = '';
    editPass.classList.toggle('hidden');
    conPass.classList.toggle('hidden');
    password.classList.toggle('hidden');
    curPassword.classList.toggle('hidden');
    newPassword.classList.toggle('hidden');
    confirmPassword.classList.toggle('hidden');
}

editPass.addEventListener('click', function () {
    if (update) return;
    update = true;
    swithPassword();
})

const validatePassword = function (password) {
    return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password);
}

conPass.addEventListener('click', function () {
    const currentPassword = document.querySelector('#current-password').value;
    const password = document.querySelector('#new-password').value;
    const confirmPassword = document.querySelector('#confirm-password').value;
    if (password !== confirmPassword) {
        return showNotification('passwords are not equal!', false);
    }
    else if (password.length < 8) {
        return showNotification('password must be at least 8 characters long!', false);
    }
    else if (!validatePassword(password)) {
        return showNotification('password must contain at least one letter, one number and one special character!', false);
    }
    async function updatePassword() {
        try {
            const response = await fetch(`https://pharmalink.runasp.net/api/profile/ChangePassword`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // if needed  
                },

                body: JSON.stringify({
                    username: userName,
                    oldPassword: currentPassword,
                    newPassword: password
                })
            });

            if (!response.ok) {
                showNotification('current password is not valid!', false);
                throw new Error(`Failed to update. Status: ${response.status}`);
            }
            update = false;
            showNotification('password updated successfully!', true);
            swithPassword();
        } catch (error) {
            console.error('Error updating user:', error);
        }
    }
    updatePassword();
})
