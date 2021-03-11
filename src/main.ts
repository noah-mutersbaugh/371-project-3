import axios, { AxiosResponse } from "axios";

interface Coin {
  name: string;
  open: string;
  high: string;
  low: string;
  close: string;
}

interface Volume {
  name: string;
  quantity: string;
  price: string;
}

let tableBody: HTMLElement | null;

let tabContentWrapper: HTMLElement = document.createElement("div");
tabContentWrapper.setAttribute("id", "tabContentWrapper");
tabContentWrapper.setAttribute("class", "tab-content");

/*
  Get possible crypto currencies available, and turn them into options
*/
const cryptoSymbolURL = "https://api.sandbox.gemini.com/v1/symbols";
axios
  .get(cryptoSymbolURL)
  .then((r: AxiosResponse) => {
    let dataArr: any[] = [];
    dataArr.push(r.data);
    return dataArr[0];
  })
  .then((symbol: string[]) => {
    let buttonWrapper: HTMLElement = document.createElement("div");
    buttonWrapper.setAttribute("id", "cryptoButtonWrapper");
    createButtons(symbol, buttonWrapper, "crypto");

    buttonWrapper = document.createElement("div");
    buttonWrapper.setAttribute("id", "volumeButtonWrapper");
    buttonWrapper.style.display = "none";
    createButtons(symbol, buttonWrapper, "volume");

    return symbol;
  })
  .then((symbol: any[]) => {
    const cryptoButtonWrapper: HTMLElement | null = document.getElementById(
      "cryptoButtonWrapper"
    );
    cryptoButtonWrapper?.addEventListener("click", (event: Event) => {
      const { target } = event;

      // if we're on the button, not somewhere else in the div
      if ((target as HTMLButtonElement).id != undefined) {
        let tableElement = document.querySelector(
          `#CryptoValues tbody tr#${(target as HTMLButtonElement).id.replace(
            /-crypto/g,
            ""
          )}TableElement`
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
              `#CryptoValues tbody tr#${(target as HTMLButtonElement).id.replace(
                /-crypto/g,
                ""
              )}TableElement`
            )
            ?.remove();

          // And if there are no items in the table, remove the thead
          if (document.querySelector("#CryptoValues tbody")?.children.length == 0) {
            Array.from(document.querySelectorAll("#progOutput h2")).filter(e => e.innerHTML == "Crypto Values")[0].remove();
            document.querySelector("#CryptoValues")?.remove();
          }
        }
      }
    });

    const volumeButtonWrapper: HTMLElement | null = document.getElementById(
      "volumeButtonWrapper"
    );
    volumeButtonWrapper?.addEventListener("click", (event: Event) => {
      const { target } = event;

      // if we're on the button, not somewhere else in the div
      if ((target as HTMLButtonElement).id != undefined) {
        let tableElement = document.querySelector(
          `#VolumeValues tbody tr#${(target as HTMLButtonElement).id.replace(
            /usd-volume/g,
            ""
          )}TableElement`
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
              `#VolumeValues tbody tr#${(target as HTMLButtonElement).id.replace(
                /usd-volume/g,
                ""
              )}TableElement`
            )
            ?.remove();

          // And if there are no items in the table, remove the thead
          if (document.querySelector("#VolumeValues tbody")?.children.length == 0) {
            Array.from(document.querySelectorAll("#progOutput h2")).filter(e => e.innerHTML == "Volume Values")[0].remove();
            document.querySelector("#VolumeValues")?.remove();
          }
        }
      }
    });
  });

// listener for clearAllButton
document
  .getElementById("clearAllButton")
  ?.addEventListener("click", (event: Event) => {
    removeAllChildNodes(document.querySelector("#progOutput"));
    setGreenButtonsClear(
      Array.from(document.querySelectorAll("#cryptoButtonWrapper button"))
    );
    setGreenButtonsClear(
      Array.from(document.querySelectorAll("#volumeButtonWrapper button"))
    );
  });

