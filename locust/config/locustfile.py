from locust import HttpUser, task, between
from locust.clients import HttpSession as BaseHttpSession, absolute_http_url_regexp
import random

AVERAGE_WAIT_TIME = 5.0

PORTS = ('7090', '7092',)

class BinUser(HttpUser):
    wait_time = between(AVERAGE_WAIT_TIME*0.5, AVERAGE_WAIT_TIME*1.5)

    def _get_host(self):
        host = self.host
        if host.endswith(":7090"):
            host = host[:-5] + ":" + random.choice(PORTS)
        return host

    def get(self, path, *args, **kwargs):
        return self.client.get(self._get_host()+ path, *args, **kwargs)

    def post(self, path, *args, **kwargs):
        return self.client.post(self._get_host()+ path, *args, **kwargs)

    def put(self, path, *args, **kwargs):
        return self.client.put(self._get_host()+ path, *args, **kwargs)

    def patch(self, path, *args, **kwargs):
        return self.client.patch(self._get_host()+ path, *args, **kwargs)

    def delete(self, path, *args, **kwargs):
        return self.client.delete(self._get_host()+ path, *args, **kwargs)

    @task
    def cached(self):
        self.get("/cache/60")

    @task
    def simple_get(self):
        self.get(random.choice(["/", "/get", "/xml", "/json"]))

    @task
    def simple_post(self):
        self.post("/post")

    @task
    def simple_put(self):
        self.put("/put")

    @task
    def simple_patch(self):
        self.patch("/patch")

    @task
    def simple_delete(self):
        self.delete("/delete")

    @task
    def custom_status(self):
        self.get("/status/" + random.choice(["200", "201", "202", "204", "400", "401", "403", "404", "500"]))

    @task
    def image(self):
        self.get("/image" + random.choice(["", "/jpeg", "/png", "/svg", "/webp"]))



if __name__ == "__main__":
    from locust import run_single_user
    run_single_user(BinUser)