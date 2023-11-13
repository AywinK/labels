const express = require('express');
const cors = require("cors");
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const app = express();
const port = process.env.PORT || 8080
app.use(express.json());
app.use(cors());


class Part {
    constructor(...partdetails) {
        this.partNumber = partdetails[0];
        this.sheetNumber = partdetails[1];
        this.van = partdetails[2];
        this.edging = String(partdetails[3]).toUpperCase();
        this.location = partdetails[4];
    }

    generateLabel() {

        return `<div class="label">
        <span class="partNumber">${this.partNumber}</span><span class="van">${this.van}</span><span class="sheetNumber">${this.sheetNumber}</span><span class="edging ${this.addEdgingColour()}">${this.edging}</span><span class="location">${this.location}</span></div>`;

        // const labelEl = document.createElement("div");
        // labelEl.classList.add("label");

        // const partNumEl = document.createElement("span");
        // partNumEl.classList.add("partNumber");
        // partNumEl.innerText = `${this.partNumber}`;

        // const vanEl = document.createElement("span");
        // vanEl.classList.add("van");
        // vanEl.innerText = `${this.van}`;

        // const sheetNumEl = document.createElement("span");
        // sheetNumEl.classList.add("sheetNumber");
        // sheetNumEl.innerText = `${this.sheetNumber}`;

        // const edgingEl = document.createElement("span");
        // edgingEl.classList.add("edging");
        // const hasValidEdging = this.addEdgingColour();
        // if (hasValidEdging) {
        //     edgingEl.classList.add(this.addEdgingColour());
        // }
        // edgingEl.innerText = `${this.edging}`;

        // const locationEl = document.createElement("span");
        // locationEl.classList.add("location");
        // locationEl.innerText = `${this.location}`;

        // labelEl.appendChild(partNumEl);
        // labelEl.appendChild(vanEl);
        // labelEl.appendChild(sheetNumEl);
        // labelEl.appendChild(edgingEl);
        // labelEl.appendChild(locationEl);

        // return labelEl;
    }
    addEdgingColour() {
        switch (this.edging.toUpperCase()) {
            case "H":
                return "h"
            case "C":
                return "c"
            case "SM":
                return "sm"
            case "SP":
                return "sp"
            case "N":
                return "n"
            case "T":
                return "t"
            default:
                return ""
        }
    }
}

function createRowEl(...arrOfThreeLabels) {

    return `<div class="row">${arrOfThreeLabels.join("")}</div>`.replace(/,/g, "")

    // const rowEl = document.createElement("div");
    // rowEl.classList.add("row")
    // for (const labelEl of arrOfThreeLabels) {
    //     rowEl.appendChild(labelEl);
    // }
    // return rowEl;
}

function createPageEl(...arrOfNineRows) {

    return `<div class="page">${arrOfNineRows.join("")}</div>`.replace(/,/g, "")

    // console.log(nodeArrOfNineRows);
    // const pageEl = document.createElement("div");
    // pageEl.classList.add("page")
    // for (let i = 0; i < nodeArrOfNineRows.length; i++) {
    //     pageEl.appendChild(nodeArrOfNineRows[i]);
    // }
    // return pageEl;
}


