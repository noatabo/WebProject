
$(document).ready(function () {

    var down = false;

    $('#bell').click(function (e) {

        var color = $(this).text();
        if (down) {

            $('#box').css('height', '0px');
            $('#box').css('opacity', '0');
            down = false;
        } else {
            $('#box').css('display', 'block');
            $('#box').css('height', '100px');
            $('#box').css('opacity', '1');
            down = true;

        }

    });

});