// listener to show/hide each group of options
document
  .getElementById("pills-tab")
  ?.addEventListener("click", (event: Event) => {
    const { target } = event;

    // if we're on the button, not somewhere else in the div
    if ((target as HTMLButtonElement).id == "pills-crypto-tab") {
      document.getElementById("cryptoButtonWrapper")!.style.display = "flex";
      document.getElementById("volumeButtonWrapper")!.style.display = "none";
    } else if ((target as HTMLButtonElement).id == "pills-volume-tab") {
      document.getElementById("cryptoButtonWrapper")!.style.display = "none";
      document.getElementById("volumeButtonWrapper")!.style.display = "flex";
    }
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

function createTableElement(coinInfo: any, which: string) {
  // only the code to create the images are shown below
  // you should be able to figure out the missing code to
  // insert the image into a table cell

  if (which == "crypto") {
    let table = document.getElementById("CryptoValues");
    tableBody = document.querySelector("#CryptoValues tbody");
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
    if (tableBody != null) {
      table?.appendChild(tableBody);
    }
  } else {
    let table = document.getElementById("VolumeValues");
    tableBody = document.querySelector("#VolumeValues tbody");
    const cryptoName: HTMLElement = document.createElement("span");
    const cryptoNameText: Text = document.createTextNode(coinInfo.name);
    cryptoName.appendChild(cryptoNameText);

    const cryptoOpen: HTMLElement = document.createElement("span");
    const cryptoOpenText: Text = document.createTextNode(coinInfo.quantity);
    cryptoOpen.appendChild(cryptoOpenText);

    const volumePrice: HTMLElement = document.createElement("span");
    const volumePriceText: Text = document.createTextNode("$" + coinInfo.price);
    volumePrice.appendChild(volumePriceText);

    let tr: HTMLElement = document.createElement("tr");
    let td: HTMLElement = document.createElement("td");

    td.appendChild(cryptoName);
    tr.appendChild(td);

    td = document.createElement("td");
    td.appendChild(cryptoOpen);
    tr.appendChild(td);

    td = document.createElement("td");
    td.appendChild(volumePrice);
    tr.appendChild(td);

    tr.setAttribute("id", coinInfo.name.toLowerCase() + "TableElement");

    tableBody?.appendChild(tr);
    if (tableBody != null) {
      table?.appendChild(tableBody);
    }
  }
}

function createTableHead(title: string) {
  let outputTitle = document.createElement("h2");
  let outputTitleText = document.createTextNode(title);
  outputTitle.appendChild(outputTitleText);
  document.getElementById("progOutput")?.appendChild(outputTitle);

  let table = document.createElement("table");
  table.setAttribute("id", `${title.replace(/\s/g, "")}`);
  tableBody = document.createElement("tbody");
  let thead = document.createElement("thead");
  let tr = document.createElement("tr");
  let th = document.createElement("th");

  let thText = document.createTextNode("Symbol");
  th.appendChild(thText);
  tr.appendChild(th);

  if (title == "Crypto Values") {
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
  } else {
    th = document.createElement("th");
    thText = document.createTextNode("Quantity");
    th.appendChild(thText);
    tr.appendChild(th);

    th = document.createElement("th");
    thText = document.createTextNode("Price");
    th.appendChild(thText);
    tr.appendChild(th);
  }

  thead.appendChild(tr);
  table?.appendChild(thead);
  table?.appendChild(tableBody);
  document.getElementById("progOutput")?.appendChild(table);
}

function createButtons(
  symbol: string[],
  buttonWrapper: HTMLElement,
  which: string
) {
  let symbolButton: HTMLButtonElement | null;
  let userInput: HTMLElement | null = document.querySelector("#userInput");

  if (which == "crypto") {
    buttonWrapper.setAttribute(
      "class",
      "btn-group-vertical tab-pane fade show active"
    );
  } else {
    buttonWrapper.setAttribute("class", "btn-group-vertical tab-pane fade");
  }
  buttonWrapper.setAttribute("role", "tabpanel");
  buttonWrapper.setAttribute("aria-labelledby", "pills-" + which + "-tab");

  tabContentWrapper.appendChild(buttonWrapper);
  userInput?.appendChild(tabContentWrapper);

  symbol.forEach((coin: string) => {
    if (coin.match(/(usd)/g)) {
      symbolButton = document.createElement("button");
      symbolButton.setAttribute("id", `${coin}-${which}`);
      symbolButton.setAttribute("class", "btn btn-outline-success " + which);
      symbolButton.setAttribute("type", "button");
      symbolButton.setAttribute("data-toggle", "button");
      symbolButton.setAttribute("autocomplete", "off");
      symbolButton.textContent = coin;

      buttonWrapper?.appendChild(symbolButton);
    }
  });
}

function createErrorMessage(coinDetails: any[], which: string) {
  document?.querySelector("h5")?.remove();
  let header = document?.getElementById("pageTitle");
  let errorMessage = document.createElement("h5");
  let errorMessageText = document.createTextNode(
    "There is no information for " + coinDetails[0].name + " at this time."
  );
  errorMessage.appendChild(errorMessageText);
  header?.appendChild(errorMessage);
  let name = coinDetails[0].name.toLowerCase();
  if (which == "volume") {
    name = `${name}usd`;
  }
  document
    .getElementById(`${name}-${which}`)
    ?.setAttribute("class", "btn btn-danger active");
  document.getElementById(`${name}-${which}`)?.setAttribute("disabled", "");
  document.getElementById(`${name}-${which}`)?.removeAttribute("data-toggle");

  setTimeout(() => {
    errorMessage.remove();
  }, 3000);
}

function generateTableElement(target: EventTarget | null) {
  let baseURL: string;
  let cryptoURL: string;

  if ((target as HTMLButtonElement).classList.contains("crypto")) {
    baseURL = "https://api.sandbox.gemini.com/v2/ticker/";
    cryptoURL = baseURL + (target as HTMLButtonElement).id.replace(/-.*$/g, "");
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
              open: parseFloat(c.open).toLocaleString(),
              high: parseFloat(c.high).toLocaleString(),
              low: parseFloat(c.low).toLocaleString(),
              close: parseFloat(c.close).toLocaleString(),
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
            (document.getElementById("progOutput")?.children[0] == undefined &&
              document.querySelector("thead tr")?.children[0] == undefined) ||
            !Array.from(document.querySelectorAll("#progOutput h2")).some(
              (e) => e.innerHTML == "Crypto Values"
            )
          ) {
            createTableHead("Crypto Values");
          }

          coinDetails.forEach((coin: Coin) => {
            createTableElement(coin, "crypto");
          });
          document
            .getElementById(coinDetails[0].name.toLowerCase())
            ?.setAttribute("class", "btn btn-outline-success active");
        } else {
          // create a new error message
          createErrorMessage(coinDetails, "crypto");
        }
      });
  } else {
    baseURL = "https://api.sandbox.gemini.com/v1/pubticker/";
    cryptoURL = baseURL + (target as HTMLButtonElement).id.replace(/-.*$/g, "");
    axios
      .get(cryptoURL)
      .then((r: AxiosResponse) => {
        let dataArr: any[] = [];
        dataArr.push(r.data);
        return dataArr;
      })
      .then((volumes: any[]) => {
        const volumesArr = volumes.map(
          (c: any): Volume => {
            let volumeName = (target as HTMLButtonElement)
              .id!.replace(/(usd)+-.*$/g, "")
              .toUpperCase();
            return {
              name: volumeName,
              quantity: parseFloat(c.volume[volumeName]).toLocaleString(),
              price: parseFloat(c.volume.USD).toLocaleString(),
            };
          }
        );
        return volumesArr;
      })
      .then((coinDetails: Volume[]) => {
        if (coinDetails[0].price != "0") {
          // if there's information for this coin
          if (
            // if there's nothing in the table at all, make a thead
            (document.getElementById("progOutput")?.children[0] == undefined &&
              document.querySelector("thead tr")?.children[0] == undefined) ||
            !Array.from(document.querySelectorAll("#progOutput h2")).some(
              (e) => e.innerHTML == "Volume Values"
            )
          ) {
            createTableHead("Volume Values");
          }

          coinDetails.forEach((coin: Volume) => {
            createTableElement(coin, "volume");
          });
          document
            .getElementById(coinDetails[0].quantity.toLowerCase())
            ?.setAttribute("class", "btn btn-outline-success active");
        } else {
          // create a new error message
          createErrorMessage(coinDetails, "volume");
        }
      });
  }
}
