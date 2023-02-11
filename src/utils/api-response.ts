const defaultHeader: object = {
  'Access-Control-Allow-Headers':
    'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent',
  'Access-Control-Allow-Methods': 'OPTIONS,GET,PUT,POST,PATCH',
  'Access-Control-Allow-Credentials': true,
};

const apiResponses = {
  _200: (
    body: { [key: string]: any },
    origin: string = "",
    cookie: Array<string> = [""]
  ) => {
    const rep = {
      statusCode: 200,
      headers: Object.assign(defaultHeader, {
        "Access-Control-Allow-Origin": origin,
      }),
      multiValueHeaders: { "Set-Cookie": cookie },
      body: JSON.stringify(body, null, 2),
    };
    return rep;
  },
  _201: (
    body: { [key: string]: any },
    origin: string = "",
    cookie: Array<string> = [""]
  ) => {
    const rep = {
      statusCode: 200,
      headers: Object.assign(defaultHeader, {
        "Access-Control-Allow-Origin": origin,
      }),
      multiValueHeaders: { "Set-Cookie": cookie },
      body: JSON.stringify(body, null, 2),
    };
    return rep;
  },
  _400: (
    body: { [key: string]: any },
    origin: string = "",
    cookie: Array<string> = [""]
  ) => {
    return {
      statusCode: 400,
      headers: Object.assign(defaultHeader, {
        "Access-Control-Allow-Origin": origin,
      }),
      multiValueHeaders: { "Set-Cookie": cookie },
      body: JSON.stringify(body, null, 2),
    };
  },
  _404: (
    body: { [key: string]: any },
    origin: string = "",
    cookie: Array<string> = [""]
  ) => {
    return {
      statusCode: 400,
      headers: Object.assign(defaultHeader, {
        "Access-Control-Allow-Origin": origin,
      }),
      multiValueHeaders: { "Set-Cookie": cookie },
      body: JSON.stringify(body, null, 2),
    };
  },
  _500: (
    body: { [key: string]: any },
    origin: string = "",
    cookie: Array<string> = [""]
  ) => {
    return {
      statusCode: 500,
      headers: Object.assign(defaultHeader, {
        "Access-Control-Allow-Origin": origin,
      }),
      multiValueHeaders: { "Set-Cookie": cookie },
      body: JSON.stringify(body, null, 2),
    };
  },
};
export default apiResponses;
