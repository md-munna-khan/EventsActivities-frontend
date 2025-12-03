"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SSLService = void 0;
const axios_1 = __importDefault(require("axios"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const config_1 = __importDefault(require("../../../config"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
// fixed relative path
const sslPaymentInit = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const data = {
            store_id: config_1.default.sslcommerz.store_id,
            store_passwd: config_1.default.sslcommerz.store_passwd,
            total_amount: payload.amount,
            currency: "BDT",
            tran_id: payload.transactionId,
            success_url: `${config_1.default.sslcommerz.success_backend_url}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=success`,
            fail_url: `${config_1.default.sslcommerz.fail_backend_url}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=fail`,
            cancel_url: `${config_1.default.sslcommerz.cancel_backend_url}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=cancel`,
            ipn_url: (_a = config_1.default.sslcommerz.ipn_url) !== null && _a !== void 0 ? _a : undefined,
            shipping_method: "N/A",
            product_name: "Event",
            product_category: "Service",
            product_profile: "general",
            cus_name: payload.name,
            cus_email: payload.email,
            cus_add1: payload.address,
            cus_add2: "N/A",
            cus_city: "Dhaka",
            cus_state: "Dhaka",
            cus_postcode: "1000",
            cus_country: "Bangladesh",
            cus_phone: payload.phoneNumber,
            cus_fax: "01711111111",
            ship_name: "N/A",
            ship_add1: "N/A",
            ship_add2: "N/A",
            ship_city: "N/A",
            ship_state: "N/A",
            ship_postcode: 1000,
            ship_country: "N/A",
        };
        const response = yield (0, axios_1.default)({
            method: "POST",
            url: config_1.default.sslcommerz.payment_api,
            data: data,
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
        });
        return response.data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }
    catch (error) {
        console.log("Payment Error Occured", error);
        throw new ApiError_1.default(http_status_codes_1.default.BAD_REQUEST, error.message);
    }
});
exports.SSLService = {
    sslPaymentInit,
};
