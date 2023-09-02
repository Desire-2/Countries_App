let jsonData = []; // Store the fetched country data
let selectedCountry = null;

function displayCountryDetails(country) {
    const detailsContainer = document.getElementById("country-details");
    detailsContainer.innerHTML = ""; // Clear previous details

    const detailsList = document.createElement("ul");
    detailsList.innerHTML = `
        <li><strong>Name:</strong> ${country.name.common}</li>
        <li><strong>Capital:</strong> ${country.capital[0]}</li>
        <li><strong>Calling Codes:</strong> ${country.callingCodes.join(", ")}</li>
        <li><strong>Region:</strong> ${country.region}</li>
        <li><strong>Population:</strong> ${country.population}</li>
        <li><strong>Demonym:</strong> ${country.demonym}</li>
        <li><strong>Area:</strong> ${country.area} square kilometers</li>
        <li><strong>Timezones:</strong> ${country.timezones.join(", ")}</li>
        <li><strong>Currencies:</strong> ${country.currencies[0].name} (${country.currencies[0].code})</li>
        <li><strong>Languages:</strong> ${Object.values(country.languages).join(", ")}</li>
        <li><strong>Translations:</strong> 
            <ul>
                <li><strong>BR:</strong> ${country.translations.br}</li>
                <li><strong>PT:</strong> ${country.translations.pt}</li>
                <li><strong>NL:</strong> ${country.translations.nl}</li>
                <li><strong>HR:</strong> ${country.translations.hr}</li>
                <li><strong>FA:</strong> ${country.translations.fa}</li>
                <li><strong>DE:</strong> ${country.translations.de}</li>
                <li><strong>ES:</strong> ${country.translations.es}</li>
                <li><strong>FR:</strong> ${country.translations.fr}</li>
                <li><strong>JA:</strong> ${country.translations.ja}</li>
                <li><strong>IT:</strong> ${country.translations.it}</li>
                <li><strong>HU:</strong> ${country.translations.hu}</li>
            </ul>
        </li>
        <li><strong>Borders:</strong> ${country.borders.join(", ")}</li>
    `;

    const flagImage = document.createElement("img");
    flagImage.src = country.flags.png;
    flagImage.alt = `${country.name.common} Flag`;
    flagImage.classList.add("flag-image");
    detailsContainer.appendChild(flagImage);

    detailsContainer.appendChild(detailsList);
}

async function selectCountry(country) {
    try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${country.name.common}?fullText=true`);
        const data = await response.json();

        if (data.status === 404) {
            throw new Error("Country not found.");
        }

        displayCountryDetails(data[0]);
    } catch (error) {
        console.error("An error occurred while fetching country data:", error);
    }
}

function renderCountryList(countries) {
    const countryList = document.getElementById("country-list");
    countryList.innerHTML = "";

    countries.forEach((country) => {
        const listItem = document.createElement("div");
        listItem.classList.add("country-item");
        const flagImage = document.createElement("img");
        flagImage.src = country.flags.png;
        flagImage.alt = `${country.name.common} Flag`;
        flagImage.classList.add("flag-image");
        const countryName = document.createElement("span");
        countryName.textContent = country.name.common;
        flagImage.addEventListener("click", () => {
            selectCountry(country);
        });

        countryName.addEventListener("click", () => {
            selectCountry(country);
        });
        listItem.appendChild(flagImage);
        listItem.appendChild(countryName);
        countryList.appendChild(listItem);
    });
}

async function fetchCountries() {
    try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        jsonData = await response.json();
        renderCountryList(jsonData);
        const searchInput = document.getElementById("country_input");
        const regionFilter = document.getElementById("region_filter");

        function filterCountries() {
            const searchTerm = searchInput.value.toLowerCase();
            const selectedRegion = regionFilter.value.toLowerCase();

            const filteredCountries = jsonData.filter((country) => {
                const nameMatch = country.name.common.toLowerCase().includes(searchTerm);
                const regionMatch = selectedRegion === "" || country.region.toLowerCase() === selectedRegion;
                return nameMatch && regionMatch;
            });
            renderCountryList(filteredCountries);
            clearCountryDetails();
        }
        searchInput.addEventListener("input", filterCountries);
        regionFilter.addEventListener("change", filterCountries);

        const darkModeToggle = document.getElementById("dark_mode_toggle");
        darkModeToggle.addEventListener("change", () => {
            document.body.classList.toggle("dark-mode", darkModeToggle.checked);
        });
    } catch (error) {
        console.error("An error occurred while fetching data: ", error);
    }
}

function clearCountryDetails() {
    const detailsContainer = document.getElementById("country-details");
    detailsContainer.innerHTML = "";
}
fetchCountries();
