window.onload = () => {
  // Resize input field when window is resized
  window.addEventListener("resize", fixInputWidth);

  // Load high score and gamemode from cookie
  const cookies = document.cookie.split("; ");
  for (let cookie of cookies) {
    const [name, value] = cookie.split("=");
    if (name === "highScore") {
      highScore = parseInt(value);
      document.getElementById("high-score").textContent = " " + highScore;
    } else if (name === "gamemode") {
      gamemode = value;
      // Set active gamemode
      setActive(document.getElementById(gamemode), "active");
      document.getElementsByTagName("h1")[0].textContent = `Guess the Flag: ${
        document.getElementById(gamemode).textContent
      }`;
    }
  }

  /* add event listeners to autocomplete function */
  document.getElementById("flag-guess").addEventListener("input", (e) => {
    autocomplete(e.target.value);
  });

  document.getElementById("flag-guess").addEventListener("focus", (e) => {
    autocomplete(e.target.value);
  });

  document.getElementById("flag-guess").addEventListener("blur", () => {
    setTimeout(() => {
      document.getElementById("autocomplete-container").style.display = "none";
    }, 200);
  });

  /* Zoom in on flag image when clicked */
  document.getElementById("flag-img").addEventListener("click", zoomFlag);

  /* Handle form submission with handleForm */
  const form = document.getElementById("flag-form");
  form.addEventListener("submit", handleForm);

  /* Hint button */
  document.getElementById("hint-button").addEventListener("click", () => {
    hintMsg = [
      window.country.area
        ? `The country's area is <strong>${Math.floor(
            window.country.area
          ).toLocaleString()}m²</strong>.`
        : false,
      window.country.population
        ? `The country's population is <strong>${window.country.population.toLocaleString()}</strong>.`
        : false,
      window.country.subregion
        ? `The country is in the <strong>${window.country.subregion}</strong> region.`
        : false,
      window.country.languages
        ? `The country's primary language is <strong>${
            Object.values(window.country.languages)[0]
          }</strong>.`
        : false,
      window.country.languages
        ? `This country speaks <strong>${
            window.country.languages.length
          } language${window.country.languages.length > 1 ? "s" : ""}</strong>.`
        : false,
      window.country.languages && window.country.languages.length > 1
        ? `This country speaks the following languages: <strong>${Object.values(
            window.country.languages
          ).join(", ")}</strong>.`
        : false,
      window.country.capital
        ? `The country's capital is <strong>${window.country.capital}</strong>.`
        : false,
      window.country.currencies
        ? `The country's primary currency is <strong>${
            Object.values(window.country.currencies)[0]
          }</strong>.`
        : false,
      window.country.currencies && window.country.currencies.length > 1
        ? `This country uses the following currencies: <strong>${Object.values(
            window.country.currencies
          ).join(", ")}</strong>.`
        : false,
      window.country.unMember
        ? "This country <strong>is</strong> a member of the United Nations."
        : "This country <strong>is not</strong> a member of the United Nations.",
    ];

    nextHintKey = Math.floor(
      Math.random() * hintMsg.filter((msg) => msg !== false).length
    );
    nextHint = hintMsg.filter((msg) => msg !== false)[nextHintKey];

    alertBox("Hint", nextHint, "#ffc107");

    hint++;
    hints++;
    document.getElementById("hint-button").textContent = `Hint (${hints})`;
  });

  const gamemodeSwitcher = document.getElementById("gamemode-switcher");
  const gamemodeElements = gamemodeSwitcher.getElementsByTagName("span");
  for (var i = 0; i < gamemodeElements.length; i++) {
    const element = gamemodeElements[i];
    switch (element.id) {
      case "endless":
        element.addEventListener("click", () => {
          switchGamemode(element);
        });
        break;
      case "onehundredpercent":
        element.addEventListener("click", () => {
          switchGamemode(element);
        });
        break;
      case "threelives":
        element.addEventListener("click", () => {
          switchGamemode(element);
        });
        break;
      case "twominutes":
        element.addEventListener("click", () => {
          switchGamemode(element);
          // Start countdown timer for 2 minutes with async
          countdown(
            2,
            () => {
              // Update h1 text content to show time remaining
              document.getElementsByTagName(
                "h1"
              )[0].textContent = `Guess the Flag: ${gamemodeVariables.twominutesText}`;
            },
            () => {
              // End game when timer reaches 0
              alertBox(
                "Game Over",
                `Game over! You scored ${score}/${attempts}.`,
                "#dc3545"
              );
              score = 0;
              attempts = 0;
              document.getElementById(
                "score"
              ).textContent = ` ${score}/${attempts}`;
              document.getElementsByTagName(
                "h1"
              )[0].textContent = `Guess the Flag: ${element.textContent}`;
            }
          );
        });
        break;
      default:
        break;
    }
  }

  fixInputWidth();
  document.getElementById("flag-img").src = getFlagUrl(
    window.country.iso2_code
  );
};

