namespace dp;

using util from '../../cm/util/util-model';

// 자산
entity Md_Asset {
    key tenant_id            : String(5) not null   @title : '테넌트ID';
    key mold_id              : String(100) not null @title : '금형ID';
        asset_number         : String(100)          @title : '자산번호';
        cust_asset_type_code : String(30)           @title : '고객자산유형코드';
        asset_type_code      : String(30)           @title : '자산유형코드';
        asset_status_code    : String(30)           @title : '자산상태코드';
        acq_department_code  : String(30)           @title : '취득부서코드';
        acq_date             : String(8)            @title : '취득일자';
        acq_amount           : Decimal(20, 2)       @title : '취득금액';
        scrap_date           : String(8)            @title : '폐기일자';
        vendor_1             : String(10)           @title : '1차거래선';
        vendor_2             : String(10)           @title : '2차거래선';	
        vendor_3             : String(10)           @title : '3차거래선';	
        description          : String(200)          @title : '품명';	
        vendor_remark        : String(500)          @title : '벤더 비고';	
        lg_remark            : String(500)          @title : 'LG 비고';	

}

extend Md_Asset with util.Managed;
