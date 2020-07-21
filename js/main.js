const SERVER_TYPE_LIST = {
  S17  :  { price: 1440, hashing: 70,  consumption: 2.8 },
  T17  :  { price: 960,  hashing: 58,  consumption: 2.9 },
  S9   :  { price: 53.5, hashing: 10,  consumption: 0.72 },
  S19  :  { price: 2160, hashing: 95,  consumption: 3.3 },
  M20s :  { price: 900,  hashing: 68,  consumption: 3.3 },
  M31s :  { price: 1320, hashing: 76,  consumption: 3.2 },
  M30sPlus :  { price: 2760, hashing: 100, consumption: 3.4 }
}

const CAPEX_CONTAINER = {
  AirCooled: 30000,
  LiquidCooled: 100000
}
const CAPEX_CONTAINER_FACTOR = {
  AirCooled: 1,
  LiquidCooled: 1.3
}


class MeatzeFigures {
  constructor() {
    this.server_type = 0;
    this.container_type = 0;

    // Input parameters
    this.project_size = 0;
    this.electricity_cost = 0;
    this.annual_operation_hours = 0;

    // Output parameters
    this.capex = {};
    this.opex_monthly = 0;
    this.pbp = 0;
  }

  set_configuration(server_type, container_type){
    this.server_type = server_type;
    this.container_type = container_type;
  }

  set_input(project_size, electricity_cost, annual_operation_hours){
    this.project_size = project_size;
    this.electricity_cost = electricity_cost;
    this.annual_operation_hours = annual_operation_hours;
  }

  set_btc_input( ){

  }

  generate_capex() {

    // CAPEX Server
    const server = SERVER_TYPE_LIST[this.server_type];
    const factor = CAPEX_CONTAINER_FACTOR[this.container_type];
    const capex_server = ( (1000 / server.consumption) * factor  ) * server.price
  
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
      this.opex_monthly = this.electricity_cost * 24 * 30 * 100 * this.project_size;
    }
    return this.opex_monthly;
  }
  
  generate_pbp(market_price_usd, hash_rate){
    
    // Monthly OPEX
    if( this.electricity_cost.length == 0 || 
        this.project_size.length == 0 ||
        this.annual_operation_hours.length == 0) {
      this.pbp = 0;
      return this.pbp;
    }
  
    // Project Hashpower
    const server = SERVER_TYPE_LIST[this.server_type];
    const factor = CAPEX_CONTAINER_FACTOR[this.container_type];
    const project_hashpower = ( (1000.0 / server.consumption) * factor) * this.project_size * server.hashing;
  
    // market_price_usd / hash_rate
  
    // Calculate PBP
    const montly_btc_issued = 6.25 * 6 * 24 * 30;   // BTC obtained in every month
    const yearly_hours = 8760; // hours in a year
    const monthly_project_income_btc = (project_hashpower / hash_rate) * 
                                          montly_btc_issued * 
                                          ( this.annual_operation_hours / yearly_hours); // [BTC]
  
    const monthly_project_income = monthly_project_income_btc * market_price_usd;
    const monthly_project_profit = monthly_project_income - this.opex_monthly;
    this.pbp = this.capex.project / monthly_project_profit;
    return this.pbp;
  }
  

  
}
