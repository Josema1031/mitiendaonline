/* abrir y cerrar carrito */
const cartIcon = document.querySelector("#cart-icon");
const cart = document.querySelector(".cart");
const closeCart = document.querySelector("#close-cart");

cartIcon.addEventListener('click', () => {
    cart.classList.add('active');
});

closeCart.addEventListener('click', () => {
    cart.classList.remove('active');
});

// definir número de pedido
let orderNumber = 1;

// comenzar cuando el documento esté listo
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
} else {
    start();
}

// comenzar
function start() {
    addEvents();
}

// actualizar y volver a presentar
function update() {
    addEvents();
    updateTotal();
}

// eventos
function addEvents() {
    // quitar artículos del carrito
    let cartRemoveBtns = document.querySelectorAll(".cart-remove");

    cartRemoveBtns.forEach((btn) => {
        btn.addEventListener("click", handle_removeCartItem);
    });

    // cambiar cantidad de artículo
    let cartQuantityInputs = document.querySelectorAll(".cart-quantity");

    cartQuantityInputs.forEach((input) => {
        input.addEventListener("change", handle_changeItemQuantity);
    });

    // añadir artículos al carrito
    let addCartBtns = document.querySelectorAll(".add-cart");
    addCartBtns.forEach((btn) => {
        btn.addEventListener("click", handle_addCartItem);
    });
}

// comprar orden
const buyBtn = document.querySelector(".btn-buy");
buyBtn.addEventListener("click", handle_buyOrden);

// funciones de manejo de eventos
let itemsAdded = [];

function handle_addCartItem() {
    let product = this.parentElement;
    let title = product.querySelector(".product-title").innerHTML;
    let price = product.querySelector(".product-price").innerHTML;
    let imgSrc = product.querySelector(".product-img").src;

    let newToAdd = { title, price, imgSrc, quantity: 1 };

    // el elemento ya existe
    if (itemsAdded.find((el) => el.title === newToAdd.title)) {
        alert("Este artículo ya existe");
        return;
    } else {
        itemsAdded.push(newToAdd);
    }

    // añadir producto al carrito
    let cartBoxElement = cartBoxComponent(title, price, imgSrc);
    let newNode = document.createElement("div");
    newNode.innerHTML = cartBoxElement;
    const cartContent = cart.querySelector(".cart-content");
    cartContent.appendChild(newNode);

    update();
}

function handle_removeCartItem() {
    this.parentElement.remove();

    itemsAdded = itemsAdded.filter(
        (el) => el.title !== this.parentElement.querySelector(".cart-product-title").innerHTML
    );

    update();
}

function handle_changeItemQuantity() {
    if (isNaN(this.value) || this.value < 1) {
        this.value = 1;
    }
    this.value = Math.floor(this.value); // para mantener el número entero

    let title = this.parentElement.parentElement.querySelector(".cart-product-title").innerHTML;
    itemsAdded.forEach((item) => {
        if (item.title === title) {
            item.quantity = parseInt(this.value);
        }
    });

    update();
}

function handle_buyOrden() {
    if (itemsAdded.length === 0) {
        alert("¡Aún no hay ningún pedido para realizar! Por favor haga un pedido primero");
        return;
    }

    let message = `Hola, quiero realizar el siguiente pedido (Pedido No. ${orderNumber}):\n\n`;
    let total = 0;

    itemsAdded.forEach((item, index) => {
        message += `${index + 1}. ${item.title} - ${item.price} x ${item.quantity}\n`;
        let itemTotal = parseFloat(item.price.replace("$", "")) * item.quantity;
        total += itemTotal;
    });

    message += `\nTotal a pagar: $${total.toFixed(2)}`;

    // Añade tu número de teléfono de WhatsApp aquí
    const phoneNumber = "2644429649";
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    window.open(whatsappURL, "_blank");

    const cartContent = cart.querySelector(".cart-content");
    cartContent.innerHTML = "";
    alert(`Su pedido No. ${orderNumber} se realizó con éxito :)`);
    itemsAdded = [];
    orderNumber++; // incrementar el número de pedido para el siguiente
    update();
}

// funciones de actualizar y renderizar
function updateTotal() {
    let cartBoxes = document.querySelectorAll(".cart-box");
    const totalElement = cart.querySelector(".total-price");
    let total = 0;

    cartBoxes.forEach((cartBox) => {
        let priceElement = cartBox.querySelector(".cart-price");
        let price = parseFloat(priceElement.innerHTML.replace("$", ""));
        let quantity = cartBox.querySelector(".cart-quantity").value;

        total += price * quantity;
    });

    total = total.toFixed(2);

    // mantener 2 dígitos después del punto decimal
    totalElement.innerHTML = "$" + total;
}

// componente de caja del carrito (ejemplo de cómo podría ser)
function cartBoxComponent(title, price, imgSrc) {
    return `
        <div class="cart-box">
            <img src="${imgSrc}" class="cart-img">
            <div class="detail-box">
                <div class="cart-product-title">${title}</div>
                <div class="cart-price">${price}</div>
                <input type="number" value="1" class="cart-quantity">
            </div>
            <i class="bx bxs-trash cart-remove"></i>
        </div>
    `;
}
