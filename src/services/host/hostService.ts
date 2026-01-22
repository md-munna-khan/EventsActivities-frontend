"use server"

/* eslint-disable @typescript-eslint/no-explicit-any */

import { serverFetch } from "@/lib/server-fetch";
import { IAdminFilters, IPaginationOptions } from "../user/userService";

export interface IEventFormData {
    title: string;
    category: string;
    description: string;
    date: string;
    location: string;
    joiningFee: number;
    capacity: number;
    status?: string;
}

export interface IEventFilters {
    category?: string;
    status?: string;
    search?: string;
    fromDate?: string;
    toDate?: string;
    page?: number;
    limit?: number;
}



export async function createEventAction(_prevState: any, formData: FormData) {
    try {
     
        const data: IEventFormData = {
            title: formData.get('title') as string,
            category: formData.get('category') as string,
            description: formData.get('description') as string,
            date: formData.get('date') as string,
            location: formData.get('location') as string,
            joiningFee: Number(formData.get('joiningFee')),
            capacity: Number(formData.get('capacity')),
        };

      
        const file = formData.get('file') as File | null;


        const uploadFormData = new FormData();
        uploadFormData.append('data', JSON.stringify(data));
        
        if (file && file instanceof File && file.size > 0) {
            uploadFormData.append('file', file);
        }

        const response = await serverFetch.post("/hosts/create-event", {
            body: uploadFormData,
        });

        const result = await response.json();
        return result;
    } catch (error: any) {
        console.error("Error creating event:", error);
        return {
            success: false,
            message:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : "Failed to create event",
        };
    }
}

export async function createEvent(data: IEventFormData, file?: File) {
    try {
        const formData = new FormData();
        
     
        formData.append('data', JSON.stringify(data));
        
  
        if (file && file instanceof File && file.size > 0) {
            formData.append('file', file);
        }

        const response = await serverFetch.post("/hosts/create-event", {
            body: formData,
        });

        const result = await response.json();
   
        return result;
    } catch (error: any) {
        console.error("Error creating event:", error);
        return {
            success: false,
            message:
                process.env.NODE_ENV === "development" 
                    ? error.message
                    : "Failed to create event",
        };
    }
}

export async function getEvents(filters?: IEventFilters) {
    try {
       
        const queryParams = new URLSearchParams();
        
     
        if (filters?.category && filters.category !== 'All') {
            queryParams.append("category", filters.category.toUpperCase());
        }
        
      
        if (filters?.status && filters.status !== 'All') {
            queryParams.append("status", filters.status.toUpperCase());
        }
        
        if (filters?.search) queryParams.append("search", filters.search);
        if (filters?.fromDate) queryParams.append("fromDate", filters.fromDate);
        if (filters?.toDate) queryParams.append("toDate", filters.toDate);
        if (filters?.page) queryParams.append("page", filters.page.toString());
        if (filters?.limit) queryParams.append("limit", filters.limit.toString());

        const queryString = queryParams.toString();
        const endpoint = `/hosts${queryString ? `?${queryString}` : ""}`;
        
        const response = await serverFetch.get(endpoint);
        
       
        if (!response.ok) {
            const errorText = await response.text();
            console.error("getEvents - Response not OK:", response.status, errorText);
            return {
                success: false,
                data: [],
                meta: null,
                message: `Failed to fetch events: ${response.status}`,
            };
        }
        
        const result = await response.json();

        // Debug logging
        console.log("getEvents - Endpoint:", endpoint);
        console.log("getEvents - Response status:", response.status);
        console.log("getEvents - Response:", JSON.stringify(result, null, 2));

 
        if (result.success !== undefined) {
           
            if (result.success && Array.isArray(result.data)) {
                return {
                    success: true,
                    data: result.data,
                    meta: result.meta || {
                        page: filters?.page || 1,
                        limit: filters?.limit || 10,
                        total: result.data.length,
                        pages: Math.ceil((result.data.length || 0) / (filters?.limit || 10)),
                    },
                };
            }
          
            if (result.success && !result.data) {
                return {
                    success: true,
                    data: [],
                    meta: result.meta || {
                        page: filters?.page || 1,
                        limit: filters?.limit || 10,
                        total: 0,
                        pages: 0,
                    },
                };
            }
         
            return result;
        }

      
        if (Array.isArray(result.data)) {
            return {
                success: true,
                data: result.data,
                meta: result.meta || {
                    page: filters?.page || 1,
                    limit: filters?.limit || 10,
                    total: result.data.length,
                    pages: 1,
                },
            };
        }


        if (Array.isArray(result)) {
            return {
                success: true,
                data: result,
                meta: {
                    page: filters?.page || 1,
                    limit: filters?.limit || 10,
                    total: result.length,
                    pages: Math.ceil(result.length / (filters?.limit || 10)),
                },
            };
        }


        console.warn("getEvents - Unexpected response structure:", result);
        return {
            success: false,
            data: [],
            meta: {
                page: filters?.page || 1,
                limit: filters?.limit || 10,
                total: 0,
                pages: 0,
            },
            message: "Unexpected response structure from API",
        };
    } catch (error: any) {
        console.error("Error fetching events:", error);
        return {
            success: false,
            data: [],
            meta: null,
            message:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : "Failed to fetch events",
        };
    }
}

