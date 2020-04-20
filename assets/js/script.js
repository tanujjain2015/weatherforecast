
var mainCardEle = document.querySelector(".main-card");
var forecastDeskEle = document.querySelector(".forecast-deck");
var submitButton = document.querySelector("#submitbtn");
var listItem = document.querySelector(".list-group");
var baseURL = "http://api.openweathermap.org/data/2.5/";
var counter = 0;

var API_KEY = "10287ea6d77bdc8b1ed99dbf5b15e8c7";
var forecastArray = [];
var forecastArrayLength = 0;
var cityNameArray = [];

//City Name Array list of searched city Name.
var cityName = function(){
    return{
        cityname : "",
        country : ""
    }
};

//Weather Array store city specific Weather info. 
var weather = {
        id : "",
        cityname : "",
        country : "",
        currentdate : "",
        temp : "",
        humidity : "",
        windspeed : "",
        UVIndex : "",
        description :"",
        weatherIcon : "",
        longitude : "",
        lattitude : ""
};

//Forecast array store 5 day city forecast. 
var forecast = function (){
    return {
        cityid : "",
        date : "",
        cityname : "",
        country : "",
        currentdate : "",
        temp : "",
        humidity : "",
        windspeed : "",
        UVIndex : "",
        weatherCondition : "",
        weatherdescription :"",
        weatherIcon : "",
        lattitude : "",
        longitude : ""
    }
};

// Populate List is a common function for populating city names elements in card container.  
var populateListGroup = function (cityarray){

    if (document.querySelector(".list-container") != null){
        listItem.removeChild(document.querySelector(".list-container"));
    }
    var createDiv = document.createElement("div");
    createDiv.className = "list-container";
    listItem.appendChild(createDiv);

    for (var i = 0; i < cityarray.length ; i++ ) {
    var createListItem = document.createElement("a");
    createListItem.className = "list-group-item list-group-item-action listitem-" + i;
    createListItem.setAttribute("id","listitem-" + i );
    createListItem.textContent = cityarray[i];
    createDiv.appendChild(createListItem);
    }
};

// Function to load data from local storage. 
var loadFromLocalStorage = function(){
    if (readLocalStorageKeyConvertToObject("QueryList") != null){
        cityNameArray = readLocalStorageKeyConvertToObject("QueryList");
        populateListGroup(cityNameArray);
    }
};

//Load stored data at initial page loading. 
loadFromLocalStorage();


/* storeObjectToLocalStorage => Function to store object in Local storage in string format */
function storeObjectToLocalStorage (key, value){
    let value_serialize =  JSON.stringify(value);
    console.log(value_serialize);
    window.localStorage.setItem (key, value_serialize);
}


/* readLocalStorageKeyConvertToObject => Function to read local storage key value pair in string format, convert into Object and return the object*/
function readLocalStorageKeyConvertToObject (key){
    let value_deserialize =  JSON.parse(window.localStorage.getItem(key));
    console.log(value_deserialize);
    return value_deserialize;
}

/* Function to read local storage key value pair in string format, convert into Object and return the object*/
function removeItemFromLocalStorage (key){
    window.localStorage.removeItem(key);
}

//Function to retrieve and display Five Day weather forecast. 
var getFiveDayWeatherForecast = function(name,country){
    var URL = "http://api.openweathermap.org/data/2.5/forecast?q=" + name + "," + country + "&APPID=10287ea6d77bdc8b1ed99dbf5b15e8c7" + "&units=imperial";
    console.log(URL);
    fetch(URL).then(function(response){
        if (response.ok){
            response.json().then(function(data){
                console.log(data);
                forecastArrayLength = 0;
                forecastArrayLength = forecastArray.length;
                var cnt = 0;
                console.log(data.list.length);
                for (var i=0; i < data.list.length; i=i+8){
                    console.log("Inside For loop. Value of i=" + i );
                    forecastArray.push(forecast());
                    forecastArray[forecastArrayLength].date = data.list[i].dt_txt;
                    forecastArray[forecastArrayLength].temp = data.list[i].main.temp + "°F";
                    forecastArray[forecastArrayLength].humidity = data.list[i].main.humidity + "%";
                    forecastArray[forecastArrayLength].weatherIcon =data.list[i].weather[0].icon;
                    forecastArray[forecastArrayLength].weatherdescription =data.list[i].weather[0].description;
                    forecastArrayLength ++;
                    cnt++;
                }
                console.log(forecastArray);
                populateForecast();
            });
        }
    });
};

