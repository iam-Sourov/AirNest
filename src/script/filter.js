const filterForm = document.getElementById('form');
const clearBtn = document.getElementById('clear-btn');

if (filterForm) {
    filterForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const from = document.getElementById('from').value;
        const to = document.getElementById('to').value;
        const filterData = { from, to };
        localStorage.setItem("flights", JSON.stringify(filterData));
        
        if (typeof fetchFlights === 'function') {
            fetchFlights();
        }
        if (typeof showToast === 'function') {
            showToast('Filter applied', 'info');
        }
    });
}

if (clearBtn) {
    clearBtn.addEventListener('click', function () {
        if (filterForm) filterForm.reset();
        localStorage.removeItem("flights");

        if (typeof fetchFlights === 'function') {
            fetchFlights();
        }
        if (typeof showToast === 'function') {
            showToast('Filters cleared', 'info');
        }
    });
}

async function loadCities() {
    const cityFrom = document.getElementById("from");
    const cityTo = document.getElementById("to");
    if (!cityFrom || !cityTo) return;

    try {
        const apiUrl = typeof getApiUrl === 'function' ? getApiUrl('/flights') : '/flights';
        const res = await fetch(apiUrl);
        if (!res.ok) return;
        const flights = await res.json();

        const citySet = new Map();
        flights.forEach(flight => {
            if (flight.route && flight.route.from && flight.route.to) {
                citySet.set(flight.route.from.code, flight.route.from.city);
                citySet.set(flight.route.to.code, flight.route.to.city);
            }
        });

        // Reset dropdown options keeping default
        cityFrom.innerHTML = '<option value="">Select departure</option>';
        cityTo.innerHTML = '<option value="">Select destination</option>';

        const sortedCities = Array.from(citySet.entries()).sort((a, b) =>
            a[1].localeCompare(b[1])
        );

        sortedCities.forEach(([code, city]) => {
            const fromOption = document.createElement("option");
            const toOption = document.createElement("option");
            fromOption.value = code;
            fromOption.textContent = `${city} (${code})`;
            toOption.value = code;
            toOption.textContent = `${city} (${code})`;
            cityFrom.appendChild(fromOption);
            cityTo.appendChild(toOption);
        });

        // Restore active filter selection if present
        const savedFilter = JSON.parse(localStorage.getItem("flights"));
        if (savedFilter) {
            if (savedFilter.from) cityFrom.value = savedFilter.from;
            if (savedFilter.to) cityTo.value = savedFilter.to;
        }
    } catch (error) {
        console.error("Error loading cities:", error);
    }
}

document.addEventListener('DOMContentLoaded', loadCities);
