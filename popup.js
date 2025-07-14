document.addEventListener('DOMContentLoaded', () => {
  chrome.runtime.sendMessage({ type: 'getRequests' }, (response) => {
    const requestList = document.getElementById('request-list');
    if (!response || !response.requests) {
      requestList.innerHTML = '<p>No requests tracked yet.</p>';
      return;
    }
    
    response.requests.forEach((req, index) => {
      const requestDiv = document.createElement('div');
      requestDiv.className = 'request';
      requestDiv.innerHTML = `
        <strong>Request ${index + 1}</strong><br>
        URL: ${req.url}<br>
        Method: ${req.method}<br>
        Type: ${req.type}<br>
        Timestamp: ${req.timestamp}<br>
        Status Code: ${req.statusCode || 'Pending'}<br>
        Headers: ${req.headers ? JSON.stringify(req.headers, null, 2) : 'N/A'}
      `;
      requestList.appendChild(requestDiv);
    });
  });
});
