declare enum LokiLogLevel {
    Info = "info",
    Debug = "debug",
    Error = "error",
    Warning = "warning",
    Critical = "critical"
}
interface LokiOptions {
    host: string;
    timeout?: number;
    silenceErrors?: boolean;
    batching?: boolean;
    interval?: number;
    replaceTimestamp?: boolean;
    labels?: {
        [key: string]: string;
    };
    levelMap?: {
        [key: number]: LokiLogLevel;
    };
    basicAuth?: {
        username: string;
        password: string;
    };
    headers?: Record<string, string>;
    propsToLabels?: string[];
    convertArrays?: boolean;
    messageField?: string;
}

export { type LokiOptions as L, LokiLogLevel as a };