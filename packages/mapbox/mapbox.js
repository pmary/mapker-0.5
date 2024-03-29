var FILES = {
  mapbox: {
    js:   ['https://api.tiles.mapbox.com/mapbox.js/v2.2.1/mapbox.js'],
    css:  ['https://api.tiles.mapbox.com/mapbox.js/v2.2.1/mapbox.css'],
  },

  directions: {
    js:   ['https://api.tiles.mapbox.com/mapbox.js/plugins/mapbox-directions.js/v0.3.0/mapbox.directions.js'],
    css:  ['https://api.tiles.mapbox.com/mapbox.js/plugins/mapbox-directions.js/v0.3.0/mapbox.directions.css']
  },

  zoomslider: {
    js:   ['https://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-zoomslider/v0.7.0/L.Control.Zoomslider.js'],
    css:  ['https://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-zoomslider/v0.7.0/L.Control.Zoomslider.css']
  },

  pip: {
    js:   ['https://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-pip/v0.1.0/leaflet-pip.js'],
    css:  []
  },

  osm: {
    js:   ['https://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-osm/v0.1.0/leaflet-osm.js'],
    css:  []
  },

  omnivore: {
    js:   ['https://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-omnivore/v0.2.0/leaflet-omnivore.min.js'],
    css:  []
  },

  minimap: {
    js:   ['https://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-minimap/v1.0.0/Control.MiniMap.js'],
    css:  ['https://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-minimap/v1.0.0/Control.MiniMap.css']
  },

  markercluster: {
    js:   ['https://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-markercluster/v0.4.0/leaflet.markercluster.js'],
    css:  [
      'https://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-markercluster/v0.4.0/MarkerCluster.css',
      'https://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-markercluster/v0.4.0/MarkerCluster.Default.css'
    ],
  },

  // FIXME: Doesn't support IE<9
  // https://www.mapbox.com/mapbox.js/example/v1.0.0/leaflet-locatecontrol/
  locate: {
    js:   ['https://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-locatecontrol/v0.43.0/L.Control.Locate.js'],
    css:  ['https://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-locatecontrol/v0.43.0/L.Control.Locate.css']
  },

  label: {
    js:   ['https://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-label/v0.2.1/leaflet.label.js'],
    css:  ['https://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-label/v0.2.1/leaflet.label.css']
  },

  image: {
    js:   ['https://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-image/v0.0.4/leaflet-image.js'],
    css:  []
  },

  heat: {
    js:   ['https://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-heat/v0.1.3/leaflet-heat.js'],
    css:  []
  },

  hash: {
    js:   ['https://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-hash/v0.2.1/leaflet-hash.js'],
    css:  []
  },

  geodesy: {
    js:   ['https://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-geodesy/v0.1.0/leaflet-geodesy.js'],
    css:  []
  },

  fullscreen: {
    js:   ['https://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-fullscreen/v0.0.4/Leaflet.fullscreen.min.js'],
    css:  ['https://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-fullscreen/v0.0.4/leaflet.fullscreen.css']
  },

  draw: {
    js:   ['https://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-draw/v0.2.2/leaflet.draw.js'],
    css:  ['https://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-draw/v0.2.2/leaflet.draw.css']
  },

  geojsonExtend: {
    js:   ['https://api.tiles.mapbox.com/mapbox.js/plugins/geojson-extent/v0.0.1/geojson-extent.js'],
    css:  []
  },

  geoViewport: {
    js:   ['https://api.tiles.mapbox.com/mapbox.js/plugins/geo-viewport/v0.1.1/geo-viewport.js'],
    css:  []
  },

  arc: {
    js:   ['https://api.tiles.mapbox.com/mapbox.js/plugins/arc.js/v0.1.0/arc.js'],
    css:  []
  }
};

var deps = new Deps.Dependency();
var loaded = false;

var onLoaded = function () {
  loaded = true;
  deps.changed();
};

var onMapboxLoaded = function (plugins, cb) {
  var pluginCount = _.size(plugins);

  if (pluginCount === 0) {
    cb();
    return;
  }

  var loadCb = function () {
    pluginCount--;

    if (pluginCount === 0) {
      cb();
      return;
    }
  };

  _.each(plugins, function (plugin) {
    loadFiles(FILES[plugin], loadCb);
  });
};

var loadScript = function (src, cb) {
  var elem = document.createElement('script');
  elem.type = 'text/javascript';
  elem.src = src;
  elem.defer = true;

  elem.addEventListener('load', _.partial(cb, src), false);

  var head = document.getElementsByTagName('head')[0];
  head.appendChild(elem);
};

var loadCss = function (href) {
  var elem = document.createElement('link');
  elem.rel = 'stylesheet';
  elem.href = href;

  var head = document.getElementsByTagName('head')[0];
  head.appendChild(elem);
};

var loadFiles = function (files, cb) {
  var loadCount = _.size(files.js);

  var loadCb = function (url) {
    if (Mapbox.debug)
      console.log('Loaded:', url);

    loadCount--;

    if (loadCount === 0)
      cb();
  };

  _.each(files.css, loadCss);
  _.each(files.js, function (url) {
    loadScript(url, loadCb);
  });
};

Mapbox = {
  debug: false,

  load: function () {
    if (loaded)
      return;

    var plugins = _.values(arguments);
    loadFiles(FILES.mapbox, _.partial(onMapboxLoaded, plugins, onLoaded));
  },

  loaded: function () {
    deps.depend();
    return loaded;
  }
};
