const ArticlesService = {
  getAllArticles(knex) {
    return knex.select('*').from('blogful_articles')
  },
  insertArticle() {
    return Promise.resolve({})
  }
};

module.exports = ArticlesService;