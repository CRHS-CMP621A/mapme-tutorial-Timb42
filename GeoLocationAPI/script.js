navigator.geolocation.getCurrentPosition(
    function (position) {
       // console.log(position);
       const latitude = position.coords.latitude;
       const longitude = position.coords.longitude;
       console.log(latitude, longitude);
    },
    function () {
        alert('Could not get position.');
    }
);