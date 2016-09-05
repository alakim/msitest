var ObjectGroups = (function($D){
	
	return {
		getGroups: function(){
			function selectGroups(grp){
				var res = [];
				$D.each(grp, function(r, id){
					var grp = {name:r.name, id:id, objects:
						$D.select(DB.objects, r.select)
					};
					if(r.children){
						grp.children = selectGroups(r.children);
					}
					res.push(grp);
				});
				
				return res;
			}
			return selectGroups(DB.objectGroups.rules);
		}
	};
})(JDB);