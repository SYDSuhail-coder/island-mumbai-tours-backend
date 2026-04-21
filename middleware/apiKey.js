module.exports = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({ 
      statusCode: 401,
      message: 'Unauthorized - Invalid API Key' 
    });
  }
  next();
};