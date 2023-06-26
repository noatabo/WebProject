function handleBid(listingId, bidBy) {
    let bidAmount = $("#bidAmount")[0].value
    console.log(bidBy)
    if (!bidAmount)
        return alert("put a bid")
    $.ajax(
        {
            url: "/utils/newBid/",
            type: 'Post',
            data: {
                date: (new Date()),
                bid: bidAmount,
                listing: listingId,
                bidBy: bidBy
            },
            contentType: "application/x-www-form-urlencoded",
            dataType: "json",
            success: async function (response) {
                console.log("response:" + response.lastBid)
                $("#lastbid")[0].textContent = "Last Bid : " + response.lastBid + "$"
            },
            error: function (xhr, status, error) {
                const response = JSON.parse(xhr.responseText)
                if (response.msg) {
                    console.log("error bad bid")
                    alert(response.msg);
                    $("#bidAmount")[0].value = "";
                } else {
                    alert("An error occurred. Please try again.");
                }
            }
        })
}
function handleDelete(listingId) {
    $.ajax(
        {
            url: "/listings/deleteListing/",
            type: 'delete',
            data: {
                listing: listingId,
            },
            contentType: "application/x-www-form-urlencoded",
            dataType: "json",
            success: async function (response) {
                console.log("response:" + response)
                refreshPage()
            },
            error: function (xhr, status, error) {
                console.log(xhr.responseText); // Handle error response
                const response = JSON.parse(xhr.responseText)
                if (response.message) {
                    alert(response.msg);
                } else {
                    alert("An error occurred. Please try again.");
                }
            }
        })
}
function handleAccept(listingId, bidId, date) {
    $.ajax(
        {
            url: "/listings/close/",
            type: 'post',
            data: {
                listing: listingId,
                bid: bidId,
            },
            contentType: "application/x-www-form-urlencoded",
            dataType: "json",
            success: async function (response) {
                if (response.message === "sell completed") {
                    alert("sell completed")
                }
            },
            error: function (xhr, status, error) {
                console.log(error.msg)
                alert(xhr.responseText); // Handle error response
            }
        })
}
socket.on('newListing', () => {
    console.log('newListing sent!')
    refreshPage()
})

