const CAPEX_CONTAINER = {
  AirCooled: 30000,
  LiquidCooled: 100000
}
const CAPEX_CONTAINER_FACTOR = {
  AirCooled: 1,
  LiquidCooled: 1.3
}


class MeatzeFigures {
  constructor(server_type_list) {
    this.server_type_list = server_type_list;
    this.server_type = 0;
    this.container_type = 0;

    // Input parameters
    this.project_size = 0;
    this.electricity_cost = 0;
    this.yearly_operation_hours = 0;

    // Output parameters
    this.capex = {};
    this.opex_monthly = 0;
    this.pbp = 0;
  }

  set_configuration(server_type, container_type){
    this.server_type = server_type;
    this.container_type = container_type;
  }

  set_input(project_size, electricity_cost, yearly_operation_hours){
    this.project_size = project_size;
    this.electricity_cost = electricity_cost;
    this.yearly_operation_hours = yearly_operation_hours;
  }


  generate_capex() {

    // CAPEX Server
    const server = this.server_type_list[this.server_type];
    const factor = CAPEX_CONTAINER_FACTOR[this.container_type];
    const capex_server = ( 1000 / (server.consumption * factor)  ) * server.price
  
    // CAPEX Project
    let capex_project = (capex_server + CAPEX_CONTAINER[this.container_type]) * this.project_size
    if( this.project_size.length == 0){
      capex_project = 0;
    }
    this.capex = { server: capex_server, project: capex_project }
    return this.capex
  }
  
  generate_opex() {
  
    // Monthly OPEX
    if( this.electricity_cost.length == 0 || 
      this.project_size.length == 0){
      this.opex_monthly = 0;
    }else{
      const year_hours = 8760; // hours in a year
      const factor_operation_hours = this.yearly_operation_hours / year_hours
      this.opex_monthly = this.electricity_cost * 24 * 30 * 1000 * this.project_size * factor_operation_hours;
    }
    return this.opex_monthly;
  }
  
  generate_pbp(market_price_usd, hash_rate){
    
    // Monthly OPEX
    if( this.electricity_cost.length == 0 || 
        this.project_size.length == 0 ||
        this.yearly_operation_hours.length == 0) {
      this.pbp = 0;
      return this.pbp;
    }
  
    // Project Hashpower
    const server = this.server_type_list[this.server_type];
    const factor = CAPEX_CONTAINER_FACTOR[this.container_type];
    const project_hashpower = ( (1000.0 / server.consumption) * factor) * this.project_size * server.hashing;
  
    // market_price_usd / hash_rate
  
    // Calculate PBP
    const montly_btc_issued = 6.25 * 6 * 24 * 30;   // BTC obtained in every month
    const year_hours = 8760; // hours in a year
    const monthly_project_income_btc = (project_hashpower / hash_rate) * 
                                          montly_btc_issued * 
                                          ( this.yearly_operation_hours / year_hours); // [BTC]
  
    const monthly_project_income = monthly_project_income_btc * market_price_usd;
    const monthly_project_profit = monthly_project_income - this.opex_monthly;
    this.pbp = this.capex.project / monthly_project_profit;
    return this.pbp;
  }
  

  
}
