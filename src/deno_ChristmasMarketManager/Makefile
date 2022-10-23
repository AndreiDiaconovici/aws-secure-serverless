.PHONY: build-ManagerLambdaFunction

build-ManagerLambdaFunction:
	DENO_PREFIX=${level}\t${requestId}\t${(new Error).stack.split('\n')[4]}\r
	DENO_DIR=.deno_dir deno cache src/handler.ts
	cp -R ".deno_dir/gen/file/$(PWD)/" .deno_dir/LAMBDA_TASK_ROOT
	cp -a . "$(ARTIFACTS_DIR)"