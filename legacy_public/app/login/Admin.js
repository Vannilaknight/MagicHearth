angular.module('app').factory('Admin', function ($resource) {
    var AdminResource = $resource('/api/admin/:id', {_id: "@id"}, {
        update: {method: 'PUT', isArray: false}
    });

    AdminResource.prototype.isAdmin = function () {
        return this.roles && this.roles.indexOf('admin') > -1;
    };

    return AdminResource;
});