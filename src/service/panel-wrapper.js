angularListGroupServices.factory('listGroupPanelWrapper', [ '$templateCache', '$animate',
	function($templateCache, $animate) {

	    return {
		$$panel : null,
		$$inlineEditionform : null,

		wrap : function(elt) {
		    this.$$panel = elt;
		    return this;
		},

		appendInlineCreateForm : function(comp) {
		    if (!this.$$inlineEditionform) {
			this.$$inlineEditionform = comp;
			var children = angular.element(this.$$panel).children();
			for ( var i = 0; i < children.length; i++) {
			    var child = angular.element(children[i]);
			    if (child.hasClass('panel-heading') || child.hasClass('panel-body')) {
				var container = angular.element('<div></div>');
				child.after(container);
				$animate.enter(comp, container).then(function() {
				    console.log("sdlkmfjqsmlkfjdsqlfj");
				});
				break;
			    }
			}
		    }
		    return this;
		},
		removeInlineCreateForm : function() {
		    var removed = false;
		    var that = this;
		    if (this.$$inlineEditionform != null) {
			var container = this.$$inlineEditionform.parent();
			$animate.leave(this.$$inlineEditionform).then(function() {
			    container.remove();
			    that.$$inlineEditionform = null;
			});
		    }
		    return removed;
		},
		focusInlineCreateForm : function() {
		    if (this.$$inlineEditionform != null && this.$$inlineEditionform.find('input')[0]) {
			this.$$inlineEditionform.find('input')[0].focus();
		    }
		    return this;
		},
		setInlineCreateFormOnError : function() {
		    this.$$inlineEditionform.addClass('has-error');
		}
	    }

	} ]);