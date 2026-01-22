"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Sparkles, CalendarCheck, Trophy, ArrowRight, Globe, ShieldCheck, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const AboutPage = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <div className="min-h-screen bg-background selection:bg-primary/10">
      {/* Background Orbs */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] h-[40%] w-[40%] rounded-full bg-accent/10 blur-[120px]" />
      </div>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 pt-10 pb-16 md:pt-12 md:pb-24">
        <motion.div 
          {...fadeIn}
          className="text-center max-w-3xl mx-auto"
        >
          <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium tracking-wider uppercase bg-primary/10 text-primary rounded-full">
            Our Story
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8">
            We craft experiences that <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-accent">bring people together.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            From intimate meetups to large-scale festivals, our platform helps hosts and clients connect, plan, and enjoy life is best moments.
          </p>
        </motion.div>
      </section>

      {/* Bento Grid Features */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Mission Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="md:col-span-2 relative group"
          >
            <Card className="h-full border-primary/10 bg-card/50 backdrop-blur-sm overflow-hidden">
              <CardContent className="p-8 md:p-12 flex flex-col justify-center h-full">
                <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                  We believe events should feel effortless—from discovery to booking to participation. 
                  Our tools streamline the heavy lifting of logistics, allowing creators to focus on 
                  what truly matters: the human connection.
                </p>
                <div className="flex gap-4">
                  <Button variant="outline" className="rounded-full">Learn More</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Side Info Cards */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <Card className="bg-primary text-primary-foreground border-none shadow-xl">
              <CardContent className="p-8">
                <ShieldCheck className="h-8 w-8 mb-4 opacity-80" />
                <h3 className="text-xl font-bold mb-2">Reliability First</h3>
                <p className="text-primary-foreground/80 text-sm">
                  Trusted by thousands for secure payments and verified bookings.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-accent text-accent-foreground border-none shadow-xl">
              <CardContent className="p-8">
                <Globe className="h-8 w-8 mb-4 opacity-80" />
                <h3 className="text-xl font-bold mb-2">Global Reach</h3>
                <p className="text-accent-foreground/80 text-sm">
                  Connecting communities across 40+ countries worldwide.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Stats Section with a Divider */}
      <section className="border-y border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { icon: Users, label: "Happy attendees", value: "20k+" },
              { icon: CalendarCheck, label: "Events organized", value: "1,200+" },
              { icon: Sparkles, label: "Satisfaction rate", value: "98%" },
              { icon: Trophy, label: "Top-rated", value: "A+ Rating" },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-center space-y-2"
              >
                <stat.icon className="h-6 w-6 mx-auto text-primary opacity-70" />
                <p className="text-4xl font-black tracking-tighter">{stat.value}</p>
                <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-10 text-center">
        <motion.div 
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           className="bg-linear-to-b from-card to-transparent p-12 rounded-3xl border border-border"
        >
          <Heart className="h-10 w-10 text-red-500 mx-auto mb-6 fill-red-500" />
          <h2 className="text-3xl font-bold mb-4">Ready to start your next adventure?</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Join the thousands of hosts creating unforgettable experiences every day.
          </p>
          <Button size="lg" className="rounded-full px-8 group">
           <Link href="/login">
            Get Started 
           </Link>
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>
      </section>
    </div>
  );
};

export default AboutPage;