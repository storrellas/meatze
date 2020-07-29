const CAPEX_CONTAINER = {
  AirCooled: 30000,
  LiquidCooled: 100000
}
const CAPEX_CONTAINER_FACTOR = {
  AirCooled: 1,
  LiquidCooled: 1.3
}


const project_size = $('#project-size').val()
const electricity_cost = $('#electricity-cost').val()
const yearly_operation_hours = $('#yearly-hours').val()

class MeatzeInput{
  constructor(project_size, electricity_cost, yearly_operation_hours, 
              server_type, container_type, 
              market_price_usd, hash_rate,
              market_price_usd_delta = 0, hash_rate_delta = 0){
    // User inputs
    this.project_size = project_size;
    this.electricity_cost = electricity_cost;
    this.yearly_operation_hours = yearly_operation_hours;

    // Server type / Container Type
    this.server_type = server_type;
    this.container_type = container_type;

    // Constraints
    this.market_price_usd = market_price_usd;
    this.hash_rate = hash_rate;

    // Scenario
    this.market_price_usd_delta = market_price_usd_delta;
    this.hash_rate_delta = hash_rate_delta;
  }
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

    // Scenario
    this.market_price_usd = 0;
    this.hash_rate = 0;

    // Output parameters
    this.capex = {};
    this.opex_monthly = 0;
    this.pbp = 0;
    this.monthly_project_income = 0;
    this.monthly_project_profit = 0;
  }

  set_configuration(server_type, container_type){
    this.server_type = server_type;
    this.container_type = container_type;
  }

  set_input(project_size, electricity_cost, yearly_operation_hours, scenario){
    this.project_size = project_size;
    this.electricity_cost = electricity_cost;
    this.yearly_operation_hours = yearly_operation_hours;
    this.scenario = scenario;
  }

  set_scenario(market_price_usd, hash_rate){
      this.market_price_usd = market_price_usd;
      this.hash_rate = hash_rate;
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
  
  generate_opex_monthly() {
  
    // Monthly OPEX
    if( this.electricity_cost.length == 0 || 
      this.project_size.length == 0){
      this.opex_monthly = 0;
      return this.opex_monthly;
    }

    // Calculate OPEX
    const year_hours = 8760; // hours in a year
    const factor_operation_hours = this.yearly_operation_hours / year_hours
    this.opex_monthly = this.electricity_cost * 24 * 30 * 1000 * this.project_size * factor_operation_hours;
    return this.opex_monthly;
  }
  
  generate_monthly_project_profit(month_market_price_usd_delta = 100, 
                                  month_hash_rate_delta = 100){
    
    // Monthly OPEX
    if( this.electricity_cost.length == 0 || 
        this.project_size.length == 0 ||
        this.yearly_operation_hours.length == 0) {
      this.monthly_project_profit = 0;
      return this.monthly_project_profit;
    }
  
    // Project Hashpower
    const server = this.server_type_list[this.server_type];
    const factor = CAPEX_CONTAINER_FACTOR[this.container_type];
    const project_hashpower = ( (1000.0 / server.consumption) * factor) * this.project_size * server.hashing;
  
    // Corrected market_price_usd / hash_rate
    const market_price_usd_corrected = this.market_price_usd * (month_market_price_usd_delta / 100);
    const hash_rate_corrected = this.hash_rate * (month_hash_rate_delta / 100);

    // Calculate PBP
    const montly_btc_issued = 6.25 * 6 * 24 * 30;   // BTC obtained in every month
    const year_hours = 8760; // hours in a year
    const monthly_project_income_btc = (project_hashpower / hash_rate_corrected) * 
                                          montly_btc_issued * 
                                          ( this.yearly_operation_hours / year_hours); // [BTC]
  
    this.monthly_project_income = monthly_project_income_btc * market_price_usd_corrected;
    this.monthly_project_profit = this.monthly_project_income - this.generate_opex_monthly();
    return {income: this.monthly_project_income, profit: this.monthly_project_profit};
  }

  
  generate_pbp(market_price_usd_delta = 0, hash_rate_delta = 0) {
    
    // Preconditions
    if( this.electricity_cost.length == 0 || 
        this.project_size.length == 0 ||
        this.yearly_operation_hours.length == 0) {
      return { value: 0, accumulated_profit: 0 }
    }
  
    // Calculate monthtly project profit
    let month = 0
    let pbp = undefined;
    let accumulated_profit = - this.generate_capex().project
    let month_profit_positive = 0;
    let first_accumulated_profit = undefined;
    let evolution = [{profit: 0, income: 0, accumulated: accumulated_profit}]
    for(month = 0; month < 100; month++){
      var month_market_price_usd_delta = 100 + market_price_usd_delta * month;
      var month_hash_rate_delta = 100 + hash_rate_delta * month;
      let output = 
        this.generate_monthly_project_profit(month_market_price_usd_delta, 
                                              month_hash_rate_delta)

        // Check accumulated profit
        accumulated_profit += output.profit;

        evolution.push( {profit: output.profit, income: output.income, accumulated: accumulated_profit})
        if( accumulated_profit > 0 ) {
          month_profit_positive++;
          // copy first accumulated profit
          if( first_accumulated_profit == undefined ) {
            first_accumulated_profit = accumulated_profit;
          } 
        }
        
        if( pbp === undefined && accumulated_profit > 0 ) pbp = month;

        if( month_profit_positive > 12 ) break;
    }

    return { pbp: pbp, 
              first_accumulated_profit: first_accumulated_profit, 
              accumulated_profit: accumulated_profit, 
              evolution: evolution }
  }
  
}
