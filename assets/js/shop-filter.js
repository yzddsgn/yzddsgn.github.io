// =====================================================
// SHOP FILTER + "LIHAT LAINNYA" (pagination)
// =====================================================
//
// CARA PAKAI:
// Taruh <script> file ini TEPAT SETELAH script.js kamu
// yang lama, contoh:
//
// <script src="https://yzddsgn.biz.id/assets/js/script.js"></script>
// <script src="https://yzddsgn.biz.id/assets/js/shop-filter.js"></script>
//
// File ini menimpa fungsi global filterProduct() yang lama
// (karena dimuat belakangan), jadi kategori filter kamu yang
// sudah ada ("Semua", "T-Shirt", "Poster", "Mug", dst) tetap
// jalan seperti biasa, TAPI sekarang otomatis digabung dengan
// pagination "Lihat Lainnya".
//
// Tidak perlu ubah angka apa pun kalau nambah produk baru —
// card baru otomatis kebaca karena selalu query ulang isi
// .shop-content .grid setiap kali render, tidak hardcode.
// =====================================================

(function () {
    "use strict";

    // Jumlah card yang tampil di halaman pertama / setiap klik
    // "Lihat Lainnya".
    var PAGE_SIZE = 21;

    var currentFilter = "all";
    var visibleCount = PAGE_SIZE;


    // -------------------------------------------------
    // HELPER
    // -------------------------------------------------

    function getGrid() {
        return document.querySelector(".shop-content .grid");
    }

    function getAllCards() {
        var grid = getGrid();

        if (!grid) {
            return [];
        }

        return Array.prototype.slice
            .call(grid.children)
            .filter(function (el) {
                return el.classList.contains("card");
            });
    }

    function matchesFilter(card, filter) {

        if (filter === "all") {
            return true;
        }

        return card.classList.contains(filter);
    }

    function revealCard(card) {

        card.classList.remove("card-hidden");
        card.classList.add("card-reveal");

        // paksa reflow supaya transisi CSS-nya benar-benar jalan
        void card.offsetWidth;

        requestAnimationFrame(function () {
            card.classList.remove("card-reveal");
        });
    }

    function hideCard(card) {

        card.classList.remove("card-reveal");
        card.classList.add("card-hidden");
    }

    function updateShowMoreButton(remaining) {

        var wrap = document.getElementById("showMoreWrap");
        var btn = document.getElementById("showMoreBtn");

        if (!wrap || !btn) {
            return;
        }

        if (remaining > 0) {

            wrap.style.display = "flex";

            btn.textContent =
                "Lihat Lainnya (" + remaining + ")";

        } else {

            wrap.style.display = "none";
        }
    }


    // -------------------------------------------------
    // RENDER UTAMA
    // Dipanggil setiap kali: load awal, ganti filter,
    // atau klik "Lihat Lainnya".
    // -------------------------------------------------

    function render(options) {

        options = options || {};

        var animateNew = !!options.animateNew;

        var allCards = getAllCards();

        var filtered = allCards.filter(function (card) {
            return matchesFilter(card, currentFilter);
        });


        // Card yang TIDAK cocok kategori: sembunyikan total,
        // tanpa animasi (memang bukan bagian dari tampilan ini).
        allCards.forEach(function (card) {

            if (!matchesFilter(card, currentFilter)) {

                card.classList.remove("card-reveal");
                card.classList.add("card-hidden");
            }
        });


        // Card yang cocok kategori: tampilkan sesuai visibleCount.
        filtered.forEach(function (card, index) {

            var shouldShow = index < visibleCount;

            if (shouldShow) {

                var wasHidden =
                    card.classList.contains("card-hidden");

                if (wasHidden && animateNew) {

                    revealCard(card);

                } else {

                    card.classList.remove("card-hidden");
                    card.classList.remove("card-reveal");
                }

            } else {

                hideCard(card);
            }
        });


        var remaining = filtered.length - visibleCount;

        updateShowMoreButton(
            remaining > 0 ? remaining : 0
        );
    }


    // -------------------------------------------------
    // FILTER KATEGORI
    // (dipanggil dari onclick="filterProduct('tshirt', this)"
    // yang sudah ada di HTML kamu — tidak perlu diubah)
    // -------------------------------------------------

    window.filterProduct = function (category, btnEl) {

        currentFilter = category;

        // Setiap ganti kategori, pagination reset ke halaman
        // pertama lagi.
        visibleCount = PAGE_SIZE;

        var buttons =
            document.querySelectorAll(".filter button");

        buttons.forEach(function (btn) {
            btn.classList.remove("active");
        });

        if (btnEl) {
            btnEl.classList.add("active");
        }

        render({ animateNew: false });
    };


    // -------------------------------------------------
    // TOMBOL "LIHAT LAINNYA"
    // -------------------------------------------------

    function handleShowMore() {

        visibleCount += PAGE_SIZE;

        render({ animateNew: true });
    }


    // -------------------------------------------------
    // INIT
    // -------------------------------------------------

    document.addEventListener(
        "DOMContentLoaded",
        function () {

            render({ animateNew: false });

            var btn =
                document.getElementById("showMoreBtn");

            if (btn) {
                btn.addEventListener(
                    "click",
                    handleShowMore
                );
            }
        }
    );

})();