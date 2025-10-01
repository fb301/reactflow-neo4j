import neo4j
import os
from contextlib import asynccontextmanager
from neo4j import AsyncGraphDatabase
from fastapi import FastAPI


PATH = os.path.dirname(os.path.abspath(__file__))


url = os.getenv("NEO4J_URI", "neo4j://127.0.0.1:7687")
username = os.getenv("NEO4J_USER", "neo4j")
password = os.getenv("NEO4J_PASSWORD", "your_passwd")
neo4j_version = os.getenv("NEO4J_VERSION", "2025.08.0")
database = os.getenv("NEO4J_DATABASE", "your_database")

port = int(os.getenv("PORT", 8080))

shared_context = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
    driver = AsyncGraphDatabase.driver(url, auth=(username, password))
    shared_context["driver"] = driver
    yield
    await driver.close()


def get_driver() -> neo4j.AsyncDriver:
    return shared_context["driver"]
