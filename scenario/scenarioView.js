var ScenarioView = (function($,$H,$D){
	var px = $H.unit("px");
	$H.writeStylesheet({
		".scenarioPanel":{
			margin:px(5), 
			padding:px(5),
			border:"1px solid #ccc",
			" .object":{
				margin:px(3),
				padding:px(3),
				border:"1px solid #ccc"
			}
		}
	});
	
	function view(id){
		var scen = DB.scenario[id];
		$(".pnlScenarioView").html((function(){with($H){
			return div(
				h3("Сценарий ", scen.title),
				p("Продолжительность ", scen.duration, " мин."),
				div({"class":"scenarioPanel"},
					apply(scen.objects, function(obj){
						var objData = Main.objectIndex()[obj.id];
						return div({"class":"object"}, 
							objData.Cells.ObjectShortName, 
							$H.format(" - показывать c {0} мин в течение {1} мин.", obj.time, obj.duration)
						)
					})
				)
			);
		}})());
	}
	
	function viewList(){
		var pnl = $(".pnlScenarioView");
		pnl.html((function(){with($H){
			return div(
				h2("Список сценариев"),
				ul(
					apply(DB.scenario, function(sc, id){
						return li(span({"class":"link lnkScen", "data-id":id}, sc.title));
					})
				)
			);
		}})())
		.find(".lnkScen").click(function(){
			var id = $(this).attr("data-id");
			view(id);
		}).end();
		
		pnl.fadeIn();
	}
	
	return{
		init: function(){
			$(".pnlMenu").append((function(){with($H){
				return span({"class":"link lnkScenarioView"}, "Сценарии");
			}})())
			.find(".lnkScenarioView").click(function(){
				Main.hideTabPanels();
				viewList();
			}).end();
			$(".pnlMain").append($H.div({"class":"tabPanel pnlScenarioView", style:"display:none;"}))
		},
		view: function(){
			Main.hideTabPanels();
			viewList();
		}
	};
})(jQuery, Html, JDB);	
Main.registerModule(ScenarioView);