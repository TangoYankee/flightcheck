var methods = {}

methods.formatDateTime = (raw_date_time) => {
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    if (raw_date_time) {
        var date_time = raw_date_time.split('T');
        var split_date = date_time[0].split('-');
        var split_time = date_time[1].split(':');
        var hour = split_time[0];
        var minute = split_time[1];
        var day = split_date[2];
        var month = months[split_date[1].replace(/^.{0}0/, '') - 1];
        return (`${hour}:${minute}, ${day} ${month}`);
    } else {
        return "unknown";
    }
}

methods.formatFlightTime = (block_time) => {
    if (block_time) {
        var block_hours = Math.trunc(block_time / 60)
        var block_minutes = block_time % 60
        return (`${block_hours}hr ${block_minutes}min (${block_time} minutes)`);
    } else {
        return "unknown";
    }
}

exports.data = methods;
