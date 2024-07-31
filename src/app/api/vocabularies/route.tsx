import { NextRequest, NextResponse } from "next/server";
import { db } from "@/drizzle/client";
import { insertVocabSchema, vocabulariesTable } from "@/drizzle/schema";
import { eq, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";
export const runtime = "edge";

const pageSize = 20;

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = insertVocabSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      {
        message: "Invalid fields",
        name: "ValidationError",
        success: false,
        errors: validation.error.message,
      },
      { status: 400 }
    );
  }

  try {
    const data = validation.data;

    await db.insert(vocabulariesTable).values(data);

    return NextResponse.json(
      {
        message: "success",
        name: "OK",
        success: true,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Something went wrong",
        name: "InternalServerError",
        success: false,
        errors: null,
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = Number(searchParams.get("page")) || 1;
  const skip = (page - 1) * pageSize;
  const chapter = searchParams.get("chapter");

  try {
    const vocabs = await db
      .select({
        record: vocabulariesTable,
        count: sql<number>`count(*) over()`,
      })
      .from(vocabulariesTable)
      .groupBy(vocabulariesTable.id)
      .offset(skip)
      .limit(pageSize);

    return NextResponse.json(
      {
        message: "success",
        success: true,
        name: "OK",
        data: vocabs,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Something went wrong",
        name: "InternalServerError",
        success: false,
        errors: null,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      {
        message: "Id required",
        name: "ValidationError",
        success: false,
        errors: null,
      },
      { status: 400 }
    );
  }

  try {
    const vocab = await db
      .delete(vocabulariesTable)
      .where(eq(vocabulariesTable.id, id))
      .returning();

    if (vocab.length === 0) {
      return NextResponse.json(
        {
          message: "record not found",
          name: "NotFoundError",
          status: false,
          errors: null,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "success",
      name: "OK",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Something went wrong",
        name: "InternalServerError",
        success: false,
        errors: null,
      },
      { status: 500 }
    );
  }
}
