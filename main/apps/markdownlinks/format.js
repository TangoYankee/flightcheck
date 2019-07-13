format = (text) => {
    var brackets_parentheses = allIndexOf(text, "](");
    var brackets = allIndexOf(text, "[");
    var parentheses = allIndexOf(text, ")");
    if (brackets_parentheses) {
        var message = text;
        var all_link_positions = allLinkPostions(brackets_parentheses, brackets, parentheses);
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


allLinkPositions = (brackets_parentheses, brackets, parentheses) => {
    var all_positions = [];
    var brackets_parentheses_len = brackets_parentheses.length;
    for (var i = 0; i < brackets_parentheses_len; i++) {
        var previous_position = findPreviousPosition(i, brackets_parentheses);
        var current_position = brackets_parentheses[i]
        var next_position = findNextPosition(i, brackets_parentheses, brackets_parentheses_len);

        var positions = [undefined, current_position, undefined];
        positions[0] = findOpenBracket(brackets, current_position, previous_position);
        positions[2] = findClosedParenthensis(parentheses, current_position, next_position);

        all_positions.push(positions);
    }
    return all_positions;
}


findPreviousPosition = (i, brackets_parentheses) => {
    if (i == 0) {
        return 0;
    } else {
        var j = i - 1;
        return brackets_parentheses[j];
    }
}


findNextPosition = (i, brackets_parentheses, bracket_parentheses_len) => {
    if (i == (bracket_parentheses_len - 1)) {
        return parentheses.pop();
    } else {
        var k = i + 1;
        return brackets_parentheses[k];
    }
}


findClosedParenthensis = (parentheses, current_position, next_position) => {
    filtered_parentheses = parentheses.filter(parenthesis => parenthesis > current_position && parenthesis <= next_position);
    return filtered_parentheses[0];
}


findOpenBracket = (brackets, current_position, previous_position) => {
    filtered_brackets = brackets.filter(bracket => bracket < current_position && bracket >= previous_position);
    return filtered_brackets.pop();
}


validLinkPositions = (link_positions) => {
    has_values = link_positions.every(value => value);
    correct_length = link_positions.length == 3;
    correct_order = (link_positions[0] < link_positions[1] && link_positions[1] < link_positions[2])
    return (correct_length && has_vaues && correct_order)
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


httpLinkAddress = (link_address) => {
    lower_case_address = link_address.toLowerCase();
    if (lower_case_address.includes("http://") || lower_case_address.includes("https://")) {
        return link_address;
    } else {
        return `https://${link_address}`;
    }
}


createMessageLink = (link_address, display_text) => {
    return `<${link_address}|${display_text}>`;
}


replaceLink = (markdown_link, message_link, message) => {
    return message.replace(markdown_link, message_link, message);
}


module.exports = format;
