class InternalServerError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "InternalServerError";
    }
}

class PayloadNotValidException extends Error {
    constructor(message: string) {
        super(message);
        this.name = "PayloadNotValidException";
    }
}

class QueryStringParametersException extends Error {
    constructor(message: string) {
        super(message);
        this.name = "QueryStringParametersException";
    }
}

class GroupNotExistException extends Error {
    constructor(message: string) {
        super(message);
        this.name = "GroupNotExistException";
    }
}

export {
    QueryStringParametersException,
    InternalServerError,
    PayloadNotValidException,
    GroupNotExistException,
};

