function createPageEl(nodeArrOfNineRows) {
    console.log(nodeArrOfNineRows);
    const pageEl = document.createElement("div");
    pageEl.classList.add("page")
    for (let i = 0; i < nodeArrOfNineRows.length; i++) {
        pageEl.appendChild(nodeArrOfNineRows[i]);
    }
    return pageEl;
}