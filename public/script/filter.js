const filterForm = document.getElementById('form');
filterForm.addEventListener('change', function (e) {
    e.preventDefault();

    const from = document.getElementById('from').value;
    const to = document.getElementById('to').value;
    const travelers = document.getElementById('traveler').value;
    const filterData = {
        from,
        to,
        travelers,
    };
    localStorage.setItem("flights", JSON.stringify(filterData));
    fetchFlights();
})



async function loadCities() {
    const res = await fetch("http://localhost:3000/flights");
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

    const sortedCities = Array.from(citySet.entries()).sort((a, b) => a[1].localeCompare(b[1]));

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
}
loadCities()