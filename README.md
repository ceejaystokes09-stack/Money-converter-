# Currency Converter

A browser-based currency converter that gets currency choices and exchange rates
from the [Frankfurter API](https://frankfurter.dev/). No API key or build step
is required.

## Run locally

Serve the project directory over HTTP rather than opening `index.html` directly;
browsers may block API requests from local files.

```sh
python -m http.server 8000
```

Then open <http://localhost:8000>.

## Use

Enter an amount, choose the source and target currencies, and select **Convert**.
The currency list loads from Frankfurter when the page starts. Results include
the rate date returned by the API. Choosing the same currency returns the
entered amount without making a conversion request.

The app uses Frankfurter's public v1 endpoints:

- `https://api.frankfurter.dev/v1/currencies` for available currencies
- `https://api.frankfurter.dev/v1/latest` for the latest available exchange rate

If the API request fails, the page displays an error with guidance to retry.


# website link

This is where my version is hosted at [Currency converter](https://ceejaystokes09-stack.github.io/Money-converter-/)
