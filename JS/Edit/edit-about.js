const editAbout = document.querySelector('.edit-about');
const conAbout = document.querySelector('.con-about');
const text = document.querySelector('.about-content');
const requestEdit = async function () {
    const response = await fetch(`https://pharmalink.runasp.net/api/profile/ChangeAboutUs`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // if needed  
        },
        body: JSON.stringify({
            aboutUs: text.value
        })
    });
    showNotification('saved successfully!', true);
}
editAbout.addEventListener('click', function () {
    if (update) return;
    update = true;
    editAbout.classList.add('hidden')
    conAbout.classList.remove('hidden')
    text.readOnly = false;
    text.focus();
    text.classList.add('active-about')
})
conAbout.addEventListener('click', function () {
    update = false;
    editAbout.classList.remove('hidden')
    conAbout.classList.add('hidden')
    text.classList.remove('active-about')
    text.readOnly = true;
    requestEdit();
})
