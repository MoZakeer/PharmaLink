"use strict";
document.querySelector(".requests").classList.add("active");
// URLS
const allRequestsURL = "https://pharmalink.runasp.net/api/requests";
const acceptRequestURL = "https://pharmalink.runasp.net/api/account/register/";
const rejectRequestURL = "https://pharmalink.runasp.net/api/requests/";
// ELEMENTS
const requestsBody = document.querySelector(".requests-body");
//  GET ALL REQUEST FROM API
async function getAllRequest(url, token) {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch company orders: ${response.status}`);
  }
  const data = await response.json();
  return data;
}
// ACCEPT REQUEST
async function acceptRequest(url, token) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({}),
  });

  if (!response.ok) {
    throw new Error(`POST request failed: ${response.status}`);
  }
}
// REJECT REQUEST
async function rejectRequest(url, token) {
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  if (!response.ok) {
    throw new Error(`Cand: ${response.status}`);
  }
}
// CREATE REQUEST
const createReqeust = function (request) {
  const { id, pharmacy_Name, dR_Name, phone, license_File } = request;
  const html = `
          <tr data-request-id=${id}>
            <td>${pharmacy_Name}</td>
            <td>${dR_Name}</td>
            <td>${phone}</td>
            <td>
              <a href="${license_File}" class="file" target="_blank">
                <i class="fa-solid fa-file-lines"></i>
              </a>
            </td>
            <td>
              <button class="btn reject">reject</button>
              <button class="btn accept">accept </button>
            </td>
          </tr>`;
  requestsBody.insertAdjacentHTML("beforeend", html);
};
// ADD REQUEST
async function displayAllRequests() {
  const requests = await getAllRequest(`${allRequestsURL}`, token);
  requests.forEach(function (request) {
    createReqeust(request);
  });
}
displayAllRequests();

requestsBody.addEventListener("click", async function (e) {
  const btn = e.target;
  if (!btn.classList.contains("accept") && !btn.classList.contains("reject"))
    return;
  const row = btn?.closest("tr");
  const id = +row.dataset.requestId;
  if (btn.classList.contains("reject")) {
    await rejectRequest(`${rejectRequestURL}${id}`, token);
    row.remove();
    showNotification("Request rejected!", false);
  } else if (btn.classList.contains("accept")) {
    await acceptRequest(`${acceptRequestURL}${id}`, token);
    row.remove();
    showNotification("Request accepted!", true);
  }
});
