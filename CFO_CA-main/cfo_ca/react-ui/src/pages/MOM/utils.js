export const parseDate = (datestring) => {
    // dd/mm/yyyy hh:mm:ss => yyyy-mm-dd
    var date = datestring.split(" ")[0]
    var parts = date.split("/")
    return parts[2] + "-" + parts[1] + "-" + parts[0]
};

export const parseDate2 = (datestring) => {
    // console.log("In parseDate2()")
    // dd/mm/yyyy => yyyy-mm-dd
    var parts = datestring.split("/")
    return parts[2] + "-" + parts[1] + "-" + parts[0]
};

export const parseDate3 = (datestring) => {
    // console.log("In parseDate3()")
    // dd/mm/yyyy hh:mm:ss => yyyy/mm/dd
    var date = datestring.split(" ")[0]
    var parts = date.split("/")
    return parts[0] + "/" + parts[1] + "/" + parts[2]
}