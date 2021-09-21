const c_socket = io(); // most take socket

//html element access
const $msg_form = document.querySelector("#msg_form");
const $msg_input = document.querySelector("#msg_input");
// const $msg_txt = document.querySelector("#msg_txt");
const $msg_div = document.querySelector("#msg_div");
const $send_loc_btn = document.querySelector("#send_loc_btn");
const $loc_div = document.querySelector("#loc_div");
const $msg_form_send_btn = document.querySelector("#msg_form_send_btn");

//html template access
const $msg_template = document.querySelector("#msg_template").innerHTML;
const $loc_template = document.querySelector("#loc_template").innerHTML;

// ---to clear concept, go console and try loaction.search etc
// ignoreQueryPrefix:true  => prefix removed like '?' from ?username=a&room=b
// {username,room}  is destructuring the object
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const autoscroll = () => {
  // New message element
  const $newMessage = $msg_div.lastElementChild;

  // Height of the new message
  const newMessageStyles = getComputedStyle($newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

  // Visible height
  const visibleHeight = $msg_div.offsetHeight;

  // Height of messages container
  const containerHeight = $msg_div.scrollHeight;

  // How far have I scrolled?
  const scrollOffset = $msg_div.scrollTop + visibleHeight;

  if (containerHeight - newMessageHeight <= scrollOffset) {
    $msg_div.scrollTop = $msg_div.scrollHeight;
  }
};
//-------------
c_socket.on("displayMsg", (msg_obj) => {
  // $msg_txt.innerHTML = msg;
  //we used time formating using momentjs (see documentation) included script in index.js
  const html = Mustache.render($msg_template, {
    username: msg_obj.username,
    msg: msg_obj.txt,
    createdAt: moment(msg_obj.createdAt).format("h:mm a"),
  });
  $msg_div.insertAdjacentHTML("beforeend", html);
  autoscroll();
});
c_socket.on("displayLoc", (loc_obj) => {
  const html = Mustache.render($loc_template, {
    username: loc_obj.username,
    loc_url: loc_obj.url,
    createdAt: moment(loc_obj.createdAt).format("h:mm a"),
  });
  $loc_div.insertAdjacentHTML("beforeend", html);

  autoscroll();
});

//------------

//------------

$msg_form.addEventListener("submit", (e) => {
  e.preventDefault();
  $msg_form_send_btn.setAttribute("disabled", "disabled");
  // access input value inside form
  // method 1 : access input tag then its value
  // const msg = document.querySelector("input").value;

  // method 2: access form elements (e.target.elements using tag's name attribute) then its value
  const msg = e.target.elements.msg_input.value; //msg_input is get by name attribute in html

  c_socket.emit("sendInputMsg", msg, (err) => {
    $msg_form_send_btn.removeAttribute("disabled");
    $msg_form.querySelector("input").value = "";

    if (err) console.log(err);
    console.log("message send.");
  });
});

$send_loc_btn.addEventListener("click", (e) => {
  if (!navigator.geolocation) {
    return alert("your browser does not support geoloaction.");
  }
  // set attribute disabled after lacation shared, it will disabled after one click
  $send_loc_btn.setAttribute("disabled", "disabled");

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      // console.log(pos);
      // loc stands for location
      const loc = {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      };

      c_socket.emit("sendLoc", loc, () => {
        // since btn was disabled after one click, here we again enable btn after location shared
        // means btn disabled during one click and till loc shared to avoid double click
        $send_loc_btn.removeAttribute("disabled");
        console.log("Location Send.");
      });
    } // for call back acknowledge
  );
});

c_socket.emit("joinChat", { username, room }, (err) => {
  if (err) {
    alert(err);
    location.href = "/";
  }
});
