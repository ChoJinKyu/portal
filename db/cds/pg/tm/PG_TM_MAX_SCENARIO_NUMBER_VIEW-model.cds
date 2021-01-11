namespace pg;

@cds.persistence.exists

entity Tm_Max_Scenario_Number_View {
    key max_scenario_number : Integer  @title : '최대시나리오Number';
}
