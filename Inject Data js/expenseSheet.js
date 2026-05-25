async function loadExpenses() {
    const response = await fetch("http://localhost:5000/expenses");
    const expenses = await response.json();

    const tableBody = document.getElementById("expenseBody")

    expenses.forEach(function(expense) {
        const row = `
        <tr>
        <td>${new Date(expense.date).toLocaleDateString("en-IN")}</td>
        <td>${expense.expenseType}</td>
        <td>${expense.description}</td>
        <td>₹${Number(expense.amount).toFixed(2)}</td>
        <td>${expense.paidTo}</td>
        <td>${expense.mode}</td>
        </tr>
        `;
        tableBody.innerHTML += row;
    });
}
loadExpenses();