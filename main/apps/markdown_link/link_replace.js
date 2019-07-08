var original_url= "<http://github.com|github.com>";
var display_text = "GitHub Repo";

split_url = original_url.split("|");
console.log(split_url);
new_url = `${split_url[0]}|${display_text}>`
console.log(new_url);

// console.log(match_url);