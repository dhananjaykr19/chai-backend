class ApiError extends Error {
    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        stack = ""
    ){
        super(message)
        this.statusCode = statusCode
        this.message = message
        this.success = false
        this.errors = errors
        this.data = null

        if(statck){
            this.stack = this.stack
        } else{
            Error.captureStackTrace(this, this.constructor)
            //Error.captureStackTrace(this, this.constructor)
        }
    }
}

export { ApiError }