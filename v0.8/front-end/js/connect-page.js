function connect() {
    let address = document.getElementById("address").value;
    let port = document.getElementById("port").value;
    if (!address || !port) {
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
    let url = "https://" + address + ":" + port;
    // https://nrzamir.iapp.ir:443
    document.getElementById("connect").innerHTML = '<img src="svg/loading.svg" alt="" class="loading-svg">';
    document.getElementById("connect").disabled = true;
    $.ajax({
        url: url + "/index.php",
        method: "POST",
        success: function (data) {
            if (data == "connected") {
                localStorage.setItem("url",url);
                location.replace("login.html");
            }
        }
    });
    setTimeout(() => {
        fetch('../json/' + localStorage.getItem("lan") + '.json')
            .then(response => response.json())
            .then(data => {
                error(data["connectionFailed"]);
                document.getElementById("connect").innerHTML = data['connect'];
                document.getElementById("connect").disabled = false;
            })
            .catch(error => {
                console.error('Error loading JSON file:', error);
            });
    }, 5000);
}
function error(text) {
    document.querySelector(".error").innerHTML = "<h2>" + text + "</h2>";
    document.querySelector(".error").style.opacity = "1";
    setTimeout(() => {
        document.querySelector(".error").style.opacity = "0";
    }, 3000);
}
if(localStorage.getItem("url")){
    $.ajax({
        url: localStorage.getItem("url") + "/index.php",
        method: "POST",
        success: function (data) {
            if (data == "connected") {
                location.replace("login.html");
            }
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
            document.getElementById("h1").textContent = data["connectTo"];
            document.getElementById("IpH3").textContent = data["ipOrDomain"];
            document.getElementById("portH3").textContent = data["port"];
            document.getElementById("connect").textContent = data["connect"];
        })
        .catch(error => {
            console.error('Error loading JSON file:', error);
        });
}