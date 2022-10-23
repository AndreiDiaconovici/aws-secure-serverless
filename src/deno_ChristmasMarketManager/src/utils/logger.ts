// import { Houston, type Config } from 'https://deno.land/x/houston/mod.ts'

// let sessionLogger: Houston | undefined

// function getLogger (): Houston {
//   if (sessionLogger == null) {
//     sessionLogger = new Houston({
//       transports: [new winston.transports.Console()]
//     })
//     return sessionLogger
//   }
//   return sessionLogger
// }

export const logger = console
