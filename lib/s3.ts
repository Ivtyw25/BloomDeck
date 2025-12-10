import { S3Client } from "@aws-sdk/client-s3";

// NOTE: These credentials should typically be kept on the server side (not prefixed with NEXT_PUBLIC_)
// to avoid exposing your secret keys to the client.

const region = process.env.AWS_REGION || "ap-southeast-1";
const accessKeyId = process.env.AWS_ACCESS_KEY_ID!;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY!;

if (!accessKeyId || !secretAccessKey) {
    console.warn('Missing AWS S3 environment variables: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY');
}

export const s3Client = new S3Client({
    region,
    credentials: {
        accessKeyId,
        secretAccessKey,
    },
});
