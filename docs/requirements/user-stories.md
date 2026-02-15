# User Stories

## Epic

E-commerce Shopping Cart System

## Summary

This epic encompasses the complete shopping cart functionality for an e-commerce platform, enabling customers to add, view, modify, and manage their product selections before checkout. The feature includes core cart operations, persistence across sessions, promotional code support, shipping estimation, and advanced features like save-for-later functionality. This comprehensive shopping cart system will improve user experience and increase conversion rates by providing a smooth and flexible shopping experience.

## Stories

### US-001: Add items to shopping cart

**Priority:** high
**Story Points:** 5

**Description:**
As a customer, I want to add products to my shopping cart so that I can purchase multiple items in a single transaction

**Acceptance Criteria:**
- [ ] Given I am viewing a product page, when I click the 'Add to Cart' button, then the item should be added to my cart
- [ ] Given I add an item to my cart, when the item is successfully added, then I should see a confirmation message
- [ ] Given I add an item that's already in my cart, when I add it again, then the quantity should increase by 1
- [ ] Given I am on any page, when I have items in my cart, then I should see a cart icon with the total number of items

### US-002: View shopping cart contents

**Priority:** high
**Story Points:** 3

**Description:**
As a customer, I want to view all items in my shopping cart so that I can review my selections before checkout

**Acceptance Criteria:**
- [ ] Given I have items in my cart, when I click on the cart icon, then I should see a list of all items with their details
- [ ] Given I am viewing my cart, when I look at each item, then I should see the product name, image, price, and quantity
- [ ] Given my cart is empty, when I view my cart, then I should see a message indicating the cart is empty
- [ ] Given I am viewing my cart, when I look at the bottom, then I should see the total price of all items

### US-003: Update item quantities in cart

**Priority:** high
**Story Points:** 5

**Description:**
As a customer, I want to change the quantity of items in my cart so that I can adjust my order before purchasing

**Acceptance Criteria:**
- [ ] Given I am viewing my cart, when I change the quantity of an item, then the item quantity should update immediately
- [ ] Given I update an item quantity, when the quantity changes, then the subtotal and total should recalculate automatically
- [ ] Given I set an item quantity to 0, when I confirm the change, then the item should be removed from my cart
- [ ] Given I try to set a quantity greater than available stock, when I attempt to update, then I should see an error message

### US-004: Remove items from cart

**Priority:** medium
**Story Points:** 3

**Description:**
As a customer, I want to remove items from my shopping cart so that I can eliminate products I no longer wish to purchase

**Acceptance Criteria:**
- [ ] Given I am viewing my cart, when I click the 'Remove' button on an item, then the item should be deleted from my cart
- [ ] Given I remove an item, when the item is deleted, then the cart total should update to reflect the change
- [ ] Given I remove an item, when the deletion is complete, then I should see a confirmation message
- [ ] Given I remove the last item in my cart, when the cart becomes empty, then I should see an empty cart message

### US-005: Persist cart across sessions

**Priority:** medium
**Story Points:** 8

**Description:**
As a customer, I want my cart items to be saved when I leave the site so that I can continue shopping later without losing my selections

**Acceptance Criteria:**
- [ ] Given I have items in my cart, when I close my browser and return later, then my cart items should still be there
- [ ] Given I am a logged-in user, when I access my account from a different device, then I should see my saved cart items
- [ ] Given I am a guest user, when I return to the site on the same device, then my cart should persist for up to 30 days
- [ ] Given my cart has been inactive for 30 days, when I return, then the cart should be cleared

### US-006: Apply discount codes to cart

**Priority:** medium
**Story Points:** 5

**Description:**
As a customer, I want to apply discount codes to my cart so that I can receive promotional savings on my purchase

**Acceptance Criteria:**
- [ ] Given I am viewing my cart, when I enter a valid discount code and click 'Apply', then the discount should be applied to my total
- [ ] Given I enter an invalid discount code, when I try to apply it, then I should see an error message
- [ ] Given I have a discount applied, when I view my cart, then I should see the original total, discount amount, and new total
- [ ] Given I have applied a discount, when I want to remove it, then I should be able to click a 'Remove' button next to the discount

### US-007: Estimate shipping costs

**Priority:** low
**Story Points:** 5

**Description:**
As a customer, I want to see estimated shipping costs in my cart so that I can understand the total cost before proceeding to checkout

**Acceptance Criteria:**
- [ ] Given I have items in my cart, when I enter my zip code, then I should see estimated shipping costs
- [ ] Given I view shipping estimates, when I see the options, then I should see different shipping methods with their costs and delivery times
- [ ] Given I select a shipping method, when I make my choice, then the cart total should update to include shipping costs
- [ ] Given I haven't entered a shipping address, when I view my cart, then I should see a prompt to enter my location for shipping estimates

### US-008: Save items for later

**Priority:** low
**Story Points:** 3

**Description:**
As a customer, I want to move items from my cart to a 'saved for later' list so that I can purchase them at a future time without losing track of them

**Acceptance Criteria:**
- [ ] Given I am viewing my cart, when I click 'Save for Later' on an item, then the item should move to a separate saved items section
- [ ] Given I have saved items, when I view my cart page, then I should see a 'Saved for Later' section below my cart
- [ ] Given I have saved items, when I want to move an item back to my cart, then I should be able to click 'Move to Cart'
- [ ] Given I view my saved items, when I want to remove a saved item permanently, then I should be able to delete it

