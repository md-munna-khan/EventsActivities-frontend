"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventValidation = exports.updateHostValidation = exports.createHostValidation = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
// Create Event Validation Schema
exports.createHostValidation = zod_1.z.object({
    title: zod_1.z.string().min(2, "Title must be at least 2 characters"),
    category: zod_1.z.nativeEnum(client_1.EventCategory, {
        message: "Invalid event category",
    }),
    description: zod_1.z.string().min(10, "Description must be at least 10 characters"),
    date: zod_1.z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format",
    }),
    location: zod_1.z.string().min(2, "Location is required"),
    joiningFee: zod_1.z.number().nonnegative("Joining fee must be 0 or more"),
    capacity: zod_1.z.number().int().positive("Capacity must be a positive number"),
    // status is optional because Prisma sets default PENDING
    status: zod_1.z.nativeEnum(client_1.EventStatus).optional(),
});
// Update Event Validation Schema
exports.updateHostValidation = zod_1.z.object({
    title: zod_1.z.string().min(2).optional(),
    category: zod_1.z.nativeEnum(client_1.EventCategory).optional(),
    description: zod_1.z.string().min(10).optional(),
    date: zod_1.z
        .string()
        .refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format",
    })
        .optional(),
    location: zod_1.z.string().optional(),
    joiningFee: zod_1.z.number().nonnegative().optional(),
    capacity: zod_1.z.number().int().positive().optional(),
    status: zod_1.z.nativeEnum(client_1.EventStatus).optional(),
});
exports.eventValidation = {
    createHostValidation: exports.createHostValidation,
    updateHostValidation: exports.updateHostValidation,
};
