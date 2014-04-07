'use strict';

angular.module('Rule30.directives.components', [])
	.directive('triangle', function ($interval) {
		return {
			
			restrict : 'E',
			
			scope : '=',
			
			link : function (scope, element, attrs){				
				
				/* 
				 * Create space to expose functionality to the UI 
				 * TODO: Probably a better way to do this
				*/
				scope.directives = {}
				scope.directives.rule30 = {};
				
				/* Exposed Scope Variables */	
				// Bit profiles
				scope.directives.rule30.bitProfiles = [
				    {left : 1, middle : 1, right : 1, result : 0},
				    {left : 1, middle : 1, right : 0, result : 0},
				    {left : 1, middle : 0, right : 1, result : 0},
				    {left : 1, middle : 0, right : 0, result : 1},
				    {left : 0, middle : 1, right : 1, result : 1},
				    {left : 0, middle : 1, right : 0, result : 1},
				    {left : 0, middle : 0, right : 1, result : 1},
				    {left : 0, middle : 0, right : 0, result : 0}
				];		
				scope.directives.rule30.numOfGenerations = 0;
				scope.directives.rule30.calculatedWidth = 0;
				scope.directives.rule30.oneColor = 'black';
				scope.directives.rule30.zeroColor = 'white';
				
				/* Internal Variables */
				var _Zoom = {
						1 : 20,
						2 : 12,
						3 : 6,
						4 : 5,
						5 : 4,
						6 : 4,
						7 : 3,
						8 : 3,
						9 : 3,
						10 : 3,
						11 : 2,
						12 : 2
					};
				var _AutomationInterval = null;
				var _CellWidth = _Zoom[1];
				var _Middle = 0;
				var _Width = 0;
				var _Generations = [];
				var _DefaultRow = [];
				
				// calculates the width of each cell in the grid				
				function calcWidth(){			
					var zoom = parseInt(scope.directives.rule30.numOfGenerations / 30) + 1,
						zoomedCellWidth = _Zoom[zoom] || 2,
						width = (_Width * zoomedCellWidth) + 1;
								
					_CellWidth = zoomedCellWidth;
					
					console.log(width);
					console.log(zoom);
					console.log(zoomedCellWidth);
					
					return width;
				};
				
				// Clear Array
				function clearData() {
					_Generations = new Array();
					_DefaultRow = new Array();
					_Width = getGenerationWidth();
					_Middle = getMiddle();
					scope.directives.rule30.calculatedWidth = calcWidth();
				}
				
				// Start the automation
				scope.directives.rule30.startAutomation = function () {
					_AutomationInterval = $interval(function () {
						scope.directives.rule30.numOfGenerations = parseInt(scope.directives.rule30.numOfGenerations) + 1;
						scope.directives.rule30.calcRule30();
					},10);
				}
				
				// Stop the automation
				scope.directives.rule30.stopAutomation = function () {
					$interval.cancel(_AutomationInterval);
				}
				
				// Reset the interface
				scope.directives.rule30.reset = function () {
					scope.directives.rule30.numOfGenerations = 0;
					scope.directives.rule30.stopAutomation();
					clearData();					
				}
				
				// Iterate through the generations and populate the generations array
				scope.directives.rule30.calcRule30 = function () {
					
					clearData();	
					
					createDefaultRow();
					
					for(var i=0; i < scope.directives.rule30.numOfGenerations; i++){
						
						// Clone that default array of 0's
						var newRow = _DefaultRow.slice(0);
						
						// If its the first generation, add the black cell to the middle
						if(i == 0){
							newRow[_Middle] = 1;
						}
						
						// Else, populate the generation according to the previous generation
						else{
							createGeneration({
								newRow : newRow,
								generation : i
							});
						}
						
						// push the populated row to the generations array
						_Generations.push(newRow);	
					}	
					
					// For Speed!
					legacyRender();
				}
				
				// Render using "raw" javascript dom manipulation to increase rendering speed
				function legacyRender(){					
					// Grab a reference to the DOM object the graph will live in
					var pyramidContainer = document.getElementById('pyramid-container');
					
					// Clear that element
					pyramidContainer.innerHTML ="";
					
					// Create a row for each generation
					for(var i=0;i<_Generations.length;i++){
						var generation = _Generations[i];
						var generationDiv = document.createElement('div');
						
						// Create a cell for each cell...
						for(var j=0;j<generation.length;j++){
							// Add the appropriate styles to the cell
							var cell = generation[j];
							var cellDiv = document.createElement('div');
							var color = (cell == 0) ? scope.directives.rule30.zeroColor : scope.directives.rule30.oneColor;
							var style = 'height:' + _CellWidth + 'px;' +
										'width:'  + _CellWidth + 'px;' + 
										'background-color:' + color;
															
							cellDiv.className = 'inline cell';
							cellDiv.setAttribute('style', style);					
							
							// Add the cell to the row
							generationDiv.appendChild(cellDiv);
						}				
						
						// Add the row to the graph contianer
						pyramidContainer.appendChild(generationDiv);				
					}
				}
				
				// iterate through each cell of a generation and populate it based on prev generation
				function createGeneration(opts){
					// Get the previous generation
					var prevRow = _Generations[opts.generation-1];
					
					// Iterate through each cell of the new generation
					for(var i = 0; i < _Width; i++){
						// Get the current cells profile
						var currentProfile = getProfile({
								row : prevRow,
								index : i
							});		
						
						// Get the value of the current profile
						var value = getProfileValue(currentProfile);		
						
						// set the current rows value
						opts.newRow[i] = value;
					}
				}

				// Based on the incoming profile, determine the value
				function getProfileValue(profile){
					
					var matchingValue = null;
					
					// Iterate through the 8 bit profiles.  If they match the current profile return that value
					for(var i=0; i < scope.directives.rule30.bitProfiles.length; i++){
						if	(	
								scope.directives.rule30.bitProfiles[i].left   == profile.left &&
								scope.directives.rule30.bitProfiles[i].middle == profile.middle &&
								scope.directives.rule30.bitProfiles[i].right  == profile.right 
							){			
							matchingValue = scope.directives.rule30.bitProfiles[i].result;			
						}
					}
					
					return matchingValue;
				}
				
				// Get the current profile based on the incoming previous generation and index
				function getProfile(opts){
					return {
						left   : opts.row[opts.index - 1] || 0,
						middle : opts.row[opts.index] || 0,
						right  : opts.row[opts.index + 1] || 0,
					}
				}

				// Populate the variable that holds and empty row (row of all 0's)
				function createDefaultRow() {
					_DefaultRow = new Array();
					for(var i=0; i < _Width; i++){
						_DefaultRow[i] = 0;
					}
				}
				
				// Calculate the width of the grid
				function getGenerationWidth() {
					var width = (scope.directives.rule30.numOfGenerations * 2) - 1;
					return width;
				}
				
				// Calculate the middle of the grid
				function getMiddle() {
					var middle = parseInt(_Width/2);
					return middle;
				}
			}
			
		}
	})
	// Renders a bit profile and allows the user to change its on or off state
	.directive('bitProfile', function () {
		return {
			scope : '=',
			
			restrict : 'E',
			
			templateUrl : 'partials/bit_profile.html',
			
			link : function (scope, elem, attrs) {
				
				/* 
				 * Create space to expose functionality to the UI 
				 * TODO: Probably a better way to do this
				*/
				scope.directives = {}
				scope.directives.rule30 = {};
				
				// Set the color of the profile cell based on 0 || 1
				scope.directives.rule30.setProfileColor = function(value){
					var klass = (value == 0) ? 'white' : 'black';
					return klass;
				}
				
				// Toggle the value of the bit				
				scope.directives.rule30.toggleProfileIndicator = function (profile) {
					var value = (profile.result) ? 0 : 1;
					profile.result = value;
				}
			}
		}
	});;