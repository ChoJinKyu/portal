sap.ui.define([
    "./AbstractModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (JSONModel, Filter, FilterOperator) {
    "use strict";

    var STATE_COL = "_row_state_";

    var TreeListModel = JSONModel.extend("ext.lib.model.TreeListModel", {

        constructor: function (model) {
            this.model = model;
        },

        convToJsonTree: function (oData) {
            var tree = {}, data = oData.results;
            data.map(function (d) {
                d["level"] = d.path.split("/").length - 1;
                d["nodes"] = [];
                return d;
            });
            // 0
            tree = data.reduce(function (t, d) {
                if (d.level == 0) t.push(d);
                return t;
            }, []);
            // 1
            tree = data.reduce(function (t, d) {
                if (d.level == 1) {
                    t.map(function (t0) {
                        if (t0.node_id == d.parent_id) {
                            t0.nodes.push(d);
                        }
                        return t0;
                    });
                }
                return t;
            }, JSON.parse(JSON.stringify(tree)));
            // 2
            tree = data.reduce(function (t, d) {
                if (d.level == 2) {
                    t.map(function (t0) {
                        t0.nodes.map(function (t1) {
                            if (t1.node_id == d.parent_id) {
                                t1.nodes.push(d);
                            }
                            return t1;
                        });
                        return t0;
                    });
                }
                return t;
            }, JSON.parse(JSON.stringify(tree)));
            // 3
            tree = data.reduce(function (t, d) {
                if (d.level == 3) {
                    t.map(function (t0) {
                        t0.nodes.map(function (t1) {
                            t1.nodes.map(function (t2) {
                                if (t2.node_id == d.parent_id) {
                                    t2.nodes.push(d);
                                }
                                return t2;
                            });
                            return t1;
                        });
                        return t0;
                    });
                }
                return t;
            }, JSON.parse(JSON.stringify(tree)));
            // 4
            tree = data.reduce(function (t, d) {
                if (d.level == 4) {
                    t.map(function (t0) {
                        t0.nodes.map(function (t1) {
                            t1.nodes.map(function (t2) {
                                t2.nodes.map(function (t3) {
                                    if (t3.node_id == d.parent_id) {
                                        t3.nodes.push(d);
                                    }
                                    return t3;
                                });
                                return t2;
                            });
                            return t1;
                        });
                        return t0;
                    });
                }
                return t;
            }, JSON.parse(JSON.stringify(tree)));
            // 5
            tree = data.reduce(function (t, d) {
                if (d.level == 5) {
                    t.map(function (t0) {
                        t0.nodes.map(function (t1) {
                            t1.nodes.map(function (t2) {
                                t2.nodes.map(function (t3) {
                                    t3.nodes.map(function (t4) {
                                        if (t4.node_id == d.parent_id) {
                                            t4.nodes.push(d);
                                        }
                                        return t4;
                                    });
                                    return t3;
                                });
                                return t2;
                            });
                            return t1;
                        });
                        return t0;
                    });
                }
                return t;
            }, JSON.parse(JSON.stringify(tree)));
            return tree;
        },

        read: function (path, parameters) {
            var that = this;
            return new Promise(function (resolve, reject) {
                that.model.read(path, jQuery.extend(parameters, {
                    success: resolve,
                    error: reject
                }));
            }).then(function (oData) {
                // filter
                var filters = parameters.filters;
                // 검색조건 및 결과가 없는 경우 종료
                if (filters.filter(function(f) { return f.sPath === 'keyword' }).length <= 0
                    ||
                    !oData || !(oData.results) || oData.results.length <= 0) {
                    return that.convToJsonTree(oData);
                }
                // Hierachy 관련 node_id만을 필터링한다.
                var predicates = oData.results
                    // PATH를 분리한다.
                    .reduce(function (acc, e) {
                        return [...acc, ...((e["path"]).split("/"))];
                    }, [])
                    // 중복을 제거한다.
                    .reduce(function (acc, e) {
                        return acc.includes(e) ? acc : [...acc, e];
                    }, [])
                    .reduce(function (acc, e) {
                        return [...acc, new Filter({
                            path: 'node_id', operator: FilterOperator.EQ, value1: e
                        })];
                    }, [
                        // new Filter({
                        //     path: 'language_code', operator: FilterOperator.EQ, value1: 'KO'
                        // })
                    ]);

                // 필터링된 Node 만을 호출한다.
                return new Promise(function (resolve, reject) {
                    that.model.read(path, jQuery.extend(parameters, {
                        filters: [...predicates],
                        success: resolve,
                        error: reject
                    }))
                }).then(function (oData) {
                    return that.convToJsonTree(oData);
                });
            })
        }
    });
    return TreeListModel;
});