window.country = null;
let score = 0,
  highScore = 0,
  attempts = 0,
  hint = 0,
  hints = 0,
  hintMsg,
  nextHint,
  nextHintKey,
  errorWindow = false,
  autocompleting = false,
  gamemode = "endless",
  exitTimer = false;

const gamemodeVariablesDefault = {
  endless: false,
  onehundredpercent: 0,
  onehundredpercentCountries: [],
  threelives: 3,
  twominutes: 120,
  twominutesText: "2:00",
};

let gamemodeVariables = { ...gamemodeVariablesDefault };

function setActive(element, className = "active") {
  document.getElementsByClassName("active")[0].classList.remove(className);
  element.classList.add(className);
}

function switchGamemode(element) {
  if (gamemode === "twominutes") {
    exitTimer = true;
    // wait for timer to exit
    setTimeout(() => {
      if (element.id === "twominutes") {
        setActive(element);
        gamemode = element.id;
        console.log("switched to gamemode", gamemode);
        document.getElementsByTagName(
          "h1"
        )[0].textContent = `Guess the Flag: ${element.textContent}`;
        // add current gamemode to cookie
        document.cookie = `gamemode=${gamemode}; expires=Fri, 31 Dec 9999 23:59:59 GMT`;
        gamemodeVariables = { ...gamemodeVariablesDefault };
      }
    }, 200);
  } else if (gamemode !== element.id && gamemode !== "twominutes") {
    setActive(element);
    gamemode = element.id;
    console.log("switched to gamemode", gamemode);
    document.getElementsByTagName(
      "h1"
    )[0].textContent = `Guess the Flag: ${element.textContent}`;
    // add current gamemode to cookie
    document.cookie = `gamemode=${gamemode}; expires=Fri, 31 Dec 9999 23:59:59 GMT`;
    gamemodeVariables = { ...gamemodeVariablesDefault };
  }
}

/* load country data */
fetch("./country_codes.json")
  .then((response) => response.json())
  .then((json) => {
    // Store country data in global variables
    window.countryData = json;

    window.countries_en = [];
    window.countries_fr = [];
    window.countries_es = [];

    for (let country of json) {
      window.countries_en.push(country.label_en);
      window.countries_fr.push(country.label_fr);
      window.countries_es.push(country.label_sp);
    }

    window.countries_en.sort();
    window.countries_fr.sort();
    window.countries_es.sort();

    /* load flag image and country name */
    const flagImg = document.getElementById("flag-img");
    window.country = getRandomCountry();
    flagImg.src = getFlagUrl(window.country.iso2_code);
  });

/* helper functions */
/* helper function to get random country */
function getRandomCountry() {
  return window.countryData[
    Math.floor(Math.random() * window.countryData.length)
  ];
}

/* helper function to get flag image url */
function getFlagUrl(countryCode) {
  return `https://flagcdn.com/w2560/${countryCode.toLowerCase()}.png`;
}

