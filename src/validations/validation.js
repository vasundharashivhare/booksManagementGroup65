const isValid = function (value) {
    if (typeof (value) === undefined || typeof (value) === null) { return false }
    if (value.trim().length == 0) { return false }
    if (typeof (value) === "string" && value.trim().length > 0) { return true }
}

const validanumber = function (value) {
    if (/[6789]{1}[0-9]{9}/.test(value)) {
        return true
    } else {
        return false
    }
}


const isValidObjectId = function (objectId) {
    return /^[0-9a-fA-F]{24}$/.test(objectId)
}

const isRightFormatReleasedAt = function (releasedAt) {
    return /((\d{4}[\/-])(\d{2}[\/-])(\d{2}))/.test(releasedAt)
}

const isValidEmail = function (value)   {
    if (/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(value)) { return true }
    else return false
}


module.exports={isValid,validanumber,isValidObjectId,isRightFormatReleasedAt,isValidEmail }