export async function getSingleEvent(eventId: string) {
    try {
        const response = await serverFetch.get(`/hosts/${eventId}`);
        const result = await response.json();

        if (result.success && result.data) {
            return {
                success: true,
                data: result.data,
            };
        }

        return {
            success: false,
            data: null,
            message: result.message || "Failed to fetch event",
        };
    } catch (error: any) {
        console.error("Error fetching event:", error);
        return {
            success: false,
            data: null,
            message:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : "Failed to fetch event",
        };
    }
}

export async function updateEvent(
    eventId: string,
    data: Partial<IEventFormData>,
    file?: File
) {
    try {
        const formData = new FormData();
        
       
        formData.append('data', JSON.stringify(data));
        

        if (file && file instanceof File && file.size > 0) {
            formData.append('file', file);
        }

        const response = await serverFetch.patch(`/hosts/${eventId}`, {
            body: formData,
        });

        const result = await response.json();
        return result;
    } catch (error: any) {
        console.error("Error updating event:", error);
        return {
            success: false,
            message:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : "Failed to update event",
        };
    }
}


export async function updateEventAction(eventId: string, _prevState: any, formData: FormData) {
    try {
        
        const data: Partial<IEventFormData> = {};
        
        const title = formData.get('title') as string;
        const category = formData.get('category') as string;
        const description = formData.get('description') as string;
        const date = formData.get('date') as string;
        const location = formData.get('location') as string;
        const joiningFee = formData.get('joiningFee') as string;
        const capacity = formData.get('capacity') as string;

        if (title) data.title = title;
        if (category) data.category = category;
        if (description) data.description = description;
        if (date) data.date = date;
        if (location) data.location = location;
        if (joiningFee) data.joiningFee = Number(joiningFee);
        if (capacity) data.capacity = Number(capacity);

   
        const file = formData.get('file') as File | null;

        const uploadFormData = new FormData();
        uploadFormData.append('data', JSON.stringify(data));
        
        if (file && file instanceof File && file.size > 0) {
            uploadFormData.append('file', file);
        }

        const response = await serverFetch.patch(`/hosts/${eventId}`, {
            body: uploadFormData,
        });

        const result = await response.json();
        return result;
    } catch (error: any) {
        console.error("Error updating event:", error);
        return {
            success: false,
            message:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : "Failed to update event",
        };
    }
}

export async function deleteEvent(eventId: string) {
    try {
        const response = await serverFetch.delete(`/hosts/${eventId}`);
        const result = await response.json();

        return result;
    } catch (error: any) {
        console.error("Error deleting event:", error);
        return {
            success: false,
            message:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : "Failed to delete event",
        };
    }
}

