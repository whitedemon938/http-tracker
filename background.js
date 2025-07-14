let requests = [];

chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    if (details.url.startsWith('https://')) {
      const requestInfo = {
        url: details.url,
        method: details.method,
        type: details.type,
        timestamp: new Date(details.timeStamp).toISOString()
      };
      console.log('API Request:', requestInfo);
      requests.push(requestInfo);
      if (requests.length > 100) requests.shift(); // Limit to 100 requests
    }
  },
  { urls: ["<all_urls>"] },
  ["requestBody"]
);

chrome.webRequest.onBeforeSendHeaders.addListener(
  function(details) {
    if (details.url.startsWith('https://')) {
      console.log('Request Headers:', details.requestHeaders);
      const request = requests.find(req => req.url === details.url);
      if (request) request.headers = details.requestHeaders;
    }
  },
  { urls: ["<all_urls>"] },
  ["requestHeaders"]
);

chrome.webRequest.onCompleted.addListener(
  function(details) {
    if (details.url.startsWith('https://')) {
      console.log('Response Details:', {
        url: details.url,
        statusCode: details.statusCode,
        responseHeaders: details.responseHeaders
      });
      const request = requests.find(req => req.url === details.url);
      if (request) {
        request.statusCode = details.statusCode;
        request.responseHeaders = details.responseHeaders;
      }
    }
  },
  { urls: ["<all_urls>"] },
  ["responseHeaders"]
);

// Handle messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'getRequests') {
    sendResponse({ requests: requests });
  }
});
