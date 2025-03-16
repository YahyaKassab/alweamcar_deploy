const messages = require('../locales/messages');

function parseErrorMessage(message) {
    if (typeof message == 'string') {
        const jsonString = message.split(': ').slice(2).join(': ').trim();
        try {
            return JSON.parse(jsonString);
        } catch (err) {
            // Fallback if parsing fails
            return message;
        }
    }

    return message;
}

// Usage in Express error handler
const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message;
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0]; // Extract the field causing the duplicate error
        let { ar, en } = messages.duplicate_key;
        ar = ar.replace('{field}', field);
        en = en.replace('{field}', field);
        message = { en, ar };
        statusCode = 400;
    }

    res.status(statusCode).json({
        success: false,
        message: parseErrorMessage(message) || {
            en: 'Unexpected error occurred.',
            ar: 'حدث خطأ غير متوقع.',
        },
    });
};
module.exports = errorHandler;
