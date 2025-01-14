import abstractTransportBuild from 'pino-abstract-transport'

import debug from './debug'
import { LokiLogLevel } from './types'
import { LogPusher } from './log_pusher'
import type { PinoLog, LokiOptions } from './types'

/**
 * Resolves the options for the Pino Loki transport
 */
function resolveOptions(options: LokiOptions) {
  return {
    ...options,
    timeout: options.timeout ?? 30_000,
    silenceErrors: options.silenceErrors ?? false,
    batching: options.batching ?? true,
    interval: options.interval ?? 5,
    replaceTimestamp: options.replaceTimestamp ?? false,
    propsToLabels: options.propsToLabels ?? [],
    convertArrays: options.convertArrays ?? false,
  }
}

function pinoLoki(userOptions: LokiOptions) {
  const options = resolveOptions(userOptions)
  const logPusher = new LogPusher(options)

  debug(`[PinoLoki] initialized with options: ${JSON.stringify(options)}`)

  let batchInterval: NodeJS.Timeout | undefined
  let pinoLogBuffer: PinoLog[] = []

  return abstractTransportBuild(
    async (source) => {
      if (options.batching) {
        batchInterval = setInterval(async () => {
          debug(`Batch interval reached, sending ${pinoLogBuffer.length} logs to Loki`)

          if (pinoLogBuffer.length === 0) {
            return
          }

          await logPusher.push(pinoLogBuffer)
          pinoLogBuffer = []
        }, options.interval! * 1000)
      }

      for await (const obj of source) {
        if (options.batching) {
          pinoLogBuffer.push(obj)
          continue
        }

        await logPusher.push(obj)
      }
    },
    {
      /**
       * When transport is closed, push remaining logs to Loki
       * and clear the interval
       */
      async close() {
        if (options.batching) {
          clearInterval(batchInterval!)
          await logPusher.push(pinoLogBuffer)
        }
      },
    },
  )
}

export default pinoLoki
export type { LokiOptions }
export { LokiLogLevel }
