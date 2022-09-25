module.exports = {
    serverRuntimeConfig: {
        secret: ')rhEFo^1$;RzOfOb8yf]IA20n~+x,sr[;Kk~4Pvm(lOavr8yna',
        CLIENT_ID: '1023321876581322802',
        CLIENT_SECRET: 'oB8yncgkmRfHb92i6EVEihjyal6NL8iB',
    },
    publicRuntimeConfig: {
        apiUrl: process.env.NODE_ENV === 'development'
            ? 'http://localhost:3000/api' // development api
            : 'https://collabify-oag5.vercel.app/api' // production api
    }
}
