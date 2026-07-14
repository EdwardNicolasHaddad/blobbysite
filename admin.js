async function addBlock() {

    let position = Number(document.getElementById("position").value);
    let title = document.getElementById("blockTitle").value;
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

    // vorhandene Blöcke nach unten verschieben

        let { data: blocksToMove } = await supabaseClient
            .from("blocks")
            .select("id, position")
            .gte("position", position);


        for (let block of blocksToMove) {

            await supabaseClient
                .from("blocks")
                .update({
                    position: block.position + 1
                })
                .eq("id", block.id);

        }

    let { error } = await supabaseClient
        .from("blocks")
        .insert({
            position: position,
            title: title,
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
        div.className = "card";


       div.innerHTML = `

<label><b>Position:</b></label><br>

<input
    id="position-${block.id}"
    type="number"
    value="${block.position}"
    min="1"
>

<br><br>

<label><b>Überschrift:</b></label><br>

<input 
    id="title-${block.id}" 
    value="${block.title || ""}"
>

<br><br>

<label><b>Text:</b></label><br>

<textarea id="text-${block.id}">${block.text}</textarea>

<br><br>

<img src="${block.image_url}" width="300">

<br><br>

<label><b>Bild:</b></label><br>

<input
    type="file"
    id="image-${block.id}"
    accept="image/*"
    hidden
>

<label for="image-${block.id}" class="file-button">
    Bild auswählen
</label>

<span id="selected-${block.id}" class="selected-file">
    Keine Datei ausgewählt
</span>

<br><br>

<button class="image-delete" onclick="removeImage(${block.id})">
    Bild löschen
</button>

<button class="save" onclick="updateBlock(${block.id})">
    Speichern
</button>

<button class="block-delete" onclick="deleteBlock(${block.id})">
    Block löschen
</button>

<hr>

`;


        container.appendChild(div);
        setupImageInputs();

    });

}

function setupImageInputs(){

    document.querySelectorAll('input[type="file"]').forEach(input => {

        input.addEventListener("change", function(){

            let id = this.id.replace("image-","");

            let display = document.getElementById("selected-" + id);


            if(this.files.length > 0){

                display.textContent = this.files[0].name;

            } else {

                display.textContent = "Keine Datei ausgewählt";

            }

        });

    });

}

async function updateBlock(id) {

    let title = document.getElementById("title-" + id).value;
    
    let text = document.getElementById("text-" + id).value;

    let newPosition = Number(document.getElementById("position-" + id).value);


    let { data: currentBlock } = await supabaseClient
        .from("blocks")
        .select("position")
        .eq("id", id)
        .single();


    let oldPosition = Number(currentBlock.position);


    let file = document.getElementById("image-" + id).files[0];


    // Positionen verschieben
    if (newPosition !== oldPosition) {


        if (newPosition < oldPosition) {

            // Blöcke nach unten schieben
            let { data: blocksToMove } = await supabaseClient
                .from("blocks")
                .select("id, position")
                .gte("position", newPosition)
                .lt("position", oldPosition);


            for (let block of blocksToMove) {

                await supabaseClient
                    .from("blocks")
                    .update({
                        position: block.position + 1
                    })
                    .eq("id", block.id);

            }


        } else {


            // Blöcke nach oben schieben
            let { data: blocksToMove } = await supabaseClient
                .from("blocks")
                .select("id, position")
                .gt("position", oldPosition)
                .lte("position", newPosition);


            for (let block of blocksToMove) {

                await supabaseClient
                    .from("blocks")
                    .update({
                        position: block.position - 1
                    })
                    .eq("id", block.id);

            }

        }

    }



    let updateData = {
        title: title,
        text: text,
        position: newPosition
    };   



    // Neues Bild hochladen
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

async function removeImage(id) {

    let confirmDelete = confirm("Bild wirklich löschen?");


    if (!confirmDelete) {
        return;
    }


    let { error } = await supabaseClient
        .from("blocks")
        .update({
            image_url: ""
        })
        .eq("id", id);



    if (error) {

        console.log(error);
        alert("Bild konnte nicht gelöscht werden");

    } else {

        alert("Bild gelöscht!");
        loadBlocks();

    }

}

function logout() {

    sessionStorage.removeItem("admin");

    window.location.href = "index.html";

}

const imageInput = document.getElementById("imageFile");
const selectedFile = document.getElementById("selectedFile");


imageInput.addEventListener("change", function () {

    if (this.files.length > 0) {

        selectedFile.textContent = this.files[0].name;

    } else {

        selectedFile.textContent = "Keine Datei ausgewählt";

    }

});

function removeNewImage(){

    document.getElementById("imageFile").value = "";

    document.getElementById("selectedFile").textContent =
        "Keine Datei ausgewählt";

}

loadBlocks();
