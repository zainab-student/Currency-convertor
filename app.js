const BASE_URL = "https://v6.exchangerate-api.com/v6/0845be14db8fcea3cbfee2c9/latest";
const dropdowns = document.querySelectorAll(".drop-down select");

const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Populate the currency dropdowns
const populateCurrencyDropdowns = () => {
  for (let select of dropdowns) {
    for (let currCode in countryList) {
      let newOption = document.createElement("option");
      newOption.innerText = currCode;
      newOption.value = currCode;

      // Set default selected currencies (USD and INR)
      if (select.name === "from" && currCode === "USD") {
        newOption.selected = "selected";
      } else if (select.name === "to" && currCode === "INR") {
        newOption.selected = "selected";
      }
      select.append(newOption);
    }

    select.addEventListener("change", (evt) => {
      updateFlag(evt.target);
    });
  }
};

// Update the flag image based on currency selection
const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

// Fetch the exchange rate and update the message
const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = parseFloat(amount.value);
  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }

  const URL = `${BASE_URL}/${fromCurr.value}`;

  try {
    let response = await fetch(URL);
    let data = await response.json();

    if (data.result === "success" && data.conversion_rates) {
      let rate = data.conversion_rates[toCurr.value];

      if (rate) {
        let finalAmount = amtVal * rate;
        msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
      } else {
        throw new Error("Rate not found.");
      }
    } else {
      throw new Error("Exchange rate data is not available.");
    }
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    msg.innerText = "Error fetching exchange rate.";
  }
};

// Event listener for the button click to trigger exchange rate update
btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

// Initialize and populate the dropdown on page load
window.addEventListener("load", () => {
  populateCurrencyDropdowns();
  updateExchangeRate();
});
