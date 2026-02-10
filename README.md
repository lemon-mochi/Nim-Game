To setup the pre-commit hooks,
```
pre-commit install
```

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