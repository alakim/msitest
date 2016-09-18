var Timeline = (function($D){

	var Settings = {
		objectHeight:22
	};
	
	var scenario,
		svg,
		timeSpan,
		timeResolution;

	function drawObject(s, obj){
		//console.log("drawing ", obj);
		var pos = {x:timeResolution*(obj.time-timeSpan.min), y:obj.usr.y, w:timeResolution*obj.duration};
		var viewBody = s.rect(pos.x, pos.y, pos.w, Settings.objectHeight)
			.attr({fill:"#ffc", stroke:"#440"})
		var name = s.text(pos.x, pos.y - Settings.objectHeight*.2, obj.name);
		var address = s.text(pos.x, pos.y + Settings.objectHeight*1.6, obj.address);
		var ctrlW = Settings.objectHeight*1.6;
		var control = s.rect(pos.x+pos.w - ctrlW, pos.y, ctrlW, Settings.objectHeight)
			.attr({fill:"#cc8", stroke:"#440"})
			.drag(
				function(dx, dy, x, y, e){
					this.attr({
						transform: this.data('origTransform') + (this.data('origTransform') ? "T" : "t") + [dx, dy*0]
					});
					var bw = +viewBody.attr("width");
					//console.log(bw, dx);
					var diff = x - this.data("x0");
					var pos = this.data("curPos")+dx;
					// console.log(dx, diff);

					//viewBody.attr({width: bw+diff});
					//viewBody.attr({width:pos - viewBody.attr("x")});
					viewBody.attr({width:this.data("curW")+dx});
					// viewBody.attr({width: dx+bw});
					// console.log(bw, dx, bw+dx, diff, bw+diff);
					e.stopPropagation();
				},
				function(x, y, e){
					this.data('origTransform', this.transform().local );
					this.data("x0", x);
					this.data("curPos", +this.attr("x"));
					this.data("curW", +this.attr("x") - viewBody.attr("x"));
					e.stopPropagation();
				},
				function(e){
					// console.log(e);
					var pos = {x:e.layerX, y:e.layerY};
					obj.usr = pos;
					e.stopPropagation();
				}
			);
		var objView = s.g(viewBody, name, address, control)
			.attr({cursor:"default"})
			.drag(
				function(dx, dy){
					this.attr({
				    		transform: this.data('origTransform') + (this.data('origTransform') ? "T" : "t") + [dx, dy]
					});
				},
				function(){
					this.data('origTransform', this.transform().local );
				},
				function(e){
					// console.log(e);
					var pos = {x:e.layerX, y:e.layerY};
					obj.usr = pos;
				}
			);
	}

	function getTimeSpan(scen){
		var tSpan = $D.aggregate(scen, {min:-1, max:0}, function(obj, aggr){
			if(aggr.min<0) aggr.min = obj.time;
			else if(aggr.min>obj.time) aggr.min = obj.time;
			var t2 = obj.time + obj.duration;
			if(aggr.max<t2) aggr.max = t2;
			return aggr;
		});
		tSpan.duration = tSpan.max - tSpan.min;
		return tSpan;
	}
	
	function init(scen){
		scenario = scen;
		svg = Snap("#pnlTimeline");
		timeSpan = getTimeSpan(scenario);
		// console.log(typeof(svg.node.width.baseVal.value), svg);
		timeResolution = svg.node.width.baseVal.value/timeSpan.duration;
		// console.log(timeResolution);
		// console.log(timeSpan);
		$D.each(scenario, function(obj){
			drawObject(svg, obj);
		});
	}

	function refresh(){
		svg.clear();
		$D.each(scenario, function(obj){
			drawObject(svg, obj);
		});
	}

	return {
		init:init,
		refresh: refresh
	};
})(JDB.version("3.0.1"));

