// ShoppingService is a "Service Object", which is just one way for organizing this code and bundling/encapsulating several methods together to create cleaner, more reusable code for CRUD methods. 
const ShoppingService = {
  getAllItems(knex) {
    return knex.select('*').from('shopping_list')
  },
  addItem(knex, newItem) {
    return knex
      .insert(newItem)
      .into('shopping_list')
      .returning('*')
      .then(rows => {
        return rows[0]
      });
  },
  getById(knex, id) {
    return knex.from('shopping_list').select('*').where('id', id).first()
  },
  deleteItem(knex, id) {
    return knex('shopping_list')
      .where({ id })
      .delete()
  },
  updateItem(knex, id, newItemFields) {
    return knex('shopping_list')
      .where({ id })
      .update(newItemFields)
  },
};

module.exports = ShoppingService;