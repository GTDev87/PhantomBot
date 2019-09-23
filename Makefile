.PHONY: build config
build:
	ant jar; \
	cd dist/PhantomBot-3.0.0; \
	chmod u+x launch-service.sh launch.sh; \
	chown -R botuser:botuser *

config:
	cp  /home/botuser/botlogin.txt /home/botuser/PhantomBot/dist/PhantomBot-3.0.0/config/;