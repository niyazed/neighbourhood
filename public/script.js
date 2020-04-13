const attribution = '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors';
const mymap = L.map('mapid').setView([0, 0], 2);

var volunteer_icon = L.icon({
    iconUrl: 'images/volunteer.png',
    iconSize: [80, 64]
});
const marker = L.marker([0, 0], {icon: volunteer_icon}).addTo(mymap);

// const tileUrl = 'http://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png';
const tileUrl =  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

const tiles = L.tileLayer(tileUrl, { attribution });
tiles.addTo(mymap);



async function mapping(latitude, longitude, username, text, dateTime){

    var volunteer_icon = L.icon({
        iconUrl: 'images/volunteer.png',
        iconSize: [80, 64]
    });
    const marker = L.marker([0, 0], {icon: volunteer_icon}).addTo(mymap);

    // map init,marker and popup binded stuffs
    mymap.setView([latitude, longitude], 20);
    marker.setLatLng([latitude, longitude]);
    marker.bindPopup('👤 <b>Username:</b> ' + username +  '<br>🕑 <b>Datetime:</b> ' + dateTime  +  '<br>🗯 <b>Text:</b> ' + text);
    
}


async function postData(){

    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition( async function(position){

            // get location of the user
            const latitude  = position.coords.latitude;
            const longitude = position.coords.longitude;    
            console.log(latitude, longitude)

            // get user input datas
            const username = document.getElementById("username").value;
            const text = document.getElementById("text").value;

            // get current date and time
            var today = new Date();
            var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            var dateTime = date+' '+time;

            // send data to server
            const data = { latitude, longitude, username, text, dateTime };
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                    },
                body: JSON.stringify(data)
            };
            const response = await fetch('/api', options);
            const json = await response.json()
            console.log(json)
            
            getData();
            mapping(latitude, longitude, username, text, dateTime);
            //document.getElementById('info_div').innerHTML = document.getElementById('list_div').innerHTML;
        });
    }
    else {
        console.log('Geolocation is not supported by your browser');
        alert('Geolocation is not supported by your browser');
    }

    
}



//getData();
var timer = setInterval(getData, 2000)
async function getData(){
    const response = await fetch('/api');
    const data = await response.json();
    for (item of data) {
        const { latitude, longitude, username, text, dateTime } = item;
        console.log(item)
        mapping(latitude, longitude, username, text, dateTime);

        // var div = document.createElement("div");
        // div.className = "box";
        // div.innerHTML = document.getElementById('list-item').innerHTML;
        // document.getElementById("lists").appendChild(div);

        // document.getElementById('show_username').textContent = username;
        // document.getElementById('show_datetime').textContent = time + ' ' + date;
        // document.getElementById('show_text').textContent = text;
    }

}


