let cardBody = document.getElementById('cartID');
let selectedTicketId = null;

function getCartIds() {
    try {
        const raw = localStorage.getItem('ID');
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        return [];
    }
}

function loadCartFlights() {
    if (!cardBody) return;
    const cartIds = getCartIds();
    const apiUrl = typeof getApiUrl === 'function' ? getApiUrl('/flights') : '/flights';

    if (cartIds.length === 0) {
        renderEmptyCart();
        return;
    }

    fetch(apiUrl)
        .then(res => {
            if (!res.ok) throw new Error(`HTTP error ${res.status}`);
            return res.json();
        })
        .then(json => {
            cardBody.innerHTML = '';
            let matchedFlights = json.filter(data => cartIds.includes(String(data.id)));

            if (matchedFlights.length === 0) {
                renderEmptyCart();
                return;
            }

            let totalPrice = 0;
            matchedFlights.forEach(data => {
                totalPrice += data.price ? (data.price.current || 0) : 0;
                cardBody.append(card(data));
            });

            renderCartSummary(matchedFlights.length, totalPrice);
        })
        .catch(err => {
            console.error("Error fetching cart flights:", err);
            cardBody.innerHTML = `
                <div class="col-span-full text-center text-red-500 py-10 bg-red-50 rounded-2xl border border-red-200">
                    <p class="font-semibold text-lg">Unable to load cart flights from backend</p>
                    <p class="text-sm text-red-600 mt-1">Please make sure the backend server is running on http://localhost:3000.</p>
                </div>`;
        });
}

function renderEmptyCart() {
    if (!cardBody) return;
    const summaryEl = document.getElementById('cart-summary-container');
    if (summaryEl) summaryEl.remove();

    cardBody.innerHTML = `
        <div class="col-span-full text-center py-16 px-4 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-300">
            <div class="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">🛒</div>
            <h2 class="text-2xl font-bold text-gray-800 mb-2">Your Cart is Empty</h2>
            <p class="text-gray-500 max-w-md mx-auto mb-6">Looks like you haven't added any flight tickets to your cart yet. Explore available flights and start your journey!</p>
            <a href="index.html" class="inline-flex items-center gap-2 bg-green-600 text-white font-semibold px-6 py-3 rounded-full hover:bg-green-700 transition shadow-md">
                <span>✈️ Search Flights</span>
            </a>
        </div>`;
    if (typeof updateCartBadge === 'function') updateCartBadge();
}

function renderCartSummary(itemCount, totalPrice) {
    let summaryEl = document.getElementById('cart-summary-container');
    if (!summaryEl) {
        summaryEl = document.createElement('div');
        summaryEl.id = 'cart-summary-container';
        summaryEl.className = 'col-span-full mb-6 p-6 bg-gradient-to-r from-neutral-900 to-neutral-800 text-white rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4 shadow-lg';
        cardBody.parentNode.insertBefore(summaryEl, cardBody);
    }
    summaryEl.innerHTML = `
        <div>
            <h3 class="text-xl font-bold">Cart Summary</h3>
            <p class="text-gray-300 text-sm">${itemCount} ticket${itemCount > 1 ? 's' : ''} ready for booking</p>
        </div>
        <div class="flex items-center gap-6">
            <div class="text-right">
                <span class="text-xs text-gray-400 block uppercase tracking-wider">Total Price</span>
                <span class="text-2xl font-extrabold text-green-400">BDT ${totalPrice.toLocaleString()}</span>
            </div>
            <button onclick="openPaymentModal(null, ${totalPrice})"
                class="bg-green-600 hover:bg-green-500 text-white font-bold px-6 py-3 rounded-xl transition shadow-md">
                Checkout All
            </button>
        </div>`;
}

