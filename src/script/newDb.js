document.getElementById('m-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    const res = await fetch('http://localhost:3000/flights');
    const flights = await res.json();

    const maxId = flights.reduce((max, flight) => Math.max(max, parseInt(flight.id)), 0);
    const newId = (maxId + 1).toString();

    const newTicket = {
        id: newId,
        airline: formData.get('airline'),
        type: formData.get('type'),
        route: {
            from: {
                city: formData.get('from'),
                code: formData.get('from').slice(0, 3).toUpperCase()
            },
            to: {
                city: formData.get('to'),
                code: formData.get('to').slice(0, 3).toUpperCase()
            }
        },
        departureTime: formData.get('departureTime'),
        arrivalTime: "",
        return: formData.get('return'),
        stops: parseInt(formData.get('stops')),
        price: {
            current: parseFloat(formData.get('current')),
            original: parseFloat(formData.get('original')),
            currency: "BDT"
        }
    };

    fetch('http://localhost:3000/flights', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(newTicket)
    });
});