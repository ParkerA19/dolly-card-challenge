# dolly-card-challenge

> dolly card challenge

## About

This project uses [Feathers](http://feathersjs.com). An open source framework for building APIs and real-time applications.
It also uses Vite + React + Typescript for the frontend.

## Getting Started

1. Make sure you have [NodeJS](https://nodejs.org/) and [pnpm](https://pnpm.io/installation) installed.


BACKEND STEPS
2. Install your dependencies

    ```
    cd path/to/dolly-card-challenge/server
    pnpm install
    ```

3. Add your .env file to the server folder
  You will need to include LITHIC_API_KEY='your_key_here' in a .env file in order for this to work


4. Start your feathers backend

    ```
    pnpm run compile # Compile TypeScript source
    pnpm start
    ```


FRONTEND STEPS

5. Install your dependencies

    ```
    cd path/to/dolly-card-challenge/frontend
    pnpm install
    ```

6. Start your Vite/React frontend
    ```
    pnpm run compile # Compile TypeScript source
    pnpm dev
    ```



  
## Features/Thoughts

This project allows you to query transactions for a card using the Lithic api.

These transactions are displayed in a table on the frontend that has features such as grouping, filtering, and automatic sorting by Amount. I also implemented pagination for the data as to not load too much data on each query.

From a backend perspective I utilized the feathers api to create a "transactions" service and wrote a simple api that returned transaction data.
I utilized the Lithic api package to simplify some of the logic and get access to the proper types.

For the frontend I used Vite + React to provide a fast build process and clear/organized code.

I used React-Query to provide a performant / simple experience to query the api and populate data in the frontend.

I used tailwind for styles.



## Improvements
With more time there are a few things I would have liked to work on:

* Consistent types throughout the project
   There were some repeated types that should be defined once and used throughout to avoid having to keep track of multiple sources of truth
   Utilizing enums or const object could have also been helpful here for things like the filters or tabs since those were hard coded in the frontend and backend

* Better Designed / More reusable components
    Given more time it is always best practice to get some sort of design system in a project and create reusable styles components so everything added can have a simliar feel.
    Due to the 4 hour time limit I relied on Claude AI to help with some of the quick styling of components to make them presentable.
    Having the desing system makes it much quicker to implement but also much easier to come up with designs in the first place as there is already a pattern in place.
