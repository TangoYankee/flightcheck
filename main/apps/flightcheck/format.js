var methods = {}

methods.formatChangeSchedTime = (est_time, sched_time) => {
    var time_state, time_change_color;
    if (est_time && sched_time) {
        est_time_date = new Date(est_time);
        sched_time_date = new Date(sched_time);
        time_change_abs = Math.abs((est_time_date - sched_time_date)/6e4)
        if (est_time_date <= sched_time_date){
            time_state = "early"
            time_change_color = "black"

        } else if (est_time_date > sched_time_date){
            time_state = "late"
            time_change_color = "red"
        }
        return `${time_change_abs} min ${time_state} :${time_change_color}_circle:`
    } else {
        return "delay unknown"
    }
}

methods.formatDisplayTime = (est_time, sched_time) => {
    if(est_time != "unknown"){
        return est_time;
    } else if(sched_time != "unknown"){
        return sched_time;
    } else {
        return "time unknown"
    }
}

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
        return (`${hour}${minute}, ${month} ${day}`);
    } else {
        return "unknown";
    }
}

methods.formatFlightTime = (block_time) => {
    if (block_time) {
        var block_hours = Math.trunc(block_time / 60)
        var block_minutes = block_time % 60
        return (`${block_hours} hr ${block_minutes} min`);
    } else {
        return "unknown";
    }
}

exports.data = methods;
