## Merchant demo

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
    heroku logs -t --app fields-test
    ```
