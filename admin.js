async function addBlock() {

    let position = document.getElementById("position").value;
    let text = document.getElementById("blockText").value;
    let file = document.getElementById("imageFile").files[0];


    let imageUrl = "";


    if (file) {

        let fileName = Date.now() + "-" + file.name;


        let { error: uploadError } = await supabaseClient
            .storage
            .from("images")
            .upload(fileName, file);


        if (uploadError) {

            console.log(uploadError);
            alert("Bild konnte nicht hochgeladen werden");
            return;

        }


        let { data } = supabaseClient
            .storage
            .from("images")
            .getPublicUrl(fileName);


        imageUrl = data.publicUrl;

    }


    let { error } = await supabaseClient
        .from("blocks")
        .insert({
            position: position,
            text: text,
            image_url: imageUrl
        });


    if (error) {

        console.log(error);
        alert("Fehler beim Speichern");

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
