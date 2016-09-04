var DB = (function($D){
	
	var DB = {
		datasources:{
			ver_gorod:{
				name:"Веревочные городки",
				file:"data/ver_gorod_20160726.json",
				transform:function(obj){
					return obj.Cells;
				}
			}
		},
		translation:{
			colNames:{
				global_id:"Глобальный ID",
				ObjectShortName:"Краткое наименование",
				Address:"Адрес",
				District:"Район",
				AdmArea:"Округ",
				WebSite:"Веб-сайт"
			}
		},
		objects:[
			{"global_id":13898536,"Photo":["4989cb56-fdf4-462e-8131-bb2a973ba04a"],"ObjectShortName":"ПК № 27 планируемый к созданию ЛЗ «Лианозовский»","SportZoneName":"веревочный городок","AdmArea":"Северо-Восточный административный округ","District":"район Лианозово","Address":"Угличская улица, дом 11, строение 1","Email":"old_dir-svao@eco.mos.ru","WebSite":null,"HelpPhone":null,"ObjectHasEquipmentRental":"нет","ObjectHasTechService":"нет","ObjectHasDressingRoom":"нет","ObjectHasEatery":"нет","ObjectHasToilet":"да","ObjectHasWifi":"нет","ObjectHasCashMachine":"нет","ObjectHasFirstAidPost":"нет","SportZoneWorkingHours":[{"DayOfWeek":"понедельник","Hours":"08:00-22:00"},{"DayOfWeek":"вторник","Hours":"08:00-22:00"},{"DayOfWeek":"среда","Hours":"08:00-22:00"},{"DayOfWeek":"четверг","Hours":"08:00-22:00"},{"DayOfWeek":"пятница","Hours":"08:00-22:00"},{"DayOfWeek":"суббота","Hours":"08:00-22:00"},{"DayOfWeek":"воскресенье","Hours":"08:00-22:00"}],"SportZoneClarificationOfWorkingHours":null,"SportZoneLighting":"освещение лампами накаливания","SportZonePaid":null,"SportZonePaidComments":null,"SportZoneHasMusic":"нет","SportZoneDisabilityFriendly":"не приспособлен","SportZoneService":[],"geoData":{"type":"Point","coordinates":[37.570283816396284,55.89989402918847]}},
			{"global_id":13902469,"Photo":["fd00f089-1a0a-45fb-bfa1-be57fc677a2b"],"ObjectShortName":"Измайловский Парк культуры и отдыха","SportZoneName":"веревочный городок","AdmArea":"Восточный административный округ","District":"район Измайлово","Address":"аллея Большого Круга, дом 7","Email":"izmpark@mail.ru","WebSite":"izmailovsky-park.ru","HelpPhone":null,"ObjectHasEquipmentRental":"да","ObjectHasTechService":"да","ObjectHasDressingRoom":"да","ObjectHasEatery":"да","ObjectHasToilet":"да","ObjectHasWifi":"да","ObjectHasCashMachine":"нет","ObjectHasFirstAidPost":"нет","SportZoneWorkingHours":[{"DayOfWeek":"понедельник","Hours":"11:00-20:00"},{"DayOfWeek":"вторник","Hours":"11:00-20:00"},{"DayOfWeek":"среда","Hours":"11:00-20:00"},{"DayOfWeek":"четверг","Hours":"11:00-20:00"},{"DayOfWeek":"пятница","Hours":"11:00-20:00"},{"DayOfWeek":"суббота","Hours":"10:00-20:00"},{"DayOfWeek":"воскресенье","Hours":"10:00-20:00"}],"SportZoneClarificationOfWorkingHours":null,"SportZoneLighting":"смешанное освещение","SportZonePaid":null,"SportZonePaidComments":"300 - 450 руб.","SportZoneHasMusic":"да","SportZoneService":[],"geoData":{"type":"Point","coordinates":[37.75305820168144,55.78204861575169]}},
			{"global_id":170649758,"Photo":["1288e606-4cc2-4fae-88f7-10661b8e80ca"],"ObjectShortName":"Парк «Сокольники»","SportZoneName":"веревочный городок «Панда-парк»","AdmArea":"Восточный административный округ","District":"район Сокольники","Address":"улица Сокольнический Вал, дом 1, строение 1","Email":"info@park.sokolniki.com","WebSite":"park.sokolniki.com","HelpPhone":null,"ObjectHasEquipmentRental":"да","ObjectHasTechService":"нет","ObjectHasDressingRoom":"да","ObjectHasEatery":"да","ObjectHasToilet":"да","ObjectHasWifi":"да","ObjectHasCashMachine":"да","ObjectHasFirstAidPost":"да","SportZoneWorkingHours":[{"DayOfWeek":"понедельник","Hours":"10:00-22:00"},{"DayOfWeek":"вторник","Hours":"10:00-22:00"},{"DayOfWeek":"среда","Hours":"10:00-22:00"},{"DayOfWeek":"четверг","Hours":"10:00-22:00"},{"DayOfWeek":"пятница","Hours":"10:00-22:00"},{"DayOfWeek":"суббота","Hours":"10:00-22:00"},{"DayOfWeek":"воскресенье","Hours":"10:00-22:00"}],"SportZoneClarificationOfWorkingHours":null,"SportZoneLighting":"смешанное освещение","SportZonePaid":null,"SportZonePaidComments":null,"SportZoneHasMusic":"нет","SportZoneDisabilityFriendly":"не приспособлен","SportZoneService":[],"geoData":{"type":"Point","coordinates":[37.675205258425606,55.796284355849735]}}
		],
		scenario:{
			scen1:{
				title:"Детские площадки",
				duration:60,
				objects:[
					{id:13898536, time:10, duration:2},
					{id:13902469, time:12, duration:2}
				]
			}
		}
	};
	
	return DB;
})(JDB);	
