
        //dev20201538
        //rightTable imsi table Material
        _imsionMaterialDetailFilter : function(){
            
            //left table 에서 전달 받은 값을 가져온다. mi_material_code
            var mIMatCategListViewParameters1 = {
                "tenant_id": "L2100",
                "company_code": "*",
                "org_type_code":  "BU",
                "org_code": "BIZ00100",
                "mi_material_code":"A001-01-01",
                "mi_material_name":"원유1",
                "currency_unit":"USD",
                "quantity_unit":"TON",
                "exchange":"ICIS",
                "termsdelv":"",
                "mi_date": new Date(),
                "amount" : 500             
            };       
            
            var mIMatCategListViewParameters2 = {
                "tenant_id": "L2100",
                "company_code": "*",
                "org_type_code":  "BU",
                "org_code": "BIZ00100",
                "mi_material_code":"A001-01-02",
                "mi_material_name":"원유2",
                "currency_unit":"USD",
                "quantity_unit":"TON",
                "exchange":"ICIS",
                "termsdelv":"",
                "mi_date": new Date(),
                "amount" : 500             
            };  

            var mIMatCategListView = new JSONModel([mIMatCategListViewParameters1, mIMatCategListViewParameters2]);
            this.getOwnerComponent().setModel(mIMatCategListView, "mIMatCategListView");
            //this.onMaterialDialog_close();
        },