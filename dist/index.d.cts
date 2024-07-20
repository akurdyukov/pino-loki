import * as stream from 'stream';
import abstractTransportBuild from 'pino-abstract-transport';
import { L as LokiOptions } from './shared/pino-loki.bec8a9b6.cjs';
export { a as LokiLogLevel } from './shared/pino-loki.bec8a9b6.cjs';

declare function pinoLoki(userOptions: LokiOptions): stream.Transform & abstractTransportBuild.OnUnknown;

export { LokiOptions, pinoLoki as default };