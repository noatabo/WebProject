const dataList = $("#albums")[0]
const searchBar = $("#albumSearch")[0]
const searchDiv = $("#searchDiv")[0]
const newListingForm = $("#newListingForm")[0]
let picked;
function removeAll(element) {
    let child = element.lastElementChild;
    while (child) {
        element.removeChild(child);
        child = element.lastElementChild;
    }
}

const search = val => {
    removeAll(dataList)
    if (val === "") {
        return;
    }
    $.ajax({
        url: "/utils/album_search/" + val,
        type: 'GET',
        contentType: "application/x-www-form-urlencoded",
        dataType: "json",
        success: function (response) {
            removeAll(dataList)

            response.forEach(a => {
                let card = document.createElement("div")
                card.className = "card col-4 me-3 mb-3 p-0 align-items-center justify-content-center text-center"
                card.style.width = "15rem"
                let img = document.createElement("img")
                img.className = "card-img-top w-100 h-50"
                img.src = a.cover
                card.append(img)
                let cbody = document.createElement("div")
                cbody.className = "card-body p-3"
                let title = document.createElement("p")
                title.textContent = a.title
                title.className = "h3"
                let btn = document.createElement("a")
                btn.textContent = "Pick Album"
                btn.className = "btn btn-primary fw-bold m-1"
                cbody.append(title)
                card.append(cbody)
                card.append(btn)
                dataList.append(card)
                btn.addEventListener("click", function handlePick(e) {
                    removeAll(dataList)
                    dataList.append(card)
                    searchBar.disabled = true
                    card.removeChild(btn)
                    card.append(document.createElement("p").textContent = a.id)
                    picked = a;
                    card.className += " d-flex align-items-center justify-content-center"
                    let b = document.createElement("btn")
                    b.textContent = "Edit"
                    b.className = "btn btn-primary fw-bold m-1"
                    b.addEventListener("click", (e) => {
                        searchBar.disabled = false
                        picked = null;
                        removeAll(dataList)
                        search(searchBar.value)
                        b.remove()
                    })
                    b.id = "edit"
                    searchDiv.append(b)

                })
            })
            console.log(response); // Handle success response
        },
        error: function (xhr, status, error) {
            console.log(xhr.responseText); // Handle error response
        }
    });

}
searchBar.addEventListener("input", async content => {
    let input = searchBar.value
    console.log(input)
    if (input === "") {
        removeAll(dataList)
        return;
    }
    await search(input)
})
newListingForm.addEventListener("submit", (function (e) {
    e.preventDefault()
    const fileInput = document.getElementById('photo');
    const file = fileInput.files[0];
    const formData = new FormData();
    let bid = $("#bid")[0].value
    if (!(file && bid && picked)) {
        return alert("no parameters")
    }
    formData.append('photo', file);
    formData.append('bid', bid)
    formData.append('picked', picked.id)

    formData.append('title', picked.title)
    formData.append('artist', picked.artist.name)
    // formData.append('release',picked.release_date)
    console.log("picked: ", picked)
    $.ajax({
        url: '/listings/postNew',
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            console.log(response)
            window.location.href = "/listings?new=1";

        },
        error: function (xhr, status, error) {
            var response = JSON.parse(xhr.responseText);

            if (response.message) {
                alert(response.message);
            } else {
                alert("An error occurred. Please try again.");
            }
        }
    });
}
))
