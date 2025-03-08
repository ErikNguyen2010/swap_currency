const axios = require('axios');
var express = require('express');
const https = require('https');
var router = express.Router();

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

router.get('/get-currency', async function (req, res, next) {
  const resCurrency = await axios.get(
    'https://interview.switcheo.com/prices.json',
    { httpsAgent: new https.Agent({ rejectUnauthorized: false }) }
  );

  await delay(1000);
  res.send(resCurrency.data);
});

router.post('/calculate-swap-currency', async function (req, res, next) {
  const { body } = req;

  if (!body?.currencyFrom) {
    res.status(400).json({
      error: 'Currency from is required field.',
    });
    return;
  }

  if (!body?.currencyTo) {
    res.status(400).json({
      error: 'Currency to is required field.',
    });
    return;
  }

  if (!body?.amount) {
    res.status(400).json({
      error: 'Amount to is required field.',
    });
    return;
  }

  const resCurrency = await axios.get(
    'https://interview.switcheo.com/prices.json',
    { httpsAgent: new https.Agent({ rejectUnauthorized: false }) }
  );

  const { data } = resCurrency;
  const { currencyFrom, currencyTo, amount } = body;

  const idxCurrencyFrom = data.findIndex(
    (currency) => currency.currency === currencyFrom
  );
  const idxCurrencyTo = data.findIndex(
    (currency) => currency.currency === currencyTo
  );

  if ([idxCurrencyFrom, idxCurrencyTo].includes(-1)) {
    res.status(400).json({
      error: 'Currency from or Currency to is not valid.',
    });
    return;
  }

  const calculateAmount =
    (data[idxCurrencyFrom].price * amount) / data[idxCurrencyTo].price;

  await delay(1000);
  res.send({
    calculateAmount: calculateAmount,
  });
});

module.exports = router;
