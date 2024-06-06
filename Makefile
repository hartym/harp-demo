.PHONY: start pull reset stop

start: pull
	@echo "Starting the application..."
	docker-compose up -d
	(cd frontend && pnpm dev)

stop:
	docker-compose down

pull:
	docker image pull makersquad/harp-proxy:git-dev

reset:
	docker-compose down
	docker volume rm harp-demo_postgres_data
