var ObjectGroupsView = (function($, $H, $D){
	$H.writeStylesheet({
		" .pnlGrpView":{
			" .name":{"font-weight":"bold"}
		}
	});
	function viewGroups(){
		var pnl = $(".pnlGrpView");
		var groups = ObjectGroups.getGroups();
		var grpIndex = $D.index(groups, "id");
		pnl.html((function(){with($H){
			return div(
				apply(groups, function(grp){
					return div(
						div(span({"class":"link lnkGrp", "data-grp":grp.id}, grp.name)),
						div({"class":"grpObjects"})
					);
				})
			);
		}})())
		.find(".lnkGrp").click(function(){
			var grpID = $(this).attr("data-grp");
			var grp = grpIndex[grpID];
			$(this).parent().parent().find(".grpObjects").html((function(){with($H){
				return ul(
					apply(grp.objects, function(obj){
						return li(span({"class":"name"}, obj.ObjectShortName), " - ", obj.Address)
					})
				);
			}})());
		}).end();
		
		pnl.fadeIn();
	}
	
	return{
		init: function(){
			$(".pnlMenu").append((function(){with($H){
				return span({"class":"link lnkObjGrpView"}, "Группы объектов");
			}})())
			.find(".lnkObjGrpView").click(function(){
				Main.hideTabPanels();
				viewGroups();
			}).end();
			$(".pnlMain").append($H.div({"class":"tabPanel pnlGrpView", style:"display:none;"}))
		},
		view: function(){
			Main.hideTabPanels();
			viewGroups();
		}
	};
})(jQuery, Html, JDB);	
Main.registerModule(ObjectGroupsView);