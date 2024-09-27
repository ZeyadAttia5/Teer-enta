

exports.SendError = (res, err) => {
    const status = err.statusCode || 500;
    res.status(status).json({ message: err.message ,errors : err.date });
}