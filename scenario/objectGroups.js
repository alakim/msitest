var ObjectGroups = (function($D){
	var rules = {
		svao:{
			name:"СВАО",
			select:function(obj){return obj.AdmArea=="Северо-Восточный административный округ"}
		},
		eatery:{
			name:"Общепит",
			select:function(obj){return obj.ObjectHasEatery=="да"}
		}
	};
	
	return {
		getGroups: function(){
			var res = [];
			$D.each(rules, function(r, id){
				var grp = {name:r.name, id:id, objects:
					$D.select(DB.objects, r.select)
				};
				res.push(grp);
			});
			
			return res;
		}
	};
})(JDB);