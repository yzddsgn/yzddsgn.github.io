// =====================================================
// CART.JS
// =====================================================

import {
    initializeApp,
    getApps
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";


// =====================================================
// FIREBASE CONFIG
// =====================================================

const firebaseConfig = {
    apiKey: "AIzaSyDuUOT-gh8qva1Oc2FwBJ1Tq_2KhuYG_Do",
    authDomain: "yzddsgn.firebaseapp.com",
    projectId: "yzddsgn",
    storageBucket: "yzddsgn.firebasestorage.app",
    messagingSenderId: "102821029173",
    appId: "1:102821029173:web:068c1ddccb575143b3987c",
    measurementId: "G-D0G12P53RJ"
};


// =====================================================
// AMBIL FIREBASE APP YANG SUDAH ADA
// ATAU BUAT JIKA BELUM ADA
// =====================================================

let app;

if (getApps().length > 0) {

    app = getApps()[0];

} else {

    app = initializeApp(firebaseConfig);

}

const auth = getAuth(app);


// =====================================================
// DATA CART
// =====================================================

let currentUser = null;
let cart = [];


// =====================================================
// DETEKSI JENIS PRODUK
// BERDASARKAN FOLDER PATH GAMBAR:
//
// .../product/tshirt/...  -> "tshirt"
// .../product/mug/...     -> "mug"
// .../product/poster/...  -> "poster"
//
// Dipakai nanti di halaman payment untuk
// menentukan apakah kolom "Pilih Ukuran"
// perlu ditampilkan atau tidak.
// =====================================================

function getProductType(imagePath) {

    if (!imagePath) {
        return "other";
    }

    if (imagePath.includes("/tshirt/")) {
        return "tshirt";
    }

    if (imagePath.includes("/mug/")) {
        return "mug";
    }

    if (imagePath.includes("/poster/")) {
        return "poster";
    }

    return "other";
}


// =====================================================
// KEY CART BERDASARKAN UID
// =====================================================

function getCartKey() {

    if (!currentUser) {
        return null;
    }

    return "cart_" + currentUser.uid;
}


// =====================================================
// LOAD CART USER
// =====================================================

function loadUserCart() {

    if (!currentUser) {

        cart = [];

        updateCartCount();

        return;
    }

    const key = getCartKey();

    try {

        cart =
            JSON.parse(
                localStorage.getItem(key)
            ) || [];

    } catch (error) {

        console.error(
            "Gagal membaca cart:",
            error
        );

        cart = [];
    }

    updateCartCount();

    loadCart();
}


// =====================================================
// SAVE CART
// =====================================================

function saveCart() {

    if (!currentUser) {
        return;
    }

    const key = getCartKey();

    localStorage.setItem(
        key,
        JSON.stringify(cart)
    );
}


// =====================================================
// UPDATE BADGE CART
// =====================================================

function updateCartCount() {

    const badge =
        document.getElementById("cart");

    if (badge) {

        badge.innerText =
            cart.length;

    }
}


// =====================================================
// TAMBAH PRODUK
// SESUAI HTML KAMU:
//
// onclick="addCart(this)"
// =====================================================

function addCart(button) {

    // -------------------------------------------------
    // BELUM LOGIN
    // -------------------------------------------------

    if (!currentUser) {

        var oldAlert = document.getElementById("cartAlert");

        if (oldAlert) {
            oldAlert.remove();
        }

        var loginAlertStyle = document.getElementById(
            "cartLoginAlertStyle"
        );

        if (!loginAlertStyle) {

            loginAlertStyle = document.createElement("style");

            loginAlertStyle.id = "cartLoginAlertStyle";

            loginAlertStyle.textContent = `

            #cartAlert.login-alert {

                position: fixed;

                top: 25px;
                right: 25px;

                width: 340px;

                min-height: 72px;

                display: flex;
                align-items: center;

                gap: 13px;

                padding: 15px 16px;

                background: #111;

                color: #fff;

                border: 1px solid #2b2b2b;

                border-radius: 14px;

                box-shadow:
                    0 12px 35px rgba(0, 0, 0, 0.35);

                z-index: 999999;

                box-sizing: border-box;

                opacity: 0;

                transform:
                    translateX(120%);

                transition:
                    opacity 0.3s ease,
                    transform 0.3s ease;
            }

            @media (max-width: 500px) {

                #cartAlert.login-alert {

                    top: 15px;
                    right: 15px;
                    left: 15px;

                    width: auto;
                }

            }

        `;

            document.head.appendChild(loginAlertStyle);
        }

        var alertBox = document.createElement("div");

        alertBox.id = "cartAlert";

        alertBox.className = "login-alert";

        alertBox.innerHTML = `
        <div style="
            width:38px;
            height:38px;
            min-width:38px;
            display:flex;
            align-items:center;
            justify-content:center;
            background:#e74c3c;
            color:#fff;
            border-radius:50%;
            font-size:21px;
            font-weight:bold;
        ">
            !
        </div>

        <div style="
            flex:1;
            min-width:0;
            font-family:Arial,sans-serif;
        ">
            <strong style="
                display:block;
                font-size:14px;
                margin-bottom:4px;
                color:#fff;
            ">
                Login diperlukan
            </strong>

            <span style="
                display:block;
                font-size:13px;
                font-weight:600;
                color:#fff;
            ">
                Silahkan login terlebih dahulu
            </span>

            <small style="
                display:block;
                margin-top:4px;
                color:#999;
                font-size:11px;
            ">
                Login untuk menambahkan produk ke keranjang
            </small>
        </div>

        <button
            type="button"
            style="
                width:28px;
                height:28px;
                border:0;
                background:transparent;
                color:#888;
                font-size:22px;
                cursor:pointer;
                padding:0;
            "
        >
            ×
        </button>
    `;

        document.body.appendChild(alertBox);

        setTimeout(function () {
            alertBox.style.opacity = "1";
            alertBox.style.transform = "translateX(0)";
        }, 10);

        alertBox.querySelector("button").onclick = function () {

            alertBox.style.opacity = "0";
            alertBox.style.transform = "translateX(120%)";

            setTimeout(function () {
                if (alertBox.parentNode) {
                    alertBox.parentNode.removeChild(alertBox);
                }
            }, 300);

        };

        setTimeout(function () {

            if (!alertBox.parentNode) {
                return;
            }

            alertBox.style.opacity = "0";
            alertBox.style.transform = "translateX(120%)";

            setTimeout(function () {
                if (alertBox.parentNode) {
                    alertBox.parentNode.removeChild(alertBox);
                }
            }, 300);

        }, 3000);

        return;
    }


    // -------------------------------------------------
    // CARI CARD
    // -------------------------------------------------

    const card =
        button.closest(".card");

    if (!card) {

        console.error(
            "Card produk tidak ditemukan."
        );

        return;
    }


    // -------------------------------------------------
    // AMBIL GAMBAR
    // -------------------------------------------------

    const imageElement =
        card.querySelector("img");

    const image =
        imageElement
            ? imageElement.getAttribute("src")
            : "";


    // -------------------------------------------------
    // AMBIL CATEGORY
    // -------------------------------------------------

    const tagElement =
        card.querySelector(".tag");

    const category =
        tagElement
            ? tagElement.innerText.trim()
            : "";


    // -------------------------------------------------
    // AMBIL NAMA
    // -------------------------------------------------

    const nameElement =
        card.querySelector("h3");

    const name =
        nameElement
            ? nameElement.innerText.trim()
            : "Produk";


    // -------------------------------------------------
    // AMBIL HARGA
    // -------------------------------------------------

    const priceElement =
        card.querySelector(".price");

    const priceText =
        priceElement
            ? priceElement.innerText.trim()
            : "0";

    const price =
        Number(
            priceText.replace(/\D/g, "")
        );


    // -------------------------------------------------
    // AMBIL CLASS PRODUK
    // CONTOH:
    //
    // card graphic
    // card hardcore
    // card deathcore
    // -------------------------------------------------

    let productClass = "";

    for (
        const className of card.classList
    ) {

        if (
            className !== "card"
        ) {

            productClass =
                className;

            break;
        }

    }


    // -------------------------------------------------
    // DETEKSI JENIS PRODUK (tshirt/mug/poster)
    // BERDASARKAN PATH GAMBAR
    // -------------------------------------------------

    const type =
        getProductType(image);


    // -------------------------------------------------
    // BUAT DATA PRODUK
    // -------------------------------------------------

    const product = {

        name: name,

        price: price,

        image: image,

        category: category,

        productClass: productClass,

        type: type

    };


    // -------------------------------------------------
    // MASUKKAN
    // -------------------------------------------------

    cart.push(product);


    // -------------------------------------------------
    // SIMPAN
    // -------------------------------------------------

    saveCart();


    // -------------------------------------------------
    // UPDATE BADGE
    // -------------------------------------------------

    updateCartCount();


    // -------------------------------------------------
    // NOTIFIKASI UI
    // -------------------------------------------------

    var oldAlert = document.getElementById("cartAlert");

    if (oldAlert) {
        oldAlert.remove();
    }

    var cartAlert = document.createElement("div");

    cartAlert.id = "cartAlert";

    cartAlert.innerHTML = `
    <div class="cart-alert-check">
        ✓
    </div>

    <div class="cart-alert-text">
        <strong>Berhasil ditambahkan</strong>
        <span>${name}</span>
        <small>Produk masuk ke keranjang kamu</small>
    </div>

    <button
        type="button"
        class="cart-alert-close"
        aria-label="Tutup"
    >
        ×
    </button>
`;

    document.body.appendChild(cartAlert);


    // -------------------------------------------------
    // STYLE ALERT
    // -------------------------------------------------

    var alertStyle = document.getElementById(
        "cartAlertStyle"
    );

    if (!alertStyle) {

        alertStyle = document.createElement("style");

        alertStyle.id = "cartAlertStyle";

        alertStyle.textContent = `

        #cartAlert {

            position: fixed;

            top: 25px;
            right: 25px;

            width: 340px;

            display: flex;
            align-items: center;

            gap: 13px;

            padding: 15px 16px;

            background: #111;

            color: #fff;

            border: 1px solid #2b2b2b;

            border-radius: 14px;

            box-shadow:
                0 12px 35px rgba(0, 0, 0, 0.35);

            z-index: 999999;

            opacity: 0;

            transform:
                translateX(120%);

            transition:
                opacity 0.3s ease,
                transform 0.3s ease;

            font-family:
                Arial,
                sans-serif;

            box-sizing: border-box;
        }


        #cartAlert.show {

            opacity: 1;

            transform:
                translateX(0);
        }


        .cart-alert-check {

            width: 38px;
            height: 38px;

            min-width: 38px;

            display: flex;

            align-items: center;
            justify-content: center;

            background: #20c76a;

            color: #fff;

            border-radius: 50%;

            font-size: 22px;

            font-weight: bold;
        }


        .cart-alert-text {

            flex: 1;

            min-width: 0;
        }


        .cart-alert-text strong {

            display: block;

            font-size: 14px;

            font-weight: 700;

            margin-bottom: 4px;
        }


        .cart-alert-text span {

            display: block;

            font-size: 13px;

            font-weight: 600;

            white-space: nowrap;

            overflow: hidden;

            text-overflow: ellipsis;
        }


        .cart-alert-text small {

            display: block;

            margin-top: 3px;

            color: #999;

            font-size: 11px;
        }


        .cart-alert-close {

            width: 28px;
            height: 28px;

            border: none;

            background: transparent;

            color: #888;

            font-size: 22px;

            line-height: 1;

            cursor: pointer;

            padding: 0;
        }


        .cart-alert-close:hover {

            color: #fff;
        }


        @media (max-width: 500px) {

            #cartAlert {

                top: 15px;
                right: 15px;
                left: 15px;

                width: auto;
            }

        }

    `;

        document.head.appendChild(alertStyle);
    }


    // -------------------------------------------------
    // ANIMASI MASUK
    // -------------------------------------------------

    setTimeout(function () {

        cartAlert.classList.add("show");

    }, 10);


    // -------------------------------------------------
    // TOMBOL CLOSE
    // -------------------------------------------------

    var closeButton =
        cartAlert.querySelector(
            ".cart-alert-close"
        );

    closeButton.onclick = function () {

        cartAlert.classList.remove("show");

        setTimeout(function () {

            if (cartAlert.parentNode) {

                cartAlert.parentNode.removeChild(
                    cartAlert
                );

            }

        }, 300);

    };


    // -------------------------------------------------
    // HILANG OTOMATIS
    // -------------------------------------------------

    setTimeout(function () {

        cartAlert.classList.remove("show");

        setTimeout(function () {

            if (cartAlert.parentNode) {

                cartAlert.parentNode.removeChild(
                    cartAlert
                );

            }

        }, 300);

    }, 3000);

}


// =====================================================
// TAMPILKAN CART
// =====================================================

function loadCart() {

    const container =
        document.getElementById(
            "cartItems"
        );

    // Kalau bukan halaman cart,
    // tidak perlu render.
    if (!container) {

        updateCartCount();

        return;
    }


    container.innerHTML = "";


    // -------------------------------------------------
    // KOSONG
    // -------------------------------------------------

    if (cart.length === 0) {

        container.innerHTML = `

            <div style="
                grid-column: 1 / -1;
                text-align: center;
                padding: 60px 20px;
            ">

                <h2>
                    Keranjang masih kosong
                </h2>

                <p style="margin-top:10px;">
                    Silahkan pilih produk terlebih dahulu.
                </p>

            </div>

        `;

        updateCartCount();

        return;
    }


    // -------------------------------------------------
    // RENDER PRODUK
    // -------------------------------------------------

    cart.forEach(
        function (product, index) {

            let imagePath =
                product.image || "";


            // Karena halaman cart berada
            // di folder /cart/
            if (
                imagePath.startsWith(
                    "assets/"
                )
            ) {

                imagePath =
                    "../" + imagePath;

            }


            container.innerHTML += `

                <div class="card ${product.productClass || ""}">

                    <img
                        src="${imagePath}"
                        alt="${product.name}"
                    >

                    <div class="info">

                        <div class="tag">
                            ${product.category || ""}
                        </div>

                        <h3>
                            ${product.name}
                        </h3>

                        <div class="price">
                            Rp${Number(
                product.price
            ).toLocaleString("id-ID")}
                        </div>

                        <button
                            class="buy"
                            onclick="buyNow(${index})"
                        >
                            Beli Sekarang
                        </button>

                        <button
                            class="delete"
                            onclick="removeCart(${index})"
                        >
                            Hapus
                        </button>

                    </div>

                </div>

            `;

        }
    );


    updateCartCount();

}


// =====================================================
// HAPUS CART
// =====================================================

function removeCart(index) {

    if (!currentUser) {
        return;
    }

    if (
        index < 0 ||
        index >= cart.length
    ) {

        return;
    }


    cart.splice(
        index,
        1
    );


    saveCart();

    loadCart();

    updateCartCount();

}


// =====================================================
// BELI SEKARANG
// =====================================================

function buyNow(index) {

    const product = cart[index];

    if (!product) {
        return;
    }

    // Simpan produk yang dipilih
    sessionStorage.setItem(
        "checkout",
        JSON.stringify([product])
    );

    // Pindah ke halaman payment
    window.location.href = "https://yzddsgn.biz.id/payment/";

}


// =====================================================
// CEK LOGIN FIREBASE
// =====================================================

onAuthStateChanged(
    auth,
    function (user) {

        currentUser = user;


        if (user) {

            console.log(
                "CART USER:",
                user.uid
            );

            loadUserCart();

        } else {

            console.log(
                "BELUM LOGIN"
            );

            cart = [];

            updateCartCount();

            loadCart();

        }

    }
);


// =====================================================
// PENTING
// HTML KAMU PAKAI:
//
// onclick="addCart(this)"
//
// Karena cart.js adalah module,
// fungsi harus dimasukkan ke window.
// =====================================================

window.addCart =
    addCart;

window.removeCart =
    removeCart;

window.buyNow =
    buyNow;