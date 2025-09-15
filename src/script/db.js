let cardBody = document.getElementById('card');

function fetchFlights() {
  const filterData = JSON.parse(localStorage.getItem("flights"));

  if (!filterData) {
    fetch(`http://localhost:3000/flights`)
      .then(res => res.json())
      .then(json => {
        clearCards();

        json.forEach(data => {
          const savedIDs = JSON.parse(localStorage.getItem('ID')) || [];
          if (savedIDs.includes(data.id)) {
            const btn = document.getElementById(`add-btn-${data.id}`);
            if (btn) {
              btn.classList.remove('bg-neutral-900');
              btn.classList.add('bg-green-600');
              btn.textContent = 'Added';
            }
          }
          cardBody.append(card(data));
        });
      });
    return;
  }

  fetch(`http://localhost:3000/flights`)
    .then(res => res.json())
    .then(json => {
      clearCards();

      const filtered = json.filter(
        f => f.route.from.code === filterData.from && f.route.to.code === filterData.to
      );
      // ✅ clear filter after applying once
      localStorage.removeItem("flights");

      filtered.forEach(data => cardBody.append(card(data)));
    });
}

function clearCards() {
  const allCards = cardBody.querySelectorAll('.fCard');
  allCards.forEach(card => card.remove());
}

function handleAddToCart(id) {
  id = String(id);
  const idArr = JSON.parse(localStorage.getItem('ID')) || [];
  const index = idArr.indexOf(id);
  const btn = document.getElementById(`add-btn-${id}`);

  if (index === -1) {
    idArr.push(id);
    localStorage.setItem('ID', JSON.stringify(idArr));
    if (btn) {
      btn.classList.remove('bg-neutral-900');
      btn.classList.add('bg-green-600');
      btn.textContent = 'Added';
    }
  }
}

function card({ id, airline, type, route, price, stops, departureTime }) {
  const formattedTime = new Date(departureTime).toLocaleString();

  let innerCard = document.createElement('div');
  innerCard.classList.add("fCard");
  innerCard.innerHTML = `
    <div class="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
      <div class="flex flex-col md:flex-row justify-between border-2 border-neutral-400 border-dashed rounded-2xl p-6 sm:p-8 md:p-10 gap-4 sm:gap-6">
        <div class="flex flex-col md:flex-row justify-between items-center md:items-start gap-3 sm:gap-4 md:gap-6 w-full">
          <div class="flex items-center gap-2 sm:gap-3">
            <div class="font-semibold text-base sm:text-lg md:text-2xl">${airline}</div>
            <div class="text-xs sm:text-sm text-neutral-600 px-2 py-0.5 bg-neutral-100 rounded-full">${type}</div>
          </div>
          <div class="flex flex-col items-center md:items-start text-center md:text-left">
            <div class="text-sm sm:text-base md:text-lg font-bold">${route.from.city}</div>
            <div class="text-xs sm:text-sm text-gray-500">${route.from.code}</div>
          </div>
          <div class="flex flex-col items-center text-center w-full md:w-auto">
            <div class="text-xs sm:text-sm text-gray-500">${stops} stop(s)</div>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 324 6" class="w-full max-w-[250px] h-auto">
              <path d="M0 3L324 3" stroke="#808080" stroke-width="2"/>
            </svg>
            <div class="text-xs sm:text-sm text-gray-500">${formattedTime}</div>
          </div>
          <div class="flex flex-col items-center md:items-end text-center md:text-right">
            <div class="text-sm sm:text-base md:text-lg font-bold">${route.to.city}</div>
            <div class="text-xs sm:text-sm text-gray-500">${route.to.code}</div>
          </div>
        </div>
      </div>
      <div class="border-2 border-dashed border-neutral-400 rounded-2xl p-6 sm:p-8 md:p-10 flex flex-col justify-center">
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div class="flex flex-col text-center sm:text-left">
            <div class="font-bold text-base sm:text-lg md:text-xl text-neutral-900">
              ${price.currency} ${price.current}
            </div>
            <div class="line-through text-gray-400 text-xs sm:text-sm">
              ${price.currency} ${price.original}
            </div>
          </div>
          <button id="add-btn-${id}" onclick="handleAddToCart('${id}')"
            class="cursor-pointer w-2/4 px-6 py-3 bg-neutral-900 text-white text-sm rounded-full transition-colors duration-500 hover:bg-green-600">
            Add To Cart
          </button>
        </div>
      </div>
    </div>
  `;
  return innerCard;
}

fetchFlights();
