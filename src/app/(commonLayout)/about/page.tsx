"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Sparkles, CalendarCheck, Trophy } from "lucide-react";

const AboutPage = () => {
    return (
        <div className="min-h-screen bg-linear-to-b from-background via-background to-muted/30">
            {/* Hero */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 -z-10 opacity-30 blur-2xl">
                    <div className="absolute left-10 top-10 h-64 w-64 rounded-full bg-primary/30" />
                    <div className="absolute right-10 bottom-10 h-64 w-64 rounded-full bg-accent/30" />
                </div>
                <div className="max-w-7xl mx-auto px-6 pt-16 pb-8 text-center">
                    <h1 className="text-3xl md:text-5xl font-black tracking-tight">
                        We craft experiences that bring people together
                    </h1>
                    <p className="mt-4 text-muted-foreground text-sm md:text-base">
                        From intimate meetups to large-scale festivals, our platform helps hosts and clients connect, plan, and enjoy.
                    </p>
                </div>
            </div>

            {/* Story & Mission */}
            <div className="max-w-7xl mx-auto px-6 pb-24 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-0 shadow-xl bg-linear-to-br from-card to-card/50">
                    <CardHeader>
                        <CardTitle>Our Mission</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-muted-foreground">
                        <p>
                            We believe events should feel effortless—from discovery to booking to participation. Our tools streamline planning and elevate experiences.
                        </p>
                        <p>
                            With a focus on beautiful design, reliability, and community, we help turn ideas into memorable moments.
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-xl bg-linear-to-br from-card to-card/50">
                    <CardHeader>
                        <CardTitle>What We Do</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-muted-foreground">
                        <p>
                            Our platform connects hosts with attendees, enabling seamless event discovery, bookings, payments, and reviews.
                        </p>
                        <p>
                              Whether you&apos;re hosting a road trip, workshop, or concert—we’ve got features built for real-world needs.
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Stats */}
            <div className="max-w-7xl mx-auto px-6 pb-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-0 shadow-lg bg-linear-to-br from-primary/5 to-accent/5">
                    <CardContent className="p-6 flex items-center gap-3">
                        <Users className="h-6 w-6 text-primary" />
                        <div>
                            <p className="text-xl font-bold">20k+</p>
                            <p className="text-xs text-muted-foreground">Happy attendees</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-lg bg-linear-to-br from-primary/5 to-accent/5">
                    <CardContent className="p-6 flex items-center gap-3">
                        <CalendarCheck className="h-6 w-6 text-primary" />
                        <div>
                            <p className="text-xl font-bold">1,200+</p>
                            <p className="text-xs text-muted-foreground">Events organized</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-lg bg-linear-to-br from-primary/5 to-accent/5">
                    <CardContent className="p-6 flex items-center gap-3">
                        <Sparkles className="h-6 w-6 text-primary" />
                        <div>
                            <p className="text-xl font-bold">98%</p>
                            <p className="text-xs text-muted-foreground">Satisfaction rate</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-lg bg-linear-to-br from-primary/5 to-accent/5">
                    <CardContent className="p-6 flex items-center gap-3">
                        <Trophy className="h-6 w-6 text-primary" />
                        <div>
                            <p className="text-xl font-bold">Top-rated</p>
                            <p className="text-xs text-muted-foreground">by hosts & clients</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AboutPage;