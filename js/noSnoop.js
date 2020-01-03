console.log('No snoop for you!');

// Prevents enter and f12 keys
window.addEventListener('keydown', function (event) {
    if (event.keyCode === 123 || event.keyCode === 13) {
        event.preventDefault();
        return false;
    }
});

// Prevents right clicks
window.addEventListener('contextmenu', function (event) {
    event.preventDefault();
    return false;
});

docu.addEventListener('contextmenu', function (event) {
    event.preventDefault();
    return false;
});

// TODO: To be removed on intro completion
function ensureResize() {
    if ($('.active').attr('id') == "situation1") {
        if (!window.confirm("If your zoom settings are not set to 100%, this exercise will NOT be completable. Do you wish to continue?")) {
            loadPreviousSlide(), $("#next-slide").removeClass("disabled");
        }
    }
}

// TODO: Make this only fire if prematurely exiting - it is now in 'noSnoop.js'
window.onbeforeunload = function () {
    localStorage.clear();
    return "Reloading or closing this window before completion will reset your progress. Are you sure you'd like to continue?";
};