from locust import HttpUser, task, between
import random

class BinUser(HttpUser):
    wait_time = between(5*0.5, 5*1.5)

    @task
    def cached(self):
        self.client.get("/cache/60")

    @task
    def simple(self):
        self.client.get(random.choice(["/", "/get", "/xml", "/json"]))

    @task
    def image(self):
        self.client.get("/image" + random.choice(["", "/jpeg", "/png", "/svg", "/webp"]))

