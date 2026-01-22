/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useActionState, useEffect, Suspense, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { updateMyProfile } from '@/services/auth/auth.service';
import { getUserInfo } from '@/services/auth/getUserInfo';
import InputFieldError from '@/components/shared/InputFieldError';
import { getInitials } from '@/lib/formatters';
import { Badge } from '@/components/ui/badge';
import { Camera, Mail, MapPin, Phone, User as UserIcon, Check } from 'lucide-react';
import SpinnerLoader from '@/components/shared/SpinnerLoader';

const INTERESTS = [
    "MUSIC", "SPORTS", "HIKING", "TRAVEL", "COOKING", "READING", "DANCING",
    "GAMING", "TECHNOLOGY", "PHOTOGRAPHY", "ART", "MOVIES", "FITNESS", "YOGA",
    "CYCLING", "RUNNING", "CAMPING", "FISHING", "LANGUAGES", "FOOD",
    "VOLUNTEERING", "GARDENING", "WRITING", "FASHION", "BUSINESS", "FINANCE",
    "MEDITATION", "DIY", "PETS", "SOCIALIZING", "OTHER"
];

async function handleProfileUpdate(prevState: any, formData: FormData) {
    const interests = formData.getAll('interests');
    const newFormData = new FormData();
    for (const [key, value] of formData.entries()) {
        if (key !== 'interests') newFormData.append(key, value);
    }
    if (interests.length > 0) newFormData.set('interests', JSON.stringify(interests));
    return updateMyProfile(newFormData);
}

