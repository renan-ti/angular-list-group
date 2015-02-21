'use strict';

function ListGroupEditorWidget(root) {

    this.root = root;

    this.listGroup = angular.element(root).find('.list-group').first();

    this.triggerOnAddEvent = function() {
	var a = angular.element(root).find('a').triggerHandler('click');
    }
    this.triggerOnEditEvent = function(elt) {
	this.getEditAction(elt).triggerHandler('click');
    }
    this.triggerOnDeleteEvent = function(elt) {
	this.getDeleteAction(elt).triggerHandler('click');
    }
    this.getItems = function() {
	return this.listGroup.children();
    }

    this.countItems = function() {
	return this.getItems().length;
    }

    this.countChildren = function(elt) {
	return angular.element(elt).children().length;
    }

    this.getActions = function(elt) {
	var actions = [];
	var buttonGroupElt = angular.element(elt).find('.input-group-btn');
	if (buttonGroupElt) {
	    actions = buttonGroupElt.children();
	}
	return actions;
    }
    this.countActions = function(elt) {
	return this.getActions(elt).length;
    }
    this.isEditAction = function(elt) {
	return this.getEditAction(elt).length > 0;
    }
    this.isDeleteAction = function(elt) {
	return this.getEditAction(elt).length > 0;
    }
    this.getEditAction = function(elt) {
	return angular.element(elt).find('i.fa-pencil-square-o').parent();
    }
    this.getDeleteAction = function(elt) {
	return angular.element(elt).find('i.fa-trash-o').parent();
    }
}

