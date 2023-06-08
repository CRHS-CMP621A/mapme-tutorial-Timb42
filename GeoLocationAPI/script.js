navigator.geolocation.getCurrentPosition(
    function (position) {
        // console.log(position);
       const latitude = position.coords.latitude;
       const longitude = position.coords.longitude;
       const zoom = '15z'
       const coords = [latitude, longitude]
       console.log('https://www.google.com/maps/@' + latitude + ',' + longitude + ',' + zoom )
       var map = L.map('map').setView(coords, 13);

L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

L.marker(coords).addTo(map)
    .bindPopup('A pretty CSS popup.<br> Easily customizable.')
    .openPopup();

    map.on('click',function(mapEvent) {
        console.log(mapEvent)
       })
       const lat = mapEvent.latlng.lat
       const lng = mapEvent.latlng.lng
      
    },
    function () {
        alert('Could not get position.');
    }
);