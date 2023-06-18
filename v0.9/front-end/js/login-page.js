let url = localStorage.getItem("url");
function error(text) {
    document.querySelector(".error").innerHTML = "<h2>" + text + "</h2>";
    document.querySelector(".error").style.opacity = "1";
    setTimeout(() => {
        document.querySelector(".error").style.opacity = "0";
    }, 3000);
}
function login() {
    let email = document.getElementById("email").value;
    let pass = document.getElementById("pass").value;
    if (!email || !pass) {
        fetch('../json/' + localStorage.getItem("lan") + '.json')
            .then(response => response.json())
            .then(data => {
                error(data["fillout"]);
            })
            .catch(error => {
                console.error('Error loading JSON file:', error);
            });
        return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        fetch('../json/' + localStorage.getItem("lan") + '.json')
            .then(response => response.json())
            .then(data => {
                error(data["incorrectEmail"]);
            })
            .catch(error => {
                console.error('Error loading JSON file:', error);
            });
        return;
    }
    let hashed = sha256(pass + email.slice(0, 4));
    document.getElementById("login").innerHTML = '<img src="svg/loading.svg" alt="" class="loading-svg">';
    document.getElementById("login").disabled = true;
    $.ajax({
        url: url + "/login.php",
        method: "POST",
        data: { email: email, pass: hashed },
        success: function (data) {
            if (data == "success") {
                localStorage.setItem("position", "chats");
                $.ajax({
                    url: url + "/get-userId-by-email.php",
                    method: "POST",
                    data: {
                        email: email
                    },
                    success: function (data) {
                        localStorage.setItem("user_id", data);
                        location.replace("chats.html");
                    },
                    error: function (_, error) {
                        console.log(error);
                        fetch('../json/' + localStorage.getItem("lan") + '.json')
                            .then(response => response.json())
                            .then(json => {
                                error(json['serverError']);
                                document.getElementById("login").innerHTML = json['login'];
                                document.getElementById("login").disabled = false;
                            })
                            .catch(error => {
                                console.error('Error loading JSON file:', error);
                            });
                    }
                });
            } else if (data == "701") {
                fetch('../json/' + localStorage.getItem("lan") + '.json')
                    .then(response => response.json())
                    .then(json => {
                        error(json['errorCode'] + "701");
                        document.getElementById("login").innerHTML = json['login'];
                        document.getElementById("login").disabled = false;
                    })
                    .catch(error => {
                        console.error('Error loading JSON file:', error);
                    });
            } else if (data == "700") {
                fetch('../json/' + localStorage.getItem("lan") + '.json')
                    .then(response => response.json())
                    .then(json => {
                        error(json['errorCode'] + "700");
                        document.getElementById("login").innerHTML = json['login'];
                        document.getElementById("login").disabled = false;
                    })
                    .catch(error => {
                        console.error('Error loading JSON file:', error);
                    });
            } else if (data == "failed") {
                fetch('../json/' + localStorage.getItem("lan") + '.json')
                    .then(response => response.json())
                    .then(json => {
                        error(json['usernameOrpass']);
                        document.getElementById("login").innerHTML = json['login'];
                        document.getElementById("login").disabled = false;
                    })
                    .catch(error => {
                        console.error('Error loading JSON file:', error);
                    });
            }
        },
        error: function (_, error) {
            fetch('../json/' + localStorage.getItem("lan") + '.json')
                .then(response => response.json())
                .then(json => {
                    error(json['serverError']);
                    document.getElementById("login").innerHTML = json['login'];
                    document.getElementById("login").disabled = false;
                })
                .catch(error => {
                    console.error('Error loading JSON file:', error);
                });
        }
    });
}
if (!localStorage.getItem("lan")) {
    localStorage.setItem("lan", "en");
}
if (localStorage.getItem("lan")) {
    if (localStorage.getItem("lan") == "en") {
        document.getElementById("body").style.direction = "ltr";
    } else if (localStorage.getItem("lan") == "fa") {
        document.getElementById("body").style.direction = "rtl";
    }
    let lan = localStorage.getItem("lan");
    fetch('../json/' + lan + '.json')
        .then(response => response.json())
        .then(data => {
            document.getElementById("h1").textContent = data["login"] + ":";
            document.getElementById("emailH3").textContent = data["email"];
            document.getElementById("password").textContent = data["password"];
            document.getElementById("login").textContent = data["login"];
        })
        .catch(error => {
            console.error('Error loading JSON file:', error);
        });
}

if (localStorage.getItem("user_id") != null) {
    localStorage.setItem("position", "chats");
    location.replace("chats.html");
}