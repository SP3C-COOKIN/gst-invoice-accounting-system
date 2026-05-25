async function loadInvoice() {

const params = new URLSearchParams(window.location.search); // we check for some parameters and stuff
const id = params.get("id"); // we get the id 

const response = await fetch(`http://https://gst-invoice-accounting-system.onrender.com/invoices/${id}`);

const data = await response.json();

  document.getElementById("invoiceNumber").textContent = data.invoiceNumber;
  document.getElementById("invoiceDate").textContent = new Date(data.invoiceDate).toLocaleDateString("en-IN");
  document.getElementById("dueDate").textContent = new Date(data.dueDate).toLocaleDateString("en-In");

  document.getElementById("clientName").textContent = data.client.name;
  document.getElementById("companyName").textContent = data.client.company;
  document.getElementById("address").textContent = data.client.address;
  document.getElementById("gstin").textContent = data.client.gstin;
  document.getElementById("contact").textContent = `91+ ${data.client.contact}`;

  document.getElementById("serviceName").textContent = data.services[0].name;
  document.getElementById("description").textContent = data.services[0].description;
  document.getElementById("qty").textContent = data.services[0].qty;
  document.getElementById("rate").textContent = data.services[0].rate;
  document.getElementById("amount").textContent = data.services[0].amount;

  document.getElementById("subtotal").textContent = `₹ ${Number(data.subtotal)}`;
  document.getElementById("totalAmount").textContent = `₹ ${Number(data.total).toFixed(2)}`;
}
function printInvoice() {
  window.print();
}
loadInvoice();


