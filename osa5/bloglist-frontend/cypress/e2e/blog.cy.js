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
});