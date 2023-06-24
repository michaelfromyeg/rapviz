# Inspired by PrairieLearn's Makefile!
# see: https://github.com/PrairieLearn/PrairieLearn/blob/e783f4e4aefe37afb3409f20546824404534a4d2/Makefile

run: run-server run-client
run-server:
	@python3 -m server.main
run-client:
	@cd client && yarn start

lint: lint-client lint-server
lint-client:
	@cd client && yarn eslint --ext js --report-unused-disable-directives "**/*.js"
	@cd client && yarn prettier --check "**/*.{js,md}"
lint-server:
	@cd server && python -m pylint .

format: format-client format-server
format-client:
	@cd client && yarn eslint --ext js --fix "**/*.js"
	@cd client && yarn prettier --write "**/*.{js,md}"
format-server:
	@cd server && python3 -m isort .
	@cd server && python3 -m black .
