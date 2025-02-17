const backendURL = "https://your-backend-url.com"; // Change this

function activate() {
    const key = document.getElementById("activation-key").value;
    fetch(`${backendURL}/api/activate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            document.getElementById("activation-screen").style.display = "none";
            document.getElementById("game-container").style.display = "block";
        } else {
            let msg = document.getElementById("activation-message");
            msg.innerText = data.message;
            msg.style.color = "red";
        }
    })
    .catch(err => console.error("Activation Error:", err));
}

function startGame() {
    const mineCount = parseInt(document.getElementById("mine-count").value);
    const serverSeed = document.getElementById("server-seed").value;
    const clientSeed = document.getElementById("client-seed").value;

    if (!serverSeed || !clientSeed) {
        alert("Enter both server & client seeds!");
        return;
    }

    document.getElementById("buffering").style.display = "block";

    fetch(`${backendURL}/api/generate-mines`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mineCount, serverSeed, clientSeed }),
    })
    .then(res => res.json())
    .then(data => {
        document.getElementById("buffering").style.display = "none";
        displayMines(data.mines, data.gems);
    })
    .catch(err => console.error("Mine Generation Error:", err));
}

function displayMines(mines, gems) {
    const grid = document.getElementById("grid");
    grid.innerHTML = "";

    for (let i = 0; i < 25; i++) {
        let tile = document.createElement("div");
        tile.classList.add("tile");
        
        if (mines.includes(i)) {
            tile.innerHTML = '<i class="fi fi-ss-bomb"></i>';
            tile.classList.add("mine");
        } else if (gems.includes(i)) {
            tile.innerHTML = '<i class="fi fi-sr-gem"></i>';
            tile.classList.add("gem");
        }

        grid.appendChild(tile);
    }
}