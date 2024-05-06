import jsonwebtoken from 'jsonwebtoken'
import {createLogger} from '../../utils/logger.mjs'

const logger = createLogger('auth')

const certificate = `-----BEGIN CERTIFICATE-----
MIIDHTCCAgWgAwIBAgIJQoaqUXPqyq9MMA0GCSqGSIb3DQEBCwUAMCwxKjAoBgNV
BAMTIWRldi02Z2xiODI2bG9naDNoNWtzLnVzLmF1dGgwLmNvbTAeFw0yNDA1MDUx
MTUyMThaFw0zODAxMTIxMTUyMThaMCwxKjAoBgNVBAMTIWRldi02Z2xiODI2bG9n
aDNoNWtzLnVzLmF1dGgwLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC
ggEBAM7WDGYI2RbWZW8elpMvaO3zg6JVDsv7AOOUpLDtoeNUBssKUSaOsN+8NksE
MiapxI3nxG5p3+pyQFtjIDKHD6WYWexJhS8BcBc5WEwZpTlh7xK05Tf1BXhzra4+
Cnd1pP4F3HF/gTQFVF+aZSuckLmhrpui6XYkcoskXa1HF5Qx1VgwQragP+0p/gVA
Q4I1+FyKiWddxxqBcWL+sVtmWvwnySEK1TF0N4CHPyFzlbk22kEMBlk6QsrasNck
um82sTWnhWRbn1Dep6gkLwOTk4vLbTqdQJG2FwEoVsgdXjt41t133iYv80xdlTAs
WxdRZrp7poqHzN146QlAekv3c3UCAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAd
BgNVHQ4EFgQUGFgGXpxHNXr44sVveKU854qT4Z0wDgYDVR0PAQH/BAQDAgKEMA0G
CSqGSIb3DQEBCwUAA4IBAQC130FAiCKeEL91DWIc5qhvwIzNbGmUqdS7VyHmLDCJ
J5duRHvs9TyuF61h2hpUckAemPB92s1wSDm4thRd9beVLerJQ4Ao98k2YBW3YlD2
vgwH17v+1FXPBY9vcw05qlEtkpbLlBAdHdgGVtNclRPmtxP1y1fPwaIq876CxMDn
uzncDntC23QtMLkAgL41fvDJnk6OeMAexuKXksmQQEmwHVB4tHhbejhXRGlxu+8x
LbEUJ52UBuwVoIUb4fP/ZEIC4KyesnmTfp5oH6l62XmeXo9prnYZUfdfworH2S10
1GZvXUevB1p6jBD2Q6YQ77Evzy0dEiC0w+jzluKCr/rE
-----END CERTIFICATE-----`
export async function handler(event) {
  try {
    const jwtToken = await verifyToken(event.authorizationToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader) {
  const token = getToken(authHeader)
  const jwt = jsonwebtoken.decode(token, { complete: true })
  return jsonwebtoken.verify(token, certificate, { algorithms: ['RS256'] })
}

function getToken(authHeader) {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
