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

            <svg viewBox="0 0 24 24">
                <path d="M12 21s-7-4.35-9.33-8.33C.67 9.35 2.1 5 5.5 5c1.74 0 3.41 1 4.5 2.09C11.09 6 12.76 5 14.5 5 17.9 5 19.33 9.35 21.33 12.67 19 16.65 12 21 12 21z"/>
            </svg>

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
