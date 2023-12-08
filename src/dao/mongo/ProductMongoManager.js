import Product from "./models/productsModel.js";

class ProductMongoManager {
    constructor() {
    
    }

    async getAllProducts () {
        try {
            const product = await Product.find().lean();
            return product;
        } catch(error) {
            throw new Error(`Error al obtener todos los productos ${error}`)
        }
    }

    async getProducts(filter = {}, page = 1, limit = 10, sortField = null, sortOrder = 'asc') {
        try {
            let query = Product.find(filter).lean();
    
            // Ordenamiento
            if (sortField) {
                const sort = {};
                sort[sortField] = sortOrder === 'asc' ? 1 : -1;
                query = query.sort(sort);
            }
    
            // Paginación
            const startIndex = (page - 1) * limit;
            query = query.skip(startIndex).limit(limit);
    
            // Ejecutar la consulta
            const products = await query.exec();
            return products;
        } catch (error) {
            throw new Error(`Error al obtener los productos ${error}`);
        }
    }
    

    async addNewProducts (newProduct) {
        try {
            const productAdd = new Product(newProduct)
            return await productAdd.save();
        } catch (error) {
            throw new Error(`Error al guardar el producto ${error.message}`)
        }
    }

    async deleteProduct(productId) {
        try {   
            return await Product.findByIdAndDelete(productId)
        } catch (error) {
            throw new Error(`Error al eliminar el producto ${productId} ${error.message}`)
        }
    }

    async updateProduct(productId, updatedProductData) {
        const product = await Product.findByIdAndUpdate(productId, updatedProductData, {
          new: true,
        });
        return product;
    }

    async deleteProduct(productId) {
        await Product.findByIdAndDelete(productId);
    }
}

export {ProductMongoManager as ProductMongoManager}