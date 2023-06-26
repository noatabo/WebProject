
const sells_li = $("#sells")
const orders_li = $("#orders")
const newPhotoForm = $("#newPhotoForm")[0]
sells_li[0].addEventListener("click", () => {
    console.log("sells")
})

orders_li[0].addEventListener("click", () => {
    console.log("orders")
})
async function initMap(city) {
    // The location of Uluru
    console.log(city)
    const { Map } = await google.maps.importLibrary("maps");
    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ 'address': city }, function (results, status) {
        if (status === 'OK') {
            map.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location
            });
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });

    // Request needed libraries.
    //@ts-ignore
    const { AdvancedMarkerView } = await google.maps.importLibrary("marker");

    // The map, centered at Uluru
    map = new Map(document.getElementById("map"), {
        zoom: 12,
        mapId: "DEMO_MAP_ID",
    });
}
newPhotoForm.addEventListener("submit", (e) => {
    console.log("submit")
    e.preventDefault()
    const file = $("#newPhoto")[0].files[0];
    const formData = new FormData();
    if (!file) {
        return alert("input an image")
    }
    formData.append("photo", file)
    $.ajax({
        url: '/utils/ProfilePic',
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            var res = JSON.parse(response.responseText);

            console.log(response)
            if (res.image) {
                const img = $("#pimg")[0]
                img.src = res.image
            }

        },
        error: function (xhr, status, error) {
            var response = JSON.parse(xhr.responseText);

            if (response.image) {
                const img = $("#pimg")[0]
                img.src = response.image
            } else {
                alert("An error occurred. Please try again.");
            }
        }
    });
})

