format = (text) => {
    var text = "Here[ in my [car](dmv.ca.gov) I) feel [safest of all](https://www.osha.com/). [Example site](example.com) +";
    var bracket_parentheses = allIndexOf(text, "](");
    var open_brackets = allIndexOf(text, "[");
    var close_parentheses = allIndexOf(text, ")");
    if (bracket_parentheses) {
        var message = text;
        var all_link_positions = allLinkPostions(bracket_parentheses, open_brackets, close_parentheses);
        for (link_positions in all_link_positions) {
            if (validLinkPositions(link_positions)) {
                var link_string = findLinkString(link_positions, text);
                var unhttped_link_address = findLinkAddress(link_positions, text);
                var link_address = httpLinkAddress(unhttped_link_address);
                var message_link = createMessageLink(link_address, link_string);
                var markdown_link = findMarkdownLink(link_positions, text);
                message = replaceLink(markdown_link, message_link, message);
            }
        }
        return message;
    } else {
        return text;
    }
}


allIndexOf = (string, search_char) => {
    var start_index = 0, index, indices = [], count = 0;
    while ((index = string.indexOf(search_char, start_index)) > -1 && count < 20) {
        indices.push(index);
        start_index = index + 1;
        count++;
    }
}


//Notes:
// The filter() method creates a new array with all elements that pass the test implemented by the provided function.
// The pop() method removes the last element from an array and returns that element. This method changes the length of the array.
// Can also be used to get the last element of an array

// alliLnks will return an array of arrays. The nested arrays will contain a set of bracket and parens
allLinkPositions = (bracket_parentheses, open_bracket_indices, close_parenthesis_indices) => {
    var all_link_positions = [];
    var bracket_parentheses_len = bracket_parentheses.length;
    for (let i = 0; i < bracket_parentheses_len; i++) {
        var open_bracket_index;
        var bracket_parenthesis_index = bracket_parentheses[i];
        var close_parenthesis_index;
        var link_positions = [open_bracket_index, bracket_parenthesis_index, close_parenthesis_index];
        if (bracket_parentheses_len == 1){
            open_bracket_index = open_bracket_indices.filter(each_open_bracket_index => each_open_bracket_index < bracket_parenthesis_index);
            link_positions[0] = every_open_bracket_index.pop();
            close_parenthesis_index = close_parenthesis_indices.filter(each_close_parenthesis_index => each_close_parenthesis_index > bracket_parenthesis_index);         
            link_positions[2] = close_parenthesis_index[0];
        } else if(bracket_parentheses_len >= 2){
            if( (i+1) == bracket_parentheses_len){
                open_bracket_index = open_bracket_indices.filter(each_open_bracket_index => each_open_bracket_index < bracket_parenthesis_index);
                link_positions[0] = every_open_bracket_index.pop();
            } else {
                
            }
        }
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


validLinkPositions = (link_positions) => {
    // There are three values and every value is a number
    return (link_positions.length == 3 && link_positions.every(isNumber))
}

findMarkdownLink = (link_positions, text) => {
    return text.splice(link_positions[0], link_positions[2]);
}

findLinkString = (link_positions, text) => {
    return text.splice(link_positions[0], link_positions[1]);
}

findLinkAddress = (link_positions, text) => {
    return text.splice(link_positions[1], link_positions[2]);
}

httpLinkAddress = (unhttped_link_address) => {
    if (unhttped_link_address.includes("http://") || unhttped_link_address.includes("https://")) {
        return unhttped_link_address;
    } else {
        return `https://${unhttped_link_address}`;
    }
}

createMessageLink = (link_address, display_text) => {
    return `<${link_address}|${display_text}>`;
}

replaceLink = (markdown_link, message_link, message) => {
    return message.replace(markdown_link, message_link, message);
}

module.exports = format;