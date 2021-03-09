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

const cryptoSymbolURL = "https://api.sandbox.gemini.com/v1/symbols";
axios
  .get(cryptoSymbolURL)
  .then((r: AxiosResponse) => {
    let dataArr: any[] = [];
    dataArr.push(r.data);
    return dataArr;
  })
  .then((symbol: any[]) => {
    let symbolButton: HTMLButtonElement | null;
    let userInput: HTMLElement | null = document.querySelector("#userInput");
    let buttonContainer: HTMLElement | null = document.createElement("div");
    let buttonsOptionsContainer: HTMLElement | null = document.createElement(
      "div"
    );

    buttonContainer.setAttribute("id", "wrapper");
    buttonContainer.setAttribute(
      "class",
      "btn-group-vertical btn-group-toggle"
    );
    buttonContainer.setAttribute("role", "group");
    buttonContainer.setAttribute(
      "aria-label",
      "Basic checkbox toggle button group"
    );

    buttonsOptionsContainer.setAttribute("id", "buttonsOptions");
    buttonsOptionsContainer.setAttribute("class", "collapse hide-me");
    buttonsOptionsContainer.appendChild(buttonContainer);
    userInput?.appendChild(buttonsOptionsContainer);

    symbol[0].forEach((coin: string) => {
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
    return symbol;
  })
  .then((symbol: any[]) => {
    const wrapper: HTMLElement | null = document.getElementById("wrapper");

    wrapper?.addEventListener("click", (event: Event) => {
      const { target } = event;
      let exists: boolean = false;

      if ((target as HTMLButtonElement).id != undefined) {
        document.querySelectorAll("tbody tr td:first-child").forEach((e) => {
          if (
            (target as HTMLButtonElement).innerText == e.innerText.toLowerCase()
          ) {
            exists = true;
            document?.querySelector("h5")?.remove();
            let header = document?.getElementById("pageTitle");
            let errorMessage = document.createElement("h5");
            let errorMessageText = document.createTextNode(
              e.innerText + " is already on the table."
            );
            errorMessage.appendChild(errorMessageText);
            header?.appendChild(errorMessage);

            setTimeout(() => {
              errorMessage.remove();
            }, 3000);
            return;
          }
        });

        if (!exists) {
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
                let tableBody: HTMLTableSectionElement | null = document.querySelector(
                  "#progOutput table > tbody"
                );

                if (tableBody?.children[0] == undefined) {
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

                coinDetails.forEach((coin: Coin) => {
                  // only the code to create the images are shown below
                  // you should be able to figure out the missing code to
                  // insert the image into a table cell

                  const cryptoName: HTMLElement = document.createElement(
                    "span"
                  );
                  const cryptoNameText: Text = document.createTextNode(
                    coin.name
                  );
                  cryptoName.appendChild(cryptoNameText);

                  const cryptoOpen: HTMLElement = document.createElement(
                    "span"
                  );
                  const cryptoOpenText: Text = document.createTextNode(
                    "$" + coin.open
                  );
                  cryptoOpen.appendChild(cryptoOpenText);

                  const cryptoHigh: HTMLElement = document.createElement(
                    "span"
                  );
                  const cryptoHighText: Text = document.createTextNode(
                    "$" + coin.high
                  );
                  cryptoHigh.appendChild(cryptoHighText);

                  const cryptoLow: HTMLElement = document.createElement("span");
                  const cryptoLowText: Text = document.createTextNode(
                    "$" + coin.low
                  );
                  cryptoLow.appendChild(cryptoLowText);

                  const cryptoClose: HTMLElement = document.createElement(
                    "span"
                  );
                  const cryptoCloseText: Text = document.createTextNode(
                    "$" + coin.close
                  );
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

                  tableBody?.appendChild(tr);
                  // tableBody?.classList.add("border");
                });
                document
                  .getElementById(coinDetails[0].name.toLowerCase())
                  ?.setAttribute("class", "btn btn-outline-success active");
                document
                  .getElementById(coinDetails[0].name.toLowerCase())
                  ?.setAttribute("data-toggle", "");
              } else {
                document?.querySelector("h5")?.remove();
                let header = document?.getElementById("pageTitle");
                let errorMessage = document.createElement("h5");
                let errorMessageText = document.createTextNode(
                  "There is no information for " +
                    coinDetails[0].name +
                    " at this time."
                );
                errorMessage.appendChild(errorMessageText);
                header?.appendChild(errorMessage);

                document
                  .getElementById(coinDetails[0].name.toLowerCase())
                  ?.setAttribute("class", "btn btn-outline-danger active");
                document
                  .getElementById(coinDetails[0].name.toLowerCase())
                  ?.setAttribute("data-toggle", "");

                setTimeout(() => {
                  errorMessage.remove();
                }, 3000);
              }
            });
        } else {
          return;
        }
      }
    });
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
