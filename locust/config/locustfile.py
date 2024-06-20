from locust import HttpUser, task, between
import random

AVERAGE_WAIT_TIME = 5.0


class BinUser(HttpUser):
    wait_time = between(AVERAGE_WAIT_TIME*0.5, AVERAGE_WAIT_TIME*1.5)

    @task
    def cached(self):
        self.client.get("/cache/60")

    @task
    def simple(self):
        self.client.get(random.choice(["/", "/get", "/xml", "/json"]))

    @task
    def image(self):
        self.client.get("/image" + random.choice(["", "/jpeg", "/png", "/svg", "/webp"]))



if __name__ == "__main__":
    from locust import run_single_user
    run_single_user(BinUser)