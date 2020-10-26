//TODO methods for CRUD: to get, insert, update and delete shopping list items

// ShoppingService is a "Service Object", which is just one way for organizing this code and bundling/encapsulating several methods together to create cleaner, more reusable code for CRUD methods. 
const ShoppingService = {
  getAllItems(knex) {
    return knex.select('*').from('shopping_list')
  },
};

module.exports = ShoppingService;