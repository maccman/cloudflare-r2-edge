import { AwsClient } from 'aws4fetch'

export class CloudflareR2Client {
  private accountId: string
  public bucket: string
  private client: AwsClient

  constructor(options: {
    accessKeyId: string
    secretAccessKey: string
    accountId: string
    bucket: string
  }) {
    this.bucket = options.bucket
    this.accountId = options.accountId

    this.client = new AwsClient({
      accessKeyId: options.accessKeyId,
      secretAccessKey: options.secretAccessKey,
    })
  }

  get endpoint(): string {
    return `https://${this.bucket}.${this.accountId}.r2.cloudflarestorage.com`
  }

  /**
   * Generates a signed URL for a given key.
   *
   * @returns A signed URL as a string.
   */
  async getSignedUrl(key: string, { expiry = 3600 } = {}): Promise<string> {
    const url = new URL(this.endpoint)

    // preserve the original path
    url.pathname = key

    // Specify a custom expiry for the presigned URL, in seconds
    url.searchParams.set('X-Amz-Expires', expiry.toString())

    const signed = await this.client.sign(
      new Request(url, {
        method: 'GET',
        headers: {
          'Accept-Encoding': 'deflate',
        },
      }),
      {
        aws: { signQuery: true },
      },
    )

    return signed.url
  }

  /**
   * Retrieves a file for a given key.
   *
   * @returns A File object that includes the blob data and the filename.
   */
  async get(key: string): Promise<File> {
    const url = await this.getSignedUrl(key)

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept-Encoding': 'deflate',
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to GET ${key}: ${response.statusText}`)
    }

    const blob = await response.blob()

    const file = new File([blob], key)

    return file
  }

  /**
   * Uploads a file or a blob to a given key.
   *
   * @returns void
   */
  async put(key: string, data: File | Blob) {
    const url = new URL(this.endpoint)
    url.pathname = key

    url.searchParams.set('X-Amz-Expires', '3600')

    const signed = await this.client.sign(
      new Request(url, {
        method: 'PUT',
        headers: {},
      }),
      {
        aws: { signQuery: true },
      },
    )

    const response = await fetch(signed.url, {
      method: 'PUT',
      body: data,
    })

    if (!response.ok) {
      throw new Error(`Failed to PUT ${key}: ${response.statusText}`)
    }
  }
}
