var svg = d3.select('svg');
var width = +svg.attr('width');
var height = +svg.attr('height');


var padding = {t: 50, r: 50, b: 50, l: 50};

var chartWidth = width - padding.l - padding.r;
var chartHeight = height - padding.t - padding.b;

var myYear = [];
var stormCount = []; 
var avgWind = [];

var test1 = [];
var test2 = [];
var test3 = [];

var monthCount = [];
var monthList = [];
var nameList = [];

var chartG = svg.append('g').attr('transform', 'translate('+[padding.l, chartHeight]+')');

function onCategoryChanged(value) {
	var select = d3.select('#categorySelect').node();
	var category = select.options[select.selectedIndex].value;
	updateChart(category);
}

d3.selectAll('.filter')
    .on('click', function(){
        
        d3.select('.filter.selected').classed('selected', false);
        var clicked = d3.select(this);
        
        clicked.classed('selected', true);
	
		
		
		chartG.selectAll('rect').remove();
        updateChart(clicked.attr('value'));
		
    });

function dataNonHurr(row) {

	svg.selectAll('bar').remove();
	storms.forEach(element => {

		if(element.month == "1" || element.month == "2" || element.month == "3" || element.month == "4" || element.month == "5" || element.month == "12" ){

			test3[element.year] = 0;

			test1[element.year] = 0;
			test2[element.year] = 0;
		}
	});

	storms.forEach(element => {
		if(element.month == "1" || element.month == "2" || element.month == "3" || element.month == "4" || element.month == "5" || element.month == "12" ){

		test3[element.year] = parseInt(element.year,10)

		test1[element.year] += parseInt(element.wind,10); 
		test2[element.year] += 1;
		}
	});

	for (x in test1){
		if (x === "undefined" || test1[x] === "NaN"){
			delete test1[x];
		} else {
			test1[x] = test1[x]/test2[x];
		}
	}
	
}
function dataHurr(row) {


	svg.selectAll('bar').remove();
	storms.forEach(element => {

		if(element.month == "6" || element.month == "7" || element.month == "8" || element.month == "9" || element.month == "10" || element.month == "11" ){

			myYear[element.year] = 0;
			stormCount[element.year] = 0;
			avgWind[element.year] = 0;
		}
	});

	storms.forEach(element => {
		if(element.month == "6" || element.month == "7" || element.month == "8" || element.month == "9" || element.month == "10" || element.month == "11" ){

		myYear[element.year] = parseInt(element.year,10)
		stormCount[element.year] += 1;
		avgWind[element.year] += parseInt(element.wind,10);

		}
	});
	

	// Find average wind speed by avgWind/stormCount

	for (x in avgWind) {
		if (x === "undefined" || avgWind[x] === "NaN"){
			delete avgWind[x];
		} else {
			avgWind[x] = avgWind[x]/stormCount[x];
		}
	}
}

function monthData(row) {
	svg.selectAll('bar').remove();
	storms.forEach(element => {

		if(element.month == "1" || element.month == "2" || element.month == "3" || element.month == "4" || element.month == "5" || element.month == "12" ){
			myYear[element.year] = 0;
			monthCount[element.year] = 0;
			nameList[element.name] = 0;
		}
	});
	
	storms.forEach(element => {
		if(element.month == "1" || element.month == "2" || element.month == "3" || element.month == "4" || element.month == "5" || element.month == "12" ){
			myYear[element.year] = parseInt(element.year,10)
			monthCount[element.year] += 1;
			nameList[element.name] = element.year;
		}
	});

	var temp = [];
	for (x in nameList) {
		temp[nameList[x]] =0 ;
	}

	for (x in nameList) {
		temp[nameList[x]] +=1 ;
	}

	for (x in monthCount) {
		monthCount[x] = monthCount[x]
	}
	monthCount = temp;

}

d3.csv('storms.csv').then(function(i_storms_dataset) {

	storms = i_storms_dataset;

	xScale = d3.scaleLinear()
	.domain([1974, 2022])
	.range([0, chartWidth]);

	yScale = d3.scaleLinear()
	.domain([0, 100])
	.range([0, (height - chartWidth)]);

	formatWind = function(d) {
		return d;
	}

	formatYear = function(d) {
		return d;
	}

	scaleWind = function(d) {
		return (height - padding.b) - d;
	}

	svg.append('g')
	.attr('class', 'xaxis')
	.attr('transform', 'translate('+[padding.l, height - padding.t]+')')
	.call(d3.axisBottom(xScale).ticks(6).tickFormat(formatYear));

	svg.append('g')
	.attr('class', 'yaxis')
	.attr('transform', 'translate('+[padding.l, height - padding.b]+')')
	.call(d3.axisLeft(yScale).ticks(6).tickFormat(formatWind));

	svg.append("text").attr('class', 'xlabel').attr("x",(width/2)-20).attr("y",height-10).text("X");
	svg.append("text").attr('class', 'ylabel').attr("x",-300).attr("y",(height/2)-180).text("Y").attr('transform', 'rotate(-90)');

	updateChart('non-hurr');
});

function updateChart(key) {
	
	if (key === 'non-hurr'){
		dataNonHurr(storms);

		svg.selectAll('.xaxis').call(d3.axisBottom(xScale).ticks(6).tickFormat(formatYear));
		svg.selectAll('.yaxis').call(d3.axisLeft(yScale).ticks(6).tickFormat(formatWind));

		svg.selectAll('.xlabel').text("Year");
		svg.selectAll('.ylabel').text("Avg Wind Speed");

		
		for(x in test1){
			chartG.append('rect')
			.attr('class','bar')
			.attr('height',function(d) {return Math.abs(yScale(test1[x]))})
			.attr('width',5)
			.attr('y', function(d) {return yScale(test1[x]) + 50})
			.attr('x', function(d) {return xScale(test3[x])});
		}
	} else if (key === 'hurr'){
		dataHurr(storms);
	

		svg.selectAll('.xaxis').call(d3.axisBottom(xScale).ticks(6).tickFormat(formatYear));
		svg.selectAll('.yaxis').call(d3.axisLeft(yScale).ticks(6).tickFormat(formatWind));

		svg.selectAll('.xlabel').text("year");
		svg.selectAll('.ylabel').text("Avg wind speed");

		
		for(x in avgWind){
			chartG.append('rect')
			.attr('class','bar')
			.attr('height',function(d) {return Math.abs(yScale(avgWind[x]))})
			.attr('width',5)
			.attr('y', function(d) {return yScale(avgWind[x]) + 50})
			.attr('x', function(d) {return xScale(myYear[x])});
		}
	} else {
		monthData(storms);

		monthYscale = d3.scaleLinear()
		.domain([0, 4])
		.range([0, (height - chartWidth)]);

		svg.selectAll('.xaxis').call(d3.axisBottom(xScale).ticks(6).tickFormat(formatYear));
		svg.selectAll('.yaxis').call(d3.axisLeft(monthYscale).ticks(4));

		svg.selectAll('.xlabel').text("year");
		svg.selectAll('.ylabel').text("Number of out of season storms");


		for(x in monthCount){
			chartG.append('rect')
			.attr('class','bar')
			.attr('height',function(d) {return Math.abs(monthYscale(monthCount[x]))})
			.attr('width',5)
			.attr('y', function(d) {return monthYscale(monthCount[x]) + 50})
			.attr('x', function(d) {return xScale(myYear[x])});
		}
	}


}