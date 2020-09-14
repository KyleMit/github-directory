exports.handler = async(event) => {
    let name = event.queryStringParameters.q;
    let msg = `<html>Hello, ${name}</html>`

    let response = {
        statusCode: 200,
        headers: {
            'Content-Type': 'text/html',
        },
        body: msg,
    };
    return response;
};