/* helper function to convert country name to country code */
function countryNameToCode(countryName) {
  for (let country of window.countryData) {
    if (
      country.label_en.toLowerCase() === countryName.toLowerCase() ||
      country.label_fr.toLowerCase() === countryName.toLowerCase() ||
      country.label_sp.toLowerCase() === countryName.toLowerCase()
    ) {
      return country.iso2_code;
    }
  }
  return null;
}

/* flag-guess text input autocomplete function */
function autocomplete(inputValue) {
  const autocompleteContainer = document.getElementById(
    "autocomplete-container"
  );
  const countries = window.countries_en;
  const filteredCountries = countries.filter((country) =>
    country.toLowerCase().includes(inputValue.toLowerCase())
  );

  autocompleteContainer.innerHTML = ""; // Clear previous results

  if (filteredCountries.length > 0) {
    autocompleteContainer.style.display = "block";

    // Create list of countries that match the input value
    const ul = document.createElement("ul");
    filteredCountries.forEach((country) => {
      const li = document.createElement("li");
      li.textContent = country;
      li.addEventListener("click", () => {
        document.getElementById("flag-guess").value = country;
        autocompleteContainer.style.display = "none";
      });
      ul.appendChild(li);
    });
    autocompleteContainer.appendChild(ul);

    // Select the first item in the autocomplete list
    if (ul.firstChild) {
      ul.firstChild.classList.add("selected");
    }

    const inputField = document.getElementById("flag-guess");
    let selectedIndex = 0; // Keep track of the currently selected index
    autocompleting = true;

    inputField.addEventListener("keydown", (e) => {
      if (
        autocompleting &&
        document.activeElement === inputField &&
        !errorWindow
      ) {
        if (e.keyCode === 9 && filteredCountries.length > 0) {
          // Tab key
          e.preventDefault(); // Prevent default tabbing
          const currentSelected =
            autocompleteContainer.querySelector(".selected");
          if (currentSelected) {
            currentSelected.classList.remove("selected");
          }

          // Go to previous item in the list if shift key is pressed
          if (e.shiftKey) {
            selectedIndex =
              (selectedIndex - 1 + filteredCountries.length) %
              filteredCountries.length; // Decrement index, wrap around if needed
          } else {
            selectedIndex = (selectedIndex + 1) % filteredCountries.length; // Increment index, wrap around if needed
          }

          const nextItem = ul.children[selectedIndex];
          nextItem.classList.add("selected");
        } else if (e.keyCode === 38 && filteredCountries.length > 0) {
          // Up arrow key
          e.preventDefault(); // Prevent default scrolling
          const currentSelected =
            autocompleteContainer.querySelector(".selected");
          if (currentSelected) {
            currentSelected.classList.remove("selected");
          }
          selectedIndex =
            (selectedIndex - 1 + filteredCountries.length) %
            filteredCountries.length; // Decrement index, wrap around if needed
          const prevItem = ul.children[selectedIndex];
          prevItem.classList.add("selected");
        } else if (e.keyCode === 40 && filteredCountries.length > 0) {
          // Down arrow key
          e.preventDefault(); // Prevent default scrolling
          const currentSelected =
            autocompleteContainer.querySelector(".selected");
          if (currentSelected) {
            currentSelected.classList.remove("selected");
          }
          selectedIndex = (selectedIndex + 1) % filteredCountries.length; // Increment index, wrap around if needed
          const nextItem = ul.children[selectedIndex];
          nextItem.classList.add("selected");
        }
      }
    });

    inputField.addEventListener("keypress", (e) => {
      if (e.keyCode === 13 && filteredCountries.length > 0) {
        // Enter key

        const currentSelected =
          autocompleteContainer.querySelector(".selected");

        if (currentSelected) {
          document.getElementById("flag-guess").value =
            currentSelected.textContent;

          // Hide autocomplete list
          autocompleteContainer.style.display = "none";

          // Prevent accidental autocomplete submission
          autocompleting = false;

          e.preventDefault(); // Prevent form submission (initially)
        } else {
          document
            .getElementById("flag-form")
            .dispatchEvent(new Event("submit"));
        }
      }
    });
  } else {
    autocompleteContainer.style.display = "none"; // Hide if no results
  }
}

