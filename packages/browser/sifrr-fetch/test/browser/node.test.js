global.fetch = require('node-fetch');
const fetch = require('../../src/sifrr.fetch').default;
const axios = require('axios');
const http = require('http');

function getByHttp() {
  return new Promise((res, rej) => {
    http
      .get(`${PATH}/ok.json`, resp => {
        let data = '';

        // A chunk of data has been recieved.
        resp.on('data', chunk => {
          data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
          res(JSON.parse(data));
        });
      })
      .on('error', rej);
  });
}

function getMs(tuple) {
  return tuple[0] * 1000 + tuple[1] / 1000000;
}

describe('works with node', () => {
  it('gets request', async () => {
    const resp = await fetch.get(`${PATH}/ok.json`);
    expect(resp).to.deep.equal({
      from: 'file'
    });
  });

  it('posts request', async () => {
    const resp = await fetch.post(`${PATH}/post`, {
      body: {
        ok: 'ok'
      }
    });
    expect(resp).to.deep.equal({
      ok: 'ok'
    });
  });

  it('speed test', async () => {
    const startNode = process.hrtime();
    for (let i = 0; i < 300; i++) {
      await getByHttp();
    }
    const endNode = process.hrtime();

    const startFetch = process.hrtime();
    for (let i = 0; i < 300; i++) {
      await fetch.get(`${PATH}/ok.json`);
    }
    const endFetch = process.hrtime();

    const startAxios = process.hrtime();
    for (let i = 0; i < 300; i++) {
      await axios.get(`${PATH}/ok.json`).then(r => r.data);
    }
    const endAxios = process.hrtime();

    const nodeTime = getMs(endNode) - getMs(startNode);
    const fetchTime = getMs(endFetch) - getMs(startFetch);
    const axiosTime = getMs(endAxios) - getMs(startAxios);

    console.table({
      nodeTime,
      fetchTime,
      axiosTime
    });
  });
});
