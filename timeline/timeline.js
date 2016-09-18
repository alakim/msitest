var Timeline = (function($D){

	var Settings = {
		objectHeight:22
	};
	
	function drawObject(s, obj){
		//console.log("drawing ", obj);
		var pos = {x:10*obj.time, y:obj.usr.y};
		var objView = s.rect(pos.x, pos.y, 20*obj.duration, Settings.objectHeight)
			.attr({fill:"#ffc", stroke:"#440"})
			.drag(
				function(dx, dy){
					this.attr({
				    		transform: this.data('origTransform') + (this.data('origTransform') ? "T" : "t") + [dx, dy]
					});
				},
				function(){
					this.data('origTransform', this.transform().local );
				}
			);
	}
	
	function init(scenario){
		var s = Snap("#pnlTimeline");
		$D.each(scenario, function(obj){
			drawObject(s, obj);
		});
	}

	return {
		init:init
	};
})(JDB.version("3.0.1"));

