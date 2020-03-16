
db.build:
	cd db && docker build -t titan/db . && cd ..

db.run:
	docker run -p 5432:5432 -d --name titan-db titan/db

db.stop:
	docker stop titan-db && docker rm titan-db
