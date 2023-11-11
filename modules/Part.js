class Part {
    constructor(...partdetails) {
        this.partNumber = partdetails[0];
        this.sheetNumber = partdetails[1];
        this.van = partdetails[2];
        this.edging = String(partdetails[3]).toUpperCase();
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
        const hasValidEdging = this.addEdgingColour();
        if (hasValidEdging) {
            edgingEl.classList.add(this.addEdgingColour());
        }
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