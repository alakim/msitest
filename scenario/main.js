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
			$.get("data/ver_gorod_20160726.json", {}, function(res){
			});
		}).end();
	});
	
})(jQuery, JDB, Html);
