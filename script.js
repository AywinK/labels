document.addEventListener("paste", e => {
    e.preventDefault();
    const dataArr = e.clipboardData.getData("text");
    console.log(dataArr);
    const joinedArr = [];
    let str = "";
    for (data of dataArr) {
        console.log(/\s/.test(data))
        if (/\s/.test(data)) {
            joinedArr.push(str);
            str = "";
        } else {
            str += data
        }
    }
    joinedArr.push(str);

    console.log(joinedArr);
    const joinedArrFilteredEmptyStr = joinedArr.filter(element => (element !== ""));
    console.log(joinedArrFilteredEmptyStr);
    const arrOfParts = [];
    for (let i = 0; i < joinedArrFilteredEmptyStr.length; i += 5) {
        let tempArr = [];
        tempArr.push(joinedArrFilteredEmptyStr[i]);
        tempArr.push(joinedArrFilteredEmptyStr[i + 1]);
        tempArr.push(joinedArrFilteredEmptyStr[i + 2]);
        tempArr.push(joinedArrFilteredEmptyStr[i + 3]);
        tempArr.push(joinedArrFilteredEmptyStr[i + 4]);
        arrOfParts.push(tempArr.filter(el => (!!el)));
    }

    console.log(arrOfParts);
    const arrOfPartsObj = [];
    for (const arr of arrOfParts) {
        arrOfPartsObj.push(new Part(...arr));
    }
    console.table(arrOfPartsObj);
    const arrOfPartsObjHtml = arrOfPartsObj.map(labelObj => labelObj.generateLabel());
    console.log(arrOfPartsObjHtml);

    const arrOfRowsOfPartsObjHtml = [];
    for (let i = 0; i < arrOfPartsObjHtml.length; i += 3) {
        let tempArr = [];
        tempArr.push(arrOfPartsObjHtml[i]);
        tempArr.push(arrOfPartsObjHtml[i + 1]);
        tempArr.push(arrOfPartsObjHtml[i + 2]);
        arrOfRowsOfPartsObjHtml.push(tempArr.filter(el => (!!el)));
    }
    console.log(arrOfRowsOfPartsObjHtml);

    const arrOfPagesOfRows = [];
    for (let i = 0; i < arrOfRowsOfPartsObjHtml.length; i += 9) {
        let tempArr = [];
        for (let j = 0; j < 9; j++) {
            tempArr.push(arrOfRowsOfPartsObjHtml[i + j]);
        }
        arrOfPagesOfRows.push(tempArr.filter(el => (!!el)));
    }
    console.log(arrOfPagesOfRows);

    const arrOfRowEl = arrOfRowsOfPartsObjHtml.map(labelsArr => createRowEl(labelsArr));
    console.log(arrOfRowEl);
});

class Part {
    constructor(...partdetails) {
        this.partNumber = partdetails[0];
        this.sheetNumber = partdetails[1];
        this.van = partdetails[2];
        this.edging = partdetails[3];
        this.location = partdetails[4];
    }

    generateLabel() {
        const labelEl = document.createElement("div");
        labelEl.classList.add("label");

        const partNumEl = document.createElement("span");
        partNumEl.classList.add("partNumber");
        partNumEl.innerText = `${this.partNumber}`;

        const vanEl = document.createElement("span");
        vanEl.classList.add("van");
        vanEl.innerText = `${this.van}`;

        const sheetNumEl = document.createElement("span");
        sheetNumEl.classList.add("sheetNumber");
        sheetNumEl.innerText = `${this.sheetNumber}`;

        const edgingEl = document.createElement("span");
        edgingEl.classList.add("edging");
        edgingEl.innerText = `${this.edging}`;

        const locationEl = document.createElement("span");
        locationEl.classList.add("location");
        locationEl.innerText = `${this.location}`;

        labelEl.appendChild(partNumEl);
        labelEl.appendChild(vanEl);
        labelEl.appendChild(sheetNumEl);
        labelEl.appendChild(edgingEl);
        labelEl.appendChild(locationEl);

        return labelEl;
    }
}

function createRowEl(arrOfThreeLabels) {
    const rowEl = document.createElement("div");
    for (const labelEl of arrOfThreeLabels) {
        rowEl.appendChild(labelEl);
    }
    return rowEl;
}

function createPageEl(arrOfNineRows) {
    const pageEl = document.createElement("div");
    for (const rowEl of arrOfNineRows) {
        pageEl.appendChild(rowEl);
    }
    return pageEl;
}

// const test = new Part(1, 2, 3, 4, 5).generateLabel();
// document.querySelector("#container").appendChild(test);