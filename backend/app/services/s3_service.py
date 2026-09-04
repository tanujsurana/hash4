from pathlib import Path
from uuid import uuid4

import boto3
from fastapi import UploadFile

from app.config import settings


s3_client = boto3.client(
    "s3",
    aws_access_key_id=settings.aws_access_key_id,
    aws_secret_access_key=settings.aws_secret_access_key,
    region_name=settings.aws_region,
)


def upload_property_image(
    image_file: UploadFile,
) -> str:
    file_extension = Path(
        image_file.filename
    ).suffix.lower()

    unique_filename = (
        f"properties/{uuid4()}{file_extension}"
    )

    s3_client.upload_fileobj(
        image_file.file,
        settings.aws_s3_bucket,
        unique_filename,
        ExtraArgs={
            "ContentType": image_file.content_type,
        },
    )

    return unique_filename


def delete_property_image(
    image_key: str,
) -> None:
    s3_client.delete_object(
        Bucket=settings.aws_s3_bucket,
        Key=image_key,
    )
    
def generate_presigned_url(
    image_key: str,
    expires_in: int = 3600,
) -> str:
    return s3_client.generate_presigned_url(
        "get_object",
        Params={
            "Bucket": settings.aws_s3_bucket,
            "Key": image_key,
        },
        ExpiresIn=expires_in,
    )