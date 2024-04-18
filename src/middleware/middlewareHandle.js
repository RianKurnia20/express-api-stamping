const jwt = require('jsonwebtoken');

const logRequest = (req, res, next) => {
  console.log('Log Request to this path', req.path)
  next()
}

const errorMessage = (err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ message: 'Internal Server Error' });
}

// Middleware autentikasi
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.status(401).json({
    message: 'Unauthorized'
  }); // Unauthorized

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({
      message : 'Token not valid or expired'
    }); // Forbidden
    req.user = user; // Simpan data pengguna dalam objek request
    next();
  });
};

// Middleware check permissions
const checkPermission = (role) => {
  return (req, res, next) => {
    // Dapatkan peran pengguna dari token JWT atau dari data pengguna yang diautentikasi
    const userRole = req.user.role;
    console.log(userRole)
    // Periksa izin pengguna
    if (userRole !== role) {
      return res.status(403).json({
        message: 'Unauthorized account roles',
      }); // Akses ditolak
    }

    // Lanjutkan ke middleware berikutnya jika pengguna memiliki izin yang diperlukan
    next();
  };
};

// CORS middleware
const allowCrossDomain = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
};


module.exports = {
  logRequest,
  errorMessage,
  checkPermission,
  authenticateToken,
  allowCrossDomain
}