export async function updateEventStatus(eventId: string, status: string) {
    try {
        const response = await serverFetch.patch(`/hosts/event-status/${eventId}`, {
            body: JSON.stringify({ status }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const result = await response.json();
        return result;
    } catch (error: any) {
        console.error("Error updating event status:", error);
        return {
            success: false,
            message:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : "Failed to update event status",
        };
    }
}

export async function getMyEvents(filters?: IEventFilters) {
    try {
      
        const queryParams = new URLSearchParams();
        

        if (filters?.category && filters.category !== 'All') {
            queryParams.append("category", filters.category.toUpperCase());
        }
        

        if (filters?.status && filters.status !== 'All') {
            queryParams.append("status", filters.status.toUpperCase());
        }
        
        if (filters?.search) queryParams.append("search", filters.search);
        if (filters?.fromDate) queryParams.append("fromDate", filters.fromDate);
        if (filters?.toDate) queryParams.append("toDate", filters.toDate);
        if (filters?.page) queryParams.append("page", filters.page.toString());
        if (filters?.limit) queryParams.append("limit", filters.limit.toString());

        const queryString = queryParams.toString();
        const endpoint = `/hosts/my-events${queryString ? `?${queryString}` : ""}`;
        
        const response = await serverFetch.get(endpoint);
        
      
        if (!response.ok) {
            const errorText = await response.text();
            console.error("getMyEvents - Response not OK:", response.status, errorText);
            return {
                success: false,
                data: [],
                meta: null,
                message: `Failed to fetch events: ${response.status}`,
            };
        }
        
        const result = await response.json();

        
        if (result.success !== undefined) {
            if (result.success && Array.isArray(result.data)) {
                return {
                    success: true,
                    data: result.data,
                    meta: result.meta || {
                        page: filters?.page || 1,
                        limit: filters?.limit || 10,
                        total: result.data.length,
                        pages: Math.ceil((result.data.length || 0) / (filters?.limit || 10)),
                    },
                };
            }
            if (result.success && !result.data) {
                return {
                    success: true,
                    data: [],
                    meta: result.meta || {
                        page: filters?.page || 1,
                        limit: filters?.limit || 10,
                        total: 0,
                        pages: 0,
                    },
                };
            }
            return result;
        }

    
        if (Array.isArray(result.data)) {
            return {
                success: true,
                data: result.data,
                meta: result.meta || {
                    page: filters?.page || 1,
                    limit: filters?.limit || 10,
                    total: result.data.length,
                    pages: 1,
                },
            };
        }

        if (Array.isArray(result)) {
            return {
                success: true,
                data: result,
                meta: {
                    page: filters?.page || 1,
                    limit: filters?.limit || 10,
                    total: result.length,
                    pages: Math.ceil(result.length / (filters?.limit || 10)),
                },
            };
        }

        console.warn("getMyEvents - Unexpected response structure:", result);
        return {
            success: false,
            data: [],
            meta: {
                page: filters?.page || 1,
                limit: filters?.limit || 10,
                total: 0,
                pages: 0,
            },
            message: "Unexpected response structure from API",
        };
    } catch (error: any) {
        console.error("Error fetching my events:", error);
        return {
            success: false,
            data: [],
            meta: null,
            message:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : "Failed to fetch events",
        };
    }
}


export async function getAllHosts(filters: IAdminFilters = {}, options: IPaginationOptions = {}) {
  try {
    const qs = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => { if (v !== undefined && v !== null) qs.set(k, String(v)); });
    Object.entries(options).forEach(([k, v]) => { if (v !== undefined && v !== null) qs.set(k, String(v)); });
    const res = await serverFetch.get(`/admin/hosts?${qs.toString()}`);
    return await res.json();
  } catch (error: any) {
    console.error('getAllHosts error', error?.message || error);
    return { success: false, message: error?.message || 'Failed to fetch hosts' };
  }
} 

export async function updateHostStatus(Id: string, status: string) {
  try {
    const res = await serverFetch.patch(`/admin/hosts/${Id}/status`, { body: JSON.stringify({ status }), headers: { 'Content-Type': 'application/json' } });
    return await res.json();
  } catch (error: any) {
    console.error('updateHostStatus error', error?.message || error);
    return { success: false, message: error?.message || 'Failed to update host status' };
  }
}

export async function deleteHost(Id: string) {
  try {
    const res = await serverFetch.delete(`/admin/hosts/${Id}`);
    return await res.json();
  } catch (error: any) {
    console.error('deleteHost error', error?.message || error);
    return { success: false, message: error?.message || 'Failed to delete host' };
  }

}