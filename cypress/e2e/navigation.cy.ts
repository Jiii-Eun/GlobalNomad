// 테스트용
describe("Navigation", () => {
  it("홈에서 어바웃 페이지로 이동한다", () => {
    cy.visit("/"); // http://localhost:3000

    cy.get('a[href*="about"]').click();

    cy.url().should("include", "/about");
    cy.get("h1").contains("About");
  });
});
