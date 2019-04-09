//Simple Parallax
$(window).scroll(function () {
    var scroll = $(window).scrollTop();
    $(".sun").css("transform", "translateY(" + (scroll / 5) + "px)");
});

//Lettering.js
$("h1").lettering();