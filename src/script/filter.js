const filterForm = document.getElementById('form');
const clearBtn = document.getElementById('clear-btn');

filterForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const from = document.getElementById('from').value;
    const to = document.getElementById('to').value;
    const filterData = { from, to };
    localStorage.setItem("flights", JSON.stringify(filterData));
    console.log("Filter applied:", filterData);
    fetchFlights();
});

clearBtn.addEventListener('click', function () {
    filterForm.reset();
    localStorage.removeItem("flights");

    fetchFlights();

    console.log("Filters cleared, showing all flights.");
});

async function loadCities() {
    try {
        const res = await fetch("https://air-nest.onrender.com/flights");
        const flights = await res.json();

        const citySet = new Map();

        flights.forEach(flight => {
            const from = flight.route.from;
            const to = flight.route.to;
            citySet.set(from.code, from.city);
            citySet.set(to.code, to.city);
        });

        const cityFrom = document.getElementById("from");
        const cityTo = document.getElementById("to");

        const sortedCities = Array.from(citySet.entries()).sort((a, b) =>
            a[1].localeCompare(b[1])
        );

        sortedCities.forEach(([code, city]) => {
            const from = document.createElement("option");
            const to = document.createElement("option");
            from.value = code;
            from.textContent = city;
            to.value = code;
            to.textContent = city;
            cityFrom.appendChild(from);
            cityTo.appendChild(to);
        });

        console.log("Cities loaded:", sortedCities.length);
    } catch (error) {
        console.error("Error loading cities:", error);
    }
}
loadCities();
