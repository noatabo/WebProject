
let buy = $("#buy")[0]
let sell = $("#sell")[0]
console.log(buy)
buy.addEventListener("click", () => {
    window.location.href = "/listings";
    console.log("redirect")
})
sell.addEventListener("click", () => {
    window.location.href = "/listings/new";
})
function rec_hover(rec, text) {
    rec.style.webkitTransform = 'rotate(180deg) scale(1.1)';
    rec.style.msTransform = 'rotate(180deg) scale(1.1)';
    rec.style.transform = 'rotate(180deg) scale(1.1)';
    up_text(text);
}
function rec_unhover(rec, text) {
    rec.style.webkitTransform = 'rotate(0deg) scale(1)';
    rec.style.msTransform = 'rotate(0deg) scale(1)';
    rec.style.transform = 'rotate(0deg) scale(1)';
    down_text(text);
}
function up_text(text) {
    console.log(text);
    var text = $(text);
    text.addClass('up');
}
function down_text(text) {
    var text = $(text);
    text.removeClass('up');
}
