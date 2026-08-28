import os
import boto3
from botocore.config import Config

R2_ACCOUNT_ID = os.environ["R2_ACCOUNT_ID"]
R2_ACCESS_KEY_ID = os.environ["R2_ACCESS_KEY_ID"]
R2_SECRET_ACCESS_KEY = os.environ["R2_SECRET_ACCESS_KEY"]
R2_BUCKET_NAME = os.environ["R2_BUCKET_NAME"]
R2_PUBLIC_URL = os.environ["R2_PUBLIC_URL"].rstrip("/")

APP_NAME = "allude-india"

MIME_TYPES = {
    "jpg": "image/jpeg", "jpeg": "image/jpeg", "png": "image/png",
    "gif": "image/gif", "webp": "image/webp", "mp4": "video/mp4",
    "webm": "video/webm", "mov": "video/quicktime",
}

_client = None


def _get_client():
    global _client
    if _client is None:
        _client = boto3.client(
            "s3",
            endpoint_url=f"https://{R2_ACCOUNT_ID}.r2.cloudflarestorage.com",
            aws_access_key_id=R2_ACCESS_KEY_ID,
            aws_secret_access_key=R2_SECRET_ACCESS_KEY,
            config=Config(signature_version="s3v4"),
            region_name="auto",
        )
    return _client


def init_storage(force: bool = False):
    # Kept for compatibility with server.py's startup call. No-op for R2.
    return True


def put_object(path: str, data: bytes, content_type: str) -> dict:
    client = _get_client()
    client.put_object(
        Bucket=R2_BUCKET_NAME,
        Key=path,
        Body=data,
        ContentType=content_type,
    )
    return {"path": path, "size": len(data), "url": f"{R2_PUBLIC_URL}/{path}"}


def get_object(path: str):
    client = _get_client()
    resp = client.get_object(Bucket=R2_BUCKET_NAME, Key=path)
    content = resp["Body"].read()
    content_type = resp.get("ContentType", "application/octet-stream")
    return content, content_type
