function getApiUrl(path = '/flights') {
  const isHttp = window.location.protocol.startsWith('http');
  const base = isHttp ? window.location.origin : 'http://localhost:3000';
  const cleanPath = path.startsWith('/') ? path : '/' + path;
  return `${base}${cleanPath}`;
}

// Toast notification helper
function showToast(message, type = 'success') {
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  const bgColor = type === 'error' ? 'bg-red-600' : (type === 'info' ? 'bg-blue-600' : 'bg-green-600');
  toast.className = `${bgColor} text-white px-5 py-3 rounded-xl shadow-lg font-medium text-sm transition-all duration-300 transform translate-y-4 opacity-0 pointer-events-auto flex items-center gap-2`;
  
  const icon = type === 'error' ? '⚠️' : (type === 'info' ? 'ℹ️' : '✓');
  toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
  
  toastContainer.appendChild(toast);
  
  // Animate in
  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-4', 'opacity-0');
  });

  // Remove after 3 seconds
  setTimeout(() => {
    toast.classList.add('translate-y-4', 'opacity-0');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Update cart counter in header navigation
function updateCartBadge() {
  const badge = document.getElementById('cart-count-badge');
  if (!badge) return;
  try {
    const ids = JSON.parse(localStorage.getItem('ID')) || [];
    badge.textContent = ids.length;
    if (ids.length > 0) {
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }
  } catch (e) {
    badge.classList.add('hidden');
  }
}

document.addEventListener('DOMContentLoaded', updateCartBadge);
