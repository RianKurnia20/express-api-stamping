const productModel = require('../models/productModel.js');
const pcaModel = require('../models/pcaModel.js')

const handleResponse = (res, message, status = 200, data = null) => {
  if (data !== null) {
    res.status(status).json({ message, data });
  } else {  
    res.status(status).json({ message });
  };
}

const handleError = (res, error) => {
  console.error('Error:', error);
  res.status(500).json({ message: 'Server Error' });
};

const newProduct= async (req, res) => {
  const { id_product , name, price } = req.body;
  try {
    if( !id_product || !name ){
      return handleResponse(res, 'All fields are required', 400)
    }

    const existingProduct = await productModel.findProductById(id_product);
    if (existingProduct[0]) {
      return handleResponse(res, 'Product already exists', 400)
    }

    await productModel.addProduct(id_product, name, price)
    handleResponse(res, 'Create new product data successfully')
  } catch (error) {
    handleError(res, error)
  }
}

const updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const { id_product, name, price } = req.body;

    if (!name) {
      return handleResponse(res, 'ID product and name are required fields', 400);
    }

    const checkOldProduct = await productModel.findProductById(id);
    if (!checkOldProduct[0]) {
      return handleResponse(res, 'Product with id: ' + id + ' not found', 404 );
    }

    if(id_product !== ""){
      const checkNewProduct = await productModel.findProductById(id_product)
      if(checkNewProduct[0]){
        return handleResponse(res, 'Product with id: ' + id_product + ' already exist ', 400);
      }
    }else{
      req.body.id_product = id
    }
    
    await productModel.updateProductById(id, req.body)
    handleResponse(res, 'Update product data successfully')
  } catch (error) {
    handleError(res, error)
  }
};

const getAllProducts = async(req, res) => {
  try {
    const products = await productModel.getAllProduct();
    const data = products.length === 0 ? 'No product data available, add some product data' : products
    handleResponse(res, 'Success' , 200 , data)
  } catch (error) {
    handleError(res, error)
  }
}

const deleteProduct = async(req, res) => {
  try {
    const checkProductId = await productModel.findProductById(req.params.id);
    if (!checkProductId[0]) {
      return handleResponse(res, 'Product with id: ' + req.params.id + ' not found', 404);
    }

    const deleted = await productModel.deleteProductByid(req.params.id)
    const message = deleted ? 'Product deleted successfully' : 'Product not found'
    handleResponse(res, message)
  } catch (error) {
    handleError(res, error)
  }
}

// const deleteProduct = async(req, res) => {
//   try {
//     const checkProductId = await productModel.findProductById(req.params.id);
//     if (!checkProductId[0]) {
//       return handleResponse(res, 'Product with id: ' + req.params.id + ' not found', 404);
//     }

//     const validasi = await pcaModel.getPcaByIdProduct(req.params.id);
//     if(!validasi[0]){
//       const deleted = await productModel.deleteProductByid(req.params.id)
//       const message = deleted ? 'Product deleted successfully' : 'Product not found'
//       handleResponse(res, message)
//     }else{
//       const message = 'Data linked to another table'
//       handleResponse(res, message)
//     }

//   } catch (error) {
//     handleError(res, error)
//   }
// }

module.exports = {
  newProduct,
  updateProduct,
  getAllProducts,
  deleteProduct
}