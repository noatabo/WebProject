
function load() {
    ids = ["#sells", "#orders", "#listings", "#profile"]
    ids.forEach(element => {
        if (element != window.Clicked) {
            $(element).removeClass('active');
        }
    });
    $(window.Clicked).addClass('active');
}
function element_clicked(id) {
    window.Clicked = id;
}


