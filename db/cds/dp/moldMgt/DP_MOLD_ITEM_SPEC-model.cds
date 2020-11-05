namespace dp;

using util from '../../util/util-model';
using {dp as item} from './DP_MOLD_ITEM-model';

entity Mold_Item_Spec {

    org_code                 : String(3) not null  @title : '사업부코드';
    item_id                  : Integer64 not null  @title : '도번 ID';

    parent: Association to item.Mold_Item_Spec
        on parent.org_code = org_code 
        and parent.item_id = item_id ;

    use_material             : String(100)         @title : '사용 재료';
    inspection               : String(1)           @title : '금형검사 유무( Y:유, N:무 )';
    assy_approval            : String(1)           @title : '조립도 승인';
    request_life             : String(30)          @title : '요구 수명';
    order_qty                : Integer             @title : '주문 수량';
    cav_process_qty          : String(30)          @title : 'MD Cav or PD process';
    die_machine              : String(100)         @title : 'MD 사용기계 / PD press';
    die_form                 : String(100)         @title : 'MD 금형 구조 (TWO:2단 , THREE:3단, ETC:기타) / PD 금형 형식 (TEMP: 단발 , PRO: pRO , TRS: tRS , TPL: TPL, SEM: SEM-PRO , ETC: 기타)';
    md_out_form              : String(100)         @title : 'MD 취출방식';
    md_runner_out            : String(100)         @title : 'MD runner 취출';
    md_under_cut             : String(100)         @title : 'MD Under cut';
    md_runner                : String(100)         @title : 'MD runner';
    md_gate                  : String(100)         @title : 'MD gate';
    md_return_type           : String(100)         @title : 'MD return type';
    md_form_out              : String(100)         @title : 'MD 성형품 취출';
    md_sample_qty            : Integer             @title : 'MD Sample 수량';
    md_hot_runner            : String(100)         @title : 'MD hot runner';
    md_material_cav          : String(100)         @title : 'MD 금형 재질 Cav';
    md_material_core         : String(100)         @title : 'MD 금형 재질 CORE';
    md_material_score        : String(100)         @title : 'MD 금형 재질 S-CORE';
    md_material_slope        : String(100)         @title : 'MD 금형 재질 경사 밀핀';
    pd_material_die          : String(100)         @title : 'PD 금형 재료 DIE';
    pd_material_punch        : String(100)         @title : 'PD 금형 재료 Punch';
    remarks                  : String(500)         @title : '비고';
    gu_ct_or_process         : String(60)          @title : 'C/T OR PROCESS(공정수)';
    gu_top_circle            : String(60)          @title : '상원판';
    gu_bottom_circle         : String(60)          @title : '하원판';
    gu_top_core              : String(60)          @title : '상코어';
    gu_bottom_core           : String(60)          @title : '하코어';
    gu_middle_core           : String(60)          @title : '중코어';
    gu_core                  : String(60)          @title : '코어';
    gu_slide_core            : String(60)          @title : '슬라이트코어';
    gu_cycle_time            : String(60)          @title : '사이클 타임';
    gu_inject_machine        : String(60)          @title : '사출기종';
    gu_top_holder            : String(60)          @title : '상홀더';
    gu_bottom_holder         : String(60)          @title : '하홀더';
    gu_die                   : String(60)          @title : '다이(다이스)';
    gu_stripper              : String(60)          @title : '스트립퍼';
    gu_punch_holder          : String(60)          @title : '펀치홀더';
    gu_punch                 : String(60)          @title : '펀치';
    gu_pad_valve             : String(60)          @title : '받침판';
    gu_pad                   : String(60)          @title : '패드';
    gu_pack_set              : String(60)          @title : '패킹 set';
    gu_pack_meterial         : String(60)          @title : '패킹 재질';
    gu_pack_plate_cm         : String(60)          @title : '파레트두께';
    gu_pack_type             : String(60)          @title : '패킹타입';
    gu_die_flange            : String(60)          @title : '다이 프랜지';
    gu_sp_eys_bolt           : String(60)          @title : '스페어 아이볼트';
    gu_sp_ej_sleeve          : String(60)          @title : '스페어 이젝슬레이브';
    gu_sp_ejector_pin        : String(60)          @title : '스페어 이젝터 핀';
    gu_sp_heater             : String(60)          @title : '스페어 히터';
    gu_sp_speaker_core       : String(60)          @title : '스페어 스피커 코어';
    gu_sp_etc                : String(60)          @title : '스페어 기타';
    gu_sp_etc2               : String(60)          @title : '스페어 기타2';
    gu_sp_p_punch            : String(60)          @title : '스페어 P 펀치';
    gu_sp_b_punch            : String(60)          @title : '스페어 B 펀치';
    gu_sp_spring             : String(60)          @title : '스페어 스프링';
    gu_sp_die_button         : String(60)          @title : '스페어 다이 버튼';
    gu_sp_steam_cap          : String(60)          @title : '스페어 스팀 캡';
    gu_sp_feeder             : String(60)          @title : '스페어 피더';
    gu_sp_ejector            : String(60)          @title : '스페어 이젝터';
    spec_attr1               : String(60)          @title : '월생산량';
    spec_attr2               : String(60)          @title : 'SPEC ATTR2';
    spec_attr3               : String(60)          @title : 'SPEC ATTR3';
    spec_attr4               : String(60)          @title : 'SPEC ATTR4';
    spec_attr5               : String(60)          @title : 'SPEC ATTR5';
    spec_attr6               : String(60)          @title : 'SPEC ATTR6';
    spec_attr7               : String(60)          @title : 'SPEC ATTR7';
    spec_attr8               : String(60)          @title : 'SPEC ATTR8';
    spec_attr9               : String(60)          @title : 'SPEC ATTR9';
    mold_size                : String(50)          @title : '금형SIZE';
    mold_weight              : String(10)          @title : '중량';
    clamping_force           : Integer             @title : 'CLAMPING_FORCE';
    problems_in_injection    : String(512)         @title : 'PROBLEMS_IN_INJECTION';
    hot_runner_maker         : String(2)           @title : '';
    mold_size_wlh            : String(50)          @title : '';
    press_open_size          : String(50)          @title : '';
    press_material_thickness : Integer             @title : '';
    press_material_size      : String(50)          @title : '';


}

extend Mold_Item_Spec with util.Managed;