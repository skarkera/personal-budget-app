 /// <reference types="cypress" />
 
/* context('./homepage', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5000')
  })
  it('should have Welcome! in the h1', () => {
    cy.get('h1').contains('Welcome!')
  })
  it('should look the same', () => {
    cy.eyesOpen({
      appName: "Personal Budget",
      testName: 'Homepage Check'
    })
    cy.eyesCheckWindow();
    cy.eyesClose();
  })
})   */

/* describe('The Home Page', () => {
  it('successfully loads', () => {
    expect(true).to.equal(true)
   // cy.visit('http://localhost:5000') // change URL to match your dev URL
  })
} */
  

/*  describe('My First Test', () => {
  it('Does not do much!', () => {
    expect(true).to.equal(true)
  })
}) */

describe('My First Test', () => {
  it('Visits website', () => {
    cy.visit('http://localhost:5000')
  })
})