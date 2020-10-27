const { expect } = require("chai");
const ShoppingService = require('../src/shopping-service');
const knex = require('knex');


describe('ShoppingService Service Object', () => {
  let db;
  let testItems = [
    {
      id: 1,
      name: 'Ghost Beef',
      price: '4.33',
      date_added: new Date('2029-01-22T16:28:32.615Z'),
      checked: false,
      category: 'Main'
    },
    {
      id: 2,
      name: 'Cheatloaf',
      price: '5.00',
      date_added: new Date('2100-05-22T16:28:32.615Z'),
      checked: true,
      category: 'Main'
    },
    {
      id: 3,
      name: 'Fried Trickin',
      price: '6.40',
      date_added: new Date('1919-12-22T16:28:32.615Z'),
      checked: false,
      category: 'Snack'
    },
  ];

  // initially establish db connection
  before(() => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    });
  });

  // initially clear table
  before(() => db('shopping_list').truncate());

  // clear table after each test
  afterEach(() => db('shopping_list').truncate());

  // end db connection
  after(() => db.destroy());


  context('shopping_list HAS test data', () => {
    // insert test data
    beforeEach(() => {
      return db
        .into('shopping_list')
        .insert(testItems)
    });

    describe('getAllItems() method', () => {
      it('resolves all items from "shopping_list" table', () => {
        return ShoppingService.getAllItems(db)
          .then(actual => {
            expect(actual).to.eql(testItems)
          });
      });
    });

    describe('getById() method', () => {
      it(`resolves an item by id from 'shopping_list' table`, () => {
        const thirdId = 3;
        const thirdTestItem = testItems[thirdId - 1];
        return ShoppingService.getById(db, thirdId)
          .then(actual => {
            expect(actual).to.eql({
              id: thirdId,
              name: thirdTestItem.name,
              price: thirdTestItem.price,
              date_added: thirdTestItem.date_added,
              checked: thirdTestItem.checked,
              category: thirdTestItem.category,
            });
          });
      });
    });

    describe('deleteItem() method', () => {
      it('deletes an item by id', () => {
        const itemId = 3;
        return ShoppingService.deleteItem(db, itemId)
          .then(() => ShoppingService.getAllItems(db))
          .then(allItems => {
            // copy the test item array without the "deleted" item
            const expected = testItems.filter(item => item.id !== itemId);
            expect(allItems).to.eql(expected)
          });
      });
    });

    describe('updateItem() method', () => {
      it('updates an item by id with test data', () => {
        const itemId = 3;
        const newItemData = {
          name: 'Updated Name',
          price: '99.99',
        };
        const originalItem = testItems[itemId - 1];
        return ShoppingService.updateItem(db, itemId, newItemData)
          .then(() => ShoppingService.getById(db, itemId))
          .then(item => {
            expect(item).to.eql({
              id: itemId,
              ...originalItem,
              ...newItemData,
            });
          });
      });
    });
  });

  context('shopping_list is EMPTY', () => {

    describe('getAllItems() method', () => {
      it('resolves an empty array', () => {
        return ShoppingService.getAllItems(db)
          .then(actual => {
            expect(actual).to.eql([])
          });
      });
    });

    describe('addItem() method', () => {
      it('adds an item and resolves with an id', () => {
        const newItem = testItems[0];
        return ShoppingService.addItem(db, newItem)
          .then(actual => {
            expect(actual).to.eql(newItem)
          });
      });
    });
  });

});