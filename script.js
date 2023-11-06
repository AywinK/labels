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
        arrOfParts.push(tempArr);
    }

    console.log(arrOfParts);
    const arrOfPartsObj = [];
    for (const arr of arrOfParts) {
        arrOfPartsObj.push(new Part(...arr));
    }
    console.table(arrOfPartsObj);
    const arrOfPartsObjHtml = arrOfPartsObj.map(labelObj => labelObj.generateLabel());
    console.log(arrOfPartsObjHtml);
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
        const htmlStr = `
        <div class="label">
        <span class="partNumber">${this.partNumber}</span>
        <span class="van">${this.van}</span>
        <span class="sheetNumber">${this.sheetNumber}</span>
        <span class="edging">${this.edging}</span>
        <span class="location">${this.location}</span>
    </div>
        `;
        return htmlStr;
    }
}


const test = new Part(1, 2, 3, 4, 5).generateLabel();
console.log(document.querySelector("#container"));
document.querySelector("container").innerHTML(test);