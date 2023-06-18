const url = localStorage.getItem("url");
const clientId = localStorage.getItem("user_id");
setInterval(() => {
    loadChats();
}, 500);
function loadChats() {
    $.ajax({
        url: url + "/get-chats.php",
        method: "POST",
        data: { clientId: clientId },
        success: function (data) {
            $("#chats").html(data);
            $(".contact img").attr("src", function () {
                return url + "/" + $(this).attr("src");
            });
        },
        error: function (_, error) {
            console.error(error);
        }
    });
}
$("#requests").on("click", ".back", function () {
    let alertsDiv = document.getElementById("requests");
    alertsDiv.style.visibility = "hidden";
    alertsDiv.style.opacity = "0";
});
document.querySelector(".plus-circle").addEventListener("click", function () {
    let addUserDiv = document.getElementById("add-user");
    addUserDiv.style.visibility = "visible";
    addUserDiv.style.opacity = "1";
});
document.querySelector(".user-circle").addEventListener("click", function () {
    location.replace("settings.html");
});
document.querySelector("#add-user .back").addEventListener("click", function () {
    let addUserDiv = document.getElementById("add-user");
    addUserDiv.style.visibility = "hidden";
    addUserDiv.style.opacity = "0";
});
function error(text) {
    document.querySelector(".error").innerHTML = "<h2>" + text + "</h2>";
    document.querySelector(".error").style.opacity = "1";
    document.querySelector(".error").style.visibility = "visible";
    setTimeout(() => {
        document.querySelector(".error").style.opacity = "0";
        document.querySelector(".error").style.visibility = "hidden";
    }, 3000);
}
if (!localStorage.getItem("lan")) {
    localStorage.setItem("lan", "en");
}
if (localStorage.getItem("lan")) {
    if (localStorage.getItem("lan") == "en") {
        document.getElementById("textReq").style.direction = "ltr";
        document.getElementById("emailReq").style.direction = "ltr";
    } else if (localStorage.getItem("lan") == "fa") {
        document.getElementById("textReq").style.direction = "rtl";
        document.getElementById("emailReq").style.direction = "rtl";
    }
    let lan = localStorage.getItem("lan");
    fetch('../json/' + lan + '.json')
        .then(response => response.json())
        .then(data => {
            document.getElementById("emailReq").placeholder = data["email"] + "...";
            document.getElementById("textReq").placeholder = data["msg"] + "...";
            document.getElementById("reqBtn").textContent = data["req"];
            document.getElementById("h1").textContent = data["chats"];
        })
        .catch(error => {
            console.error('Error loading JSON file:', error);
        });
}

document.getElementById("reqBtn").addEventListener("click", function () {
    let emailReq = document.getElementById("emailReq").value;
    let textReq = document.getElementById("textReq").value;
    if (!textReq || !emailReq) {
        fetch('../json/' + localStorage.getItem("lan") + '.json')
            .then(response => response.json())
            .then(data => {
                error(data['fillout']);
            })
            .catch(error => {
                console.error('Error loading JSON file:', error);
            });
        return;
    }
    document.getElementById("reqBtn").innerHTML = '<img src="svg/loading.svg" alt="" class="loading-svg">';
    document.getElementById("reqBtn").disabled = true;
    $.ajax({
        url: url + "/add-request.php",
        method: "POST",
        data: {
            email: emailReq,
            text: textReq,
            id: clientId
        },
        success: function (data) {
            fetch('../json/' + localStorage.getItem("lan") + '.json')
                .then(response => response.json())
                .then(data => {
                    document.getElementById("reqBtn").innerHTML = data['req'];
                    document.getElementById("reqBtn").disabled = false;
                })
                .catch(error => {
                    console.error('Error loading JSON file:', error);
                });
            if (data == "703") {
                fetch('../json/' + localStorage.getItem("lan") + '.json')
                    .then(response => response.json())
                    .then(data => {
                        error(data['notExistEmail']);
                    })
                    .catch(error => {
                        console.error('Error loading JSON file:', error);
                    });
            } else if (data == "duplicate") {
                fetch('../json/' + localStorage.getItem("lan") + '.json')
                    .then(response => response.json())
                    .then(data => {
                        error(data['duplicateReq']);
                    })
                    .catch(error => {
                        console.error('Error loading JSON file:', error);
                    });
            } else if (data == "success") {
                emailReq = "";
                textReq = "";
                let alertsDiv = document.getElementById("requests");
                alertsDiv.style.visibility = "hidden";
                alertsDiv.style.opacity = "0";
            } else if (data == "701") {
                fetch('../json/' + localStorage.getItem("lan") + '.json')
                    .then(response => response.json())
                    .then(data => {
                        error(data['errorCode'] + "701");
                    })
                    .catch(error => {
                        console.error('Error loading JSON file:', error);
                    });
            }
        },
        error: function (_, error) {
            fetch('../json/' + localStorage.getItem("lan") + '.json')
                .then(response => response.json())
                .then(data => {
                    document.getElementById("reqBtn").innerHTML = data['req'];
                    document.getElementById("reqBtn").disabled = false;
                })
                .catch(error => {
                    console.error('Error loading JSON file:', error);
                });
            console.log(error);
        }
    });
});

