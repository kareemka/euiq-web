import {describe, it, expect, vi} from 'vitest';
import {createHmac} from 'node:crypto';
import {sendText, recipient, orderMessage, ProviderError} from '../../../../supabase/functions/_shared/spwp';
import {verifyAuthHook, verifySpwp} from '../../../../supabase/functions/_shared/security';

describe('server WhatsApp integration', () => {
  it('normalizes verified Iraqi recipients and rejects arbitrary recipients', () => {
    expect(recipient('+9647701234567')).toBe('9647701234567');
    expect(() => recipient('9647701234567@g.us')).toThrow();
  });
  it('sends provider credentials only as a server header', async () => {
    const fetcher = vi.fn(async () => Response.json({data: {id: 'message-id'}}, {status: 202}));
    expect(await sendText('https://api.spwp.app/api/v1', 'test-only', '+9647701234567', 'test', fetcher)).toBe('message-id');
    const options = (fetcher.mock.calls as unknown as [URL, RequestInit][])[0][1];
    expect(options.headers).toMatchObject({'X-API-Key': 'test-only'});
    expect(JSON.parse(options.body as string)).toEqual({to: '9647701234567', text: 'test'});
    await expect(sendText('https://example.com', 'test-only', '+9647701234567', 'test', fetcher)).rejects.toThrow();
  });
  it('preserves provider status for retry decisions and rejects incomplete acceptance', async () => {
    await expect(sendText('https://api.spwp.app/api/v1', 'test-only', '+9647701234567', 'test', async () => Response.json({code: 'RATE_LIMITED'}, {status: 429}))).rejects.toBeInstanceOf(ProviderError);
    await expect(sendText('https://api.spwp.app/api/v1', 'test-only', '+9647701234567', 'test', async () => Response.json({data: {}}, {status: 202}))).rejects.toThrow('INVALID_PROVIDER_RESPONSE');
  });
  it('formats order states without private addresses or internal problem notes', () => {
    expect(orderMessage({order_number: 100001, order_status: 'shipping'})).toContain('في الطريق');
    expect(() => orderMessage({order_number: 100001, order_status: 'invalid'})).toThrow();
  });
  it('verifies Auth hook signatures and rejects tampering and replay', async () => {
    const now = Date.now(), timestamp = String(Math.floor(now / 1000)), raw = '{"sms":{"otp":"123456"}}';
    const secret = Buffer.from('a-test-signing-secret').toString('base64');
    const signature = createHmac('sha256', Buffer.from(secret, 'base64')).update(`test-id.${timestamp}.${raw}`).digest('base64');
    const headers = new Headers({'webhook-id': 'test-id', 'webhook-timestamp': timestamp, 'webhook-signature': `v1,${signature}`});
    expect(await verifyAuthHook(raw, headers, `v1,whsec_${secret}`, now)).toBe(true);
    expect(await verifyAuthHook(raw + ' ', headers, `v1,whsec_${secret}`, now)).toBe(false);
    expect(await verifyAuthHook(raw, headers, `v1,whsec_${secret}`, now + 301000)).toBe(false);
  });
  it('verifies SPWP raw-body signatures and rejects mismatched timestamps', async () => {
    const now = Date.now(), raw = '{"event":"MESSAGE_STATUS"}', secret = 'test-secret';
    const signature = createHmac('sha256', secret).update(`${now}.${raw}`).digest('hex');
    const headers = new Headers({'x-wa-timestamp': String(now), 'x-wa-signature': `t=${now},v1=${signature}`});
    expect(await verifySpwp(raw, headers, secret, now)).toBe(true);
    expect(await verifySpwp(raw + ' ', headers, secret, now)).toBe(false);
    expect(await verifySpwp(raw, headers, secret, now + 301000)).toBe(false);
  });
});
