// Gets focus point coordinates from an image - adapt to suit your needs.
(function($) {
	$.fn.jQueryFocuspointHelpertool = function() {
		var container = $(this);
		var image = $(this).children('img.helper-tool-img');
		var $dataAttrInput;
		var $cssAttrInput;
		var $focusPointContainers;
		var $focusPointImages;
		var $helperToolImage;

		//This stores focusPoint's data-attribute values
		container.data = {
			x: 0,
			y: 0,
			w: 0,
			h: 0
		};

		//Initialize Helper Tool
		(function() {

			//Initialize Variables
			$helperToolImage = $('img.helper-tool-img, img.target-overlay');
			setImage( $(image).attr("src") );
			/*defaultImage = '../img/city_from_unsplash.jpg';
			$dataAttrInput = $('.helper-tool-data-attr');
			$cssAttrInput = $('.helper-tool-css3-val');

			//Create Grid Elements
			for(var i = 1; i < 10; i++) {
				$('#Frames').append('<div id="Frame'+i+'" class="focuspoint"><img/></div>');
			}
			//Store focus point containers
			$focusPointContainers = $('.focuspoint');
			$focusPointImages = $('.focuspoint img');

			//Set the default source image
			setImage( defaultImage );*/

		})();
		
		/*-----------------------------------------*/

		// function setImage(<URL>)
		// Set a new image to use in the demo, requires URI to an image
		
		/*-----------------------------------------*/

		function setImage(imgURL) {
			//Get the dimensions of the image by referencing an image stored in memory
			$("<img/>") 
				.attr("src", imgURL)
				.load(function() {
					container.data.w = this.width;  
					container.data.h = this.height;
					
					//Set src on the thumbnail used in the GUI
					//$helperToolImage.attr('src', imgURL);
					
					//Set src on all .focuspoint images
					//$focusPointImages.attr('src', imgURL);
					
					//Set up initial properties of .focuspoint containers

					/*-----------------------------------------*/
					// Note ---
					// Setting these up with attr doesn't really make a difference
					// added to demo only so changes are made visually in the dom 
					// for users inspecting it. Because of how FocusPoint uses .data()
					// only the .data() assignments that follow are necessary.
					/*-----------------------------------------*/
					/*$focusPointContainers.attr({
						'data-focus-x':container.data.x,
						'data-focus-y':container.data.y,
						'data-image-w': container.data.w,
						'data-image-h': container.data.h
					});*/

					/*-----------------------------------------*/
					// These assignments using .data() are what counts.
					/*-----------------------------------------*/
					/*$focusPointContainers.data('focusX', container.data.x);
					$focusPointContainers.data('focusY', container.data.y);
					$focusPointContainers.data('imageW', container.data.w);
					$focusPointContainers.data('imageH', container.data.h);*/
					
					//Run FocusPoint for the first time.
					//$('.focuspoint').focusPoint();

					//Update the data attributes shown to the user
					//printDataAttr();

				});
		}

		/*-----------------------------------------*/

		// Update the data attributes shown to the user

		/*-----------------------------------------*/
		
		function printDataAttr(){
			$dataAttrInput.val('data-focus-x="'+container.data.x.toFixed(2)+'" data-focus-y="'+container.data.y.toFixed(2)+'" data-focus-w="'+container.data.w+'" data-focus-h="'+container.data.h+'"');
		}

		/*-----------------------------------------*/

		// Bind to helper image click event
		// Adjust focus on Click / provides focuspoint and CSS3 properties
		
		/*-----------------------------------------*/

		$helperToolImage.click(function(e){
		
			var imageW = $(this).width();
			var imageH = $(this).height();
			
			//Calculate FocusPoint coordinates
			var offsetX = e.pageX - $(this).offset().left;
			var offsetY = e.pageY - $(this).offset().top;
			var focusX = (offsetX/imageW - .5)*2;
			var focusY = (offsetY/imageH - .5)*-2;
			container.data.x = focusX;
			container.data.y = focusY;

			//Write values to input
			//printDataAttr();

			//Update focus point
			//updateFocusPoint();

			//Calculate CSS Percentages
			var percentageX = (offsetX/imageW)*100;
			var percentageY = (offsetY/imageH)*100;
			var backgroundPosition = percentageX.toFixed(0) + '% ' + percentageY.toFixed(0) + '%';
			var backgroundPositionCSS = 'background-position: ' + backgroundPosition + ';';
			//$cssAttrInput.val(backgroundPositionCSS);

			//Leave a sweet target reticle at the focus point.
			$('.reticle').css({ 
				'top':percentageY+'%',
				'left':percentageX+'%'
			});
		});
		
		/*-----------------------------------------*/

		// Change image on paste/blur
		// When you paste an image into the specified input, it will be used for the demo

		/*-----------------------------------------*/
		
		$('input.helper-tool-set-src').on('paste blur', function(e){
		  var element = this;
		  setTimeout(function () {
		    var text = $(element).val();
			setImage(text);
		  }, 100);
		});

		/*-----------------------------------------*/

		/* Update Helper */
		// This function is used to update the focuspoint 

		/*-----------------------------------------*/
		
		function updateFocusPoint(){
			/*-----------------------------------------*/
			// See note in setImage() function regarding these attribute assignments.
			//TLDR - You don't need them for this to work.
			/*-----------------------------------------*/
			$focusPointContainers.attr({
				'data-focus-x': container.data.x,
				'data-focus-y': container.data.y
			});
			/*-----------------------------------------*/
			// These you DO need :)
			/*-----------------------------------------*/
			$focusPointContainers.data('focusX', container.data.x);
			$focusPointContainers.data('focusY', container.data.y);
			$focusPointContainers.adjustFocus();
		};

		/*-----------------------------------------*/

		/* Update Helper */
		// This function is used to get the focuspoint attributes

		/*-----------------------------------------*/

		container.getFocusPointAttr = function(){
			return this.data;
		}

		return container;
	};
})(jQuery);