(function () {
  const lat = 6.2700263;
  const lng = -75.5800203;
  const map = L.map("map-home").setView([lat, lng], 15);

  let markers = new L.FeatureGroup().addTo(map);

  let properties = [];

  const filter = {
    category: "",
    price: "",
  };

  const categoriesSelect = document.querySelector("#categories");
  const pricesSelect = document.querySelector("#prices");

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  categoriesSelect.addEventListener("change", (e) => {
    filter.category = +e.target.value;
    filterProperties();
  });

  pricesSelect.addEventListener("change", (e) => {
    filter.price = +e.target.value;
    filterProperties();
  });

  const getProperties = async () => {
    try {
      const url = "/api/properties";
      const resp = await fetch(url);
      properties = await resp.json();
      showProperties(properties);
    } catch (error) {
      console.log(error);
    }
  };

  const showProperties = (p) => {
    markers.clearLayers();

    p.properties.forEach((property) => {
      const marker = new L.marker([property?.lat, property?.lng], {
        autoPan: true,
      })
        .addTo(map)
        .bindPopup(
          `<h3 class="font-bold uppercase my-5">${property?.title}</h3>
            <img src="uploads/${property?.image}" alt="${property.title}">
            <p class="text-indigo-600">${property.category.name}</p>
            <p class="text-gray-600">${property.price.name}</p>
            <a href="/property/${property.id}" class="bg-indigo-600 text-white uppercase block p-2 rounded text-center">Show Property</a>
          `
        );

      markers.addLayer(marker);
    });
  };

  const filterProperties = () => {
    const result = properties.properties
      .filter(filterCategory)
      .filter(filterPrice);
    showProperties({ properties: result });
  };

  const filterCategory = (prop) => {
    return filter.category ? prop.categoryID === filter.category : prop;
  };

  const filterPrice = (prop) => {
    return filter.price ? prop.priceID === filter.price : prop;
  };

  getProperties();
})();
