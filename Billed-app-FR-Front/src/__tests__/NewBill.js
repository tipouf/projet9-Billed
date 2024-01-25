/**
 * @jest-environment jsdom
 */

import { screen, fireEvent, waitFor } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import router from "../app/Router.js";
import {ROUTES, ROUTES_PATH } from "../constants/routes";

describe("Given I am connected as an employee", () => {
	describe("When I am on NewBills Page", () => {
		test("Then bill icon in vertical layout should be highlighted", async () => {
	
		  Object.defineProperty(window, 'localStorage', { value: localStorageMock })
		  window.localStorage.setItem('user', JSON.stringify({
			type: 'Employee'
		  }))
		  const root = document.createElement("div")
		  root.setAttribute("id", "root")
		  document.body.append(root)
		  router()
		  window.onNavigate(ROUTES_PATH.Bills)
		  await waitFor(() => screen.getByTestId('icon-mail'))
		  const mailIcon = screen.getByTestId('icon-mail')
		  console.log(mailIcon);
		  expect(mailIcon.classList.contains("active-icon")).toBe(true);
		})
	  })
  describe("When I am on NewBill Page", () => {
    test("Then a form should be displayed", () => {

      document.body.innerHTML = NewBillUI()

      const form = screen.getByTestId("form-new-bill")
			const type = screen.getAllByTestId("expense-type");
			const name = screen.getAllByTestId("expense-name");
			const date = screen.getAllByTestId("datepicker");
			const amount = screen.getAllByTestId("amount");
			const vat = screen.getAllByTestId("vat");
			const pct = screen.getAllByTestId("pct");
			const commentary = screen.getAllByTestId("commentary");
			const file = screen.getAllByTestId("file");
			const sendButton = document.querySelector("#btn-send-bill");

			expect(form).toBeTruthy();
			expect(type).toBeTruthy();
			expect(name).toBeTruthy();
			expect(date).toBeTruthy();
			expect(amount).toBeTruthy();
			expect(vat).toBeTruthy();
			expect(pct).toBeTruthy();
			expect(commentary).toBeTruthy();
			expect(file).toBeTruthy();
			expect(sendButton).toBeTruthy();

			expect(screen.getAllByText("Envoyer ")).toBeTruthy(); //to check


    })
  })

  describe("When I am on NewBill Page and I click on send", () => {
	test("Then a new bill should be created", () => {
		window.localStorage.setItem('user', JSON.stringify({
			type: 'Employee'
		}))
		document.body.innerHTML = NewBillUI()
		const onNavigate = (pathname) => {
			document.body.innerHTML = ROUTES({ pathname })
		}

		const newBill = new NewBill({
			document, onNavigate, store: null, localStorage: window.localStorage
		})
		
		const handleChangeFile = jest.fn(() => newBill.handleChangeFile);

		const sendButton = document.querySelector("#btn-send-bill");
		const file = screen.getAllByTestId("file")[0];
		file.addEventListener("change", handleChangeFile);
		fireEvent.click(sendButton);

		expect(handleChangeFile).toHaveBeenCalled();

		expect(screen.getAllByText("Envoyer ")).toBeTruthy();
	})

  })

})
