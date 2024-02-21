export function authHeader() {
    // return authorization header with jwt token
    let user = JSON.parse(localStorage.getItem('user'));

    if (user && user.accessToken) {
        return {
            'X-Access-Token': user.accessToken,
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
            "Access-Control-Allow-Methods": "*"
        };
    } else {
        return {};
    }
}