var Timeline = (function($D){

	var Settings = {
		objectHeight:22
	};
	
	function drawObject(s, obj){
		//console.log("drawing ", obj);
		var pos = {x:10*obj.time, y:obj.usr.y};
		var objView = s.rect(pos.x, pos.y, 20*obj.duration, Settings.objectHeight)
			.attr({fill:"#ffc", stroke:"#440"})
			.drag(); // обработчики не передаем, чтобы сохранить дефолтное поведение

		// Более аккуратная привязка обработчиков - дефолтное поведение сохраняется
		eve.on('snap.drag.start.' + objView.id, function(e) {
		  console.log("start: ", e);
		});
		eve.on('snap.drag.end.' + objView.id, function(e) {
		  console.log("end: ", e);
		});
		eve.on('snap.drag.move.' + objView.id, function(x, y, z, e) {
		  console.log("move: ", x, y, z, e);
		});
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

