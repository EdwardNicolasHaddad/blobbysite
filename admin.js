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
            <label>Position:</label>

            <input 
                id="position-${block.id}" 
                value="${block.position}"
            >

            <textarea id="text-${block.id}">
                ${block.text}
            </textarea>

            <br><br>

            <img src="${block.image_url}" width="300">

            <br><br>

            <input type="file" id="image-${block.id}" accept="image/*">

            <br><br>

            <button onclick="updateBlock(${block.id})">
                Speichern
            </button>

            <br><br>

            <button onclick="deleteBlock(${block.id})">
                Löschen
            </button>

            <hr>
        `;


        container.appendChild(div);

    });

}



async function updateBlock(id) {

    let text = document.getElementById("text-" + id).value;

    let file = document.getElementById("image-" + id).files[0];


    let updateData = {
        text: text
    };


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


        updateData.image_url = data.publicUrl;

    }


    let { error } = await supabaseClient
        .from("blocks")
        .update(updateData)
        .eq("id", id);



    if (error) {

        console.log(error);
        alert("Fehler beim Speichern");

    } else {

        alert("Block geändert!");
        loadBlocks();

    }

}

async function deleteBlock(id) {

    let confirmDelete = confirm("Diesen Block wirklich löschen?");


    if (!confirmDelete) {
        return;
    }


    let { error } = await supabaseClient
        .from("blocks")
        .delete()
        .eq("id", id);


    if (error) {

        console.log(error);
        alert("Fehler beim Löschen");

    } else {

        alert("Block gelöscht!");
        loadBlocks();

    }

}

loadBlocks();
