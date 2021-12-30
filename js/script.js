const navbar = document.querySelector(".navbar");
const searchBox = document.getElementById("search-box");
const countriesDropdown = document.getElementById("countries-dropdown");

const searchIcon = document.getElementById("search-icon");

document.addEventListener("DOMContentLoaded", async () => {
	let countryStatistics;
	try {
		countryStatistics = await loadCountryStatistics();
	} catch (e) {
		console.log(e);
	}

	countryStatistics.sort((a, b) => (a.country > b.country) ? 1 : -1);
	let dropdownHTML = "";
	console.log(countryStatistics)
	const noneDisplayedElements = ["All","Asia","Africa","Europe"]
	countryStatistics.forEach(country => {
		if(!noneDisplayedElements.includes(country.country)) {
			dropdownHTML += `<li class="country-menu-item" data-country="${country.country}" onClick="showCountriesToggle()">${country.country}</li>`
		} 
	});
	countriesDropdown.childNodes[1].innerHTML = dropdownHTML;
	setCountryMenuProperties();
});

document.addEventListener("scroll", function()  {
	if(window.scrollY > 50) {
		navbar.classList.add("bg-color");
	} else {
		navbar.classList.remove("bg-color");
		navbar.classList.add("bg-color-fade");
	}	
});

function showCountriesToggle() {
	countriesDropdown.classList.toggle("dropdown-content-show");
	window.scroll(0,searchBox.offsetTop-navbar.offsetHeight - 10);
}

function setCountryMenuProperties() {
	const countryMenuItems = document.querySelectorAll(".country-menu-item");
	countryMenuItems.forEach(item => {
		item.addEventListener("click", () => {
			searchBox.value = item.dataset.country;
			countriesDropdown.classList.remove("show");
		});
	});
}

searchIcon.addEventListener("submit", (event) => {
	event.preventDefault();
	const selecedCountry = searchBox.value;
	if(selecedCountry == "") {
		alert("Nem adott meg országot.");
	}
})

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

//working on
function selectCountryByName(selectedCountry) {
	
	state.forEach(element => {
		if(element.country == selectedCountry) {
			return element;
		}
		console.log(element);
	});

	return undefined;
}

