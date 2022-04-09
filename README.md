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
