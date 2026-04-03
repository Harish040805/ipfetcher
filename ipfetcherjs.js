    var map = L.map('map').setView([20, 0], 2);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap'
    }).addTo(map);
    var marker, circle;
    async function getIPInfo(isSelf = false) {
        const resDiv = document.getElementById("result");
        const ip = document.getElementById("ipInput").value.trim();
        let url = isSelf ? `https://ipapi.co/json/` : `https://ipapi.co/${ip}/json/`;
        resDiv.innerHTML = "Fetching Data...";
        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.error) {
                throw new Error("Switching to fallback");
            }
            renderData(data);
        } catch (err) {
            try {
                let fbUrl = isSelf ? "http://ip-api.com/json/" : `http://ip-api.com/json/${ip}`;
                const fbRes = await fetch(fbUrl);
                const fbData = await fbRes.json();
                renderData({
                    ip: fbData.query,
                    city: fbData.city,
                    region: fbData.regionName,
                    country_name: fbData.country,
                    org: fbData.isp,
                    latitude: fbData.lat,
                    longitude: fbData.lon
                });
            } catch(e) {
                resDiv.innerHTML = "Error: Could not fetch IP data. Please check your connection.";
            }
        }
    }
    function renderData(data) {
        document.getElementById("result").innerHTML = `
            <strong>IP:</strong> ${data.ip} <br>
            <strong>Organization:</strong> ${data.org} <br>
            <strong>Location:</strong> ${data.city}, ${data.region}, ${data.country_name} <br>
            <strong>Latitude:</strong> ${data.latitude} | <strong>Longitude:</strong> ${data.longitude}
        `;
        updateMap(data.latitude, data.longitude, "IP Location", 5000);
    }
    function getBrowserLocation() {
        if (!navigator.geolocation) {
            alert("Geolocation not supported");
            return;
        }
        navigator.geolocation.getCurrentPosition((pos) => {
            const { latitude, longitude, accuracy } = pos.coords;
            document.getElementById("result").innerHTML = `
                <strong>Precise GPS Found!</strong><br>
                Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}<br>
                Accuracy: Within ${accuracy.toFixed(0)}m
            `;
            updateMap(latitude, longitude, "Precise Device Location", accuracy);
        });
    }
    function updateMap(lat, lon, label, acc) {
        if (marker) map.removeLayer(marker);
        if (circle) map.removeLayer(circle);
        map.setView([lat, lon], 13);
        marker = L.marker([lat, lon]).addTo(map).bindPopup(label).openPopup();
        circle = L.circle([lat, lon], { radius: acc, color: '#2f7dff' }).addTo(map);
    }
