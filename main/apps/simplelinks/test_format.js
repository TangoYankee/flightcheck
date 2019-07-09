var test_message = "Here[ [car](dmv.ca.gov) at I) feel [safest of all](https://www.osha.com/). [Example site](example.com)";
var expected_message = "Here in my <dmv.ca.gov|car> at I feel <https://www.osha.com/|safest of all>. <example.com|Example site>";

test_urls = ["dmv.ca.gov", "https://www.osha.com/", "example.com", "http://github.com/tangoyankee/", "youtube.com", "https://openoakland.org", "tangled.city", "slack.com/apps",
    "google.com/maps/place/Glen+Cove+Marina/@38.0677063,-122.2313533,15z/data=!4m5!3m4!1s0x80857235b7b561fb:0xa31992d9db3a4004!8m2!3d38.0677786!4d-122.213746"];
test_texts = ["My Car", "Safety First", "Registered Domain", "GitHub Repository", "Brain Drain videos", "Civic Hacking", "Tactile Urbanism", "Applications", "Glen Cove Marina"];


// Function to find all of the indices of a string. Limit to 20
allIndexOf = (string, search_char) => {
    var start_index = 0, index, indices = [], count = 0;
    while ((index = string.indexOf(search_char, start_index)) > -1 && count < 20) {
        indices.push(index);
        start_index = index + 1;
        count++;
    }

}

var bracket_paren = allIndexOf(test_message, "](");
var open_bracket = allIndexOf(test_message, "[");
var close_paren = allIndexOf(test_message, ")");

// For every bracket and parenthesis pair, find the open bracket that happens before it and the close parenthesis that happens right after it
// For parenthesis, use the first index that is greater than the index of the corresponding bracket parenthesis pair
// For bracket, use the last index which is less than the index of the corresponding bracket parenthesis pair

// Check whether the string contains http:// or https://
// If it does not, then add in https:// directly after the ](