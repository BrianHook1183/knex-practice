const ArticlesService = require('../src/articles-service');
const knex = require('knex');
const { expect } = require('chai');

/**
 * GENERAL NOTE:
 * Be VERY mindful of the use of _implicit returns_ with arrow functions.
 * Pay careful attention to whether the function utilizes curly braces or
 * not:
 * 
 * () => { 
 *   return db().select();
 * }
 *   vs
 * () => 
 *  db().select()
 * 
 * If you receive a strange error, especially errors concerning hooks, 
 * you have probably NOT returned an async function from one or more
 * of your tests. 
 * 
 */

describe(`Articles service object`, () => {
  let db;
  let testArticles = [
    {
      id: 1,
      date_published: new Date('2029-01-22T16:28:32.615Z'),
      title: 'First test post!',
      content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?'
    },
    {
      id: 2,
      date_published: new Date('2100-05-22T16:28:32.615Z'),
      title: 'Second test post!',
      content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum, exercitationem cupiditate dignissimos est perspiciatis, nobis commodi alias saepe atque facilis labore sequi deleniti. Sint, adipisci facere! Velit temporibus debitis rerum.'
    },
    {
      id: 3,
      date_published: new Date('1919-12-22T16:28:32.615Z'),
      title: 'Third test post!',
      content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Possimus, voluptate? Necessitatibus, reiciendis? Cupiditate totam laborum esse animi ratione ipsa dignissimos laboriosam eos similique cumque. Est nostrum esse porro id quaerat.'
    },
  ];


  // Prepare the database connection using the `db` variable available
  // in the scope of the primary `describe` block. This means `db`
  // will be available in all of our tests.
  before(() => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    });
  });

  // Before all tests run and after each individual test, empty the
  // blogful_articles table
  before('clean db', () => db('blogful_articles').truncate());
  afterEach('clean db', () => db('blogful_articles').truncate());

  // closes database connection after tests are done so you don't have to  Ctrl+C in terminal to kill it 
  after('destroy db connection', () => db.destroy());


  context(`Given 'blogful_articles' has no data`, () => {
    it(`getAlllArticles() resolves an empty array`, () => {
      return ArticlesService.getAllArticles(db)
        .then(actual => {
          expect(actual).to.eql([])
        });
    });

    it(`insertArticle() inserts a new article and resolves the new article with an 'id`, () => {
      const newArticle = {
        title: 'Test new title',
        content: 'Test new content',
        date_published: new Date('2020-01-01T00:00:00.000Z'),
      };
      return ArticlesService.insertArticle(db, newArticle)
        .then(actual => {
          expect(actual).to.eql({
            id: 1,
            title: newArticle.title,
            content: newArticle.content,
            date_published: newArticle.date_published,
          });
        });
    });

    it('throws not-null constraint error if title not provided', () => {
      // Subject for the test does not contain a `title` field, so we
      // expect the database to prevent the record to be added      
      const newArticle = {
        content: 'Test new content',
        date_published: new Date('2020-01-01T00:00:00.000Z'),
      };

      // The .then() method on a promise can optionally take a second argument:
      // The first callback occurs if the promise is resolved, which we've been
      // using for all our promise chains. The second occurs if promise is 
      // rejected. In the following test, we EXPECT the promise to be rejected 
      // as the database should throw an error due to the NOT NULL constraint 
      return ArticlesService
        .insertArticle(db, newArticle)
        .then(
          () => expect.fail('db should throw error'),
          err => expect(err.message).to.include('not-null')
        );
    });

  });

  // Whenever we set a context with data present, we should always include
  // a beforeEach() hook within the context that takes care of adding the
  // appropriate data to our table
  context(`Given 'blogful_articles' has data`, () => {
    beforeEach(() => {
      return db
        .into('blogful_articles')
        .insert(testArticles)
    });

    it(`getAllArticles() resolves all articles from 'blogful_articles' table`, () => {
      return ArticlesService.getAllArticles(db)
        .then(actual => {
          expect(actual).to.eql(testArticles)
        });
    });

    it(`getById() resolves an article by id from 'blogful_articles' table`, () => {
      const thirdId = 3;
      const thirdTestArticle = testArticles[thirdId - 1];
      return ArticlesService.getById(db, thirdId)
        .then(actual => {
          expect(actual).to.eql({
            id: thirdId,
            title: thirdTestArticle.title,
            content: thirdTestArticle.content,
            date_published: thirdTestArticle.date_published,
          });
        });
    });

    it(`deleteArticle() removes an article by id from 'blogful_articles' table`, () => {
      const articleId = 3;
      return ArticlesService.deleteArticle(db, articleId)
        .then(() => ArticlesService.getAllArticles(db))
        .then(allArticles => {
          const expected = testArticles.filter(article => article.id !== articleId)
          expect(allArticles).to.eql(expected)
        });
    });

    it(`updateArticle() updates an article from the 'blogful_articles' table`, () => {
      const idOfArticleToUpdate = 3;
      const newArticleData = {
        title: 'updated title',
        content: 'updated content',
        date_published: new Date(),
      }
      return ArticlesService.updateArticle(db, idOfArticleToUpdate, newArticleData)
        .then(() => ArticlesService.getById(db, idOfArticleToUpdate))
        .then(article => {
          expect(article).to.eql({
            id: idOfArticleToUpdate,
            ...newArticleData,
          });
        });
    });

  });
});