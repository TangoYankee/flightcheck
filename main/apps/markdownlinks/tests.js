// This will (probably) break link previews

var test_message = "Here[ [car](dmv.ca.gov) at I) feel [safest of all](https://www.osha.com/). [Example site](example.com)";
var expected_message = "Here in my <dmv.ca.gov|car> at I feel <https://www.osha.com/|safest of all>. <example.com|Example site>";

test_urls = ["dmv.ca.gov", "https://www.osha.com/", "example.com", "http://github.com/tangoyankee/", "youtube.com", "https://openoakland.org", "tangled.city", "slack.com/apps",
    "google.com/maps/place/Glen+Cove+Marina/@38.0677063,-122.2313533,15z/data=!4m5!3m4!1s0x80857235b7b561fb:0xa31992d9db3a4004!8m2!3d38.0677786!4d-122.213746"];
test_texts = ["My Car", "Safety First", "Registered Domain", "GitHub Repository", "Brain Drain videos", "Civic Hacking", "Tactical Urbanism", "Applications", "Glen Cove Marina"];
