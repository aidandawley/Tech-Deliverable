from contextlib import asynccontextmanager
from datetime import datetime
from typing import AsyncIterator

from fastapi import FastAPI, Form, status
from fastapi.responses import RedirectResponse
from typing_extensions import TypedDict

from services.database import JSONDatabase

from datetime import datetime, timedelta
from fastapi import Query

class Quote(TypedDict):
    name: str
    message: str
    time: str


database: JSONDatabase[list[Quote]] = JSONDatabase("data/database.json")


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    """Handle database management when running app."""
    if "quotes" not in database:
        print("Adding quotes entry to database")
        database["quotes"] = []

    yield

    database.close()


app = FastAPI(lifespan=lifespan)


@app.post("/quote")
def post_message(name: str = Form(), message: str = Form()) -> RedirectResponse:
    """
    Process a user submitting a new quote.
    You should not modify this function except for the return value.
    """
    now = datetime.now()
    quote = Quote(name=name, message=message, time=now.isoformat(timespec="seconds"))
    database["quotes"].append(quote)

    # You may modify the return value as needed to support other functionality
    return RedirectResponse("/", status.HTTP_303_SEE_OTHER)


# TODO: add another API route with a query parameter to retrieve quotes based on max age

#helper function to compute time thresholds
def get_time_delta(max_age: str) -> timedelta | None:
    """
    Convert age string into timedelta.
    """
    if max_age == "week":
        return timedelta(days=7)
    if max_age == "month":
        return timedelta(days=30)
    if max_age == "year":
        return timedelta(days=365)
    return None


@app.get("/quotes")
def get_quotes(max_age: str = Query("all")) -> list[Quote]:
    quotes = database["quotes"]
    """
    Retrieve quotes from the data base by filter.
    Time filters incliude: week, month, year
    """
    delta = get_time_delta(max_age)
    if delta is None:
        return quotes  

    cutoff = datetime.now() - delta

    filtered = []
    for q in quotes:
        quote_time = datetime.fromisoformat(q["time"])
        if quote_time >= cutoff:
            filtered.append(q)
 
 
    return filtered