namespace tmp;
entity bizrule_info {
	key TENANT_ID : String(50) @title: '업무규칙이 적용될 tenant 의 ID';
    key BIZRULE_ID : String(50) @title: '업무규칙의 ID';
    ALT_FLAG : String(50) @title: '업무규칙이 경우에 따라 실행되어야 할 경우 분기할 수 있는 값 (임의로 지정 가능)';
    CALL_TYPE : String(50) @title: '미리 지정된 호출 방식. 위 그림에서는 Call과 Rest만 표시되었으며 필요에 따라 추가할 수 있다. (미리 지정된 값)';
    CALL_HOST : String(1000) @title: '호출될 업무규칙의 Location 정보. (nullable : CALL_TYPE에 따라 사용하지 않을 수 있음)';
    CALL_INFO : String(1000) @title: '업무규칙의 호출에 필요한 값 (java local call 인경우 Package및 Class 명, REST API인 경우 API URL)';
}