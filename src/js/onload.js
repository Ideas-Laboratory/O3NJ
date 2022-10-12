var current_width = 1;
var menu_status = 0;
var current_ws_width = 0;

$(document).ready(function(){
	//get dashboard size and set some other sizes
	$(document.body).width($(window).width()-20);
	$(document.body).height($(window).height()-10);
	$("#header").width($(window).width()-20);

	let containerHeight = $(document.body).height()-70;
	dashboardWidth = $(document.body).width() - 4 * viewMargin;
	// let dashboardHeight = containerHeight - ;



	treeContainerWidth = 2 * dashboardWidth / 5 < 200 ? 200 : (2 * dashboardWidth / 5) - slideBarMarginLeft;
	let styleHeight = containerHeight;
	height = containerHeight - 2*viewMargin - 50 - 50;
	barWidth = treeContainerWidth-10;
	distillTreeContainerWidth = (treeContainerWidth+slideBarMarginLeft)/2;
	scatterplotWidth = treeContainerWidth + 50 - viewMargin > (styleHeight - 2*viewMargin)*2/3 - 50 - viewMargin ? (styleHeight - 2*viewMargin)*2/3 - 50 - viewMargin : treeContainerWidth - viewMargin;
	scatterplotHeight = styleHeight - 3*viewMargin - $("#ctrPanel").height() - 56;
	barLength = height - 10;
	barY = styleHeight - 130;

	$("#container").height(containerHeight);
	$("#ourTreeContainer").width(treeContainerWidth+slideBarMarginLeft);
	$("#ourTreeContainer").height(styleHeight - 2*viewMargin);
	$("#distillTree").height(styleHeight - 2*viewMargin);
	$("#label-ordered-tree-container").height(styleHeight - 2*viewMargin - 50);
	$("#distill-container").height(styleHeight - 2*viewMargin - 50);
	$("#distillTree").width(distillTreeContainerWidth);
	$("#scatterplotFooter").width(scatterplotWidth);
	// if(treeContainerWidth + 50 - viewMargin > (styleHeight - 2*viewMargin)*2/3 - 50 - viewMargin){
	// 	$("#ctrPanel").height((scatterplotWidth+50)/2);
	// }else{
	// 	$("#ctrPanel").height(styleHeight - viewMargin - treeContainerWidth - 50 - 20);
	// }
	
	$("#sliderPanel0").width(scatterplotWidth - 90);
	$("#sliderPanel1").width(scatterplotWidth - 90);
	$("#sliderPanel2").width(scatterplotWidth - 90);
	//end setting sizes

	//set slider
	d3.select('#slider0')
		.call(
			d3.slider()
				.value(oName)
				.axis(true)
				.min(0)
				.max(10)
				.step(0.01)
				.on("slide", function(evt, value) {
  					to = value;
					plotTree();
					$("#oValue").html(value);
				})
	);
	d3.select('#slider1')
		.call(
			d3.slider()
				.value(aName)
				.axis(true)
				.min(0)
				.max(200)
				.step(0.1)
				.on("slide", function(evt, value) {
  					// ta = value/10;
					ta = value
					plotTree();
					$("#taValue").html(value);
				})
	);
	d3.select('#slider2')
		.call(
			d3.slider()
				.value(bName)
				.axis(true)
				.min(0)
				.max(10)
				.step(0.1)
				.on("slide", function(evt, value) {
					tb = value;
					plotTree();
					$("#tbValue").html(value);
				})
	);
	

	//add mouse over to sliders to give tips
	$('#slider0').mouseover(function(evt){
		if(!isMouseDown0){
			showTips0 = true;
		}
	})
	$('#slider0').mousedown(function(evt){
		isMouseDown0 = true;
		showTips0 = false;
	})
	$('#slider0').mouseout(function(evt){
		showTips0 = false;
		$("#tips").css({
			"display" : "none"
		})	
	})
	$('#slider0').mousemove(function(evt){
		if(showTips0){
			$("#tips").css({
				"display" : "block",
				"top" : evt.pageY+2,
				"left" : evt.pageX+2
			})
			$("#tips").html(tip0)
		}
	})
	//slider 1
	$('#slider1').mouseover(function(evt){
		if(!isMouseDown1){
			showTips1 = true;
		}
	})
	$('#slider1').mousedown(function(evt){
		isMouseDown1 = true;
		showTips1 = false;
	})
	$('#slider1').mouseout(function(evt){
		showTips1 = false;
		$("#tips").css({
			"display" : "none"
		})	
	})
	$('#slider1').mousemove(function(evt){
		if(showTips1){
			$("#tips").css({
				"display" : "block",
				"top" : evt.pageY+2,
				"left" : evt.pageX+4
			})
			$("#tips").html(tip1)
		}
	})
	//slider 2
	$('#slider2').mouseover(function(evt){
		if(!isMouseDown2){
			showTips2 = true;
		}
	})
	$('#slider2').mousedown(function(evt){
		isMouseDown2 = true;
		showTips2 = false;
	})
	$('#slider2').mouseout(function(evt){
		showTips2 = false;
		$("#tips").css({
			"display" : "none"
		})	
	})
	$('#slider2').mousemove(function(evt){
		if(showTips2){
			$("#tips").css({
				"display" : "block",
				"top" : evt.pageY+2,
				"left" : evt.pageX+2
			})
			$("#tips").html(tip2)
		}
	})

	$(document).mouseup(function(evt){
		isMouseDown0 = false;
		showTips0 = true;
		isMouseDown1 = false;
		showTips1 = true;
		isMouseDown2 = false;
		showTips2 = true;
	})

to = oName;
ta = aName;
tb = bName;
	plotData(tsvName);
	orderThreshHold = 1;


	// bindSlider();
	
});

