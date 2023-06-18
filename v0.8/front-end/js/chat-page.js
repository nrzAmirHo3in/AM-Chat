const url = localStorage.getItem("url");
const client_id = localStorage.getItem("user_id");
const user_id = localStorage.getItem("position").slice(0, -1);

setInterval(() => {
  $.ajax({
    url: url + "/get-user-info-chat-page.php",
    method: "POST",
    data: {
      user_id: user_id
    },
    success: (data) => {
      const info = data.split(",");
      $("#user-profile").attr("src", (info[0] == "") ? url + "/profiles/person.jpg" : url + "/" + info[0]);
      $("#user-profile").attr("value",info[3]);
      $("#user-name").html(info[1]);
      $("#user-status").html(info[2]);
    },
    error: (_, error) => { console.error(error); }
  });
}, 500);
$("#user-profile").click( function (){
  let value = this.getAttribute('value');
  localStorage.setItem("position", value + "p");
  localStorage.setItem("LastPosition", user_id + "c");
  location.replace("profile.html");
});

$.ajax({
  url: url + "/seen-messages.php",
  method: "POST",
  data: {
    client_id: client_id
  },
  success: (data)=>{
    if (data != "success") console.error(data);
  },
  error: (_,error)=>{ console.error(error); }
});

let messages = "";

setInterval(() => {
  $.ajax({
    url: url + "/get-chat.php",
    method: "POST",
    data: {
      user_id: user_id,
      client_id: client_id
    },
    success: (data) => {
      if (messages == data) {
        return;
      }
      let chatbox = document.getElementById("chatbox");
      setTimeout(() => {
        chatbox.scrollTo(0,chatbox.scrollHeight);
      }, 200);
      setTimeout(() => {
        chatbox.style.scrollBehavior = "smooth";
      }, 200);
      messages = data;
      $("#chatbox").html(data);
      document.querySelector("#message svg").addEventListener("click", function () {
        document.getElementById("msg").focus();
        document.querySelector("#message svg").style.rotate = "45deg";
        setTimeout(() => {
          document.querySelector("#message svg").style.rotate = "0deg";
        }, 200);
      });
      const Sendelements = document.querySelectorAll('.send');
      for (let i = 0; i < Sendelements.length; i++) {
        const nextElement = Sendelements[i].nextElementSibling;
        const previousElement = Sendelements[i].previousElementSibling;
        if (!previousElement || !previousElement.classList.contains('send')) {
          // المان‌های وسط
          Sendelements[i].style.borderTopRightRadius = '16px';
          Sendelements[i].style.borderBottomRightRadius = '3px';
        } else if (nextElement && nextElement.classList.contains('send')) {
          // المان اول
          Sendelements[i].style.borderTopRightRadius = '3px';
          Sendelements[i].style.borderBottomRightRadius = '3px';
        } else if (i === Sendelements.length - 1) {
          // المان آخر
          Sendelements[i].style.borderTopRightRadius = '3px';
        }
      }
      const receiveElements = document.querySelectorAll('.receive');
      for (let i = 0; i < receiveElements.length; i++) {
        const nextElement = receiveElements[i].nextElementSibling;
        const previousElement = receiveElements[i].previousElementSibling;
        if (!previousElement || !previousElement.classList.contains('receive')) {
          // المان‌های وسط
          receiveElements[i].style.borderTopLeftRadius = '16px';
          receiveElements[i].style.borderBottomLeftRadius = '3px';
        } else if (nextElement && nextElement.classList.contains('receive')) {
          // المان اول
          receiveElements[i].style.borderTopLeftRadius = '3px';
          receiveElements[i].style.borderBottomLeftRadius = '3px';
        } else if (i === receiveElements.length - 1) {
          // المان آخر
          receiveElements[i].style.borderTopLeftRadius = '3px';
        }
      }
    },
    error: (_, error) => { console.error(error); }
  });
}, 500);
function send() {
  let msg = $("#msg").val();
  msg = msg.trim();
  if (msg == "") {
    return;
  }
  $("#msg").val("");
  $.ajax({
    url: url + "/send-message.php",
    method: "POST",
    data: {
      user_id: user_id,
      client_id: client_id,
      msg: msg
    },
    success: (data) => {
      if (data != "success") console.error(data);
    },
    error: (_, error) => {
      console.error(error);
    }
  });
}
$("#send").click(()=>{
  send();
});
$("#msg").on('keyup', function (e) {
  if (e.key === 'Enter' || e.keyCode === 13) {
    document.querySelector("#message svg").style.rotate = "45deg";
    setTimeout(() => {
      document.querySelector("#message svg").style.rotate = "0deg";
    }, 200);
    send();
  }
});

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
    $.ajax({
      url: url + "/seen-messages-if-in-chat.php",
      method: "POST",
      data: {
        client_id: client_id,
        user_id: user_id
      },
      success: (data)=>{
        if (data != "success") console.error(data);
      },
      error: (_,error)=>{ console.error(error); }
    });
  }
}, 1000);