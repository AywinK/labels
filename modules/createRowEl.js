function createRowEl(arrOfThreeLabels) {
    const rowEl = document.createElement("div");
    rowEl.classList.add("row")
    for (const labelEl of arrOfThreeLabels) {
        rowEl.appendChild(labelEl);
    }
    return rowEl;
}