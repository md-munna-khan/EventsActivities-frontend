// import { serverFetch } from "@/lib/server-fetch";
// import { NextRequest, NextResponse } from "next/server";

// export async function PATCH(req: NextRequest) {
//   try {
//     const formData = await req.formData();
    
//     const response = await serverFetch.patch("/user/update-my-profile", {
//       body: formData,
//     });

//     const result = await response.json();
//     return NextResponse.json(result);
//   } catch (error: any) {
//     console.error("Update profile error:", error);
//     return NextResponse.json(
//       { success: false, message: error.message || "Failed to update profile" },
//       { status: 500 }
//     );
//   }
// }
