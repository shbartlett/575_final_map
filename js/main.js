var globalMap, globalOutput, myJson;
var attrArray = ['STUSPS','NAME','tot1950','tot1960','tot1970','tot1980','tot1990','tot2000','tot2010','Grand_Tota'];
var expressed = attrArray[0];

// Credits for map located in bottom right of map. 
var mbAttr = 'Map created by: Moe R, Stephanie B, and Dwight F';

var mbUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZGZpZWxkMjMiLCJhIjoiY2p4NThuaGYxMDB3bDQ4cXd0eWJiOGJoeSJ9.T94xCeDwJ268CmzfMPXdmw';

// Basemap options located in top right of map. 
var grayscale   = L.tileLayer(mbUrl, {id: 'mapbox.light', attribution: mbAttr}),
dark  = L.tileLayer(mbUrl, {id: 'mapbox.dark',   attribution: mbAttr}),
outdoors = L.tileLayer(mbUrl, {id: 'mapbox.outdoors',   attribution: mbAttr});

//createMap builds the map, returns the variable globalMap, and establishes a constant, map
function createMap(){
	//create the map
    const map = L.map('map', {
            center: [32.38, -84.00],
            zoom: 5.5,
            minZoom: 6,
            layers:outdoors
        });
            var baseLayers = {
            "Topographic": outdoors,
            "Grayscale": grayscale,
            "Darkscale": dark,
        };
            //call getData function
            getData(map);
            createSequenceControls(map);
            L.control.layers(baseLayers).addTo(map);
    }

//getData loads the geoJSON data into a readable format
function getData(map){
  $.getJSON('data/REGION4.geojson', function(data){

    //style each tract with the appropriate color and outline properties
    geojson = L.geoJson(data, {
        style: style,
        onEachFeature: onEachFeature
    }).addTo(map);

    //default layer style for each tract
    function style(feature) {
        return {
            weight: 0.6,
            opacity: 0.6,
            color: 'white',
            fillOpacity: 0.6,
            fillColor: getColor(feature.properties.Grand_Tota)
        };
    };

    //choropleth color map based on tot1950
    function getColor(b){
        return b <=0 ?  '#0000ffff':
                b >=1 & b <= 3 ? '#f0f9e8':
                b >= 4 & b <=9 ? '#bae4bc':
               b >=10 & b <=19 ? '#4dffa6':
               b >=20 & b <=49 ? '#7bccc4':
               b >=49 & b <=64 ? '#43a2ca':
                b >=65 & b <=80 ? '#243BE8':
                b >=80 & b <=120 ? '#0000A0':
               '#A8DDB5';

    };


    //iterate through each feature in the geoJSON
    function onEachFeature(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight
        });
    };

    //set the highlight on the map
    function highlightFeature(e) {

        var layer = e.target;
        layer.setStyle({fillOpacity: 1.0});

        if (!L.Browser.ie && !L.Browser.opera) {
            layer.bringToFront();
        };

        info.update(layer.feature.properties);
    };

    function resetHighlight(e) {
        geojson.setStyle(style);

        info.update();
    };

    //build chart for the map
    var newChart = function(labels, totData50, totData60, totData70, totData80, totData90, totData00, totData10) {
    var dataLength = labels ? labels.length : 0;
    var backgroundColors = ['#cc5500',
                            ];
    var colors = [];
    for (var i = 0; i < dataLength; i++) {
        colors.push(backgroundColors[i]);
    };
    var ctx = document.getElementById("myChart");
    var myChart = new Chart(ctx,{
            type: 'bar',
            data: {
                //labels: ['Affordability | Walkability'],
                datasets: [{
                    label: '1950s',
                    data: totData50,
                    backgroundColor: backgroundColors[0],
                    borderColor: "#999",
                    borderWidth: 1
                },{
                    label: '1960s',
                    data: totData60,
                    backgroundColor: backgroundColors[0],
                    borderColor: "#999",
                    borderWidth: 1
                },{
                    label: '1970s',
                    data: totData70,
                    backgroundColor: backgroundColors[0],
                    borderColor: "#999",
                    borderWidth: 1
                },{
                    label: '1980s',
                    data: totData80,
                    backgroundColor: backgroundColors[0],
                    borderColor: "#999",
                    borderWidth: 1
                },{
                    label: '1990s',
                    data: totData90,
                    backgroundColor: backgroundColors[0],
                    borderColor: "#999",
                    borderWidth: 1
                },{
                    label: '2000s',
                    data: totData00,
                    backgroundColor: backgroundColors[0],
                    borderColor: "#999",
                    borderWidth: 1
                },{
                    label: '2010s',
                    data: totData10,
                    backgroundColor: backgroundColors[0],
                    borderColor: "#999",
                    borderWidth: 1
              }]
            },
            options: {
                responsive:true,
                tooltips:{enabled:false},
                legend:{display:false},
                title:{display:true,position:'top',text:"Total Disasters by Decade"},
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                }
            }
        });
    };

    var info = L.control({position: 'bottomright'});

    info.onAdd = function(map) {
        this._div = L.DomUtil.create('div', 'info');
        this.update();
        return this._div;
    };

    info.update = function(props) {
        if (props) {
            {
                var labels = ['1950s', '1960s', '1970s', '1980s', '1990s', '2000s', '2010s'];
                var totData50 = [props.tot1950];
                var totData60 = [props.tot1960];
                var totData70 = [props.tot1970];
                var totData80 = [props.tot1980];
                var totData90 = [props.tot1990];
                var totData00 = [props.tot2000];
                var totData10 = [props.tot2010];
                var indices = '';
                indices += '<canvas id="myChart" width="300" height="250"></canvas>';
                this._div.innerHTML = indices;
                newChart(labels, totData50, totData60, totData70, totData80, totData90, totData00, totData10);
            }
        }
    };

    info.addTo(map);


   d3.queue()
    .defer(d3.csv, 'data/FEMA.csv')
    .defer(d3.json, 'data/REGION4.geojson')
    .await(callback);

    function callback(error, csvData, colorado){

      //set up hover events
      handleHover(csvData);
    };
  });
};

