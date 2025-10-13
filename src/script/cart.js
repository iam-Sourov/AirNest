const cartId = localStorage.getItem('ID') || [];

let cardBody = document.getElementById('cartID');
fetch("https://air-nest.onrender.com/flights")
    .then(res => res.json())
    .then(json => {
        json.map(data => {
            const id = data.id;
            if (cartId.includes(String(id))) {
                cardBody.append(card(data));
            }
        })
    })

function handleRemoveFromCart(id) {
    const idArr = (JSON.parse(localStorage.getItem('ID')) || []).filter(cartId => cartId !== id);
    localStorage.setItem('ID', JSON.stringify(idArr));
    const card = document.getElementById(`card-${id}`);
    if (card) card.remove();
}

// Flights section
function card({ id, airline, type, route, price, stops }) {
    let innerCard = document.createElement('div');
    innerCard.id = `card-${id}`;
    innerCard.innerHTML = `<div class="flex flex-col">
                <div class="flex flex-col border-2 border-dashed rounded-2xl p-6 space-y-6">
                    <div class="flex flex-col items-center sm:flex-row sm:justify-center sm:gap-4 gap-2">
                        <div class="font-semibold text-xl sm:text-2xl text-center sm:text-left">${airline}</div>
                        <div class="text-xs sm:text-sm text-neutral-600 px-2 py-0.5 bg-neutral-100 rounded-full">${type}
                        </div>
                    </div>
                    <div class="flex flex-col sm:flex-row justify-center items-center gap-6">
                        <div class="flex flex-col items-center sm:items-start text-center sm:text-left">
                            <div class="text-base sm:text-lg font-bold">${route.from.city}</div>
                            <div class="text-sm text-gray-500">${route.from.code}</div>
                        </div>
                        <div class="flex flex-col items-center w-full max-w-xs">
                            <div class="text-xs sm:text-sm text-gray-500">${stops} Stops</div>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 324 6" class="w-full h-auto">
                                <path d="M0 3L5..." fill="#808080" />
                            </svg>
                            <div class="text-xs sm:text-sm text-gray-500">----</div>
                        </div>
                        <div class="flex flex-col items-center sm:items-end text-center sm:text-right">
                            <div class="text-base sm:text-lg font-bold">${route.to.city}</div>
                            <div class="text-sm text-gray-500">${route.to.code}</div>
                        </div>
                    </div>
                </div>
                <div class="flex flex-col border-2 border-dashed rounded-2xl p-6 gap-5 mt-4">
                    <div class="flex justify-between text-base sm:text-lg font-bold">
                        <div class="text-neutral-900">Ticket Price</div>
                        <div class="text-neutral-900">${price.current}</div>
                    </div>
                    <div class="flex flex-col sm:flex-row gap-4">
                        <button onclick="handleRemoveFromCart(${id})"
                            class="w-full sm:flex-1 px-5 py-3 border border-dashed border-[#FF4D4D] text-sm sm:text-lg font-semibold text-red-500 rounded">
                            Cancel Ticket
                        </button>
                        <button onclick="document.getElementById('paymentModal').classList.remove('hidden')"
                            class="w-full sm:flex-1 px-5 py-3 bg-black text-white text-sm sm:text-lg font-medium rounded">
                            Confirm Ticket
                        </button>
                    </div>
                </div>
            </div>
            <div id="paymentModal"
                class="hidden fixed inset-0 flex bg-black/70 justify-center items-center z-20 transition-opacity duration-300 ease-in-out p-4">
                <div class="w-full max-w-lg">
                    <div class="border rounded-2xl bg-white p-6 shadow-xl">
                        <div class="flex justify-between items-center mb-4">
                            <h2 class="text-lg sm:text-xl font-medium text-neutral-950">Payment Information</h2>
                            <button onclick="document.getElementById('paymentModal').classList.add('hidden')"
                                class="text-gray-500 hover:text-black text-xl">✕</button>
                        </div>
                        <form id="paymentForm" class="space-y-5">
                            <div>
                                <label for="cardName" class="block text-sm font-medium text-neutral-600 mb-1">Cardholder
                                    Name</label>
                                <input id="cardName" type="text" placeholder="Enter Your Name"
                                    class="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required>
                            </div>
                            <div>
                                <label for="cardNumber" class="block text-sm font-medium text-neutral-600 mb-1">Card
                                    Number</label>
                                <input id="cardNumber" type="text" placeholder="1234 **** **** ****" maxlength="19"
                                    class="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required>
                            </div>
                            <div class="flex flex-col sm:flex-row gap-4">
                                <div class="flex-1">
                                    <label for="expiry" class="block text-sm font-medium text-neutral-600 mb-1">Expiry
                                        Date</label>
                                    <input id="expiry" type="text" placeholder="MM/YY" maxlength="5"
                                        class="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required>
                                </div>
                                <div class="flex-1">
                                    <label for="cvv" class="block text-sm font-medium text-neutral-600 mb-1">CVV</label>
                                    <input id="cvv" type="password" placeholder="123" maxlength="4"
                                        class="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required>
                                </div>
                            </div>
                            <div>
                                <label for="address" class="block text-sm font-medium text-neutral-600 mb-1">Billing
                                    Address</label>
                                <input id="address" type="text" placeholder="Enter Your Address Here"
                                    class="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required>
                            </div>
                            <div class="flex flex-col sm:flex-row justify-between items-center gap-4 pt-5 border-t">
                                <div class="text-base sm:text-lg font-medium text-neutral-700">
                                    Total: <span class="text-green-600 font-semibold">${price.current}</span>
                                </div>
                                <div class="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                                    <button type="button"
                                        onclick="document.getElementById('paymentModal').classList.add('hidden')"
                                        class="w-full sm:w-auto bg-gray-800 text-white rounded-lg px-5 py-2 hover:bg-black transition">
                                        Cancel
                                    </button>
                                    <button type="submit"
                                        class="w-full sm:w-auto bg-green-600 text-white rounded-lg px-6 py-2 hover:bg-green-700 transition">
                                        Pay Now
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>`;
    return innerCard
}
if (cartId.length === 0) {
    cartId.innerHTML = '<p class="text-center col-span-full text-gray-500">Your cart is empty.</p>';
}
