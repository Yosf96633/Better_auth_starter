import { db } from "@/db";
import { user } from "@/db/auth-schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams;
    const name = searchParams.get("name") as string;
    const result = await db.select().from(user).where(eq(user.name, name));
    if (result.length >= 1) {
      return NextResponse.json(
        { success: false, message: "User with name already exist!" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: true, message: "Username is available!" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error at /api/check-availability GET request : ", error);
    return NextResponse.json(
      { success: false, message: "Internal server error!" },
      { status: 500 }
    );
  }
};
