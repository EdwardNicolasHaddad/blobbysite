async function addBlock() {

    let position = document.getElementById("position").value;
    let text = document.getElementById("blockText").value;
    let image = document.getElementById("imageUrl").value;


    let { error } = await supabaseClient
        .from("blocks")
        .insert({
            position: position,
            text: text,
            image_url: image
        });


    if (error) {

        alert("Fehler beim Hinzufügen");

        console.log(error);

    } else {

        alert("Block hinzugefügt!");

        loadBlocks();

    }

}



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

        div.innerHTML = `
            <h3>Position ${block.position}</h3>
            <p>${block.text}</p>
            <img src="${block.image_url}" width="300">
            <hr>
        `;


        container.appendChild(div);

    });

}


loadBlocks();
