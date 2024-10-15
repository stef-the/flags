window.onload = () => {
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

  document.getElementById("hint-button").addEventListener("click", () => {
    switch (hint) {
      case 0:
        alertBox(
          "Hint",
          `The country's area is <strong>${Math.floor(
            window.country.area
          ).toLocaleString()}m²</strong>.`
        );
        break;
      case 1:
        alertBox(
          "Hint",
          `The country's population is <strong>${window.country.population.toLocaleString()}</strong>.`
        );
        break;
      case 2:
        alertBox(
          "Hint",
          `The country is in the <strong>${window.country.subregion}</strong> region.`
        );
        break;
      case 3:
        alertBox(
          "Hint",
          `The country's primary language is <strong>${
            Object.values(window.country.languages)[0]
          }</strong>.`
        );
        break;
      default:
        hint = 1;
        alertBox(
          "Hint",
          `The country's area is <strong>${Math.floor(
            window.country.area
          ).toLocaleString()}m²</strong>.`
        );
        return;
    }
    hint++;
    hints++;
    document.getElementById("hint-button").textContent = `Hint (${hints})`;
  });

  /* add event listener to form */
  const form = document.getElementById("flag-form");
  function handleForm(event) {
    event.preventDefault();
    console.log("Guess: ", event);
    let guess = document.getElementById("flag-guess").value;
    let refresh = false;

    if (guess === "") {
      alertBox("Error", "Please enter a country name.");
      return;
    } else if (countryNameToCode(guess) === null) {
      alertBox("Error", "Invalid country name.");
      return;
    } else if (countryNameToCode(guess) === window.country.iso2_code) {
      alertBox("Correct", `Correct! The flag is from <strong>${guess}</strong>.`, "#28a745");
      score++;
      refresh = true;
    } else {
      alertBox("Incorrect", `Incorrect. The flag is from <strong>${window.country.label_en}</strong>.`, "#dc3545");
      refresh = true;
    }

    if (refresh) {
      hint = 0;
      window.country = getRandomCountry();
      document.getElementById("flag-img").src = getFlagUrl(
        window.country.iso2_code
      );
      document.getElementById("flag-guess").value = "";
      document.getElementById("autocomplete-container").style.display = "none";
      attempts++;

      document.getElementById("score").textContent = `${score}/${attempts}`;
      if (score > highScore) {
        highScore = score;
        document.getElementById("high-score").textContent = highScore;
      }
    }
  }
  form.addEventListener("submit", handleForm);
};

window.country = null;
let score = 0,
  highScore = 0,
  attempts = 0,
  hint = 0,
  hints = 0;

/* load country data */
fetch("./country_codes.json")
  .then((response) => response.json())
  .then((json) => {
    console.log("Country data loaded.");
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
function getRandomCountry() {
  return window.countryData[
    Math.floor(Math.random() * window.countryData.length)
  ];
}

function getFlagUrl(countryCode) {
  return `https://flagcdn.com/w2560/${countryCode.toLowerCase()}.png`;
}

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

function autocomplete(inputValue) {
  const autocompleteContainer = document.getElementById(
    "autocomplete-container"
  );
  const countries = window.countries_en;
  const filteredCountries = countries.filter((country) =>
    country.toLowerCase().includes(inputValue.toLowerCase())
  );

  if (filteredCountries.length > 0) {
    autocompleteContainer.innerHTML = "";
    autocompleteContainer.style.display = "block";

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

    // Add event listener to input field for tab and enter key presses
    const inputField = document.getElementById("flag-guess");
    inputField.addEventListener("keydown", (e) => {
      if (e.keyCode === 9 && filteredCountries.length > 0) {
        // Select the first item in the autocomplete list
        const firstItem = autocompleteContainer.querySelector("li");
        document.getElementById("flag-guess").value = firstItem.textContent;
        autocompleteContainer.style.display = "none";
        e.preventDefault(); // prevent form submission
      }
    });
    inputField.addEventListener("keypress", (e) => {
      if (
        e.keyCode === 13 &&
        filteredCountries.length > 0 &&
        autocompleteContainer.style.display === "block"
      ) {
        // Select the first item in the autocomplete list
        const firstItem = autocompleteContainer.querySelector("li");
        document.getElementById("flag-guess").value = firstItem.textContent;
        autocompleteContainer.style.display = "none";
        e.preventDefault(); // prevent form submission
      }
    });
  } else {
    autocompleteContainer.style.display = "none";
  }
}

function alertBox(title, message, color="#007bff") {
  const alertBox = document.createElement("div");
  alertBox.classList.add("alert-box");
  alertBox.innerHTML = `
    <div class="alert-box-content">
      <div class="alert-box-header" style="background-color: ${color}">
        <h2>${title}</h2>
      </div>
      <div class="alert-box-body">
        <p>${message}</p>
        <button class="alert-box-close" style="background-color: ${color=="#007bff" ? "#007bff" : "#aaa"}">Close</button>
      </div>
    </div>
  `;
  alertBox
    .querySelector(".alert-box-close")
    .addEventListener("click", closeAlertBox);
  document.body.appendChild(alertBox);
}

function closeAlertBox() {
  const alertBox = document.querySelector(".alert-box");
  alertBox.remove();
}
