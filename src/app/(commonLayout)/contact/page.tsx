"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, Globe } from "lucide-react";

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-background">
     
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-accent/10 blur-[100px] rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
  
          <div className="lg:col-span-5 space-y-12">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-[1.1]">
                Let’s build <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-accent">
                  something big.
                </span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-md">
                Have a question about our platform or need help planning your next festival? Our team is ready to help you scale.
              </p>
            </motion.div>

            <div className="grid gap-8">
              {[
                { 
                  icon: Mail, 
                  label: "Email us", 
                  value: "munnamia0200@gmail.com", 
                  href: "mailto:munnamia0200@gmail.com" 
                },
                { 
                  icon: MessageCircle, 
                  label: "WhatsApp", 
                  value: "+880 1867 418698", 
                  href: "https://wa.me/8801867418698" 
                },
                { 
                  icon: MapPin, 
                  label: "Headquarters", 
                  value: "Dhaka, Bangladesh", 
                  href: "#" 
                }
              ].map((item, i) => (
                <motion.a
                  key={i}
                  href={item.href}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="group flex items-start gap-4 p-2 -ml-2 rounded-2xl transition-colors hover:bg-muted/50"
                >
                  <div className="mt-1 h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{item.label}</p>
                    <p className="text-xl font-semibold mt-0.5">{item.value}</p>
                  </div>
                </motion.a>
              ))}
            </div>

           
          </div>

        
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-7"
          >
            <Card className="border-none shadow-2xl bg-card/50 backdrop-blur-md">
              <CardContent className="p-8 md:p-12">
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium ml-1">Full Name</label>
                      <Input 
                        placeholder="John Doe" 
                        className="h-12 bg-background/50 border-muted focus:ring-2 focus:ring-primary/20 transition-all" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium ml-1">Email Address</label>
                      <Input 
                        type="email" 
                        placeholder="john@example.com" 
                        className="h-12 bg-background/50 border-muted focus:ring-2 focus:ring-primary/20 transition-all" 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium ml-1">Subject</label>
                    <Input 
                      placeholder="Event Partnership" 
                      className="h-12 bg-background/50 border-muted focus:ring-2 focus:ring-primary/20 transition-all" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium ml-1">Message</label>
                    <Textarea 
                      placeholder="Tell us a bit about your event needs..." 
                      rows={5} 
                      className="bg-background/50 border-muted focus:ring-2 focus:ring-primary/20 transition-all resize-none" 
                    />
                  </div>

                  <Button className="w-full h-10 text-lg font-bold rounded-xl gap-3 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all group">
                    <Send className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    Send Message
                  </Button>
                </form>

                <p className="text-center text-sm text-muted-foreground mt-8 flex items-center justify-center gap-2">
                  <Globe className="h-4 w-4" />
                  We support events worldwide
                </p>
              </CardContent>
            </Card>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default ContactPage;