async function loadContent() {

    let { data, error } = await supabaseClient
        .from("content")
        .select("*")
        .limit(1);


    if (error) {
        console.log(error);
        return;
    }


    document.getElementById("title").value = data[0].title;
    document.getElementById("text").value = data[0].text;

}


async function saveContent() {

    let title = document.getElementById("title").value;
    let text = document.getElementById("text").value;


    let { error } = await supabaseClient
        .from("content")
        .update({
            title: title,
            text: text
        })
        .eq("id", 1);


    if (error) {

        alert("Fehler beim Speichern");

    } else {

        alert("Gespeichert!");

    }

}


loadContent();
