/**
 * @jest-environment jsdom
 */

import { screen, waitFor } from "@testing-library/dom";
import BillsUI from "../views/BillsUI.js";
import { bills } from "../fixtures/bills.js";
import { ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import { mockStore } from "../__mocks__/store.js";
import Bills from "../containers/Bills.js";

import router from "../app/Router.js";
import { formatDate, formatStatus } from "../app/format.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
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
      window.onNavigate(ROUTES_PATH.Bills);
      await waitFor(() => screen.getByTestId("icon-window"));
      const windowIcon = screen.getByTestId("icon-window");
      //to-do write expect expression
      expect(windowIcon.classList.contains("active-icon")).toBe(true); // i do this
    });

    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills });
      const dates = screen
        .getAllByText(
          /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i
        )
        .map((a) => a.innerHTML);
      const antiChrono = (a, b) => (a < b ? 1 : -1);
      const datesSorted = [...dates].sort(antiChrono);
      expect(dates).toEqual(datesSorted);
    });
  });

  describe("When Employee click on NewBill button", () => {
    test("Then it should render NewBill page", () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );

      const bills = new Bills({
        document,
        onNavigate,
        store: mockStore,
        localStorage: window.localStorage,
      });

      const handleClickNewBill = jest.fn(bills.handleClickNewBill);

      const buttonNewBill = document.querySelector(
        `button[data-testid="btn-new-bill"]`
      );
      buttonNewBill.addEventListener("click", handleClickNewBill);

      buttonNewBill.click();

      expect(handleClickNewBill).toHaveBeenCalled();
    });
  });

  describe("When i click on icon eye", () => {
    test("Then should display modal", () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      const bills = new Bills({
        document,
        onNavigate,
        store: mockStore,
        localStorage: window.localStorage,
      });

      const handleClickIconEye = jest.fn(bills.handleClickIconEye);

      const iconEye = document.querySelector(`div[data-testid="icon-eye"]`);
      iconEye.addEventListener("click", handleClickIconEye);

      iconEye.click();

      expect(handleClickIconEye).toHaveBeenCalled();

      const modale = document.querySelector(
        `div[data-testid="modaleFileAdmin"]`
      );
      expect(modale).toBeTruthy();
    });
  });

  describe("When employee display bills page", () => {
    test("Then it should render list of bills with date and status formatted", async () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      const bills = new Bills({
        document,
        onNavigate,
        store: mockStore,
        localStorage: window.localStorage,
      });

      const result = await bills.getBills();

      expect(result.length).toBe(4);
      expect(result[0].date).toEqual(formatDate(bills.bills[0].date));
      expect(result[0].status).toEqual(formatStatus(bills.bills[0].status));
    });
  });

  describe("When employee display bills page but with corrupted data", () => {
    test("Then date is not formated and status is Unknown", async () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      const mockedStoreWithBadData = {
        ...mockStore,
        bills: {
          ...mockStore.bills,
          list: [
            {
              ...mockStore.bills.list[0],
              date: "test",
              status: "test",
            },
          ],
        },
      };

      const bills = new Bills({
        document,
        onNavigate,
        store: mockedStoreWithBadData,
        localStorage: window.localStorage,
      });

      const result = await bills.getBills();

      expect(result[0].date).toEqual(bills.bills[0].date);
      expect(result[0].status).toEqual(formatStatus(bills.bills[0].status));
    });
  });
});