// Populate List is a common function for populating weather data elements in card container.  
var populateData = function(parentEle,headervalue,classidname,name,value,imgattributesrc, imgattributealt){
    var divContainer = document.createElement("div");
    divContainer.className = classidname + "-div";
    divContainer.style.display="flex";
    divContainer.style.flexWrap="wrap";
    divContainer.style.justifyContent = "left";
    divContainer.style.paddingLeft = "0%";
    parentEle.appendChild(divContainer);
    if (headervalue != null){
        var nameEle = document.createElement(headervalue);
        nameEle.className = classidname;
        nameEle.setAttribute("id",classidname);
        nameEle.textContent = name;
        divContainer.appendChild(nameEle);
    }
    
    var valueEle = document.createElement(headervalue);
    valueEle.className = classidname + "-value";
    valueEle.textContent = value;   
    divContainer.appendChild(valueEle);
    if (imgattributesrc != "" || imgattributesrc != null){
        var imageEle = document.createElement("img");
        imageEle.setAttribute("src",imgattributesrc);
        imageEle.setAttribute("alt",imgattributealt);
        imageEle.style.display = "inline";
        imageEle.style.float = "right";
        divContainer.appendChild(imageEle);
    }
};

//Function to fetch UI Index of an City
var fetchUVIndex = function(latt, long, classname){
    //var URL = http://api.openweathermap.org/data/2.5/uvi?lat=37.75&lon=-122.37;
    var query = "lat=" + latt + "&lon=" + long;
    var URL = baseURL + "uvi?" + query + "&APPID=10287ea6d77bdc8b1ed99dbf5b15e8c7";
    fetch (URL).then(function(response){
        if (response.ok){
            response.json().then(function(data){
                console.log (" This is fetching UI Index");
                console.log(data.value);
                weather.UVIndex = "";
                weather.UVIndex = data.value;
                var eleID = document.querySelector(classname);
                eleID.textContent = weather.UVIndex;
                console.log ("Value of weather UVIndex in fetchUVIndex" + weather.UVIndex);
            });
        }   
    });
};

//Main function to populate City Wweather report. 
var populateCityWeatherReport = function() {
    if (document.querySelector(".currentweatherupdate")){
        mainCardEle.removeChild(document.querySelector(".currentweatherupdate"));
    }
    var cardbody = document.createElement("div");
    cardbody.className = "card-body text-left currentweatherupdate"
    cardbody.setAttribute ("id", "currentweatherupdate" );
    cardbody.style.display = "block";
    cardbody.style.justifyContent = "left";
    cardbody.style.paddingLeft = "0%";
    mainCardEle.appendChild(cardbody);


    var divContainer = document.createElement("div");
    divContainer.className = "main-card-div";
    divContainer.style.display="block";
    divContainer.style.flexWrap="wrap";
    divContainer.style.justifyContent = "left";
    divContainer.style.paddingLeft = "0%";
    cardbody.appendChild(divContainer);
    console.log(weather);
    var dateTimeValue = "(" + moment().format('D/MM/YYYY') + ")";
    var value = weather.cityname + " " + dateTimeValue; 
    var name ="";
    var imageiconurl = "http://openweathermap.org/img/wn/" + weather.weatherIcon + ".png";// + "@2x.png";
    console.log(imageiconurl);
    populateData(divContainer,"h3", "cardheader", "", value,imageiconurl, weather.description);
    name = "Temprature : ";
    value = weather.temp + "°F";
    populateData(divContainer,"P", "temprature", name, value,"","");
    name = "Humidity : ";
    value = weather.humidity + "%";
    populateData(divContainer,"p", "humidity", name, value,"","");
    name = "Wind Speed :  ";
    value = weather.windspeed + "MPH";
    populateData(divContainer,"p", "windspeed", name, value,"","");
    name = "UV Index : ";
    value = weather.UVIndex;
    console.log ("value of weather.UVIndex" + weather.UVIndex);
    populateData(divContainer,"p", "uvindex", name, value,"","");
    console.log(forecastArray);
    fetchUVIndex(weather.lattitude, weather.longitude, ".uvindex-value");
    forecastArray =[];
    forecastArrayLength=0;
};

//Common function to catch Fetch() Errors. 
function handleErrors(response) {
    if (!response.ok) {
        throw Error("City Name do not exist. Please enter a valid city name.");
    }
    return response;
}

