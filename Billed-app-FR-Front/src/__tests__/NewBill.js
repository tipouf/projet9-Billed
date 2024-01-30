/**
 * @jest-environment jsdom
 */

import { screen, fireEvent, waitFor } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import mockStore from "../__mocks__/store.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import router from "../app/Router.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes";

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.NewBill);
      const mailIcon = await waitFor(() => screen.getByTestId("icon-mail"));
     const form = screen.getByTestId("form-new-bill");
	  expect(form.length).toBe(9); 
	  expect(mailIcon.classList.contains("active-icon")).toBe(true);
    });
  });


  describe("When I am on NewBill Page", () => {
    test("Then a form should be displayed", () => {
      document.body.innerHTML = NewBillUI();

      const form = screen.getByTestId("form-new-bill");
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
	});
  });
  
  describe("When I am on NewBill Page and I want upload a good format image", () => {
    test("Then a file should be uploaded", () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      document.body.innerHTML = NewBillUI();
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      const newBill = new NewBill({
        document,
        onNavigate,
        store: null,
        localStorage: window.localStorage,
      });

      const handleChangeFile = jest.fn(() => newBill.handleChangeFile);

      const file = screen.getByTestId("file");
      file.addEventListener("change", handleChangeFile);

      fireEvent.change(file, {
        target: {
          files: [new File(["image.jpg"], "image.jpg", { type: "image/jpg" })],
        },
      });

      window.alert = jest.fn();
	  jest.spyOn(window, "alert");

	  const createMocked = jest.fn(() => newBill.createBill);
	  const handleSubmit = jest.fn(() => createMocked());
	  const form = screen.getByTestId("form-new-bill");
	  form.addEventListener("submit", handleSubmit);
	  fireEvent.submit(form);

	  expect(handleSubmit).toHaveBeenCalled();
	  expect(createMocked).toHaveBeenCalled();


      expect(handleChangeFile).toHaveBeenCalled();
      expect(file.files[0].type).toBe("image/jpg");
	  expect(window.alert).not.toHaveBeenCalled();
	  
    });
  });

  describe("When I am on NewBill Page and I want upload a bad format image", () => {
    test("Then a file should not be uploaded", () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      document.body.innerHTML = NewBillUI();
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      const newBill = new NewBill({
        document,
        onNavigate,
        store: null,
        localStorage: window.localStorage,
      });

      const handleChangeFile = jest.fn(() => newBill.handleChangeFile);

      const file = screen.getByTestId("file");
      file.addEventListener("change", handleChangeFile);

      window.alert = jest.fn();

      fireEvent.change(file, {
        target: {
          files: [new File(["image.pdf"], "image.pdf", { type: "file/pdf" })],
        },
      });

      expect(window.alert).toHaveBeenCalled();
      expect(handleChangeFile).toHaveBeenCalled();
      expect(file.files[0].name).toBe("image.pdf");
      expect(file.files[0].type).toBe("file/pdf");
	  expect(newBill.pictureTypeValid).toBe(undefined);
    });
  });

  describe("When I am on NewBill Page and I click on send", () => {
    test("Then the handleSubmit function should be called", () => {
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      document.body.innerHTML = NewBillUI();
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      const newBill = new NewBill({
        document,
        onNavigate,
        store: null,
        localStorage: window.localStorage,
      });
      const handleSubmit = jest.fn(() => newBill.handleSubmit);
	  newBill.fileName = "preview-facture-free-201801-pdf-1.jpg";
	  newBill.fileUrl = "https://test.storage.tld/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=4df6ed2c-12c8-42a2-b013-346c1346f732";

	  const form = screen.getByTestId("form-new-bill");
	  form.addEventListener("submit", handleSubmit);
	  fireEvent.submit(form);
	  expect(handleSubmit).toHaveBeenCalled();
    });
  });
});


//POST
describe("When I am connected as an Employee", () => {
  describe("Given I am on NewBill Page and I submit a new bill", () => {
    test("Then it should create a new bill", async () => {
      const postSpy = jest.spyOn(mockStore, "bills");
	  const bill = {
		id: "47qAXb6fIm2zOKkLzMro",
		vat: "80",
		fileUrl: "https://firebasestorage.googleapis.com/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a",
		status: "pending",
		type: "Hôtel et logement",
		commentary: "séminaire billed",
		name: "encore",
		fileName: "preview-facture-free-201801-pdf-1.jpg",
		date: "2004-04-04",
		amount: 400,
		commentAdmin: "ok",
		email: "a@a",
		pct: 20,
	};
      const postBills = await mockStore.bills().update(bill);
      expect(postSpy).toHaveBeenCalledTimes(1);

	  expect(postBills).toEqual(bill);
    });
    describe("When an error occurs", () => {
      beforeEach(() => {
        window.localStorage.setItem(
          "user",
          JSON.stringify({
            type: "Employee",
          })
        );

        document.body.innerHTML = NewBillUI();
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };
      });
      test("Add bills from an API and fails with 404 message error", async () => {
        const postSpy = jest.spyOn(console, "error");

        const store = {
          bills: jest.fn(() => newBill.store),
          create: jest.fn(() => Promise.resolve({})),
          update: jest.fn(() => Promise.reject(new Error("404"))),
        };

        const newBill = new NewBill({
          document,
          onNavigate,
          store,
          localStorage,
        });
        newBill.pictureTypeValid = true;

        const form = screen.getByTestId("form-new-bill");
        const handleSubmit = jest.fn((e) => newBill.handleSubmit(e));
        form.addEventListener("submit", handleSubmit);

        fireEvent.submit(form);
        await new Promise(process.nextTick);
        expect(postSpy).toHaveBeenCalledWith(new Error("404"));
      });
      test("Add bills from an API and fails with 500 message error", async () => {
        const postSpy = jest.spyOn(console, "error");

        const store = {
          bills: jest.fn(() => newBill.store),
          create: jest.fn(() => Promise.resolve({})),
          update: jest.fn(() => Promise.reject(new Error("500"))),
        };

        const newBill = new NewBill({
          document,
          onNavigate,
          store,
          localStorage,
        });
        newBill.pictureTypeValid = true;

        const form = screen.getByTestId("form-new-bill");
        const handleSubmit = jest.fn((e) => newBill.handleSubmit(e));
        form.addEventListener("submit", handleSubmit);

        fireEvent.submit(form);
        await new Promise(process.nextTick);
        expect(postSpy).toHaveBeenCalledWith(new Error("500"));
      });
    });
  });
});
