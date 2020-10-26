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


  describe('getAllItems() method', () => {
    context('shopping_list HAS test data', () => {

      // insert test data
      before(() => {
        return db
          .into('shopping_list')
          .insert(testItems)
      });

      it('resolves all items from "shopping_list" table', () => {
        return ShoppingService.getAllItems(db)
          .then(actual => {
            expect(actual).to.eql(testItems)
          });
      });
    });

    context('shopping_list is EMPTY', () => {
      it('resolves an empty array', () => {
        return ShoppingService.getAllItems(db)
          .then(actual => {
            expect(actual).to.eql([])
          });
      });
    });

  });
});