//Retrieve and store City weather report from Open Weather API. 
var getWeatherReportByCity = function(event){
    var cityname = "";
    var countryname = "";
    var inputvalue = "";
    var query = "";
    if (event.target.className.includes("listitem")){
        console.log("Value of text content in getWeatherReportByCity:" + event.target.textContent );
        inputvalue = event.target.textContent;
    } else {
        inputvalue = document.querySelector("input[name='cityname']").value;
        cityname = inputvalue[0];
        countryname = inputvalue[1];
    }

    if (inputvalue.includes(",")){
        cityname = inputvalue.split(",")[0];
        countryname = inputvalue.split(",")[1];
        query = cityname + "," + countryname;
    } else {
        cityname = inputvalue;
        query = cityname;
    }
    
    if (query == "" || query.includes("?")){
        alert ("Please enter valid city Name");
        return;
    }

    var URL = baseURL + "weather?q=" + query + "&APPID=10287ea6d77bdc8b1ed99dbf5b15e8c7" + "&units=imperial";
    console.log("Value of City Name is:", URL);
    

    fetch(URL)
    .then (handleErrors)
    .then(function(response){
        if (response.ok){
            response.json().then(function(data){
                if (query != null || query != ""){
           
                    if (cityNameArray.includes(query) == false && cityNameArray.includes(cityname) == false){
                        if (cityNameArray.length > 9){
                            cityNameArray.pop();
                        }
                        cityNameArray.unshift(query);
                        populateListGroup(cityNameArray);
                        counter ++;
                        storeObjectToLocalStorage("QueryList", cityNameArray);
                    }
                }
                console.log(data);
                weather.temp = data.main.temp;
                weather.humidity = data.main.humidity;
                weather.cityname = data.name;
                weather.country= data.sys.country;
                weather.id = data.id;
                weather.windspeed = data.wind.speed;
                weather.description = data.weather[0].description;
                weather.weatherIcon = data.weather[0].icon;
                weather.lattitude = data.coord.lat;
                weather.longitude = data.coord.lon;
                
                console.log ("Value of weather.UVIndex:" + weather.UVIndex);
                populateCityWeatherReport(weather.cityname,weather.country);
                getFiveDayWeatherForecast(weather.cityname,weather.country);
            });
        }
    }).catch(function(error){
        alert(error);
    });
};



//Function to populate 5 day weather forecast  Cards 
var populateForecast = function() {
    if (document.querySelector(".forecast-card-deck-div")){
        forecastDeskEle.removeChild(document.querySelector(".forecast-card-deck-div"));
    }
    
    var divContainer1 = document.createElement("div");
    divContainer1.className = "forecast-card-deck-div";
   // divContainer.style.display = "flex";
    //divContainer.style.flexWrap = "wrap";
    //divContainer.style.justifyContent = "space-evenly";
    forecastDeskEle.appendChild(divContainer1);
    
    var headerEle = document.createElement("h3");
    headerEle.textContent = "5-Day Forecast";
    headerEle.className = "cardheader text-left";
    headerEle.style.display = "block";
    headerEle.style.paddingLeft = "20px";
    divContainer1.appendChild(headerEle);

    var divContainer = document.createElement("div");
    divContainer.className = "forecast-card-deck-div";
    divContainer.style.display = "flex";
    divContainer.style.flexWrap = "wrap";
    divContainer.style.justifyContent = "space-evenly";
    divContainer1.appendChild(divContainer);

    console.log("Inside Populate Forecast Function. Array Length is:" + forecastArray.length);
    for (var i=0; i < forecastArray.length; i++) {
        var cardmain = document.createElement("div");
        cardmain.className = "card text-white bg-primary";
        cardmain.style.maxWidth = "18 rem";
        divContainer.appendChild(cardmain);

        var cardbody = document.createElement("div");
        cardbody.className = "card-body";
        cardmain.appendChild(cardbody);

        var cardTitile = document.createElement("h5");
        cardTitile.className = "card-title";
        cardTitile.textContent = moment(forecastArray[i].date).format('D/MM/YYYY');
        cardbody.appendChild(cardTitile);

        var cardImage = document.createElement("img");
        var imageiconurl = "http://openweathermap.org/img/wn/" + forecastArray[i].weatherIcon + ".png";
        cardImage.setAttribute("src",imageiconurl);
        cardImage.setAttribute("alt", forecastArray[i].weatherdescription);
        cardImage.style.alignContent = "center";
        cardbody.appendChild(cardImage);

        var cardText = document.createElement("p");
        cardText.textContent = "Temprature : " + forecastArray[i].temp;
        cardText.className = "text-left";
        cardText.style.fontSize = "10";
        cardbody.appendChild(cardText);

        cardText = document.createElement("p");
        cardText.textContent = "Humidity : " + forecastArray[i].humidity;
        cardText.className = "text-left";
        cardText.style.fontSize = "10";
        cardbody.appendChild(cardText);
    }
};


submitButton.addEventListener("click",getWeatherReportByCity);

listItem.addEventListener("click",getWeatherReportByCity);