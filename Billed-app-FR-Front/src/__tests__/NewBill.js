/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then ...", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion
      expect(screen.getAllByText('Envoyer une note de frais')).toBeTruthy()//i do this
      expect(screen.getAllByText('Ajouter une image')).toBeTruthy()
      expect(screen.getAllByRole('textbox')).toBeTruthy()
      expect(screen.getAllByRole('combobox')).toBeTruthy()
      expect(screen.getAllByRole('radio')).toBeTruthy()
      expect(screen.getAllByRole('checkbox')).toBeTruthy()
      expect(screen.getAllByRole('button')).toBeTruthy()
      expect(screen.getAllByRole('img')).toBeTruthy()
      expect(screen.getAllByRole('link')).toBeTruthy()
      expect(screen.getAllByRole('list')).toBeTruthy()
      expect(screen.getAllByRole('listitem')).toBeTruthy()
      expect(screen.getAllByRole('heading')).toBeTruthy()
      expect(screen.getAllByRole('progressbar')).toBeTruthy()
      expect(screen.getAllByRole('separator')).toBeTruthy()
      expect(screen.getAllByRole('status')).toBeTruthy()
      expect(screen.getAllByRole('table')).toBeTruthy()
    })
  })
})
