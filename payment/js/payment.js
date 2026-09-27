import {
    initializeApp,
    getApps
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDuUOT-gh8qva1Oc2FwBJ1Tq_2KhuYG_Do",
    authDomain: "yzddsgn.firebaseapp.com",
    projectId: "yzddsgn",
    storageBucket: "yzddsgn.firebasestorage.app",
    messagingSenderId: "102821029173",
    appId: "1:102821029173:web:068c1ddccb575143b3987c",
    measurementId: "G-D0G12P53RJ"
};

const app =
    getApps().length
        ? getApps()[0]
        : initializeApp(firebaseConfig);

const auth = getAuth(app);


// =====================================================
// PENANDA: apakah pesanan ini butuh pilih ukuran?
// (true kalau minimal 1 produk berjenis "tshirt")
// Diisi ulang setiap kali checkout dimuat.
// =====================================================

let requiresSize = false;


onAuthStateChanged(auth, (user) => {

    if (!user) {
        window.location.href = "https://yzddsgn.biz.id/login/index.html";
        return;
    }

    const checkout =
        JSON.parse(
            sessionStorage.getItem("checkout")
        ) || [];

    renderCheckout(checkout);

});

function renderCheckout(products) {

    const container =
        document.getElementById("cartItems");

    const itemCount =
        document.getElementById("itemCount");

    const subtotal =
        document.getElementById("subtotal");

    const total =
        document.getElementById("total");

    container.innerHTML = "";

    let grandTotal = 0;

    itemCount.innerText =
        products.length + " Item";

    products.forEach((item) => {

        grandTotal += item.price;

        let image = item.image;

        if (image.startsWith("assets/")) {
            image = "../" + image;
        }

        container.innerHTML += `
            <div class="summary-product">

                <div class="product-image">
                    <img src="${image}">
                </div>

                <div class="product-detail">

                    <strong>${item.name}</strong>

                    <span>${item.category}</span>

                    <small>Qty : 1</small>

                    <b>
                        Rp${Number(item.price).toLocaleString("id-ID")}
                    </b>

                </div>

            </div>
        `;
    });

    subtotal.innerText =
        "Rp" +
        grandTotal.toLocaleString("id-ID");

    total.innerText =
        "Rp" +
        grandTotal.toLocaleString("id-ID");


    // -----------------------------------------------
    // CEK APAKAH PESANAN BERISI T-SHIRT
    // Kalau tidak ada sama sekali (misal cuma mug
    // atau poster), kolom "Pilih Ukuran" disembunyikan
    // dan tidak wajib diisi.
    // -----------------------------------------------

    requiresSize =
        products.some(function (item) {
            return item.type === "tshirt";
        });

    const sizeSection =
        document.getElementById("sizeSection");

    if (sizeSection) {

        sizeSection.style.display =
            requiresSize ? "" : "none";

    }
}





/* ================================
   CUSTOM ALERT PAYMENT
================================ */

function showPaymentAlert(title, message, type = "error") {

    // Hapus modal lama kalau masih ada
    const oldModal = document.getElementById("paymentAlert");
    if (oldModal) {
        oldModal.remove();
    }

    let icon = "⚠️";

    if (type === "success") {
        icon = "✓";
    }

    if (type === "warning") {
        icon = "!";
    }

    const modal = document.createElement("div");

    modal.id = "paymentAlert";

    modal.innerHTML = `
        <div class="payment-alert-overlay">

            <div class="payment-alert-box">

                <button class="payment-alert-close" id="closePaymentAlert">
                    ×
                </button>

                <div class="payment-alert-icon ${type}">
                    ${icon}
                </div>

                <div class="payment-alert-content">

                    <h3>${title}</h3>

                    <p>${message}</p>

                </div>

                <button class="payment-alert-button" id="okPaymentAlert">
                    Mengerti
                </button>

            </div>

        </div>
    `;

    document.body.appendChild(modal);

    // Animasi masuk
    setTimeout(() => {
        modal.classList.add("show");
    }, 10);

    function closeAlert() {

        modal.classList.remove("show");

        setTimeout(() => {
            modal.remove();
        }, 250);

    }

    document
        .getElementById("closePaymentAlert")
        .addEventListener("click", closeAlert);

    document
        .getElementById("okPaymentAlert")
        .addEventListener("click", closeAlert);

    // Klik area luar modal
    modal
        .querySelector(".payment-alert-overlay")
        .addEventListener("click", function (e) {

            if (e.target === this) {
                closeAlert();
            }

        });

}





