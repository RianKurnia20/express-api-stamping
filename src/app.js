require('dotenv').config()
const PORT = process.env.PORT || 5000
const express = require('express');

// import routing
const authRoutes = require('./routes/auth.js');
const usersRoutes = require('./routes/users.js');
const productionRoutes = require('./routes/production.js');
const machineRoutes = require('./routes/machine.js');
const productRoutes = require('./routes/product.js');
const kanagataRoutes = require('./routes/kanagata.js');
const statusRoutes = require('./routes/status.js');
const problemRoutes = require('./routes/problem.js');
const finalStatusRoutes = require('./routes/finalStatus.js');
const pcaRoutes = require('./routes/pca.js');

// import middleware
const middlewareHandle = require('./middleware/middlewareHandle.js');

const app = express();

// Middleware used
app.use(middlewareHandle.errorMessage) // error message
app.use(middlewareHandle.logRequest) // log request

// ALLOW JSON RESPONSE AND PUBLIC FOLDER
app.use(express.json())
app.use(express.static('public'));

// ROUTES
app.use('/auth', authRoutes) // auth login ✔
app.use('/users', usersRoutes) // users endpoint ✔

// productions endpoint ❌
app.use(
  '/productions',
  middlewareHandle.authenticateToken,
  middlewareHandle.checkPermission('admin'),
  // middlewareHandle.paginateResults,
  productionRoutes
)
app.use('/machine', machineRoutes) // machines endpoint ✔
app.use('/product', productRoutes) // product endpoint ✔
app.use('/kanagata', kanagataRoutes) // kanagata endpoint ✔
app.use('/status', statusRoutes) // status endpoint ✔
app.use('/problem', problemRoutes) // problem endpoint ✔
app.use('/final_status', finalStatusRoutes) // final status endpoint ✔
app.use('/pca', pcaRoutes) // pca endpoint ✔
// Run service REST API
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
});
