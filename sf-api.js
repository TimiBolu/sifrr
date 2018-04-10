class SFAPI {
  static getHTTP(url, options, type) {
    options = Object.assign({
      params: {},
      headers: {}
    }, options);
    let ans = Object.keys(options.params).map(k =>
      encodeURIComponent(k) + '=' + encodeURIComponent(params[k])
    ).join('&');
    let defaultHeaders = {
      'accept': 'application/json'
    }
    if (type === "POST" && Object.keys(options.body).length > 0) {
      options.headers['content-type'] = 'multipart/form-data';
    }
    Object.assign(options, {
      method: type,
      headers: Object.assign(defaultHeaders, options.headers),
      mode: 'cors',
      redirect: 'follow',
    });
    return fetch(url + '?' + ans, options).then(resp => {
      let reader = resp.clone().body.getReader();
      let bytesReceived = 0;
      let length = resp.headers.get("Content-Length");
      return reader.read().then(function processResult(result) {
        if (result.done) {
          if (resp.ok) {
            if (options.headers.accept == 'application/json') return resp.json();
            return resp.body;
          } else {
            throw Error(resp.statusText);
          }
        }
        bytesReceived += result.value.length;
        console.log(`Received ${bytesReceived} (${bytesReceived/length}) bytes of data so far`);
        return reader.read().then(processResult);
      });
    });
  }
  static get(url, options = {}) {
    return this.getHTTP(url, options, "GET");
  }

  static post(url, options = {}) {
    return this.getHTTP(url, options, "POST");
  }

  static put(url, options = {}) {
    return this.getHTTP(url, options, "PUT");
  }

  static delete(url, options = {}) {
    return this.getHTTP(url, options, "DELETE");
  }

  static file(url, options = {}) {
    options.headers = options.headers || {};
    options.headers.accept = options.headers.accept || '*/*';
    return this.getHTTP(url, options, "GET");
  }
}