export const MyProfile = () => {
    const [userInfo, setUserInfo] = useState<any>(null);
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const [state, formAction, isPending] = useActionState(handleProfileUpdate, null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            const info = await getUserInfo();
            setUserInfo(info);
            const user = info.client || info.host || info.admin || info;
            setSelectedInterests(user?.interests || []);
        };
        fetchUserInfo();
    }, []);

    useEffect(() => {
        if (state && !state.success && state.message) toast.error(state.message);
        if (state && state.success) {
            toast.success(state.message || "Profile updated successfully!");
            const fetchUserInfo = async () => {
                const info = await getUserInfo();
                setUserInfo(info);
            };
            fetchUserInfo();
        }
    }, [state]);

    if (!userInfo) return <div className="flex h-screen items-center justify-center"><SpinnerLoader/></div>;

    const user = userInfo.client || userInfo.host || userInfo.admin || userInfo;

    const toggleInterest = (interest: string) => {
        setSelectedInterests(prev => 
            prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
        );
    };

    return (
        <div className="min-h-screen bg-slate-50/50 dark:bg-transparent pb-12">
            <div className="container mx-auto px-4 py-8  space-y-8">
                
            
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight uppercase ">
                            Profile <span className="text-primary ">Settings</span>
                        </h1>
                        <p className="text-muted-foreground font-medium">Update your identity and discoverable preferences.</p>
                    </div>
                </div>

                <form action={formAction} className="space-y-8">
                 
                    <Card className="overflow-hidden border-none shadow-xl bg-card">
                        <div className="h-32 bg-gradient-to-r from-primary/20 via-primary/5 to-background" />
                        <CardContent className="relative pt-0 pb-8">
                            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-12 px-2">
                                <div className="relative group">
                                    <Avatar className="h-32 w-32 border-4 border-background shadow-2xl">
                                        <AvatarImage src={user?.profilePhoto || undefined} />
                                        <AvatarFallback className="text-2xl bg-muted">{getInitials(user?.name || "U")}</AvatarFallback>
                                    </Avatar>
                                    <label htmlFor="profilePhoto" className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full cursor-pointer shadow-lg hover:scale-110 transition-transform">
                                        <Camera className="h-5 w-5" />
                                        <input id="profilePhoto" name="file" type="file" accept="image/*" className="hidden" />
                                    </label>
                                </div>
                                <div className="flex-1 text-center md:text-left space-y-1">
                                    <h2 className="text-3xl font-black text-foreground">{user?.name}</h2>
                                    <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm font-medium text-muted-foreground">
                                        <span className="flex items-center gap-1.5"><Mail className="h-4 w-4 text-primary" /> {user?.email}</span>
                                        {user?.location && <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-primary" /> {user.location}</span>}
                                    </div>
                                </div>
                                <div className="pb-2">
                                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 px-4 py-1 rounded-full uppercase font-bold tracking-widest text-[10px]">
                                        {userInfo.role || 'Member'}
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                 
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <Card className="border-none shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                                        <UserIcon className="h-5 w-5 text-primary" /> Personal Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Field>
                                            <FieldLabel className="text-xs uppercase font-bold tracking-wider text-muted-foreground">Full Name</FieldLabel>
                                            <Input name="name" defaultValue={user?.name} className="bg-muted/30 focus-visible:ring-primary" />
                                            <InputFieldError field="name" state={state} />
                                        </Field>

                                        <Field>
                                            <FieldLabel className="text-xs uppercase font-bold tracking-wider text-muted-foreground">Contact Number</FieldLabel>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                <Input name="contactNumber" defaultValue={user?.contactNumber} className="pl-10 bg-muted/30 focus-visible:ring-primary" />
                                            </div>
                                            <InputFieldError field="contactNumber" state={state} />
                                        </Field>

                                        <Field className="md:col-span-2">
                                            <FieldLabel className="text-xs uppercase font-bold tracking-wider text-muted-foreground">Home Location</FieldLabel>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                <Input name="location" defaultValue={user?.location} className="pl-10 bg-muted/30 focus-visible:ring-primary" />
                                            </div>
                                            <InputFieldError field="location" state={state} />
                                        </Field>

                                        <Field className="md:col-span-2">
                                            <FieldLabel className="text-xs uppercase font-bold tracking-wider text-muted-foreground">About You (Bio)</FieldLabel>
                                            <textarea
                                                name="bio"
                                                rows={4}
                                                className="w-full rounded-[var(--radius)] border bg-muted/30 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                                defaultValue={user?.bio || ""}
                                            />
                                            <InputFieldError field="bio" state={state} />
                                        </Field>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                      
                        <div className="space-y-6">
                            <Card className="border-none shadow-lg h-full">
                                <CardHeader>
                                    <CardTitle className="text-lg font-bold">Interests</CardTitle>
                                    <CardDescription>Select topics you are passionate about.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {INTERESTS.map((interest) => {
                                            const isSelected = selectedInterests.includes(interest);
                                            return (
                                                <label key={interest} className="cursor-pointer group">
                                                    <input 
                                                        type="checkbox" 
                                                        name="interests" 
                                                        value={interest}
                                                        checked={isSelected}
                                                        onChange={() => toggleInterest(interest)}
                                                        className="hidden" 
                                                    />
                                                    <Badge 
                                                        variant={isSelected ? "default" : "outline"}
                                                        className={`transition-all py-1.5 px-3 rounded-full font-bold text-[10px] tracking-wide ${
                                                            isSelected 
                                                            ? 'bg-primary text-white shadow-md scale-105' 
                                                            : 'hover:border-primary/50 text-muted-foreground'
                                                        }`}
                                                    >
                                                        {isSelected && <Check className="mr-1 h-3 w-3" />}
                                                        {interest}
                                                    </Badge>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="sticky bottom-6 flex justify-end">
                        <Button type="submit" size="lg" disabled={isPending} className="rounded-full px-12 h-14 text-lg font-black uppercase tracking-widest shadow-2xl shadow-primary/20 active:scale-95 transition-all">
                            {isPending ? "Syncing..." : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const MyProfilePage = () => (
    <Suspense fallback={<div className="flex h-screen items-center justify-center font-black animate-pulse">LOADING PROFILE...</div>}>
        <MyProfile />
    </Suspense>
);

export default MyProfilePage;