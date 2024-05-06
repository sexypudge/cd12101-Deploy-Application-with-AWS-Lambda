import {PutObjectCommand, S3Client} from '@aws-sdk/client-s3'
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client()

const imagesBucket = process.env.IMAGES_S3_BUCKET
const signedUrlExpiration = process.env.SIGNED_URL_EXPIRATION

export async function getUploadUrl(imageId) {
    const command = new PutObjectCommand({
        Bucket: imagesBucket,
        Key: imageId
    })
    const url = await getSignedUrl(s3Client, command, {
        expiresIn: signedUrlExpiration
    })
    return url
}