setInterval(() => {
    $.ajax({
        url: url + "/get-requests.php",
        method: "POST",
        data: {
            clientId: clientId
        },
        success: function (data) {
            if (data == "null") {
                document.querySelector(".header .alerts span").style.opacity = "0";
                document.getElementById("requests").innerHTML = "";
                return;
            }
            if (data != "null") {
                document.querySelector(".header .alerts span").style.opacity = "1";
            }
            document.querySelector(".alerts").addEventListener("click", function () {
                if (document.querySelector(".header .alerts span").style.opacity == "1") {
                    let alertsDiv = document.getElementById("requests");
                    alertsDiv.style.visibility = "visible";
                    alertsDiv.style.opacity = "1";
                }
            });
            let back = '<div class="back"></div>';
            document.getElementById("requests").innerHTML = back + data;
        },
        error: function (_, error) {
            console.log(error);
        }
    });
}, 500);

$("#requests").on("click", ".profile", function () {
    let value = this.getAttribute('value');
    localStorage.setItem("position", value + "p");
    localStorage.setItem("LastPosition", "chats");
    location.replace("profile.html");
});
$("#requests").on("click", ".like", function () {
    let value = this.getAttribute('value');
    $.ajax({
        url: url + "/accept-friend-req.php",
        method: "POST",
        data: {
            user1: value,
            user2: clientId
        },
        success: function (data) {
            if (data == "success") {
                let alertsDiv = document.getElementById("requests");
                alertsDiv.style.visibility = "hidden";
                alertsDiv.style.opacity = "0";
            } else {
                console.error(data);
            }
        },
        error: function (_, error) {
            console.error(error);
        }
    });
});
$("#requests").on("click", ".dislike", function () {
    let value = this.getAttribute('value');
    $.ajax({
        url: url + "/reject-friend-req.php",
        method: "POST",
        data: {
            user1: value,
            user2: clientId
        },
        success: function (data) {
            if (data == "success") {
                let alertsDiv = document.getElementById("requests");
                alertsDiv.style.visibility = "hidden";
                alertsDiv.style.opacity = "0";
            } else {
                console.error(data);
            }
        },
        error: function (_, error) {
            console.error(error);
        }
    });
});

function goChat(userId) {
    let position = userId + "c";
    $.ajax({
        url: url + "/update-position.php",
        method: "POST",
        data: {
            client_id: clientId,
            position: position
        },
        success: function (data) {
            if (data != "success") console.error(data);
        },
        error: function (_, error) { console.error(error) }
    });
    localStorage.setItem("position", position);
    localStorage.setItem("LastPosition", "chats");
    location.replace("chat.html");
}

$.ajax({
    url: url + "/update-position.php",
    method: "POST",
    data: {
        client_id: clientId,
        position: "chats"
    },
    success: function (data) {
        if (data != "success") console.error(data);
    },
    error: function (_, error) { console.error(error); }
});
localStorage.removeItem("LastPosition");

document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") {
        $.ajax({
            url: url + "/set-user-status.php",
            method: "POST",
            data: {
                client_id: clientId,
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
                client_id: clientId,
                newStatus: "1"
            },
            success: (data) => {
                if (data != "success") console.error(data);
            },
            error: (_, error) => { console.error(error); }
        });
    }
}, 1000);