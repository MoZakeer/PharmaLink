async function changePhoto(formData) {
  let response = await fetch(
    "https://pharmalink.runasp.net/api/profile/uploadPhoto",
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    }
  );
  location.reload();
}

let fileInput = document.querySelector("#file-upload");

fileInput.addEventListener("change", function () {
  const data = new FormData();
  data.append("img", fileInput.files[0]);
  // changePhoto(data);
  // let profile = document.querySelector('.user-profile');
  let header = document.querySelector("header");
  let loader = document.querySelector(".wrapper");
  loader.classList.remove("hidden");
  // profile.classList.add('overlay');
  header.classList.add("overlay");
  document.querySelector("body").classList.add("scroll");
  changePhoto(data);
});
