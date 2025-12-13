'use server';

import { s3Client } from '@/lib/s3';
import { PutObjectCommand, DeleteObjectsCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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
 * Generates a pre-signed URL for direct client-to-S3 upload.
 * This bypasses the server for file data transfer, allowing larger file uploads.
 * 
 * @param fileName The original name of the file
 * @param contentType The MIME type of the file
 * @returns { signedUrl, publicUrl, key }
 */
export async function getPresignedUploadUrl(fileName: string, contentType: string) {
    if (!BUCKET_NAME) {
        throw new Error("AWS_S3_BUCKET is not defined in environment variables");
    }

    try {
        // Generate a unique file name
        const sanitizedOriginalName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
        const uniqueFileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}_${sanitizedOriginalName}`;
        const key = `uploads/${uniqueFileName}`;

        const command = new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
            ContentType: contentType,
        });

        const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

        // Construct the public URL
        const publicUrl = `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${key}`;

        return { signedUrl, publicUrl, key };

    } catch (error: any) {
        console.error("Presigned URL Generation Error:", error);
        throw new Error(`Failed to generate presigned URL: ${error.message}`);
    }
}


/**
 * Generates a pre-signed URL for viewing/downloading an S3 file.
 * 
 * @param fileKey The S3 key of the file
 * @returns {string} The signed URL
 */
export async function getPresignedDownloadUrl(fileKey: string) {
    if (!BUCKET_NAME) throw new Error("AWS_S3_BUCKET is not defined");

    try {
        const command = new GetObjectCommand({
            Bucket: BUCKET_NAME,
            Key: fileKey,
        });

        return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    } catch (error: any) {
        console.error("Presigned Download URL Error:", error);
        return null;
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
    } catch (error: any) {
        console.error("S3 Delete Error:", error);
    }
}
