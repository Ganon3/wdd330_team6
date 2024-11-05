const baseURL = import.meta.env.VITE_SERVER_URL

// http://server-nodejs.cit.byui.edu:3000/checkout
// http://server-nodejs.cit.byui.edu:3000/
// one works for post and one works for showing the poduct page, i dont know why

async function convertToJson(res) {
  const data = await res.json();
  if (res.ok) {
    return data;
  } else {
    throw { name: "servicesError", message: data };
  }
}

// works here
export async function getProductsByCategory(category) {
  const response = await fetch(baseURL + `products/search/${category}`);
    const data = await convertToJson(response);
    return data.Result;
}

export async function findProductById(id) {
  const response = await fetch(baseURL + `product/${id}`);
  const product = await convertToJson(response);
  return product.Result;
}

// here is the post

export async function checkout(payload) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  };
  return await fetch(baseURL + "checkout/", options).then(convertToJson);
}