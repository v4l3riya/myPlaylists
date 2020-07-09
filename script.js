let h1 = document.querySelector(".main-h1");
let nav = document.querySelector(".main-nav");
let modal = document.querySelector(".about");
let modalButton = document.querySelector(".about-btn");
let closeButton = document.querySelector(".close-about");

//custom scrollbar
new SimpleBar(document.querySelector(".playlist-content"));

nav.addEventListener("click", transition);
modalButton.addEventListener("click", show);
closeButton.addEventListener("click", close);

//functions for modal
function show() {
  modal.style.display = "block";
}
function close() {
  modal.style.display = "none";
}

//function moves around header and navigation after nav is clicked
function transition() {
  //will return HTML Collection, so conver it to regular array
  //Array from creates a shallow copy array, good for this conversion!

  nav.style.textAlign = "center";
  nav.style.marginTop = "-20px";
  h1.style.marginTop = "-50px";
  h1.style.marginBottom = "0px";

  let li2 = Array.from(nav.getElementsByTagName("li"));
  li2.forEach((element) => {
    //need inline-block for transform to work correctly!
    element.style.display = "inline-block";
    element.style.padding = "10px 20px 0 0";
    element.style.fontSize = "1.8em";
    element.onmouseover = () => {
      element.style.transform = "scale(1.3, 1.3)";
      element.style.transform = "translateY(10px)";
    };
    element.onmouseout = () => {
      element.style.transform = "scale(1, 1)";
      element.style.transform = "translateY(0)";
    };
  });

  document.getElementsByTagName("body")[0].style.background =
    "url(/images/background-repeat.jpg)";

  //media query for javascript w listener and shit to listen for resize events
  const mediaQ = window.matchMedia("(max-width: 980px)");
  mediaQ.addListener(resizeText);
  resizeText(mediaQ);

  const mediaQ2 = window.matchMedia("(min-width: 980px)");
  mediaQ2.addListener(resizeText2);
  resizeText2(mediaQ2);

  showPlaylist();
} //End of transition function

//resizes nav text depending on media query
function resizeText(mediaQ) {
  if (mediaQ.matches) {
    nav.style.fontSize = ".8em";
    nav.style.paddingTop = "20px";
    nav.style.width = "100%";
    nav.style.position = "static";
  } else {
    nav.style.fontSize = "1em";
    nav.style.paddingTop = "0";
    nav.style.width = "80%";
  }
}

function resizeText2(mediaQ2) {
  if (mediaQ2.matches) {
    nav.style.marginLeft = "13%";
  } else {
    nav.style.marginLeft = "0";
  }
}

function showPlaylist() {
  let playlist = document.querySelector(".playlist-content");
  playlist.style.display = "block";
}
