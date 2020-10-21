require('dotenv').config();
const knex = require('knex');

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL
});

// 1. Get all items that contain text
//    A function that takes one parameter for searchTerm which will be any string
//    The function will query the shopping_list table using Knex methods and select the rows which have a name that contains the searchTerm using a case insensitive match.

function searchByName(searchTerm) {
  knexInstance('shopping_list')
    .select('*')
    .where('name', 'ILIKE', `%%${searchTerm}%`)
    .then(result => {
      console.log(result);
    });
}
// searchByName('bacon');



// 2. Get all items paginated
//    A function that takes one parameter for pageNumber which will be a number
//    The function will query the shopping_list table using Knex methods and select the pageNumber page of rows paginated to 6 items per page.

function getPaginatedResult(pageNumber) {
  const productsPerPage = 6;
  const offset = productsPerPage * (pageNumber - 1);
  knexInstance('shopping_list')
    .select('*')
    .limit(productsPerPage)
    .offset(offset)
    .then(result => {
      console.log(result);
    });
};
// getPaginatedResult(1);



// 3. Get all items added after date
//    A function that takes one parameter for daysAgo which will be a number representing a number of days.
//    This function will query the shopping_list table using Knex methods and select the rows which have a date_added that is greater than the daysAgo.

function itemsAfterDate(daysAgo) {
  knexInstance('shopping_list')
    .select('*')
    .where(
      'date_added',
      '>',
      knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo)
    )
    .then(result => {
      console.log(result);
    });
};
// itemsAfterDate(1);



// 4. Get the total cost for each category
//    A function that takes no parameters
//    The function will query the shopping_list table using Knex methods and select the rows grouped by their category and showing the total price for each category.


function totalCategoryCosts() {
  knexInstance('shopping_list')
    .select('category',)
    .groupBy('category')
    .sum('price AS total_price')
    .orderBy([
      { column: 'total_price', order: 'DESC' }
    ])
    .then(result => {
      console.log(result);
    });
};
totalCategoryCosts();