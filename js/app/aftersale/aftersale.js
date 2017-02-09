app.controller('AfterSaleCtrl', ['$scope', '$rootScope', '$http', '$state', function ($scope, $rootScope, $http, $state) {
    $scope.datatotal = 0;//总条数
    $scope.itemTotal = 6;//每页显示条数
    $scope.pageTotal = 0;
    $scope.paging = true;
    $scope.waitHandleList = [];

    //当前页
    $scope.selPage = 1;
    //每页显示3个页码
    $scope.showpages = 10;
    $scope.beginpage = 1;
    $scope.endpage = 10;


    $scope.status = '0';
    $scope.type = '9';
    $scope.code = '';
    //取数据
    function getAfterData() {
        $scope.pageList = [];
        var post = {
            "service": "zm3c.aftersale.list",
            "channel": "pc",
            "sn": new Date().getTime().toString(),
            "reqData": {
                "uid": 0,
                "pageNum": $scope.selPage,
                "pageSize": $scope.itemTotal,
                "status": $scope.status,
                "type": $scope.type,
                "code": $scope.code
            }
        };
        $http({
            method: 'POST',
            url: "http://192.168.108.171:30030/gateway.do",
            data: post,
            header: {'Content-Type': 'application/json', 'withCredentials': true, languageColumn: 'name_eu'}
        }).success(function (data) {
            if (data.code == 200) {
                $scope.waitHandleList = data.respData.data;
                $scope.pageTotal = data.respData.pages;
                $scope.datatotal = data.respData.total;

                var step = Math.ceil($scope.selPage / $scope.showpages);
                if ($scope.selPage == $scope.endpage) {
                    if ($scope.endpage == $scope.pageTotal) {
                        $scope.beginpage = $scope.endpage - 1;
                    } else {
                        $scope.beginpage = $scope.endpage;
                    }
                    $scope.endpage = $scope.selPage + $scope.showpages - 1;
                } else {
                    $scope.beginpage = step * $scope.showpages - $scope.showpages + 1;
                    $scope.endpage = step * $scope.showpages;
                }
                if ($scope.endpage > $scope.pageTotal) {
                    $scope.endpage = $scope.pageTotal;
                }
                if ($scope.beginpage == 0) {
                    $scope.beginpage = 1;
                }
                for (var i = $scope.beginpage; i <= $scope.endpage; i++) {
                    $scope.pageList.push(i);
                }
            } else {
                $scope.waitHandleList = [];
                $scope.pageList = [];
                $scope.datatotal = 0;
                $scope.pageTotal = 0;
            }
        }).error(function (error) {
            console.log(error);
        })
    }

    getAfterData();
    $scope.submitQuery = function () {
        getAfterData();
    }
    //售后详情并处理
    $scope.toHandle = function (sale) {
        $state.go('app.aftersalehandle', {handleid: sale.aftercode});
    }

    //打印当前选中页索引
    $scope.selectPage = function (page) {
        $scope.selPage = page;
        //不能小于1大于最大
        if (page < 1 || page > $scope.pageTotal) {
            return false;
        }
        getAfterData();
        $scope.isActivePage(page);
    };
    //设置当前选中页样式
    $scope.isActivePage = function (page) {
        return $scope.selPage == page;
    };
    //上一页
    $scope.Previous = function () {
        //不能小于1大于最大
        if ($scope.selPage <= 1) {
            return false;
        }
        $scope.selectPage($scope.selPage - 1);
    }
    //下一页
    $scope.Next = function () {
        //不能小于1大于最大
        if ($scope.selPage >= $scope.pageTotal) {
            return false;
        }
        $scope.selectPage($scope.selPage + 1);
    };
}
]);

app.controller('AfterSaleHandleCtrl', ['$scope', '$rootScope', '$http', '$state', '$stateParams', function ($scope, $rootScope, $http, $state, $stateParams) {
    //取数据
    $scope.waitHandleAftercode = $stateParams.handleid;
    $scope.waitHandleData = {};
    function getAfterInfoData() {
        var post = {
            "service": "zm3c.aftersale.info",
            "channel": "pc",
            "sn": new Date().getTime().toString(),
            "reqData": {"uid": 0, "aftercode": $scope.waitHandleAftercode}
        };
        $http({
            method: 'POST',
            url: "http://192.168.108.171:30030/gateway.do",
            data: post,
            header: {'Content-Type': 'application/json', 'withCredentials': true, languageColumn: 'name_eu'}
        }).success(function (data) {
            if (data.code == 200) {
                $scope.waitHandleData = data.respData;
                $scope.reply = data.respData.reply;
            }
        }).error(function (error) {
            console.log(error);
        })
    }

    getAfterInfoData();

    //提交反馈
    $scope.submitAfterReply = function () {
        if ($scope.reply != null && $scope.reply.length > 300) {
            alert("已超过300个字数限制。");
            return;
        }
        var post = {
            "service": "zm3c.aftersale.accept",
            "channel": "pc",
            "sn": new Date().getTime().toString(),
            "reqData": {
                "uid": $rootScope.uid,
                "aftercode": $scope.waitHandleAftercode,
                "type": 2,
                "reply": $scope.reply
            }
        };
        $http({
            method: 'POST',
            url: "http://192.168.108.171:30030/gateway.do",
            data: post,
            header: {'Content-Type': 'application/json', 'withCredentials': true, languageColumn: 'name_eu'}
        }).success(function (data) {
            if (data.code == 200) {
                alert("提交成功.");
                $state.go('app.aftersalelist');
            }
        }).error(function (error) {
            console.log(error);
        })
    }
    //受理
    $scope.acceptHandle = function () {
        var post = {
            "service": "zm3c.aftersale.accept",
            "channel": "pc",
            "sn": new Date().getTime().toString(),
            "reqData": {"uid": $rootScope.uid, "aftercode": $scope.waitHandleAftercode, "type": 1}
        };
        $http({
            method: 'POST',
            url: "http://192.168.108.171:30030/gateway.do",
            data: post,
            header: {'Content-Type': 'application/json', 'withCredentials': true, languageColumn: 'name_eu'}
        }).success(function (data) {
            if (data.code == 200) {
                alert("受理成功.");
                $state.go('app.aftersalelist');
            }
        }).error(function (error) {
            console.log(error);
        })
    }
    //拒绝受理
    $scope.refuseHandle = function () {
        var post = {
            "service": "zm3c.aftersale.accept",
            "channel": "pc",
            "sn": new Date().getTime().toString(),
            "reqData": {"uid": $rootScope.uid, "aftercode": $scope.waitHandleAftercode, "type": 3}
        };
        $http({
            method: 'POST',
            url: "http://192.168.108.171:30030/gateway.do",
            data: post,
            header: {'Content-Type': 'application/json', 'withCredentials': true, languageColumn: 'name_eu'}
        }).success(function (data) {
            if (data.code == 200) {
                alert("已取消.");
                $state.go('app.aftersalelist');
            }
        }).error(function (error) {
            console.log(error);
        })
    }
}]);