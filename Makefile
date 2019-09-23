build :
	ant jar
	cd dist/PhantomBot-3.0.0
    chmod u+x launch-service.sh launch.sh
    sudo chown -R botuser:botuser *
