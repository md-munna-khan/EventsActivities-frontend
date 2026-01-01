/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { notFound } from 'next/navigation';
import { getUserProfile, getUserEvents } from '@/services/user/profileService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, MapPin, Users, Star, Edit } from 'lucide-react';
import { formatDateTime } from '@/lib/formatters';

import { getInitials } from '@/lib/formatters';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getUserInfo } from '@/services/auth/getUserInfo';
import Image from 'next/image';

interface ProfilePageProps {
  params: Promise<{ id: string }>;
}

const ProfilePage = async ({ params }: ProfilePageProps) => {
  const { id } = await params;
  const currentUser = await getUserInfo();
  const isOwnProfile = currentUser?.id === id || currentUser?.client?.id === id || currentUser?.host?.id === id;

  const profileResult = await getUserProfile(id);
  if (!profileResult.success || !profileResult.data) {
    notFound();
  }

  const profile = profileResult.data;
  const user = profile.client || profile.host || profile.admin;

  // Fetch hosted and joined events
  const hostedEventsResult = await getUserEvents(id, "hosted");
  const joinedEventsResult = await getUserEvents(id, "joined");

  const hostedEvents = hostedEventsResult.success ? hostedEventsResult.data || [] : [];
  const joinedEvents = joinedEventsResult.success ? joinedEventsResult.data || [] : [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              <Avatar className="h-24 w-24 md:h-32 md:w-32">
                <AvatarImage src={user?.profilePhoto || undefined} alt={user?.name || "User"} />
                <AvatarFallback className="text-2xl">
                  {getInitials(user?.name || "U")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h1 className="text-3xl font-bold">{user?.name || "Unknown User"}</h1>
                    <p className="text-muted-foreground">{user?.email}</p>
                  </div>
                  {isOwnProfile && (
                    <Link href="/my-profile">
                      <Button variant="outline">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    </Link>
                  )}
                </div>
                {user?.bio && (
                  <p className="text-muted-foreground mt-2">{user.bio}</p>
                )}
                <div className="flex flex-wrap gap-2 mt-4">
                  {user?.location && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1" />
                      {user.location}
                    </div>
                  )}
                  {user?.contactNumber && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <span className="mr-1">📞</span>
                      {user.contactNumber}
                    </div>
                  )}
                  {user?.rating && (
                    <div className="flex items-center text-sm">
                      <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                      {user.rating.toFixed(1)}
                    </div>
                  )}
                </div>
                {user?.interests && Array.isArray(user.interests) && user.interests.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {user.interests.map((interest: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rating Summary */}
        {user?.rating && (
          <Card>
            <CardHeader>
              <CardTitle>Rating Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="text-4xl font-bold">{user.rating.toFixed(1)}</div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${
                        star <= Math.round(user.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                {user.totalRatings && (
                  <div className="text-muted-foreground">
                    ({user.totalRatings} {user.totalRatings === 1 ? "review" : "reviews"})
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Hosted Events */}
        {hostedEvents.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Hosted Events</CardTitle>
              <CardDescription>
                Events organized by {user?.name || "this user"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {hostedEvents.map((event: any) => (
                  <Link key={event.id} href={`/explore-events/${event.id}`}>
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                      {event.image && (
                        <div className="relative h-40 w-full">
                          <Image
                            src={event.image}
                            alt={event.title}
                            fill
                            className="object-cover rounded-t-lg"
                          />
                        </div>
                      )}
                      <CardHeader>
                        <CardTitle className="line-clamp-2 text-lg">{event.title}</CardTitle>
                        <CardDescription className="line-clamp-2">{event.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center text-muted-foreground">
                            <Calendar className="h-3 w-3 mr-2" />
                            {formatDateTime(event.date)}
                          </div>
                          <div className="flex items-center text-muted-foreground">
                            <MapPin className="h-3 w-3 mr-2" />
                            {event.location}
                          </div>
                          <div className="flex items-center text-muted-foreground">
                            <Users className="h-3 w-3 mr-2" />
                            {event.participantCount || 0} / {event.capacity}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Joined Events */}
        {joinedEvents.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Joined Events</CardTitle>
              <CardDescription>
                Events {user?.name || "this user"} has joined
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {joinedEvents.map((event: any) => (
                  <Link key={event.id} href={`/explore-events/${event.id}`}>
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                      {event.image && (
                        <div className="relative h-40 w-full">
                          <Image
                            src={event.image}
                            alt={event.title}
                            fill
                            className="object-cover rounded-t-lg"
                          />
                        </div>
                      )}
                      <CardHeader>
                        <CardTitle className="line-clamp-2 text-lg">{event.title}</CardTitle>
                        <CardDescription className="line-clamp-2">{event.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center text-muted-foreground">
                            <Calendar className="h-3 w-3 mr-2" />
                            {formatDateTime(event.date)}
                          </div>
                          <div className="flex items-center text-muted-foreground">
                            <MapPin className="h-3 w-3 mr-2" />
                            {event.location}
                          </div>
                          <div className="flex items-center text-muted-foreground">
                            <Users className="h-3 w-3 mr-2" />
                            {event.participantCount || 0} / {event.capacity}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {hostedEvents.length === 0 && joinedEvents.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                {isOwnProfile 
                  ? "You haven't hosted or joined any events yet."
                  : "This user hasn't hosted or joined any events yet."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;

