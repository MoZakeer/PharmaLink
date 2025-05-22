let currentRating = 0, currentComment = "";
async function rating(value, comment) {
    try {
        const response = await fetch(`https://pharmalink.runasp.net/api/Review/${id}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                rating: value,
                review: comment
            })
        });
        if (currentRating != value) {
            localStorage.setItem('message', "thank you for your rating!");
            location.reload();
        }
        getUsers();

    } catch (error) {
        console.error("Error in rating():", error);
    }
}

const starContainer = document.querySelector(".stars");
const stars = document.querySelectorAll(".star");
let debounceTimeout;

// Event delegation for better performance
starContainer.addEventListener("mouseover", (event) => {
    if (event.target.classList.contains("star")) {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            resetStars();
            highlightStars(event.target.dataset.value);
        }, 50); // Debounce to prevent excessive calls
    }
});

starContainer.addEventListener("click", (event) => {
    rating(Number(event.target.dataset.value), currentComment);
});

// Reset all stars to inactive state
function resetStars() {
    stars.forEach((star) => {
        star.classList.remove("active");
    });
}

// Highlight stars up to the given value
function highlightStars(value) {
    stars.forEach((star) => {
        if (star.dataset.value <= value) {
            star.classList.add("active");
        }
    });
}

// Set active stars and update the state
function setActiveStars(value) {
    resetStars();
    highlightStars(value);
}

async function can() {
    const response = await fetch(`https://pharmalink.runasp.net/api/Review/${id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    if (response.status === 204) {
        return;
    }
    const data = await response.json();
    if (data.rating) {
        currentRating = data.rating;
        highlightStars(currentRating);
        // document.querySelector('.rating-container').classList.add('hidden');
    }
    currentComment = data.review;
}
// End rating
//review
let submitReview = document.querySelector('.comment-submit-btn');
let submit = function () {
    // alert(currentRating);
    let comment = document.querySelector('.comment-input');
    if (comment.value === "") {
        return showNotification('please enter a comment!', false);
    }
    rating(currentRating, comment.value);
    showNotification('thank you for your review!', true);
    comment.value = '';
}
submitReview.addEventListener('click', function () {
    submit();
})
document.querySelector('.comment-input').addEventListener('keydown', function (event) {
    if (event.key == 'Enter') submit();
})


