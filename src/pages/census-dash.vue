<script setup>
const dataFilePath = "/census/data/poke_census_responses.csv";

// import internal and external libraries and styles
useHead({
	script: [
		// { src: "/census/JS/d3.js", defer: true },
		// {
		// 	src: "https://cdnjs.cloudflare.com/ajax/libs/crossfilter2/1.4.0-alpha.6/crossfilter.js",
		// 	defer: true,
		// },
		// {
		// 	src: "https://cdnjs.cloudflare.com/ajax/libs/dc/2.1.1/dc.js",
		// 	defer: true,
		// },
		// {
		// 	src: "https://ajax.googleapis.com/ajax/libs/jquery/3.2.0/jquery.min.js",
		// 	defer: true,
		// },
		// {
		// 	src: "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js",
		// 	defer: true,
		// },
		// { src: "/census/JS/dataTablesJquery.js", defer: true },
		// { src: "/census/JS/questions.js", defer: true },
		// { src: "/census/JS/pickChart.js", defer: true },
	],
	link: [
		{ rel: "stylesheet", href: "/census/CSS/dataTables.css" },
		{ rel: "stylesheet", href: "/census/CSS/dc_211.css" },
		{ rel: "stylesheet", href: "/census/CSS/style.css" },
		{
			rel: "stylesheet",
			href: "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css",
		},
	],
});

const { onLoaded } = useScript(
	{ src: "/census/JS/d3.js" },
	{
		src: "https://cdnjs.cloudflare.com/ajax/libs/crossfilter2/1.4.0-alpha.6/crossfilter.js",
	},
	{
		src: "https://cdnjs.cloudflare.com/ajax/libs/dc/2.1.1/dc.js",
	},
	{
		src: "https://ajax.googleapis.com/ajax/libs/jquery/3.2.0/jquery.min.js",
	},
	{
		src: "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js",
	},
	{ src: "/census/JS/dataTablesJquery.js" },
	{ src: "/census/JS/questions.js" },
	{ src: "/census/JS/pickChart.js" },
	{
		trigger: "onNuxtReady",
	}
);

/// function that splits any string in json that contains a ; into an array
function splitBasedSmCol(data) {
	//// for each object, check if each value in key value pair is string, if string check if a ; is present,
	//// if present ; present in string, make an array and split string into array items on ;
	//// replace string with array in that value place
	//// str.split(" ")
	var processedData = data;
	var row_number = -1;

	// // not an array
	// if (typeof processedData !== "object" || !Array.isArray(processedData)) return

	processedData.forEach(function (row) {
		row_number += 1;
		keys = Object.keys(row);
		values = Object.keys(row).map(function (key) {
			return row[key];
		});
		for (i = 0; i < values.length; i++) {
			if (typeof values[i] === "string" && values[i].indexOf(";") > -1) {
				newValue = values[i].split(";");
				//console.log("newValue",newValue)
				//console.log("processedData",processedData)
				//console.log("row",row)
				processedData[row_number][keys[i]] = newValue;
			}
			if (typeof values[i] === "string" && values[i].indexOf(";") < 1) {
				processedData[row_number][keys[i]] = [values[i]];
			}
		}
	});
	return processedData;
}

//// looks at questions & answers and populates characteristics that will be used to decide what chart type is best to use then runs function uponDataLoad() that creates html and charts before rendering them
function examineAnswers(data) {
	//// looks at questions & answers and populates characteristics that will be used to decide what chart type is best to use (functions in questions.js)
	var questions = identify_questions(data);
	//// runs function below that takes in data and questions variable and creates html & dc.js charts
	uponDataLoad(data, questions);
}

//// function that builds charts and then renders them
function uponDataLoad(data, questions) {
	//// adds data into crossfilter object
	var cf = crossfilter(data);
	//// populates ideal chart key for each of the questions based on (pickCharts.js)s
	//// options include: piechart or linearbarDate or table
	var questionsResult = pickChart(questions);
	//// runs functions in (pickCharts.js) that runs through questions variable and creates best html based on recommended charts
	//// this creates the groups for each row, explained more in pickChart.js
	//// in other words [["question1,question2,question3"],["question4"],,etc....]
	var rowHolder = groupQuestIntoRows(questionsResult);
	console.log("index uponDataLoad() rowHolder = ", rowHolder);
	//// chartNumber starts with 0.. each chart is another 1 added.
	////
	var chartNumber = 0;
	//// this function takes the rowHolder object and creates html structure starting with the row, then divs inside, then charts
	var ID = "hangChartRowsOffMe";
	for (eachRow in rowHolder) {
		var questionNumber = chartNumber;
		//// builds all the html and charts for eachRow in the row holder
		//// eachRow = array of chart questions represented in one bootstrap row
		//// cf = crossfilter object created from the data
		//// questionWidth_ = ?????
		//// questionNumber = see above
		//// ID is the id of the div on which chart rows are appended
		buildRow(
			data,
			rowHolder[eachRow],
			cf,
			ID,
			questionNumber,
			questionsResult
		);
		//// progresses the chart number used as ID by the number of questions in each row array inside the rowHolder array
		console.log("eachRow", rowHolder[eachRow]);
		chartNumber += rowHolder[eachRow].length;
	}

	//buildRow(row_holder,cf,ID,height,width,questionWith_,questionNumber,scale)
	//// runs functions in (pickCharts.js) that creates dc chart variables

	//// after all charts are built, renders all of them
	dc.renderAll();
}

onLoaded(() => {
	console.log("Loading...");

	d3.csv(dataFilePath, function (data) {
		console.log(data);
		data = splitBasedSmCol(data);
		// data = takeOutSpacesinKeys(data)
		console.log("processed into arrays hopefully! ", data);
		complete: examineAnswers(data);
	});
});
</script>

<template></template>
