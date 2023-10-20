import { beforeEach, describe, expect, it } from 'vitest'
import { CloudflareR2Client } from '../src'

describe('CloudflareR2Client', () => {
  let client: CloudflareR2Client

  beforeEach(() => {
    client = new CloudflareR2Client({
      accessKeyId: 'access-key-id',
      secretAccessKey: 'secret-access-key',
      accountId: 'account-id',
      bucket: 'my-bucket',
    })
  })

  it('should generate the right endpoint', () => {
    expect(client.endpoint).toMatchInlineSnapshot(
      '"https://my-bucket.account-id.r2.cloudflarestorage.com"',
    )
  })

  it('should generate a signed url', async () => {
    const signedUrl = await client.getSignedUrl('test.txt')
    expect(signedUrl).toContain(
      'https://my-bucket.account-id.r2.cloudflarestorage.com/test.txt',
    )
    expect(signedUrl).toContain('X-Amz-Expires=3600')
    expect(signedUrl).toContain('X-Amz-Algorithm=AWS4-HMAC-SHA256')
    expect(signedUrl).toContain('X-Amz-Credential=access-key-id')
    expect(signedUrl).toContain('X-Amz-SignedHeaders=accept-encoding%3Bhost')
    expect(signedUrl).toContain('X-Amz-Signature=')
  })
})
