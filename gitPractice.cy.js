///<reference types="Cypress"/>
import Homepage from '../PageObject/eCommerce_HomePage.cy'
import ProductPage from '../PageObject/eCommerce_ProductPage.cy'
var productName = require('../../fixtures/eCommerce.json')
import CheckOut from '../PageObject/eCommerce_CheckoutPage.cy'

describe('Practicing on eCommerce webpage', function () {
    const homePage = new Homepage()
    const productPage = new ProductPage()
    const checkOut = new CheckOut()

    before('Loading webpage', function () {
        cy.visit('https://rahulshettyacademy.com/angularpractice/')
        cy.fixture('eCommerce').then((data) => {
            this.data = data
        })
    })
    it('Homepage - eCommerce', function () {
        homePage.getName().click().type(this.data.name)
        homePage.getEmail().type(this.data.email)
        homePage.checkbox().check()
        homePage.genderMale().select(this.data.gender)
        homePage.radioStudent().click()
        homePage.radioEntrepreneur().should('be.disabled')
        homePage.twowayDataBinding().should('have.value', this.data.name)
    })
    it('Shop page - eCommerce', function () {
        homePage.shopPage().click()
        productPage.getProduct().each(($el, index) => {
            const mobileName = $el.text()
            if (productName.product.includes(mobileName)) {
                cy.log('This is "'+mobileName+'"')
                productPage.clickAdd(mobileName).click()
            }
        })
        productPage.checkOut().click()
    })
    it('Checkout Page - eCommerce', function(){
        var sum = 0
        checkOut.productPrice().each((price, index)=>{
            const totalPrice = price.text()
            var res = totalPrice.split(' ')
            res = Number(res[1].trim())
            cy.log(res)
            sum = sum+res
        }).then(function(){
            cy.log(sum)
        })
        checkOut.cartPrice().then((element)=>{
            const value = element.text()
            var totalValue = value.split(' ')
            totalValue = Number(totalValue[1].trim())
            expect(sum).to.equal(totalValue)
        })
        checkOut.checkOutSubmit().click()
        Cypress.config('defaultCommandTimeout',8000)
        checkOut.getCountry().type(productName.deliveryLocation)
        checkOut.selectCountry().click()
        checkOut.agreeCheckbox().click({force:true})        
        checkOut.purchaseButton().click()
        checkOut.successMessage().then((message)=>{
            const success = message.text()
            expect(success.includes('Success')).to.be.true
        })
        cy.log('code completed')
        // 1 line added
        // 2 line added
        // line 3 from dummyGit
        // line 4 from gitPractice
    })
})
