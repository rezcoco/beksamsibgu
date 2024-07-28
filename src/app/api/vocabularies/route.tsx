import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { addVocabularySchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = addVocabularySchema.safeParse(body);

  const readPath = path.join(process.cwd(), "data", "vocabularies.json");

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

    const vocabulariesJson = await readFile(readPath, {
      encoding: "utf-8",
    });
    const vocabularies: Record<string, any>[] = await JSON.parse(
      vocabulariesJson
    );

    vocabularies.push(data);

    const write = await writeFile(readPath, JSON.stringify(vocabularies));

    return NextResponse.json(
      {
        message: "success",
        name: "OK",
        success: true,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.log(error.message);
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
  try {
    const readPath = path.join(process.cwd(), "data", "vocabularies.json");

    const vocabulariesJson = await readFile(readPath, {
      encoding: "utf-8",
    });
    const vocabularies: Record<string, any>[] = await JSON.parse(
      vocabulariesJson
    );

    return NextResponse.json(
      {
        message: "success",
        success: true,
        name: "OK",
        data: vocabularies,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error.message);
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
