import faunadb from 'faunadb'

export const q = faunadb.query

const client = new faunadb.Client({
    secret: 'fnAEywx4GAACU8GiaiqOvIwk3i4qoRoeq9ItiOCU',
    domain: 'db.fauna.com',
    scheme: 'https',
})

export default client