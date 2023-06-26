let notifications = []
if (typeof socket === "undefined") {
    var socket = io();
    console.log("type2 " + (typeof socket))
}

socket.on('connect', () => {
    console.log('Connected to server');
    if (hasAuthToken()) {
        console.log("check+" + getCookie('authToken'))
        // Re-subscribe to notifications for the current user
        socket.emit('subscribe', getCookie('authToken'));
    }
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
});

socket.on('notifications', (notification) => {
    console.log('yesss')
    notifications.push(notification)
    newNotification(notification)
})
function newNotification(notification) {
    notification = JSON.parse(notification)
    console.log("yess" + notifications.length)
    $('#notifications_counter').text(notifications.length)

    showNotification(notification.bidder, notification.bidderName, notification.listing, notification.listingName, notification.txt)
}
function notifications_reset() {
    notifications = [];
    $('#modal_ul').empty();
    $('#notifications_counter').text(0)

}
function showNotification(bidder, bn, listing, ln, txt) {
    $('#modal_ul').append(`<li><a href=/users/${bidder}>${bn}</a>${txt}<a href=/listings/listing/${listing}>${ln}</a></li>`)
}
function hasAuthToken() {
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
        const [name, value] = cookie.split('=');
        if (name === 'authToken') {
            return true;
        }
    }
    return false;
}

function getCookie(name) {
    const cookies = document.cookie.split(';');

    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();

        // If the cookie starts with the requested name followed by an equals sign
        if (cookie.startsWith(`${name}=`)) {
            // Return the value of the cookie
            return cookie.substring(name.length + 1, cookie.length);
        }
    }
}
