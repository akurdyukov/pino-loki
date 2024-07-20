import * as stream from 'stream';
import abstractTransportBuild from 'pino-abstract-transport';
import { L as LokiOptions } from './shared/pino-loki.57583884.cjs';
export { a as LokiLogLevel } from './shared/pino-loki.57583884.cjs';

declare function pinoLoki(userOptions: LokiOptions): stream.Transform & abstractTransportBuild.OnUnknown;

export { LokiOptions, pinoLoki as default };
