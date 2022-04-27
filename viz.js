var svg = d3.select('svg');
var width = +svg.attr('width');
var height = +svg.attr('height');

d3.csv('storms.csv').then(function(i_storms_dataset) {
	storms = i_storms_dataset;

	
});