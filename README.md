To setup the pre-commit hooks,
```
pre-commit install
```

# Running locally #
To setup the frontend
```
cd frontend
npm install
```

To setup the virtual environment and install the required libraries
```
cd backend
python3 -m venv .venv # create virtual environment
source .venv/bin/activate # activate virtual environment
pip install -r requirements.txt # install required libraries
```
Then, add a `.env` file in the `backend` directory with the following information
```
PORT=8000
DATABASE_URL=...
ORIGIN=http://localhost:3000
```

To run the backend server
```
cd backend
uvicorn server:app --reload
```

To run the frontend
```
cd frontend
npm run dev
```