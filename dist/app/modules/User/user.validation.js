"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidation = exports.createClient = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const createAdmin = zod_1.z.object({
    password: zod_1.z.string({
        error: "Password is required",
    }),
    admin: zod_1.z.object({
        name: zod_1.z.string({
            error: "Name is required!",
        }),
        email: zod_1.z.string({
            error: "Email is required!",
        }),
        contactNumber: zod_1.z.string({
            error: "Contact Number is required!",
        }),
    }),
});
// Convert Prisma enum to Zod enum (optional if you're hardcoding strings)
const InterestEnum = zod_1.z.enum([
    "MUSIC", "SPORTS", "HIKING", "TRAVEL", "COOKING", "READING", "DANCING",
    "GAMING", "TECHNOLOGY", "PHOTOGRAPHY", "ART", "MOVIES", "FITNESS", "YOGA",
    "CYCLING", "RUNNING", "CAMPING", "FISHING", "LANGUAGES", "FOOD",
    "VOLUNTEERING", "GARDENING", "WRITING", "FASHION", "BUSINESS", "FINANCE",
    "MEDITATION", "DIY", "PETS", "SOCIALIZING", "OTHER",
]);
exports.createClient = zod_1.z.object({
    password: zod_1.z.string({
        error: "Password is required",
    }),
    client: zod_1.z.object({
        name: zod_1.z.string({
            error: "Name is required!",
        }),
        email: zod_1.z.string({
            error: "Email is required!",
        }),
        bio: zod_1.z.string({
            error: "Bio is required!",
        }),
        profilePhoto: zod_1.z.string({
            error: "Profile photo is required!",
        }).optional(),
        contactNumber: zod_1.z.string({
            error: "Contact Number is required!",
        }),
        location: zod_1.z.string({
            error: "Location is required!",
        }),
        interests: zod_1.z
            .array(InterestEnum, {
            error: "Interests are required!",
        })
            .nonempty("At least one interest is required!"),
    }),
});
const updateStatus = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum([client_1.UserStatus.ACTIVE, client_1.UserStatus.PENDING, client_1.UserStatus.DELETED, client_1.UserStatus.SUSPENDED, client_1.UserStatus.INACTIVE]),
    }),
});
exports.userValidation = {
    createAdmin,
    createClient: exports.createClient,
    updateStatus,
};
