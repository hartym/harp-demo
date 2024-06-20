import asyncio
from random import random
from typing import Union

from fastapi import FastAPI

from badapi.settings import DELAY_MAX, DELAY_MIN

app = FastAPI()
fake = Faker()


@app.get("/")
async def hello():
    await asyncio.sleep(random()*DELAY_MAX+DELAY_MIN)
    return {"Hello": fake.name()}


@app.get("/items/{item_id}")
async def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}