if (!localStorage.getItem("lan")) {
    localStorage.setItem("lan", "en");
}
if (localStorage.getItem("lan")) {
    if (localStorage.getItem("lan") == "en") {
        document.getElementById("body").style.direction = "ltr";
    } else if (localStorage.getItem("lan") == "fa") {
        document.getElementById("body").style.direction = "rtl";
        document.getElementById("deleteSvg").style.left = "30px";
        document.getElementById("deleteSvg").style.right = "auto";
    }
    let lan = localStorage.getItem("lan");
    fetch('../json/' + lan + '.json')
        .then(response => response.json())
        .then(data => {
            document.getElementById("pname").textContent = data["displayName"] + ":";
            document.getElementById("pemail").textContent = data["email"] + ":";
            document.getElementById("pbio").textContent = data["bio"] + ":";
            document.getElementById("deleteContact").textContent = data["deleteContact"];
            document.getElementById("h1").textContent = data["profile"];
            document.getElementById("confirmBtn").textContent = data["delete"];
            document.getElementById("rusure").textContent = data["rusure"];
        })
        .catch(error => {
            console.error('Error loading JSON file:', error);
        });
}

$(".confirm .back").click(()=>{
    $(".confirm").css("visibility","hidden");
    $(".confirm").css("opacity","0");
});

const url = localStorage.getItem("url");
const client_id = localStorage.getItem("user_id");
const user_id = localStorage.getItem("position").slice(0, -1);
$("#delete").css("visibility", (localStorage.getItem("LastPosition") == "chats") ? "hidden" : "visible");
$.ajax({
    url: url + "/get-profile-info.php",
    method: "POST",
    data: {
        user_id: user_id
    },
    success: function (data) {
        const info = data.split(",");
        $("#user-profile").attr("src", (info[0] == "") ? url + "/profiles/person.jpg" : url + "/" + info[0]);
        $("#user-name").html(info[1]);
        $("#user-email").html(info[2]);
        $("#user-bio").html(info[3]);
        $("#delete").attr("value",info[4]);
    },
    error: function (_, error) { console.error(error) }
});
$.ajax({
    url: url + "/update-position.php",
    method: "POST",
    data: {
        client_id: client_id,
        position: localStorage.getItem("position")
    },
    success: function (data) {
        if (data != "success") console.error(data);
    },
    error: function (_, error) { console.error(error) }
});
function back() {
    location.replace((localStorage.getItem("LastPosition") == "chats") ? "chats.html" : "chat.html");
}
document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") {
        $.ajax({
            url: url + "/set-user-status.php",
            method: "POST",
            data: {
                client_id: client_id,
                newStatus: "0"
            },
            success: (data) => {
                if (data != "success") console.error(data);
            },
            error: (_, error) => { console.error(error); }
        });
    }
});
setInterval(() => {
    if (document.visibilityState === "visible") {
        $.ajax({
            url: url + "/set-user-status.php",
            method: "POST",
            data: {
                client_id: client_id,
                newStatus: "1"
            },
            success: (data) => {
                if (data != "success") console.error(data);
            },
            error: (_, error) => { console.error(error); }
        });
    }
}, 1000);

$("#delete").click(function (){
    id = this.getAttribute("value");
    $(".confirm").css("visibility","visible");
    $(".confirm").css("opacity","1");
    $("#confirmBtn").click(()=>{
        $.ajax({
            url: url + "/delete-this-contact.php",
            method: "POST",
            data: {
                client_id: client_id,
                user_id: id
            },
            success: (data)=>{
                if (data != "success"){ console.error(data); return; };
                location.replace("chats.html");
            },
            error: (_,error)=>{ console.error(error); }
          });
    });
});