document.getElementById("payNow").addEventListener("click", function () {

    const name =
        document.getElementById("name").value.trim();

    const phone =
        document.getElementById("phone").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const address =
        document.getElementById("address").value.trim();

    const city =
        document.getElementById("city").value.trim();

    const postal =
        document.getElementById("postal").value.trim();

    const message =
        document.getElementById("message").value.trim();


    // CEK SEMUA DATA

    if (
        !name ||
        !phone ||
        !email ||
        !address ||
        !city ||
        !postal ||
        !message
    ) {

        showPaymentAlert(
            "Data Belum Lengkap",
            "Silahkan isi semua informasi penerima terlebih dahulu.",
            "warning"
        );

        return;
    }


    // AMBIL METODE PEMBAYARAN

    const payment =
        document.querySelector(
            'input[name="payment"]:checked'
        );


    if (!payment) {

        showPaymentAlert(
            "Pilih Pembayaran",
            "Silahkan pilih metode pembayaran terlebih dahulu.",
            "warning"
        );

        return;
    }


    const paymentMethod =
        payment.value;


    // AMBIL UKURAN
    // (hanya wajib kalau pesanan mengandung T-Shirt)

    let selectedSize = "";

    if (requiresSize) {

        const size =
            document.querySelector(
                'input[name="size"]:checked'
            );

        if (!size) {

            showPaymentAlert(
                "Pilih Ukuran",
                "Silahkan pilih ukuran T-Shirt terlebih dahulu.",
                "warning"
            );

            return;
        }

        selectedSize = size.value;
    }


    // AMBIL PRODUK CHECKOUT

    const products =
        JSON.parse(
            sessionStorage.getItem("checkout")
        ) || [];


    if (products.length === 0) {

        showPaymentAlert(
            "Pesanan Tidak Ditemukan",
            "Produk yang ingin kamu checkout tidak ditemukan. Silakan kembali ke keranjang.",
            "error"
        );

        return;
    }


    // HITUNG TOTAL

    let total = 0;

    let productText = "";


    products.forEach(function (product, index) {

        total += Number(product.price);

        productText +=
            (index + 1) +
            ". " +
            product.name +
            "\n";

        // Baris "Ukuran" hanya ditampilkan
        // untuk produk berjenis T-Shirt
        if (product.type === "tshirt") {

            productText +=
                "   Ukuran: " + selectedSize + "\n";

        }

        productText +=
            "   Jumlah: 1\n" +
            "   Harga: Rp" +
            Number(product.price).toLocaleString("id-ID") +
            "\n\n";

    });


    // NOMOR WA KAMU
    // GANTI DENGAN NOMOR KAMU

    const whatsappNumber =
        "6281218141079";


    // PESAN WHATSAPP

    const whatsappMessage =
        "🛍️ *PESANAN BARU - YZD DSGN*" +
        "\n\n" +

        "👤 *DATA PEMBELI*" +
        "\n" +
        "Nama: " + name +
        "\n" +
        "WhatsApp: " + phone +
        "\n" +
        "Email: " + email +
        "\n\n" +

        "📍 *ALAMAT PENGIRIMAN*" +
        "\n" +
        address +
        "\n" +
        city +
        " - " +
        postal +
        "\n\n" +

        "🛒 *PESANAN*" +
        "\n" +
        productText +

        "💰 *TOTAL PEMBAYARAN*" +
        "\n" +
        "Rp" +
        total.toLocaleString("id-ID") +
        "\n\n" +

        "💳 *METODE PEMBAYARAN*" +
        "\n" +
        paymentMethod +
        "\n\n" +

        "📝 *PESAN PEMBELI*" +
        "\n" +
        message;


    // ENCODE PESAN

    const encodedMessage =
        encodeURIComponent(
            whatsappMessage
        );


    // BUKA WHATSAPP

    const whatsappURL =
        "https://wa.me/" +
        whatsappNumber +
        "?text=" +
        encodedMessage;


    window.open(
        whatsappURL,
        "_blank"
    );

});