//create hover effect function and data acquisition from csv
function handleHover(data){
	document.querySelectorAll("svg path").forEach((path, index) => {
    	let row = data[index],
            tot1950 = row.tot1950,
            tot1960 = row.tot1960,
            tot1970 = row.tot1970,
            tot1980 = row.tot1980,
            tot1990 = row.tot1990,
            tot2000 = row.tot2000,
            tot2010 = row.tot2010,
            geoid10 = row.NAME;
      	path.setAttribute("data-tot1950", tot1950);
      	path.setAttribute("data-tot1960", tot1960);
        path.setAttribute("data-tot1960", tot1970);
        path.setAttribute("data-tot1960", tot1980);
        path.setAttribute("data-tot1960", tot1990);
        path.setAttribute("data-tot1960", tot2000);
        path.setAttribute("data-tot1960", tot2010);
      	path.setAttribute("data-NAME", geoid10);
      	path.addEventListener("mouseenter", handleMouseenter);
      	path.addEventListener("mouseleave", handleMouseleave);
    });
};

//function for mouse entering particular path
function handleMouseenter(e){
    // Send lng,lat to reverse geocoder.
    fetch(`https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?f=pjson&langCode=EN&location=${e.latlng.lng},${e.latlng.lat}`)
        .then(res => res.json())
        .then(myJson => {
        (myJson.address.City + ', ' + myJson.address.Region)
        });

  	let tot1950 = e.currentTarget.getAttribute("data-tot1950"),
        tot1960 = e.currentTarget.getAttribute("data-tot1960"),
        geoid10 = e.currentTarget.getAttribute("data-NAME");
  	//globalOutput.textContent = `${myJson}, Census Block: ${geoid10}, Location Index: ${tot1950}, Walk Index: ${tot1960}`;
}
//function for mouse leaving particular path
function handleMouseleave(e){
    //globalOutput.textContent = 'Census Block: , Location Index: , Walk Index:';
}


//Create new sequence controls
function createSequenceControls(map){   
    var SequenceControl = L.Control.extend({
        options: {
            position: 'bottomleft'
        },
        onAdd: function (map) {
            // create the control container div with a particular class name
            var container = L.DomUtil.create('div', 'sequence-control-container');

            //create range input element (slider)
            $(container).append('<input class="range-slider" type="range">');

            //add skip buttons
            $(container).append('<button class="skip" id="reverse" title="Reverse">Reverse</button>');
            $(container).append('<button class="skip" id="forward" title="Forward">Skip</button>');


            //kill any mouse event listeners on the map
            $(container).on('mousedown dblclick', function(e){
                L.DomEvent.stopPropagation(e);
                map.dragging.disable();
            });

            return container;
        }
    });

map.addControl(new SequenceControl());

	//set slider attributes
	$('.range-slider').attr({
		max: 7,
		min: 0,
		value: 0,
		step: 1
	});

	// create slider event handler
	$('.range-slider').on('input', function () {
		index = $(this).val();
		$('#year').html(attributes[index]);
		updatePropSymbols(map, attributes[index]);
	});


	//create button event handler
	$('.skip').click(function () {
		index = $('.range-slider').val();
		if ($(this).attr('id') == 'forward') {
			index++;
			index = index > 6 ? 0 : index;
        
		} else if ($(this).attr('id') == 'reverse') {
			index--;
			index = index < 0 ? 6 : index;

		}
		$('.range-slider').val(index);
        console.log(attributes[index]);
        
		updatePropSymbols(index);
	});
}



//createPopup creates a popup with the LAI, WI, and CB# displayed for the reader

//when the page loads, AJAX & call createMap to render map tiles and data.
$(document).ready(init);
function init(){
  	globalOutput = document.querySelector("header output");
    //globalOutput.textContent = 'Census Block: , Location Index: , Walk Index:`';

    createMap();
  	//create map home button
  	$("header button").on("click", function(){
    	globalMap.flyTo([32.38, -84.00], 6); //[lat, lng], zoom
    });
};
