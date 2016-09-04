var DBView = (function($,$H,$D){

	
	function translateColName(nm){
		return DB.translation.colNames[nm] || nm;
	}
	
	function viewObjects(){
		var pnl = $(".pnlDBView");
		pnl.html($H.img({src:"wait.gif"}));
		function view(res){
			var colNames = $D(res)
				.map(function(x){return $D.keys(x.Cells);})
				.flat()
				.index('x|x')
				.keys()
				.raw();
			pnl.html((function(){with($H){
				return markup(
					h2("Объекты"),
					table({border:1, cellpadding:3, cellspacing:0},
						tr(
							apply(colNames, function(nm){
								return th(translateColName(nm));
							})
						),
						apply(res, function(el, i){
							return tr(
								apply(colNames, function(nm){
									return td(el.Cells[nm])
								})
							)
						})
					)
				);
			}})());
		}
		view(DB.objects);
		pnl.fadeIn();
	}
	
	return{
		init: function(){
			$(".pnlMenu").append((function(){with($H){
				return span({"class":"link lnkDBView"}, "База данных объектов");
			}})())
			.find(".lnkDBView").click(function(){
				Main.hideTabPanels();
				viewObjects();
			}).end();
			$(".pnlMain").append($H.div({"class":"tabPanel pnlDBView", style:"display:none;"}))
		},
		view: function(){
			Main.hideTabPanels();
			viewObjects();
		}
	};
})(jQuery, Html, JDB);	
Main.registerModule(DBView);