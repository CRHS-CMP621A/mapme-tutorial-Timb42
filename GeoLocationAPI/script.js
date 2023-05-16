navigator.geolocation.getCurrentPosition(
    function (position) {
        console.log(position);
    },
    function () {
        alert('Could not get position.');
    }
);