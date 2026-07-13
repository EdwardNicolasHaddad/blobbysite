function getDeviceId(){

    let deviceId = localStorage.getItem("deviceId");

    if(!deviceId){

        deviceId = crypto.randomUUID();

        localStorage.setItem("deviceId", deviceId);

    }

    return deviceId;

}

async function hasLiked(blockId){

    let { data } = await supabaseClient
        .from("likes")
        .select("id")
        .eq("block_id", blockId)
        .eq("device_id", getDeviceId());

    return data.length > 0;

}

async function getLikeCount(blockId){

    let { count } = await supabaseClient
        .from("likes")
        .select("*", { count:"exact", head:true })
        .eq("block_id", blockId);


    return count || 0;

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


    for (const block of data) {

        let div = document.createElement("div");
        div.className = "card";

        let liked = await hasLiked(block.id);

        
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

        <button 
            class="like-button ${liked ? "liked" : ""}"
            onclick="toggleLike(${block.id})"
        >

            <svg viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
                C2 5.42 4.42 3 7.5 3 
                C9.24 3 10.91 3.81 12 5.09 
                C13.09 3.81 14.76 3 16.5 3 
                C19.58 3 22 5.42 22 8.5 
                C22 12.28 18.6 15.36 13.45 20.04 
                L12 21.35z"/>
            </svg>

        </button>
        
        <span class="like-count">
            ${block.likes || 0}
        </span>

    </div>

`;


        container.appendChild(div);

    }

}

async function toggleLike(id){

    let button = event.currentTarget;

    let deviceId = getDeviceId();


    let { data } = await supabaseClient
        .from("likes")
        .select("*")
        .eq("block_id", id)
        .eq("device_id", deviceId);


    if(data.length > 0){

        // Like entfernen

        await supabaseClient
            .from("likes")
            .delete()
            .eq("block_id", id)
            .eq("device_id", deviceId);


        button.classList.remove("liked");


    } else {

        // Like hinzufügen

        await supabaseClient
            .from("likes")
            .insert({

                block_id: id,
                device_id: deviceId

            });


        button.classList.add("liked");

    }

}

function logout() {

    sessionStorage.removeItem("visitor");

    window.location.href = "index.html";

}

loadBlocks();
