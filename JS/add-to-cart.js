// Example usage in addCart function
async function addCart(i) {
  const response = await fetch(
    "https://pharmalink.runasp.net/api/Cart/AddToCart",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id: arr[i]["id"],
        count: 1,
      }),
    }
  );
  if (!response.ok) {
    showNotification(`you can only add from one company`, 0);
  } else {
    showNotification("Item successfully added to cart!", 1);
    added[arr[i]["id"]] = 1;
    // updatelist();
  }
}
