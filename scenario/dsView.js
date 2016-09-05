var Datasources = (function($,$H,$D){
	function displayError(msg){
		$(".pnlDatasources .pnlData").html($H.div({"class":"error"}, msg));
	}
	
	function equalValues(v1, v2){
		if(typeof(v1)!=typeof(v2)) return false;
		if(v1 instanceof Array){
			if(v1.length!=v2.length) return false;
			for(var i=0; i<v1.length; i++){
				if(!equalValues(v1[i], v2[i])) return false;
			}
			return true;
		}
		if(typeof(v1)=="object"){
			if(!equalValues($D.keys(v1), $D.keys(v2))) return false;
			for(var k in v1){
				if(!equalValues(v1[k], v2[k])) return false;
			}
			return true;
		}
		return v1==v2;
	}
	
	//console.log(equalValues("asb", "asb"), equalValues(5, 5), equalValues({x:5, y:5}, {x:5, y:5}), equalValues([1,2, [2,3]], [1,2, [2, 3]]));
	//console.log(equalValues("asb", "as2b"), equalValues(5, 2), equalValues({x:5, y:2}, {x:5, y:5}), equalValues([1,2, [3, 3]], [1,3, [4,5]]));
	
	function loadFromFile(ds){
		var pnl = $(".pnlDatasources .pnlData");
		var colNames = "ObjectShortName;Address;District".split(";");
		pnl.html($H.img({src:"wait.gif"}));
		$.ajax({ //чтобы локальный файл корректно грузила - должен быть указан правильный mimeType
		    url: ds.file,
		    dataType: "json", mimeType: "application/json",
		    success: function(res){
			res = $D.map(res, ds.transform);
			//console.log(res);
			pnl.html((function(){with($H){
				//var objIndex = $D.index(DB.objects, "x|x.Cells.global_id");
				return markup(
					table({border:1, cellpadding:3, cellspacing:0},
						tr(
							apply(colNames, function(nm){
								return th(translateColName(nm));
							}),
							td(),
							td("Действие")
						),
						apply(res, function(el, i){
							var existingObject = Main.objectIndex()[el.global_id];
							//console.log(el.Id, el.Cells.global_id, existingObject.Id, existingObject.Cells.global_id);
							var conflictsDetected = existingObject && $D(el)
								.select(function(c, nm){
									//console.log(c, nm, existingObject.Cells[nm]);
									//return c!=existingObject.Cells[nm];
									return !equalValues(c, existingObject[nm])
								})
								.toArray().raw().length;
							var ckBoxAttr = {type:"checkbox", "data-id":el.global_id};
							if(!conflictsDetected)ckBoxAttr.checked = true;
							return existingObject&&!conflictsDetected?null:tr(
								apply(colNames, function(nm, i){
									return td(
										i==0?span({"class":"link lnkView", "data-id":el.global_id}, 
											el[nm]
										):el[nm]
									)
								}),
								td(input(ckBoxAttr)),
								td(conflictsDetected?markup(
										span({"class":"error"}, "Обнаружены конфликты"), " ",
										span({"class":"link lnkConflict", "data-id":el.global_id}, "[подробнее]")
									)
									:span({"class":"success"}, "загрузить")
								)
							)
						})
					),
					div({"class":"pnlButtons"},
						input({type:"button", value:"Загрузить отмеченные", "class":"btLoadSelected"})
					)
				);
			}})())
			.find(".btLoadSelected").click(function(){
				$(".pnlData input[type='checkbox']").each(function(i, el){
					if($(this)[0].checked){
						var id = $(this).attr("data-id");
						//console.log("loading ", id);
						var obj = $D.select(res, "x|x.global_id=="+id)[0];
						var existingObject = Main.objectIndex()[id];
						if(existingObject){
							$D.extend(existingObject, obj);
						}
						else{
							DB.objects.push(obj);
							Main.updateObjectIndex();
						}
					}
				});
				alert("Загрузка выполнена");
			}).end()
			.find(".lnkView").click(function(){
				var id=$(this).attr("data-id");
				var obj = $D.select(res, "x|x.global_id=="+id)[0];
				var dlg = Main.dialog.view();
				dlg.css({width:"600px"}).html((function(){with($H){
					return div(
						table(
							apply(obj, function(v, k){
								return tr(
									td({"class":"fieldName"}, translateColName(k)),
									td(v)
								);
							})
						),
						div({"class":"pnlButtons"},
							input({type:"button", value:"Закрыть", "class":"btCancel"})
						)
					)
				}})())
				.find(".btCancel").click(Main.dialog.hide);
			}).end()
			.find(".lnkConflict").click(function(){
				var id = $(this).attr("data-id");
				var newObj = $D.select(res, "x|x.global_id=="+id)[0];
				var existingObject = Main.objectIndex()[id];
				//console.log(newObj, existingObject);
				var colNames = $D(newObj).map("x|x").extend(existingObject).keys().raw()
				var dlg = Main.dialog.view();
				dlg.css({width:"600px"}).html((function(){with($H){
					return markup(
						div({"style":"min-height:200px"},
							table(
								tr(
									th("Название поля"),
									th("Новое значение"),
									th("Имеющееся значение")
								),
								apply(colNames, function(nm){
									var v = [
										newObj[nm],
										existingObject[nm]
									];
									var equal = equalValues(v[0], v[1]);
									//if(!equal) console.log(v);
									return tr(
										equalValues(v[0], v[1])?{"class":"success"}:{"class":"error"},
										td(translateColName(nm)),
										td(v[0]),
										td(v[1])
									);
								})
							)
						),
						div({"class":"pnlButtons"},
							input({type:"button", "class":"btCancel", value:"Закрыть"})
						)
					);
				}})())
				.find(".btCancel").click(Main.dialog.hide);
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
			res = $D.map(res, ds.transform);
			var colNames = $D(res)
				.map(function(x){return $D.keys(x);})
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
								return td(el[nm])
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