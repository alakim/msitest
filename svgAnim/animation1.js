(function($){
	var enableTrace = false;
	var maxAnimationTime = 1e3,
		maxAnimationSteps = 0,
		speed = 1e-1,
		size = {w:400, h: 250};

	var snp, 
		animatedItems = [];

	function collectItems(){
		if(animatedItems.length) return;
		var coll = snp.selectAll('.icon');
		for(var el,i=0; el=coll[i],i<coll.length; i++){
			animatedItems.push(new AnimatedItem(el));
		}
	}

	function Animator(){
		this.busy = false;

		this.start = function(){var self = this;
			if(this.busy) return;
			this.busy = true;

			collectItems();

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

		this.stop = function(){var self=this;
			self.busy = false;
		};
	}

	var animator = new Animator();

	function random(){
		return Math.random()*2 - 1;
	}

	function AnimatedItem(el){
		this.svgEl = el;
		this.tr0 = el.transform();
		this.x = 0;
		this.y = 0;
		this.size = el.getBBox();
		this.space = {x:30, y:30}
		
		this.animate = function(dT){
			this.brownian(dT);
		};
		
		this.brownian = function(dT){
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
	}

	function hoverin(){
		animator.start();
	}

	function hoverout(){
		animator.stop();
	}

	$(function(){
		snp = Snap('#svgout');
		var banner = Snap.load('banner.svg', function(el){
			snp.append(el);
			snp.select('#layer1').hover(hoverin, hoverout);
		});
	});
})(jQuery);
