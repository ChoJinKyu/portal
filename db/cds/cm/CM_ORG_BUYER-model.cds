namespace cm;

using util from './util/util-model';

entity Org_Buyer {
    key tenant_id : String(5)     not null   @title : '테넌트ID';
    key company_code : String(10) not null   @title : '회사코드';	
    key buyer_empno : String(30)  not null   @title : '구매담당자사번';	
        use_flag : Boolean        not null	 @title : '사용여부';
        erp_employee_id : Decimal  @title : 'ERP EMPLOYEE ID';
}

extend Org_Buyer with util.Managed;
