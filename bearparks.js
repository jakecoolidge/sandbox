/* global L */

//first the vars are defined

var App, NPMap;

//first var in the array above
//this var interacts with the data in the geojson
//each park unit has a true or false value for each type of bear
//some parks, like GLAC, have more than one type (ex., grizzly and black bears)

App = {
  types: [
    'Black',
    'BrownGrizzly',
    'Polar'
  ],
  bearVisible: function () {
    var active = [];
    var i;

    for (i = 0; i < this.types.length; i++) {
      var type = this.types[i];

      if (document.getElementById(type).checked) {
        active.push(type);
      }
    }

    NPMap.config.overlays[0].L.eachLayer(function (layer) {
      var properties = layer.feature.properties;
      var visible = false;

      for (i = 0; i < active.length; i++) {
        if (properties[active[i]]) {
          visible = true;
          break;
        }
      }

      if (visible) {
        NPMap.config.L.addLayer(layer);
      } else {
        NPMap.config.L.removeLayer(layer);
      }
    });
  }
};

//second var in the array above
//this builds the map and the interactive elements, like the baselayers, legend control html, and what should be displayed in the popups.
//notice the popup receives an unordered list comprised of every bear listed as true in the geojson
//the legend control html has been modified to reorder the bear species in the list per the client's request

NPMap = {
  baseLayers: [
    'nps-neutralTerrain'
  ],
  center: {
    lat: 52.2681,
    lng: -115.9277
  },
  div: 'map',
  legendControl: {
    html: '<table>' +
      '<tr>' +
        '<td style="vertical-align:bottom !important;padding-right: 2px;"><input id="Polar" name="checkBears" onchange="App.bearVisible();return false;" type="checkbox" checked ></td>' +
        '<td><label for="Polar">Polar Bears</label></td>' +
      '</tr>' +
      '<tr>' +
        '<td style="vertical-align:bottom !important; padding-right: 2px;"><input id="BrownGrizzly" name="checkBears" onchange="App.bearVisible();return false;" type="checkbox" checked></td>' +
        '<td><label for="BrownGrizzly">Brown/Grizzly Bears</label></td>' +
      '</tr>' +
      '<tr>' +
        '<td style="vertical-align:bottom !important;padding-right: 2px;"><input id="Black" name="checkBears" onchange="App.bearVisible();return false;" type="checkbox" checked></td>' +
        '<td><label for="Black">Black Bears</label></td>' +
      '</tr>' +
    '</table>',
    position: 'bottomleft'
  },
  overlays: [{
    attribution: 'Natural Resource Stewardship and Science',
    popup: {
      description: function (data) {
        var html = '<ul>';
        var species = [];

        if (data.Black) {
          species.push('Black Bears');
        }

        if (data.BrownGrizzly) {
          species.push('Brown/Grizzly Bears');
        }

        if (data.Polar) {
          species.push('Polar Bears');
        }

        for (var i = 0; i < species.length; i++) {
          html += '<li>' + species[i] + '</li>';
        }

        return html + '</ul>';
      },
      title: '<a href="{{UnitWebsite}}" target="_blank">{{UnitName}}</a>'
    },
    //this one style applies to all. one thing they'd like to do is split this into three colors (white, brown, black)
    styles: {
      point: {
        'marker-color': '#7A4810',
        'marker-size': 'small'
      }
    },
    type: 'geojson',
    url: 'https://nationalparkservice.github.io/data/projects/natural_resource_stewardship_and_science/bear_parks.geojson'
  }],
  maxZoom: 13,
  minZoom: 3,
  scrollWheelZoom: false,
  zoom: 3
};

//end of the second array

//with the vars defined, function is called

(function () {
  var s = document.createElement('script');
  s.src = 'https://www.nps.gov/lib/npmap.js/3.0.14/npmap-bootstrap.min.js';
  document.body.appendChild(s);
})();
