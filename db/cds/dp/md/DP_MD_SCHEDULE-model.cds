namespace dp;

using util from '../../cm/util/util-model';

entity Md_Schedule {
    key tenant_id         		      : String(5) not null   @title : '테넌트ID';
    key mold_id                       : String(100) @title : '금형ID';
    key mold_develope_date_type_code  : String(30)@title : '금형개발일자유형코드';
    drawing_agreement_date        : String(8) @title : '도면합의일자';
    drawing_confirmed_date        : String(8) @title : '도면확정일자';
    first_production_date         : String(8) @title : '첫번째생산일자';
    first_production_update_date  : String(8) @title : '첫번째생산변경일자';
    second_production_update_date : String(8) @title : '두번째생산변경일자';
    third_production_update_date  : String(8) @title : '세번째생산변경일자';
    fourth_production_update_date : String(8) @title : '네번째생산변경일자';
    fifth_production_update_date  : String(8) @title : '다섯번째생산변경일자';
    inspection_date               : String(8) @title : '검사일자';
    production_complete_date      : String(8) @title : '제작완료일자';

}

extend Md_Schedule with util.Managed;
