const API_URL = "https://pharmalink.runasp.net/api/Medicine";
document.querySelector(".products").classList.add("active");

const titleInput = document.getElementById("title");
const priceInput = document.getElementById("price");
const stockInput = document.getElementById("count");
const descriptionInput = document.getElementById("description");
const imageInput = document.getElementById("imageInput");
const tableBody = document.getElementById("tableBody");
const searchTitleInput = document.getElementById("searchTitle");

let currentItemId = null;

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

function displayMedicines(medicines) {
  tableBody.innerHTML = "";
  medicines.forEach((medicine) => {
    let imageUrl = medicine.imageUrl;
    if (imageUrl.includes("uploads")) {
      imageUrl =
        "https://pharmalink.runasp.net/" +
        imageUrl.slice(imageUrl.indexOf("uploads"));
    }
    // console.log("name here",medicine.medicineName)
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${medicine.id}</td>
      <td>${medicine.medicineName}</td>
      <td>${medicine.price}</td>
      <td>${medicine.inStock}</td>
      <td class='disc'>${medicine.description}</td>
      <td><img src="${imageUrl}" style="width: 50px; height: 50px; object-fit: cover;"></td>
      <td><button class="btn btn-info w-100" onclick="prepareUpdate(${medicine.id})">Update</button></td>
      <td><button class="btn btn-danger w-100" onclick="deleteItem(${medicine.id})">Delete</button></td>
    `;
    tableBody.appendChild(row);
  });
}

async function getCompanyMedicines() {
  try {
    const response = await fetch(
      "https://pharmalink.runasp.net/api/Medicine/CompanyMedicnines",
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    if (!response.ok) throw new Error(`https error! status: ${response.status}`);

    const medicines = await response.json();

    displayMedicines(medicines);
  } catch (error) {
    console.error("Error fetching company medicines:", error);
    alert("Failed to fetch company medicines.");
  }
}

// Function to validate inputs
function validateInputs() {
  if (!titleInput.value.trim()) {
    alert("Please enter a title!");
    return false;
  }
  if (
    !priceInput.value ||
    isNaN(priceInput.value) ||
    parseFloat(priceInput.value) <= 0
  ) {
    alert("Please enter a valid price!");
    return false;
  }
  if (
    !stockInput.value ||
    isNaN(stockInput.value) ||
    parseInt(stockInput.value) < 0
  ) {
    alert("Please enter a valid stock count!");
    return false;
  }
  if (!descriptionInput.value.trim()) {
    alert("Please enter a description!");
    return false;
  }
  return true;
}

// Function to create a new item
async function createItem() {
  if (!validateInputs()) return;

  const file = imageInput.files[0];
  if (!file) {
    // alert("Please upload an image!");
    return;
  }

  try {
    const base64Image = await getBase64(file);

    const formData = new FormData();
    formData.append("Name", titleInput.value.trim());
    formData.append("description", descriptionInput.value.trim());
    formData.append("Price", parseFloat(priceInput.value));
    formData.append("inStock", parseInt(stockInput.value));
    formData.append("image", imageInput.files[0]);
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    if (!response.ok) {
      const errorData = await response.json();

      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
      throw new Error(
        `Server responded with ${response.status}: ${JSON.stringify(errorData)}`
      );
    }

    // alert("Medicine created successfully!");
    clearForm();
    getCompanyMedicines();
  } catch (error) {
    console.error("Error creating medicine:", error);
    alert("Error: " + error.message);
  }
}
let selectedMedicineId = null;
async function prepareUpdate(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error(`https error! status: ${response.status}`);
    const medicine = await response.json();

    selectedMedicineId = medicine.id;
    currentItemId = medicine.id;

    titleInput.value = medicine.medicineName;
    priceInput.value = medicine.price;
    stockInput.value = medicine.inStock;
    descriptionInput.value = medicine.description;

    const btn = document.querySelector(".create-btn");
    btn.textContent = "Update";
    btn.onclick = updateItem;
  } catch (error) {
    console.error("Error preparing update:", error);
    alert("Failed to fetch medicine for editing!");
  }
}

// 3. Update medicine info
async function updateItem() {
  if (!validateInputs()) return;
  const updatedMedicine = {
    id: currentItemId,
    name: titleInput.value,
    price: parseFloat(priceInput.value),
    inStock: parseInt(stockInput.value),
    description: descriptionInput.value,
  };

  try {
    const response = await fetch(`${API_URL}/${currentItemId}`, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedMedicine),
    });

    if (!response.ok) throw new Error(`https error! status: ${response.status}`);
    // alert("Medicine updated successfully!");
    clearForm();
    getCompanyMedicines();
  } catch (error) {
    console.error("Error updating medicine:", error);
    alert("Failed to update medicine!");
  }
}

// 4. Upload new image
async function updateMedicineImage(currentItemId, imageFile) {
  const formData = new FormData();
  formData.append("img", imageFile);
  // formData.append('medicineId', currentItemId); // رقم التعريف

  try {
    const response = await fetch(
      `https://pharmalink.runasp.net/api/medicine/uploadPhoto/${currentItemId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: "Bearer " + token,
        },
        body: formData,
      }
    );
    console.log("Selected image file:", imageFile);
    console.log("Selected image id:", currentItemId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`https error! status: ${response.status}\n${errorText}`);
    }

    // alert('Image updated successfully!');
    getCompanyMedicines();
  } catch (error) {
    console.error("Error updating image:", error);
    alert("Failed to update image.");
  }
}
document.querySelector(".upload-label").addEventListener("click", () => {
  if (!currentItemId) {
    // alert("Please click Update next to a medicine first.");
    return;
  }

  document.getElementById("imageInput").addEventListener(
    "change",
    function () {
      submitImageUpdate(currentItemId);
    },
    { once: true }
  );

  getCompanyMedicines();
});
function submitImageUpdate(currentItemId) {
  const imageFile = imageInput.files[0];

  if (!imageFile) {
    alert("Please select an image file first.");
    return;
  }
  updateMedicineImage(currentItemId, imageFile);
}

async function deleteItem(id) {
  // if (!confirm("Are you sure you want to delete this medicine?")) return;

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token },
    });
    if (!response.ok) throw new Error(`https error! status: ${response.status}`);
    getCompanyMedicines();
    // alert("Medicine deleted successfully!");
  } catch (error) {
    console.error("Error deleting medicine:", error);
    alert("Failed to delete medicine!");
  }
}

async function searchItems() {
  const searchTitle = searchTitleInput.value.trim().toLowerCase();
  if (!searchTitle) {
    getCompanyMedicines();
    return;
  }

  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`https error! status: ${response.status}`);
    const medicines = await response.json();
    const filteredMedicines = medicines.filter((medicine) =>
      medicine.medicineName.toLowerCase().includes(searchTitle)
    );

    displayMedicines(filteredMedicines);
  } catch (error) {
    console.error("Error searching medicines:", error);
    alert("Failed to search medicines!");
  }
}
// تنظيف النموذج
function clearForm() {
  titleInput.value = "";
  priceInput.value = "";
  stockInput.value = "";
  descriptionInput.value = "";
  imageInput.value = "";
  currentItemId = null;
  const btn = document.querySelector(".create-btn");
  btn.textContent = "Create";
  btn.onclick = createItem;
}

window.onload = getCompanyMedicines;
