## Merchant demo

### Run Checkout

#### smartcomponentsnodeweb

`PORT=8003 npm start`

#### clientsdknodeweb

`PORT=8000 npm start`

#### altpayfieldsnodeweb

`npm run dev`

#### example

`npm start`

#### Full set up

```
Clone https://github.com/paypal/paypal-smart-payment-buttons and check out 'smart-fields' branch.

Clone https://github.com/paypal/paypal-checkout-components

Clone https://github.paypal.com/Checkout/clientsdknodeweb

Clone https://github.paypal.com/Checkout/smartcomponentnodeweb

Follow https://github.paypal.com/Checkout/smartcomponentnodeweb#point-to-a-local-module to point to local smart buttons repo

Follow https://github.paypal.com/Checkout/clientsdknodeweb#mounting-local-client-modules to point to local checkout-components repo

Run smartcomponentnodeweb on port 8003

Run clientsdknodeweb on port 8000

run this example
```

### Deploy this sub-module to Heroku

1.  Log into Heroku and add Heroku to your local git:

    ```
    heroku login
    heroku git:remote -a merchant-checkout-demo
    ```

2.  Deploy to Heroku from the altpayfieldsnodeweb root directory:

    ```
    git subtree push --prefix example heroku master
    ```

3.  See Heroku server logs:

    ```
    git subtree push --prefix example heroku master
    ```
