(function () {
  const lat = document.querySelector("#lat").value || 6.2700263;
  const lng = document.querySelector("#lng").value || -75.5800203;
  const mapa = L.map("mapa").setView([lat, lng], 15);
  let marker;
  const geocodeService = L.esri.Geocoding.geocodeService();

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(mapa);

  marker = new L.Marker([lat, lng], {
    draggable: true,
    autoPan: true,
  }).addTo(mapa);

  marker.on("moveend", function (e) {
    marker = e.target;
    const position = marker.getLatLng();
    mapa.panTo(new L.LatLng(position.lat, position.lng));

    geocodeService
      .reverse()
      .latlng(position, 13)
      .run(function (err, result) {
        marker.bindPopup(result.address.LongLabel);
        document.querySelector(".street").textContent =
          result?.address?.Address ?? "";
        document.querySelector("#street").value =
          result?.address?.Address ?? "";
        document.querySelector("#lat").value = result?.latlng?.lat ?? "";
        document.querySelector("#lng").value = result?.latlng?.lng ?? "";
      });
  });
})();
