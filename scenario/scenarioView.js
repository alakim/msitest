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
				border:"1px solid #ccc",
				" .name":{
					"font-weight":"bold"
				}
			}
		}
	});
	
	function view(scenID){
		var scen = DB.scenario[scenID];
		$(".pnlScenarioView").html((function(){with($H){
			return div(
				h3("Сценарий ", scen.title),
				p("Продолжительность ", scen.duration, " мин."),
				div({"class":"scenarioPanel"},
					apply($D.sort(scen.objects, "time"), function(obj){
						var objData = Main.objectIndex()[obj.id];
						return div({"class":"object"}, 
							span({"class":"name link lnkItem", "data-id":obj.id}, objData.ObjectShortName), 
							$H.format(" - показывать c {0} мин в течение {1} мин.", obj.time, obj.duration)
						)
					})
				),
				div({"class":"pnlButtons"},
					input({type:"button", value:"Показать список", "class":"btShowList"}),
					input({type:"button", value:"Добавить объект", "class":"btAddObject"})
				)
			);
		}})())
		.find(".lnkItem").click(function(){
			objectDialog(scen, scenID, $(this).attr("data-id"));
		}).end()
		.find(".btShowList").click(viewList).end()
		.find(".btAddObject").click(function(){
			objectDialog(scen, scenID);
		}).end();
	}
	
	function objectDialog(scen, scenID, objID){
		var createMode = objID==null;
		var dlg = Main.dialog.view();
		var obj = objID?Main.objectIndex()[objID]:null;
		var objRef = objID?$D.select(scen.objects, "o|o.id=="+objID)[0]:null;
		dlg.css({width:"500px"}).html((function(){with($H){
			return markup(
				h2(createMode?"Добавление":"Редактирование", " объекта"),
				div(
					input({type:"text", "class":"tbObjSearch"}),
					div({"class":"pnlObjList"}),
					table(
						tr(
							td({"class":"fieldName"}, "Объект"),
							td(
								div({"class":"tbObjName"}, obj?obj.ObjectShortName:null),
								input({type:"hidden", "class":"field tbObjID", "data-field":"id"}, objID?{value:objID}:null)
							)
						),
						tr(
							td({"class":"fieldName"}, "Время"),
							td(input({type:"text", "class":"field tbObjTime", "data-field":"time"}, objRef?{value:objRef.time}:null))
						),
						tr(
							td({"class":"fieldName"}, "Длительность"),
							td(input({type:"text", "class":"field tbObjDuration", "data-field":"duration"}, objRef?{value:objRef.duration}:null))
						)
					)
				),
				div({"class":"pnlButtons"},
					input({type:"button", value:"Ввод", "class":"btOK"}),
					input({type:"button", value:"Отмена", "class":"btCancel"})
				)
			);
		}})())
		.find(".tbObjSearch").keyup(function(){
			var val = $(this).val();
			var reName = new RegExp(val, "ig");
			var objList = $D.select(DB.objects, function(o){
				return o.ObjectShortName.match(reName);
			});
			dlg.find(".pnlObjList").html((function(){with($H){
				return ul(
					apply(objList, function(o){
						return li(
							span({"class":"link lnkObjRef", "data-id":o.global_id}, o.ObjectShortName)
						);
					})
				);
			}})())
			.find(".lnkObjRef").click(function(){
				var id = $(this).attr("data-id");
				var obj = Main.objectIndex()[id];
				dlg.find(".tbObjName").html(obj.ObjectShortName).end()
					.find(".tbObjID").val(id);
				}).end();
		}).end()
		.find(".btOK").click(function(){
			var data = {};
			dlg.find(".field").each(function(i, el){el=$(el);
				data[el.attr("data-field")] = parseInt(el.val(), 10);
			}).end();
			if(createMode) scen.objects.push(data);
			else scen.objects = $D.map(scen.objects, function(obj){
				return obj.id==objID?data:obj;
			});
			Main.dialog.hide();
			view(scenID);
		}).end()
		.find(".btCancel").click(Main.dialog.hide).end()
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
				),
				div({"class":"pnlButtons"},
					input({type:"button", value:"Добавить сценарий", "class":"btAddScenario"})
				)
			);
		}})())
		.find(".btAddScenario").click(function(){
			var dlg = Main.dialog.view();
			dlg.css({width:"500px"}).html((function(){with($H){
				return markup(
					h2("Добавление сценария"),
					table(
						tr(
							td({"class":"fieldName"}, "Название"),
							td(input({type:"text", "class":"field", "data-fld":"title"}))
						),
						tr(
							td({"class":"fieldName"}, "Продолжительность, мин."),
							td(input({type:"text", "class":"field", "data-fld":"duration"}))
						)
					),
					div({"class":"pnlButtons"},
						input({type:"button", value:"Сохранить", "class":"btSave"}),
						input({type:"button", value:"Отмена", "class":"btCancel"})
					)
				);
			}})())
			.find(".btSave").click(function(){
				var data = {objects:[]};
				dlg.find(".field").each(function(i, el){el=$(el);
					data[el.attr("data-fld")] = el.val();
				});
				var id = "scen"+($D.keys(DB.scenario).length+1);
				DB.scenario[id] = data;
				console.log(DB.scenario);
				Main.dialog.hide();
				viewList();
			}).end()
			.find(".btCancel").click(function(){
				Main.dialog.hide();
			}).end();
		}).end()
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