
SRCS = $(wildcard lib/**)

all: node_modules
	pnpm exec tsc

.PHONY: test
test: node_modules
	pnpm exec tsc
	pnpm exec vitest

node_modules: package.json
	pnpm install
