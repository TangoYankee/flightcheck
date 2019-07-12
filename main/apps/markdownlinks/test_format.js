// This will (probably) break link previews

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

var bracket_parens = allIndexOf(test_message, "](");
var open_brackets = allIndexOf(test_message, "[");
var close_parens = allIndexOf(test_message, ")");


//FUNCTION: allLinks
//Only enter function if bracket parens exist
    // Otherwise, return the text unchanged
// allLinks will receive arrays of all the positions of closed parens, open brackets, and openbracket-closedparens
// alliLnks will return an array of arrays. The nested arrays will contain a set of bracket and parens
allLinks = (bracket_parens, open_brackets, close_parens) => {
    // Define master array of all bracket/ paren sets (var)
    // Define the length of the bracken parens array
    // The filter() method creates a new array with all elements that pass the test implemented by the provided function.
    // The pop() method removes the last element from an array and returns that element. This method changes the length of the array.
    // Can also be used to get the last element of an array
    let bracket_parens_len = bracket_parens.length;
    for (let i = 0; i < bracket_parens_len; i++){
        // Define value of index for bracket parens
        // Define nested array to hold set of bracket parens with first and third positions empty. Second position contains the index of first bracket parens
        // If it's the only element
            // filter for all of the open brackets before the brack paren
            // Pop and save the last element in list of open brackets to the first element of the nested array
            // filter for all closed parentheses after the position of the bracket paren
            // Add the value of the first result to the last position of the nested array
        // If there are at least two elements
            // If it's the first element
                // then filter for all of the open brackets before the brack paren
              // If it is not the first element,
                 // Find the value of the previous index
                 // Filter for all of the closed parens that are between the current index and the previous index
            // Pop and save the last element in list of closed parens to the first element of the nested array
            // If it's the last index
                // then filter for all closed parentheses after the position of the bracket paren
              // If there is another index after the current index
                // Find the value of the next index
                // Filter for all of the closed parenthesis between the current index and the next index
            // Add the value of the first result to the last position of the nested array
        // Add the nested array to the master array
    }
}

// FUNCTION: masterformat message
// Accepts an array of nested arrays and the user-inputted message
// Outputs a message (string) that is formatted with Slack links
// Create string to hold message slack formatted links. Begins with value equal to user inputted message
// Iterate through all of the nested arrays and perform functions up to formatmessage
// Return formatted message

// FUNCTION: validLink
// accepts a 1 dimensional array
// returns boolean whether array passes test
// Checks that all three positions exist with valid numbers
// The every() method tests whether all elements in the array pass the test implemented by the provided function. It returns a Boolean value.

// FUNCTION: findMarkdownLink:
// accepts validated 1 dimensional array of bracket/parens postions and string of user-inputted text
// returns value of string that exists between the first and third positions (open bracket and closed parens)

// FUNCTION: findDisplayText
// accepts validated 1 dimensional array of bracket/parens postions and string of user-inputted text
// Returns text (string) that exists between the first and second listed indexes in the array (Opn bracket and bracket parens)
// Note: Beware of off-by-one errors with indexing

// Function: findLinkAddress
// accepts validated 1 dimensional array of bracket/parens postions and string of user-inputted text
// Returns link (string) that exists between the second and third listed indexes in the array (bracket parens and closed parens)
// Note: Beware of off-by-one errors with indexing

// Function: httpLinkAddress
// accepts hyperlink string
// returns a hyperlink gauranteed to contain http:// or https://
// checks whether "http://" or "https://" exists in the string
    // If not, add "https://" to the beginning of the string and return
    // If so, return string unchanged

// Function: createLink
// accepts 1. hyperlink (with http(s)://) and 2. textDisplay 
// returns string with text and link is Slack hyperlink format

// Function: formatMessage
// Accepts 1. Slack Formatted Link 2. Original Markdown Formatted Link 3. Slack formatted message 4. Original User-inputted message
// Returns updated Slack formatted message, with original markdown formatted link swapped for Slack formatted link
// String.replace "Markdown link" "slack link"
