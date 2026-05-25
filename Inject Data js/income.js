const incomeButton = document.querySelector("#incomeButton")

if (incomeButton) {
    incomeButton.addEventListener("click", async function(e) {
    window.location.href = "../Display Pages/income.html";
    }
    )};

async function loadIncomeSheet() {

    const response = await fetch("http://https://gst-invoice-accounting-system.onrender.com/invoices");

    if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || "Failed to load invoices");
        return;
    }

    const invoices = await response.json();

    const tableBody = document.querySelector("#incomeTableBody")

    if (!tableBody) return;

    invoices.forEach(function (invoice) {
        const row = `
            <tr>
            <td>${new Date(invoice.invoiceDate).toLocaleDateString("en-IN")}</td>
            <td>${invoice.invoiceNumber}</td>
            <td>${invoice.client.name}</td>
            <td>${invoice.services[0].name}</td>
            <td>₹${Number(invoice.total).toFixed(2)}</td>
            <td>${invoice.paymentMode}</td>
            </tr>
        `;

        tableBody.innerHTML += row;
    });
}

loadIncomeSheet();