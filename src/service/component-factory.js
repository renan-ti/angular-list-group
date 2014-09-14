angularListGroupServices.factory('listGroupComponentFactory', function($templateCache) {

    var SIZE_CLASSNAME_MAP = {
	'small' : 'input-group-sm',
	'large' : 'input-group-lg'
    };

    return {
	resolveSizeClassName : function(size) {
	    var classname;
	    if (angular.isDefined(SIZE_CLASSNAME_MAP[size])) {
		classname = SIZE_CLASSNAME_MAP[size];
	    }
	    return classname;
	},
	createPanelBody : function() {
	    return angular.element('<div class="panel-body"></div>');
	},
	createInputGroup : function() {
	    return angular.element('<div class="input-group-btn"></div>');
	},
	createButton : function(glyphiconClassName) {
	    var btn = angular.element('<button class="btn btn-default"></button>');
	    var icon = this.createIcon(glyphiconClassName);
	    if (icon != null) {
		btn.append(icon);
	    }
	    return btn;
	},
	createIcon : function(glyphiconClassName) {
	    var elt = null;
	    if (angular.isDefined(glyphiconClassName)) {
		elt = angular.element('<span class="glyphicon ' + glyphiconClassName + '"></span>');
	    }
	    return elt;
	},
	addHasError : function(elt) {
	    angular.element(elt).addClass('has-error');
	},
	/**
	 * Returns <code>true</code> if the panel element has a body,
	 * <code>false</code> otherwise
	 * 
	 * @param panel
	 * @returns <code>true</code> if the panel element has a body,
	 *          <code>false</code> otherwise
	 */
	hasBody : function(panel) {
	    var hasBody = false;
	    var children = panel.children();
	    for ( var i = 0; i < children.length; i++) {
		var child = children[i];
		if (hasBody = angular.element(child).hasClass("panel-body")) {
		    break;
		}
	    }
	    return hasBody;
	}
    }

});