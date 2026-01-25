class Apierror extends Error{
    constructor(
        statusCode,
        message="something went wrong",
        errors = [],
        stack = "",
    ){
        super(message)
        this.statusCode = statusCode
        this.data = null,
        message = message 
        this.success = false;
        this.errors = errors


        //if we have crash and we have a trace of it then it sore that  history where the crash has happened
        if(stack){
            this.stack = stack
        }
        // either wise if we dont have history trace then we have to trace it with fron start
        else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}
export {Apierror}