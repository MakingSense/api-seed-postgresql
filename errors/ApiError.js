// Create a new object, that prototypically inherits from the Error constructor.
var ApiError = function (error, req, parentErr) {
	this.name = 'ApiError';
	this.status = error.status;
	this.message = error.message;

	if (parentErr) {
		this.parentErr = parentErr;
	}
	if (req) {
		this.method = req.method;
		this.ip = req.ip;
		this.url = req.url;
		this.originalUrl = req.originalUrl;
	}

	this.setReq = function(req){
		this.method = req.method;
		this.ip = req.ip;
		this.url = req.url;
		this.originalUrl = req.originalUrl;
	}

	this.stack = new Error().stack;
	//TODO - Add inheritance of a parent error (Type Error or String)
};

ApiError.prototype = Object.create(Error.prototype);
ApiError.prototype.constructor = ApiError;

module.exports = ApiError;
