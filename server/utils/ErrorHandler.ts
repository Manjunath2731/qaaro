class ErrorHandler extends Error{
    status: boolean;
    message: string;
    statusCode: number;
    
    constructor(message: string, statusCode: number) {
        super(message);
        this.status = false;
        this.message = message;
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }

    toJSON() {
        return {
            status: this.status,
            data: {},
            message: this.message,
        };
    }
}

export default ErrorHandler