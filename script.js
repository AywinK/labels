document.addEventListener("paste", e => {
    e.preventDefault();
    const dataArr = e.clipboardData.getData("text");
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
    console.log(joinedArr);
    const joinedArrFilteredEmptyStr = joinedArr.filter(element => (element !== ""));
    console.log(joinedArrFilteredEmptyStr);
    const arrOfParts = [];
    for (let i = 0; i < joinedArrFilteredEmptyStr.length; i += 5) {
        arrOfParts.push(joinedArrFilteredEmptyStr[i]);
    }
for (const arr of arrOfParts) {
    for (let i = 1; i < joinedArrFilteredEmptyStr.length; i += 5) {
        arr.push(joinedArrFilteredEmptyStr[i]);
    }
}
    console.log(arrOfParts);
})