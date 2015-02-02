demo
	.controller(
		'ListGroupCtrl',
		[
			'$scope',
			'$q',
			'$timeout',
			'$sce',
			function($scope, $q, $timeout, $sce) {

			    /**
			     * 
			     */
			    $scope.selection01;

			    $scope.selection02;

			    $scope.selection03;

			    $scope.colors = [ 'Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Indigo', 'Violet' ];

			    $scope.colors2 = [ {
				'name' : 'Red',
				'hex' : '#FF0000'
			    }, {
				'name' : 'Orange',
				'hex' : '#FF7F00'
			    } ];

			    $scope.colors3 = [ {
				'label' : 'Red',
				'hex' : '#FF0000'
			    }, {
				'label' : 'Orange',
				'hex' : '#FF7F00'
			    } ];

			    $scope.myLabelFn = function(item) {
				return item.name + ' (' + item.hex + ')';
			    }

			    $scope.mySelectedItems = [];
			    $scope.mySelectedItems01 = [];
			    $scope.mySelectedItems02 = [];

			    // Selection of the 'Red' item is not allowed
			    $scope.beforeSelectionChangeHandler = function(item) {
				return item != 'Red';
			    }

			    $scope.beforeSelectionChangeAsyncHandler = function(item) {
				var deferred = $q.defer();
				var promise = deferred.promise;
				$timeout(function() {
				    deferred.resolve(true);
				}, 500);
				return promise;
			    }

			    $scope.message;
			    $scope.afterSelectionChangeHandler = function(item) {
				$scope.message = "After selection change, " + angular.toJson(item);
			    }
			    $scope.disabled = true;

			    $scope.disableFnHandler = function(item) {
				return item != 'Orange';
			    };

			    $scope.myContextualClass = 'list-group-item-warning';

			    $scope.contextualClassFnHandler = function(item) {
				var clazz = 'list-group-item-success';
				if (item == 'Orange') {
				    clazz = 'list-group-item-warning';
				}
				return clazz;
			    };

			    $scope.filterable = {
				placeholder : 'Filter colors...'
			    };

			    $scope.filterable02 = {
				auto : false
			    };

			    $scope.filterable03 = {
				comparator : 'startsWith'
			    };

			    $scope.filterable04 = {
				comparator : 'startsWith',
				ignoreCase : false
			    };

			    $scope.paintings = [
				    {
					'title' : 'Blue Dancers, c.1899',
					'paintedBy' : 'Edgar Degas',
					'location' : 'Pushkin Museum, Moscow, Russia',
					'year' : 1899,
					'dimensions' : '25.59 inch wide x 25.59 inch high',
					'url' : 'http://www.edgar-degas.org/Blue-Dancers,-c.1899.jpg'
				    },
				    {
					'title' : 'The Dance Class 1873-76',
					'paintedBy' : 'Edgar Degas',
					'location' : 'Musée D\'Orsay, Paris, France',
					'dimensions' : '29.53 inch wide x 33.47 inch high',
					'url' : 'http://www.edgar-degas.org/The-Dance-Class-1873-76.jpg'
				    },
				    {
					'title' : 'Dance Class 1871',
					'paintedBy' : 'Edgar Degas',
					'location' : 'Metropolitan Museum Of Art, Manhattan, New York, U',
					'year' : 1871,
					'dimensions' : '33.47 inch wide x 29.53 inch high',
					'url' : 'http://www.edgar-degas.org/Dance-Class-1871.jpg'
				    },
				    {
					'title' : 'Study for "Elles" (Woman in a Corset) 1896',
					'paintedBy' : 'Henri De Toulouse-Lautrec',
					'year' : 1896,
					'url' : 'http://www.toulouse-lautrec-foundation.org/Study-for-%27Elles%27-(Woman-in-a-Corset)-1896.jpg'
				    },
				    {
					'title' : 'Marcelle Lender Doing The Bolero In Chilperic',
					'paintedBy' : 'Henri De Toulouse-Lautrec',
					'url' : 'http://www.toulouse-lautrec-foundation.org/Marcelle-Lender-Doing-The-Bolero-In-Chilperic.jpg'
				    },
				    {
					'title' : 'Jane Avril Seen from the Back',
					'paintedBy' : 'Henri De Toulouse-Lautrec',
					'url' : 'http://www.toulouse-lautrec-foundation.org/Jane-Avril-Seen-from-the-Back.jpg'
				    },
				    {
					'title' : 'Sand Heaps',
					'paintedBy' : 'Alfred Sisley',
					'dimensions' : '28.74 inch wide x 21.26 inch high',
					'url' : 'http://www.alfredsisley.org/Sand-Heaps.jpg'
				    },
				    {
					'title' : 'Louveciennes or, The Heights at Marly, 1873',
					'paintedBy' : 'Alfred Sisley',
					'location' : 'Musée D\'Orsay, Paris, France',
					'year' : 1873,
					'dimensions' : '18.11 inch wide x 14.96 inch high',
					'url' : 'http://www.alfredsisley.org/Louveciennes-or,-The-Heights-at-Marly,-1873.jpg'
				    },

				    {
					'title' : 'La Grande Rue Argenteuil',
					'paintedBy' : 'Alfred Sisley',
					'dimensions' : '18.11 inch wide x 25.59 inch high',
					'url' : 'http://www.alfredsisley.org/La-Grande-Rue-Argenteuil.jpg'
				    } ];

			    $scope.paintingTemplate = '<div class="row"><div class="col-md-4"><div class="thumbnail"><img ng-src="{{item.url}}" height="100%"></img></div></div><div class="col-md-8"><h4 class="list-group-item-heading">{{item.title}}</h4> <p class="list-group-item-text">{{item.paintedBy}}</p><p class="list-group-item-text">{{item.year}}</p></div></div>';

			    $scope.getPaintingTemplate = function() {
				return $scope.paintingTemplate;
			    }

			    $scope.selectionChangeHandler01 = function(items) {
				$scope.selection01 = items;
			    };
			    $scope.selectionChangeHandler02 = function(items) {
				$scope.selection02 = items;
			    };
			    $scope.selectionChangeHandler03 = function(items) {
				$scope.selection03 = JSON.stringify(items);
			    }
			    /**
			     * 
			     */
			    $scope.resolveContextualClass = function(item) {
				item = item.toLowerCase();
				var mapping = {
				    'green' : 'success',
				    'blue' : 'info',
				    'yellow' : 'warning',
				    'red' : 'danger'
				}
				var clazz = '';
				if (mapping[item]) {
				    clazz = mapping[item];
				}
				return clazz;
			    }

			    $scope.isDisabled = function(item) {
				item = item.toLowerCase();
				return ('green' == item) || ('blue' == item);
			    }

			} ])