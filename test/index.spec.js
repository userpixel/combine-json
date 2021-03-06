const { expect } = require('chai')
const yaml = require('js-yaml')
const ini = require('ini')
const { combine } = require('../index')

describe('combine()', () => {
    it('can parse a basic folder', async () => {
        const myData = await combine('test/my-data')
        expect(myData).to.deep.equal({
            "name": "Alex Ewerlöf",
            "address": {
                "street": "Hittepågatan 13",
                "city": "Stockholm",
                "country": "Sweden",
                "zip": "11122"
            },
            "todos": [
                {
                    "id": 1,
                    "title": "document the module",
                },
                {
                    "id": 2,
                    "title": "write some tests",
                },
                {
                    "id": 3,
                    "title": "publish it for good",
                }
            ]
        });
    })

    it('throws if the directory does not exist', async () => {
        try {
            await combine('non-existing-path')
        } catch (err) {
            expect(err).to.be.an('error')
        }
    })

    it('throws if both a directory and a JSON file with the same name exist', async () => {
        try {
            await combine('test/dir-and-json')
        } catch (err) {
            expect(err).to.be.an('error')
        }
    })

    it('supports custom parser (yaml)', async () => {
        const myData = await combine('test/my-data-yaml', { include: '*.yaml', parser: yaml.safeLoad })
        expect(myData).to.deep.equal({
            "name": "Alex Ewerlöf",
            "address": {
                "street": "Hittepågatan 13",
                "city": "Stockholm",
                "country": "Sweden",
                "zip": "11122"
            },
            "todos": [
                {
                    "id": 1,
                    "title": "document the module",
                },
                {
                    "id": 2,
                    "title": "write some tests",
                },
                {
                    "id": 3,
                    "title": "publish it for good",
                }
            ]
        });
    })

    it('supports custom parser (ini)', async () => {
        const myData = await combine('test/my-data-ini', { include: '*.ini', parser: ini.parse })
        expect(myData).to.deep.equal({
            "address": {
                "street": "Hittepågatan 13",
                "city": "Stockholm",
                "country": "Sweden",
                "zip": "11122"
            },
            "todos": [
                {
                    "id": "1",
                    "title": "document the module",
                },
                {
                    "id": "2",
                    "title": "write some tests",
                },
                {
                    "id": "3",
                    "title": "publish it for good",
                }
            ]
        });
    })
})