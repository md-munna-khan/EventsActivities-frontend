import MyBookingEvents from '@/components/modules/event/MyBookingEvents';
import { getUserBookings } from '@/services/events/eventService';
import React from 'react';

const MyBookingsPage = async () => {
    const res = await getUserBookings();
    const bookings = res?.data || [];

    return (
        <div>
         

            <MyBookingEvents bookings={bookings} />
        </div>
    );
};

export default MyBookingsPage;