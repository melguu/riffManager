const myContainer = document.getElementById("content");
const myRequest = new Request('js/spyArray.json');
let spyArray = null;
let map = null;
let marker = null;

fetch(myRequest).then((response) => {
    if(response.ok) {
        return response.json();
    }
    throw new Error('Network response was not ok.');
}).then((text) => {
    const jsonData = text;
    spyArray = jsonData.spyArray;
    let spyContent = jsonData.spyArray.map( (item) => `<div class="col">
                                            <div class="card" style="max-width:300px;">
                                                <a href="#myModal" onclick="loadModal('${item.id}')">
                                                    <img class="img-fluid card-img-top" src="${item.thumbnail}">
                                                </a>
                                                <div class="card-block">
                                                    <h3 class="card-title">${item.title}</h3>
                                                    <h6 class="card-subtitle">${item.category} - ${new Date(item.time).toLocaleDateString()}</h6>
                                                    <p class="card-text">${item.details}</p>
                                                    <button class="btn btn-primary modalbtn" onclick="loadModal('${item.id}')">Display image</button>
                                                </div>
                                            </div>
                                        </div>`
    ).reduce( (all, item) => (all + item), "" );
    document.getElementById("content").innerHTML = spyContent;
}).catch(function(error) {
    console.log('Problem :( ' + error.message);
});

function initMap() {
    console.log("init map");
    var uluru = {lat: -25.363, lng: 131.044};
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: uluru
    });
}
/*spyArray.sort( (a, b) => (b.category.localeCompare(a.category)));
let spyContent = spyArray.map( (item) => `<div class="col">
                                            <div class="card" style="max-width:300px;">
                                                <a href="#myModal" onclick="loadModal('${item.id}')">
                                                    <img class="img-fluid card-img-top" src="${item.thumbnail}">
                                                </a>
                                                <div class="card-block">
                                                    <h3 class="card-title">${item.title}</h3>
                                                    <h6 class="card-subtitle">${item.category} - ${new Date(item.time).toLocaleDateString()}</h6>
                                                    <p class="card-text">${item.details}</p>
                                                    <button class="btn btn-primary modalbtn" onclick="loadModal('${item.id}')">Display image</button>
                                                </div>
                                            </div>
                                        </div>`
).reduce( (all, item) => (all + item), 0 );
document.getElementById("content").innerHTML = spyContent;
*/
var loadModal = (itemid) => {
    var modalContent = spyArray.filter((item) =>  item.id == itemid )
        .map((item) => {
        let modal = document.getElementById("myModal");
        modal.getElementsByClassName("modal-title")[0].innerHTML = `${item.title}`;
        modal.getElementsByClassName("img")[0].innerHTML = `<img class="img-fluid" src="${item.image}" alt="${item.details}">`;
            let latLng  = item.coordinates;
            marker = new google.maps.Marker({
                position: latLng,
                map: map
            });
            map.setCenter(latLng);
    });
    $("#myModal").modal('show');
}

$("#myModal").on('shown.bs.modal', (e) => {
    google.maps.event.trigger(map, 'resize');
});

document.getElementById('sortSelect').addEventListener('change', (ev) => {
    ev.stopImmediatePropagation()
    switch (document.getElementById('sortSelect').value) {
        case 'category ascending':
            spyArray.sort((a, b) => (a.category.localeCompare(b.category)));
            break;
        case 'category descending':
            spyArray.sort((a, b) => (b.category.localeCompare(a.category)));
            break;
        default:
            spyArray.sort((a, b) => (a.category.localeCompare(b.category)));
    }
    let spyContent = spyArray.map( (item) => `<div class="col">
                                            <div class="card" style="max-width:300px;">
                                                <a href="#myModal" onclick="loadModal('${item.id}')">
                                                    <img class="img-fluid card-img-top" src="${item.thumbnail}">
                                                </a>
                                                <div class="card-block">
                                                    <h3 class="card-title">${item.title}</h3>
                                                    <h6 class="card-subtitle">${item.category} - ${new Date(item.time).toLocaleDateString()}</h6>
                                                    <p class="card-text">${item.details}</p>
                                                    <button class="btn btn-primary modalbtn" onclick="loadModal('${item.id}')">Display image</button>
                                                </div>
                                            </div>
                                        </div>`
    ).reduce( (all, item) => (all + item), "" );
    document.getElementById("content").innerHTML = spyContent;
});

document.getElementById('filterSelect').addEventListener('change', (ev) => {
    ev.stopImmediatePropagation()
    let categoryArray = [];
    switch (document.getElementById('filterSelect').value) {
        case 'wife':
            categoryArray.push('Wife');
            break;
        case 'girlfriend':
            categoryArray.push('Girlfriend');
            break;
        default:
            categoryArray.push('Wife', 'Girlfriend');
    }
    console.log(categoryArray);
    let spyContent = spyArray.filter((item) => categoryArray.includes(item.category)).map( (item) => `<div class="col">
                                            <div class="card" style="max-width:300px;">
                                                <a href="#myModal" onclick="loadModal('${item.id}')">
                                                    <img class="img-fluid card-img-top" src="${item.thumbnail}">
                                                </a>
                                                <div class="card-block">
                                                    <h3 class="card-title">${item.title}</h3>
                                                    <h6 class="card-subtitle">${item.category} - ${new Date(item.time).toLocaleDateString()}</h6>
                                                    <p class="card-text">${item.details}</p>
                                                    <button class="btn btn-primary modalbtn" onclick="loadModal('${item.id}')">Display image</button>
                                                </div>
                                            </div>
                                        </div>`
    ).reduce( (all, item) => (all + item), "" );
    document.getElementById("content").innerHTML = spyContent;
});
