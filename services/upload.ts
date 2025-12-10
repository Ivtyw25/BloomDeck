'use server';

import { s3Client } from '@/lib/s3';
import { PutObjectCommand, DeleteObjectsCommand } from "@aws-sdk/client-s3";

const BUCKET_NAME = process.env.AWS_S3_BUCKET;
const REGION = process.env.AWS_REGION || "ap-southeast-1";

const extractKeyFromUrl = (url: string) => {
    try {
        const urlObj = new URL(url);
        // Remove the leading slash
        return urlObj.pathname.substring(1);
    } catch (e) {
        console.error("Error parsing URL", url, e);
        return null;
    }
};

/**
 * Uploads a file to AWS S3.
 * This runs on the server to protect credentials.
 * 
 * @param formData FormData containing 'file' field
 * @returns The public URL of the uploaded file.
 */
export async function uploadFileToS3(formData: FormData): Promise<string> {
    const file = formData.get('file') as File;

    if (!file) {
        throw new Error("No file provided");
    }

    if (!BUCKET_NAME) {
        throw new Error("AWS_S3_BUCKET is not defined in environment variables");
    }

    try {
        const buffer = Buffer.from(await file.arrayBuffer());

        // Generate a unique file name
        // 1. Sanitize original name
        const sanitizedOriginalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        // 2. Add timestamp and random string
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}_${sanitizedOriginalName}`;
        const key = `uploads/${fileName}`;

        const command = new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
            Body: buffer,
            ContentType: file.type,
        });

        await s3Client.send(command);

        // Return the standard S3 URL
        // NOTE: This URL will be accessible only if the bucket/object is public.
        // If your bucket is private, you will need to generate a Presigned URL for viewing.
        const url = `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${key}`;

        return url;

    } catch (error: any) {
        console.error("S3 Upload Error:", error);
        throw new Error(`Failed to upload file to S3: ${error.message}`);
    }
}

/**
 * Deletes multiple files from S3.
 * 
 * @param fileUrls Array of full S3 URLs to delete.
 */
export async function deleteFilesFromS3(fileUrls: string[]) {
    if (!fileUrls || fileUrls.length === 0) return;

    if (!BUCKET_NAME) {
        throw new Error("AWS_S3_BUCKET is not defined");
    }

    const keys = fileUrls.map(url => extractKeyFromUrl(url)).filter(key => key !== null) as string[];

    if (keys.length === 0) return;

    const command = new DeleteObjectsCommand({
        Bucket: BUCKET_NAME,
        Delete: {
            Objects: keys.map(Key => ({ Key })),
            Quiet: true
        }
    });

    try {
        await s3Client.send(command);
        console.log("Deleted files from S3:", keys);
    } catch (error: any) {
        console.error("S3 Delete Error:", error);
    }
}
