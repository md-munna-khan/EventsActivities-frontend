



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
    password: z
        .string({ message: "Password is required" })
        .min(6, "Password must be at least 6 characters"),

    client: z.object({
        name: z
            .string({ message: "Name is required" })
            .min(2, "Name must be at least 2 characters")
            .trim(),

        email: z
            .string({ message: "Email is required" })
            .email("Invalid email format"),

        bio: z
            .string({ message: "Bio is required" })
            .min(5, "Bio must be at least 5 characters")
            .trim(),

        profilePhoto: z
            .string({ message: "Profile photo is required" })
            .optional(),

        contactNumber: z
            .string({ message: "Contact Number is required" })
            .regex(/^[+]?[0-9]{7,}$/, "Contact number must be valid"),

        location: z
            .string({ message: "Location is required" })
            .min(2, "Location must be at least 2 characters")
            .trim(),

        interests: z
            .array(InterestEnum, {
                message: "Interests must be valid",
            })
            .min(1, "At least one interest is required"),
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






