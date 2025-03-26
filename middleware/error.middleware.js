const errorMiddleware = (err, req, res, next) => {
    try {
        let error = {...err};

        error.message = err.message;
        console.log(error);

        // Mongoose type error
        if (error.name === 'CastError') {
            const message = `Resource not found. Invalid ${error.path}`;
            error = new Error(message);
            error.status = 404;
        }

        //  Mongoose duplicate error
        if (err.code === 11000) {
            const message = `Duplicate field value entered.`;
            error = new Error(message);
            error.statusCode = 400;
        }

        // Mongoose Validation error
        if (err.name === 'ValidationError') {
            const message = Object.values(err.errors).map(val => val.message);
            error = new Error(message.join(', '));
            error.statusCode = 400;
        }

        res.status(error.statusCode || 500).json({success: false, error: error.message || 'Server Error'});

    } catch (error) {
        next(error);
    }
}

export default errorMiddleware;