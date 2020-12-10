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
    filter : {   //마스터에서 전달 받음값
        tenant_id : "L2100",
        company_code : "*",
        org_type_code : "BU",
        org_code : "BIZ00100",
        material_code : "ERCA00006AA",
        supplier_code : "KR00008",
        mi_material_code : "COP-001-01"
    },
    serviceName : {
        mIMaterialCodeBOMManagement: "/MIMaterialCodeBOMManagement",  //(main 동일 )자재리스트                
        mIMaterialPriceManagement: "/MIMaterialPriceManagement",  //시황자재리스트
        mIMaterialPriceManagementView: "/MIMaterialPriceManagementView",  // midList MIMaterialPriceManagementView
        orgTenantView: "/OrgTenantView", //관리조직 View
        currencyUnitView : "/CurrencyUnitView", //통화단위 View
        mIMaterialCodeList : "/MIMaterialCodeList", //자재코드 View
        unitOfMeasureView : "/UnitOfMeasureView", //수량단위 View
        enrollmentMaterialView : "/EnrollmentMaterialView", //서비스 안됨 자재코드  등록View
        enrollmentSupplierView : "/EnrollmentSupplierView", //공급업체  등록View
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
    midObjectData : { //mid 페이지에서 새롭게 부여받은값
        tenant_id: "L2100",
        company_code: "*",
        org_type_code: "BU",
        org_code: "BIZ00100",
        material_code: "ERCA00006AA", //자재코드 (시황자재코드와 다름 값이 있다면 View Mode)
        create_user_id: "Admin",
        system_create_dtm: "Admin"
    },
    processMode : {
        create : "C", //신규, 
        view : "V",   //보기
        edit : "E"    //수정
    },
    pageMode : {
        edit : "Edit", //Change Fragment 호출 상태
        show : "Show"  //Edit Fragment 호출 상태
    },
    itemMode : {
        create : "C",  //테이블 아이템 신규등록
        read : "R",    //테이블 아이템 기존 존재 데이타 로드
        update : "U",  //업데이트 상태
        delete : "D"   //삭제 상태 
    },
    odataMode : {
        yes : "Y",     //테이블 아이템 이 odata에서 load 한것
        no : "N"       //json 에서 임으로 생성한 아이템
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