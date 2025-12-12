    function isValidIP(ip) { const ipv4Pattern = /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/; const ipv6Pattern = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/; return ipv4Pattern.test(ip) || ipv6Pattern.test(ip); }
    function getIPInfo(inputIP = null) {
        const ipField = document.getElementById("ipInput");
        const resultDiv = document.getElementById("result");
        const ip = inputIP === 'self' ? '' : ipField.value.trim();
        if (!ip && inputIP !== 'self') { resultDiv.innerHTML = "<strong>Please enter an IP address.</strong>"; return; }
        if (ip && !isValidIP(ip)) { resultDiv.innerHTML = "<strong>Please enter a valid IPv4 or IPv6 address.</strong>"; return; }
        resultDiv.innerHTML = "Fetching info...";
        const url = inputIP === 'self' ? `https://ipapi.co/json/` : `https://ipapi.co/${ip}/json/`;
        fetch(url)
            .then(response => { if (!response.ok) throw new Error("API request failed"); return response.json(); })
            .then(data => {
                let privateNote = "";
                if (ip && ip.includes('.') && isPrivateIP(ip)) { privateNote = "<p style='color:orange'><strong>Note:</strong> This is a reserved/private IPv4. Info may be limited.</p>"; }
                if (data.error) { resultDiv.innerHTML = `<strong>Error:</strong> ${data.reason}${privateNote}`; return; }
                resultDiv.innerHTML = `
                    ${privateNote}
                    <h3>Information for IP: ${data.ip || 'N/A'}</h3>
                    <p><strong>City:</strong> ${data.city || 'N/A'}</p>
                    <p><strong>Region:</strong> ${data.region || 'N/A'}</p>
                    <p><strong>Country:</strong> ${data.country_name || 'N/A'}</p>
                    <p><strong>Postal Code:</strong> ${data.postal || 'N/A'}</p>
                    <p><strong>Latitude:</strong> ${data.latitude || 'N/A'}</p>
                    <p><strong>Longitude:</strong> ${data.longitude || 'N/A'}</p>
                    <p><strong>Organization:</strong> ${data.org || 'N/A'}</p>
                    <p><strong>Timezone:</strong> ${data.timezone || 'N/A'}</p>
                `;
            })
            .catch(error => { resultDiv.innerHTML = `<strong>Error:</strong> ${error.message}`; });
    }
    document.getElementById('locBtn').addEventListener('click', () => {
        const out = document.getElementById('locResult');
        if (!navigator.geolocation) { out.textContent = 'Geolocation not supported by this browser.'; return; }
        out.textContent = 'Requesting permission...';
        navigator.geolocation.getCurrentPosition(
            (pos) => { const { latitude, longitude, accuracy } = pos.coords; out.innerHTML = `Lat: ${latitude}<br>Lon: ${longitude}<br>Accuracy (meters): ${accuracy}`; },
            (err) => { out.textContent = 'Permission denied or error: ' + err.message; },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    });
