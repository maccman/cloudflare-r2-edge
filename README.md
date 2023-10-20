# Cloudflare R2 Edge

[![NPM version](https://img.shields.io/npm/v/cloudflare-r2-edge?color=a1b858&label=)](https://www.npmjs.com/package/cloudflare-r2-edge)

This is a TypeScript library that provides an interface to interact with Cloudflare's R2 Storage. It allows you to generate signed URLs, retrieve files, and upload files or blobs to a given key.

## Requirements

This library either requires an edge environment (like Vercel Edge functions, or CloudFlare Workers), or Node.js 20 or higher.

## Installation

You can install this library using pnpm:

```shell
pnpm i cloudflare-r2-edge
```

## Usage

First, import the CloudflareR2Client class from the library:

```typescript
import { CloudflareR2Client } from 'cloudflare-r2-edge'
```

Then, create a new instance of the client with your AWS access key ID, secret access key, account ID, and bucket:

```typescript
const client = new CloudflareR2Client({
  // Cloudflare AWS Credentials
  accessKeyId: 'your-access-key-id',
  secretAccessKey: 'your-secret-access-key',
  // Cloudflare Account ID
  accountId: 'your-account-id',
  // Cloudflare Bucket name
  bucket: 'your-bucket',
})
```

### Generate a Signed URL

You can generate a signed URL for a given key:

```typescript
const signedUrl = await client.getSignedUrl('your-key')
```

You can also specify an expiration time for the signed URL:

```typescript
const signedUrl = await client.getSignedUrl('your-key', {
  expires: 60 * 60 * 24, // 24 hours
})
```

### Retrieve a File

You can retrieve a file for a given key:

```typescript
const file = await client.get('your-key')
```

### Upload a File or Blob

You can upload a file or a blob to a given key:

```typescript
await client.put('your-key', yourFileOrBlob)
```

## Contributing

Contributions are welcome. Please submit a pull request or create an issue to discuss the changes you want to make.

## License

This project is licensed under the MIT License.