function handleRemoveFromCart(id) {
    id = String(id);
    const cartIds = getCartIds().filter(cartId => String(cartId) !== id);
    localStorage.setItem('ID', JSON.stringify(cartIds));
    const cardEl = document.getElementById(`card-${id}`);
    if (cardEl) cardEl.remove();

    if (typeof showToast === 'function') showToast('Ticket removed from cart', 'info');
    if (typeof updateCartBadge === 'function') updateCartBadge();

    if (cartIds.length === 0) {
        renderEmptyCart();
    } else {
        loadCartFlights();
    }
}

function openPaymentModal(ticketId = null, amount = 0) {
    selectedTicketId = ticketId;
    const modal = document.getElementById('paymentModal');
    const amountEl = document.getElementById('modal-total-amount');
    if (amountEl) {
        amountEl.textContent = `BDT ${amount.toLocaleString()}`;
    }
    if (modal) {
        modal.classList.remove('hidden');
    }
}

function closePaymentModal() {
    const modal = document.getElementById('paymentModal');
    if (modal) modal.classList.add('hidden');
}

function card({ id, airline, type, route, price, stops }) {
    let innerCard = document.createElement('div');
    innerCard.id = `card-${id}`;
    innerCard.className = "w-full";
    innerCard.innerHTML = `
        <div class="flex flex-col bg-white border-2 border-dashed border-neutral-300 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition">
            <div class="p-6 space-y-4">
                <div class="flex justify-between items-center">
                    <span class="font-bold text-xl text-neutral-900">${airline}</span>
                    <span class="text-xs font-semibold px-2.5 py-1 bg-neutral-100 text-neutral-700 rounded-full">${type}</span>
                </div>
                <div class="flex justify-between items-center py-2 border-y border-neutral-100">
                    <div class="text-left">
                        <div class="text-lg font-extrabold text-neutral-900">${route.from.city}</div>
                        <div class="text-xs font-semibold text-gray-500">${route.from.code}</div>
                    </div>
                    <div class="flex flex-col items-center px-4">
                        <div class="text-xs text-gray-500 font-medium">${stops} stop(s)</div>
                        <div class="w-16 border-t-2 border-dashed border-gray-400 my-1"></div>
                        <div class="text-xs text-gray-400">✈</div>
                    </div>
                    <div class="text-right">
                        <div class="text-lg font-extrabold text-neutral-900">${route.to.city}</div>
                        <div class="text-xs font-semibold text-gray-500">${route.to.code}</div>
                    </div>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-gray-500 font-medium text-sm">Price</span>
                    <span class="text-xl font-bold text-green-600">${price.currency || 'BDT'} ${(price.current || 0).toLocaleString()}</span>
                </div>
            </div>
            <div class="p-4 bg-gray-50 border-t border-dashed border-neutral-300 flex gap-3">
                <button onclick="handleRemoveFromCart('${id}')"
                    class="flex-1 px-4 py-2.5 border border-red-500 text-red-600 hover:bg-red-50 text-sm font-semibold rounded-xl transition">
                    Remove
                </button>
                <button onclick="openPaymentModal('${id}', ${price.current || 0})"
                    class="flex-1 px-4 py-2.5 bg-neutral-900 hover:bg-green-600 text-white text-sm font-semibold rounded-xl transition">
                    Confirm Ticket
                </button>
            </div>
        </div>`;
    return innerCard;
}

// Payment Form Submit Handler
document.addEventListener('DOMContentLoaded', () => {
    loadCartFlights();

    const paymentForm = document.getElementById('paymentForm');
    if (paymentForm) {
        paymentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (selectedTicketId) {
                // Remove individual ticket
                handleRemoveFromCart(selectedTicketId);
            } else {
                // Clear entire cart
                localStorage.setItem('ID', '[]');
                renderEmptyCart();
            }

            closePaymentModal();
            paymentForm.reset();

            if (typeof showToast === 'function') {
                showToast('🎉 Payment Successful! Your flight tickets have been confirmed.');
            } else {
                alert('Payment Successful! Your flight tickets have been confirmed.');
            }
        });
    }
});
