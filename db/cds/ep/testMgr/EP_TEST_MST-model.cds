namespace ep;

entity Test_Mst {
    
    key code : Integer not null @title: '테스트 코드';
    code_name : String(30) @title: '테스트 코드명';
    
}