// Convert HTML to PDF route
app.post('/', async (req, res) => {
    const dataArr = req.body.dataArr;

    //
    const joinedArr = [];
    let str = "";
    for (data of dataArr) {
        if (/\n/.test(data)) {
            joinedArr.push(str);
            str = "";
        } else {
            str += data
        }
    }
    joinedArr.push(str);

    const joinedArrFilteredEmptyStr = joinedArr.map(str => str.split(/\t+/));
    const arrOfParts = joinedArrFilteredEmptyStr.map(arr => arr.map(str => str.replace(/\r/, "")));

    const arrOfPartsObj = [];
    for (const arr of arrOfParts) {
        arrOfPartsObj.push(new Part(...arr));
    }
    arrOfPartsObj.sort((a, b) => {
        const edgeA = a.edging.toUpperCase();
        const edgeB = b.edging.toUpperCase();

        if (edgeA < edgeB) return -1;
        if (edgeA > edgeB) return 1;
        return 0;
    });
    const arrOfPartsObjHtml = arrOfPartsObj.map(labelObj => labelObj.generateLabel());

    const arrOfRowsOfPartsObjHtml = [];
    for (let i = 0; i < arrOfPartsObjHtml.length; i += 3) {
        let tempArr = [];
        tempArr.push(arrOfPartsObjHtml[i]);
        tempArr.push(arrOfPartsObjHtml[i + 1]);
        tempArr.push(arrOfPartsObjHtml[i + 2]);
        arrOfRowsOfPartsObjHtml.push(createRowEl(tempArr.filter(el => (!!el))));
    }

    const arrOfPagesOfRows = [];
    for (let i = 0; i < arrOfRowsOfPartsObjHtml.length; i += 9) {
        let tempArr = [];
        for (let j = 0; j < 9; j++) {
            tempArr.push(arrOfRowsOfPartsObjHtml[i + j]);
        }
        arrOfPagesOfRows.push(createPageEl(tempArr.filter(el => (!!el))));
    }

    const fullHTML = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Your PDF Title</title>
                <style>
                @import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');
                
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                @page {
                    size: auto;
                    margin: 0cm;
                }
                
                body {
                    width: 100%;
                    height: 100%;
                    font-family: "Roboto", Arial, sans-serif;
                }
                
                .page {
                    width: 100%;
                    height: 100%;
                    padding: 15.1mm 7.2mm;
                    page-break-after: always;
                    break-after: always;
                }
                
                .row {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 2.55mm;
                    /* Adjust the gap as needed */
                }
                
                .label {
                    border: 0mm solid black;
                    /* Use thin borders suitable for printing */
                    border-radius: 5mm;
                    /* Rounded borders */
                    width: 63.5mm;
                    /* Adjust the width as needed */
                    height: 29.6mm;
                    /* Adjust the height as needed */
                    padding: 5mm;
                
                    display: grid;
                    gap: 0mm;
                    /* Adjust the gap as needed */
                    grid-template-rows: repeat(3, 1fr);
                    grid-template-columns: repeat(2, 1fr);
                    grid-template-areas:
                        "partNumber partNumber"
                        "van sheetNumber"
                        "edging location";
                
                    >* {
                        text-align: center;
                        align-self: center;
                        justify-self: center;
                        font-size: 4.3mm;
                        /* Adjust the font size as needed */
                    }
                }
                
                .partNumber {
                    grid-area: partNumber;
                    font-weight: bold;
                    font-size: 7mm;
                    /* Adjust the font size as needed */
                }
                
                .van {
                    grid-area: van;
                }
                
                .sheetNumber {
                    grid-area: sheetNumber;
                }
                
                .edging {
                    grid-area: edging;
                    padding: 1mm 2mm;
                    font-weight: 900;
                    border-radius: 1000px;
                
                    @import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');
                }
                
                .sm {
                    background-color: green;
                
                }
                
                .sp {
                    background-color: rgb(0, 140, 255);
                
                }
                
                .n {
                    background-color: whitesmoke;
                    color: blue;
                
                }
                
                .t {
                    background-color: orange;
                }
                
                .h {
                    background-color: red;
                }
                
                .c {
                    background-color: yellow;
                }
                
                @media print {
                    body {
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                }
                </style>
            </head>
            <body>
                ${arrOfPagesOfRows.join('')}
            </body>
            </html>
        `;

    // res.contentType('text/html');

    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    await page.setContent(fullHTML);
    const pdfBuffer = await page.pdf({ format: "A4" });
    await browser.close();

    const tmpFolderPath = "/tmp";
    let writeStream = fs.createWriteStream(tmpFolderPath + "/labels.pdf");
    writeStream.on("finish", function () {
        const fileContent = fs.readFileSync("/tmp/labels.pdf");

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=labels.pdf`);
        res.send(fileContent);

    })
    // const pdfFilePath = path.join(tmpFolderPath, "labels.pdf");
    // fs.writeFileSync(pdfFilePath, pdfBuffer);

    // Set the response headers
    // res.setHeader('Content-Type', 'application/pdf');
    // res.setHeader('Content-Disposition', `attachment; filename=labels.pdf`);

    // Send the PDF buffer
    // res.send(pdfFilePath);

    // res.send(fullHTML);
});

app.get("/", (req, res) => {
    const fileContent = fs.readFileSync("/tmp/labels.pdf");
    res.sendFile(fileContent);
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
