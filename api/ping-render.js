export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Ping the Render backend
    const response = await fetch('https://article-managment-backend.onrender.com', {
      method: 'GET',
      headers: {
        'User-Agent': 'Vercel-Cron-Job'
      }
    });

    console.log(`Ping sent at ${new Date().toISOString()}, Status: ${response.status}`);

    return res.status(200).json({ 
      message: 'Ping sent successfully',
      status: response.status,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error pinging Render backend:', error);
    return res.status(500).json({ 
      message: 'Error pinging Render backend',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
