console.log("type " + (typeof socket))
if (typeof socket === "undefined") {
    var socket = io();
    console.log("type2 " + (typeof socket))
}
window.addEventListener("load", (event) => {
    console.log("test")
    socket.emit("joinListing")
    console.log(socket.connected)
});

function refreshPage() {
    $.ajax({
        url: '/listings',
        type: 'GET',
        success: function (response) {
            var $response = $('<div></div>').html(response);
            var $listingsShowcase = $response.find('#listingsShowcase');
            $('#listingsShowcase').html($listingsShowcase.html());

        },
        error: function (xhr, status, error) {
            console.log('Error:', error);
        }
    });
}
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
if (urlParams.get('new') == 1) {
    refreshPage()
}

socket.on('newListing', () => {
    console.log('newListing sent!')
    refreshPage()
})

const NameCheck = $("#NameParameter")[0]
const ArtistCheck = $("#ArtistParameter")[0]
const MinimumCheck = $("#MinPriceParameter")[0]
const MaximumCheck = $("#MaxPriceParameter")[0]
const YearParameter = $("#YearParameter")[0]


//:name&:artist&:minimum&:maximum&:release
function changeState(field) {
    if (field.className === "form-control w-50") {
        field.className = "form-control w-50 d-none"
        field.value = ""
    } else {
        field.className = "form-control w-50"
    }
}

function ListingsSearch() {
    const NameField = $("#NameField")[0]
    const ArtistField = $("#ArtistField")[0]
    const MinimumField = $("#MinimumField")[0]
    const MaximumField = $("#MaximumField")[0]
    const YearField = $("#YearField")[0]
    let query = ""
    let parameters = []
    let data = new FormData();
    if (NameField.value !== "") {
        parameters.push("name")
        console.log("pushed name")
        data.append("name", NameField.value)
        query += `?name=${NameField.value}`
    } else {
        query += `?name=all`
    }
    if (ArtistField.value !== "") {
        parameters.push("artist")
        data.append("artist", ArtistField.value)
        query += `&artist=${ArtistField.value}`
    } else {
        query += `&artist=all`
    }
    if (MinimumField.value !== "") {
        parameters.push("minimum")
        data.append("minimum", MinimumField.value)
        query += `&minimum=${MinimumField.value}`
    } else {
        query += `&minimum=all`

    }
    if (MaximumField.value !== "") {
        parameters.push("maximum")
        data.append("maximum", MaximumField.value)
        query += `&maximum=${MaximumField.value}`

    } else {
        query += `&maximum=all`
    }
    if (YearField.value !== "") {
        parameters.push("release")
        data.append("release", YearField.value)
        query += `&release=${YearField.value}`
    } else {
        query += `&release=all`

    }
    //data.append("pars", parameters)
    console.log("query" + query)
    $.ajax({
        url: "/listings/parameters" + query,
        type: "GET",
        contentType: "application/x-www-form-urlencoded",
        processData: false,
        success: async function (response) {
            var $response = $('<div></div>').html(response);
            var $listingsShowcase = $response.find('#listingsShowcase');
            $('#listingsShowcase').html($listingsShowcase.html());
        },
        error: function (xhr, status, error) {
            if (error) {
                alert(error);
            } else {
                alert("An error occurred. Please try again.");
            }

        }
    })




}
