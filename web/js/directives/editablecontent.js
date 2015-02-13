TradeZ.directive('contenteditable', [function() {
  	return {
  		restrict: 'A', // only activate on element attribute
  		require: '?ngModel', // get a hold of NgModelController
  		link: function(scope, element, attrs, ngModel) {
			// if (!ngModel) return; // do nothing if no ng-model

			element.bind('blur', function() {
                scope.$apply(function() {
                    ngModel.$setViewValue(element.html());

                    if (attrs['onupdate']) {
                    	scope[attrs['onupdate']]()
                    }
                });
            });

            // model -> view
            ngModel.$render = function() {
                element.html(ngModel.$viewValue);
            };

            // load init value from DOM
            // ngModel.$setViewValue(element.html());

			// Defend against Carriage returns
			if (attrs['nocr']) {
				element.on('keydown', function(e) {
					if (e.keyCode == 13) {

						angular.element(this).blur();
						return false;
					}
					return true;
				});
			}

			// Register events and a callback for updating.
			// onupdate="<scope function name>"
			// bindevents="blur keydown change focus ..."
			// if (attrs['onupdate']) {
			// 	element.on((attrs['bindevents']) ? attrs['bindevents'] : 'blur keyup change', function(e) {

			// 		scope[attrs['onupdate']](element, element.text());
		 //  		});
			// }
  		}
  	}
}]);