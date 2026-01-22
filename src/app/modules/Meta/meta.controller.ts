import { Request, Response } from "express";



import httpStatus from "http-status";
import { MetaService } from "./meta.service";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";



const fetchDashboardMetaData = catchAsync(async (req: Request, res: Response) => {

    const user = (req as any).user || req.cookies;
    const result = await MetaService.fetchDashboardMetaData(user);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Meta data retrieval successfully!",
        data: result
    })
});


const fetchHomeMetaData = catchAsync(async (req: Request, res: Response) => {
  const result = await MetaService.fetchHomeMetaData();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Home meta data retrieval successfully!",
    data: result,
  });
});

export const MetaController = {
  fetchDashboardMetaData,
  fetchHomeMetaData,
};