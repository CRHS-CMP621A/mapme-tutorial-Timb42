'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

let map;
let mapEvent;
let workouts = [];

//class//
class Workout {
  date = new Date();
  id = (Date.now() + '').slice(-10);

  constructor(coords, distance, duration) {
    this.coords = coords; // [lat,lng]
    this.distance = distance; // in km
    this.duration = duration; // in mins
  }
}

//child classes of workout class

class Running extends Workout {
  type = 'Running';

  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration); /*from workout class*/
    this.cadence = cadence;
    this.calcPace();
    this.setDescription();
  }

  //methods
  calcPace() {
    //min / km
    this.pace = this.duration / this.distance;
    return this.pace
  }

  setDescription() { //Running on __date__
    this.description = `${this.type} on ${this.date.toDateString()}`;
  }
}

class Cycling extends Workout {
  type = 'Cycling';

  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration); /*from workout class*/
    this.elevation = elevationGain;
    this.calcPace();
    this.setDescription();
  }

  //Methods
  calcPace() {
    //min/ km
    this.pace = this.duration / this.distance;
    return this.pace
  }

  setDescription() {//Cycling on __date__
    this.description = `${this.type} on ${this.date.toDateString()}`;
  }
}

//Testing classes//
const run1 = new Running([39, -12], 5.2, 24, 178);
const cycling1 = new Cycling([39, -12], 27, 95, 523);
console.log(run1, cycling1)


navigator.geolocation.getCurrentPosition(
  function (position) {
    // console.log(position);
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const zoom = '15z'
    const coords = [latitude, longitude]
    console.log('https://www.google.com/maps/@' + latitude + ',' + longitude + ',' + zoom)
    map = L.map('map').setView(coords, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    //task 7.2 
    const data = JSON.parse(localStorage.getItem('workouts'))

    //check if data is already stored
    if (data) {
      workouts = data;//load data into workouts array
      console.log(data);
    }

    //task 7.3 

    //render workout in sidebar for user
    let html;
    for (let workout of workouts) {
      let lat = workout.coords[0];//lat and lng of each workout needed to display the marker
      let lng = workout.coords[1];

      if (workout.type === 'Running') {
        html = `<li class="workout workout--running" data-id=${workout.id}>
          <h2 class="workout__title">${workout.description}</h2>
          <div class="workout__details">
            <span class="workout__icon">🏃‍♂️</span>
            <span class="workout__value">${workout.distance}</span>
            <span class="workout__unit">km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${workout.duration}</span>
            <span class="workout__unit">min</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.pace}</span>
            <span class="workout__unit">min/km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">🦶🏼</span>
            <span class="workout__value">${workout.cadence}</span>
            <span class="workout__unit">spm</span>
          </div>
        </li>`;

        //display map marker for each workout
        L.marker([lat, lng])
          .addTo(map)
          .bindPopup(
            L.popup({
              maxWidth: 250,
              minWidth: 100,
              autoClose: false,
              CloseOnClick: false,
              ClassName: 'running-popup',

            })
          )
          .setPopupContent('workout')
          .openPopup();

      } else if (workout.type === 'cycling') {
        html = `<li class="workout workout--cycling" data-id= ${workout.id}>
  <h2 class="workout__title">${workout.description}</h2>
  <div class="workout__details">
    <span class="workout__icon">🚴‍♀️</span>
    <span class="workout__value">${workout.distance}</span>
    <span class="workout__unit">km</span>
  </div>
  <div class="workout__details">
    <span class="workout__icon">⏱</span>
    <span class="workout__value">${workout.duration}</span>
    <span class="workout__unit">min</span>
  </div>
  <div class="workout__details">
    <span class="workout__icon">⚡️</span>
    <span class="workout__value">${workout.pace}</span>
    <span class="workout__unit">km/h</span>
  </div>
  <div class="workout__details">
    <span class="workout__icon">⛰</span>
    <span class="workout__value">${workout.elevation}</span>
    <span class="workout__unit">m</span>
  </div>
</li>`;

        //display marker
        L.marker([lat, lng])
          .addTo(map)
          .bindPopup(
            L.popup({
              maxWidth: 250,
              minWidth: 100,
              autoClose: false,
              CloseOnClick: false,
              ClassName: 'cycling-popup',
            })
          )
          .setPopupContent('Workout')
          .openPopup();
      }
      console.log(html);
      form.insertAdjacentHTML('afterend', html);
    }
    map.on('click', function (mapE) {
      mapEvent = mapE;
      form.classList.remove('hidden');
      inputDistance.focus();
      const lat = mapEvent.latlng.lat
      const lng = mapEvent.latlng.lng
    })

  }
    ,
    function () {
      alert('Could not get position.');
    }
  );


// Event listener //
form.addEventListener('submit', function (e) {
  e.preventDefault()

  //get data from form

  const type = inputType.value;
  const distance = Number(inputDistance.value);
  const duration = Number(inputDuration.value);
  const lat = mapEvent.latlng.lat;
  const lng = mapEvent.latlng.lng;
  let workout;

  //if//

  if (type === 'running') {
    const cadence = Number(inputCadence.value);


    workout = new Running([lat, lng], distance, duration, cadence);
  }

  if (type === 'cycling') {
    const elevation = +inputElevation.value;

    workout = new Cycling([lat, lng], distance, duration, elevation);
  }

  workouts.push(workout);
  console.log(workouts)
  //task 7.1
  localStorage.setItem('workouts', JSON.stringify(workouts));
  let html;
  if (type === 'running') {
    html = `<li class="workout workout--running" data-id=${workout.id}>
          <h2 class="workout__title">${workout.description}</h2>
          <div class="workout__details">
            <span class="workout__icon">🏃‍♂️</span>
            <span class="workout__value">${workout.distance}</span>
            <span class="workout__unit">km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${workout.duration}</span>
            <span class="workout__unit">min</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.pace}</span>
            <span class="workout__unit">min/km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">🦶🏼</span>
            <span class="workout__value">${workout.cadence}</span>
            <span class="workout__unit">spm</span>
          </div>
        </li>`
  }
  html += `<li class="workout workout--cycling" data-id= ${workout.id}>
        <h2 class="workout__title">${workout.description}</h2>
        <div class="workout__details">
          <span class="workout__icon">🚴‍♀️</span>
          <span class="workout__value">${workout.distance}</span>
          <span class="workout__unit">km</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⏱</span>
          <span class="workout__value">${workout.duration}</span>
          <span class="workout__unit">min</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⚡️</span>
          <span class="workout__value">${workout.pace}</span>
          <span class="workout__unit">km/h</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⛰</span>
          <span class="workout__value">${workout.elevation}</span>
          <span class="workout__unit">m</span>
        </div>
      </li>`

  form.insertAdjacentHTML('afterend', html);

  L.marker([lat, lng]).addTo(map)
    .bindPopup('WORKOUT')
    .openPopup();
  console.log(mapEvent)
})

//event listeners 

inputType.addEventListener('change', function () {
  inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
})

//task 6
containerWorkouts.addEventListener('click', function (e) {
  const workoutEl = e.target.closest('.workout'); //selects workout class
  if (!workoutEl) return; //if workout not found then return out of this function
  const workout = workouts.find((work) => work.id === workoutEl.dataset.id);

  map.setView(workout.coords, 13, {
    //set the map view to location of workout coordinates

    animate: true,
    pan: {
      duration: 1,
    },
  });
});
