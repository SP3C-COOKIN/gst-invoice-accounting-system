document.getElementById("dashboardBtn").addEventListener("click", async function(e) {
    const selectedMonth = document.getElementById("month").value;

    if (selectedMonth === "") {
        alert("Please select a month");
        return;
    }

    const currentYear = new Date().getFullYear();
    const selectedYearMonth = `${currentYear}-${selectedMonth}`;

    const monthNames = {
    "01": "January",
    "02": "February",
    "03": "March",
    "04": "April",
    "05": "May",
    "06": "June",
    "07": "July",
    "08": "August",
    "09": "September",
    "10": "October",
    "11": "November",
    "12": "December"
};

const selectedMonthName = monthNames[selectedMonth];

    const invoiceResponse = await fetch("https://gst-invoice-accounting-system.onrender.com/invoices");
    const expenseResponse = await fetch("https://gst-invoice-accounting-system.onrender.com/expenses");

    const invoices = await invoiceResponse.json();
    const expenses = await expenseResponse.json();

    let totalIncome = 0;
    let totalExpense = 0;

    invoices.forEach(function(invoice) {
        const invoiceMonth = getYearMonthFromDate(invoice.invoiceDate);

        if (invoiceMonth === selectedYearMonth) {
            totalIncome += Number(invoice.total);
        }
        console.log(invoice.invoiceDate, invoiceMonth, selectedYearMonth);
    });

    expenses.forEach(function(expense) {
        const expenseMonth = getYearMonthFromDate(expense.date);

        if (expenseMonth === selectedYearMonth) {
            totalExpense += Number(expense.amount);
        }        
    });

    if (totalIncome === 0 && totalExpense === 0) {
            alert("No Invoices record found for this month")
        }
    const profit = totalIncome - totalExpense;

    document.getElementById("monthName").textContent = selectedMonthName;
    document.getElementById("income").textContent = totalIncome.toFixed(2);
    document.getElementById("expense").textContent = totalExpense.toFixed(2);
    document.getElementById("total").textContent = profit.toFixed(2);
});

function getYearMonthFromDate(dateValue) {
    const date = new Date(dateValue);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");

    return `${year}-${month}`;
}