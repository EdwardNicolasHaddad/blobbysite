async function loadBlocks() {

    let { data, error } = await supabaseClient
        .from("blocks")
        .select("*")
        .order("position");


    if (error) {
        console.log(error);
        return;
    }


    let container = document.getElementById("blocks");

    container.innerHTML = "";


    data.forEach(block => {

        let div = document.createElement("div");
        div.className = "card";


        div.innerHTML = `

    <div class="text">

        <p>${block.text}</p>

    </div>

    ${
        block.image_url
            ? `<img src="${block.image_url}" alt="Bild">`
            : ""
    }


    <div class="like-area">

        <button class="like-button">
            ♡
        </button>

        <span>
            ${block.likes || 0}
        </span>

    </div>

`;


        container.appendChild(div);

    });

}

function logout() {

    sessionStorage.removeItem("visitor");

    window.location.href = "index.html";

}

loadBlocks();
