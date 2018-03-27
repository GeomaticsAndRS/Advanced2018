var rootUrl = baseUrl;

$(function () {
    new Vue({
        el: '#app',
        data: {
            orgStreet: [],//当前用户的街道信息
            orgCommunity: [],//当前用户的社区信息
            orgGrid: [],//当前用户网格信息
            street: '',
            community: '',
            streetList: [],//街道名称
            communityList: [],//社区名称
            gridId: '',
            gridList: [{"gridId": "", "gridName": ""}]
        },
        mounted: function () {
            this.register();
            this.getOrg();
        },
        methods: {
            register: function () {
                $("#viewDiv").on("mousemove", function (e) {
                    $(".tip").css("left", e.pageX + 10);
                    $(".tip").css("top", e.pageY);
                });
            },
            getOrg: function () {
                var self = this;
                self.gridList = [];
                $.ajax({
                    data: {},
                    type: 'get',
                    dataType: 'json',
                    xhrFields: {
                        withCredentials: true
                    },
                    url: rootUrl + 'm/org/n/self/whole',
                    success: function (data) {
                        self.orgStreet.push(data);
                        for (var i = 0; i < self.orgStreet.length; i++) {
                            self.streetList.push(self.orgStreet[i].orgName);
                        }
                    }
                })
            },
            //选择街道，获取社区
            selectStreet: function (streetName) {
                var self = this;
                for (var i = 0; i < self.orgStreet.length; i++) {
                    if (self.orgStreet[i].orgName == streetName) {
                        var subCommunity = self.orgStreet[i].subOrg;
                        if (subCommunity.length > 0) {
                            for (var j = 0; j < subCommunity.length; j++) {
                                self.communityList.push(subCommunity[j].orgName);
                            }
                            self.orgCommunity = subCommunity;
                            self.selectCommunity();
                        } else {
                            self.community = '';
                            self.communityList = [];
                            self.gridList = [];
                        }
                    }
                }
            },
            //选择社区，获取网格
            selectCommunity: function (communityName) {
                var self = this;
                self.gridList = [];
                for (var i = 0; i < self.orgCommunity.length; i++) {
                    if (communityName == self.orgCommunity[i].orgName) {
                        var subGrid = self.orgCommunity[i].subOrg;
                        if (subGrid.length > 0) {
                            for (var j = 0; j < subGrid.length; j++) {
                                self.gridList.push({"gridId": subGrid[j].orgId, "gridName": subGrid[j].orgName});
                            }
                            self.orgGrid = subGrid;
                        } else {
                            self.gridId = '';
                            self.gridList = [];
                        }
                    }
                }
            }
        }
    });
});