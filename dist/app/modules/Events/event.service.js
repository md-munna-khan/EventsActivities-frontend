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
exports.eventsService = exports.getMyBookings = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const config_1 = __importDefault(require("../../../config"));
const jwtHelper_1 = require("../../../helpers/jwtHelper");
const client_1 = require("@prisma/client");
const sslCommerz_service_1 = require("../SSlCommerz/sslCommerz.service");
const getTransactionId = () => {
    return `tran_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};
const joinEvent = (eventId, user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // user can be either decoded token (req.user) or object with accessToken
        let email;
        if (user && typeof user.email === 'string') {
            email = user.email;
        }
        else if (user && typeof user.accessToken === 'string') {
            const decodedData = jwtHelper_1.jwtHelper.verifyToken(user.accessToken, config_1.default.jwt.jwt_secret);
            email = decodedData.email;
        }
        if (!email)
            throw new Error('Unauthorized: missing user email');
        // Find the client linked to this user
        const client = yield prisma_1.default.client.findUnique({ where: { email } });
        if (!client)
            throw new Error("Unauthorized: Client profile not found");
        const clientId = client.id;
        // Use a transaction callback so DB changes roll back if SSL init fails
        const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            // re-fetch event inside transaction and include participants count
            const event = yield tx.event.findUnique({
                where: { id: eventId },
                include: { participants: true },
            });
            if (!event)
                throw new Error("Event not found");
            if (event.status !== client_1.EventStatus.OPEN)
                throw new Error("Cannot join an inactive event");
            // prevent duplicate join
            const alreadyJoined = yield tx.eventParticipant.findFirst({
                where: { eventId, clientId },
            });
            if (alreadyJoined)
                throw new Error("You have already joined this event");
            // check capacity
            if (event.capacity <= 0)
                throw new Error("Event is full");
            const amount = event.joiningFee;
            const tranId = getTransactionId();
            // create payment (PENDING)
            const payment = yield tx.payment.create({
                data: {
                    amount,
                    eventId,
                    clientId,
                    hostId: event.hostId,
                    tranId,
                    currency: "BDT",
                    status: client_1.PaymentStatus.PENDING,
                },
            });
            // create participant with PENDING status and link payment
            const participant = yield tx.eventParticipant.create({
                data: {
                    eventId,
                    clientId,
                    paymentId: payment.id,
                    participantStatus: client_1.ParticipantStatus.PENDING,
                },
            });
            // decrement capacity and possibly set event status to FULL
            const newCapacity = event.capacity - 1;
            const newStatus = newCapacity <= 0 ? client_1.EventStatus.FULL : event.status;
            yield tx.event.update({
                where: { id: eventId },
                data: { capacity: newCapacity, status: newStatus },
            });
            // prepare ssl payload using client info (use fields you have on client)
            const sslPayload = {
                address: (_a = client.location) !== null && _a !== void 0 ? _a : "N/A",
                email: client.email,
                phoneNumber: (_b = client.contactNumber) !== null && _b !== void 0 ? _b : "N/A",
                name: client.name,
                amount,
                transactionId: tranId,
                success_url: `${config_1.default.sslcommerz.success_backend_url}`, // server endpoints
                fail_url: `${config_1.default.sslcommerz.fail_backend_url}`,
                cancel_url: `${config_1.default.sslcommerz.cancel_backend_url}`,
                ipn_url: `${config_1.default.sslcommerz.ipn_url}`,
            };
            // initiate SSLCommerz payment (external). If this throws, transaction will rollback.
            const sslResponse = yield sslCommerz_service_1.SSLService.sslPaymentInit(sslPayload);
            return {
                paymentUrl: sslResponse.GatewayPageURL,
                paymentId: payment.id,
                participantId: participant.id,
                eventId: event.id,
                tranId,
            };
        })); // end transaction
        return {
            paymentUrl: result.paymentUrl,
            paymentId: result.paymentId,
            participantId: result.participantId,
            eventId: result.eventId,
            transactionId: result.tranId,
        };
    }
    catch (error) {
        console.error("joinEvent Error:", error.message);
        throw new Error(error.message || "Something went wrong joining event");
    }
});
const leaveEvent = (eventId, user) => __awaiter(void 0, void 0, void 0, function* () {
    // Extract client email
    let clientEmail;
    if (user === null || user === void 0 ? void 0 : user.email) {
        clientEmail = user.email;
    }
    else if (user === null || user === void 0 ? void 0 : user.accessToken) {
        const decodedData = jwtHelper_1.jwtHelper.verifyToken(user.accessToken, config_1.default.jwt.jwt_secret);
        clientEmail = decodedData.email;
    }
    if (!clientEmail)
        throw new Error("Unable to identify user");
    // Find client by email
    const client = yield prisma_1.default.client.findUnique({ where: { email: clientEmail } });
    if (!client)
        throw new Error("Client profile not found");
    const clientId = client.id;
    const event = yield prisma_1.default.event.findUnique({
        where: { id: eventId },
        include: { participants: true },
    });
    const existing = yield prisma_1.default.eventParticipant.findFirst({
        where: { eventId, clientId },
    });
    if (!existing)
        throw new Error("You are not joined to this event");
    // delete participant and restore capacity (no transaction for simplicity but you can wrap if needed)
    yield prisma_1.default.eventParticipant.delete({ where: { id: existing.id } });
    if (event) {
        const restoredCapacity = event.capacity + 1;
        const newStatus = event.status === client_1.EventStatus.FULL ? client_1.EventStatus.OPEN : event.status;
        yield prisma_1.default.event.update({
            where: { id: eventId },
            data: { capacity: restoredCapacity, status: newStatus },
        });
    }
    return { id: existing.id };
});
const getMyBookings = (user, eventId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let clientEmail;
        // Extract client email from user object or JWT
        if (user === null || user === void 0 ? void 0 : user.email) {
            clientEmail = user.email;
        }
        else if (user === null || user === void 0 ? void 0 : user.accessToken) {
            const decodedData = jwtHelper_1.jwtHelper.verifyToken(user.accessToken, config_1.default.jwt.jwt_secret);
            clientEmail = decodedData.email;
        }
        if (!clientEmail) {
            throw new Error("Unable to identify user");
        }
        // Build Prisma where condition
        const whereCondition = {
            client: { email: clientEmail } // filter by email
        };
        if (eventId) {
            whereCondition.eventId = eventId;
        }
        // Fetch bookings with all details
        const bookings = yield prisma_1.default.eventParticipant.findMany({
            where: whereCondition,
            include: {
                event: {
                    include: {
                        host: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                profilePhoto: true,
                                rating: true,
                            }
                        }
                    }
                },
                client: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        profilePhoto: true
                    }
                },
                payment: {
                    select: {
                        id: true,
                        amount: true,
                        status: true,
                        tranId: true,
                        createdAt: true
                    }
                },
            },
            orderBy: { createdAt: 'desc' }
        });
        return bookings;
    }
    catch (error) {
        console.error("Error fetching bookings:", error);
        throw new Error("Failed to fetch bookings");
    }
});
exports.getMyBookings = getMyBookings;
exports.eventsService = {
    joinEvent,
    leaveEvent,
    getMyBookings: exports.getMyBookings,
};
