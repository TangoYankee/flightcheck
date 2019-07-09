var test_message = "Here [car](dmv.ca.gov) at I ](feel [safest of all](https://www.osha.com/). [Example site](example.com)";
var expected_message = "Here in my <dmv.ca.gov|car> at I feel <https://www.osha.com/|safest of all>. <example.com|Example site>";

// If the link does not
// console.log(test_message.indexOf("]("));
var search_char = "]("
var test_message_len = test_message.length;
var start_index = 0, index, indices = [];
while ((index = test_message.indexOf(search_char, start_index)) > -1) {
    console.log(index);
    indices.push(index);
    start_index = index + 1;
}

console.log(indices);