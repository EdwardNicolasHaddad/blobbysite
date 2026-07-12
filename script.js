async function checkCode() {

    let eingabe = document.getElementById("code").value;

    let { data, error } = await supabaseClient
        .from("codes")
        .select("*")
        .eq("code", eingabe)
        .limit(1);


    if (error || data.length === 0) {

        alert("Falscher Code");

        return;
    }


    if (data[0].role === "admin") {

        window.location.href = "admin.html";

    }


    else if (data[0].role === "besucher") {

        window.location.href = "besucher.html";

    }

}
