/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useActionState, useEffect, Suspense } from 'react';
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



const INTERESTS = [
  "MUSIC","SPORTS","HIKING","TRAVEL","COOKING","READING","DANCING",
  "GAMING","TECHNOLOGY","PHOTOGRAPHY","ART","MOVIES","FITNESS","YOGA",
  "CYCLING","RUNNING","CAMPING","FISHING","LANGUAGES","FOOD",
  "VOLUNTEERING","GARDENING","WRITING","FASHION","BUSINESS","FINANCE",
  "MEDITATION","DIY","PETS","SOCIALIZING","OTHER"
];

// Form submission wrapper to handle interests array
async function handleProfileUpdate(prevState: any, formData: FormData) {
  // Convert interests checkboxes to array
  const interests = formData.getAll('interests');
  
  // Create new FormData with proper format
  const newFormData = new FormData();
  
  // Add all fields except interests
  for (const [key, value] of formData.entries()) {
    if (key !== 'interests') {
      newFormData.append(key, value);
    }
  }
  
  // Add interests as a JSON array string
  if (interests.length > 0) {
    newFormData.set('interests', JSON.stringify(interests));
  }
  
  return updateMyProfile(newFormData);
}

export const MyProfile = () => {
  const [userInfo, setUserInfo] = React.useState<any>(null);

  const [state, formAction, isPending] = useActionState(handleProfileUpdate, null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const info = await getUserInfo();
      setUserInfo(info);
    };
    fetchUserInfo();
  }, []);

  useEffect(() => {
    if (state && !state.success && state.message) {
      toast.error(state.message);
    }
    if (state && state.success) {
      toast.success(state.message || "Profile updated successfully!");
      // Refresh user info
      const fetchUserInfo = async () => {
        const info = await getUserInfo();
        setUserInfo(info);
      };
      fetchUserInfo();
    }
  }, [state]);

  if (!userInfo) {
    return <div>Loading...</div>;
  }

  const user = userInfo.client || userInfo.host || userInfo.admin || userInfo;

  const currentInterests = user?.interests || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground mt-2">
            Manage your profile information and preferences
          </p>
        </div>

        {/* Profile Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user?.profilePhoto || undefined} alt={user?.name || "User"} />
                <AvatarFallback>{getInitials(user?.name || "U")}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">{user?.name || "Unknown User"}</h2>
                <p className="text-muted-foreground">{user?.email}</p>
                {user?.location && (
                  <p className="text-sm text-muted-foreground mt-1">{user.location}</p>
                )}
              </div>
            </div>
            {currentInterests.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {currentInterests.map((interest: string, index: number) => (
                  <Badge key={index} variant="secondary">
                    {interest}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Form */}
        <Card>
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
            <CardDescription>
              Update your profile information below
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* <form action={formAction} encType="multipart/form-data"> */}
            <form action={formAction} >
              <FieldGroup>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <Field>
                    <FieldLabel htmlFor="name">Full Name</FieldLabel>
                    <Input 
                      id="name" 
                      name="name" 
                      type="text" 
                      placeholder="John Doe"
                      defaultValue={user?.name || ""}
                    />
                    <InputFieldError field="name" state={state} />
                  </Field>

                  {/* Email */}
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      placeholder="m@example.com"
                      defaultValue={user?.email || ""}
                      disabled
                    />
                    <FieldDescription>Email cannot be changed</FieldDescription>
                  </Field>

                  {/* Contact Number */}
                  <Field>
                    <FieldLabel htmlFor="contactNumber">Contact Number</FieldLabel>
                    <Input 
                      id="contactNumber" 
                      name="contactNumber" 
                      type="text" 
                      placeholder="+8801xxxxxxxxx"
                      defaultValue={user?.contactNumber || ""}
                    />
                    <InputFieldError field="contactNumber" state={state} />
                  </Field>

                  {/* Location */}
                  <Field>
                    <FieldLabel htmlFor="location">Location</FieldLabel>
                    <Input 
                      id="location" 
                      name="location" 
                      type="text" 
                      placeholder="Dhaka, Bangladesh"
                      defaultValue={user?.location || ""}
                    />
                    <InputFieldError field="location" state={state} />
                  </Field>

                  {/* Bio */}
                  <Field className="md:col-span-2">
                    <FieldLabel htmlFor="bio">Bio</FieldLabel>
                    <textarea
                      id="bio"
                      name="bio"
                      rows={4}
                      className="w-full rounded-md border px-3 py-2"
                      placeholder="Short bio about yourself"
                      defaultValue={user?.bio || ""}
                    />
                    <InputFieldError field="bio" state={state} />
                  </Field>

                  {/* Profile Photo */}
                  <Field className="md:col-span-2">
                    <FieldLabel htmlFor="profilePhoto">Profile Photo</FieldLabel>
                    <input 
                      id="profilePhoto" 
                      name="file" 
                      type="file" 
                      accept="image/*" 
                    />
                    <FieldDescription>Upload a new profile photo (optional)</FieldDescription>
                    <InputFieldError field="file" state={state} />
                  </Field>

                  {/* Interests */}
                  <Field className="md:col-span-2">
                    <FieldLabel>Interests</FieldLabel>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-40 overflow-auto p-2 border rounded-sm">
                      {INTERESTS.map((interest) => {
                        const isChecked = currentInterests.includes(interest);
                        return (
                          <label key={interest} className="flex items-center space-x-2 text-sm">
                            <input 
                              type="checkbox" 
                              name="interests" 
                              value={interest}
                              defaultChecked={isChecked}
                            />
                            <span>{interest.charAt(0) + interest.slice(1).toLowerCase()}</span>
                          </label>
                        );
                      })}
                    </div>
                    <InputFieldError field="interests" state={state} />
                  </Field>
                </div>

                <FieldGroup className="mt-6">
                  <Field>
                    <Button type="submit" disabled={isPending}>
                      {isPending ? "Updating Profile..." : "Update Profile"}
                    </Button>
                  </Field>
                </FieldGroup>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const MyProfilePage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MyProfile />
    </Suspense>
  );
};

export default MyProfilePage;
