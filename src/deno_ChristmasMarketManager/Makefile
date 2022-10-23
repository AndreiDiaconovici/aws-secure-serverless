.PHONY: build-ManagerLambdaFunction

build-ManagerLambdaFunction:
	deno run --allow-env src/handler.ts
	cp -R ".deno_dir/gen/file/$(PWD)/" .deno_dir/LAMBDA_TASK_ROOT
	cp -a . "$(ARTIFACTS_DIR)"