import React from 'react';
import { getSingleEvent } from '@/services/host/hostService';
import { notFound } from 'next/navigation';
import EventDetailsClient from '../../../../../../components/modules/Host/EventDetailsClient';

interface EventDetailsPageProps {
    params: Promise<{ id: string }>;
}

const EventDetailsPage = async ({ params }: EventDetailsPageProps) => {
    const { id } = await params;
    
    const result = await getSingleEvent(id);

    if (!result.success || !result.data) {
        notFound();
    }

    return <EventDetailsClient event={result.data} />;
};

export default EventDetailsPage;

