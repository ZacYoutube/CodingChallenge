# Concept3D Interview: The Technical Challenge

## Overview

Hello prospective candidate! In this repo, you're given a boilerplate application that contains most of the libraries you'll need to complete the challenge. It's intended to examine your abilities in the following areas:

1. React/Redux knowledge
2. General self-ownership of code in order to solve a problem
3. Comfort diving into the docs in order to learn new technologies
4. Ability to write clean, well organized, and refactored code
5. Git usage and best practices

### Instructions

1. Clone this repo to your own machine (do not fork it)
2. `cd C3DGL-Map-Challenge`
3. Delete the `.git` directory
4. Initialize git. Host this project as a new repo on your own Github profile
5. `npm install`
6. Open a separate terminal tab to run your server
    1. `cd server && node server.js`
7. In the root of the application run `npm start` (this will start the React application)
8. Good luck!

> We rely heavily upon Git. Be sure to checkout new branches for new features. Commit early and commit often.

### Requirements

1. This boilerplate effectively contains two applications: A React Redux application that has been bootstrapped with Create React App, and an Express API. You'll notice that, at the moment, the API uses `app.locals` as a data store.

    "When I navigate to the root path of the application, I see the three seeded markers displayed on the page."
  
    ---
    Notes:
    - Update the application to fetch the three locations from the api and place them on the map as markers
    ---


2. As you'll see when you look into the Front-End boilerplate, its pretty simple. Create and add a form to the Map. The form will be used to add new markers to the map. The basic form should have fields for inputting name, latitude and longitude. This part has two aspects - client side and server side. The user story is:

    "When I enter a valid latitude and longitude into the form with a name, and then press enter, I will see a new marker added to the map. If there are errors, I will see them rendered on screen. On success, the map will pan to the new marker's coordinates."

    ---
    Notes:

    - Markers must persist.
    - **Valid** latitude and longitude is important. As is the existence of a name.
    - Verify `lat`, `lng`, and `name` server-side.
    - Return meaningful error messages to the Front-End and render them accordingly.
    - Use Redux and hooks to update the state of your app.
    - When adding a new marker, the center of the map will be set to the `[lat, lng]` of the new marker.
    ---

BONUS TIME!

If you have some extra time, feel free to implement any of the following. No stress.

Now that you're adding your new markers and saving them, let's make some shapes! Using the `mapbox-gl-draw` library, let's make a polygon. Here's the user story:

      "When I use the draw tool to make a polygon, I want to be able to save it and have it persist and load on refresh."

      ---
      Notes:

      - It is important that these polygons persist.
      - Use the `mapbox-gl-draw` library to draw your polygon.
      - Geojson format knowledge will help.
      ---

Other Bonus Options:

    - Tests are always appreciated. See what you can do here.
    - Host your application. Heroku is free and easy. That being said, use whatever you are comfortable with.
    - Add some other fun features with the Maplibre and Mapbox-draw-gl libraries. Be creative!
    - Check for accessible markup.

### Helpful Links:

- [Express](https://expressjs.com/)
- [AWS Docs](https://docs.aws.amazon.com/)
- [DynamoDB](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html)
- [DynamoDB Local](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.html)
- [Maplibre](https://maplibre.org/)
- [React Redux](https://react-redux.js.org/introduction/getting-started)
- [Redux](http://redux.js.org/)


### Final notes:

Take as long as you need to feel to do your best work. However, this challenge should realistically take no longer than approximately 5-6 hours.

Have fun!