describe('listGroupEditor', function() {

    var $compile, $rootScope;

    beforeEach(module('listGroup'));
    beforeEach(module("list-group.tpl.html"));
    beforeEach(module("linked-list-group.tpl.html"));
    beforeEach(module("panel-list-group.tpl.html"));
    beforeEach(module("panel-list-group-title.tpl.html"));
    beforeEach(module("list-group-filter.tpl.html"));
    beforeEach(module('panel-editable-list-group.tpl.html'));

    beforeEach(inject(function(_$compile_, _$rootScope_) {
	$compile = _$compile_;
	$rootScope = _$rootScope_;
    }));

    it('should bind to a model', function() {
	$rootScope.$apply("colors = ['red','green','blue']");
	var element = $compile("<list-group-editor items='colors' />")($rootScope);
	$rootScope.$digest();
	var widget = new ListGroupEditorWidget(element);
	expect(widget.countItems()).toBe(3);
	angular.forEach(widget.getItems(), function(itemElt) {
	    expect(widget.countActions(itemElt)).toBe(2);
	});

    });

    it('should remove delete button when deletable is false', function() {
	$rootScope.$apply("colors = ['red','green','blue']");
	var element = $compile("<list-group-editor items='colors' deletable='false' />")($rootScope);
	$rootScope.$digest();
	var widget = new ListGroupEditorWidget(element);
	angular.forEach(widget.getItems(), function(itemElt) {
	    expect(widget.countActions(itemElt)).toBe(1);
	    expect(widget.isEditAction(widget.getActions(itemElt).first())).toBeTruthy();
	});
    });

    it('should bind deletable callback function', function() {
	$rootScope.$apply("colors = ['red','green','blue']");
	$rootScope.deletableCallbackFn = function(item) {
	    return (item != 'green');
	};
	var element = $compile("<list-group-editor items='colors' deletable='deletableCallbackFn(item)' />")
		($rootScope);
	$rootScope.$digest();
	var widget = new ListGroupEditorWidget(element);
	var items = widget.getItems();
	for ( var i = 0; i < items.length; i++) {
	    var item = items[i];
	    var deleteAction = widget.getDeleteAction(item);
	    var isDisabled = angular.element(deleteAction).attr('disabled') === 'disabled';
	    if (i == 1) {
		expect(isDisabled).toBeTruthy();
	    } else {
		expect(isDisabled).toBeFalsy();
	    }
	}
    });

    it('should remove edit button when editabale is false', function() {
	$rootScope.$apply("colors = ['red','green','blue']");
	var element = $compile("<list-group-editor items='colors' editable='false' />")($rootScope);
	$rootScope.$digest();
	var widget = new ListGroupEditorWidget(element);
	angular.forEach(widget.getItems(), function(itemElt) {
	    expect(widget.countActions(itemElt)).toBe(1);
	    expect(widget.getEditAction(itemElt)).toBeTruthy();
	});
    });

    it('should bind on add event handler', function() {
	$rootScope.$apply("colors = ['red','green','blue']");
	$rootScope.onAddEventHandler = function() {
	}
	spyOn($rootScope, 'onAddEventHandler');
	var element = $compile("<list-group-editor items='colors' on-add='onAddEventHandler()' />")($rootScope);
	$rootScope.$digest();
	var widget = new ListGroupEditorWidget(element);
	widget.triggerOnAddEvent();
	expect($rootScope.onAddEventHandler).toHaveBeenCalled();
    });

    it('should add item', inject(function($q) {
	$rootScope.$apply("colors = ['red','green','blue']");
	$rootScope.onAddEventHandler = function() {
	    var deferred = $q.defer();
	    deferred.resolve('orange');
	    return deferred.promise;
	}
	var element = $compile("<list-group-editor items='colors' on-add='onAddEventHandler()' />")($rootScope);
	$rootScope.$digest();
	var widget = new ListGroupEditorWidget(element);
	widget.triggerOnAddEvent();
	expect(widget.countItems()).toBe(4);
    }));

    it('should bind on delete event handler', function() {
	$rootScope.$apply("colors = ['red','green','blue']");
	$rootScope.onDeleteEventHandler = function() {
	}
	spyOn($rootScope, 'onDeleteEventHandler');
	var element = $compile("<list-group-editor items='colors' on-delete='onDeleteEventHandler(item)' />")(
		$rootScope);
	$rootScope.$digest();
	var widget = new ListGroupEditorWidget(element);
	var redItem = widget.getItems().first();
	widget.triggerOnDeleteEvent(redItem);
	expect($rootScope.onDeleteEventHandler).toHaveBeenCalled();
    });

    it('should delete item', inject(function($q) {
	$rootScope.$apply("colors = ['red','green','blue']");
	$rootScope.onDeleteEventHandler = function(item) {
	    var deferred = $q.defer();
	    deferred.resolve(item);
	    return deferred.promise;
	}
	var element = $compile("<list-group-editor items='colors' on-delete='onDeleteEventHandler(item)' />")(
		$rootScope);
	$rootScope.$digest();
	var widget = new ListGroupEditorWidget(element);
	var redItem = widget.getItems().first();
	widget.triggerOnDeleteEvent(redItem);
	expect(widget.countItems()).toBe(2);
    }));

    it('should bind an edit event handler', function() {
	$rootScope.$apply("colors = ['red','green','blue']");
	$rootScope.onEditEventHandler = function() {
	};
	spyOn($rootScope, 'onEditEventHandler');
	var element = $compile("<list-group-editor items='colors' on-edit='onEditEventHandler(item)' />")($rootScope);
	$rootScope.$digest();
	var widget = new ListGroupEditorWidget(element);
	var redItem = widget.getItems().first();
	widget.triggerOnEditEvent(redItem);
	expect($rootScope.onEditEventHandler).toHaveBeenCalled();
    });

    it('should replace edited item', inject(function($q) {
	$rootScope.$apply("colors = ['red','green','blue']");
	$rootScope.onEditEventHandler = function(item) {
	    var deferred = $q.defer();
	    deferred.resolve('orange');
	    return deferred.promise;
	}
	var element = $compile("<list-group-editor items='colors' on-edit='onEditEventHandler(item)' />")($rootScope);
	$rootScope.$digest();
	var widget = new ListGroupEditorWidget(element);
	var redItem = widget.getItems().first();
	widget.triggerOnEditEvent(redItem);
	expect($.trim(widget.getItems().first().text())).toBe('orange');
    }));

});