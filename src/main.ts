import axios, { AxiosResponse } from "axios";

interface coinSymbol {
  symbol: string;
}

interface Coin {
  name: string;
  open: string;
  high: string;
  low: string;
  close: string;
}

let tableBody: HTMLTableSectionElement | null = document.querySelector(
  "#progOutput table > tbody"
);

const cryptoSymbolURL = "https://api.sandbox.gemini.com/v1/symbols";
axios
  .get(cryptoSymbolURL)
  .then((r: AxiosResponse) => {
    let dataArr: any[] = [];
    dataArr.push(r.data);
    return dataArr[0];
  })
  .then((symbol: string[]) => {
    createButtons(symbol);
    return symbol;
  })
  .then((symbol: any[]) => {
    const wrapper: HTMLElement | null = document.getElementById("wrapper");

    wrapper?.addEventListener("click", (event: Event) => {
      const { target } = event;

      // if we're on the button, not somewhere else in the div
      if ((target as HTMLButtonElement).id != undefined) {
        let tableElement = document.querySelector(
          "tbody tr#" + (target as HTMLButtonElement).id + "TableElement"
        );

        // if the element doesn't exist yet
        if (
          tableElement == null &&
          !(target as HTMLButtonElement).classList.contains(
            "btn-outline-danger"
          )
        ) {
          generateTableElement(target);
        } else {
          // if the element DOES exist
          //remove the element
          document
            .querySelector(
              "tbody tr#" + (target as HTMLButtonElement).id + "TableElement"
            )
            ?.remove();

          // And if there are no items in the table, remove the thead
          if (document.querySelector("tbody")?.children.length == 0) {
            document.querySelector("thead")?.remove();
          }
        }
      }
    });
  });

// listener for clearAllButton
document
  .getElementById("clearAllButton")
  ?.addEventListener("click", (event: Event) => {
    removeAllChildNodes(document.querySelector("#progOutput table tbody"));
    document.querySelector("h5")?.remove();
    document.querySelector("thead")?.remove();
    setGreenButtonsClear(
      Array.from(document.querySelectorAll("#wrapper button"))
    );
  });

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function setGreenButtonsClear(buttonArray: HTMLElement[]) {
  buttonArray.forEach((element) => {
    if (element.classList.contains("btn-outline-success")) {
      element.setAttribute("class", "btn btn-outline-success");
    }
  });
}

function createTableElement(coinInfo: Coin) {
  // only the code to create the images are shown below
  // you should be able to figure out the missing code to
  // insert the image into a table cell

  const cryptoName: HTMLElement = document.createElement("span");
  const cryptoNameText: Text = document.createTextNode(coinInfo.name);
  cryptoName.appendChild(cryptoNameText);

  const cryptoOpen: HTMLElement = document.createElement("span");
  const cryptoOpenText: Text = document.createTextNode("$" + coinInfo.open);
  cryptoOpen.appendChild(cryptoOpenText);

  const cryptoHigh: HTMLElement = document.createElement("span");
  const cryptoHighText: Text = document.createTextNode("$" + coinInfo.high);
  cryptoHigh.appendChild(cryptoHighText);

  const cryptoLow: HTMLElement = document.createElement("span");
  const cryptoLowText: Text = document.createTextNode("$" + coinInfo.low);
  cryptoLow.appendChild(cryptoLowText);

  const cryptoClose: HTMLElement = document.createElement("span");
  const cryptoCloseText: Text = document.createTextNode("$" + coinInfo.close);
  cryptoClose.appendChild(cryptoCloseText);

  let tr: HTMLElement = document.createElement("tr");
  let td: HTMLElement = document.createElement("td");

  td.appendChild(cryptoName);
  tr.appendChild(td);

  td = document.createElement("td");
  td.appendChild(cryptoOpen);
  tr.appendChild(td);

  td = document.createElement("td");
  td.appendChild(cryptoHigh);
  tr.appendChild(td);

  td = document.createElement("td");
  td.appendChild(cryptoLow);
  tr.appendChild(td);

  td = document.createElement("td");
  td.appendChild(cryptoClose);
  tr.appendChild(td);

  tr.setAttribute("id", coinInfo.name.toLowerCase() + "TableElement");

  tableBody?.appendChild(tr);
}

