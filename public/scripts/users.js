function promoteUser(id) {
    $.ajax({
        url: '/admin/promote',
        type: 'POST',
        data: {
            _id: id
        },
        success: function (response) {
            console.log("success")
            let btn = $(`#promote-${id}`)[0]
            console.log(btn)
            btn.disabled = true
            let demotebtn = $(`#demote-${id}`)[0]
            demotebtn.disabled = false
        },
        error: function (xhr, status, error) {
            alert("An error occurred. Please try again.");
        }
    });
}
function demoteUser(id) {
    $.ajax({
        url: '/admin/demote',
        type: 'POST',
        data: {
            _id: id
        },
        success: function (response) {
            console.log("success")

            let promotebtn = $(`#promote-${id}`)[0]
            promotebtn.disabled = false
            let btn = $(`#demote-${id}`)[0]
            btn.disabled = true

        },
        error: function (xhr, status, error) {
            alert("An error occurred. Please try again.");
        }
    });
}
function banUser(id) {
    $.ajax({
        url: '/admin/ban',
        type: 'POST',
        data: {
            _id: id
        },
        success: function (response) {
            console.log("success")
            let btn = $(`#ban-${id}`)[0]
            console.log(btn)
            btn.disabled = true
            let demotebtn = $(`#unban-${id}`)[0]
            demotebtn.disabled = false
        },
        error: function (xhr, status, error) {
            alert("An error occurred. Please try again.");
        }
    });
}
function unbanUser(id) {
    $.ajax({
        url: '/admin/unban',
        type: 'POST',
        data: {
            _id: id
        },
        success: function (response) {
            console.log("success")

            let ban = $(`#ban-${id}`)[0]
            ban.disabled = false
            let btn = $(`#unban-${id}`)[0]
            btn.disabled = true

        },
        error: function (xhr, status, error) {
            alert("An error occurred. Please try again.");
        }
    });
}
