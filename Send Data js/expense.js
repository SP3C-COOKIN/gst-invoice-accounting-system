form = document.querySelector("#expenseForm")
form.addEventListener("submit", async function(e) {
    e.preventDefault();

    const date = document.getElementById("date").value;
    const expenseType = document.getElementById("expenseType").value;
    const description = document.getElementById("description").value;
    const amount = Number(document.getElementById("amount").value);
    const paidTo = document.getElementById("paidTo").value;
    const mode = document.getElementById("paymentMode").value;

    const expense = {
        date,
        expenseType,
        description,
        amount,
        paidTo,
        mode
    };

    function validateExpense(expense) {

        if (expenseType === "") {
            alert("choose an expense type");
            return false;
        }
        if (description.length > 150) {
            alert("Description must be less than 150 characters");
            return false;
        }
        if (amount === "" || isNaN(amount) || amount < 0) {
            alert("amount cannot be less than 0");
            return false;
        }
        if (paidTo === "") {
            alert("Fill the paid to box");
            return false;
        }
        if (paidTo.length > 50) {
            alert("paid to must be less than 50 characters");
            return false;
        }
        if (mode === "") {
            alert("choose a payment mode");
            return false;
        }
        return true;
    }

    if (!validateExpense(expense)) {
        return false;
    }

    const response = await fetch("http://https://gst-invoice-accounting-system.onrender.com/expenses", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(expense)
    });
    
if (!response.ok) {
    const errorData = await response.json();
    alert(errorData.error || "Failed to save invoice");
    return;
}
    const savedExpense = await response.json();
    alert("Expense Sheet saved");
    form.reset();
});