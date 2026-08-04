"use server";

import { supabase } from "@/utils/supabase";
import { revalidatePath } from "next/cache";

export type UploadResult = {
  success: boolean;
  message?: string;
  error?: string;
  questionId?: string;
};

export type CreateBatchResult = {
  success: boolean;
  message?: string;
  error?: string;
  batchId?: string;
};

export async function createBatch(batchName: string): Promise<CreateBatchResult> {
  try {
    const cleanName = batchName?.trim();
    if (!cleanName) {
      return { success: false, error: "Batch name is required." };
    }

    // Check for existing batch with same name (case-insensitive)
    const { data: existing } = await supabase
      .from("batches")
      .select("id, name")
      .ilike("name", cleanName)
      .maybeSingle();

    if (existing) {
      // Batch already exists — return it without creating a duplicate
      revalidatePath("/");
      revalidatePath("/upload");
      return {
        success: true,
        message: `Batch "${existing.name}" already exists. Using existing batch.`,
        batchId: existing.id,
      };
    }

    // Insert new batch
    const { data, error } = await supabase
      .from("batches")
      .insert([{ name: cleanName }])
      .select("id")
      .single();

    if (error) {
      return {
        success: false,
        error: error.message || "Failed to create batch in database.",
      };
    }

    revalidatePath("/");
    revalidatePath("/upload");

    return {
      success: true,
      message: `Batch "${cleanName}" created successfully!`,
      batchId: data?.id,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "An unexpected error occurred while creating batch.";
    return { success: false, error: msg };
  }
}

export async function uploadQuestion(formData: FormData): Promise<UploadResult> {
  try {
    // 1. Verify Access Key
    const accessKey = formData.get("access_key")?.toString();
    const envAccessKey = process.env.UPLOAD_ACCESS_KEY;

    if (!envAccessKey) {
      if (
        accessKey !== "admin123" &&
        accessKey !== process.env.NEXT_PUBLIC_DEFAULT_ACCESS_KEY
      ) {
        return {
          success: false,
          error: "Invalid or unconfigured secret access key. Upload denied.",
        };
      }
    } else if (accessKey !== envAccessKey) {
      return {
        success: false,
        error: "Invalid access key. You are not authorized to upload questions.",
      };
    }

    // Extract form fields
    const batchName = formData.get("batch_name")?.toString().trim();
    const courseName = formData.get("course_name")?.toString().trim();
    const teacherName = formData.get("teacher_name")?.toString().trim();
    const semester = formData.get("semester")?.toString().trim();
    const examType = formData.get("exam_type")?.toString().trim();
    const yearStr = formData.get("year")?.toString().trim();
    const file = formData.get("file") as File | null;

    // Validate required fields
    if (
      !batchName ||
      !courseName ||
      !teacherName ||
      !semester ||
      !examType ||
      !yearStr ||
      !file
    ) {
      return {
        success: false,
        error: "All fields including the file are required.",
      };
    }

    const year = parseInt(yearStr, 10);
    if (isNaN(year)) {
      return {
        success: false,
        error: "Year must be a valid number.",
      };
    }

    // Validate file extension
    const fileExt = file.name.split(".").pop()?.toLowerCase() || "pdf";
    const allowedTypes = ["pdf", "jpg", "jpeg", "png", "doc", "docx"];
    if (!allowedTypes.includes(fileExt)) {
      return {
        success: false,
        error: `File type '.${fileExt}' is not supported. Allowed: ${allowedTypes.join(
          ", "
        )}`,
      };
    }

    // 2. Query batch or create batch if not existing
    let batchId: string;
    const { data: existingBatch } = await supabase
      .from("batches")
      .select("id")
      .ilike("name", batchName)
      .maybeSingle();

    if (existingBatch) {
      batchId = existingBatch.id;
    } else {
      const { data: newBatch, error: batchErr } = await supabase
        .from("batches")
        .insert([{ name: batchName }])
        .select("id")
        .single();

      if (batchErr || !newBatch) {
        return {
          success: false,
          error: batchErr?.message || "Failed to create batch for question upload.",
        };
      }
      batchId = newBatch.id;
    }

    // 3. Upload file to Supabase Storage ('question-bank')
    const timestamp = Date.now();
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filePath = `questions/${batchId}/${timestamp}_${cleanFileName}`;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("question-bank")
      .upload(filePath, buffer, {
        contentType: file.type || "application/pdf",
        upsert: true,
      });

    if (uploadError) {
      return {
        success: false,
        error: `Failed to upload file to storage: ${uploadError.message}`,
      };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("question-bank")
      .getPublicUrl(uploadData.path);

    const fileUrl = urlData.publicUrl;
    const fileTypeNormalized = ["jpg", "jpeg", "png"].includes(fileExt)
      ? "image"
      : fileExt.startsWith("doc")
      ? "doc"
      : "pdf";

    // 4. Insert question record
    const { data: insertedQuestion, error: questionInsertError } = await supabase
      .from("questions")
      .insert([
        {
          batch_id: batchId,
          course_name: courseName,
          teacher_name: teacherName,
          semester: semester,
          exam_type: examType,
          year: year,
          file_url: fileUrl,
          file_type: fileTypeNormalized,
        },
      ])
      .select("id")
      .single();

    if (questionInsertError || !insertedQuestion) {
      return {
        success: false,
        error: `Failed to save question: ${questionInsertError?.message || "Unknown error"}`,
      };
    }

    revalidatePath("/");
    revalidatePath("/upload");

    return {
      success: true,
      message: "Question paper successfully uploaded and published!",
      questionId: insertedQuestion.id,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "An unexpected error occurred during upload.";
    return {
      success: false,
      error: msg,
    };
  }
}
