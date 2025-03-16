class ErrorResponse extends Error {
    constructor(messageObj, statusCode) {
        super(messageObj.en); // Default to English message
        this.message = messageObj;
        this.statusCode = statusCode;
    }
}

module.exports = ErrorResponse;
