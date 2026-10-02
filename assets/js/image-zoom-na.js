// =====================================================
// IMAGE ZOOM untuk section#na-section (.na-card)
// Menggunakan ulang fungsi openImageZoom/closeImageZoom
// yang sudah didefinisikan di image-zoom.js — file ini
// WAJIB di-load SETELAH image-zoom.js.
// =====================================================

// Pastikan style overlay sudah ter-inject (aman dipanggil
// berkali-kali, karena ada pengecekan id di dalamnya)
if (typeof injectImageZoomStyle === "function") {
    injectImageZoomStyle();
}

// Tambah cursor zoom-in khusus untuk gambar di .na-card
(function injectNaCardCursorStyle() {

    if (document.getElementById("naCardZoomStyle")) {
        return;
    }

    const style = document.createElement("style");

    style.id = "naCardZoomStyle";

    style.textContent = `
        .na-card img {
            cursor: zoom-in;
        }
    `;

    document.head.appendChild(style);

})();

// -------------------------------------------------
// EVENT DELEGATION — khusus gambar di dalam .na-card
// (termasuk yang ditambahkan dinamis lewat JS nanti)
// -------------------------------------------------

document.addEventListener("click", function (event) {

    const img = event.target.closest(".na-card img");

    if (!img) {
        return;
    }

    openImageZoom(img.currentSrc || img.src, img.alt);

});