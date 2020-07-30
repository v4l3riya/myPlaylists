//domelements are in one object
//should you make them into a function?? globals are bad right?
const domElements = {
  h1: document.querySelector(".main-h1"),
  nav: document.querySelector(".main-nav"),
  modal: document.querySelector(".about"),
  modalButton: document.querySelector(".about-btn"),
  closeButton: document.querySelector(".close-about"),
  playlist: document.querySelector(".playlist-content"),
  currGen: "",
  genres: [
    document.querySelector(".mood").querySelector(".inner"),
    document.querySelector(".rock").querySelector(".inner"),
    document.querySelector(".indie").querySelector(".inner"),
    document.querySelector(".rap").querySelector(".inner"),
    document.querySelector(".party").querySelector(".inner"),
  ],
};

const UIStuff = (function () {
  //custom scrollbar, simplebar API
  new SimpleBar(document.querySelector(".playlist-content"));

  domElements.nav.addEventListener("click", transition);
  domElements.modalButton.addEventListener("click", show);
  domElements.closeButton.addEventListener("click", close);

  //functions for modal
  function show() {
    domElements.modal.style.display = "block";
  }
  function close() {
    domElements.modal.style.display = "none";
  }

  //function moves around header and navigation after nav is clicked
  function transition(e) {
    //will return HTML Collection, so convert it to regular array
    //Array from creates a shallow copy array, good for this conversion!

    domElements.nav.style.textAlign = "center";
    domElements.nav.style.marginTop = "-20px";
    domElements.h1.style.marginTop = "-50px";
    domElements.h1.style.marginBottom = "0px";

    let li2 = Array.from(domElements.nav.getElementsByTagName("li"));
    li2.forEach((element) => {
      let s = element.style;
      //need inline-block for transform to work correctly!
      s.display = "inline-block";
      s.padding = "10px 20px 0 0";
      s.fontSize = "1.8em";
      element.onmouseover = () => {
        s.transform = "scale(1.3, 1.3)";
        s.transform = "translateY(10px)";
      };
      element.onmouseout = () => {
        s.transform = "scale(1, 1)";
        s.transform = "translateY(0)";
      };
    });

    document.getElementsByTagName("body")[0].style.background =
      "url(images/background-repeat.jpg)";

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
    let s = domElements.nav.style;
    if (mediaQ.matches) {
      s.fontSize = ".8em";
      s.paddingTop = "20px";
      s.width = "100%";
      s.position = "static";
    } else {
      s.fontSize = "1em";
      s.paddingTop = "0";
      s.width = "80%";
    }
  }

  function resizeText2(mediaQ2) {
    if (mediaQ2.matches) {
      domElements.nav.style.marginLeft = "13%";
    } else {
      domElements.nav.style.marginLeft = "0";
    }
  }

  function showPlaylist() {
    domElements.playlist.style.display = "block";
  }
})();

//!!TAKE DOM ELEMENTS OUT INTO THEIR OWN FUNCTION!!
const APIStuff = (function () {
  //!!!!HIDE THIS LATER??!!!!///
  const clientId = "0cc846d4a7fa4e96b68e7cdd2f1c6944";
  const clientSecret = "38f994c013754ebab11cebd191d8e277";

  domElements.nav.addEventListener("click", switchy);

  function switchy(e) {
    //will use this stored property to be referred to in the Spotify portion
    domElements.nav.curr = e.target.innerText;
    //ties in the curr target with the playlist IDs below:
    switch (domElements.nav.curr) {
      case "MOOD":
        domElements.nav.curr = "1E5p2QvD7m3GiUjKie3Tq8";
        domElements.currGen = domElements.genres[0];
        break;
      case "ROCK":
        domElements.nav.curr = "7HeGm8f6NI1sw1dleg7EJY";
        domElements.currGen = domElements.genres[1];
        break;
      case "INDIE":
        domElements.nav.curr = "7kiElCg4UzWxtiIf6MI8hr";
        domElements.currGen = domElements.genres[2];
        break;
      case "RAP":
        domElements.nav.curr = "4ecx05Qs92trxHvs1Yi58J";
        domElements.currGen = domElements.genres[3];
        break;
      case "PARTY":
        domElements.nav.curr = "2vTleEUqWbktih4ypWrpwh";
        domElements.currGen = domElements.genres[4];
        break;
    }
    console.log(domElements.nav.curr);
  }

  //invoke as a function to get the stuff - (but why???)
  const _getToken = async () => {
    const result = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        //btoa() encodes a string in base-64 and then use atob() to decode! DON'T FORGET THIS STUPID ASS SPACE AFTER BASIC GOOD LORD WHY DID THAT TAKE HOURS AGH
        Authorization: "Basic " + btoa(clientId + ":" + clientSecret),
      },
      body: "grant_type=client_credentials",
    });
    //gets reponse from fetch and then uses the JSON method to turn it into JSON, then passes json to the next line for the next function
    const data = await result.json();

    return data.access_token;
  };

  const _getPlaylists = async (token) => {
    //need to specify a limit in here as well or it won't work...
    const limit = 12;
    const result = await fetch(
      `https://api.spotify.com/v1/playlists/${domElements.nav.curr}/tracks?limit=${limit}`,
      {
        method: "GET",
        headers: { Authorization: "Bearer " + token },
      }
    );

    const data = await result.json();

    return data;
  };

  ///!!! ISSUE WITH OBJECT/ARRAY SYNTAX HERE THIS IS WHY IT IS NOT WORKING!!! FIX THE MUSIC/ALBUM PART OK
  //creating array to place in the Spotify API data
  function showMusic(data, limit) {
    const music = { album: [], artist: [], name: [], image: [] };
    for (let i = 0; i < limit; i++) {
      music.album[i] = data.items[i].track.album.name;
      music.artist[i] = data.items[i].track.artists[0].name;
      music.name[i] = data.items[i].track.name;
      music.image[i] = data.items[i].track.album.images[1].url;
    }
    return music;
  }

  return {
    //public methods have access to the private methods
    getToken() {
      return _getToken();
    },
    getPlaylists(token) {
      return _getPlaylists(token);
    },
    showMusic(data, limit) {
      return showMusic(data, limit);
    },
  };
})();

//make this neater mmmK
//returns the actua generated list and throws shit together
const UIInteraction = (function () {
  const music = {};

  domElements.nav.addEventListener("click", async (e) => {
    const limit = 12;
    const token = await tokenFN();
    const playlists = await APIStuff.getPlaylists(token);
    console.log(APIStuff.showMusic(playlists, limit));
    music.list = APIStuff.showMusic(playlists, limit);
    UIUpdate(limit);
  });

  function UIUpdate(x) {
    for (let i = 0; i < x; i++) {
      domElements.currGen.innerHTML += music.list.album[i] + "<br>";
    }
  }

  function tokenFN() {
    return APIStuff.getToken();
  }
  //remember, when returning this variable it becomes the "value" of UIInteraction NOT a property of it!!!
  return music;
})();

//takes the generated shit and updates the style nicer
//maybe merge with previous UI function up top?
