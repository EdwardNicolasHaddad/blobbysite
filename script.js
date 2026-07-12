async function checkCode() {

    let eingabe = document.getElementById("code").value;

    let { data, error } = await supabaseClient
        .from("codes")
        .select("*")
        .eq("code", eingabe)
        .single();


    if (error || !data) {

        alert("Falscher Code");

        return;
    }


    if (data.role === "admin") {

        window.location.href = "admin.html";

    }


    else if (data.role === "besucher") {

        window.location.href = "besucher.html";

    }

}
