function isServer()
{
    // Rudimentary check to see if we are running on Live. Should provide a more flexible config.
    return window.location.hostname.indexOf('test') > 0;
}

export let SERVER_URL = isServer() ? "/" : "http://192.168.0.5:8080/";

//"http://192.168.0.207:8080/"