function createTableHead() {
  let table = document.querySelector("table");
  let thead = document.createElement("thead");
  let tr = document.createElement("tr");
  let th = document.createElement("th");

  let thText = document.createTextNode("Symbol");
  th.appendChild(thText);
  tr.appendChild(th);

  th = document.createElement("th");
  thText = document.createTextNode("Open");
  th.appendChild(thText);
  tr.appendChild(th);

  th = document.createElement("th");
  thText = document.createTextNode("High");
  th.appendChild(thText);
  tr.appendChild(th);

  th = document.createElement("th");
  thText = document.createTextNode("Low");
  th.appendChild(thText);
  tr.appendChild(th);

  th = document.createElement("th");
  thText = document.createTextNode("Close");
  th.appendChild(thText);
  tr.appendChild(th);

  thead.appendChild(tr);
  table?.appendChild(thead);
}

function createButtons(symbol: string[]) {
  let symbolButton: HTMLButtonElement | null;
  let userInput: HTMLElement | null = document.querySelector("#userInput");
  let buttonContainer: HTMLElement | null = document.createElement("div");
  let buttonsOptionsContainer: HTMLElement | null = document.createElement(
    "div"
  );

  buttonContainer.setAttribute("id", "wrapper");
  buttonContainer.setAttribute("class", "btn-group-vertical btn-group-toggle");
  buttonContainer.setAttribute("role", "group");
  buttonContainer.setAttribute(
    "aria-label",
    "Basic checkbox toggle button group"
  );

  buttonsOptionsContainer.setAttribute("id", "buttonsOptions");
  buttonsOptionsContainer.setAttribute("class", "collapse hide-me");
  buttonsOptionsContainer.appendChild(buttonContainer);
  userInput?.appendChild(buttonsOptionsContainer);

  symbol.forEach((coin: string) => {
    if (coin.match(/(usd)/g)) {
      symbolButton = document.createElement("button");
      symbolButton.setAttribute("id", coin);
      symbolButton.setAttribute("class", "btn btn-outline-success");
      symbolButton.setAttribute("type", "button");
      symbolButton.setAttribute("data-toggle", "button");
      symbolButton.setAttribute("autocomplete", "off");
      symbolButton.textContent = coin;

      buttonContainer?.appendChild(symbolButton);
    }
  });
}

function createErrorMessage(coinDetails: Coin[]) {
  document?.querySelector("h5")?.remove();
  let header = document?.getElementById("pageTitle");
  let errorMessage = document.createElement("h5");
  let errorMessageText = document.createTextNode(
    "There is no information for " + coinDetails[0].name + " at this time."
  );
  errorMessage.appendChild(errorMessageText);
  header?.appendChild(errorMessage);

  document
    .getElementById(coinDetails[0].name.toLowerCase())
    ?.setAttribute("class", "btn btn-danger active");
  document
    .getElementById(coinDetails[0].name.toLowerCase())
    ?.removeAttribute("data-toggle");
  document
    .getElementById(coinDetails[0].name.toLowerCase())
    ?.setAttribute("disabled", "");

  setTimeout(() => {
    errorMessage.remove();
  }, 3000);
}

function generateTableElement(target: EventTarget | null) {
  const baseURL: string = "https://api.sandbox.gemini.com/v2/ticker/";
  let cryptoURL: string = baseURL + (target as HTMLButtonElement).id;
  axios
    .get(cryptoURL)
    .then((r: AxiosResponse) => {
      let dataArr: any[] = [];
      dataArr.push(r.data);
      return dataArr;
    })
    .then((coins: any[]) => {
      const coinsArr = coins.map(
        (c: any): Coin => {
          return {
            name: c.symbol,
            open: c.open,
            high: c.high,
            low: c.low,
            close: c.close,
          };
        }
      );
      return coinsArr;
    })
    .then((coinDetails: Coin[]) => {
      if (coinDetails[0].close != "0") {
        // if there's information for this coin
        if (
          // if there's nothing in the table at all, make a thead
          tableBody?.children[0] == undefined &&
          document.querySelector("thead tr")?.children[0] == undefined
        ) {
          createTableHead();
        }

        coinDetails.forEach((coin: Coin) => {
          createTableElement(coin);
        });
        document
          .getElementById(coinDetails[0].name.toLowerCase())
          ?.setAttribute("class", "btn btn-outline-success active");
      } else {
        // create a new error message
        createErrorMessage(coinDetails);
      }
    });
}
