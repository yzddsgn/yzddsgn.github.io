// =========================
// FILTER
// =========================

function filterProduct(category, el) {


    document
        .querySelectorAll(".filter button")
        .forEach(function (btn) {

            btn.classList.remove("active");

        });


    if (el) {

        el.classList.add("active");

    }


    // Hanya filter card produk
    document
        .querySelectorAll(".grid .card")
        .forEach(function (card) {


            if (category === "all") {

                card.style.display = "";

            }

            else if (
                card.classList.contains(category)
            ) {

                card.style.display = "";

            }

            else {

                card.style.display = "none";

            }

        });

}



const heroSlides = [
    {
        image: "https://yzddsgn.github.io/assets1/product/model/model 7.jpg",
        title: "MOSH PIT - HARDCORE EDITION",
        text: "Representasi Energi & Sikap Skena Hardcore"
    },
    {
        image: "https://yzddsgn.github.io/assets1/product/model/model 4.jpg",
        title: "CRAFTED FOR THE CHAOS",
        text: "Detail sablon distressed typography presisi dipadukan dengan logo Gothic YZD DSGN."
    },
    {
        image: "https://yzddsgn.github.io/assets1/product/model/model 3.jpg",
        title: "HEAVY TRACKS, HEAVY APPAREL",
        text: "Putar playlist terberatmu, pakai outfit paling solid! MOSH PIT T-Shirt dirancang buat kamu yang menikmati energi musik hardcore."
    },
    {
        image: "https://yzddsgn.github.io/assets1/product/model/model 1.jpg",
        title: "BDG - EST. 1810",
        text: "Bandung lahir pada 25 September 1810, ketika Bupati R.A. Wiranatakusumah II."
    },
    {
        image: "https://yzddsgn.github.io/assets1/product/model/model 2.jpg",
        title: "BANDUNG - CITY MAP EDITION",
        text: "Desain ini mengusung konsep minimalis urban dengan identitas kota Bandung sebagai fokus utama."
    },
    {
        image: "https://yzddsgn.github.io/assets1/product/model/model 6.jpg",
        title: "MENGANGKAT PESONA SWISS VAN JAVA",
        text: "Kota Garut selalu memiliki tempat istimewa—sebuah daerah yang dikelilingi pegunungan indah, pesona alam yang asri, serta kekayaan budaya Sunda yang begitu melekat."
    },
    {
        image: "https://yzddsgn.github.io/assets1/product/model/model 5.jpg",
        title: "GARUT - CITY MAP EDITION",
        text: "Tampak Belakang: Eksplorasi Visual, Peta Wilayah, & Narasi Kekayaan Garut."
    }
];

const heroMedia = document.getElementById("heroMedia");
const heroTitle = document.getElementById("heroTitle");
const heroText = document.getElementById("heroText");
const dots = document.querySelectorAll(".hero-dot");

let currentSlide = 0;
let slideTimer;


function showSlide(index) {

    currentSlide = index;

    const slide = heroSlides[currentSlide];

    heroMedia.style.backgroundImage =
        "url('" + slide.image + "')";

    heroTitle.textContent = slide.title;
    heroText.textContent = slide.text;

    dots.forEach((dot, i) => {

        dot.classList.toggle(
            "active",
            i === currentSlide
        );

    });
}


function nextSlide() {

    currentSlide++;

    if (currentSlide >= heroSlides.length) {
        currentSlide = 0;
    }

    showSlide(currentSlide);
}


function restartTimer() {

    clearInterval(slideTimer);

    slideTimer = setInterval(
        nextSlide,
        5000
    );
}


/* KLIK DOT */
dots.forEach((dot) => {

    dot.addEventListener("click", function () {

        const slide = Number(
            this.dataset.slide
        );

        showSlide(slide);

        restartTimer();

    });

});


/* MULAI OTOMATIS */
showSlide(0);
restartTimer();