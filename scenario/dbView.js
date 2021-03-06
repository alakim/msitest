var DBView = (function($,$H,$D){

	
	function translateColName(nm){
		return DB.translation.colNames[nm] || nm;
	}
	
	function viewObjects(){
		var pnl = $(".pnlDBView");
		pnl.html($H.img({src:"wait.gif"}));
		function view(res){
			var colNames = $D(res)
				.map(function(x){return $D.keys(x);})
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
								apply(colNames, function(nm, i){
									var v = el[nm]
									return td(
										i==0?span({"class":"link lnkEdit", "data-id":el.global_id}, v):v
									)
								})
							)
						})
					)
				);
			}})())
			.find(".lnkEdit").click(function(){
				var id = $(this).attr("data-id");
				var obj = $D.select(DB.objects, "x|x.global_id=="+id)[0];
				var dlg = Main.dialog.view();
				dlg.css({width:"600px"}).html((function(){with($H){
					return div(
						table(
							apply(obj, function(v, k){
								return tr(
									td({"class":"fieldName"}, k),
									td(
										input({type:"text", "class":"field", "data-fld":k, value:v})
									)
								);
							})
						),
						div({"class":"pnlButtons"},
							input({type:"button", value:"Сохранить", "class":"btSave"}),
							input({type:"button", value:"Отмена", "class":"btCancel"})
						)
					);
				}})())
				.find(".btSave").click(function(){
					dlg.find("input.field").each(function(i, el){el=$(el);
						var fldNm = el.attr("data-fld");
						obj[fldNm] = el.val();
					});
					//alert("Данные сохранены");
					Main.dialog.hide();
					viewObjects();
				}).end()
				.find(".btCancel").click(Main.dialog.hide).end();
			}).end();
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