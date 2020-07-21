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
  constructor(server_type, container_type) {
    this.server_type = server_type;
    this.container_type = container_type;
  }




  
}


function generate_total_capex(){

  const server_type = $('#server-type').val()
  const container_type = $('#container-type').val()

  // Grab inputs
  const input = get_input()
  

  // CAPEX Server
  const server = SERVER_TYPE_LIST[server_type];
  const factor = CAPEX_CONTAINER_FACTOR[container_type];
  const capex_server = ( (1000 / server.consumption) * factor  ) * server.price

  // CAPEX Project
  let capex_project = (capex_server + CAPEX_CONTAINER[container_type]) * input.project_size
  if( input.project_size.length == 0){
    capex_project = 0;
  }
  return { server: capex_server, project: capex_project }
}

function generate_monthly_opex(){

  // Grab inputs
  const input = get_input()

  // Monthly OPEX
  if( input.electricity_cost.length == 0 || 
      input.project_size.length == 0){
    return 0;
  }

  const monthly_opex = input.electricity_cost * 24 * 30 * 100 * input.project_size;


  return monthly_opex;
}

function generate_pbp(market_price_usd, hash_rate, opex_monthly, capex_project){
  const server_type = $('#server-type').val()
  const container_type = $('#container-type').val()

  // Grab inputs
  const input = get_input()

  // Monthly OPEX
  if( input.electricity_cost.length == 0 || 
      input.project_size.length == 0 ||
      input.annual_operation_hours.length == 0){
    return 0
  }

  // Project Hashpower
  const server = SERVER_TYPE_LIST[server_type];
  const factor = CAPEX_CONTAINER_FACTOR[container_type];
  const project_hashpower = ( (1000.0 / server.consumption) * factor) * input.project_size * server.hashing;

  // market_price_usd / hash_rate

  // Calculate PBP
  const montly_btc_issued = 6.25 * 6 * 24 * 30;   // BTC obtained in every month
  const yearly_hours = 8760; // hours in a year
  const monthly_project_income_btc = (project_hashpower / hash_rate) * 
                                        montly_btc_issued * 
                                        ( input.annual_operation_hours / yearly_hours); // [BTC]

  const monthly_project_income = monthly_project_income_btc * market_price_usd;
  const monthly_project_profit = monthly_project_income - opex_monthly;
  const pbp = capex_project / monthly_project_profit;


  return pbp;
}
