import React from 'react';
import { getSingleEvent } from '@/services/host/hostService';
import { notFound } from 'next/navigation';
import EventDetailsClient from '@/components/modules/event/EventDetailsClient';
import { getUserInfo } from '@/services/auth/getUserInfo';



interface EventDetailsPageProps {
    params: Promise<{ id: string }>;
}

const EventDetailsPage = async ({ params }: EventDetailsPageProps) => {
    const { id } = await params;
    
    const result = await getSingleEvent(id);

    if (!result.success || !result.data) {
        notFound();
    }

   
    const userInfo = await getUserInfo();
    const currentUserId = userInfo?.id || userInfo?.host?.id || null;

    return <EventDetailsClient event={result.data} currentUserId={currentUserId} />;
};

export default EventDetailsPage;

