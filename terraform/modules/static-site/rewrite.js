function handler(event) {
  var req = event.request;
  var uri = req.uri;

  if (uri.endsWith("/index.html")) {
    return {
      statusCode: 301,
      statusDescription: "Moved Permanently",
      headers: { location: { value: uri.slice(0, -10) } },
    };
  }

  if (!uri.endsWith("/") && !uri.includes(".")) {
    return {
      statusCode: 301,
      statusDescription: "Moved Permanently",
      headers: { location: { value: uri + "/" } },
    };
  }

  if (uri.endsWith("/")) req.uri += "index.html";
  return req;
}
