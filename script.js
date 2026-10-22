
let symbols = [];
let marked = [];
let left = -1;
let right = -1;
let stage = "left";
let finished = false;
let running = false;
let timer = null;

function startMachine() {
    clearTimeout(timer);
    running = false;

    const input = document.getElementById("inputString").value;

    if (input.length === 0) {
        alert("Please enter a string!");
        return;
    }

    symbols = input.split("");
    marked = symbols.map(() => false);
    left = -1;
    right = -1;
    stage = "left";
    finished = false;

    showMessage("Machine started. Finding leftmost unmarked symbol.");
    drawTape();
}

function drawTape() {
    const tape = document.getElementById("tape");
    tape.innerHTML = "";

    symbols.forEach((symbol, i) => {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.textContent = marked[i] ? "✓" : symbol;

        if (marked[i]) {
            cell.classList.add("marked");
        }

        if (!finished && (i === left || i === right)) {
            cell.classList.add("active");
        }

        tape.appendChild(cell);
    });

    document.getElementById("headInfo").textContent =
        "Left pointer: " + (left < 0 ? "-" : left + 1) +
        " | Right pointer: " + (right < 0 ? "-" : right + 1);
}

function showMessage(message) {
    document.getElementById("stepInfo").textContent = message;
}

function finish(message, accepted) {
    finished = true;
    running = false;
    clearTimeout(timer);

    document.getElementById("result").textContent = message;
    document.getElementById("result").style.color =
        accepted ? "green" : "red";

    showMessage("Machine halted.");
    drawTape();
}

function nextStep() {
    if (symbols.length === 0) {
        startMachine();
        return;
    }

    if (finished) return;

    document.getElementById("result").textContent = "Processing...";
    document.getElementById("result").style.color = "#183153";

    if (stage === "left") {
        left = -1;
        right = -1;

        for (let i = 0; i < symbols.length; i++) {
            if (!marked[i]) {
                left = i;
                break;
            }
        }

        if (left === -1) {
            finish("ACCEPT: The string is a palindrome!", true);
            return;
        }

        const remaining = marked.filter(value => !value).length;

        if (remaining === 1) {
            marked[left] = true;
            finish("ACCEPT: The string is a palindrome!", true);
            return;
        }

        stage = "right";
        showMessage("Found leftmost unmarked symbol: " +
                    symbols[left] + ". Move to the right end.");
    }

    else if (stage === "right") {
        for (let i = symbols.length - 1; i >= 0; i--) {
            if (!marked[i]) {
                right = i;
                break;
            }
        }

        stage = "compare";
        showMessage("Found rightmost unmarked symbol: " +
                    symbols[right] + ". Ready to compare.");
    }

    else if (stage === "compare") {
        if (symbols[left] !== symbols[right]) {
            drawTape();
            finish("REJECT: The string is not a palindrome!", false);
            return;
        }

        stage = "mark";
        showMessage("Match! Both symbols are " +
                    symbols[left] + ". Mark them.");
    }

    else if (stage === "mark") {
        marked[left] = true;
        marked[right] = true;

        stage = "return";
        showMessage("Both symbols marked. Return to the left side.");
    }

    else if (stage === "return") {
        left = -1;
        right = -1;
        stage = "left";
        showMessage("Returned to the left. Repeat the process.");
    }

    drawTape();
}

function runMachine() {
    if (running) return;

    if (symbols.length === 0 || finished) {
        startMachine();
    }

    running = true;

    function runNext() {
        if (!running || finished) return;

        nextStep();

        if (running && !finished) {
            timer = setTimeout(runNext, 800);
        }
    }

    runNext();
}

function resetMachine() {
    clearTimeout(timer);
    running = false;
    symbols = [];
    marked = [];
    left = -1;
    right = -1;
    stage = "left";
    finished = false;

    document.getElementById("tape").innerHTML = "";
    document.getElementById("headInfo").textContent = "Tape Head: Ready";
    document.getElementById("stepInfo").textContent =
        "Enter a string and click Start.";
    document.getElementById("result").textContent =
        "Waiting for input...";
    document.getElementById("result").style.color = "#183153";
}