function plotData(dataFile){
	d3.tsv(dataFile, function(err, data){
		if(err) throw err;
		currentDataSet = data;

		//get number of data attribtues and their names
		let tmpAttrNames = Object.getOwnPropertyNames(currentDataSet[0]);
		dataAttributes = tmpAttrNames.length-4;
		dataAttributeNames = tmpAttrNames.slice(4, tmpAttrNames.length);

		
		plotTree();//plot the tree
		
		plotScatter(currentDataSet);//plot the scatterplot
	})
}

function plotTree(){
	d3.json(njName, function(err, treeJson){
		tree_label = null;
		let preprocessedData = preprocessing(currentDataSet);	
		let D = inputdataDis;
		DBackUp = cloneObj(D);

		let taxa = preprocessedData.taxa;
		let classify = preprocessedData.classify;

		// var NJ = new NeighborJoining(D, taxa, classify);
		// NJ.buildTree();
		// console.log(NJ.treeJson);

		let rootNum = rootName;
		//order with distance and label
		// var start=new Date().getTime();
		generateTree(treeJson, true, true, 0, 2, DBackUp, rootNum);
		// var end=new Date().getTime();
		// console.log("time: " + (end - start));
		drawTree(tree_label.rootNodeBackup, tree_label.treeStructureBackup, tree_label.leafAmount, "label-ordered-tree-container", tree_label.nodesToMerge, tree_label.currentLeafOrder, DBackUp);
		
		
		//test
		// for(let i = 0; i < tree_label.highLightFirstStep.length; i++){
		// 	// console.log("drawing outliers:" + tree_label.highLightFirstStep[i]);
		// 	$("#label-ordered-tree-container-node-"+tree_label.highLightFirstStep[i]).css({
		// 		"stroke-width" : 2,
		// 		"stroke" : "#000",
		// 		"r" : 3
		// 	})
		// }
		for(let i = 0; i < tree_label.leafPeakValley.length; i++){
			$("#label-ordered-tree-container-node-"+tree_label.leafPeakValley[i].leafId).css({
				"stroke-width" : 2,
				"r" : 3,
				"stroke" : "green"
			})	
		}
		// for(let i = 0; i < tree_label.outlierNodes.length; i++){
		// 	$("#label-ordered-tree-container-node-"+tree_label.outlierNodes[i]).css({
		// 		"stroke-width" : 2,
		// 		"r" : 3,
		// 		"stroke" : "red"
		// 	})	
		// }
		//end test 

		drawDistilled(tree_label.distilledTreeStructure);


		// if(document.getElementById("slider_1") == null){
		// 	//draw slide bar
		// 	drawBar("label-ordered-tree-container");
		// 	drawButton(tree_label.leafAmount, taxa, "label-ordered-tree-container");
		// 	drawSlider(tree_label.leafAmount, "label-ordered-tree-container", 1);
		// 	drawVSlider(tree_label.leafAmount, "label-ordered-tree-container", 1);	
		// }
	})
}

function changeRooting(rn){
	rooting = rn;
	// plotScatter(currentDataSet);//plot the scatterplot
	plotTree();//plot the tree
}
