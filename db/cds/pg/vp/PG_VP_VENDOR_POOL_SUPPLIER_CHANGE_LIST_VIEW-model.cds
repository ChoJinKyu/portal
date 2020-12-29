namespace pg;	
 
@cds.persistence.exists
entity Vp_Vendor_Pool_supplier_Change_List_View {	
    key tenant_id : String(5) @title: '테넌트ID';
    key company_code : String(10) @title: '회사코드';
    key org_type_code : String(2) @title: '조직유형코드';
    key org_code : String(10) @title: '조작코드';
    key operation_unit_code : String(30) @title: '평가운영단위코드';
    repr_department_code : String(50)   @title: '대표부서코드';
    key vendor_pool_code : String(30) @title: '협력사풀코드';
    higher_level_path : String @title: '상위레벨경로';
    vendor_pool_local_name : String(240) @title: '협력사풀로컬명';
    vendor_pool_english_name : String(240)   @title: '협력사풀영문명';
    key seq : Integer64 @title: '순번';
    asis_supplier_code : String(15) @title: 'As-Is 공급업체 코드';
    asis_supplier_local_name : String(240) @title: 'As-Is 공급업체 명'; 
    asis_supplier_english_name : String(240) @title: 'As-Is 공급업체 영문명';
    asis_supplier_register_status_name : String(240) @title: 'As-Is 공급업체 상태명';
    tobe_supplier_code : String(15) @title: 'To-Be 공급업체 코드';
    tobe_supplier_local_name : String(240) @title: 'To-Be 공급업체 명'; 
    tobe_supplier_english_name : String(240) @title: 'To-Be 공급업체 영문명';
    tobe_supplier_register_status_name : String(240) @title: 'To-Be 공급업체 상태명';
    approval_number : String(50)   @title: '품의번호';
    approval_title : String  @title: '품의제목';
    approval_status : String  @title: '품의상태';
    request_date : String(20)  @title: '품의요청일시';
    write_date : String(20)  @title: '작성일시';
    write_by : String(30)  @title: '작성자';
    changer_empno : String(30) @title: '변경자사번';
}