#!/usr/bin/env node 
import pump from 'pump';
import { program } from 'commander';
import pinoLoki from './index.mjs';
import 'pino-abstract-transport';
import 'node:util';
import 'got';

const name = "pino-loki";
const type = "commonjs";
const version = "2.3.0";
const packageManager = "pnpm@9.4.0";
const description = "A transport for pino that sends messages to Loki";
const author = "Julien Ripouteau <julien@ripouteau.com>";
const license = "MIT";
const funding = "https://github.com/sponsors/Julien-R44";
const homepage = "https://github.com/Julien-R44/pino-loki#readme";
const repository = {
	type: "git",
	url: "git+https://github.com/Julien-R44/pino-loki.git"
};
const bugs = {
	url: "https://github.com/Julien-R44/pino-loki/issues"
};
const keywords = [
	"pino",
	"pino-transport",
	"loki",
	"logging"
];
const exports = {
	".": {
		types: "./dist/index.d.ts",
		"import": "./dist/index.mjs",
		require: "./dist/index.cjs"
	}
};
const main$1 = "./dist/index.cjs";
const module = "./dist/index.mjs";
const types = "./dist/index.d.ts";
const typesVersions = {
	"*": {
		"*": [
			"./dist/*",
			"./dist/index.d.ts"
		]
	}
};
const bin = {
	"pino-loki": "dist/cli.cjs"
};
const files = [
	"dist"
];
const scripts = {
	build: "rimraf dist && unbuild",
	dev: "unbuild --stub",
	lint: "eslint .",
	format: "prettier --write .",
	prepublishOnly: "pnpm build",
	release: "bumpp --commit --push --tag && pnpm publish",
	stub: "unbuild --stub",
	"quick:test": "node -r ts-node/register bin/test.ts",
	test: "c8 node -r ts-node/register bin/test.ts",
	typecheck: "tsc --noEmit",
	checks: "pnpm typecheck && pnpm lint && pnpm test"
};
const dependencies = {
	commander: "^12.0.0",
	got: "^11.8.6",
	"pino-abstract-transport": "^1.2.0",
	pump: "^3.0.0"
};
const devDependencies = {
	"@japa/assert": "^1.4.1",
	"@japa/runner": "^2.5.1",
	"@japa/spec-reporter": "^1.3.3",
	"@julr/tooling-configs": "^2.2.0",
	"@types/node": "^20.12.11",
	"@types/pump": "^1.1.3",
	bumpp: "^9.4.1",
	c8: "^9.1.0",
	dotenv: "^16.4.5",
	eslint: "^8.57.0",
	nock: "^13.5.4",
	pino: "^9.0.0",
	"pino-pretty": "^11.0.0",
	prettier: "^3.2.5",
	rimraf: "^5.0.6",
	"ts-node": "^10.9.2",
	typescript: "^5.4.5",
	unbuild: "^2.0.0"
};
const prettier = "@julr/tooling-configs/prettier";
const pkg = {
	name: name,
	type: type,
	version: version,
	packageManager: packageManager,
	description: description,
	author: author,
	license: license,
	funding: funding,
	homepage: homepage,
	repository: repository,
	bugs: bugs,
	keywords: keywords,
	exports: exports,
	main: main$1,
	module: module,
	types: types,
	typesVersions: typesVersions,
	bin: bin,
	files: files,
	scripts: scripts,
	dependencies: dependencies,
	devDependencies: devDependencies,
	prettier: prettier
};

program.version(pkg.version).option("-u, --user <user>", "Loki username").option("-p, --password <password>", "Loki password").option("--hostname <hostname>", "URL for Loki").option("-b, --batch", "Should logs be sent in batch mode").option("-i, --interval <interval>", "The interval at which batched logs are sent in seconds").option("-t, --timeout <timeout>", "Timeout for request to Loki").option("-s, --silenceErrors", "If false, errors will be displayed in the console").option("-r, --replaceTimestamp", "Replace pino logs timestamps with Date.now()").option("-l, --labels <label>", "Additional labels to be added to all Loki logs").option("-a, --convertArrays", "If true, arrays will be converted to objects").option(
  "-pl, --propsLabels <labels>",
  "Fields in log line to convert to Loki labels (comma separated values)"
).option("--no-stdout", "Disable output to stdout");
const createPinoLokiConfigFromArgs = () => {
  const opts = program.parse(process.argv).opts();
  const config = {
    host: opts.hostname,
    timeout: opts.timeout,
    silenceErrors: opts.silenceErrors,
    batching: opts.batch,
    interval: opts.interval,
    replaceTimestamp: opts.replaceTimestamp,
    labels: opts.labels ? JSON.parse(opts.labels) : void 0,
    propsToLabels: opts.propsLabels ? opts.propsLabels.split(",") : [],
    convertArrays: opts.convertArrays
  };
  if (opts.user && opts.password) {
    config.basicAuth = { username: opts.user, password: opts.password };
  }
  return config;
};
function main() {
  const config = createPinoLokiConfigFromArgs();
  const pinoLoki$1 = pinoLoki(config);
  pump(process.stdin, pinoLoki$1);
}
main();

export { createPinoLokiConfigFromArgs };
