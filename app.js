// Configuración
const RESTAURANT_PHONE = "573159057387"; // Reemplaza con el número real (código país + número)
const CURRENCY_SYMBOL = "$";

// Datos del Menú - Comida Costeña
const menuData = [
    {
        id: 1,
        title: "Arepa de Huevo",
        category: "entradas",
        price: 8000,
        img: "https://images.unsplash.com/photo-1607301405390-d831c242f59b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        desc: "Tradicional arepa de maíz amarillo rellena con huevo y carne molida."
    },
    {
        id: 2,
        title: "Carimañolas",
        category: "entradas",
        price: 12000,
        img: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        desc: "Pastelitos de yuca fritos rellenos de queso costeño o carne."
    },
    {
        id: 3,
        title: "Patacones con Queso",
        category: "entradas",
        price: 10000,
        img: "https://images.unsplash.com/photo-1625937329635-6e7a304cd251?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        desc: "Plátano verde frito aplanado cubierto con abundante queso costeño rallado."
    },
    {
        id: 4,
        title: "Mojarra Frita",
        category: "principales",
        price: 35000,
        img: "https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        desc: "Mojarra entera frita acompañada de arroz con coco, patacones y ensalada."
    },
    {
        id: 5,
        title: "Cazuela de Mariscos",
        category: "principales",
        price: 45000,
        img: "https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        desc: "Cremosa sopa de mariscos frescos con leche de coco y especias."
    },
    {
        id: 6,
        title: "Arroz con Camarones",
        category: "principales",
        price: 38000,
        img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        desc: "Arroz húmedo salteado con camarones frescos y vegetales."
    },
    {
        id: 7,
        title: "Cocadas",
        category: "postres",
        price: 5000,
        img: "https://images.unsplash.com/photo-1579372786545-d24232daf58c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        desc: "Dulce tradicional de coco rallado y panela."
    },
    {
        id: 8,
        title: "Enyucado",
        category: "postres",
        price: 8000,
        img: "https://images.unsplash.com/photo-1598511757337-fe2cafc31ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        desc: "Pastel de yuca, coco, queso y anís."
    },
    {
        id: 9,
        title: "Limonada de Coco",
        category: "bebidas",
        price: 12000,
        img: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        desc: "Bebida refrescante y cremosa de limón y leche de coco."
    },
    {
        id: 10,
        title: "Jugo de Corozo",
        category: "bebidas",
        price: 8000,
        img: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        desc: "Jugo natural de corozo, dulce y refrescante."
    }
];

// Estado del Carrito
let cart = JSON.parse(localStorage.getItem("restaurantCart")) || [];

// Elementos del DOM
const menuGrid = document.getElementById("menu-grid");
const categoryBtns = document.querySelectorAll(".category-btn");
const cartBtn = document.getElementById("cart-btn");
const cartCount = document.getElementById("cart-count");
const cartModal = document.getElementById("cart-modal");
const closeCartBtn = document.getElementById("close-cart");
const cartOverlay = document.getElementById("cart-overlay");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotalElement = document.getElementById("cart-total");
const checkoutForm = document.getElementById("checkout-form");

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
    renderMenu("all");
    updateCartUI();
});

// Renderizar Menú
function renderMenu(category) {
    const filteredItems = category === "all"
        ? menuData
        : menuData.filter(item => item.category === category);

    menuGrid.innerHTML = filteredItems.map(item => `
        <article class="menu-item">
            <img src="${item.img}" alt="${item.title}" class="item-img" loading="lazy">
            <div class="item-content">
                <div class="item-header">
                    <h3 class="item-title">${item.title}</h3>
                    <span class="item-price">${formatPrice(item.price)}</span>
                </div>
                <p class="item-desc">${item.desc}</p>
                <button class="add-btn" onclick="addToCart(${item.id})">
                    Agregar al Pedido
                </button>
            </div>
        </article>
    `).join("");
}

// Filtrar Categorías
categoryBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        categoryBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        renderMenu(btn.dataset.category);
    });
});

// Lógica del Carrito
function addToCart(id) {
    const item = menuData.find(i => i.id === id);
    const existingItem = cart.find(i => i.id === id);

    if (existingItem) {
        existingItem.qty++;
    } else {
        cart.push({ ...item, qty: 1 });
    }

    saveCart();
    updateCartUI();
    openCart(); // Opcional: abrir carrito al agregar
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartUI();
}

function updateQty(id, change) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.qty += change;
        if (item.qty <= 0) {
            removeFromCart(id);
        } else {
            saveCart();
            updateCartUI();
        }
    }
}

function saveCart() {
    localStorage.setItem("restaurantCart", JSON.stringify(cart));
}

function updateCartUI() {
    // Actualizar contador
    const totalCount = cart.reduce((acc, item) => acc + item.qty, 0);
    cartCount.textContent = totalCount;

    // Renderizar items del carrito
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Tu carrito está vacío.</p>';
        cartTotalElement.textContent = formatPrice(0);
        return;
    }

    let total = 0;
    cartItemsContainer.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.qty;
        total += itemTotal;
        return `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.title}</h4>
                    <span class="cart-item-price">${formatPrice(item.price)} x ${item.qty}</span>
                </div>
                <div class="cart-item-controls">
                    <button class="qty-btn" onclick="updateQty(${item.id}, -1)">-</button>
                    <span>${item.qty}</span>
                    <button class="qty-btn" onclick="updateQty(${item.id}, 1)">+</button>
                </div>
            </div>
        `;
    }).join("");

    cartTotalElement.textContent = formatPrice(total);
}

// Control del Modal
function openCart() {
    cartModal.classList.add("open");
    document.body.style.overflow = "hidden"; // Prevenir scroll
}

function closeCart() {
    cartModal.classList.remove("open");
    document.body.style.overflow = "";
}

cartBtn.addEventListener("click", openCart);
closeCartBtn.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

// Checkout y WhatsApp
checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (cart.length === 0) {
        alert("Agrega productos al carrito antes de enviar.");
        return;
    }

    const name = document.getElementById("customer-name").value;
    const address = document.getElementById("customer-address").value;

    const message = generateWhatsAppMessage(name, address);
    const whatsappUrl = `https://wa.me/${3159057387}?text=${encodeURIComponent(message)}`;


    window.open(whatsappUrl, "_blank");
});

function generateWhatsAppMessage(name, address) {
    let message = `*Pedido desde Web - Comida Costeña*\n`;
    message += `*Cliente:* ${name}\n`;
    message += `*Dirección/Nota:* ${address}\n`;
    message += `--------------------------------\n`;

    let total = 0;
    cart.forEach(item => {
        const subtotal = item.price * item.qty;
        total += subtotal;
        message += `${item.qty}x ${item.title} - ${formatPrice(subtotal)}\n`;
    });

    message += `--------------------------------\n`;
    message += `*Total: ${formatPrice(total)}*`;

    return message;
}

// Utilidades
function formatPrice(price) {
    return CURRENCY_SYMBOL + price.toLocaleString("es-CO");
}

// Exponer funciones al scope global para los onclick del HTML
window.addToCart = addToCart;
window.updateQty = updateQty;
