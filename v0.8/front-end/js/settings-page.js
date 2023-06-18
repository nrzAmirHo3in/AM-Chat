const url = localStorage.getItem("url");
const user_id = localStorage.getItem("user_id");
let lan = localStorage.getItem("lan");
setProfile();
setUserInfo();
function setProfile() {
    $.ajax({
        url: url + "/get_photo_dir.php",
        method: "POST",
        data: {
            clientId: user_id
        },
        success: function (data) {
            if (data == "") {
                $("#profile-photo").attr("src", url + "/profiles/person.jpg");
            } else {
                $("#profile-photo").attr("src", url + "/" + data);
            }
        },
        error: function (_, Error) {
            console.error(Error);
        }
    });
}

function changeLan() {
    if (!localStorage.getItem("lan")) {
        localStorage.setItem("lan", "en");
    }
    if (localStorage.getItem("lan")) {
        if (localStorage.getItem("lan") == "en") {
            document.getElementById("body").style.direction = "ltr";
            document.querySelector(".edit-lan .en img").style.display = "block";
            document.querySelector(".edit-lan .fa img").style.display = "none";
        } else if (localStorage.getItem("lan") == "fa") {
            document.getElementById("body").style.direction = "rtl";
            document.querySelector(".edit-lan .fa img").style.display = "block";
            document.querySelector(".edit-lan .en img").style.display = "none";
        }
        fetch('../json/' + localStorage.getItem("lan") + '.json')
            .then(response => response.json())
            .then(data => {
                document.getElementById("pname").innerHTML = data["displayName"] + ":";
                document.getElementById("pemail").innerHTML = data["email"] + ":";
                document.getElementById("lan").innerHTML = localStorage.getItem("lan") == "en" ? "English" : "فارسی";
                document.getElementById("pbio").innerHTML = data["bio"] + ":";
                document.getElementById("pversion").innerHTML = data["version"] + ":";
                document.getElementById("editBtn1").innerHTML = data["edit"];
                document.getElementById("editBtn2").innerHTML = data["edit"];
                document.getElementById("editBtn3").innerHTML = data["edit"];
                document.getElementById("h1").innerHTML = data["profile"];
            })
            .catch(error => {
                console.error('Error loading JSON file:', error);
            });
    }
}

document.getElementById("changeProfile").addEventListener("click", function () {
    document.getElementById("selectProfileInput").click();
});
document.getElementById("name").addEventListener("click", function () {
    document.querySelector(".edit-name").style.visibility = "visible";
    document.querySelector(".edit-name").style.opacity = "1";
});
document.getElementById("bio").addEventListener("click", function () {
    document.querySelector(".edit-bio").style.visibility = "visible";
    document.querySelector(".edit-bio").style.opacity = "1";
});
document.getElementById("lang").addEventListener("click", function () {
    document.querySelector(".edit-lan").style.visibility = "visible";
    document.querySelector(".edit-lan").style.opacity = "1";
});
document.querySelector(".edit-name div.back").addEventListener("click", function () {
    document.querySelector(".edit-name").style.visibility = "hidden";
    document.querySelector(".edit-name").style.opacity = "0";
});
document.querySelector(".edit-bio div.back").addEventListener("click", function () {
    document.querySelector(".edit-bio").style.visibility = "hidden";
    document.querySelector(".edit-bio").style.opacity = "0";
});
document.querySelector(".edit-lan div.back").addEventListener("click", function () {
    document.querySelector(".edit-lan").style.visibility = "hidden";
    document.querySelector(".edit-lan").style.opacity = "0";
});
document.querySelector(".edit-lan .fa").addEventListener("click", function () {
    if (document.querySelector(".edit-lan .fa img").style.display == "none") {
        document.querySelector(".edit-lan .fa img").style.display = "block";
        document.querySelector(".edit-lan .en img").style.display = "none";
        localStorage.setItem("lan", "fa");
        changeLan();
    }
});
document.querySelector(".edit-lan .en").addEventListener("click", function () {
    if (document.querySelector(".edit-lan .en img").style.display == "none") {
        document.querySelector(".edit-lan .en img").style.display = "block";
        document.querySelector(".edit-lan .fa img").style.display = "none";
        localStorage.setItem("lan", "en");
        changeLan();
    }
});
$("#checkUpdate .back").click(()=>{
    $("#checkUpdate").css("visibility","hidden");
    $("#checkUpdate").css("opacity","0");
});
document.querySelector("header svg").addEventListener("click", function () {
    location.replace("chats.html");
});
changeLan();

