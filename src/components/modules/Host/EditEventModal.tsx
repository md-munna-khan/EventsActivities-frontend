/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useActionState, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { updateEvent } from '@/services/host/hostService';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import InputFieldError from '@/components/shared/InputFieldError';
import { Upload, X } from 'lucide-react';
import Image from 'next/image';

interface Event {
    id: string;
    title: string;
    category: string;
    description: string;
    date: string | Date;
    location: string;
    joiningFee: number;
    image?: string | null;
    capacity: number;
    status?: string;
}

interface EditEventModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    event: Event | null;
}

// Event categories matching backend enum
const eventCategories = [
    { label: 'Music', value: 'MUSIC' },
    { label: 'Movie', value: 'MOVIE' },
    { label: 'Theater', value: 'THEATER' },
    { label: 'Comedy', value: 'COMEDY' },
    { label: 'Party', value: 'PARTY' },
    { label: 'Nightlife', value: 'NIGHTLIFE' },
    { label: 'Concert', value: 'CONCERT' },
    { label: 'Festival', value: 'FESTIVAL' },
    { label: 'Sports', value: 'SPORTS' },
    { label: 'Hiking', value: 'HIKING' },
    { label: 'Cycling', value: 'CYCLING' },
    { label: 'Running', value: 'RUNNING' },
    { label: 'Fitness', value: 'FITNESS' },
    { label: 'Camping', value: 'CAMPING' },
    { label: 'Outdoor', value: 'OUTDOOR' },
    { label: 'Adventure', value: 'ADVENTURE' },
    { label: 'Social', value: 'SOCIAL' },
    { label: 'Networking', value: 'NETWORKING' },
    { label: 'Meetup', value: 'MEETUP' },
    { label: 'Community', value: 'COMMUNITY' },
    { label: 'Volunteering', value: 'VOLUNTEERING' },
    { label: 'Culture', value: 'CULTURE' },
    { label: 'Religion', value: 'RELIGION' },
    { label: 'Food', value: 'FOOD' },
    { label: 'Dinner', value: 'DINNER' },
    { label: 'Cooking', value: 'COOKING' },
    { label: 'Tasting', value: 'TASTING' },
    { label: 'Cafe', value: 'CAFE' },
    { label: 'Restaurant', value: 'RESTAURANT' },
    { label: 'Tech', value: 'TECH' },
    { label: 'Workshop', value: 'WORKSHOP' },
    { label: 'Seminar', value: 'SEMINAR' },
    { label: 'Conference', value: 'CONFERENCE' },
    { label: 'Education', value: 'EDUCATION' },
    { label: 'Language', value: 'LANGUAGE' },
    { label: 'Business', value: 'BUSINESS' },
    { label: 'Finance', value: 'FINANCE' },
    { label: 'Art', value: 'ART' },
    { label: 'Craft', value: 'CRAFT' },
    { label: 'Photography', value: 'PHOTOGRAPHY' },
    { label: 'Painting', value: 'PAINTING' },
    { label: 'Writing', value: 'WRITING' },
    { label: 'Dance', value: 'DANCE' },
    { label: 'Gaming', value: 'GAMING' },
    { label: 'Esports', value: 'ESPORTS' },
    { label: 'Board Game', value: 'BOARDGAME' },
    { label: 'Card Game', value: 'CARDGAME' },
    { label: 'Online Event', value: 'ONLINE_EVENT' },
    { label: 'Travel', value: 'TRAVEL' },
    { label: 'Tour', value: 'TOUR' },
    { label: 'Road Trip', value: 'ROADTRIP' },
    { label: 'Other', value: 'OTHER' },
];

