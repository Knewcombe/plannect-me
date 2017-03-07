function isServer()
{
    // Rudimentary check to see if we are running on Live. Should provide a more flexible config.
    return window.location.hostname.indexOf('https://ec2-35-167-1-235.us-west-2.compute.amazonaws.com') > 0;
}

export let SERVER_URL = isServer() ? "/" : "http://localhost:8080/";

//"http://192.168.0.207:8080/"
//https://plannectme.com/
