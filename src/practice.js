require('dotenv').config();
const knex = require('knex');

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL
});

// knexInstance.from('amazong_products').select('*')
//   .then(result => {
//     console.log(result)
//   });


// ------------------------------------------------------------------------------------
// Building queries

// const qry = knexInstance
//   .select('product_id', 'name', 'price', 'category')
//   .from('amazong_products')
//   .where({ name: 'Point of view gun' })
//   .first()
//   .toQuery()
// console.log(qry)

// const qry = knexInstance
//   .select('product_id', 'name', 'price', 'category')
//   .from('amazong_products')
//   .where({ name: 'Point of view gun' })
//   .toQuery()
//   .then(result => {
//     console.log(result);
//   });

// Building queries
// ------------------------------------------------------------------------------------
// Searching Amazong products
//* You need to build a query that allows customers to search the amazong_products table for products that contain a word... I'll tell you the word later. Hurry hurry! 


//* Here's how the knex query looks using the methods we've introduced
// const searchTerm = 'holo';
// knexInstance
//   .select('product_id', 'name', 'price', 'category')
//   .from('amazong_products')
//   .where('name', 'ILIKE', `%${searchTerm}%`)
//   .then(result => {
//     console.log(result)
//   });

//* We'll put it in a function that accepts the searchTerm as a parameter so that we can use the word that Michael decides when he's ready.
// const searchTerm = 'holo';
// function searchByProduceName(searchTerm) {
//   knexInstance
//     .select('product_id', 'name', 'price', 'category')
//     .from('amazong_products')
//     .where('name', 'ILIKE', `%${searchTerm}%`)
//     .then(result => {
//       console.log(result);
//     });
// };
// searchByProduceName('holo');

// Searching Amazong products
// ------------------------------------------------------------------------------------
// Paginating Amazong products
//* You need to build a query that allows customers to paginate the amazong_products table products, 10 products at a time. 

// function paginateProducts(page) {
//   const productsPerPage = 10;
//   const offset = productsPerPage * (page - 1);
//   knexInstance
//     .select('product_id', 'name', 'price', 'category')
//     .from('amazong_products')
//     .limit(productsPerPage)
//     .offset(offset)
//     .then(result => {
//       console.log(result);
//     });
// };
// paginateProducts(3);

// Paginating Amazong products
// ------------------------------------------------------------------------------------
// Filter Amazong products that have images
//* You need to build a query that allows customers to filter the amazong_products table for products that have images.

// function getProductsWithImages() {
//   knexInstance
//     .select('product_id', 'name', 'price', 'category', 'image')
//     .from('amazong_products')
//     .whereNotNull('image')
//     .then(result => {
//       console.log(result);
//     });
// };
// getProductsWithImages();



// Filter Amazong products that have images
// ------------------------------------------------------------------------------------
// Find the most popular Whopipe videos
//* You need to build a query that allows customers to see the most popular videos by views at Whopipe by region for the last 30 days. 

function mostPopularVideosForDays(days) {
  knexInstance
    .select('video_name', 'region')
    .count('date_viewed AS views')
    .where(
      'date_viewed',
      '>',
      knexInstance.raw(`now() - '?? days'::INTERVAL`, days)
    )
    .from('whopipe_video_views')
    .groupBy('video_name', 'region')
    .orderBy([
      { column: 'region', order: 'ASC' },
      { column: 'views', order: 'DESC' },
    ])
    .then(result => {
      console.log(result);
    });
};
mostPopularVideosForDays(30);


// Find the most popular Whopipe videos
// ------------------------------------------------------------------------------------