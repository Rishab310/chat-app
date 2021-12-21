export const timestampToLocalTime = (timestamp) => {
    if (!timestamp) {
        return "";
    }
    const date = new Date(timestamp);
    let hours = date.getHours();
    const minutes = ("0" + date.getMinutes()).slice(-2);
    let suffix = "AM";
    if (hours >= 13) {
        hours -= 12;
        suffix = "PM";
    }
    let timeStr = hours + ":" + minutes + " " + suffix;
    return timeStr;
}

export const isUserOnline = (timestamp) => {
    if (!timestamp) return false;
    // console.log(timestamp);
    const d1 = new Date(timestamp);
    const d2 = new Date();
    // console.log(d1.getFullYear(), d2.getFullYear());
    const diffMs = d2 - d1;
    // console.log(diffMs);
    // if difference less than 1 minutes then user is online
    return diffMs <  60 * 1000;
}