/* alert box */
function alertBox(title, message, color = "#007bff", autofocus = false) {
  if (!errorWindow) {
    const alertBox = document.createElement("div");
    alertBox.classList.add("alert-box");
    alertBox.innerHTML = `
    <div class="alert-box-content">
      <div class="alert-box-header" style="background-color: ${color}">
        <h2>${title}</h2>
      </div>
      <div class="alert-box-body">
        <p>${message}</p>
        <button class="alert-box-close" style="background-color: ${
          color == "#007bff" ? "#007bff" : "#666"
        }">Close</button>
      </div>
    </div>
  `;

    // Close alert box when close button is clicked
    alertBox
      .querySelector(".alert-box-close")
      .addEventListener("click", closeAlertBox);

    // Unfocus input fields when alert box is opened
    document.getElementById("flag-guess").blur();
    document.getElementById("text-submit").blur();

    // Prevent autocomplete from interfering with alert box
    autocompleting = false;

    // Close alert box when clicked outside of the box
    alertBox.addEventListener("click", (e) => {
      if (e.target === alertBox) {
        closeAlertBox(autofocus);
      }
    });

    // Close alert box when key is pressed
    window.addEventListener("keydown", (e) => {
      if (errorWindow && (e.key === "Escape" || e.key === "Enter")) {
        closeAlertBox(autofocus);
      }
    });

    document.body.appendChild(alertBox);
    errorWindow = true;
  }
}

/* close alert box */
function closeAlertBox(autofocus = false) {
  if (errorWindow) {
    // Remove alert box from the DOM
    const alertBox = document.querySelector(".alert-box");
    alertBox.remove();
    errorWindow = false;
  }

  // Refocus input field with short delay if autofocus is true
  if (autofocus) {
    setTimeout(() => {
      document.getElementById("flag-guess").focus();
    }, 100);
  }
}

/* flag zoom */
function zoomFlag() {
  // flag zooms in on click and then zooms out on click again.
  // make flag 80% of screen width/height, depending on which is smaller
  // grey out background to the same degree as alertBox
  // use a new img element with fixed position to display the zoomed flag
  // clicking on the zoomed flag will close it

  if (!document.getElementById("zoomed-flag")) {
    const zoomedFlagContainer = document.createElement("div");
    const zoomedFlag = document.createElement("img");

    zoomedFlagContainer.id = "zoomed-flag";

    zoomedFlag.src = document
      .getElementById("flag-img")
      .src.replace("w2560", "w1280");
    zoomedFlag.alt = "Flag";
    zoomedFlag.style.transform = "scale(0.8) translate(-62.5%, -62.5%)";

    zoomedFlag.classList.add("zoomed-flag");
    zoomedFlagContainer.classList.add("zoomed-flag-container");

    zoomedFlagContainer.addEventListener("click", zoomFlag);

    zoomedFlagContainer.appendChild(zoomedFlag);
    document.body.appendChild(zoomedFlagContainer);

    // Zoom in on flag animation after 100ms
    setTimeout(() => {
      zoomedFlag.style.transform = "scale(1) translate(-50%, -50%)";
    }, 1);
  } else {
    document.getElementById("zoomed-flag").remove();
  }
}

