const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const path = require("path");

app.use(express.static(path.join(__dirname, "../")));

const PORT = process.env.PORT || 5000;
    
const puppeteer = require("puppeteer");

async function generateInvoicePDF(savedInvoice) {   
    const invoiceNumber = savedInvoice.invoiceNumber;

    const clientName = savedInvoice.client.name;

    const invoiceDate = new Date(savedInvoice.invoiceDate);

    const year = invoiceDate.getFullYear();

    const monthName = invoiceDate.toLocaleString("default", {
    month: "long"
    });

    const fileName = `${invoiceNumber}_${clientName}.pdf`;
    const folderPath = `Invoices/${year}/${monthName}`;

    const fs = require('fs');

    const fullFolderPath = path.join(__dirname, "..", folderPath);

    if (!fs.existsSync(fullFolderPath)) {
        fs.mkdirSync(fullFolderPath, {recursive : true});
    }

    const fullPdfPath = path.join(fullFolderPath, fileName);

    // PDF Generation block
    
    try {
    console.log("browser launching")

    const browser = await puppeteer.launch();

    console.log("browser reached")

    const page = await browser.newPage();

    console.log("browser created new page")

    const invoicePageUrl = `http://localhost:${PORT}/Display%20Pages/index.html?id=${savedInvoice._id}`;

    await page.goto(invoicePageUrl, {
    waitUntil: "networkidle0"
    });
    
    console.log("Page Loaded")

    await page.waitForFunction(() => {
    const invoiceNumber = document.getElementById("invoiceNumber");
    return invoiceNumber && invoiceNumber.textContent.trim().length > 0;
    }, { timeout: 5000});

    console.log("Invoice Rendered")

    await page.pdf({
    path: fullPdfPath,
    format: "A4",
    printBackground: true
});

console.log("pdf saved")

await browser.close();

return fullPdfPath;

} catch (error) {

    console.error('PDF GENERATION ERROR:', error);
}
}

mongoose
    .connect(process.env.MONGO_URI, {
    })
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((error) => {
        console.log("MongoDB connection failed:", error.message);
    });


const Invoice = require("./models/invoice");


//GET DATA FROM INVOICE.JS 

app.post("/invoices", async (req, res) => {

    // Creates Invoice No.
  try {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");

    const monthStart = new Date(year, now.getMonth(), 1);
    const nextMonthStart = new Date(year, now.getMonth() + 1, 1);

    const invoiceCount = await Invoice.countDocuments({
      createdAt: {
        $gte: monthStart,
        $lt: nextMonthStart}
    });

    const nextNumber = String(invoiceCount + 1).padStart(3, "0");

    const invoiceNumber = `INV-${year}-${month}-${nextNumber}`;

    const invoice = new Invoice({
      ...req.body,
      invoiceNumber
    });


    // Turns Invoice into a PDF File
    const savedInvoice = await invoice.save(); 
    
    const pdfPath = await generateInvoicePDF(savedInvoice);
   
    if (!pdfPath) {
        return res.status(500).json({error: "Invoice saved, but PDF generation failed "})
    }
    savedInvoice.pdfPath = pdfPath; // what even is this?
    await savedInvoice.save(); // we save savedInvoice? wtf
    res.json(savedInvoice); 
}

catch (error) {
    res.status(500).json({error: error.message});
}
});


// SEND DATA TO INVOICE.JS 
app.get("/invoices", async(req, res) => {
    try {
        const invoices = await Invoice.find();
        res.json(invoices);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

// SEND DATA TO INCOME.JS
app.get("/invoices/:id", async (req,res) => {
    try {
        const invoice = await Invoice.findById(req.params.id);

        if (!invoice) {
            return res.status(404).json({error: "Invoice not found"});
    }

    res.json(invoice)
    } catch (error) {
        res.status(500).json({error: "Invoice not found"});
    }
});

// GETS DATA FROM EXPENSE.JS

const Expense = require("./models/expense");

app.post("/expenses", async (req, res) => {
    try {
    const expense = new Expense(req.body);
    const savedExpense = await expense.save();
    res.json(savedExpense);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});

// DATA SENT BACK TO EXPENSE.JS

app.get("/expenses", async (req, res) => {
    try {
        const expenses = await Expense.find();
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Helps to Clear Past Invoices
app.delete("/clear-invoices", async (req, res) => {
    try {
        await Invoice.deleteMany({});
        await Expense.deleteMany({});

        res.json({ message: "All Invoices have been deleted successfully"});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../home.html"));
});

app.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT}`)
});
