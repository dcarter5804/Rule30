'use strict';

angular.module('Rule30.modal', [])
	.service('Modal', function ($modal){
		var modalDefaults = {
				backdrop: true,
	            keyboard: true,
	            modalFade: true,
	            templateUrl: 'app/partials/modals/modal.html'
		};

		var modalOptions = {
	            closeButtonText: 'Close',
	            actionButtonText: 'OK',
	            headerText: 'Proceed?',
	            bodyText: 'Perform this action?'
		};

		this.showModal = function (customModalDefaults, customModalOptions) {
			if (!customModalDefaults) customModalDefaults = {};
			customModalDefaults.backdrop = 'static';
			return this.show(customModalDefaults, customModalOptions);
		};
		
		this.show = function (customModalDefaults, customModalOptions) {
            //Create temp objects to work with since we're in a singleton service
            var tempModalDefaults = {};
            var tempModalOptions = {};

            //Map angular-ui modal custom defaults to modal defaults defined in service
            angular.extend(tempModalDefaults, modalDefaults, customModalDefaults);

            //Map modal.html $scope custom properties to defaults defined in service
            angular.extend(tempModalOptions, modalOptions, customModalOptions);

            // Assign the click handlers for the dynamice buttons
            if (!tempModalDefaults.controller) {
                tempModalDefaults.controller = function ($scope, $modalInstance) {
                    $scope.modalOptions = tempModalOptions;
                    
                    $scope.handleClick = function (index) {
                    	tempModalOptions.buttons[index].onClick.action($modalInstance);
                    }
                  
                    var stop = 1;
                }
            }

            return $modal.open(tempModalDefaults).result;
        };
 });
