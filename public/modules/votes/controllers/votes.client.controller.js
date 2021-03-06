'use strict';

// Votes controller
angular.module('votes').controller('VotesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Votes', 'Ballots',
	function($scope, $stateParams, $location, Authentication, Votes, Ballots) {
		$scope.authentication = Authentication;
		$scope.voteoptions = [];

		// Create new Vote
		$scope.create = function() {
			// Create new Vote object
			var vote = new Votes ({
				name: this.name,
				voteoptions: this.voteoptions
			});

			// Redirect after save
			vote.$save(function(response) {
				$location.path('votes/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Vote
		$scope.remove = function(vote) {
			if ( vote ) { 
				vote.$remove();

				for (var i in $scope.votes) {
					if ($scope.votes [i] === vote) {
						$scope.votes.splice(i, 1);
					}
				}
			} else {
				$scope.vote.$remove(function() {
					$location.path('votes');
				});
			}
		};

		// Update existing Vote
		$scope.update = function() {
			var vote = $scope.vote;

			vote.$update(function() {
				$location.path('votes/' + vote._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Votes
		$scope.find = function() {
			$scope.votes = Votes.query();
		};

		// Find existing Vote
		$scope.findOne = function() {
			$scope.vote = Votes.get({ 
				voteId: $stateParams.voteId
			}, function() {
				$scope.voteoptions = $scope.vote.voteoptions;
			});

			$scope.ballot = 'testt';
		};

		$scope.addOption = function() {
			var id = $scope.voteoptions.length+1;
			$scope.voteoptions.push({
				name: 'option '+id,
				id: id
			});
		};

		$scope.removeOption = function(index) {
			$scope.voteoptions.splice(index, 1);
		};

		$scope.addBallot = function() {
			var ballot = new Ballots({
				choice: $scope.ballot,
				vote: $scope.vote._id
			});
			ballot.$save(function(response) {
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
	}
]);