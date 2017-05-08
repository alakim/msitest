var Animator = (function($,$S){
	var enableTrace = false;

	var maxAnimationTime = 1e3,
		maxAnimationSteps = 0,
		speed = 1e-1,
		size = {w:400, h: 250};
	
	var banners = [],
		modes = {};

	function Animator(){
		this.busy = false;
		var animatedItems = [];

		function collectItems(bnrIdx){
			if(animatedItems.length) return;

			var snp = banners[bnrIdx].snap,
				animationType = banners[bnrIdx].mode;
			var coll = snp.selectAll('.icon');
			for(var el,i=0; el=coll[i],i<coll.length; i++){
				animatedItems.push(
					new (modes[animationType])(el)
				);
			}
		}

		this.start = function(bnrIdx){var self = this;
			if(this.busy) return;
			this.busy = true;

			collectItems(bnrIdx);

			var requestAnimFrame = window.requestAnimationFrame ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame ||
				window.oRequestAnimationFrame ||
				window.msRequestAnimationFrame ||
				function (callback) {setTimeout(callback, 16);};


			function animationStep(frameNumber, t0){
				if(!self.busy) return;
				if(enableTrace) console.log('*********** Animation step '+frameNumber+' **********');
				var curT = (new Date).getTime();
				var dT = curT - t0;
				
				if(dT<maxAnimationTime){		
					for(var i=0; i<animatedItems.length; i++){
						animatedItems[i].animate(dT);
					}
				}
				
				if(maxAnimationSteps>0 && frameNumber>maxAnimationSteps){
					self.busy = false;
					return;
				}
				
				requestAnimFrame(function(){
					animationStep(frameNumber+1, curT);
				});
			}
			animationStep(0, (new Date).getTime());
		};

		this.stop = function(bnrIdx){var self=this;
			self.busy = false;
			animatedItems = [];
		};
	}

	var animator = new Animator();

	function random(){
		return Math.random()*2 - 1;
	}

	modes['floating'] = function(el){
		this.svgEl = el;
		this.x = 0;
		this.y = 0;
		this.space = {x:30, y:30}
		
		function newDirection(){
			var angle = Math.PI*2*Math.random();
			return {x:Math.sin(angle), y:Math.cos(angle)};
		}
		this.direction = newDirection();

		this.animate = function(dT){
			this.x+=dT*speed*this.direction.x;
			this.y+=dT*speed*this.direction.y;

			if(this.x<-this.space.x 
				|| this.x>this.space.x
				|| this.y<-this.space.y
				|| this.y>this.space.y)
				this.direction = newDirection();

			var tr1 = [
				't',
				this.x,
				',',
				this.y
			].join('');
			this.svgEl.transform(tr1);
		};
	};


	modes['brownian'] = function(el){
		this.svgEl = el;
		this.x = 0;
		this.y = 0;
		this.space = {x:30, y:30}
		
		this.animate = function(dT){
			this.x += dT*speed*random();
			if(this.x<-this.space.x) this.x = -this.space.x;
			else if(this.x>this.space.x) this.x = this.space.x;
			
			this.y += dT*speed*random();
			if(this.y<-this.space.y) this.y = -this.space.y;
			else if(this.y>this.space.y) this.y = this.space.y;
			
			var tr1 = [
				't',
				this.x,
				',',
				this.y
			].join('');
			this.svgEl.transform(tr1);
		};
	};
	
	function hoverin(bnrIdx){
		animator.start(bnrIdx);
		// console.log('hoverin: ', bnrIdx);
	}

	function hoverout(bnrIdx){
		animator.stop(bnrIdx);
		// console.log('hoverout: ', bnrIdx);
	}
	
	function addBanner(bnr){bnr=$(bnr);
		var src = bnr.attr('data-src'),
			mode = bnr.attr('data-mode');

		var snp = $S(bnr[0]);
		var bnrIdx = banners.length;
		Snap.load(src, function(el){
			snp.append(el);
			snp.select('#layer1').hover(function(){
				hoverin(bnrIdx);
			}, function(){
				hoverout(bnrIdx)
			});
		});
		banners.push({
			snap:snp,
			mode: mode
		});
	}

	function addMode(id, f){
		modes[id] = f;
	}

	return {
		random: random,
		addBanner: addBanner,
		addMode: addMode
	};
})(jQuery, Snap);
