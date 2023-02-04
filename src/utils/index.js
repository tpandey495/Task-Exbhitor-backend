exports.sendErrorResponse = async (req, res, statusCode, message) => {
    res.status(statusCode).send({message: message, statusCode: statusCode}).end();
}


exports.sendSuccessResponse = async (req, res, statusCode, message) => {
    res.status(statusCode).send(message).end();
}

