/* eslint-disable @typescript-eslint/no-explicit-any */

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Star, 
  CheckCircle2,
  ArrowRight, 
 Sparkles ,
 Trophy,
 Heart ,
 Globe ,
  TrendingUp,
  Play,
  Clock ,
  Shield,
 
  Zap
} from 'lucide-react';
import { getAllHosts, getEvents } from '@/services/host/hostService';
import { homeMeta } from '@/services/meta/meta.service';
import Image from 'next/image';


export const HomeMeta = async () => {
 
  const metaResult = await homeMeta();

  const usersCount = metaResult?.data?.totalUsers ?? 0;
  const hostsCount = metaResult?.data?.totalHosts ?? 0;
  const eventsCount = metaResult?.data?.totalEvents ?? 0;


  const eventsResult = await getEvents({ status: 'OPEN', limit: 6, page: 1 });
  const featuredEvents = eventsResult.success && eventsResult.data ? eventsResult.data.slice(0, 6) : [];


  const topHostsResult = await getAllHosts();
  const topHosts = Array.isArray(topHostsResult?.data) ? topHostsResult.data : [];
  topHosts.sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0));
  const topHostsLimited = topHosts.slice(0, 3);

  return (
    <main className="flex flex-col ">
     
      <section className="relative bg-linear-to-br from-primary/10 via-background to-primary/5 py-20 px-4">
        <div className=" mx-auto max-w-7xl">
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

    
      <section className="py-14 px-4 bg-background relative overflow-hidden">
      
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-px bg-linear-to-r from-transparent via-border to-transparent hidden md:block" />

        <div className="mx-auto max-w-7xl relative">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-2xl md:text-4xl font-black tracking-tighter">
              Your journey starts in <span className="text-primary">three steps</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We have simplified the process so you can focus on making memories, not managing logistics.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                title: "Create Profile",
                desc: "Sign up in seconds. Tell us what you love so we can suggest the perfect local experiences.",
                icon: <Users className="h-6 w-6" />,
              },
              {
                step: "02",
                title: "Browse & Book",
                desc: "Explore curated events near you. Secure your spot with our seamless, protected booking system.",
                icon: <Calendar className="h-6 w-6" />,
              },
              {
                step: "03",
                title: "Show Up & Enjoy",
                desc: "Meet amazing people and share your passion. We handle the rest so you can enjoy the moment.",
                icon: <Sparkles className="h-6 w-6" />,
              },
            ].map((item, i) => (
              <div key={i} className="relative group">
                <div className="flex flex-col items-center text-center space-y-6">
                 
                  <div className="relative">
                    <div className="h-20 w-20 rounded-3xl bg-muted flex items-center justify-center border-2 border-transparent group-hover:border-primary group-hover:bg-primary/5 transition-all duration-300 rotate-3 group-hover:rotate-0">
                      <div className="text-primary">
                        {item.icon}
                      </div>
                    </div>
                    <div className="absolute -top-3 -right-3 h-8 w-8 rounded-full bg-primary text-primary-foreground text-xs font-black flex items-center justify-center shadow-lg">
                      {item.step}
                    </div>
                  </div>

            
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold tracking-tight">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>

             
                {i < 2 && (
                  <div className="hidden lg:block absolute top-10 -right-6 translate-x-1/2">
                    <ArrowRight className="h-6 w-6 text-muted-foreground/30" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 px-4 bg-muted/30">
        <div className="mx-auto max-w-7xl">
        
          <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
            <div className="space-y-3 text-center md:text-left">
              <h2 className="text-2xl md:text-4xl font-black tracking-tighter">
                Popular <span className="text-primary">Experiences</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-md">
                Don&apos;t miss out on the most anticipated events happening in your area right now.
              </p>
            </div>
            <Link href="/explore-events">
              <Button size="lg" variant="ghost" className="rounded-full font-bold text-primary hover:bg-primary/5 hover:text-primary transition-all group">
                Explore All Events 
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          {featuredEvents.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredEvents.map((event: any) => (
                <Card key={event.id} className="group overflow-hidden border-none shadow-md hover:shadow-2xl  transition-all duration-500 pt-0  bg-card">
              
                  <div className="relative h-64 w-full overflow-hidden">
                    <Image
                      src={event.image || '/api/placeholder/600/400'}
                      alt={event.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                   
                    <div className="absolute top-4 left-4">
                      <div className="bg-background/90 backdrop-blur-md px-3 py-1  text-[10px] font-black uppercase tracking-widest text-primary shadow-sm">
                        {event.category || 'Featured'}
                      </div>
                    </div>
                  </div>

                  <CardHeader className="space-y-2 pb-4">
                    <CardTitle className="text-2xl font-bold leading-tight line-clamp-1 group-hover:text-primary transition-colors">
                      {event.title}
                    </CardTitle>
                    <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm font-medium text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-primary" />
                        {new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-primary" />
                        {event.location}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                 
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold uppercase tracking-tighter">
                        <span className="text-muted-foreground">Availability</span>
                        <span className={event.participantCount >= event.capacity ? 'text-destructive' : 'text-primary'}>
                          {event.participantCount || 0} / {event.capacity} Joined
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-primary h-full rounded-full transition-all duration-1000" 
                          style={{ width: `${Math.min(((event.participantCount || 0) / (event.capacity || 1)) * 100, 100)}%` }} 
                        />
                      </div>
                    </div>

                    <Link href={`/explore-events/${event.id}`}>
                      <Button className="w-full h-12 rounded-xl font-bold text-base shadow-lg shadow-primary/10 group-hover:shadow-primary/20 transition-all">
                        Secure Your Spot
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-14rounded-[3rem] border-2 border-dashed border-muted bg-muted/10">
              <Sparkles className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-xl font-medium text-muted-foreground">
                No events found today. Check back soon for new experiences!
              </p>
            </div>
          )}
        </div>
      </section>

  
      <section className="py-14 px-4 bg-background">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6">
            <div className="text-center md:text-left space-y-2">
              <h2 className="text-2xl md:text-4xl font-black tracking-tighter">
                Explore by <span className="text-primary">Interest</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Find exactly what you&apos;re looking for in our curated categories
              </p>
            </div>
            <Link href="/explore-events">
              <Button variant="outline" className="rounded-full border-2 font-bold px-6">
                Browse All Categories
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[
              { name: 'Music', icon: <Zap className="h-5 w-5" />, color: 'bg-blue-500/10 text-blue-600' },
              { name: 'Sports', icon: <Trophy className="h-5 w-5" />, color: 'bg-orange-500/10 text-orange-600' },
              { name: 'Food', icon: <Heart className="h-5 w-5" />, color: 'bg-red-500/10 text-red-600' },
              { name: 'Technology', icon: <Sparkles className="h-5 w-5" />, color: 'bg-purple-500/10 text-purple-600' },
              { name: 'Arts', icon: <Sparkles className="h-5 w-5" />, color: 'bg-pink-500/10 text-pink-600' },
              { name: 'Travel', icon: <MapPin className="h-5 w-5" />, color: 'bg-emerald-500/10 text-emerald-600' },
              { name: 'Fitness', icon: <TrendingUp className="h-5 w-5" />, color: 'bg-cyan-500/10 text-cyan-600' },
              { name: 'Business', icon: <Shield className="h-5 w-5" />, color: 'bg-slate-500/10 text-slate-600' },
              { name: 'Education', icon: <Globe className="h-5 w-5" />, color: 'bg-indigo-500/10 text-indigo-600' },
              { name: 'Entertainment', icon: <Play className="h-5 w-5" />, color: 'bg-yellow-500/10 text-yellow-600' },
              { name: 'Social', icon: <Users className="h-5 w-5" />, color: 'bg-teal-500/10 text-teal-600' },
              { name: 'Wellness', icon: <Clock className="h-5 w-5" />, color: 'bg-green-500/10 text-green-600' },
            ].map((cat) => (
              <Link 
                key={cat.name} 
                href={`/explore-events?category=${cat.name}`}
                className="group relative flex flex-col items-center p-8 rounded-[2rem] border bg-card transition-all duration-300 hover:border-primary hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2"
              >
                <div className={`mb-4 p-4 rounded-2xl ${cat.color} group-hover:scale-110 transition-transform duration-300`}>
                  {cat.icon}
                </div>
                <p className="font-bold tracking-tight text-center group-hover:text-primary transition-colors">
                  {cat.name}
                </p>
             
                <div className="absolute bottom-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="h-1 w-4 rounded-full bg-primary" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 px-4 bg-muted/30 relative overflow-hidden">
  
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary/5 blur-[100px]" />
        
        <div className="mx-auto max-w-7xl relative">
          <div className="flex flex-col lg:flex-row items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl space-y-4 text-center lg:text-left">
              <h2 className="text-2xl md:text-4xl font-black tracking-tighter leading-tight">
                Designed for <br className="hidden md:block" />
                <span className="text-primary">seamless</span> connections.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We’ve built a platform that removes the friction from event planning, so you can focus on the experience itself.
              </p>
            </div>
            <div className="hidden lg:block h-px flex-1 bg-border mx-12 mb-6" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                title: "Secure & Safe",
                icon: <Shield className="h-6 w-6" />,
                desc: "Every event is manually verified. We use industry-leading authentication to keep your data protected.",
                bg: "hover:bg-blue-500/5",
                iconColor: "text-blue-600"
              },
              {
                title: "Easy to Use",
                icon: <Zap className="h-6 w-6" />,
                desc: "A focus on minimalist design means you can find, book, and join an event in under sixty seconds.",
                bg: "hover:bg-amber-500/5",
                iconColor: "text-amber-600"
              },
              {
                title: "Community Driven",
                icon: <Users className="h-6 w-6" />,
                desc: "We don't just list events; we build sub-communities. Meet people who share your specific niche passions.",
                bg: "hover:bg-purple-500/5",
                iconColor: "text-purple-600"
              },
              {
                title: "Growing Network",
                icon: <TrendingUp className="h-6 w-6" />,
                desc: "With hundreds of new hosts joining weekly, there is always something new to explore in your city.",
                bg: "hover:bg-emerald-500/5",
                iconColor: "text-emerald-600"
              },
            ].map((feature, i) => (
              <div 
                key={i} 
                className={`group p-8 rounded-[2rem] bg-background border border-border/50 transition-all duration-300 ${feature.bg} hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5`}
              >
                <div className={`mb-6 h-12 w-12 rounded-2xl flex items-center justify-center bg-muted group-hover:bg-background transition-colors shadow-sm`}>
                  <div className={`${feature.iconColor} group-hover:scale-110 transition-transform`}>
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold tracking-tight mb-3">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

 
      <section className="py-14 px-4 bg-background overflow-hidden">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-2xl md:text-4xl font-black tracking-tighter">
              Meet Our <span className="text-primary">Elite Hosts</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our community is led by passionate experts dedicated to creating safe, engaging, and unforgettable experiences.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {topHostsLimited.length > 0 ? (
              topHostsLimited.map((host: any) => (
                <div 
                  key={host.id} 
                  className="group relative flex flex-col items-center p-8 rounded-[2.5rem] bg-card border transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1"
                >
               
                  <div className="relative mb-6">
                    <div className="h-28 w-28 rounded-full p-1 border-2 border-dashed border-primary/30 group-hover:border-solid group-hover:border-primary transition-all duration-500">
                      <div className="h-full w-full rounded-full bg-muted overflow-hidden relative">
                        {host.profilePhoto ? (
                          <Image 
                            src={host.profilePhoto} 
                            alt={host.name || 'Host'} 
                            fill 
                            className="object-cover group-hover:scale-110 transition-transform duration-500" 
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full w-full">
                            <Users className="h-10 w-10 text-primary/40" />
                          </div>
                        )}
                      </div>
                    </div>
                 
                    <div className="absolute bottom-1 right-1 bg-background rounded-full p-1 shadow-lg">
                      <div className="bg-primary rounded-full p-1">
                        <CheckCircle2 className="h-3 w-3 text-primary-foreground" />
                      </div>
                    </div>
                  </div>

                  <div className="text-center space-y-3">
                    <h3 className="text-2xl font-bold tracking-tight">
                      {host.name || host.email?.split('@')[0] || 'Top Host'}
                    </h3>
                    
             
                    <div className="flex items-center justify-center gap-1">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star
                          key={idx}
                          className={`h-4 w-4 ${
                            idx < (host.rating ?? 5) 
                              ? 'fill-yellow-400 text-yellow-400' 
                              : 'text-muted-foreground/20'
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-xs font-bold text-muted-foreground">
                        ({host.rating ?? '5.0'})
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed ">
                      {host.bio || "Specialist in organizing immersive local community events and workshops."}
                    </p>

                    <div className="pt-4">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 text-primary text-xs font-black uppercase tracking-widest">
       {host.completedEventsCount ?? Math.floor(Math.random() * 20 + 5)} Successful Events
      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
             
              [1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse flex flex-col items-center p-8 rounded-[2.5rem] bg-muted/20 border border-dashed">
                  <div className="h-28 w-28 rounded-full bg-muted mb-6" />
                  <div className="h-6 w-32 bg-muted rounded mb-3" />
                  <div className="h-4 w-48 bg-muted rounded" />
                </div>
              ))
            )}
          </div>
          
      
        </div>
      </section>

   
      <section className="py-14 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center mb-16 space-y-4">
            <h2 className="text-2xl md:text-4xl font-black tracking-tighter">
              Stories from our <span className="text-primary">Community</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Real feedback from the hosts and participants who make our platform vibrant and diverse.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Event Participant",
                content: "I've met so many amazing people through the events on this platform. The community is welcoming and the events are consistently well-organized!",
                avatar: "SJ",
                color: "bg-blue-500"
              },
              {
                name: "Michael Chen",
                role: "Event Host",
                content: "As a host, this platform has made it incredibly easy to organize and manage my events. The payment security and support team are top-notch.",
                avatar: "MC",
                color: "bg-orange-500"
              },
              {
                name: "Emily Rodriguez",
                role: "Event Participant",
                content: "The variety of events is amazing! From tech meetups to cooking classes, there's literally something for everyone. Highly recommend to anyone new in town.",
                avatar: "ER",
                color: "bg-purple-500"
              }
            ].map((testimonial, i) => (
              <div 
                key={i} 
                className="relative bg-card p-8 rounded-[2.5rem] border border-border/50 shadow-sm hover:shadow-xl transition-all duration-300 group"
              >
             
                <span className="absolute top-6 left-8 text-8xl text-primary/5 font-serif select-none group-hover:text-primary/10 transition-colors">
                  “
                </span>

                <div className="relative space-y-6">
              
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

          
                  <p className="text-lg leading-relaxed font-medium tracking-tight">
                    &quot;{testimonial.content}&quot;
                  </p>

             
                  <div className="flex items-center gap-4 pt-4">
                    <div className={`h-12 w-12 rounded-2xl ${testimonial.color} flex items-center justify-center text-white font-bold shadow-lg shadow-black/5`}>
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-bold leading-none mb-1">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

    </main>
  );
};

export default HomeMeta;