/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then a form should be displayed", () => {

      document.body.innerHTML = NewBillUI()

      const form = screen.getByTestId("form-new-bill")
      expect(form).toBeTruthy()


    })
  })
})
