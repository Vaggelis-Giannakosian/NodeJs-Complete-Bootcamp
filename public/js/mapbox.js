/* eslint-disable */

export const displayMap = locations => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoibG9zdHJlIiwiYSI6ImNrM2toNjAyeTAzMDczbXQ1anAwYzU5MmgifQ.lWYGAi2owqwh5d3Q1Fiofw';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/lostre/ck3khad4o0fjb1cmxb8kikpdd',
    scrollZoom: false
    //   center: [-118.11, 34.11],
    //   zoom: 8,
    //   interactive: false
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach(loc => {
    //create marker
    const el = document.createElement('div');
    el.className = 'marker';

    //add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom'
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    //add Popup
    new mapboxgl.Popup({
      offset: 30
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    //extend map bounds to include the current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100
    }
  });
};
