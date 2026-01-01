"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send } from "lucide-react";

const ContactPage = () => {
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
                        Let’s build your next unforgettable event
                    </h1>
                    <p className="mt-4 text-muted-foreground text-sm md:text-base">
                        Reach out anytime. We typically respond within a few hours.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 pb-24 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Contact Info */}
                <Card className="lg:col-span-1 border-0 shadow-xl bg-linear-to-br from-card to-card/50">
                    <CardHeader>
                        <CardTitle>Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Mail className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold">Email</p>
                                <a href="mailto:munnamia0200@gmail.com" className="text-muted-foreground hover:text-primary">
                                    munnamia0200@gmail.com
                                </a>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Phone className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold">WhatsApp</p>
                                <a href="https://wa.me/8801867418698" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary">
                                    01867418698
                                </a>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <MapPin className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold">HQ</p>
                                <p className="text-muted-foreground">Dhaka, Bangladesh</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Contact Form */}
                <Card className="lg:col-span-2 border-0 shadow-xl bg-linear-to-br text-2xl from-card to-card/50">
                    <CardHeader>
                        <CardTitle>Send us a message</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input placeholder="Your name" required />
                                <Input type="email" placeholder="Your email" required />
                            </div>
                            <Input placeholder="Subject" required />
                            <Textarea placeholder="Tell us a bit about your event…" rows={6} required />
                            <div className="flex justify-end">
                                <Button type="submit" className="gap-2">
                                    <Send className="h-4 w-4" />
                                    Send message
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ContactPage;