/* handle form submission */
function handleForm(event) {
  event.preventDefault();
  console.log("Guess: ", document.getElementById("flag-guess").value);
  let guess = document.getElementById("flag-guess").value;
  let refresh = false;

  // Clear autocomplete list and reset autocompleting flag
  const autocompleteContainer = (document.getElementById(
    "autocomplete-container"
  ).innerHTML = ""); // Clear autocomplete list
  autocompleting = false;

  if (guess === "") {
    alertBox("Error", "Please enter a country name.");
    return;
  } else if (countryNameToCode(guess) === null) {
    alertBox("Error", "Invalid country name.");
    return;
  } else if (countryNameToCode(guess) === window.country.iso2_code) {
    alertBox(
      "Correct",
      `Correct! The flag is from <strong>${guess}</strong>.`,
      "#28a745"
    );
    console.log(`Correct. The flag is from ${guess}.`);
    score++;
    refresh = true;
  } else {
    console.log(`Incorrect. The flag is from ${window.country.label_en}.`);
    let gameover = false;
    if (gamemode === "threelives") {
      gamemodeVariables.threelives--;
      document.getElementsByTagName(
        "h1"
      )[0].textContent = `Guess the Flag: ${gamemodeVariables.threelives} Lives`;
      if (gamemodeVariables.threelives === 0) {
        gameover = true;
        alertBox(
          "Game Over",
          `Game over! You scored ${score}/${attempts}.`,
          "#dc3545"
        );
        score = 0;
        attempts = 0;
        gamemodeVariables.threelives = 3;
      }
    }

    if (!gameover) {
      alertBox(
        "Incorrect",
        `Incorrect. The flag is from <strong>${window.country.label_en}</strong>.`,
        "#dc3545"
      );
    }
    refresh = true;
  }

  if (refresh) {
    hint = 0;
    if (gamemode === "onehundredpercent") {
      gamemodeVariables.onehundredpercent++;
      gamemodeVariables.onehundredpercentCountries.push(window.country);
      // Update h1 text content to show percentage of flags completed
      document.getElementsByTagName("h1")[0].textContent = `Guess the Flag: ${
        Math.round(
          (gamemodeVariables.onehundredpercent / window.countryData.length) *
            1000
        ) / 10
      }%`;
      console.log(
        gamemodeVariables.onehundredpercent / window.countryData.length
      );
      if (gamemodeVariables.onehundredpercent >= window.countryData.length) {
        alertBox(
          "Game Over",
          `Game over! You scored ${score}/${window.countryData.length}.`,
          "#dc3545"
        );
        score = 0;
        attempts = 0;
        gamemodeVariables.onehundredpercent = 0;
      } else {
        while (
          gamemodeVariables.onehundredpercentCountries.includes(
            (window.country = getRandomCountry())
          )
        );
      }
    } else {
      window.country = getRandomCountry();
    }
    document.getElementById("flag-img").src = getFlagUrl(
      window.country.iso2_code
    );
    document.getElementById("flag-guess").value = "";
    document.getElementById("autocomplete-container").style.display = "none";
    attempts++;

    document.getElementById("score").textContent = ` ${score}/${attempts}`;
    if (score > highScore && gamemode === "endless") {
      highScore = score;
      document.getElementById("high-score").textContent = " " + highScore;
      document.cookie = `highScore=${highScore}; expires=Fri, 31 Dec 9999 23:59:59 GMT`;
    }

    fixInputWidth();
  }
}

/* fix input width */
function fixInputWidth() {
  /* Autoresize input field */
  const subcontainer = document.getElementById("score-subcontainer");
  const guessinput = document.getElementById("flag-guess");
  const textsubmit = document.getElementById("text-submit");

  guessinput.style.width = `${
    subcontainer.offsetWidth - textsubmit.offsetWidth - 24
  }px`;
}

let timeoutHandle;
function countdown(minutes, secFunction = null, endFunction = null) {
  let seconds = 60;
  let mins = minutes;
  function tick() {
    if (exitTimer) {
      console.log("exiting timer");
      exitTimer = false;
      return;
    }
    if (secFunction) {
      secFunction();
    }
    let current_minutes = mins - 1;
    seconds--;
    gamemodeVariables.twominutesText =
      current_minutes.toString() +
      ":" +
      (seconds < 10 ? "0" : "") +
      String(seconds);
    if (seconds > 0) {
      timeoutHandle = setTimeout(tick, 1000);
    } else {
      if (mins > 1) {
        setTimeout(function () {
          countdown(mins - 1);
        }, 1000);
      } else {
        if (endFunction) {
          endFunction();
        }
      }
    }
  }
  tick();
}
