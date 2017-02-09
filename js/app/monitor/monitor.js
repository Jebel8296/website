app.controller("MonitorServiceCtrl", function ($scope) {
    $scope.services = [];
    $scope.eb = null;

    if ($scope.eb != null) {
        $scope.eb.close();
    }

    $scope.myfilterForDev = function (item) {
        return item.service.substring(0, 4) == 'zm3c'
    }

    $scope.myfilterForTest = function (item) {
        return item.service.substring(0, 5) == '1zm3c'
    }

    $scope.eb = new EventBus('http://10.12.12.199:9999/monitor');
    $scope.eb.onopen = function () {
        $scope.eb.registerHandler('monitor.service', function (err, message) {
            var res = message.body;
            if (res != null) {
                console.log(res);
                $scope.services = res;
                $scope.$apply();
            }
        });
    }
});

app.controller("MonitorMetricsCtrl", function ($scope) {
    $scope.metrics = [];
    $scope.eb = null;

    if ($scope.eb != null) {
        $scope.eb.close();
    }
    $scope.eb = new EventBus('http://10.12.12.199:9999/monitor');
    $scope.eb.onopen = function () {
        $scope.eb.registerHandler('monitor.metrics', function (err, message) {
            var res = message.body;
            if (res != null) {
                $scope.metrics = res;
                $scope.$apply();
            }
        });
    }
});
app.controller("MonitorLogCtrl", function ($scope) {
    $scope.logs = [];
    $scope.eb = null;

    if ($scope.eb != null) {
        $scope.eb.close();
    }
    $scope.eb = new EventBus('http://10.12.12.199:9999/monitor');
    $scope.eb.onopen = function () {
        $scope.eb.registerHandler('monitor.logger', function (err, message) {
            var res = message.body;
            if (res != null) {
                $scope.logs = $scope.logs.concat(res);
                $scope.$apply();
            }
        });
    }
})