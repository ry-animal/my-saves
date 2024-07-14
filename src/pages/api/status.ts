import type { NextApiRequest, NextApiResponse } from 'next';
import { kv } from '@vercel/kv';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const kvStatus = await checkKVConnection();
      const totalVideos = await kv.llen('all_videos');
      const appVersion = process.env.npm_package_version || 'Unknown';
      const serverTime = new Date().toISOString();

      res.status(200).json({
        status: 'ok',
        kvStore: kvStatus,
        totalVideos,
        appVersion,
        serverTime,
      });
    } catch (error) {
      console.error('error in status check:', error);
      res.status(500).json({
        status: 'error',
        message: 'failed system status',
        error: error instanceof Error ? error.message : 'unknown error',
      });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`${req.method} not allowed`);
  }
}

async function checkKVConnection(): Promise<'connected' | 'disconnected'> {
  try {
    await kv.set('status_check', 'ok');
    const result = await kv.get('status_check');
    return result === 'ok' ? 'connected' : 'disconnected';
  } catch (error) {
    console.error('kv connection check failed:', error);
    return 'disconnected';
  }
}
