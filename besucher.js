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
        
        let likeCount = await getLikeCount(block.id);

        
        div.innerHTML = `

    <div class="text">

        ${
            block.title
            ? `<h2>${block.title}</h2>`
            : ""
        }

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
            ${likeCount}
        </span>

    </div>

`;


        container.appendChild(div);

    }

}

async function toggleLike(id){

    let button = event.currentTarget;

    button.classList.add("animate");


    setTimeout(() => {

        button.classList.remove("animate");

    },200);

    let countElement = button.parentElement.querySelector(".like-count");

    let deviceId = getDeviceId();


    let { data } = await supabaseClient
        .from("likes")
        .select("*")
        .eq("block_id", id)
        .eq("device_id", deviceId);



    if(data.length > 0){


        await supabaseClient
            .from("likes")
            .delete()
            .eq("block_id", id)
            .eq("device_id", deviceId);


        button.classList.remove("liked");


    } else {


        await supabaseClient
            .from("likes")
            .insert({

                block_id:id,
                device_id:deviceId

            });


        button.classList.add("liked");

    }



    let newCount = await getLikeCount(id);

    countElement.textContent = newCount;


}


function logout() {

    sessionStorage.removeItem("visitor");

    window.location.href = "index.html";

}

async function loadContent(){

    let {data, error} = await supabaseClient
        .from("content")
        .select("*")
        .eq("id",1)
        .single();


    if(error){

        console.log(error);
        return;

    }


    document.getElementById("title").textContent = data.title;

    document.getElementById("subtitle").textContent = data.text;

}

loadContent();
loadBlocks();
