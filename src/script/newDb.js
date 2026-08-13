const modalForm = document.getElementById('m-form');

if (modalForm) {
    modalForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Saving...';
        }

        try {
            const formData = new FormData(form);
            const apiUrl = typeof getApiUrl === 'function' ? getApiUrl('/flights') : '/flights';

            const res = await fetch(apiUrl);
            if (!res.ok) throw new Error("Failed to fetch existing flights for ID generation");
            const flights = await res.json();

            const maxId = flights.reduce((max, flight) => Math.max(max, parseInt(flight.id) || 0), 0);
            const newId = (maxId + 1).toString();

            const fromCity = formData.get('from') || 'Unknown';
            const toCity = formData.get('to') || 'Unknown';

            const newTicket = {
                id: newId,
                airline: formData.get('airline') || 'AirNest Partner',
                type: formData.get('type') || 'Domestic',
                route: {
                    from: {
                        city: fromCity,
                        code: fromCity.slice(0, 3).toUpperCase()
                    },
                    to: {
                        city: toCity,
                        code: toCity.slice(0, 3).toUpperCase()
                    }
                },
                departureTime: formData.get('departureTime') ? new Date(formData.get('departureTime')).toISOString() : new Date().toISOString(),
                arrivalTime: null,
                return: formData.get('return') || "",
                stops: parseInt(formData.get('stops')) || 0,
                travelers: 1,
                price: {
                    current: parseFloat(formData.get('current')) || 5000,
                    original: parseFloat(formData.get('original')) || 6000,
                    currency: "BDT"
                }
            };

            const postRes = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newTicket)
            });

            if (!postRes.ok) throw new Error("Failed to create ticket");

            // Success feedback and UI updates
            const modal = document.getElementById('modal');
            if (modal) modal.classList.add('hidden');

            form.reset();

            if (typeof showToast === 'function') {
                showToast('✨ New flight ticket created successfully!');
            }

            if (typeof fetchFlights === 'function') {
                fetchFlights();
            }
            if (typeof loadCities === 'function') {
                loadCities();
            }

        } catch (err) {
            console.error("Error creating flight ticket:", err);
            if (typeof showToast === 'function') {
                showToast('Failed to create flight ticket', 'error');
            } else {
                alert('Error creating ticket: ' + err.message);
            }
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Add Ticket';
            }
        }
    });
}