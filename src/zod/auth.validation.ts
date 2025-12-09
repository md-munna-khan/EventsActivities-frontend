



import { z } from "zod";



// Convert Prisma enum to Zod enum (optional if you're hardcoding strings)
const InterestEnum = z.enum([
    "MUSIC", "SPORTS", "HIKING", "TRAVEL", "COOKING", "READING", "DANCING",
    "GAMING", "TECHNOLOGY", "PHOTOGRAPHY", "ART", "MOVIES", "FITNESS", "YOGA",
    "CYCLING", "RUNNING", "CAMPING", "FISHING", "LANGUAGES", "FOOD",
    "VOLUNTEERING", "GARDENING", "WRITING", "FASHION", "BUSINESS", "FINANCE",
    "MEDITATION", "DIY", "PETS", "SOCIALIZING", "OTHER",
]);

export const createClientValidation = z.object({
    password: z.string({
        error: "Password is required",
    }),

    client: z.object({
        name: z.string({
            error: "Name is required!",
        }),

        email: z.string({
            error: "Email is required!",
        }),
         bio : z.string({
            error: "Bio is required!",
         }),

        profilePhoto: z.string({
            error: "Profile photo is required!",
        }).optional(),

        contactNumber: z.string({
            error: "Contact Number is required!",
        }),

        location: z.string({
            error: "Location is required!",
        }),

        interests: z
            .array(InterestEnum, {
                error: "Interests are required!",
            })
            .nonempty("At least one interest is required!"),
    }),
});



export const loginValidationZodSchema = z.object({
    email: z.email({
        message: "Email is required",
    }),
    password: z.string("Password is required").min(6, {
        error: "Password is required and must be at least 6 characters long",
    }).max(100, {
        error: "Password must be at most 100 characters long",
    }),
});

export const resetPasswordSchema = z
    .object({
        newPassword: z.string().min(6, "Password must be at least 6 characters"),
        confirmPassword: z
            .string()
            .min(6, "Password must be at least 6 characters"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });







