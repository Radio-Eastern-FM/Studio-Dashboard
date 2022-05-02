
# StudioDashboad

```bash
git clone https://github.com/Xenarc/StudioDashboad.git
```

## Technical Description

...

---

## Backend

Written in Python (Django)

### Installation

Requirements:
- python
- pip

> /StudioDashboad/backend/

1. Install venv `python -m pip install virtualenv`

2. Create virtual environment `python -m virtualenv venv`

3. Activate virtual environment `./venv/Scripts/activate`

4. Install required modules `pip install -r requirements.txt`

### Add secrets

Rename `.secret-settings.py`  to `secret-settings.py`

```bash
cd .\StudioDashboard\backend\studio_dashboard\studio_dashboard
mv .\.secret_settings.py .\...secret_settings.py
```

Within this file, rename the secrets to their proper values.

### Run django server

`python ./manage.py runserver`

*If prompted, you may have to conduct a migration. Do this by typing* `python manage.py migrate`

---

## Frontend

Written in Javascript (React - create-react-app)

### Installation

Requirements:
- npm

> /StudioDashboard/frontend/dashboard-ui/

1. Install npm packages from package.json `npm install`

### Building and Running

*For Deveopment*

`npm run start`


*For Production:*

Build: `npm run build`

Run: `npm install -g serve`

---

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
