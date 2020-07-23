import { env } from '../environmentSwitch'

let url = ''

if (env === 'dev1') {
  url = 'http://localhost:5001/api/';
} else if (env === 'dev2') {
  url = 'http://localhost:8888/api/';
} else if (env === 'stag') {
  url = 'https://testing-backend.prequalusa.com/api/';
} else if (env === 'prod') {
  url = 'https://api.prequalusa.com/api/';
} else if (env === 'sbx') {
  url = 'https://backend-sandbox.vertikalrms.com/api/';
} else if (env === 'vrk') {
  url = 'https://backend-prod.vertikalrms.com/api/';
} else if (env === 'vrk-stg') {
  url = 'https://backend-stage.vertikalrms.com/api/';
}

export const URL_API = url
