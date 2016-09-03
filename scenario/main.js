(function($,$D,$H){
	var px = $H.unit("px");
	$H.writeStylesheet({
		body:{
			"font-family":"Vedana, Arial, Sans-Serif",
			"font-Size":px(14)
		}
	});
	$(function(){
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
	});
	
})(jQuery, JDB, Html);
