
var cityCountryCodeArray = [];

var populateCityCountryCode



$(document).ready(function(){
    // constructs the suggestion engine
    var city = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.whitespace,
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        // The url points to a json file that contains an array of country names
        prefetch: '../data/current.city.list.json'
    });
    
    // Initializing the typeahead with remote dataset without highlighting
    $('.typeahead').typeahead(null, {
        name: 'City',
        source: city,
        limit: 10 /* Specify max number of suggestions to be displayed */
    });
});