"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const http_status_1 = __importDefault(require("http-status"));
const globalErrorHandler = (err, req, res, next) => {
    console.error(err);
    let statusCode = err.statusCode || http_status_1.default.INTERNAL_SERVER_ERROR;
    let success = false;
    let message = err.message || "Something went wrong!";
    let error = err;
    if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
            case "P2000":
                message = "Value too long for column";
                statusCode = http_status_1.default.BAD_REQUEST;
                error = err.meta;
                break;
            case "P2002":
                message = "Unique constraint failed (duplicate key)";
                statusCode = http_status_1.default.CONFLICT;
                error = err.meta;
                break;
            case "P2003":
                message = "Foreign key constraint failed";
                statusCode = http_status_1.default.BAD_REQUEST;
                error = err.meta;
                break;
            case "P2004":
                message = "A constraint failed";
                statusCode = http_status_1.default.BAD_REQUEST;
                error = err.meta;
                break;
            case "P2005":
                message = "Invalid type for field";
                statusCode = http_status_1.default.BAD_REQUEST;
                error = err.meta;
                break;
            case "P2006":
                message = "Field required error";
                statusCode = http_status_1.default.BAD_REQUEST;
                error = err.meta;
                break;
            case "P2007":
                message = "Data validation failed";
                statusCode = http_status_1.default.BAD_REQUEST;
                error = err.meta;
                break;
            case "P2008":
                message = "Failed to parse value";
                statusCode = http_status_1.default.BAD_REQUEST;
                error = err.meta;
                break;
            case "P2009":
                message = "Invalid query";
                statusCode = http_status_1.default.BAD_REQUEST;
                error = err.meta;
                break;
            case "P2010":
                message = "Missing required argument";
                statusCode = http_status_1.default.BAD_REQUEST;
                error = err.meta;
                break;
            case "P1000":
                message = "Authentication failed against database server";
                statusCode = http_status_1.default.BAD_GATEWAY;
                error = err.meta;
                break;
            default:
                message = "Prisma error occurred";
                statusCode = http_status_1.default.BAD_REQUEST;
                error = err.meta || err.message;
                break;
        }
    }
    else if (err instanceof client_1.Prisma.PrismaClientValidationError) {
        message = "Validation error: " + err.message;
        statusCode = http_status_1.default.BAD_REQUEST;
        error = err.message;
    }
    else if (err instanceof client_1.Prisma.PrismaClientUnknownRequestError) {
        message = "Unknown Prisma error occurred";
        statusCode = http_status_1.default.INTERNAL_SERVER_ERROR;
        error = err.message;
    }
    else if (err instanceof client_1.Prisma.PrismaClientInitializationError) {
        message = "Prisma client failed to initialize";
        statusCode = http_status_1.default.INTERNAL_SERVER_ERROR;
        error = err.message;
    }
    else if (!(err instanceof client_1.Prisma.PrismaClientKnownRequestError)) {
        message = err.message || message;
        statusCode = err.statusCode || statusCode;
        error = err;
    }
    return res.status(statusCode).json({
        success,
        message,
        error,
    });
};
exports.default = globalErrorHandler;
