
var API_KEY = "10287ea6d77bdc8b1ed99dbf5b15e8c7";

var getWeatherReportByCity = function(){
    var URL = "http://api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=10287ea6d77bdc8b1ed99dbf5b15e8c7";
    fetch(URL).then(function(response){
        if (response.ok){
            response.json().then(function(data){
                console.log(data);
            });
        }
    });
};


getWeatherReportByCity();
