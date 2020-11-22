// moment() for the date :
var date = moment().format(" (MM/DD/YYYY) ");

var city;
var cardB = $(".card-body");
var searchHistory = [];
// Function to get search history :
function getHistory() {
    var savedCitys = JSON.parse(localStorage.getItem("searchHistory"));
    if (savedCitys !== null) {
        searchHistory = savedCitys;
    };
    for (i = 0; i < searchHistory.length; i++) {
        if (i == 8) {
            break;
          }
       
        citySearched = $("<button>").attr({
            class: "list-group-item list-group-item-action"
        });
        citySearched.text(searchHistory[i]);
        $(".list-group").append(citySearched);
    }
};
// getHistory() call:
getHistory();


// searches and adds to history
$("#searchCity").click(function() {
    city = $("#city").val();
    getData();
    var verifyArr = searchHistory.includes(city);
    if (verifyArr == true) {
        return
    } else {
        searchHistory.push(city);
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
        var citySearched = $("<button>").attr({
            class: "list-group-item list-group-item-action",
        });
        citySearched.text(city);
        $(".list-group").append(citySearched);
    };
});

// Getting the data :
function getData() {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=af5d1927906e0c44205150e2a5ea7385"
    cardB.empty();
    $("#weeklyForecast").empty();

    // Ajax request :
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        var icons = response.weather[0].icon;
        var iconURL = "http://openweathermap.org/img/w/" + icons + ".png";
        var cityName = $("<h3>").html(city + date);
        var temp = response.main.temp.toFixed();
        var humidity = response.main.humidity;
        var windSpeed = response.wind.speed;
        var lat = response.coord.lat;
        var lon = response.coord.lon;
        cardB.prepend(cityName);
        cardB.append($("<img>").attr("src", iconURL));
        cardB.append($("<p>").html("Temperature : " + temp + " &#8457"));
        cardB.append($("<p>").html("Humidity : " + humidity ));
        cardB.append($("<p>").html("Wind Speed : " + windSpeed));

       // Ajax request for the UV index and colors :
        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/uvi?appid=af5d1927906e0c44205150e2a5ea7385&lat=" + lat + "&lon=" + lon,
            method: "GET"
        }).then(function (response) {
            cardB.append($("<p>").html("UV Index : <span>" + response.value + "</span>"));
            var uvIndex = response.value;
            if (uvIndex <= 2) {
                $("span").attr("class", "btn btn-success");
            };
            if (uvIndex > 2 && uvIndex <= 5) {
                $("span").attr("class", "btn btn-warning");
            };
            if (uvIndex > 5) {
                $("span").attr("class", "btn btn-danger");
            };
        });

        // Ajax request for 5 Day Forecast:
        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=af5d1927906e0c44205150e2a5ea7385",
            method: "GET"
        }).then(function (response) {
            for (i = 0; i < 5; i++) {
                var newCard = $("<div>").attr("class", "col fiveDay bg-primary text-white rounded-lg p-2");
                var myDate = new Date(response.list[i * 8].dt * 1000);
                var icons = response.list[i * 8].weather[0].icon;
                var iconURL = "http://openweathermap.org/img/w/" + icons + ".png";
                var temp = response.list[i].main.temp.toFixed();
                var humidity = response.list[i * 8].main.humidity;
                $("#weeklyForecast").append(newCard);
                newCard.append($("<h4>").html(myDate.toLocaleDateString()));
                newCard.append($("<img>").attr("src", iconURL));
                newCard.append($("<p>").html("Temp : " + temp + " &#8457"));
                newCard.append($("<p>").html("Humidity : " + humidity));
               
            }
        })
    })
};
// EventListener to get data from search history :
$(".list-group-item").click(function() {
    city = $(this).text();
    getData();
});