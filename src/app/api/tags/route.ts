import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import BlogPost from "@/models/BlogPost";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function GET() {
  try {
    await connectDB();
    
    // Aggregation to find most used tags
    const tags = await BlogPost.aggregate([
      { $match: { published: true } },
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    const formattedTags = tags.map(t => t._id);
    
    return successResponse(formattedTags);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return errorResponse("Gagal mengambil tags", 500, message);
  }
}
