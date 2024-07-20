'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const abstractTransportBuild = require('pino-abstract-transport');
const node_util = require('node:util');
const got = require('got');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

const abstractTransportBuild__default = /*#__PURE__*/_interopDefaultCompat(abstractTransportBuild);
const got__default = /*#__PURE__*/_interopDefaultCompat(got);

const debug = node_util.debuglog("pino-loki");

var LokiLogLevel = /* @__PURE__ */ ((LokiLogLevel2) => {
  LokiLogLevel2["Info"] = "info";
  LokiLogLevel2["Debug"] = "debug";
  LokiLogLevel2["Error"] = "error";
  LokiLogLevel2["Warning"] = "warning";
  LokiLogLevel2["Critical"] = "critical";
  return LokiLogLevel2;
})(LokiLogLevel || {});

var __accessCheck$1 = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet$1 = (obj, member, getter) => {
  __accessCheck$1(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd$1 = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet$1 = (obj, member, value, setter) => {
  __accessCheck$1(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var __privateMethod$1 = (obj, member, method) => {
  __accessCheck$1(obj, member, "access private method");
  return method;
};
var _propsToLabels, _levelMap, _messageField, _buildTimestamp, buildTimestamp_fn, _stringifyLog, stringifyLog_fn, _buildLabelsFromProps, buildLabelsFromProps_fn;
const NANOSECONDS_LENGTH = 19;
class LogBuilder {
  constructor(options) {
    /**
     * Builds a timestamp string from a Pino log object.
     * @returns A string representing the timestamp in nanoseconds.
     */
    __privateAdd$1(this, _buildTimestamp);
    /**
     * Stringify the log object. If convertArrays is true then it will convert
     * arrays to objects with indexes as keys.
     */
    __privateAdd$1(this, _stringifyLog);
    __privateAdd$1(this, _buildLabelsFromProps);
    __privateAdd$1(this, _propsToLabels, void 0);
    __privateAdd$1(this, _levelMap, void 0);
    __privateAdd$1(this, _messageField, void 0);
    __privateSet$1(this, _propsToLabels, options?.propsToLabels || []);
    __privateSet$1(this, _levelMap, Object.assign(
      {
        10: LokiLogLevel.Debug,
        20: LokiLogLevel.Debug,
        30: LokiLogLevel.Info,
        40: LokiLogLevel.Warning,
        50: LokiLogLevel.Error,
        60: LokiLogLevel.Critical
      },
      options?.levelMap
    ));
    __privateSet$1(this, _messageField, options?.messageField);
  }
  /**
   * Convert a level to a human-readable status
   */
  statusFromLevel(level) {
    return __privateGet$1(this, _levelMap)[level] || LokiLogLevel.Info;
  }
  /**
   * Build a loki log entry from a pino log
   */
  build(options) {
    const status = this.statusFromLevel(options.log.level);
    const time = __privateMethod$1(this, _buildTimestamp, buildTimestamp_fn).call(this, options.log, options.replaceTimestamp);
    const propsLabels = __privateMethod$1(this, _buildLabelsFromProps, buildLabelsFromProps_fn).call(this, options.log);
    const hostname = options.log.hostname;
    options.log.hostname = void 0;
    const message = __privateGet$1(this, _messageField) ? options.log[__privateGet$1(this, _messageField)] : __privateMethod$1(this, _stringifyLog, stringifyLog_fn).call(this, options.log, options.convertArrays);
    const labels = {
      ...options.additionalLabels,
      ...propsLabels
    };
    return {
      stream: {
        level: status,
        hostname,
        ...labels
      },
      values: [[time, message]]
    };
  }
}
_propsToLabels = new WeakMap();
_levelMap = new WeakMap();
_messageField = new WeakMap();
_buildTimestamp = new WeakSet();
buildTimestamp_fn = function(log, replaceTimestamp) {
  if (replaceTimestamp) {
    return ((/* @__PURE__ */ new Date()).getTime() * 1e6).toString();
  }
  const time = log.time || Date.now();
  const strTime = time.toString();
  if (strTime.length === NANOSECONDS_LENGTH) {
    return strTime;
  }
  const missingFactor = 10 ** (19 - strTime.length);
  return (time * missingFactor).toString();
};
_stringifyLog = new WeakSet();
stringifyLog_fn = function(log, convertArrays) {
  return JSON.stringify(log, (_, value) => {
    if (!convertArrays)
      return value;
    if (Array.isArray(value)) {
      return Object.fromEntries(value.map((value2, index) => [index, value2]));
    }
    return value;
  });
};
_buildLabelsFromProps = new WeakSet();
buildLabelsFromProps_fn = function(log) {
  const labels = {};
  for (const prop of __privateGet$1(this, _propsToLabels)) {
    if (log[prop]) {
      labels[prop] = log[prop];
    }
  }
  return labels;
};

var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var __privateMethod = (obj, member, method) => {
  __accessCheck(obj, member, "access private method");
  return method;
};
var _options, _logBuilder, _client, _handleFailure, handleFailure_fn;
class LogPusher {
  constructor(options) {
    /**
     * Handle push failures
     */
    __privateAdd(this, _handleFailure);
    __privateAdd(this, _options, void 0);
    __privateAdd(this, _logBuilder, void 0);
    __privateAdd(this, _client, void 0);
    __privateSet(this, _options, options);
    __privateSet(this, _client, got__default.extend({
      ...__privateGet(this, _options).host && { prefixUrl: __privateGet(this, _options).host },
      timeout: { request: __privateGet(this, _options).timeout ?? 3e4 },
      headers: options.headers ?? {},
      ...__privateGet(this, _options).basicAuth && {
        username: __privateGet(this, _options).basicAuth?.username,
        password: __privateGet(this, _options).basicAuth?.password
      }
    }));
    __privateSet(this, _logBuilder, new LogBuilder({
      levelMap: options.levelMap,
      propsToLabels: options.propsToLabels,
      messageField: options.messageField
    }));
  }
  /**
   * Push one or multiples logs entries to Loki
   */
  async push(logs) {
    if (!Array.isArray(logs)) {
      logs = [logs];
    }
    const lokiLogs = logs.map(
      (log) => __privateGet(this, _logBuilder).build({
        log,
        replaceTimestamp: __privateGet(this, _options).replaceTimestamp,
        additionalLabels: __privateGet(this, _options).labels,
        convertArrays: __privateGet(this, _options).convertArrays
      })
    );
    debug(`[LogPusher] pushing ${lokiLogs.length} logs to Loki`);
    await __privateGet(this, _client).post(`loki/api/v1/push`, { json: { streams: lokiLogs } }).catch(__privateMethod(this, _handleFailure, handleFailure_fn).bind(this));
    debug(`[LogPusher] pushed ${lokiLogs.length} logs to Loki`, { logs: lokiLogs });
  }
}
_options = new WeakMap();
_logBuilder = new WeakMap();
_client = new WeakMap();
_handleFailure = new WeakSet();
handleFailure_fn = function(err) {
  if (__privateGet(this, _options).silenceErrors === true) {
    return;
  }
  if (err instanceof got.RequestError) {
    console.error(
      "Got error when trying to send log to Loki:",
      err.message + "\n" + err.response?.body
    );
    return;
  }
  console.error("Got unknown error when trying to send log to Loki, error output:", err);
};

function resolveOptions(options) {
  return {
    ...options,
    timeout: options.timeout ?? 3e4,
    silenceErrors: options.silenceErrors ?? false,
    batching: options.batching ?? true,
    interval: options.interval ?? 5,
    replaceTimestamp: options.replaceTimestamp ?? false,
    propsToLabels: options.propsToLabels ?? [],
    convertArrays: options.convertArrays ?? false
  };
}
function pinoLoki(userOptions) {
  const options = resolveOptions(userOptions);
  const logPusher = new LogPusher(options);
  debug(`[PinoLoki] initialized with options: ${JSON.stringify(options)}`);
  let batchInterval;
  let pinoLogBuffer = [];
  return abstractTransportBuild__default(
    async (source) => {
      if (options.batching) {
        batchInterval = setInterval(async () => {
          debug(`Batch interval reached, sending ${pinoLogBuffer.length} logs to Loki`);
          if (pinoLogBuffer.length === 0) {
            return;
          }
          await logPusher.push(pinoLogBuffer);
          pinoLogBuffer = [];
        }, options.interval * 1e3);
      }
      for await (const obj of source) {
        if (options.batching) {
          pinoLogBuffer.push(obj);
          continue;
        }
        await logPusher.push(obj);
      }
    },
    {
      /**
       * When transport is closed, push remaining logs to Loki
       * and clear the interval
       */
      async close() {
        if (options.batching) {
          clearInterval(batchInterval);
          await logPusher.push(pinoLogBuffer);
        }
      }
    }
  );
}

exports.LokiLogLevel = LokiLogLevel;
exports.default = pinoLoki;