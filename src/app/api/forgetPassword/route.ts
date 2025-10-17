import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { corsHeaders } from "@/utils/cors";

const prisma = new PrismaClient();

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}
