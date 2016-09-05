var Main = (function($,$D,$H){
	var px = $H.unit("px");
	$H.writeStylesheet({
		body:{
			"font-family":"Vedana, Arial, Sans-Serif",
			"font-Size":px(14),
			" .link":{
				color:"#00a",
				cursor:"pointer",
				":hover":{
					color:"#f00",
					"text-decoration":"underline"
				}
			},
			" .fieldName":{"font-weight":"bold"},
			" .pnlMenu":{
				padding:px(5, 10),
				margin:px(10, 5),
				"border-bottom":"1px solid #ccc",
				" .link":{
					padding:px(0, 10)
				}
			},
			" .pnlMain":{
				border:"1px solid #ccc",
				"min-height":px(400),
				padding:px(5)
			},
			" .success":{
				color:"#080"
			},
			" .error":{
				color:"#f00"
			},
			" div.error":{
				padding:px(5),
				background:"#ffe",
				border:"1px solid #f00"
			},
			" .dialogWindow":{
				width:"100%", height:"100%",
				position:"absolute",
				top:px(0), left:px(0),
				" .dialogBg":{
					width:"100%", height:"100%",
					background:"#aaa",
					opacity:.7,
					position:"fixed"
				},
				" .dialogPanel":{
					width:px(500),
					"min-height":px(300),
					background:"#fff",
					border:"1px solid #888",
					padding:px(10),
					margin:"80px auto",
					position:"relative",
					" .pnlButtons":{
						"text-align":"center",
						padding:px(3, 20)
					}
				}
			}
		}
	});
	function viewData(){
		$(".pnlMain").html((function(){with($H){
			return div(
				div(input({type:"button", "class":"btLoadJSON", value:"Load JSON"})),
				div({"class":"pnlData"})
			);
		}})())
		.find(".btLoadJSON").click(function(){
			$(".pnlMain .pnlData").html($H.img({src:"wait.gif"}));
			//$.get("data/ver_gorod_20160726.json", {}, function(res){});
			$.ajax({ //чтобы локальный файл корректно грузила - должен быть указан правильный mimeType
			    url: "data/ver_gorod_20160726.json",
			    dataType: "json", mimeType: "application/json",
			    success: function(res){
				var colNames = $D(res)
					//.map(function(x){return $D.keys(x.Cells);})
					.map(function(x){return $D.keys(x);})
					.flat()
					.index('x|x')
					.keys()
					.raw();
				$(".pnlMain .pnlData").html((function(){with($H){
					return table({border:1, cellpadding:3, cellspacing:0},
						tr(
							apply(colNames, function(nm){
								return th(nm);
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
			    }
			});
		}).end();
	}
	
	var modules = [];
	$(function(){
		$D.each(modules, function(m){
			m.init();
		});
	});
	
	var objectIndex;
	
	var dialog = (function(){
		function view(){
			var pnl = $(".dialogPanel");
			if(!pnl.length){
				pnl = $((function(){with($H){
					return div({"class":"dialogWindow"},
						div({"class":"dialogBg"}),
						div({"class":"dialogPanel"})
					);
				}})());
				$("body").append(pnl);
				pnl = $(".dialogPanel");
				pnl.css("width", "").html(
					$H.markup(
						$H.p("Dialog Panel"),
						$H.input({type:"button", "class":"btCancel", value:"Закрыть"})
					)
				).find(".btCancel").click(function(){
					Main.dialog.hide();
				});
			}
			
			$(".dialogWindow").fadeIn();
			return pnl;
		}
		function hide(){
			$(".dialogWindow").hide();
		}
		
		return {
			view: view,
			hide: hide
		};
	})();
	
	function updateObjectIndex(){
		objectIndex = $D.index(DB.objects, "x|x.global_id");
	}
	
	return {
		registerModule:function(m){
			modules.push(m);
		},
		hideTabPanels: function(){
			$(".pnlMain .tabPanel").hide();
		},
		objectIndex: function(){
			if(!objectIndex) 
				updateObjectIndex();
			return objectIndex;
		},
		updateObjectIndex: updateObjectIndex,
		dialog:dialog
	};
	
})(jQuery, JDB, Html);
