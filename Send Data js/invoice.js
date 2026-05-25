document.querySelector(".form").addEventListener("submit", async function(e) {
    e.preventDefault();

    const time = new Date();
    const invoiceDate = time.toISOString();

    const due = new Date();
    due.setDate(time.getDate() + 7);
    const dueDate = due.toISOString();
    
    const clientName = document.getElementById("clientName").value 

    const companyName = document.getElementById("companyName").value

    const address = document.getElementById("address").value

    const gstin = document.getElementById("gstin").value

    const contact = document.getElementById("contact").value

    const dropdownServices = document.getElementById("dropdownServices").value

    const description = document.getElementById("description").value

    const quantity = Number(document.getElementById("quantity").value)

    const rate = Number(document.getElementById("rate").value)

    const state = document.getElementById("stateGst").value

    const amount = quantity * rate

    const subtotal = amount

    let CGST = 0

    let SGST = 0

    let IGST = 0

    if (state === "sameState") {
    CGST = subtotal * 0.09
    SGST = subtotal * 0.09
} else if (state === "interState") {
    IGST = subtotal * 0.18
}

const total = subtotal + CGST + SGST + IGST;

const paymentMode = document.getElementById("paymentMode").value

const data = {
    invoiceDate,
    dueDate,

    client: {
    name: clientName,
    company: companyName,
    address,
    gstin,
    contact,
    },

    services: [
        {
        name: dropdownServices,
        description,
        qty: quantity,
        rate,
        amount,
        }
    ],
    
    subtotal,

    tax: {
    cgst: CGST,
    sgst: SGST,
    igst: IGST,
    },
    
    total,
    paymentMode,
}

    function validateInvoice(data) {
    if (data.client.name === "") {
        alert("Client name is required");
        return false;
    }

    if (data.client.name.length > 30) {
        alert("Client name must be 30 characters or less");
        return false;
    }

    if (data.client.company === "") {
        alert("Company name is required");
        return false;
    }

    if (data.client.company.length > 50) {
        alert("Company name must be 50 characters or less");
        return false;
    }

    if (data.client.address === "") {
        alert("Address is required");
        return false;
    }

    if (data.client.address.length > 150) {
        alert("Address must be 150 characters or less");
        return false;
    }

    if (data.client.gstin !== "" && data.client.gstin.length !== 15) {
        alert("GSTIN must be exactly 15 characters");
        return false;
    }

    if (data.client.contact === "") {
        alert("Contact number is required");
        return false;
    }

    if (data.client.contact.length !== 10) {
        alert("Contact number must be exactly 10 digits");
        return false;
    }

    if (data.services[0].name === "") {
        alert("Please select a service");
        return false;
    }

    if (data.services[0].qty < 1) {
        alert("Quantity must be at least 1");
        return false;
    }

    if (data.services[0].rate <= 0) {
        alert("Rate must be greater than 0");
        return false;
    }
    
    if (data.paymentMode === "") {
        alert("Please select a payment mode");
        return false;
    }

    return true;
}

if (!validateInvoice(data)) {
    return false;
}

const response = await fetch("https://gst-invoice-accounting-system.onrender.com/invoices", {
    method: "POST",
    headers: { "Content-Type": "application/json"},
    body: JSON.stringify(data),
});

if (!response.ok) {
    const errorData = await response.json();
    alert(errorData.error || "Failed to save invoice");
    return;
}
const savedInvoice = await response.json();

window.location.href = `../Display Pages/index.html?id=${savedInvoice._id}`;
});