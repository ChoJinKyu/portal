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