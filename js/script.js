const navbar = document.querySelector(".navbar");
const searchBox = document.getElementById("search-box");
const countriesDropdown = document.querySelector(".dropdown-content");
const searchIcon = document.getElementById("search-icon");
const statisticsContainer = document.getElementById("statistics-container");

let currentCountry;

function renderStatistics() {
	statisticsContainer.childNodes[1].innerHTML = 
	`
	<div class="col-12 mb-sm-2 pt-4">
	  <h2>A lakosság <span>${
		(Math.round((currentCountry.cases.total/currentCountry.population) * 10000)) / 100}
	  %</span>-a kapta el a vírust, amelynek <span>${
		(Math.round((currentCountry.deaths.total/currentCountry.cases.total) * 10000)) / 100}
	  %</span>-a elhunyt.</h2>
	</div>
	`;

	statisticsContainer.childNodes[3].innerHTML = 
	`
	<div class="col-10 col-md-6 col-lg-4 info-box mt-3 mb-2 py-5">
	  <h1>${currentCountry.country}</h1>
	  <p>Legutóbbi frissítés ${currentCountry.time.substring(11, 16)}-kor történt.</p>
	</div>
	`;

	statisticsContainer.childNodes[5].innerHTML =
	`
	<div class="order-0 col-5 col-sm-3 info-box m-2 p-4">
	  <h2>Aktív fertőzött</h2>
	</div>
	
	<div class="order-1 col-5 col-sm-4 info-box m-2 p-4">
	  <h2>Kritikus állapotú</h2>
	</div> 

	<div class="order-4 order-sm-2 col-6 col-sm-3 info-box m-2 p-4">
	  <h2>Elhunyt</h2>
	</div>
	
	<div class="order-2 order-sm-3 col-5 col-sm-3 info-box number-box m-2 p-4">
	  <p><span>${numberWithSpaces(currentCountry.cases.active)}</span></p>
	</div>
	
	<div class="order-3 order-sm-4 col-5 col-sm-4 info-box number-box m-2 p-4">
	  <p><span>${numberWithSpaces(currentCountry.cases.critical)}</span></p>
	</div> 

	<div class="order-5 col-6 col-sm-3 info-box number-box m-2 p-4">
	  <p><span>${numberWithSpaces(currentCountry.deaths.total)}</span></p>
	</div>
	`;

	statisticsContainer.childNodes[7].innerHTML =
	`
	<div class="order-1 col-5 info-box m-2 p-4">
	  <h2>Összes fertőzött</h2>
	</div>
	
	<div class="order-2 order-sm-3 col-5 info-box number-box m-2 p-4">
	  <p><span>${numberWithSpaces(currentCountry.cases.total)}</span></p>
	</div>

	<div class="order-3 order-sm-2 col-5 info-box m-2 p-4">
	  <h2>Tesztek</h2>
	</div>
	
	<div class="order-4 col-5 info-box number-box m-2 p-4">
	  <p><span>${numberWithSpaces(currentCountry.tests.total)}</span></p>
	</div>
	`;
} 

document.addEventListener("scroll", function()  {
	if(window.scrollY > 50) {
		navbar.classList.add("nav-bg-color");
	} else {
		navbar.classList.remove("nav-bg-color");
		navbar.classList.add("nav-bg-fade");
	}	
});


document.addEventListener("DOMContentLoaded", async () => {
	let countryStatistics;
	try {
		countryStatistics = await loadCountryStatistics();
	} catch (e) {
		console.log(e);
	}

	//placeholder
	currentCountry = countryStatistics.find(element => element.country == "Hungary");
	renderStatistics();

	countryStatistics.sort((a, b) => (a.country > b.country) ? 1 : -1);
	let dropdownHTML = "";
	const noneDisplayedElements = ["All","Asia","Africa","Europe",
	"MS-Zaandam","MS-Zaandam-"]
	countryStatistics.forEach(country => {
		if(!noneDisplayedElements.includes(country.country)) {
			dropdownHTML += `<div class="col-12 py-4 px-4 list-item" 
			data-country="${country.country}" onClick="showCountriesToggle()">
			${country.country}</div>`
		} 
	});
	countriesDropdown.innerHTML = dropdownHTML;

	setCountryMenuProperties();

	searchIcon.addEventListener("click", (event) => {
		event.preventDefault();
		selectCountryEventHandler(countryStatistics);
	});

	document.addEventListener('keypress', (event) => {
		if (event.key === 'Enter') {
			selectCountryEventHandler(countryStatistics)
		}
	});
});

function isValidCountry(lisOfCountries, country) {
	for(let i = 0; i < lisOfCountries.length; i++) {
	  if(lisOfCountries[i].country === country) {
	    return true;
	  }
	} 
	return false;
}

function showCountriesToggle() {
	countriesDropdown.classList.toggle("dropdown-content-show");
	window.scroll(0,searchBox.offsetTop-navbar.offsetHeight - 10);
}

function setCountryMenuProperties() {
	const countryMenuItems = document.querySelectorAll(".list-item");
	countryMenuItems.forEach(item => {
		item.addEventListener("click", () => {
			searchBox.value = item.dataset.country;
			countriesDropdown.classList.remove("show");
		});
	});
}

function countriesListFilter() {
	countriesDropdown.classList.add("dropdown-content-show");
  const countryList = countriesDropdown.querySelectorAll(".list-item");
  countryList.forEach(element => {
	const country = element.dataset.country.toUpperCase()
	const searchText = searchBox.value.toUpperCase()
	if(country.startsWith(searchText)) {
		element.style.display = "block";
	} else {
		element.style.display = "none";
	}
  });
}

function selectCountryEventHandler(countryStatistics) {
	const selectedCountry = searchBox.value;
	if(selectedCountry == "") {
	  alert("Nem adott meg országot.");
	} else if(!isValidCountry (countryStatistics, selectedCountry)) {
		alert("Nincs ilyen nevű ország.");
	} else {
	  currentCountry = countryStatistics.find(element => element.country == selectedCountry);
	  renderStatistics();
	  window.scroll(0,statisticsContainer.offsetTop-navbar.offsetHeight);
	}
}

//API calling
async function loadCountryStatistics() {
	const response = await fetch("https://covid-193.p.rapidapi.com/statistics", {
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "covid-193.p.rapidapi.com",
		"x-rapidapi-key": "95fb778ae7msh77ca3d8ac2b653dp17dd48jsna05a72d062fd"
	}
	});

	if(!response.ok) {
		alert("A szerver nem válaszol.");
		return;
	}

	const statistics = await response.json();

	return statistics.response;
}

function numberWithSpaces(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}