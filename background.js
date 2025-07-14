let trackedRequests = [];

// Track outgoing HTTPS requests with headers
chrome.webRequest.onBeforeSendHeaders.addListener(
  (details) => {
    if (details.url.startsWith("https://")) {
      trackedRequests.push({
        url: details.url,
        method: details.method,
        time: new Date(details.timeStamp).toISOString(),
        requestHeaders: details.requestHeaders
      });

      if (trackedRequests.length > 100) trackedRequests.shift();

      console.log("Tracked API Request:", details.url);
    }
  },
  { urls: ["<all_urls>"] },
  ["requestHeaders"]
);

// Track completed requests
chrome.webRequest.onCompleted.addListener(
  (details) => {
    const req = trackedRequests.find((r) => r.url === details.url);
    if (req) {
      req.statusCode = details.statusCode;
      req.responseHeaders = details.responseHeaders;
    }
    console.log("API Request Completed:", details.url);
  },
  { urls: ["<all_urls>"] },
  ["responseHeaders"]
);

// Respond to popup requests
chrome.runtime.onMessage.addListener((msg, sender, respond) => {
  if (msg.type === "getRequests") {
    respond({ trackedRequests });
  }
});
