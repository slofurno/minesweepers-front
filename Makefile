.PHONY: build run

build:
	docker build -t mine-front .

run:
	docker run --rm --name mine-front -p 80:80 --net=host mine-front
