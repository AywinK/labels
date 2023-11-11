const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const port = 3000;




// Convert HTML to PDF route
app.get('/', async (req, res) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Your script goes here to generate HTML
    const generatedHTML = await page.evaluate(() => {
        
    });

    await page.setContent(generatedHTML);

    // Generate PDF
    const pdfBuffer = await page.pdf({ format: 'A4' });

    await browser.close();

    // Send the PDF as a response
    res.contentType('application/pdf');
    res.send(pdfBuffer);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
