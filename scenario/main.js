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
			" .pnlMenu":{
				padding:px(5, 10),
				margin:px(10, 5),
				"border-bottom":"1px solid #ccc"
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
					.map(function(x){return $D.keys(x.Cells);})
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
									return td(el.Cells[nm])
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
	
	return {
		registerModule:function(m){
			modules.push(m);
		}
	};
	
})(jQuery, JDB, Html);