function setUserInfo() {
    $.ajax({
        url: url + "/get-this-user-name.php",
        method: "POST",
        data: {
            clientId: user_id
        },
        success: function (data) {
            $("#p-user-name").html(data);
            $("#input-user-name").val(data);
        },
        error: function (_, error) {
            console.error(error);
        }
    });
    $.ajax({
        url: url + "/get-this-user-email.php",
        method: "POST",
        data: {
            clientId: user_id
        },
        success: function (data) {
            $("#p-user-email").html(data);
        },
        error: function (_, error) {
            console.error(error);
        }
    });
    $.ajax({
        url: url + "/get-this-user-bio.php",
        method: "POST",
        data: {
            clientId: user_id
        },
        success: function (data) {
            $("#p-user-bio").html(data);
            $("#input-user-bio").val(data);
        },
        error: function (_, error) {
            console.error(error);
        }
    });
}

document.getElementById("selectProfileInput").addEventListener("change", function () {
    if (document.getElementById("selectProfileInput").value == "") return;
    $("#profile-photo").attr("src", "svg/loading.svg");
    var formData = new FormData();
    var file = $('#selectProfileInput')[0].files[0];
    formData.append('fileToUpload', file);
    formData.append('id', user_id);
    $.ajax({
        url: url + "/upload-profile.php",
        method: "POST",
        data: formData,
        contentType: false,
        processData: false,
        success: function (data) {
            if (data == "success") {
                setProfile();
            }
        },
        error: function (_, error) {
            console.error(error);
        }
    });
});
$("#editBtn1").click(function () {
    if ($("#input-user-name").val() == "") {
        return;
    }
    $.ajax({
        url: url + "/edit-user-name.php",
        method: "POST",
        data: {
            clientId: user_id,
            newName: $("#input-user-name").val()
        },
        success: function (data) {
            if (data == true) {
                setUserInfo();
                document.querySelector(".edit-name").style.visibility = "hidden";
                document.querySelector(".edit-name").style.opacity = "0";
            } else {
                fetch('../json/' + lan + '.json')
                    .then(response => response.json())
                    .then(json => {
                        console.error(json['errorCode'] + data);
                    })
                    .catch(error => {
                        console.error('Error loading JSON file:', error);
                    });
            }
        },
        error: function (_, error) {
            console.error(error);
        }
    });
});
$("#editBtn3").click(function () {
    if ($("#input-user-bio").val() == "") {
        return;
    }
    $.ajax({
        url: url + "/edit-user-bio.php",
        method: "POST",
        data: {
            clientId: user_id,
            newBio: $("#input-user-bio").val()
        },
        success: function (data) {
            if (data == true) {
                setUserInfo();
                document.querySelector(".edit-bio").style.visibility = "hidden";
                document.querySelector(".edit-bio").style.opacity = "0";
            } else {
                fetch('../json/' + lan + '.json')
                    .then(response => response.json())
                    .then(json => {
                        console.error(json['errorCode'] + data);
                    })
                    .catch(error => {
                        console.error('Error loading JSON file:', error);
                    });
            }
        },
        error: function (_, error) {
            console.error(error);
        }
    });
});
document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") {
        $.ajax({
            url: url + "/set-user-status.php",
            method: "POST",
            data: {
                client_id: user_id,
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
                client_id: user_id,
                newStatus: "1"
            },
            success: (data) => {
                if (data != "success") console.error(data);
            },
            error: (_, error) => { console.error(error); }
        });
    }
}, 1000);

$("#version").click(function(){
    $("#checkUpdate").css("visibility","visible");
    $("#checkUpdate").css("opacity","1");
    fetch('https://raw.githubusercontent.com/nrzAmirHo3in/AM-Chat/main/version.json')
    .then(response => response.json())
    .then(data => {
        let realV = Number(data['version']);
        let ThisV = Number($("#versionNum").html());
        console.log(realV);
        console.log(ThisV);
        if(realV > ThisV){
            fetch('../json/' + localStorage.getItem("lan") + '.json')
            .then(response => response.json())
            .then(data => {
                $("#checkUpdate .input").html("<a href='https://raw.githubusercontent.com/nrzAmirHo3in/AM-Chat/main/v"+realV+"/apk/AM-Chat-V"+realV+".apk' download>" + data['newUpdate'] + "</a>");
                $("#checkUpdate .input").attr("value",realV);
            })
            .catch(error => {
                console.error('Error loading JSON file:', error);
            });
        }else{
            fetch('../json/' + localStorage.getItem("lan") + '.json')
            .then(response => response.json())
            .then(data => {
                $("#checkUpdate .input").html("<h4 align='center'>" + data['NoNewUpdates'] + "</h4>");
            })
            .catch(error => {
                console.error('Error loading JSON file:', error);
            });
        }
    })
    .catch(error => {
        console.error('Error loading JSON file:', error);
    });
});