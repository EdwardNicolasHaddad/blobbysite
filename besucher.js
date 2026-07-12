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
            <p>${block.text}</p>
            <img src="${block.image_url}" width="500">
            <br><br>
        `;


        container.appendChild(div);

    });

}


loadBlocks();
