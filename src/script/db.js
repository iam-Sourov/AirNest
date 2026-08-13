let cardBody = document.getElementById('card');

function fetchFlights() {
  if (!cardBody) return;
  const filterData = JSON.parse(localStorage.getItem("flights"));
  const apiUrl = typeof getApiUrl === 'function' ? getApiUrl('/flights') : '/flights';

  fetch(apiUrl)
    .then(res => {
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return res.json();
    })
    .then(json => {
      clearCards();
      let flightsToDisplay = json;

      if (filterData) {
        const { from, to } = filterData;
        flightsToDisplay = json.filter(f => {
          const matchFrom = from ? f.route.from.code === from : true;
          const matchTo = to ? f.route.to.code === to : true;
          return matchFrom && matchTo;
        });
      }

      if (flightsToDisplay.length === 0) {
        cardBody.innerHTML = `
          <div class="text-center text-gray-500 text-lg py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300 my-4">
            <p class="text-4xl mb-2">✈️</p>
            <p class="font-medium text-gray-700">No flights found matching your criteria.</p>
            <p class="text-sm text-gray-500 mt-1">Try clearing your filters or search for a different route.</p>
          </div>`;
        return;
      }

      flightsToDisplay.forEach(data => {
        cardBody.append(card(data));
      });

      if (typeof updateCartBadge === 'function') updateCartBadge();
    })
    .catch(err => {
      console.error("Error fetching flights:", err);
      if (cardBody) {
        cardBody.innerHTML = `
          <div class="text-center text-red-500 py-10 bg-red-50 rounded-2xl border border-red-200 my-4">
            <p class="font-semibold text-lg">Unable to load flights from backend</p>
            <p class="text-sm text-red-600 mt-1">Please ensure the server is running on http://localhost:3000.</p>
          </div>`;
      }
    });
}

function clearCards() {
  if (!cardBody) return;
  const allCards = cardBody.querySelectorAll('.fCard');
  allCards.forEach(card => card.remove());
  // preserve section header if present
  const emptyNotice = cardBody.querySelector('.text-center');
  if (emptyNotice) emptyNotice.remove();
}

function handleAddToCart(id) {
  id = String(id);
  let idArr = JSON.parse(localStorage.getItem('ID')) || [];
  const index = idArr.indexOf(id);
  const btn = document.getElementById(`add-btn-${id}`);

  if (index === -1) {
    idArr.push(id);
    localStorage.setItem('ID', JSON.stringify(idArr));
    if (btn) {
      btn.classList.remove('bg-neutral-900', 'hover:bg-neutral-800');
      btn.classList.add('bg-green-600', 'hover:bg-green-700');
      btn.textContent = '✓ Added';
    }
    if (typeof showToast === 'function') showToast('Ticket added to cart!');
  } else {
    idArr.splice(index, 1);
    localStorage.setItem('ID', JSON.stringify(idArr));
    if (btn) {
      btn.classList.remove('bg-green-600', 'hover:bg-green-700');
      btn.classList.add('bg-neutral-900', 'hover:bg-green-600');
      btn.textContent = 'Add To Cart';
    }
    if (typeof showToast === 'function') showToast('Ticket removed from cart', 'info');
  }

  if (typeof updateCartBadge === 'function') updateCartBadge();
}

function formatFlightDate(dateStr) {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function card({ id, airline, type, route, price, stops, departureTime }) {
  const savedIDs = JSON.parse(localStorage.getItem('ID')) || [];
  const isAdded = savedIDs.includes(String(id));
  const formattedTime = formatFlightDate(departureTime);

  let innerCard = document.createElement('div');
  innerCard.classList.add("fCard", "w-full");
  innerCard.innerHTML = `
    <div class="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 mb-4">
      <div class="flex flex-col md:flex-row justify-between border-2 border-neutral-300 border-dashed rounded-2xl p-6 sm:p-8 gap-4 sm:gap-6 bg-white hover:border-neutral-400 transition">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4 w-full">
        
          <div class="flex items-center gap-3 min-w-[160px]">
            <div class="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg">✈</div>
            <div>
              <div class="font-semibold text-lg sm:text-xl text-neutral-900">${airline}</div>
              <div class="inline-block text-xs font-medium text-neutral-600 px-2 py-0.5 bg-neutral-100 rounded-full mt-1">${type}</div>
            </div>
          </div>

          <div class="flex items-center justify-between gap-4 w-full max-w-xs px-2">
            <div class="flex flex-col items-center text-center">
              <div class="text-lg font-bold text-neutral-900">${route.from.city}</div>
              <div class="text-xs font-semibold text-gray-500 tracking-wider">${route.from.code}</div>
            </div>

            <div class="flex flex-col items-center flex-1 text-center">
              <div class="text-xs text-gray-500 mb-1 font-medium">${stops === 0 ? 'Non-stop' : stops + ' stop(s)'}</div>
              <div class="w-full relative flex items-center justify-center">
                <div class="w-full border-t-2 border-dashed border-gray-400"></div>
                <div class="absolute bg-white px-1 text-xs text-gray-400">✈</div>
              </div>
              <div class="text-xs text-gray-500 mt-1">${formattedTime}</div>
            </div>

            <div class="flex flex-col items-center text-center">
              <div class="text-lg font-bold text-neutral-900">${route.to.city}</div>
              <div class="text-xs font-semibold text-gray-500 tracking-wider">${route.to.code}</div>
            </div>
          </div>

        </div>
      </div>

      <div class="border-2 border-dashed border-neutral-300 rounded-2xl p-6 flex flex-col justify-center bg-white hover:border-neutral-400 transition">
        <div class="flex flex-row justify-between items-center gap-4">
          <div class="flex flex-col">
            <div class="font-bold text-xl sm:text-2xl text-neutral-900">
              ${price.currency || 'BDT'} ${(price.current || 0).toLocaleString()}
            </div>
            ${price.original ? `<div class="line-through text-gray-400 text-xs sm:text-sm">${price.currency || 'BDT'} ${price.original.toLocaleString()}</div>` : ''}
          </div>
          <button id="add-btn-${id}" onclick="handleAddToCart('${id}')"
            class="cursor-pointer px-6 py-3 ${isAdded ? 'bg-green-600 hover:bg-green-700' : 'bg-neutral-900 hover:bg-green-600'} text-white text-sm font-semibold rounded-full transition-colors duration-300 shadow-sm">
            ${isAdded ? '✓ Added' : 'Add To Cart'}
          </button>
        </div>
      </div>
    </div>
  `;
  return innerCard;
}

fetchFlights();
