
        dateFormatter: DateFormatter,
        dataPath : "resources",
        _m : {
            page : "page",
            fragementPath : {
                change : "pg.mm.view.Change",
                display : "pg.mm.view.Display",
                materialDetail : "pg.mm.view.MaterialDetail",
                materialDialog : "pg.mm.view.MaterialDialog",
                supplierDialog : "pg.mm.view.SupplierDialog"
            },            
            fragementId : {
                change : "Change_ID",
                display : "Display_ID",
                materialDetail : "MaterialDetail_ID",
                materialDialog : "MaterialDialog_ID",
                supplierDialog : "SupplierDialog_ID"
            },
            input : {
                inputMultiInput : "multiInput",
            },
            button : {
                buttonMidTableCreate : "buttonMidTableCreate",
                buttonMidTableDelete : "buttonMidTableDelete",
                buttonMidDelete: "buttonMidDelete",
                buttonMidEdit: "buttonMidEdit",
                buttonSave: "buttonSave"
            },
            tableItem : {
                items : "items" //or rows
            },
            filter : {
                tenant_id : "L2100",
                company_code : "company_code",
                org_type_code : "org_type_code",
                org_code : "org_code"
            },
            serviceName : {
                mIMaterialPriceManagementView: "/MIMaterialPriceManagementView",
                orgTenantView: "/OrgTenantView",
            },
            jsonTestData : {
                values : [{
                    name : "tenant",
                    value : "/tenant.json"
                },{
                    name : "company",
                    value : "/company.json"
                }]
            },
            midObjectData : {
                tenant_id: "L2100",
                company_code: "*",
                org_type_code: "BU",
                org_code: "BIZ00100",
                material_code: "ERCA00006AA", //자재코드 (시황자재코드와 다름 값이 있다면 View Mode)
                create_user_id: "Admin",
                system_create_dtm: "Admin"
            },
            processMode : {
                create : "C",
                view : "V",
                edit : "E"
            },
            pageMode : {
                edit : "Edit",
                show : "Show"
            },
            itemMode : {
                create : "C",
                read : "R",
                update : "U",
                delete : "D"
            },
            odataMode : {
                yes : "Y",
                no : "N" 
            },
            midObjectView : {
                busy: true,
                delay: 0,
                pageMode: "V"
            }
        },

        _sso : {
            user : {
                id : "Admin",
                name : "Hong Gil-dong"
            },
            dept : {
                team_name : "구매팀",
                team_code : "0000",
                tenant_id : "L2100",
                tenant_name : "LG 화확"  
            }          
        },

/*
      //담당자 selectedItem selectedRow            
      var aTokens = this.getView().byId("multiinputUser").getTokens();
      var multiinputUser = aTokens.map(function (oToken) {
        return oToken.getKey();
      }).join(",");


  //Active 0 Active, 1 In Active
      var oRadioSelectIndex = oModel.getProperty("/radioActive");
      oRadioSelectIndex = parseInt(oRadioSelectIndex);
      oView.byId("radioActive").setSelectedIndex(oRadioSelectIndex);

==================================================== set
    _setSetData: function () {
      console.group("_setSetData");
      var oView = this.getView(),
        oModel = this.getOwnerComponent().getModel("odata");

      //oModel = sap.ui.core.getModel("odata");
      console.dir(oModel);

      //구분
      oView.byId("comboBoxType").setSelectedKey(oModel.getProperty("/comboBoxType"));

      //시나리오
      oView.byId("comboboxScenario").setSelectedKey(oModel.getProperty("/comboboxScenario"));

      //Active 0 Active, 1 In Active
      var oRadioSelectIndex = oModel.getProperty("/radioActive");
      oRadioSelectIndex = parseInt(oRadioSelectIndex);
      oView.byId("radioActive").setSelectedIndex(oRadioSelectIndex);

      //구매유형
      oView.byId("comboBoxRawMaterials").setSelectedKey(oModel.getProperty("/comboBoxRawMaterials"));

      //회사
      oView.byId("comboboxOffice").setSelectedKey(oModel.getProperty("/comboboxOffice"));

      //법인
      oView.byId("conboBoxNatioinStatus").setSelectedKey(oModel.getProperty("/conboBoxNatioinStatus"));

      //모니터링 목적 
      ///richTextEditor : setValue getValue setEditable setEditorType setRequired setTextDirection setValue
      oView.byId("reMonitoringPurpose").setHeight("150px");

      //remo.setTextDirection("setTextDirection");//oModel.getProperty("/reMonitoringPurpose")
      oView.byId("reMonitoringPurpose").setValue(this._richTextEditor());
      //시나리오 설명
      oView.byId("reMonitoringPurposeDetail").setValue(oModel.getProperty("/reMonitoringPurposeDetail"));
      //운영방식 
      //checkbox getSelected() getText() setSelected() editable

      oView.byId("checkBoxOMType1").setSelected(oModel.getProperty("/checkBoxOMType1"));
      oView.byId("checkBoxOMType2").setSelected(oModel.getProperty("/checkBoxOMType2"));
      oView.byId("checkBoxOMType3").setSelected(oModel.getProperty("/checkBoxOMType3"));

      //소스시스템
      oView.byId("reSourceSystem").setValue(oModel.getProperty("/reSourceSystem"));
      //소스시스템 상세설명
      oView.byId("reSourceSystemDetail").setValue(oModel.getProperty("/reSourceSystemDetail"));



============get

     //조회
      var checkBoxOMType1 = this.byId("checkBoxOMType1").getSelected() == true ? "1" : "0";
      //소명
      var checkBoxOMType2 = this.byId("checkBoxOMType2").getSelected() == true ? "1" : "0";
      //알람
      var checkBoxOMType3 = this.byId("checkBoxOMType3").getSelected() == true ? "1" : "0";

           //pageMode C Create, V View, E Edit
            var midObjectView = new JSONModel({
                busy: true,
                delay: 0,
                pageMode:"V"
            });

            /**
             * Note 사용자 세션이나 정보에 다음값이 셋팅 되어 있다는 가정
             */

            var midObjectData = new JSONModel({
                tenant_id: "L2100",
                company_code: "*",
                org_type_code: "BU",
                org_code: "BIZ00100",
                material_code: "ERCA00006AA" //자재코드 (시황자재코드와 다름 값이 있다면 View Mode)
            });