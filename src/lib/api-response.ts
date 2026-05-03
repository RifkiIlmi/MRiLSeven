import { NextResponse } from "next/server";
import { ApiResponse, PaginationMeta } from "@/types";


export function successResponse<T>(
  data: T,
  meta?: PaginationMeta,
  status = 200,
) {
  return NextResponse.json(
    { success: true, data, ...(meta && { meta }) },
    { status },
  );
}

export function errorResponse(error: string, status = 400, debug?: string) {
  return NextResponse.json(
    { success: false, error, ...(debug && { debug }) },
    { status },
  );
}
