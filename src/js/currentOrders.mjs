import { getOrders } from "./externalServices.mjs";
import { alertMessage } from "./utils.mjs";

export default async function currentOrders(selector, token) {
    try {
      let orders = await getOrders(token);
      if(orders.length > 10){
        // sort descending
        orders = orders.filter(order => order.orderDate);
        orders = orders.map(order => ({
          ...order,
          orderDate: new Date(order.orderDate),
        }));
        let mostRecentOrders = orders.sort((a, b) => b.orderDate - a.orderDate);
        orders = mostRecentOrders.slice(0, 10);
      }
      const parent = document.querySelector(`${selector} tbody`);
      parent.innerHTML = orders.map(orderTemplate).join("");
    } catch (err) {
      console.log(err);
      if(err.message?.message)
        alertMessage(err.message.message);
    }
  }
  
  function orderTemplate(order) {
    return `<tr><td>${order.id}</td>
    <td>${new Date(order.orderDate).toLocaleDateString("en-US")}</td>
    <td>${order.items.length}</td>
    <td>${order.orderTotal}</td></tr>`;
  }