const EditEventModal = ({ open, onOpenChange, event }: EditEventModalProps) => {
    const router = useRouter();
    const [isPending, setIsPending] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        description: '',
        date: '',
        location: '',
        joiningFee: '',
        capacity: '',
    });

    // Initialize form when event changes
    useEffect(() => {
        if (event && open) {
            const eventDate = new Date(event.date);
            const localDateTime = new Date(eventDate.getTime() - eventDate.getTimezoneOffset() * 60000)
                .toISOString()
                .slice(0, 16);
            
            setFormData({
                title: event.title || '',
                category: event.category || '',
                description: event.description || '',
                date: localDateTime,
                location: event.location || '',
                joiningFee: event.joiningFee?.toString() || '',
                capacity: event.capacity?.toString() || '',
            });
            setPreview(event.image && event.image.trim() !== '' ? event.image : null);
            setSelectedFile(null);
        }
    }, [event, open]);

    // Handle file selection and preview
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Remove selected file
    const handleRemoveFile = () => {
        setSelectedFile(null);
        if (event?.image && event.image.trim() !== '') {
            setPreview(event.image);
        } else {
            setPreview(null);
        }
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!event) return;

        setIsPending(true);
        try {
            const data = {
                title: formData.title,
                category: formData.category,
                description: formData.description,
                date: formData.date,
                location: formData.location,
                joiningFee: Number(formData.joiningFee),
                capacity: Number(formData.capacity),
            };

            const result = await updateEvent(event.id, data, selectedFile || undefined);

            if (result.success) {
                toast.success('Event updated successfully!');
                onOpenChange(false);
                router.refresh();
            } else {
                toast.error(result.message || 'Failed to update event');
            }
        } catch (error: any) {
            toast.error('An error occurred while updating the event');
            console.error(error);
        } finally {
            setIsPending(false);
        }
    };

    // Reset form when modal closes
    useEffect(() => {
        if (!open) {
            setPreview(null);
            setSelectedFile(null);
        }
    }, [open]);

    if (!event) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Event</DialogTitle>
                    <DialogDescription>
                        Update the event details. All fields are optional.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <FieldGroup>
                        {/* Title */}
                        <Field>
                            <FieldLabel htmlFor="edit-title">Event Title</FieldLabel>
                            <Input
                                id="edit-title"
                                type="text"
                                placeholder="e.g., Mountain Music Adventure"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                disabled={isPending}
                            />
                        </Field>

                        {/* Category */}
                        <Field>
                            <FieldLabel htmlFor="edit-category">Category</FieldLabel>
                            <Select
                                value={formData.category}
                                onValueChange={(value) => setFormData({ ...formData, category: value })}
                                disabled={isPending}
                            >
                                <SelectTrigger id="edit-category">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {eventCategories.map((cat) => (
                                        <SelectItem key={cat.value} value={cat.value}>
                                            {cat.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>

                        {/* Description */}
                        <Field>
                            <FieldLabel htmlFor="edit-description">Description</FieldLabel>
                            <Textarea
                                id="edit-description"
                                placeholder="Describe your event in detail..."
                                rows={4}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                disabled={isPending}
                            />
                        </Field>

                        {/* Date and Location Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Field>
                                <FieldLabel htmlFor="edit-date">Event Date</FieldLabel>
                                <Input
                                    id="edit-date"
                                    type="datetime-local"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    disabled={isPending}
                                />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="edit-location">Location</FieldLabel>
                                <Input
                                    id="edit-location"
                                    type="text"
                                    placeholder="e.g., Dhaka Hill Tracts, Bangladesh"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    disabled={isPending}
                                />
                            </Field>
                        </div>

                        {/* Joining Fee and Capacity Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Field>
                                <FieldLabel htmlFor="edit-joiningFee">Joining Fee ($)</FieldLabel>
                                <Input
                                    id="edit-joiningFee"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={formData.joiningFee}
                                    onChange={(e) => setFormData({ ...formData, joiningFee: e.target.value })}
                                    disabled={isPending}
                                />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="edit-capacity">Capacity</FieldLabel>
                                <Input
                                    id="edit-capacity"
                                    type="number"
                                    min="1"
                                    placeholder="e.g., 20"
                                    value={formData.capacity}
                                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                                    disabled={isPending}
                                />
                            </Field>
                        </div>

                        {/* Image Upload */}
                        <Field>
                            <FieldLabel htmlFor="edit-file">Event Image</FieldLabel>
                            <div className="space-y-4">
                                {preview ? (
                                    <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                                        <Image
                                            src={preview}
                                            alt="Preview"
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-2 right-2"
                                            onClick={handleRemoveFile}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <label
                                        htmlFor="edit-file"
                                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted transition-colors"
                                    >
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                                            <p className="mb-2 text-sm text-muted-foreground">
                                                <span className="font-semibold">Click to upload</span> or drag and drop
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                PNG, JPG, GIF up to 10MB
                                            </p>
                                        </div>
                                        <input
                                            id="edit-file"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleFileChange}
                                            disabled={isPending}
                                        />
                                    </label>
                                )}
                            </div>
                        </Field>
                    </FieldGroup>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isPending}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? 'Updating...' : 'Update Event'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditEventModal;

