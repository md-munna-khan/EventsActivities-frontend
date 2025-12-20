/* eslint-disable @typescript-eslint/no-explicit-any */

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Star, 
  ArrowRight, 
 
  TrendingUp,
  Shield,
 
  Zap
} from 'lucide-react';
import { getEvents } from '@/services/host/hostService';
import Image from 'next/image';
import { getAllUsers } from '@/services/user/userService';

const HomePage = async () => {
  // Fetch counts
  const usersResult = await getAllUsers({}, { page: 1, limit: 1 });
  const hostsResult = await getAllUsers({ role: 'HOST' }, { page: 1, limit: 1 });

  const usersCount = usersResult?.meta?.total ?? (Array.isArray(usersResult?.data) ? usersResult.data.length : 0);
  const hostsCount = hostsResult?.meta?.total ?? (Array.isArray(hostsResult?.data) ? hostsResult.data.length : 0);

  // Fetch featured events
  const eventsResult = await getEvents({
    status: 'OPEN',
    limit: 6,
    page: 1,
  });
  const eventsCountResult = await getEvents({ page: 1, limit: 1 });
  const eventsCount = eventsCountResult?.meta?.total ?? (Array.isArray(eventsCountResult?.data) ? eventsCountResult.data.length : 0);
  // Fetch top-rated hosts (limit 3)
  const topHostsResult = await getAllUsers({ role: 'HOST' }, { page: 1, limit: 3, sortBy: 'rating', sortOrder: 'desc' });
  const topHosts = Array.isArray(topHostsResult?.data) ? topHostsResult.data : [];
  const featuredEvents = eventsResult.success && eventsResult.data ? eventsResult.data.slice(0, 6) : [];

  return (
    <main className="flex flex-col ">
      {/* Hero Section */}
      <section className="relative bg-linear-to-br from-primary/10 via-background to-primary/5 py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                Discover Amazing
                <span className="text-primary"> Events & Activities</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Connect with like-minded people, explore new interests, and create unforgettable memories. 
                Join events or become a host and share your passion with the world.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/explore-events">
                  <Button size="lg" className="text-lg px-8">
                    Find Activities
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="lg" variant="outline" className="text-lg px-8">
                    Create Event
                  </Button>
                </Link>
              </div>

              {/* Stats row */}
              <div className="flex items-center gap-4 mt-6">
                <div className="flex items-center gap-3 bg-background/80 p-3 rounded-lg shadow-sm">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{usersCount}</div>
                    <div className="text-sm text-muted-foreground">Users</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-background/80 p-3 rounded-lg shadow-sm">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{hostsCount}</div>
                    <div className="text-sm text-muted-foreground">Hosts</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-background/80 p-3 rounded-lg shadow-sm">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{eventsCount}</div>
                    <div className="text-sm text-muted-foreground">Events</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="h-32 w-32 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground">
              Getting started is easy. Follow these simple steps to begin your journey.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <CardTitle>Sign Up</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Create your free account in minutes. Choose your interests and start exploring.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <CardTitle>Browse Events</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Discover events near you or search by category, date, or location.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <CardTitle>Join & Enjoy</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Join events that interest you, meet new people, and create amazing memories.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured/Popular Events Section */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-4">Popular Events</h2>
              <p className="text-xl text-muted-foreground">
                Discover trending events happening near you
              </p>
            </div>
            <Link href="/explore-events">
              <Button variant="outline">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          {featuredEvents.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredEvents.map((event: any) => (
                <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {event.image && (
                    <div className="relative h-48 w-full">
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{event.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{event.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-2" />
                        {new Date(event.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-2" />
                        {event.location}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="h-4 w-4 mr-2" />
                        {event.participantCount || 0} / {event.capacity} participants
                      </div>
                    </div>
                    <Link href={`/explore-events/${event.id}`}>
                      <Button className="w-full">View Details</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No events available at the moment. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Event Categories Section */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Event Categories</h2>
            <p className="text-xl text-muted-foreground">
              Explore events by your interests
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              'Music', 'Sports', 'Food', 'Technology', 'Arts', 'Travel',
              'Fitness', 'Business', 'Education', 'Entertainment', 'Social', 'Wellness'
            ].map((category) => (
              <Link key={category} href={`/explore-events?category=${category}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer text-center p-4">
                  <CardContent className="p-0">
                    <p className="font-semibold">{category}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Why Choose Us</h2>
            <p className="text-xl text-muted-foreground">
              We make it easy to discover and create amazing experiences
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <Shield className="h-10 w-10 text-primary mb-4" />
                <CardTitle>Secure & Safe</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  All events are verified and participants are authenticated for your safety.
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Zap className="h-10 w-10 text-primary mb-4" />
                <CardTitle>Easy to Use</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Simple, intuitive interface that makes finding and joining events effortless.
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Users className="h-10 w-10 text-primary mb-4" />
                <CardTitle>Community Driven</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Connect with like-minded people and build lasting friendships.
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <TrendingUp className="h-10 w-10 text-primary mb-4" />
                <CardTitle>Growing Network</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Join thousands of events happening every day in your area.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Top-Rated Hosts Section */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Top-Rated Hosts</h2>
            <p className="text-xl text-muted-foreground">
              Meet our community of amazing event organizers
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {topHosts.length > 0 ? (
              topHosts.map((host: any) => (
                <Card key={host.id} className="text-center">
                  <CardHeader>
                    <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                      {host.profilePhoto ? (
                        <Image src={host.profilePhoto} alt={host.name || host.email} width={80} height={80} className="object-cover" />
                      ) : (
                        <Users className="h-10 w-10 text-primary" />
                      )}
                    </div>
                    <CardTitle>{host.name || host.email || 'Host'}</CardTitle>
                    <div className="flex items-center justify-center gap-1 mt-2">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star
                          key={idx}
                          className={`h-4 w-4 ${idx < (host.rating ?? 0) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
                        />
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      {host.bio || `${host.completedEventsCount ?? 0} successful events`}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))
            ) : (
              [1, 2, 3].map((i) => (
                <Card key={i} className="text-center">
                  <CardHeader>
                    <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-10 w-10 text-primary" />
                    </div>
                    <CardTitle>Host {i}</CardTitle>
                    <div className="flex items-center justify-center gap-1 mt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Experienced event organizer with {10 + i * 5} successful events
                    </CardDescription>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Testimonials/Reviews Section */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">What People Say</h2>
            <p className="text-xl text-muted-foreground">
              Hear from our community members
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Sarah Johnson",
                role: "Event Participant",
                content: "I've met so many amazing people through the events on this platform. The community is welcoming and the events are well-organized!",
                rating: 5
              },
              {
                name: "Michael Chen",
                role: "Event Host",
                content: "As a host, this platform has made it incredibly easy to organize and manage my events. The support team is always helpful.",
                rating: 5
              },
              {
                name: "Emily Rodriguez",
                role: "Event Participant",
                content: "The variety of events is amazing! From tech meetups to cooking classes, there's something for everyone. Highly recommend!",
                rating: 5
              }
            ].map((testimonial, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="flex items-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardDescription>{testimonial.content}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {/* <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of people discovering and creating amazing events every day.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/register">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Sign Up Now
              </Button>
            </Link>
            <Link href="/explore-events">
              <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
                Explore Events
              </Button>
            </Link>
          </div>
        </div>
      </section> */}
    </main>
  );
};

export default HomePage;
