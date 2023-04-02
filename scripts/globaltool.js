/// globaltool.js - 1.1 ///

// $q: Alias for document.querySelector
const $q = document.querySelector.bind(document);

// $qAll: Alias for document.querySelectorAll
const $qAll = document.querySelectorAll.bind(document);


/**
 * Creates a new element with given settings.
 * @return {Element} The new element.
 */
const $new = function(tag, { parent, attributes, classes, text, id }) {
    const el = document.createElement(tag);
    if (parent) parent.appendChild(el);
    if (attributes)
        for (var key in attributes) el.setAttribute(key, attributes[key]);
    if (classes)
        for (var i = 0; i < classes.length; i++) el.classList.add(classes[i]);
    if (text) el.appendChild(document.createTextNode(text));
    if (id) el.id = id;
    return el;
};


/**
 * Creates a global event on body, which is triggered when the event target matches the given selector.
 * @param {string} event The event to listen for.
 * @param {string} selector The selector to match.
 * @param {EventListenerOrEventListenerObject} callback The callback to call when the event is triggered.
 * @param {boolean | AddEventListenerOptions} [options] The options to use.
 */
const $globalEvent = function(event, selector, callback, options) {
    document.body.addEventListener(event, function(e) {
        if (e.target.matches(selector)) callback(e);
    }, options);
};


//#region $ajax

/**
 * $ajax: Global JSON ajax utilities.
 */
const $ajax = {};
$ajax._baseURI = "";
$ajax._logToConsole = true;

$ajax._request = async function(method, url, data, color) {
    if ($ajax._logToConsole) {
        console.log(">> %c%s %c%s", `color: ${color || "#000"}`, method, "color: inherit", url);
    }

    // Is it a relative url?
    if (!url.match(/^(http|https)?:?\/\//)) {
        // Add/Remove trailing slashes if needed
        if (url.startsWith("/") && $ajax._baseURI.endsWith("/")) {
            url = url.substring(1);
        } else if (!url.startsWith("/") && !$ajax._baseURI.endsWith("/")) {
            url = "/" + url;
        }

        // Append to baseURI
        url = $ajax._baseURI + url;
    }

    data = data || {};
    data.method = method;
    data.headers = data.headers || {};
    data.headers["Content-Type"] = "application/json";
    data.body = data.body ? JSON.stringify(data.body) : data.body;
    data.credentials = 'include';

    const res = await fetch(url, data);
    return res;
};


/**
 * Send a POST request to the server using fetch API.
 * @param {RequestInfo} url The url to send the request to.
 * @param {RequestInit} data The data to send. Will be converted to JSON.
 * @returns {Promise<Response>} A promise that resolves to the response.
 */
$ajax.post = async function(url, data) {
    return $ajax._request("POST", url, data, "#ffaa00");
};


/**
 * Send a GET request to the server using fetch API.
 * @param {RequestInfo} url The url to send the request to.
 * @param {RequestInit} data
 * @returns {Promise<Response>} A promise that resolves to the response.
 */
$ajax.get = async function(url, data) {
    return $ajax._request("GET", url, data, "#00aaff");
};


/**
 * Send a PATCH request to the server using fetch API.
 * @param {RequestInfo} url The url to send the request to.
 * @param {RequestInit} data The data to send. Will be converted to JSON.
 * @returns {Promise<Response>} A promise that resolves to the response.
 */
$ajax.patch = async function(url, data) {
    return $ajax._request("PATCH", url, data, "#ffaa00");
};


/**
 * Send a PUT request to the server using fetch API.
 * @param {RequestInfo} url The url to send the request to.
 * @param {RequestInit} data The data to send. Will be converted to JSON.
 * @returns {Promise<Response>} A promise that resolves to the response.
 */
$ajax.put = async function(url, data) {
    return $ajax._request("PUT", url, data, "#ffaa00");
};


/**
 * Send a DELETE request to the server using fetch API.
 * @param {RequestInfo} url The url to send the request to.
 * @param {RequestInit} data The data to send. Will be converted to JSON.
 * @returns {Promise<Response>} A promise that resolves to the response.
 */
$ajax.delete = async function(url, data) {
    return $ajax._request("DELETE", url, data, "#b34045");
};

//#endregion