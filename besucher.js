async function loadContent() {

    let { data, error } = await supabaseClient
        .from("content")
        .select("*")
        .limit(1);


    if (error) {
        console.log(error);
        return;
    }


    document.getElementById("title").innerHTML = data[0].title;

    document.getElementById("text").innerHTML = data[0].text;

}


loadContent();
