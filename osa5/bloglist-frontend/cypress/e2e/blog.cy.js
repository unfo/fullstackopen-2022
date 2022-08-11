describe('Blog app', function() {
  const user = {
    name: 'jan wikholm',
    username: 'cypress',
    password: 'hill' // only for local cypress tests, not a leaked secret.
  };
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset');
    cy.request('POST', 'http://localhost:3003/api/users/', user);
    cy.visit('http://localhost:3000');
  });

  it('Login form is shown', function() {
    cy.contains('Login required');
    cy.get('input#username').should('be.visible');
    cy.get('input#password').should('be.visible');
  });
  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('input#username').type(user.username);
      cy.get('input#password').type(user.password);
      cy.get('form')
        .contains('Login')
        .click()
        .then(() => {
          cy.contains(`${user.name} logged in`);
        });
    });

    it('fails with wrong credentials', function() {
      cy.get('input#username').type('groucho');
      cy.get('input#password').type('swordfish');
      cy.get('form')
        .contains('Login')
        .click()
        .then(() => {
          cy.contains('wrong credentials');
        });
    });
  });
  describe('When logged in', function() {
    const blog = {
      title: 'Welcome to my TED talk',
      author: 'Speaker for the dead',
      url: 'https://www.ted.com/',
    };

    beforeEach(function() {
      cy.login({ username: user.username, password: user.password });
    });

    it('A blog can be created', function() {
      cy.contains('add blog')
        .click()
        .then(() => {
          cy.get('input#title').type(blog.title);
          cy.get('input#author').type(blog.author);
          cy.get('input#url').type(blog.url);
        })
        .then(() => {
          cy.get('input#create-blog').click();
        })
        .then(() => {
          cy.contains('New blog added');
          cy.get('div.blog')
            .contains(`${blog.title} - ${blog.author}`);
        });
    });
    describe('When blogs exist', function() {
      beforeEach(function() {
        cy.createBlog(blog);
      });

      it('A blog can be liked', function() {
        cy.get('div.blog:first').as('blog');
        cy.get('@blog').get('button.openDetails').click()
          .then(() => {
            cy.get('@blog')
              .get('button.smashThatLikeButton')
              .click()
              .wait(500)
              .click()
              .wait(500)
              .click();
          })
          .then(() => {
            cy.get('@blog').contains('3 like(s)');
          });
      });
      it('A blog can be removed', function() {
        cy.on('window:confirm', (str) => {
          expect(str).to.match(/^Remove/);
          return true;
        });
        cy.get('div.blog:first').as('blog');
        cy.get('@blog').get('button.openDetails').click()
          .then(() => {
            cy.get('@blog').contains('delete blog').click();
          })
          .then(() => {
            cy.get('.blog').should('have.length', 0);
          });

      });
    });
  });
});