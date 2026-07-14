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


    <div class="bottom-area">


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



    ${
        block.image_url
        ?
        `
        <button
            class="fullscreen-button"
            onclick="openImage('${block.image_url}')"
        >

                <svg viewBox="0 0 24 24">

                <path d="M3 9V3h6"/>
                <path d="M21 9V3h-6"/>
                <path d="M3 15v6h6"/>
                <path d="M21 15v6h-6"/>

            </svg>

        </button>
        `
        :
        ""
    }


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

function openImage(imageUrl){

    document.getElementById("fullscreenImage").src = imageUrl;

    document.getElementById("imageViewer").style.display = "flex";

    document.body.style.overflow = "hidden";

}


function closeImage(){

    document.getElementById("imageViewer").style.display = "none";

    document.getElementById("fullscreenImage").src = "";

    document.body.style.overflow = "auto";


    imageScale = 1;

    imageX = 0;

    imageY = 0;


    fullscreenImage.style.transform =
        "translate(0,0) scale(1)";

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

let imageScale = 1;

let imageX = 0;
let imageY = 0;

let isDragging = false;

let startX = 0;
let startY = 0;


const fullscreenImage = document.getElementById("fullscreenImage");



function updateImage(){

    let windowElement = document.querySelector(".image-window");


    let maxX = (fullscreenImage.width * imageScale - windowElement.clientWidth) / 2;

    let maxY = (fullscreenImage.height * imageScale - windowElement.clientHeight) / 2;


    if(maxX < 0){
        maxX = 0;
    }


    if(maxY < 0){
        maxY = 0;
    }


    if(imageX > maxX){
        imageX = maxX;
    }


    if(imageX < -maxX){
        imageX = -maxX;
    }


    if(imageY > maxY){
        imageY = maxY;
    }


    if(imageY < -maxY){
        imageY = -maxY;
    }


    fullscreenImage.style.transform =
        `translate(${imageX}px, ${imageY}px) scale(${imageScale})`;

}



fullscreenImage.addEventListener("wheel", function(event){

    event.preventDefault();


    let oldScale = imageScale;


    if(event.deltaY < 0){

        imageScale += 0.15;

    } else {

        imageScale -= 0.15;

    }


    if(imageScale < 1){

        imageScale = 1;

    }


    // Position proportional anpassen
    let scaleChange = imageScale / oldScale;


    imageX *= scaleChange;
    imageY *= scaleChange;


    updateImage();

});



fullscreenImage.addEventListener("mousedown", function(event){

    if(imageScale <= 1){
        return;
    }


    event.preventDefault();


    isDragging = true;


    startX = event.clientX - imageX;

    startY = event.clientY - imageY;


    fullscreenImage.style.cursor = "grabbing";

});



window.addEventListener("mousemove", function(event){

    if(!isDragging){
        return;
    }


    imageX = event.clientX - startX;

    imageY = event.clientY - startY;


    updateImage();

});



window.addEventListener("mouseup", function(){

    isDragging = false;

    fullscreenImage.style.cursor = "grab";

});
