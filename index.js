const form = document.querySelector("#converter-form");
const amountInput = document.querySelector("#amount");
const fromSelect = document.querySelector("#from-currency");
const toSelect = document.querySelector("#to-currency");
const convertButton = document.querySelector("#convert-button");
const statusMessage = document.querySelector("#status-message");
const result = document.querySelector("#result");
const rateDate = document.querySelector("#rate-date");

function showError(message) {
  statusMessage.textContent = message;
  statusMessage.hidden = false;
  statusMessage.setAttribute("role", "alert");
  result.hidden = true;
}

function showResult(message) {
  statusMessage.hidden = true;
  result.textContent = message;
  result.hidden = false;
}

async function loadCurrencies() {
  const response = await fetch("https://api.frankfurter.dev/v1/currencies");
  if (!response.ok) {
    throw new Error(`Currency list request failed (HTTP ${response.status}).`);
  }

  const currencies = await response.json();
  const options = Object.entries(currencies)
    .sort(([codeA], [codeB]) => codeA.localeCompare(codeB))
    .map(([code, name]) => {
      const option = document.createElement("option");
      option.value = code;
      option.textContent = `${code} - ${name}`;
      return option;
    });

  for (const select of [fromSelect, toSelect]) {
    select.replaceChildren(...options.map((option) => option.cloneNode(true)));
  }

  fromSelect.value = "GBP";
  toSelect.value = "USD";
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const amount = Number(amountInput.value);
  if (!Number.isFinite(amount) || amount <= 0) {
    showError("Enter an amount greater than zero.");
    amountInput.focus();
    return;
  }

  const from = fromSelect.value;
  const to = toSelect.value;
  const formatCurrency = (value, currency) =>
    new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
    }).format(value);

  if (from === to) {
    showResult(`${formatCurrency(amount, from)} = ${formatCurrency(amount, to)}`);
    rateDate.textContent = "No conversion needed.";
    return;
  }

  const params = new URLSearchParams({
    amount: String(amount),
    from,
    to,
  });

  convertButton.disabled = true;
  convertButton.textContent = "Converting...";
  statusMessage.hidden = true;
  rateDate.textContent = "";

  try {
    const response = await fetch(`https://api.frankfurter.dev/v1/latest?${params}`);
    if (!response.ok) {
      throw new Error(`Conversion request failed (HTTP ${response.status}).`);
    }

    const data = await response.json();
    const convertedAmount = data.rates?.[to];
    if (typeof convertedAmount !== "number" || !Number.isFinite(convertedAmount)) {
      throw new Error("The API did not return a conversion rate for that currency pair.");
    }

    showResult(
      `${formatCurrency(amount, from)} = ${formatCurrency(convertedAmount, to)}`
    );
    rateDate.textContent = `Rate date: ${data.date}`;
  } catch (error) {
    showError(
      error instanceof Error
        ? `${error.message} Check your connection and try again.`
        : "The conversion failed. Check your connection and try again."
    );
  } finally {
    convertButton.disabled = false;
    convertButton.textContent = "Convert";
  }
});

loadCurrencies().catch((error) => {
  showError(
    error instanceof Error
      ? `${error.message} Check your connection and reload the page.`
      : "Could not load currencies. Check your connection and reload the page."
  );
  convertButton.disabled = true;
});
