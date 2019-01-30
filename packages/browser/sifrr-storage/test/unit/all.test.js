const SifrrStorage = require('../../src/sifrr.storage');
const JsonStorage = require('../../src/storages/jsonstorage'),
  JSONP = require('../../src/utils/json'),
  Storage = require('../../src/storages/storage');

describe('SifrrStorage', () => {
  describe('#new', () => {
    it('should return supported storage by default', () => {
      let x = new SifrrStorage();
      expect(x).to.be.an.instanceof(SifrrStorage.availableStores['indexeddb']);
      assert.equal(x.type, 'indexeddb');
    });

    Object.keys(SifrrStorage.availableStores).forEach((type) => {
      it(`should return ${type} if ${type} is prioritized`, () => {
        let x = new SifrrStorage({priority: [type]});
        expect(x).to.be.an.instanceof(SifrrStorage.availableStores[type]);
        assert.equal(x.type, type);
      });
    });
  });

  describe('#all', () => {
    it('should return all instances there are', () => {
      SifrrStorage._all = [];
      new SifrrStorage({ priority: ['cookies'] });
      new SifrrStorage({ priority: ['indexeddb'] });
      assert.equal(SifrrStorage.all.length, 2);
    });
  });

  describe('#json', () => {
    it('should return jsonstorage', () => {
      let x = SifrrStorage.json({ a: 'b' });
      assert.equal(x.type, 'jsonstorage');
    });
  });
});

describe('JsonStorage', () => {
  let options = {
    name: 'SifrrStorage',
    version: 1
  };

  describe('#new', () => {
    it('should parse provided string', () => {
      let x = new JsonStorage(options, '{"a": "b"}');
      assert.equal(x.store['a'], 'b');
      let y = new JsonStorage(options, '[{"a": "b"}]');
      assert.equal(y.store[0]['a'], 'b');
    });

    it('should not parse provided object', () => {
      let x = new JsonStorage(options, {a: 'b'});
      assert.equal(x.store['a'], 'b');
    });
  });
});

describe('Storage', () => {
  let x = new Storage();

  describe('#_parseKeyValue', () => {
    it('should return key if key is array and value is not there', () => {
      assert.deepEqual(x._parseKeyValue([0, 1, 2]), [0, 1, 2]);
    });

    it('should return object if key is object and value is not there', () => {
      assert.deepEqual(x._parseKeyValue({a: 'b', c: 'd'}), {a: 'b', c: 'd'});
    });

    it('should return array if key is string and value is not there', () => {
      assert.deepEqual(x._parseKeyValue('a'), ['a']);
    });

    it('should return object if key is string and value is string', () => {
      assert.deepEqual(x._parseKeyValue('a', 'b'), {a: 'b'});
    });
  });
});

describe('JSON', () => {
  it('returns value if not parsable', () => {
    assert.equal(JSONP.parse(null), null);
    assert.equal(JSONP.parse(undefined), undefined);
  });
});
