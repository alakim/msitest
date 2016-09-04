var Datasources = (function($,$H,$D){
	function displayError(msg){
		$(".pnlDatasources .pnlData").html($H.div({"class":"error"}, msg));
	}
	function loadFromFile(ds){
		var pnl = $(".pnlDatasources .pnlData");
		var colNames = "ObjectShortName;Address;District".split(";");
		pnl.html($H.img({src:"wait.gif"}));
		$.ajax({ //чтобы локальный файл корректно грузила - должен быть указан правильный mimeType
		    url: ds.file,
		    dataType: "json", mimeType: "application/json",
		    success: function(res){
			pnl.html((function(){with($H){
				//var objIndex = $D.index(DB.objects, "x|x.Cells.global_id");
				return table({border:1, cellpadding:3, cellspacing:0},
					tr(
						apply(colNames, function(nm){
							return th(translateColName(nm));
						}),
						td(),
						td("Действие")
					),
					apply(res, function(el, i){
						var existingObject = Main.objectIndex()[el.Cells.global_id];
						//console.log(el.Id, el.Cells.global_id, existingObject.Id, existingObject.Cells.global_id);
						var conflictsDetected = existingObject && $D(el.Cells)
							.select(function(c, nm){
								//console.log(c, nm, existingObject.Cells[nm]);
								return c!=existingObject.Cells[nm];
							})
							.toArray().raw().length;
						var ckBoxAttr = {type:"checkbox"};
						if(!conflictsDetected)ckBoxAttr.checked = true;
						return existingObject&&!conflictsDetected?null:tr(
							apply(colNames, function(nm){
								return td(el.Cells[nm])
							}),
							td(input(ckBoxAttr)),
							td(conflictsDetected?markup(
									span({"class":"error"}, "Обнаружены конфликты"), " ",
									span({"class":"link lnkConflict"}, "[подробнее]")
								)
								:span({"class":"success"}, "загрузить")
							)
						)
					})
				);
			}})())
			.find(".lnkConflict").click(function(){
				Main.dialog.view();
			}).end();
		    },
		    error:function(){displayError("Ошибка загрузки файла "+ds.file);}
		});
	}
	
	function translateColName(nm){
		return DB.translation.colNames[nm] || nm;
	}
	
	function viewFromFile(ds){
		var pnl = $(".pnlDatasources .pnlData");
		pnl.html($H.img({src:"wait.gif"}));
		$.ajax({ //чтобы локальный файл корректно грузила - должен быть указан правильный mimeType
		    url: ds.file,
		    dataType: "json", mimeType: "application/json",
		    success: function(res){
			var colNames = $D(res)
				.map(function(x){return $D.keys(x.Cells);})
				.flat()
				.index('x|x')
				.keys()
				.raw();
			pnl.html((function(){with($H){
				return table({border:1, cellpadding:3, cellspacing:0},
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
				);
			}})());
		    },
		    error:function(){displayError("Ошибка загрузки файла "+ds.file);}
		});
	}
	
	function displayList(){
		$(".pnlDatasources").html((function(){with($H){
			return markup(
				ul(
					apply(DB.datasources, function(ds, id){
						return li(
							span(ds.name), ": ",
							span({"class":"link lnkViewDS", "data-id":id}, "[посмотреть]"), ", ",
							span({"class":"link lnkLoadDS", "data-id":id}, "[загрузить]")
						);
					})
				),
				div({"class":"pnlData"})
			);
		}})())
		.find(".lnkViewDS").click(function(){
			var ds = DB.datasources[$(this).attr("data-id")];
			if(ds.file) viewFromFile(ds);
		}).end()
		.find(".lnkLoadDS").click(function(){
			var ds = DB.datasources[$(this).attr("data-id")];
			if(ds.file) loadFromFile(ds);
		}).end()
		.fadeIn();
	}
	
	return{
		init: function(){
			$(".pnlMenu").append((function(){with($H){
				return span({"class":"link lnkDatasources"}, "Внешние источники данных");
			}})())
			.find(".lnkDatasources").click(function(){
				Main.hideTabPanels();
				displayList();
			}).end();
			$(".pnlMain").append($H.div({"class":"tabPanel pnlDatasources", style:"display:none;"}))
		},
		view: function(){
			Main.hideTabPanels();
			displayList();
		}
	};
})(jQuery, Html, JDB);	
Main.registerModule(Datasources);