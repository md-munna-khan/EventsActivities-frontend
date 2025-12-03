"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.catchAsync = void 0;
const config_1 = __importDefault(require("../config"));
const catchAsync = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
        if (config_1.default.node_env === "development") {
            console.log(err);
        }
        next(err);
    });
};
exports.catchAsync = catchAsync;
