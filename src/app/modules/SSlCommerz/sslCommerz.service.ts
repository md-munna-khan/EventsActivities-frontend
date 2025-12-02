import axios from "axios";
import httpStatus from "http-status-codes";

import config from "../../../config";

import ApiError from "../../errors/ApiError";
import { ISSLCommerz } from "./sslCommerz.interface";
// fixed relative path

const sslPaymentInit = async (payload: ISSLCommerz) => {
  try {
    const data = {
      store_id: config.sslcommerz.store_id,
      store_passwd: config.sslcommerz.store_passwd,
      total_amount: payload.amount,
      currency: "BDT",
      tran_id: payload.transactionId,
      success_url: `${config.sslcommerz.success_backend_url}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=success`,
      fail_url: `${config.sslcommerz.fail_backend_url}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=fail`,
      cancel_url: `${config.sslcommerz.cancel_backend_url}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=cancel`,
      ipn_url: config.sslcommerz.ipn_url ?? undefined,
      shipping_method:  "N/A",
      product_name: "Event",
      product_category:"Service",
      product_profile:  "general",
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

        const response = await axios({
            method: "POST",
            url: config.sslcommerz.payment_api,
            data: data,
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
        })

        return response.data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.log("Payment Error Occured", error);
        throw new ApiError (httpStatus.BAD_REQUEST, error.message)
    }
}

export const SSLService = {
  sslPaymentInit,
};