import { useState, useRef, useEffect, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, PieChart, Pie, Cell, Legend } from "recharts";

// Storage adapter — uses localStorage for standalone deployment
const storage = {
  async get(key) {
    try { const v = localStorage.getItem(key); return v ? { value: v } : null; } catch { return null; }
  },
  async set(key, value) {
    try { localStorage.setItem(key, value); return { key, value }; } catch { return null; }
  },
  async delete(key) {
    try { localStorage.removeItem(key); return { key, deleted: true }; } catch { return null; }
  }
};

const SEED = {"payroll":[{"title":"Plumber Supervisor","count":14,"base_min":67118,"base_max":132478,"base_avg":117888,"base_med":123538,"ot_avg":3215,"total_min":118565,"total_max":225979,"total_avg":190306,"top5":[{"n":"Cusberto Garay","b":123617,"t":225979},{"n":"John Corcoran","b":132478,"t":213597},{"n":"William Torres","b":130333,"t":210725},{"n":"Joshua Muncie","b":123538,"t":210315},{"n":"David Jaime","b":123538,"t":203919}]},{"title":"Senior Plumber","count":13,"base_min":4506,"base_max":126016,"base_avg":95866,"base_med":100554,"ot_avg":13660,"total_min":6782,"total_max":210537,"total_avg":162421,"top5":[{"n":"David Patron","b":100407,"t":210537},{"n":"Dionicio Banuelos","b":117014,"t":201036},{"n":"Pedro Chacon","b":126016,"t":201016},{"n":"Michael Hladek","b":117163,"t":191992},{"n":"Emilio Rios","b":108838,"t":183996}]},{"title":"Plumber","count":80,"base_min":4326,"base_max":116668,"base_avg":91035,"base_med":106200,"ot_avg":8022,"total_min":5610,"total_max":249822,"total_avg":150288,"top5":[{"n":"Javier Ibarra","b":115931,"t":249822},{"n":"Fernando Martinez","b":116668,"t":218593},{"n":"Robert Zarate","b":105835,"t":205763},{"n":"Gregory Everard","b":106502,"t":199655},{"n":"Lazaro Pina","b":106502,"t":198444}]},{"title":"Plumber Ii - Hiring Hall","count":41,"base_min":2458,"base_max":101242,"base_avg":72977,"base_med":84247,"ot_avg":2548,"total_min":2634,"total_max":116519,"total_avg":81304,"top5":[{"n":"Gefri Rodriguez","b":94677,"t":116519},{"n":"Keith Schwecke","b":95459,"t":109412},{"n":"Alfredo Gonzalez","b":94362,"t":108836},{"n":"Pantaleon Garcia Jr.","b":101242,"t":108029},{"n":"Alberto Colin","b":99614,"t":106547}]},{"title":"Plumber 1 - 4A - Hiring Hall","count":1,"base_min":53649,"base_max":53649,"base_avg":53649,"base_med":53649,"ot_avg":0,"total_min":57519,"total_max":57519,"total_avg":57519,"top5":[{"n":"Angel Vasquez Morales","b":53649,"t":57519}]},{"title":"Plumber 1 - 2A - Hiring Hall","count":1,"base_min":45523,"base_max":45523,"base_avg":45523,"base_med":45523,"ot_avg":895,"total_min":50059,"total_max":50059,"total_avg":50059,"top5":[{"n":"John Hernandez","b":45523,"t":50059}]},{"title":"Plumber 1 - 5A - Hiring Hall","count":2,"base_min":2913,"base_max":60905,"base_avg":31909,"base_med":60905,"ot_avg":0,"total_min":3126,"total_max":65237,"total_avg":34181,"top5":[{"n":"Daniel Gutierrez Mota","b":60905,"t":65237},{"n":"Christopher Salut","b":2913,"t":3126}]}],"pge":[{"cls":"Helicopter Subforeman - GC (Temp)","dept":"Service Center","sap":"50082474","steps":[{"step":"Start","r22":79.92,"r23":82.92,"r24":86.03,"r25":89.26},{"step":"End 6 Mo","r22":81.82,"r23":84.89,"r24":88.07,"r25":91.37}],"min25":89.26,"max25":91.37},{"cls":"Subforeman A - Overhead SME (Temp)","dept":"Service Center","sap":"50430689","steps":[{"step":"Start","r22":76.28,"r23":79.14,"r24":82.11,"r25":85.19},{"step":"End 6 Mo","r22":78.06,"r23":80.99,"r24":84.03,"r25":87.18}],"min25":85.19,"max25":87.18},{"cls":"A - Supervises crews performing highest class of work","dept":"Service Center","sap":"50010180","steps":[{"step":"Start","r22":64.27,"r23":66.68,"r24":69.18,"r25":71.77},{"step":"End 6 Mo","r22":65.8,"r23":68.27,"r24":70.83,"r25":73.49},{"step":"Start","r22":72.65,"r23":75.37,"r24":78.2,"r25":81.13},{"step":"End 6 Mo","r22":74.36,"r23":77.15,"r24":80.04,"r25":83.04}],"min25":71.77,"max25":83.04},{"cls":"Lead Contractor Inspector","dept":"Service Center","sap":"52748619","steps":[{"step":"Start","r22":74.36,"r23":77.15,"r24":80.04,"r25":83.04}],"min25":83.04,"max25":83.04},{"cls":"Underground Subforeman A","dept":"Service Center","sap":"50010178","steps":[{"step":"Start","r22":72.29,"r23":75,"r24":77.81,"r25":80.73},{"step":"End 6 Mo","r22":74.02,"r23":76.8,"r24":79.68,"r25":82.67}],"min25":80.73,"max25":82.67},{"cls":"M&C Coordinator - Electric Transmission","dept":"DCPP Nuclear","sap":"52489846","steps":[{"step":"Start","r22":69.37,"r23":71.97,"r24":74.67,"r25":77.47},{"step":"End 1 Yr","r22":72.57,"r23":75.29,"r24":78.11,"r25":81.04}],"min25":77.47,"max25":81.04},{"cls":"New Business Liaison\u2013Elec Crew Fmn (PIO)","dept":"Service Center","sap":"52574624","steps":[{"step":"Start","r22":69.12,"r23":71.71,"r24":74.4,"r25":77.19},{"step":"End 1 Yr","r22":70.78,"r23":73.43,"r24":76.18,"r25":79.04}],"min25":77.19,"max25":79.04},{"cls":"Apprentice Electrical Technician","dept":"General Construction","sap":"50010396","steps":[{"step":"Start","r22":62.32,"r23":64.66,"r24":67.08,"r25":69.6},{"step":"End 6 Mo","r22":64.13,"r23":66.53,"r24":69.02,"r25":71.61},{"step":"End 1 Yr","r22":65.11,"r23":67.55,"r24":70.08,"r25":72.71},{"step":"End 18 Mo","r22":66.89,"r23":69.4,"r24":72,"r25":74.7},{"step":"End 2 Yr","r22":69.65,"r23":72.26,"r24":74.97,"r25":77.78}],"min25":69.6,"max25":77.78},{"cls":"Technical Crew Leader B - Gas","dept":"Service Center","sap":"50010177","steps":[{"step":"Start","r22":68.68,"r23":71.26,"r24":73.93,"r25":76.7},{"step":"End 6 Mo","r22":69.37,"r23":71.97,"r24":74.67,"r25":77.47}],"min25":76.7,"max25":77.47},{"cls":"M&C Coordinator - Electric","dept":"DCPP Nuclear","sap":"50315043","steps":[{"step":"Start","r22":66.06,"r23":68.54,"r24":71.11,"r25":73.78},{"step":"End 1 Yr","r22":69.12,"r23":71.71,"r24":74.4,"r25":77.19}],"min25":73.78,"max25":77.19},{"cls":"A - Gas In-Service Welding","dept":"Service Center","sap":"51517786","steps":[{"step":"Start","r22":67.49,"r23":70.02,"r24":72.65,"r25":75.37},{"step":"End 6 Mo","r22":69.1,"r23":71.69,"r24":74.38,"r25":77.17}],"min25":75.37,"max25":77.17},{"cls":"DCPP Technical Maintenance Subforeman","dept":"DCPP Nuclear","sap":"50073151","steps":[{"step":"Start","r22":67.2,"r23":69.72,"r24":72.33,"r25":75.04},{"step":"End 1 Yr","r22":68.91,"r23":71.49,"r24":74.17,"r25":76.95}],"min25":75.04,"max25":76.95},{"cls":"Maintenance Subforeman - DCPP","dept":"DCPP Nuclear","sap":"50010197","steps":[{"step":"End 1 Yr","r22":68.91,"r23":71.49,"r24":74.17,"r25":76.95}],"min25":76.95,"max25":76.95},{"cls":"Unassigned Traveling Control Technician (DCPP)","dept":"DCPP Nuclear","sap":"50072955","steps":[{"step":"Rate 3","r22":68.09,"r23":70.64,"r24":73.29,"r25":76.04}],"min25":76.04,"max25":76.04},{"cls":"B - Gas In-Service Welding","dept":"Service Center","sap":"51517784","steps":[{"step":"Start","r22":66.83,"r23":69.34,"r24":71.94,"r25":74.64},{"step":"End 6 Mo","r22":67.49,"r23":70.02,"r24":72.65,"r25":75.37}],"min25":74.64,"max25":75.37},{"cls":"Electric Maintenance Subforeman - DCPP","dept":"DCPP Nuclear","sap":"50073079","steps":[{"step":"Start","r22":67.2,"r23":69.72,"r24":72.33,"r25":75.04}],"min25":75.04,"max25":75.04},{"cls":"A - Gas","dept":"Service Center","sap":"50251366","steps":[{"step":"Start","r22":65.54,"r23":68,"r24":70.55,"r25":73.2},{"step":"End 6 Mo","r22":67.08,"r23":69.6,"r24":72.21,"r25":74.92}],"min25":73.2,"max25":74.92},{"cls":"Tapping Technician","dept":"Service Center","sap":"50258203","steps":[{"step":"Start","r22":65.54,"r23":68,"r24":70.55,"r25":73.2},{"step":"End 6 Mo","r22":67.08,"r23":69.6,"r24":72.21,"r25":74.92}],"min25":73.2,"max25":74.92},{"cls":"Traveling Chemical & Radiation Protection Technician","dept":"DCPP Nuclear","sap":"50010384","steps":[{"step":"End 6 Mo","r22":50.63,"r23":52.53,"r24":54.5,"r25":56.54},{"step":"End 1 Yr","r22":54.37,"r23":56.41,"r24":58.53,"r25":60.72},{"step":"End 18 Mo","r22":58.45,"r23":60.64,"r24":62.91,"r25":65.27},{"step":"End 2 Yr","r22":62.57,"r23":64.92,"r24":67.35,"r25":69.88},{"step":"End 3 Yr","r22":64.31,"r23":66.72,"r24":69.22,"r25":71.82},{"step":"End 4 Yr","r22":66.24,"r23":68.72,"r24":71.3,"r25":73.97}],"min25":56.54,"max25":73.97},{"cls":"Traveling Control Technician (DCPP)","dept":"DCPP Nuclear","sap":"50010392","steps":[{"step":"Rate 2","r22":66.21,"r23":68.69,"r24":71.27,"r25":73.94}],"min25":73.94,"max25":73.94},{"cls":"A - Supervises highest class work including but not limited to","dept":"Service Center","sap":"50010204","steps":[{"step":"Start","r22":64.61,"r23":67.03,"r24":69.54,"r25":72.15},{"step":"End 6 Mo","r22":66.13,"r23":68.61,"r24":71.18,"r25":73.85}],"min25":72.15,"max25":73.85},{"cls":"A - non-climbing","dept":"Service Center","sap":"50251365","steps":[{"step":"Start","r22":64.27,"r23":66.68,"r24":69.18,"r25":71.77},{"step":"End 6 Mo","r22":65.8,"r23":68.27,"r24":70.83,"r25":73.49}],"min25":71.77,"max25":73.49},{"cls":"PIO Subforeman B I&C","dept":"Service Center","sap":"52652049","steps":[{"step":"Start","r22":64.27,"r23":66.68,"r24":69.18,"r25":71.77},{"step":"End 6 Mo","r22":65.8,"r23":68.27,"r24":70.83,"r25":73.49}],"min25":71.77,"max25":73.49},{"cls":"B - Gas","dept":"Service Center","sap":"50251368","steps":[{"step":"Start","r22":64.87,"r23":67.3,"r24":69.82,"r25":72.44},{"step":"End 6 Mo","r22":65.54,"r23":68,"r24":70.55,"r25":73.2}],"min25":72.44,"max25":73.2},{"cls":"Appr Lineman-Helicopter-GC Temp","dept":"Service Center","sap":"50449468","steps":[{"step":"Start","r22":53.03,"r23":55.02,"r24":57.08,"r25":59.22},{"step":"End 6 Mo","r22":54.59,"r23":56.64,"r24":58.76,"r25":60.96},{"step":"End 1 Yr","r22":56.25,"r23":58.36,"r24":60.55,"r25":62.82},{"step":"End 2 Yr","r22":59.69,"r23":61.93,"r24":64.25,"r25":66.66},{"step":"End 30 Mo","r22":61.48,"r23":63.79,"r24":66.18,"r25":68.66},{"step":"End 3 Yr","r22":63.3,"r23":65.67,"r24":68.13,"r25":70.68},{"step":"End 42 Mo","r22":65.2,"r23":67.65,"r24":70.19,"r25":72.82}],"min25":59.22,"max25":72.82},{"cls":"Unassigned Control Technician (DCPP)","dept":"DCPP Nuclear","sap":"50073010","steps":[{"step":"Rate 1","r22":64.99,"r23":67.43,"r24":69.96,"r25":72.58}],"min25":72.58,"max25":72.58},{"cls":"Drilling Working Foreman B","dept":"Service Center","sap":"50010201","steps":[{"step":"Start","r22":64.22,"r23":66.63,"r24":69.13,"r25":71.72},{"step":"End 6 Mo","r22":64.93,"r23":67.36,"r24":69.89,"r25":72.51}],"min25":71.72,"max25":72.51},{"cls":"DCPP Fire Captain Advanced","dept":"DCPP Nuclear","sap":"51892857","steps":[{"step":"Start","r22":61.47,"r23":63.78,"r24":66.17,"r25":68.65},{"step":"End 6 Mo","r22":64.18,"r23":66.59,"r24":69.09,"r25":71.68},{"step":"End 1 Yr","r22":64.73,"r23":67.16,"r24":69.68,"r25":72.29}],"min25":68.65,"max25":72.29},{"cls":"B - Supervises a crew containing one or more skilled craftsmen","dept":"Service Center","sap":"50010205","steps":[{"step":"Start","r22":63.93,"r23":66.33,"r24":68.82,"r25":71.4},{"step":"End 6 Mo","r22":64.61,"r23":67.03,"r24":69.54,"r25":72.15}],"min25":71.4,"max25":72.15},{"cls":"Unassigned Traveling Certified Welder (DCPP)","dept":"DCPP Nuclear","sap":"50072894","steps":[{"step":"Rate 3","r22":64.3,"r23":66.71,"r24":69.21,"r25":71.81}],"min25":71.81,"max25":71.81},{"cls":"Unassigned Traveling Electrician (DCPP)","dept":"DCPP Nuclear","sap":"50072952","steps":[{"step":"Rate 3","r22":64.3,"r23":66.71,"r24":69.21,"r25":71.81}],"min25":71.81,"max25":71.81},{"cls":"Unassigned Traveling Instrument Repairman (DCPP)","dept":"DCPP Nuclear","sap":"50072893","steps":[{"step":"Rate 3","r22":64.3,"r23":66.71,"r24":69.21,"r25":71.81}],"min25":71.81,"max25":71.81},{"cls":"Unassigned Traveling Machinist (DCPP)","dept":"DCPP Nuclear","sap":"50070784","steps":[{"step":"Rate 3","r22":64.3,"r23":66.71,"r24":69.21,"r25":71.81}],"min25":71.81,"max25":71.81},{"cls":"B - Supervises crews containing skilled craftsman of highest","dept":"Service Center","sap":"50010181","steps":[{"step":"Start","r22":63.64,"r23":66.03,"r24":68.51,"r25":71.08},{"step":"End 6 Mo","r22":64.27,"r23":66.68,"r24":69.18,"r25":71.77}],"min25":71.08,"max25":71.77},{"cls":"B - non-Climbing","dept":"Service Center","sap":"50251367","steps":[{"step":"Start","r22":63.63,"r23":66.02,"r24":68.5,"r25":71.07},{"step":"End 6 Mo","r22":64.27,"r23":66.68,"r24":69.18,"r25":71.77}],"min25":71.07,"max25":71.77},{"cls":"Subforeman B I&C","dept":"Service Center","sap":"52678233","steps":[{"step":"Start","r22":63.64,"r23":66.03,"r24":68.51,"r25":71.08}],"min25":71.08,"max25":71.08},{"cls":"B I&C (Non-Climbing)","dept":"Service Center","sap":"52621301","steps":[{"step":"Start","r22":63.63,"r23":66.02,"r24":68.5,"r25":71.07}],"min25":71.07,"max25":71.07},{"cls":"Apprentice Electrical Tech - GC (PIO)","dept":"General Construction","sap":"52474866","steps":[{"step":"Start","r22":57.1,"r23":59.24,"r24":61.46,"r25":63.76},{"step":"End 6 Mo","r22":57.91,"r23":60.08,"r24":62.33,"r25":64.67},{"step":"End 1 Yr","r22":59.18,"r23":61.4,"r24":63.7,"r25":66.09},{"step":"End 18 Mo","r22":60.88,"r23":63.16,"r24":65.53,"r25":67.99},{"step":"End 2 Yr","r22":63.32,"r23":65.69,"r24":68.15,"r25":70.71}],"min25":63.76,"max25":70.71},{"cls":"C - Gas (PIO)","dept":"Service Center","sap":"50010206","steps":[{"step":"Start","r22":58.06,"r23":60.24,"r24":62.5,"r25":64.84},{"step":"End 6 Mo","r22":63.25,"r23":65.62,"r24":68.08,"r25":70.63}],"min25":64.84,"max25":70.63},{"cls":"Drilling Working Foreman C (PIO)","dept":"Service Center","sap":"50010203","steps":[{"step":"Start","r22":58.06,"r23":60.24,"r24":62.5,"r25":64.84},{"step":"End 6 Mo","r22":63.25,"r23":65.62,"r24":68.08,"r25":70.63}],"min25":64.84,"max25":70.63},{"cls":"Apprentice Gas Technician","dept":"General Construction","sap":"50010415","steps":[{"step":"Start","r22":55.92,"r23":58.02,"r24":60.2,"r25":62.46},{"step":"End 6 Mo","r22":56.73,"r23":58.86,"r24":61.07,"r25":63.36},{"step":"End 1 Yr","r22":57.94,"r23":60.11,"r24":62.36,"r25":64.7},{"step":"End 18 Mo","r22":59.58,"r23":61.81,"r24":64.13,"r25":66.53},{"step":"End 2 Yr","r22":61.47,"r23":63.78,"r24":66.17,"r25":68.65},{"step":"End 30 Mo","r22":63.08,"r23":65.45,"r24":67.9,"r25":70.45}],"min25":62.46,"max25":70.45},{"cls":"Traveling Instrument Repairman (DCPP)","dept":"DCPP Nuclear","sap":"50073058","steps":[{"step":"Rate 2","r22":62.55,"r23":64.9,"r24":67.33,"r25":69.85}],"min25":69.85,"max25":69.85},{"cls":"Traveling Certified Welder (DCPP)","dept":"DCPP Nuclear","sap":"50010439","steps":[{"step":"Rate 2","r22":62.54,"r23":64.89,"r24":67.32,"r25":69.84}],"min25":69.84,"max25":69.84},{"cls":"Traveling Electrician (DCPP)","dept":"DCPP Nuclear","sap":"50010154","steps":[{"step":"Rate 2","r22":62.54,"r23":64.89,"r24":67.32,"r25":69.84}],"min25":69.84,"max25":69.84},{"cls":"Traveling Machinist (DCPP)","dept":"DCPP Nuclear","sap":"50010258","steps":[{"step":"Rate 2","r22":62.54,"r23":64.89,"r24":67.32,"r25":69.84}],"min25":69.84,"max25":69.84},{"cls":"DCPP Fire Captain","dept":"DCPP Nuclear","sap":"50010164","steps":[{"step":"Start","r22":59.09,"r23":61.31,"r24":63.61,"r25":66},{"step":"End 6 Mo","r22":61.78,"r23":64.1,"r24":66.5,"r25":68.99},{"step":"End 1 Yr","r22":62.35,"r23":64.69,"r24":67.12,"r25":69.64}],"min25":66,"max25":69.64},{"cls":"C - Not Gas","dept":"Service Center","sap":"50253775","steps":[{"step":"Start","r22":56.99,"r23":59.13,"r24":61.35,"r25":63.65},{"step":"End 6 Mo","r22":62.05,"r23":64.38,"r24":66.79,"r25":69.29}],"min25":63.65,"max25":69.29},{"cls":"Control Technician (DCPP)","dept":"DCPP Nuclear","sap":"50010391","steps":[{"step":"Start","r22":61.91,"r23":64.23,"r24":66.64,"r25":69.14}],"min25":69.14,"max25":69.14},{"cls":"Apprentice Instrument Technician","dept":"General Construction","sap":"50072866","steps":[{"step":"Start","r22":54.86,"r23":56.92,"r24":59.05,"r25":61.26},{"step":"End 6 Mo","r22":55.63,"r23":57.72,"r24":59.88,"r25":62.13},{"step":"End 1 Yr","r22":56.86,"r23":58.99,"r24":61.2,"r25":63.5},{"step":"End 18 Mo","r22":58.46,"r23":60.65,"r24":62.92,"r25":65.28},{"step":"End 2 Yr","r22":60.3,"r23":62.56,"r24":64.91,"r25":67.34},{"step":"End 30 Mo","r22":61.89,"r23":64.21,"r24":66.62,"r25":69.12}],"min25":61.26,"max25":69.12},{"cls":"Backhoe Operator - Gas","dept":"Service Center","sap":"50010305","steps":[{"step":"Start","r22":52.96,"r23":54.95,"r24":57.01,"r25":59.15},{"step":"End 6 Mo","r22":53.98,"r23":56,"r24":58.1,"r25":60.28},{"step":"End 1 Yr","r22":56.34,"r23":58.45,"r24":60.64,"r25":62.91},{"step":"End 18 Mo","r22":57.36,"r23":59.51,"r24":61.74,"r25":64.06},{"step":"End 2 Yr","r22":59.29,"r23":61.51,"r24":63.82,"r25":66.21},{"step":"End 30 Mo","r22":61.47,"r23":63.78,"r24":66.17,"r25":68.65}],"min25":59.15,"max25":68.65}],"ibew":[{"cls":"General Foreman","wage":81.38,"basis":"1.252 x journeyman","notes":"Pension: $18.12, Health: $16.64, LMCC: $0.55"},{"cls":"Foreman","wage":73.19,"basis":"1.126 x journeyman","notes":"Pension: $18.12, Health: $16.64, LMCC: $0.55"},{"cls":"Journeyman","wage":65,"basis":"","notes":"Pension: $18.12, Health: $16.64, LMCC: $0.55"},{"cls":"Journeyman (Cable Splicing/Welding/NETA +5%)","wage":68.25,"basis":"+5% specialty","notes":"Pension: $18.12, Health: $16.64, LMCC: $0.55"},{"cls":"Apprentice Period 1","wage":26,"basis":"40% of journeyman","notes":"Health: $15.64, LMCC: $0.55"},{"cls":"Apprentice Period 2","wage":29.25,"basis":"45% of journeyman","notes":"Health: $15.64, LMCC: $0.55"},{"cls":"Apprentice Period 3","wage":32.5,"basis":"50% of journeyman","notes":"Pension: $18.12, Health: $16.64, LMCC: $0.55"},{"cls":"Apprentice Period 4","wage":35.75,"basis":"55% of journeyman","notes":"Pension: $18.12, Health: $16.64, LMCC: $0.55"},{"cls":"Apprentice Period 5","wage":39,"basis":"60% of journeyman","notes":"Pension: $18.12, Health: $16.64, LMCC: $0.55"},{"cls":"Apprentice Period 6","wage":42.25,"basis":"65% of journeyman","notes":"Pension: $18.12, Health: $16.64, LMCC: $0.55"},{"cls":"Apprentice Period 7","wage":45.5,"basis":"70% of journeyman","notes":"Pension: $18.12, Health: $16.64, LMCC: $0.55"},{"cls":"Apprentice Period 8","wage":48.75,"basis":"75% of journeyman","notes":"Pension: $18.12, Health: $16.64, LMCC: $0.55"},{"cls":"Apprentice Period 9","wage":52,"basis":"80% of journeyman","notes":"Pension: $18.12, Health: $16.64, LMCC: $0.55"},{"cls":"Apprentice Period 10","wage":55.25,"basis":"85% of journeyman","notes":"Pension: $18.12, Health: $16.64, LMCC: $0.55"}],"lausd":[{"g":20,"label":"Minimum","levels":[{"l":1,"c":68966,"b":74713,"a":88276},{"l":2,"c":69048,"b":74801,"a":88380},{"l":3,"c":69782,"b":75597,"a":89321},{"l":4,"c":70519,"b":76394,"a":90262},{"l":5,"c":70600,"b":76483,"a":90367},{"l":6,"c":70715,"b":76606,"a":90513},{"l":7,"c":72738,"b":78801,"a":93107},{"l":8,"c":74440,"b":80642,"a":95282},{"l":9,"c":77004,"b":83421,"a":98565},{"l":10,"c":79193,"b":85793,"a":101367}]},{"g":21,"label":"+ 14 points","levels":[{"l":1,"c":69048,"b":74801,"a":88380},{"l":2,"c":69782,"b":75597,"a":89321},{"l":3,"c":70519,"b":76394,"a":90262},{"l":4,"c":70600,"b":76483,"a":90367},{"l":5,"c":70715,"b":76606,"a":90513},{"l":6,"c":73440,"b":79563,"a":94006},{"l":7,"c":74440,"b":80642,"a":95282},{"l":8,"c":77773,"b":84253,"a":99548},{"l":9,"c":80011,"b":86678,"a":102413},{"l":10,"c":82673,"b":89563,"a":105822}]},{"g":22,"label":"+ 28 points","levels":[{"l":1,"c":69782,"b":75597,"a":89321},{"l":2,"c":69864,"b":75686,"a":89426},{"l":3,"c":70600,"b":76483,"a":90367},{"l":4,"c":70715,"b":76606,"a":90513},{"l":5,"c":73116,"b":79208,"a":93588},{"l":6,"c":75959,"b":82288,"a":97227},{"l":7,"c":78522,"b":85067,"a":100510},{"l":8,"c":80811,"b":87545,"a":103438},{"l":9,"c":83132,"b":90058,"a":106407},{"l":10,"c":86969,"b":94218,"a":111322}]},{"g":23,"label":"+ 42 points","levels":[{"l":1,"c":69864,"b":75686,"a":89426},{"l":2,"c":70600,"b":76483,"a":90367},{"l":3,"c":70715,"b":76606,"a":90513},{"l":4,"c":73116,"b":79208,"a":93588},{"l":5,"c":75631,"b":81934,"a":96808},{"l":6,"c":78573,"b":85120,"a":100573},{"l":7,"c":81596,"b":88395,"a":104442},{"l":8,"c":83932,"b":90926,"a":107433},{"l":9,"c":86382,"b":93581,"a":110569},{"l":10,"c":91580,"b":99210,"a":117220}]},{"g":24,"label":"+ 56 points","levels":[{"l":1,"c":70600,"b":76483,"a":90367},{"l":2,"c":70715,"b":76606,"a":90513},{"l":3,"c":73116,"b":79208,"a":93588},{"l":4,"c":75631,"b":81934,"a":96808},{"l":5,"c":78573,"b":85120,"a":100573},{"l":6,"c":81645,"b":88447,"a":104504},{"l":7,"c":84782,"b":91846,"a":108519},{"l":8,"c":87216,"b":94483,"a":111636},{"l":9,"c":90207,"b":97723,"a":115463},{"l":10,"c":96037,"b":104042,"a":122929}]},{"g":25,"label":"+ 70 points","levels":[{"l":1,"c":70715,"b":76606,"a":90513},{"l":2,"c":73116,"b":79208,"a":93588},{"l":3,"c":75207,"b":81474,"a":96264},{"l":4,"c":79521,"b":86147,"a":101786},{"l":5,"c":82608,"b":89492,"a":105738},{"l":6,"c":85843,"b":92997,"a":109879},{"l":7,"c":88065,"b":95404,"a":112724},{"l":8,"c":90794,"b":98360,"a":116216},{"l":9,"c":94321,"b":102183,"a":120733},{"l":10,"c":100596,"b":108980,"a":128764}]},{"g":26,"label":"+ 84 points","levels":[{"l":1,"c":73440,"b":79563,"a":94006},{"l":2,"c":75566,"b":81863,"a":96725},{"l":3,"c":77773,"b":84253,"a":99548},{"l":4,"c":82691,"b":89581,"a":105843},{"l":5,"c":85908,"b":93067,"a":109963},{"l":6,"c":89274,"b":96713,"a":114271},{"l":7,"c":91512,"b":99139,"a":117136},{"l":8,"c":94699,"b":102590,"a":121214},{"l":9,"c":98457,"b":106661,"a":126024},{"l":10,"c":105058,"b":113812,"a":134473}]},{"g":27,"label":"+ 98 points (continued)","levels":[{"l":1,"c":75074,"b":81332,"a":96097},{"l":2,"c":78556,"b":85102,"a":100552},{"l":3,"c":80843,"b":87581,"a":103480},{"l":4,"c":86006,"b":93174,"a":110088},{"l":5,"c":89356,"b":96802,"a":114376},{"l":6,"c":92853,"b":100590,"a":118851},{"l":7,"c":95074,"b":102997,"a":121695},{"l":8,"c":98671,"b":106891,"a":126296},{"l":9,"c":102573,"b":111122,"a":131294},{"l":10,"c":109697,"b":118839,"a":140413},{"l":11,"c":110221,"b":119406,"a":141082},{"l":12,"c":110694,"b":119919,"a":141689},{"l":13,"c":111200,"b":120467,"a":142337},{"l":14,"c":111674,"b":120980,"a":142943}]}],"lausd_ci":[{"tier":"C1","label":"1st Career Increment","basis":"C","annual":113373,"monthly":9447.75,"deg":""},{"tier":"C1","label":"1st Career Increment","basis":"B","annual":122821,"monthly":10235.12,"deg":""},{"tier":"C1","label":"1st Career Increment","basis":"A","annual":145118,"monthly":12093.17,"deg":""},{"tier":"C1","label":"1st Career Increment + MA","basis":"C","annual":113957,"monthly":null,"deg":"MA"},{"tier":"C1","label":"1st Career Increment + DR","basis":"C","annual":114541,"monthly":null,"deg":"DR"},{"tier":"C2","label":"2nd Career Increment","basis":"C","annual":114240,"monthly":9520,"deg":""},{"tier":"C2","label":"2nd Career Increment","basis":"B","annual":123760,"monthly":10313.32,"deg":""},{"tier":"C2","label":"2nd Career Increment","basis":"A","annual":146227,"monthly":12185.58,"deg":""},{"tier":"C3","label":"3rd Career Increment","basis":"C","annual":117263,"monthly":9771.94,"deg":""},{"tier":"C3","label":"3rd Career Increment","basis":"B","annual":127034,"monthly":10586.18,"deg":""},{"tier":"C3","label":"3rd Career Increment","basis":"A","annual":150096,"monthly":12507.97,"deg":""},{"tier":"C4","label":"4th Career Increment","basis":"C","annual":119240,"monthly":9936.67,"deg":""},{"tier":"C4","label":"4th Career Increment","basis":"B","annual":129176,"monthly":10764.66,"deg":""},{"tier":"C4","label":"4th Career Increment","basis":"A","annual":152626,"monthly":12718.86,"deg":""}],"ups":[{"cls":"Regular Package Car Driver / Feeder","fam":"Art 41 \u00a72(c)","start":23,"m12":24,"m24":25,"m36":30.75,"m48":"Top Rate","top":null,"formula":"Prevailing top rate","g23":2.75,"g24":0.75,"g25":0.75,"g26":1,"g27":2.25,"pt":"","pa":null},{"cls":"Full-time Inside","fam":"Art 41 \u00a73","start":23,"m12":24,"m24":25,"m36":28,"m48":"Top Rate","top":35.94,"formula":"$35.94 + GWIs","g23":2.75,"g24":0.75,"g25":0.75,"g26":1,"g27":2.25,"pt":"","pa":null},{"cls":"Part-time (new after 8/1/2023)","fam":"Art 22 \u00a75(b)","start":21,"m12":21.5,"m24":22,"m36":22.5,"m48":23,"top":23,"formula":"$23.00 after 8/1/2027","g23":2.75,"g24":0.75,"g25":0.75,"g26":1,"g27":2.25,"pt":"","pa":null},{"cls":"Automotive Mechanic","fam":"Art 41 \u00a75","start":null,"m12":"Top Rate","m24":null,"m36":null,"m48":null,"top":null,"formula":"85% of top rate at start, top at 12mo","g23":2.75,"g24":0.75,"g25":0.75,"g26":1,"g27":2.25,"pt":"","pa":null},{"cls":"Part-time (seniority before 8/1/2023)","fam":"Art 22 \u00a75(a)","start":null,"m12":null,"m24":null,"m36":null,"m48":null,"top":null,"formula":"Current rate + GWIs","g23":2.75,"g24":0.75,"g25":0.75,"g26":1,"g27":2.25,"pt":"","pa":null},{"cls":"Various (air hub/gateway)","fam":"Art 40 Premiums","start":null,"m12":null,"m24":null,"m36":null,"m48":null,"top":null,"formula":"","g23":null,"g24":null,"g25":null,"g26":null,"g27":null,"pt":"Deice","pa":1},{"cls":"Various (air hub/gateway)","fam":"Art 40 Premiums","start":null,"m12":null,"m24":null,"m36":null,"m48":null,"top":null,"formula":"","g23":null,"g24":null,"g25":null,"g26":null,"g27":null,"pt":"Pushback","pa":0.75},{"cls":"Various (air hub/gateway)","fam":"Art 40 Premiums","start":null,"m12":null,"m24":null,"m36":null,"m48":null,"top":null,"formula":"","g23":null,"g24":null,"g25":null,"g26":null,"g27":null,"pt":"K-Loading (aircraft)","pa":0.5},{"cls":"Various (air hub/gateway)","fam":"Art 40 Premiums","start":null,"m12":null,"m24":null,"m36":null,"m48":null,"top":null,"formula":"","g23":null,"g24":null,"g25":null,"g26":null,"g27":null,"pt":"Trainer","pa":1}],"payroll_raw":[{"n":"Javier Ibarra","t":"Plumber","b":115931,"o":67535,"x":12126,"bn":54231,"tc":249822},{"n":"Cusberto Garay","t":"Plumber Supervisor","b":123617,"o":15469,"x":27669,"bn":59224,"tc":225979},{"n":"Fernando Martinez","t":"Plumber","b":116668,"o":37366,"x":7396,"bn":57163,"tc":218593},{"n":"John Corcoran","t":"Plumber Supervisor","b":132478,"o":9784,"x":9482,"bn":61852,"tc":213597},{"n":"William Torres","t":"Plumber Supervisor","b":130333,"o":423,"x":18753,"bn":61216,"tc":210725},{"n":"David Patron","t":"Senior Plumber","b":100407,"o":54013,"x":8477,"bn":47640,"tc":210537},{"n":"Joshua Muncie","t":"Plumber Supervisor","b":123538,"o":1249,"x":29700,"bn":55828,"tc":210315},{"n":"Robert Zarate","t":"Plumber","b":105835,"o":53054,"x":6788,"bn":40085,"tc":205763},{"n":"David Jaime","t":"Plumber Supervisor","b":123538,"o":357,"x":20823,"bn":59201,"tc":203919},{"n":"Joe Arias","t":"Plumber Supervisor","b":123538,"o":2319,"x":20594,"bn":55511,"tc":201962},{"n":"Dionicio Banuelos","t":"Senior Plumber","b":117014,"o":12207,"x":14548,"bn":57266,"tc":201036},{"n":"Pedro Chacon","t":"Senior Plumber","b":126016,"o":7640,"x":7750,"bn":59611,"tc":201016},{"n":"William Garcia","t":"Plumber Supervisor","b":123538,"o":7668,"x":12508,"bn":56035,"tc":199749},{"n":"Gregory Everard","t":"Plumber","b":106502,"o":53208,"x":8046,"bn":31900,"tc":199655},{"n":"Lazaro Pina","t":"Plumber","b":106502,"o":26873,"x":11247,"bn":53823,"tc":198444},{"n":"John Moreno","t":"Plumber Supervisor","b":123538,"o":178,"x":14503,"bn":59201,"tc":197421},{"n":"Brian Urias","t":"Plumber","b":106502,"o":19985,"x":18314,"bn":49088,"tc":193889},{"n":"Tyron Lewis","t":"Plumber Supervisor","b":123538,"o":2587,"x":7772,"bn":59201,"tc":193097},{"n":"Hart Brauer","t":"Plumber Supervisor","b":123538,"o":981,"x":9218,"bn":59201,"tc":192938},{"n":"Michael Hladek","t":"Senior Plumber","b":117163,"o":1563,"x":15956,"bn":57310,"tc":191992},{"n":"Angel Birrueta","t":"Plumber","b":106502,"o":4459,"x":26530,"bn":54147,"tc":191638},{"n":"Eddie Ortega","t":"Plumber","b":106502,"o":35946,"x":6846,"bn":40656,"tc":189950},{"n":"Brian Velazquez","t":"Plumber","b":112359,"o":8461,"x":13100,"bn":55885,"tc":189805},{"n":"Curtis Morita","t":"Plumber Supervisor","b":122961,"o":0,"x":9898,"bn":55657,"tc":188515},{"n":"Joa\\&#39;O Dominic Garcia","t":"Plumber","b":113090,"o":25230,"x":7250,"bn":42610,"tc":188180},{"n":"Rodolfo Ballesteros","t":"Plumber","b":106502,"o":4758,"x":25525,"bn":49088,"tc":185873},{"n":"Steven Knight","t":"Plumber","b":106448,"o":12725,"x":15713,"bn":50759,"tc":185645},{"n":"Victor Silva Jr","t":"Plumber","b":106370,"o":9605,"x":14852,"bn":54108,"tc":184935},{"n":"Marc Tavera","t":"Plumber","b":102827,"o":17368,"x":12572,"bn":52117,"tc":184884},{"n":"Jose Rodriguez","t":"Plumber","b":106502,"o":13071,"x":10533,"bn":54147,"tc":184253},{"n":"Emilio Rios","t":"Senior Plumber","b":108838,"o":10813,"x":11384,"bn":52960,"tc":183996},{"n":"Anthony Morgan","t":"Plumber","b":106031,"o":4344,"x":19244,"bn":53683,"tc":183303},{"n":"Sergio Lambarri","t":"Senior Plumber","b":117014,"o":0,"x":8802,"bn":57266,"tc":183082},{"n":"Don Jackson","t":"Senior Plumber","b":100554,"o":35818,"x":9689,"bn":36820,"tc":182881},{"n":"Simon Clery","t":"Plumber","b":105723,"o":8971,"x":19278,"bn":48857,"tc":182829},{"n":"Roy Martinez","t":"Plumber","b":105930,"o":4113,"x":17473,"bn":53978,"tc":181493},{"n":"Mark Clements","t":"Plumber","b":106092,"o":14327,"x":6846,"bn":54026,"tc":181290},{"n":"Jose Castillo","t":"Plumber","b":106502,"o":1000,"x":18630,"bn":52883,"tc":179013},{"n":"Francisco Ibarra","t":"Plumber","b":106192,"o":4139,"x":17987,"bn":50455,"tc":178772},{"n":"Israel Hernandez Jr","t":"Plumber","b":106964,"o":5075,"x":11936,"bn":54285,"tc":178260},{"n":"Randy Petitt","t":"Plumber","b":106502,"o":4075,"x":13160,"bn":54147,"tc":177884},{"n":"Eric Cortes-Reyes","t":"Plumber","b":101597,"o":13891,"x":15402,"bn":46113,"tc":177004},{"n":"John Tuso","t":"Plumber Supervisor","b":123538,"o":0,"x":7702,"bn":45709,"tc":176950},{"n":"Luis Fabela","t":"Plumber","b":107067,"o":5651,"x":10175,"bn":53991,"tc":176883},{"n":"Trent Richer","t":"Senior Plumber","b":99275,"o":29925,"x":11034,"bn":36624,"tc":176857},{"n":"Ronaldo Rodriguez","t":"Plumber","b":106502,"o":5152,"x":11122,"bn":53823,"tc":176598},{"n":"Blair Nelson","t":"Senior Plumber","b":117014,"o":929,"x":7543,"bn":51088,"tc":176575},{"n":"Michael Nicosia","t":"Plumber","b":106184,"o":4211,"x":11218,"bn":54053,"tc":175667},{"n":"Jesse Villalon","t":"Plumber","b":111613,"o":10516,"x":12575,"bn":40897,"tc":175602},{"n":"Gary Greene","t":"Plumber","b":112359,"o":852,"x":7150,"bn":52512,"tc":172873},{"n":"Charles Pennington","t":"Plumber","b":111998,"o":480,"x":7264,"bn":52081,"tc":171823},{"n":"Ricardo Gastelum Adame","t":"Plumber","b":106502,"o":9612,"x":4847,"bn":50775,"tc":171735},{"n":"Daniel Lopez","t":"Plumber","b":106502,"o":2768,"x":11300,"bn":50809,"tc":171378},{"n":"Dave Kaiser","t":"Plumber","b":106502,"o":6382,"x":7407,"bn":50657,"tc":170948},{"n":"Terence Chang","t":"Plumber","b":106502,"o":2307,"x":11535,"bn":50450,"tc":170793},{"n":"Timothy Vowels","t":"Plumber","b":106502,"o":9295,"x":6846,"bn":48100,"tc":170742},{"n":"Julio Mateo","t":"Plumber","b":106527,"o":77,"x":9749,"bn":54155,"tc":170508},{"n":"Anastacio Quintana","t":"Plumber","b":106343,"o":231,"x":9522,"bn":54100,"tc":170196},{"n":"Jeffrey Miller","t":"Plumber","b":109166,"o":615,"x":7145,"bn":51565,"tc":168492},{"n":"Carolyn McBain","t":"Plumber","b":106502,"o":0,"x":9474,"bn":52320,"tc":168296},{"n":"Joseph Banda","t":"Plumber","b":106502,"o":0,"x":7076,"bn":54147,"tc":167725},{"n":"Michael Medrano","t":"Plumber","b":105961,"o":0,"x":6846,"bn":53987,"tc":166794},{"n":"Robert Zamora","t":"Plumber","b":112359,"o":5984,"x":7140,"bn":40794,"tc":166277},{"n":"Michael Powell","t":"Plumber","b":109054,"o":0,"x":6897,"bn":50034,"tc":165984},{"n":"Greg Tonkin","t":"Plumber","b":106502,"o":9650,"x":9112,"bn":40656,"tc":165920},{"n":"Enrique Valdivia","t":"Plumber","b":106502,"o":9611,"x":7780,"bn":40425,"tc":164318},{"n":"Chaz Moreno","t":"Plumber","b":106297,"o":0,"x":11422,"bn":46013,"tc":163732},{"n":"Daniel Lugo","t":"Plumber","b":106390,"o":1538,"x":9398,"bn":46041,"tc":163366},{"n":"Sergio Valdepena","t":"Plumber","b":103939,"o":12131,"x":6846,"bn":39657,"tc":162572},{"n":"Edward Clark","t":"Plumber","b":106502,"o":0,"x":6846,"bn":49088,"tc":162436},{"n":"Timothy Munsill","t":"Plumber","b":104929,"o":0,"x":7089,"bn":50191,"tc":162209},{"n":"Arthur Flores","t":"Plumber","b":104478,"o":0,"x":6846,"bn":50382,"tc":161705},{"n":"Carlos Rodriguez","t":"Plumber","b":108234,"o":1999,"x":10078,"bn":41170,"tc":161481},{"n":"Christopher Stout","t":"Plumber","b":99376,"o":7048,"x":12333,"bn":42634,"tc":161392},{"n":"Teofilo Esquivel","t":"Plumber","b":90853,"o":16751,"x":8309,"bn":44462,"tc":160375},{"n":"David Mangold","t":"Plumber","b":106200,"o":77,"x":9721,"bn":40660,"tc":156659},{"n":"Martin Lizardi Sanchez","t":"Plumber","b":90098,"o":9414,"x":10000,"bn":46462,"tc":155974},{"n":"John Bonilla","t":"Plumber","b":105741,"o":1076,"x":7182,"bn":40524,"tc":154524},{"n":"Thomas Turner","t":"Senior Plumber","b":99822,"o":2897,"x":7935,"bn":43204,"tc":153858},{"n":"Robert Scipioni","t":"Plumber","b":105886,"o":0,"x":6846,"bn":40474,"tc":153206},{"n":"Steven Corona","t":"Plumber","b":93029,"o":8905,"x":7683,"bn":34638,"tc":144255},{"n":"Edward Giles","t":"Plumber","b":90011,"o":0,"x":7140,"bn":45942,"tc":143093},{"n":"Michael Watkins","t":"Plumber","b":86276,"o":4073,"x":6616,"bn":42573,"tc":139538},{"n":"Carlos Sorto","t":"Plumber","b":84066,"o":10226,"x":10738,"bn":29306,"tc":134337},{"n":"Richard Hayes","t":"Plumber","b":71646,"o":0,"x":24508,"bn":37229,"tc":133383},{"n":"Todd Vince Davie Jr","t":"Plumber Supervisor","b":85622,"o":2899,"x":6208,"bn":35820,"tc":130548},{"n":"Richard Justiniano","t":"Senior Plumber","b":66548,"o":18984,"x":12839,"bn":31782,"tc":130153},{"n":"Ivan Torres","t":"Plumber","b":87023,"o":0,"x":8708,"bn":26668,"tc":122400},{"n":"Jason Winter","t":"Plumber Supervisor","b":67118,"o":1090,"x":20056,"bn":30300,"tc":118565},{"n":"Gefri Rodriguez","t":"Plumber Ii - Hiring Hall","b":94677,"o":11809,"x":10033,"bn":0,"tc":116519},{"n":"Erickson Yee","t":"Senior Plumber","b":72090,"o":2788,"x":6819,"bn":31013,"tc":112710},{"n":"Christopher Camacho","t":"Plumber","b":69594,"o":3076,"x":6329,"bn":33571,"tc":112569},{"n":"Keith Schwecke","t":"Plumber Ii - Hiring Hall","b":95459,"o":462,"x":13491,"bn":0,"tc":109412},{"n":"Alfredo Gonzalez","t":"Plumber Ii - Hiring Hall","b":94362,"o":7471,"x":7003,"bn":0,"tc":108836},{"n":"Pantaleon Garcia Jr.","t":"Plumber Ii - Hiring Hall","b":101242,"o":462,"x":6325,"bn":0,"tc":108029},{"n":"Alberto Colin","t":"Plumber Ii - Hiring Hall","b":99614,"o":693,"x":6240,"bn":0,"tc":106547},{"n":"Heriberto Gallardo Jr.","t":"Plumber Ii - Hiring Hall","b":100054,"o":0,"x":5864,"bn":0,"tc":105917},{"n":"Lee Rivard","t":"Plumber Ii - Hiring Hall","b":96752,"o":0,"x":8168,"bn":0,"tc":104920},{"n":"Joseph Padilla","t":"Plumber Ii - Hiring Hall","b":92432,"o":5705,"x":6657,"bn":0,"tc":104795},{"n":"Roberto Navarro","t":"Plumber Ii - Hiring Hall","b":92384,"o":4293,"x":6447,"bn":0,"tc":103123},{"n":"Francis Walling","t":"Plumber","b":69252,"o":2358,"x":7426,"bn":23455,"tc":102491},{"n":"John Cruz","t":"Plumber Ii - Hiring Hall","b":96397,"o":0,"x":5971,"bn":0,"tc":102368},{"n":"Raymond Loy","t":"Plumber Ii - Hiring Hall","b":90456,"o":5032,"x":6718,"bn":0,"tc":102206},{"n":"Adrian Olguin","t":"Plumber Ii - Hiring Hall","b":79300,"o":16195,"x":6314,"bn":0,"tc":101810},{"n":"Michael Masterman","t":"Plumber Ii - Hiring Hall","b":91529,"o":1681,"x":8467,"bn":0,"tc":101677},{"n":"Chase Brown","t":"Plumber Ii - Hiring Hall","b":85214,"o":10025,"x":6326,"bn":0,"tc":101565},{"n":"David Gallegos","t":"Plumber Ii - Hiring Hall","b":92490,"o":1674,"x":6481,"bn":0,"tc":100644},{"n":"Ruben Hernandez","t":"Plumber Ii - Hiring Hall","b":90420,"o":3375,"x":6441,"bn":0,"tc":100236},{"n":"Brett Bogroff","t":"Plumber Ii - Hiring Hall","b":87926,"o":3473,"x":8097,"bn":0,"tc":99496},{"n":"Philip Perry","t":"Plumber Ii - Hiring Hall","b":91801,"o":462,"x":5746,"bn":0,"tc":98010},{"n":"Christopher Salut","t":"Plumber Ii - Hiring Hall","b":89483,"o":0,"x":7825,"bn":0,"tc":97309},{"n":"Javier Valenzuela","t":"Plumber Ii - Hiring Hall","b":87567,"o":750,"x":7310,"bn":0,"tc":95627},{"n":"Luis Bautista","t":"Plumber Ii - Hiring Hall","b":85620,"o":3770,"x":5939,"bn":0,"tc":95329},{"n":"Keith Reynolds","t":"Plumber Ii - Hiring Hall","b":84247,"o":1228,"x":7860,"bn":0,"tc":93335},{"n":"Christian Ramos Montiel","t":"Plumber Ii - Hiring Hall","b":83321,"o":887,"x":7851,"bn":0,"tc":92059},{"n":"Mark Garcia","t":"Plumber Ii - Hiring Hall","b":82080,"o":887,"x":7633,"bn":0,"tc":90600},{"n":"Favian Lopez","t":"Plumber Ii - Hiring Hall","b":83065,"o":1501,"x":5728,"bn":0,"tc":90294},{"n":"Fernando Delgado","t":"Plumber Ii - Hiring Hall","b":82859,"o":0,"x":6981,"bn":0,"tc":89840},{"n":"Sebastian Quezada","t":"Plumber Ii - Hiring Hall","b":78996,"o":4342,"x":5720,"bn":0,"tc":89059},{"n":"Jason Winter","t":"Plumber","b":51790,"o":0,"x":12454,"bn":24155,"tc":88399},{"n":"Johnathan Zimmer","t":"Plumber Ii - Hiring Hall","b":76672,"o":1996,"x":7137,"bn":0,"tc":85805},{"n":"Jose Munoz Jr","t":"Plumber","b":53191,"o":513,"x":6099,"bn":25260,"tc":85063},{"n":"Richard Justiniano","t":"Plumber","b":51790,"o":2128,"x":2611,"bn":25552,"tc":82081},{"n":"Mark Lehner","t":"Plumber","b":26536,"o":2048,"x":40945,"bn":12096,"tc":81624},{"n":"John Torres Feliciano","t":"Plumber Ii - Hiring Hall","b":72342,"o":2871,"x":5267,"bn":0,"tc":80481},{"n":"Leobardo Jimenez","t":"Plumber","b":52849,"o":3998,"x":5352,"bn":17970,"tc":80168},{"n":"James Perry","t":"Plumber","b":52445,"o":615,"x":2080,"bn":24305,"tc":79444},{"n":"Jay Hesselgrave","t":"Plumber Ii - Hiring Hall","b":72053,"o":218,"x":6340,"bn":0,"tc":78611},{"n":"Herbert Galvez","t":"Plumber Ii - Hiring Hall","b":64377,"o":3732,"x":5017,"bn":0,"tc":73126},{"n":"Daniel Gutierrez Mota","t":"Plumber 1 - 5A - Hiring Hall","b":60905,"o":0,"x":4332,"bn":0,"tc":65237},{"n":"Edgar Miranda","t":"Plumber Ii - Hiring Hall","b":58761,"o":0,"x":4045,"bn":0,"tc":62806},{"n":"Erickson Yee","t":"Plumber","b":40826,"o":1153,"x":637,"bn":18989,"tc":61606},{"n":"Angel Vasquez Morales","t":"Plumber 1 - 4A - Hiring Hall","b":53649,"o":0,"x":3870,"bn":0,"tc":57519},{"n":"Christopher Camacho","t":"Plumber","b":37136,"o":231,"x":517,"bn":17479,"tc":55362},{"n":"Herbert Smith","t":"Plumber Ii - Hiring Hall","b":46682,"o":205,"x":3315,"bn":0,"tc":50201},{"n":"John Hernandez","t":"Plumber 1 - 2A - Hiring Hall","b":45523,"o":895,"x":3641,"bn":0,"tc":50059},{"n":"David Patron","t":"Plumber","b":22403,"o":11363,"x":317,"bn":11345,"tc":45428},{"n":"Jamal Maxey","t":"Plumber Ii - Hiring Hall","b":34948,"o":0,"x":2434,"bn":0,"tc":37382},{"n":"Trent Richer","t":"Plumber","b":22482,"o":4860,"x":835,"bn":8557,"tc":36734},{"n":"Francis Walling","t":"Plumber Ii - Hiring Hall","b":31606,"o":1647,"x":2246,"bn":0,"tc":35499},{"n":"Joshua Denson","t":"Plumber Ii - Hiring Hall","b":32993,"o":0,"x":2330,"bn":0,"tc":35323},{"n":"Thomas Turner","t":"Plumber","b":20385,"o":269,"x":1498,"bn":9624,"tc":31777},{"n":"Steven Moody","t":"Plumber Ii - Hiring Hall","b":23289,"o":5594,"x":1899,"bn":0,"tc":30781},{"n":"Jonathan Delamora","t":"Plumber Ii - Hiring Hall","b":17959,"o":0,"x":1086,"bn":0,"tc":19046},{"n":"Martin Lizardi Sanchez","t":"Plumber Ii - Hiring Hall","b":13864,"o":1421,"x":1045,"bn":0,"tc":16330},{"n":"Emilio Rios","t":"Plumber","b":8417,"o":2965,"x":115,"bn":4376,"tc":15873},{"n":"Nicholas Marietti","t":"Plumber Ii - Hiring Hall","b":14318,"o":616,"x":931,"bn":0,"tc":15866},{"n":"James Orona","t":"Plumber","b":8202,"o":0,"x":115,"bn":3169,"tc":11486},{"n":"Marc Tavera","t":"Senior Plumber","b":4506,"o":0,"x":0,"bn":2276,"tc":6782},{"n":"Keith Schwecke","t":"Plumber","b":4326,"o":0,"x":0,"bn":1283,"tc":5610},{"n":"Christopher Salut","t":"Plumber 1 - 5A - Hiring Hall","b":2913,"o":0,"x":212,"bn":0,"tc":3126},{"n":"Donald Hoffman","t":"Plumber Ii - Hiring Hall","b":2458,"o":0,"x":176,"bn":0,"tc":2634}]};

const fmt = n => (n != null && n !== "" && n !== 0) ? `$${Math.round(Number(n)).toLocaleString()}` : "—";
const fmtHr = n => (n != null && n !== "" && n !== 0) ? `$${Number(n).toFixed(2)}` : "—";
const pct = (a,b) => a && b ? `${((b/a-1)*100).toFixed(1)}%` : "—";
const median = arr => { if (!arr.length) return 0; const s = [...arr].sort((a,b)=>a-b); const m = Math.floor(s.length/2); return s.length%2 ? s[m] : (s[m-1]+s[m])/2; };
const avg = arr => arr.length ? arr.reduce((s,v)=>s+v,0)/arr.length : 0;

// Smart title cleaner: fixes "Fire Fighter Ii" → "Fire Fighter II", "Plumber 1 - 4A" stays correct
const ROMAN = {Ii:"II",Iii:"III",Iv:"IV",Vi:"VI",Vii:"VII",Viii:"VIII",Ix:"IX",Xi:"XI",Xii:"XII"};
const KEEP_UPPER = new Set(["HR","OT","PG&E","IBEW","LAUSD","UPS","DCPP","SAP","GC","PIO","NETA","NECA","AWSR","WSR","USA","CA","NY","TX","FL","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII","RPCD","CDL","DOT","CSI","EMT","HVAC","IT","GIS","CAD"]);
const cleanTitle = (s) => {
  if (!s) return s;
  return s.split(" ").map(word => {
    // If already uppercase and known, keep it
    if (KEEP_UPPER.has(word.toUpperCase()) && word.length <= 5) return word.toUpperCase();
    // Fix Roman numerals after title-casing
    if (ROMAN[word]) return ROMAN[word];
    // Handle suffixes like "1A", "4A", "5A" — keep uppercase
    if (/^\d+[A-Za-z]$/.test(word)) return word.toUpperCase();
    // Handle hyphenated like "Officer-Lateral" 
    if (word.includes("-")) return word.split("-").map(w => ROMAN[w] || (KEEP_UPPER.has(w.toUpperCase()) ? w.toUpperCase() : (w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))).join("-");
    // Normal title case
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(" ").replace(/([a-zA-Z]{2,})'([A-Z])/g, (m,word,letter) => `${word}'${letter.toLowerCase()}`);
};

const DB_KEY = "wagebase_v3";
const BENJI_IMG = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAGWAW4DASIAAhEBAxEB/8QAHQABAAAHAQEAAAAAAAAAAAAAAAECAwQFBgcICf/EAEkQAAEDAwEEBwUEBgcGBwAAAAEAAgMEBREGBxIhMRMiQVFhcYEIFDKRoSNCscEVM1JiktEkQ3KCouHwFiU0ssLDF2ODk6Ok8f/EABsBAQACAwEBAAAAAAAAAAAAAAAFBgIDBAEH/8QAOBEAAgIBAgMECAUDBQEBAAAAAAECAwQFERIhMRNBUWEGFCIycYGx8EKRocHRIzPhFSQ0UvFDcv/aAAwDAQACEQMRAD8A8lIiLaYBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREARFEAkgAZJ5BAQRbtpPZVr7U+4+26cq2wPPCepHQx+eX4z6ZXWdL+ypfKkMkv+oKekB4uipITIf4nbo+hXBkaniY/9yxfX6G2FFk+iPOCL2vYvZg2f0LGm4uuFyeOLjNVFoPpGG/itxt2yTZdbN3o9M2YlvIywNlP+PeUa/SOhvaqEpfBG14rjznJI+e6L6UUth0hQgCltdBCByEVMxv4BX0f6Hj4MZgeAIT/Wcl+7iy+/ka2sddbV9/M+ZKL6bP8A0RIMPjyPEEqxqrBpGtBFVa6CYHn0tMx34hP9ZyV72LL7+QSx30tX38z5rovoTctkey+573SaYs7S7mYoGxH5s3Vpt99mHZ/XMcbc64W154tMNSXAekgd+KL0ioi9rYSj8UbFiuXuST+Z4oRej9UeypfKYPksGoKerA4tiqoTGf4m7w+gXJtWbKtfaY333LTlW6Bh4z0w6aPzyzOPXCksfU8TI/t2L6fU1Tosh1RpKKJBBIIwRzCgu81BERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAERVKeGaonZBTxSTSvO6xjGlznHuAHNAU1f2KzXW+3BlBZ7fU11U88I4Iy4+ZxyHiV3PZH7Nl5vhiuWsHyWyiOHCkYR0zx+8eTPLifJen9LaU0noe2tobNbqemaAMiNuXPPe4niT5lQeVrcIz7LGj2k/LodCo4Y8dr4V5nmbZ17MF8uYjq9W3BttgPH3amw+Xs5uPVb6by9BaM2U7PtFRsfRWim95aP+InHSyn+87JHphbHVXWeXqxYiZ4c1YOc5xy4knvJWlaXn5vPLs4Y/8AWP3/ACcF2sUU8qI7vxf3/Bl33SmhGKWnBPeeCtZrpVycnhg7mhWKKSxtDwqOkN34vmRV2q5V3Wey8uRPJLJIcySPd5nKkRFKxjGK2itiPlJy5thETI716YhEyFDKDYip2SSs4ske3yJCp5KcV5KKktmtzKLlF7ovorpWR/1geO5wV0y6083Cqpx/aHFYfCKLyNDwsj3q9n4rl9Dvo1TLp6T3+PMxmstlOz7W0b31topfeXD/AIiEdFKP7zcE+uV5+2i+zBfLYJKvSVwbcoBx92qcMl7eTh1Xeu6vSrXFpBaSD4K/pLrPFhsmJWdx5/NRr0vPwueJZxL/AKy+/wCCWp1im7lfHZ+K+/5PnFfbNdbFcH0F4t9TQ1TDxjnjLT5jPMeIVgvpBqnS2ktcW51DebdT1AI6okbhzD3tI4g+RXmHa57Nl5sfS3LR75LnRDLjSPI6Zg/dPJ/lwPmtuNrcJT7LJj2c/Pp+Z3uhSjx1PiXkefUVSohmp53wVEUkMrDuvY9pa5p7iDyVNThzhERAEREAREQBERAEREAREQBERAEREAREQBERAERdP2HbIbxtFuDamRslHY4n4lqd3jIRzbH3nvPILTfkV49bsseyRlCDm9omsbOtCai13eW2+x0Ze0EdPUv4RQjvce/uA4lezdkOxnS+z2iZWzsbWXUt+0rJmjeB7QwfdHlx7ytw0vp/T+hbDBarNRRQRxtw1jBxce1zjzJPaSpauqkqpN6R3kOwKvRWXrT5exT+svv8viMnLpwVt70/oXlbdXOHRUrejjHDOOP+SxpcSckkk9pUMIrHh4NGHDgpjt9WVvIyrcmXFY9wigi7Dn2IqCJkINgiZChlACiEpngmxkMJhQz4JvFe7McyZTZVPJTeKbHmzJ0VPrHtTrJsxsydFJxTBKbDZlQZByOBWSorq9g6KqHSxnhnt/zWKBA5lN4d65MvAozIcF0d/qvgb8fIux5cVb2Nb2u7GtL7Q6J9bAxtHdQ37OshaN4nsDx94efHuK8ZbRdCai0JeXW++UZY0k9BUs4xTDvae/vB4he96WrkppN+J+O8dhVTU1h09ruxTWm80UU7JG9ZjxxB7HNPMEdhCrkoZejPd7zp/WP3+XwLJj5dWctn7M/0Z83EXT9uOyG8bOrg6pjbJWWOV+Iqnd4xk8myY5HuPIrmCn6MivIrVlb3TE4OD2YREW4xCIiAIiIAiIgCIiAIiIAiIgCIiAIi6PsI2ZVu0XUoY9kkVnpXA1k4GN7ujaf2j9BxWq++FFbsseyRlGLk9kZT2fNj9btBubblcWSU+n4JMSPHB1S4c2MPd3u7OXNe1aaG26atMFqtVNDAyGMMjjjbhrGjlwUtHTW7S9kp7Ta6eKBkMYjijjGGsaOX+u1Yp73PeXvcXOJySVAYmJbrNqyMhbVL3Y+PmzzMy1iR7Kr3n1fgTyyvleXvcS48yVLx71JlMlW6MFFbJbIrbW73ZPlPUqXeTKy2HCRVpXXKgoS0VlbBTlxw0SPAytf2h6qbp63iOnLX104xG08QwftFc7tun6u9OfdL3UySSSjLATxPcT4eCi9Q1OrCjvLqT2laDZnLjb2idua4OaHNIIPIhRyCuY7JL5PFcZ9PXCV7nDJg33ZLS3m35cV07gu6i6N0FNEZm4csS51SGAmETK3nLsQREXh7sMphFj9Q3SCz2me4TnDY28B3nsCN7LdnsK3OSjHqzFa61ZS6co8DdlrZB9lFn/EfBc7s20G/Ule2puD3VNLIesxwwAMjJb5LER9Lf7hVXm7zH3aN2/Ic9/JjflhXhuVpvcYtstN7o1vCnfnkqzl6tNW+wnsuu3d/JfcHQqIUcNqTk/vl4HaLRcaW60EdbRyiSKQZB7vAq7yuH6KvdTpK/GjrCTSyuDZW54NzyeF22KRksTZY3BzHgFpHaCp3FyY5EOKJUtT0+WFbwvo+hOnFFELoIxkMqOFAqKHhDAUY3vjkD2OLXA5BCgiNJrZ9DJPZ7oy08du1LaprTdqaGdk0ZZJHI3LZGnmMLxb7Qex+t2fXN1ytzJajT88mGPPF1M48mPPd3O7eXNevWlzHBzSQRxBCylVTW/VFlqLRdqeKdk0ZjkjkGWyNKqOXiWaRa8nGW9T96Ph5r7/QsWHmLKiqrX7Xc/E+aaLo+3fZlW7OtSljGyS2eqcTRzkZ3e+Nx/aH1HFc4U7RfC+tWVvdMylFwezCIi3GIREQBERAEREAREQBERAERRAJIAGSUBnNCaXuWsdUUlgtTMz1Dus8jLYmD4nnwAX0A0Npm0bPdHU1pt0QAiZjJHWkeebneJ7fktA9lrZrHozSP6du0IZdrgwSy73OGPm2P8z4+S6Dcqt9ZUukOQ0cGjuCrUovWczs1/Zh1839/obb7lhU7/jl08ihPLJNK6SR2XOOSpN4hEVxjFQSjFckVpycnuxvKOQpcJyWQJshW11roLbbp66oOI4WFx8fBXGVzPbJeN99PYqd+XHEkwB/hH5/Jaci1VVuTOvBxXlXxr/P4Gs0IqNWaomuVWT0LXBzmnkB91g/13rN6i1JDaJWU0MInlx1mh2AwfzUjTHpnS4OG+8OHb2vP8ls+yrZ3T33T1ber8x7pq+N8dNvfcB/rB455KhcPr9ztt5wXJeZ9NlOOFSoR5Gg3OrjotQW7UlEcRyEPOO8fEPku4U80c8Ec0bsse0OafArgb6WVtDc7PO3EtDIZGjt6pw4Lqey64mv0lTh7iZKcmF2fDl9MKx6LPhTpb6dPv4FW9J6OOMMhfM23I70yFTUFPlOKuUVPKjlATrle2u5PkrqKywZcA3pZGjtceDR9D811B7wxjnuOGtGSVxOCV161lX3qXjTU7nSgnlgcGD6KN1XIVND8ywejuL22TxvpEsKimnqq2h0zbo3PkLg17W/eldz9APwK6nrXY1FS6Lgnse/Jc6OMvnaec/acdxHYrH2dLCLpqiu1LVNyKXhFk5+0fnj6D8V6CPLioWqHBBL8yy5WS1Z7PceMWl12t7opf8Aj6RpI75GjmPMLoex7UJrKF1mqnkzQDMOe1nd6Ky246bGlNaU95oIwyjrX9IGMGA1wxvN9VqkdU7T+qKS6UuRTykSNA4AsPNqyw7fVchRXuvp+6/c91HGWfiNrqvv/B3tQKkp5WTwRzRODo5GhzXDtB4gqdWk+dNbcmEUPRMrw8IooZCZCHhM1TxyOikbJG7dc05BCp7w70COKktn0PU9nuirrjTVp2g6PqrRc4gekZgkDrRvHwvb4g/yXgDXel7lo7VFXYLqzE9O7qvAw2Vh+F48CF9A6CpfSVDZG5I5OHeFzz2pNm0WtNIfp20wh12t7DLFu85Y+bo/zHiPFVHhejZfZv8As2dPJ/f3yLNj3+u07v349fM8RIokEEgjBCgrGawiIgCIiAIiIAiIgCIiALsPssbPjrHXbLlWw79rtLmyybw6skv3G+mN4+Q71yGGOSaZkMTHPke4Na1oyXE8AAvoJsP0hBs+2Z0lJJG0VjmdNVOxxdK7mPTg30UNrWXKmlV1+/Pkjox4JycpdFzNo1BUtjY2hhOGtHXx+CwqSyOlldI85c45JUMqX0zBjg48aY9e/wA33lfy8h5Frm/kRRQyFHI713nMETI70yO9AW1yqoqGgnrJjiOFhe70C4pp4z6h1ZPdKsZAf0hzyHcPT8l0La9XCk0k+EHrVMjYx5cz+C1DRMDaHTk9e8YdJvPz+6OA+uVWvSHJcKuCPV8vz/wXX0WxYtO1r/xElZTVGqdc0dgpzmMPDSR90c3E+i9OUFNHRUUNJCMRwsDGjwAwuEbBKWnhqrzrC5P3YqOIjeI/a4uP0x6rpmldpOmb9T1MzaoUQpuLxUkN6pOA75kBR9dXZ1qEe4kc2crbG0cn2j0TbZtfnYWDoa9gcR2HfGD9VT2OSSUt4u1qkeSGcQPEEgn8FlvaAdSyXywX2kmilgkbjpWOBB3XZHFapUMv9t1PV1tii/Xxj7QgEccZxnhnK2YuRDGyVKb2TX0/9MsnGlmYLrj1+/4OxqnNNDC3ellYwd7nYXI5ma4rsipukkTT2CXd+jVLHoysqXb1XdC7PE8C4/VSVvpHiQ6PcgavRPIl78tvl/4dLq9S2GlB6a7UgI7BIHH5BYup1/pmHAbWumJ7GROP5KpozZNpm5UZnq6yuklYd17A8AefLK3Wg2U6HpA0/ojpnD70srnZ9M4WUNXdkVKC5MS0PGpk42Ntr4HLb9tEtNTZ6ympIqsSywuYxxYAASPNa5aYGU+zmsqGZ6SckvPIjBAA+n1XadoelrFQWCGW3WehptydoeY4GgkcuJxxWmVtDHW2mWhAaxsjN0YHAeir2r6pKdsa5ro0/kWXRtPqpqlKrv8AEu7DdKnQ+wiC8W1sfvlfU9V7hndzkeuNw/NWdJtc1VZqKa3363tmuUsbZKWTdDQGuGRvAc1u8Wn7bqnZjT6VhqegkpGsAJHFrm/ex3HJ+audSbM6C83WxXB1U6J9sZHG9u7kTNYQQPDt+ak67I2R4ovdM4JcMJONi57nL9WajuOuNC3Clu9I2C7WSRtQ8NZulzM7rsjsIzxWjvjFfo5kjRmSjfjvO6vQ8ehI4b7qq7Vc0Ip7tTOha3lutcOsSfNcG0bC0vuVA4F0XLj2jiFx50uzirF+Fp/syQwJRm3BdGdE2V3E1+kKdrzmSmJhd5Dl9CFta4lonVA0pcauhqInTQyShrsH4MEjK7RSzxVNPHUQPD4pGhzHDkQVbMO9W1LbqUPV8OePkSbXJvkVVhdR6ktdiDW1cpdM8ZZCwZc5ZeV/RxueeOASsDsSt1Neqm4asuDWT1pnMUQcM9EPBZ3WOOyXVmnCxY28U5+6v3MadeQRBslZZbpTQOP618PVC2a1XOgulOKigqY54+3dPEeY7FtN+v8AZqGlnFx3XUzRuylzQWY7jlcx1hYae0Qs1tofdbTNANZSsPUcw8d4DuWhXTg/a5o7ZYNFy2rXC+7vT8jcOCKysdxhutqp7hT/AATMzjuPaPQq9Xammt0Qk4uEnF9UFmLBUhwdQzHLH/Dns8Fh84UWPcx7XtOHA5BXHqOFHNx5Uy7+nk+434uRLHtU0eSvan2fHR2u33Kih3LXdnOlj3R1Y5fvs9c7w8z3Ljy+gu27SMO0LZlV0bI2mtYzpaZ2OLZm8h68R5OXz9mjkhmfDKxzJGOLXNcMFpHAgqI0bKlbS6rffg9mWG+K3U49HzRIiIpg0BERAEREAREQBERAda9lbSA1TtQp6meIPo7SBVSAgEGTOIwfXrf3V7S1NOAY6OPg1gy78lyv2OdMNsWzL9N1DN2e6SOqST2Rjqs+gJ/vLfqqYz1MkrubnZUBhx9e1Wdr92rkvj97/oe51nY4qgusvoU0RFbCvBERAEREYOYbcpj/ALtp88Ou8j5BQmayPRGGfD7oDw8grHbWXO1DSs3uqKYED+8VlaGL3rSsMLPv0oaP4VSPSKW1sG+iZ9K9HYbYaXiv3MrpKmlm9nm8ila50rpnEjGSWtLCcemVY2/ZlVXuj05cbayNtFU0zffjv7pBDjk+o+oW7bA3e7aKmt9wayJ7KlxLJCOLXAdnoVutbebNZqZsfSxNa0YZDCAT6AcAs3kwSct+RpkrIzcIrmcs1ToKoo9ltFaqurYKunrDIx3xAB2er8uKsaSN0NLFE9285jA0u78Dmtg1VqCa91DQGGKnj+BmcknvK12Srpo6gU752NlI3gwnBIVcz8t5M+GPNInsGh017z6sq8yrqDgrPpoWu600Yz3uAV9E3hlR2zXU7dzddmmenrDvHG60bvrzW9NPYtD2ag+91Zzw6McPVb03mrTpb/28fn9Sramv9xL5fQw2v4TNpaoaBktLXfIrm8MW60LsFwpm1lvnpXcpGFuccshcjBdFK+GRuHRuLXeY4KP1qtqyM/FEho1icJQ8GV6Geoo6htRTSOjkbyIWffre4xQ5kipBgcXuBH5rX2kFWd4tdLdaT3ara50e8HYa4g5CjcfJsqe0ZNIkb8aq3nKO7Lev1vXaluMtujmMtJE3ee6MbrM93isaKSGB73RQsjc85cWtxk+KzNFbKOgphT0cDIox2Ac/M9qkngGUyLu1num9vMypqjXHZJI0rUen6Wrpp54IWsqj1t4feI7FdbJtTujl/wBn7hJjifd3OPI9rP5LOywlpPBc/wBZW2a2XJl2o8sa54cS37jx2+qndC1KVVnZzfw/gjdY06GXS1t9+J3LmMLT9nV9ptEatuVgu7xT0NZJ01PO74Wnsz3Aj6q90FqSPUNp334ZVQ4bMwH5OHgVkb9Z7VdabFzp2SMjG8Hk4LfVXuyKuipQZ85x7Hh2ypuXJ8n+zRbbS7/o6Kz1cEdyirJaiMhlPD18k8uPYMqfZDFVt0Q6hr2YE1NLusePu8cZ+a0PS9nslReZr21kdLZ6OTcjMz89I8dpJ4YW8XbWdpo7dLR2CQ3a8VUZjjbA07kO8OZd/JcMZbvikTdlajFV1p+Lb7jF7JN9ulXsceDKqRo8BwW35KwuirTJZdPU9FM4On4vlI5bxWaUlTFxrSZW82cbMico9GxkqOThQRbTlMxpuoHSSUkh6ko4ea8X+1TpAaW2oVFTBEGUd2BqowAABJnEgHr1v7y9e08hhmZK08WnK5/7YmmW37ZiL5Tx709re2pBHPoz1Xj5EH+6qrmx9S1SFy923k/j3ft+pYNPs7bGlW+sea+B4oREU6ZBERAEREAREQBXllt811vFFa6YZmq52QR8M9Zzg0firNdQ9lyy/pnbLad4ZZQtkq3DHa0Yb/ic1aMm7saZWeCbMoR4pJHtmloqew6Lo7XSNDIooWQRgDHVa0AfQfVYZZvVMmJYadvJjM4/15LClcno3Q6sJTfWbbOHVrePIaXRcgDlRUFFWDqRbCIi8ARFruutRRWC0ue05qpQWwtHf3+QXkpqMW2bKapXTUILmzQtsk9PUaighp3GSeOIMkDeIBzkDz4rN6cp5aWyUsE2RI1nEHmM8cLWNF2+S4XCS8VmXdcubvcd554kreAF8317OV9vBHue59W0jD9WojFvuItJHEEhQJJ5nKiVI9zWMLnuDWjmSeAVf59CVJljLxZqK6FpqGuD2jDXsOCArO4astVK/o2PfUO/8sZHzVkNawZz7hKR/aC76cLLTU4Ra/Q0Tuq6SZlKDSFrjkbLJ08xacgPk4LZg0NYABgDgFqlLri2PIbJT1EXeSAR+K2ejqqespxNTSNkYe0LDKhkrZ3bntUqn7ht+zY4ulQ3jxh/MLfuxaBs5aTdZ3Z4CHj8wt+7FN6X/wAdfMr2p/8AIfyLmP4VzjXlA2jvxmZgMqW7/k7kf5+q6NCcsWG1dY/0xSsMTgyoizuE8iO4rq1DHd+PtFc1zNGBkKi9OT5Pkc5YAsDq7VNLYWNhDPeKuQdWIHkO8rcYdPXgyyRGieHMGcnk7yPIrndqoaK3bcoYdVRtbCZN5nTfAHFvUJ8M49VCadpzuu2tTSJ7KzYQrbre78jH1lNqirp212oL3Bp6mlbvxRylwe9uebWNBcefarH3fTbBvHXNc+bhxZRyYz28SRw9FvOpbXpFm0O8z7RrvXQta8OoYImOLZYSOBDmg4xywuSXw2x97qzZmTMtxld7u2Y5eGZ4Z8cK2+r1VLaMVsQ0LrbucpP9jbh7m22Sy2zXTqiuZxZSVFM6MSceQc7hn1VpTahgrYpLZfYxA94Ld7d4A+PctPcD35C6Tsk09T6p0/qWK5UgkgoKMzQVPHehkwSAD3HHEeC5rcCm/pHZ+KOhZNlEeKT3XmafZ62r0jqRsg67BweAeEsZ7l2uKemvNlMlNKHRVMRDXDsyMLlVDZn3zRzZWguq6aRzYieb2j7qk2eapfYq02+4kto5HYOecTu/y712aXnpt1TfTk/vzIjXNLdqV9S9pfqv8FxpixXO6XVtgu/SRW63Oc50YGA8k9/bnv7l1Sht9BQsDKOlhgaBgbjQFWidHIwSxOa5rhkOacghTKcpojUuXMqubn2ZMufJeH1IqOQpUW8j+ZHKZUCoZQcyYFZaoo6e/aNrrTVtD4pYnwyAjPVc0g/Qn5LEAhZjS8g95lgJ6sjPw/8A1QXpFR2uDKS6x2a+X+CT0mzgyUn0fI+cd6t81qvFba6kYmpJ3wScMdZri0/grNdQ9qOy/obbLdd0YZXNjq2jHa4Yd/ia5cvXTjXdtTGzxSZJTjwyaCIi3mIREQBERAF6U9hS1GXUGoLu5nCKGGnY7+0XPI/wNXmtexfYaoeh0BdK9wANRcXgH91scYH1LlC+kFnBgzS79l+p04i3tR1m+ydJdJiOQIaPQKwVaqdv1Mr+95P1VEqfw6+xohBdyS/Qrd8+OyUvFkQigFFdLNQRFY365w2i1T184LmxN4NHNx7AsW0luzKEHOSjHqylqW9Uljtj6ypcMjhGzPF7uwBcZbJcNW6iMlTISHcXEco29wVPUF5uGpbk01Dh1nbsUYOGsyt809a4bXb2Qs3XSEZkePvFVTW9W7OHDDv6fyX/AELR1SuKfvd/8F1RU0VHTR00DQ2NgwAFXCKxvtcLdapqo/E1uGDvceSosYysnt1bLa2or4GP1JqKG2H3eFomqiM7vY3zWLj05qW80hul5qRbLYDkzVTt1mP3W83Huws5sz05Svtdw1/qaF8tBR5dFCRwqH57fDJA9fBZWzU+n9fwzah1vrIW2CKV0cFthc1vRMAGMAg/QdnNXbB0yrHim1vIreVqE7JNR5Jdf4NJiuOkrM//AHfZv0zUNPCouBIjz4Rjs88q6ZtIvkQxSUNmpWAABkdvjwPmFr+q4bLT3+qisFTPU21r8QyzAB7h44A/BY0nAwu3ia6GHYwkk5Lf4m6V+0Wsu1M2ivlltNZShwO6yHonA94czGDxWVp7bBYdX6elt0sz7LqBjHsiecvZk4c0+RPNalpfSd11FI6SCMU9DFxnrJjuxRDtOe0+AXS9LxQar15ajboXmw6bphCyoeMNmcM9bwJcc48FrvirK2rFujFNVS3r5bdTsFttlFb2OFJA2Pe+I8yVehY+W9WiF/Ry3OjY/OMGZoP4rnm23Ul7p7RRv0vVk0zyfeJ6Vwc4dwyMkDxXJCCXJLY5dp2S5vqdLrLzarXCZLjcaWlb3yyBv4qjaNVacu9Qae23qiqpR9yOUE/JeOqh1bVTGWb3ieQ8S5+XE+pW0bOdJalvV4orhaKWVkEU7XOqj1WNwePHtXSltyNssWKW7ketlqe0HQdm1jTD3thhrY24hqY/ib4HvHgspf8AU1isEHSXe6U9OQPhLsud5NHFWmlNbab1PI+K03BskzM5ieN15A7QDzC9OSKnH2kcurtObQ7DRNt9RbKDVdppxuwxTxCRzW8urnrt9CsBIzRz/srls4vNBUtA6T3apeACePAO8+S9JoQDzWam0bFf4r8uR5lZ/sDADu6I1FVuBbuiSqIBzxGd0BbRANc3WwzWXSmkotL2iZwMpHVlk5cS53E8uxdxwO4KK8c5bcuQdyfdv8WzitHpyp0/aoaWWllja3gXubjed2nK1DWWko7jI6uoyI6rHWbya/8AzXaNodzaIm2yMAuOHyHu7gub3m4Utvp3VFVIGMHzJ7gqhdKWNlPsZNv75Flxpu+hSsWxommNU3TTNU2grmvdStOHRP5s8Qup2K8UV6ohVUUm8zO64Hm09xXGtQXKo1Nc44KSlwM7sbQ3rHzK6ds+02/T1tcJ5S+onw6RoPVae4K/aVdfZBca/wAFL17Fxa/bi/af6mzoigpkq4RRReczwgryzSdFc4Hd7sH14Kzwp4HlkzH/ALLgVpyalbTOHimjZVPgnGXgzgXt12rotQWC7tZwlhmp3u/slrwP8bl5rXsT25KHp9n9quDRxguDAT+6+OQH6hq8dqvaBZx4MU+7dfqWTLW1rCIimTmCIiAIiIAvcXseQiHYnTTAY6Waoef/AHHN/wCleHV7s9k8AbA7Ue9tSf8A7EygPSP/AI0F4yX7nVie835M2NxySe9QyoIrclyKuyOVDeKKDs7pxzxwXoRbXK5UNuh6WuqooG/vuwT5DtWqXnWGkrnSTW2pqZnRSjBe2I8PFYDT1tpLxrSso9XVM4qw/wCxiLt1r+PIHuxjAC6X/shpr3U0ws9MGFu7kN6w9eaq2f6QrHs7PgLbiaFXwqcpvfyOPX3SRgoDdbXcIK63t47wduvb4Ed6raHvtQ6sZbKlxexwxEccWkDl5Knr/TNfpmqdHDJJJap3b0ZzwBHY7xWI0nXUlDd456xhLeQd+we/C4s3scvHc6478v1LBhdrVJKct/48zqPasbqe2T3a0SU1LFJLOCHsYwZLiOxZJrg4BzSC08QR2rpWgDap6ASU1KyKrjAZKeZPj6qq4Fbnctns1zJTLu7Kpvbc57oHWWnqnQU2zrVbKi1yGN0YqXM6oJdvN3hzGDjw8lrEWyq4T1EgpNT6ZkhDurKa8DI7yMZC7rqDSenr6D+krZDK8nPSAbr/AJjyC1OXYzpR0rnsluEbT91swwPorr6ymlxIrUZRi24vbf5mlR7LtNW6ITal2iWuDB60VGOmPLlnOfopoqrZnZ3Mg0zp25asuXJr6okR5790Dj5ELodt2T6NpDl9FNVHIP28pIz5DC2+22q225gZQ0NPTNHZHGAjyF+FHjs395t/p9DlLNJaq1TC2p1hWwWOyQjfbb6QCNrAO8DgPMklaDrrWTZANP6UDrdY6UlrRESHVB7XOPMg93+h2PbzdTbdn9RGxwD6yRsHPsPE/h9V5iDmhpHesYtz5yOihbrfYjK6SR2XyOJ8VXoayuoH79HVzQuHIscQqG83PAqcEcO5bHt0Ohs3G1bT9TW+m6Ax2+pPLfmpGl2O7IwsTbNZ6ktdNVUlquMlDS1EhkdDFwawn9nOSPmsHxPFQKbGHZw8CpWVFTWzuqayoknlccue9xcSfMqvp66VNmvlLcqSV0csEgeC088HiPIjgrMEcuKhwY9pb8QK9M14HuChnbVUUFSw5bLG149RlVlYadBbYaBpxkU7OX9kK/WBCPqFZXm4RW2gfUyniBhjf2ndgV6uea4uHvd2MEb8xQDd4ct7t/l6Lhz8r1alyXV9Drwcb1i1RfTvMBXzy1VTJUTOLnvOSVp+vaOnrbZiesipjE7faX8j4d62mqkEcTjvBpxwJ5LiuoxWOucjqysZUvJJBY/eGPyUDplEr7uPi2a5llyJquHDsVdN1FTQ3+ndROMjulABbw3hn8Cu1Vt9tVExxqq+njLcbzd8Ej0C4Ra/fzMGW9jzMeALBxHr2LZrdoitncH3GpEQ5lrTvOKvuLdOEWorcqGpYlN01K2W235s2S7bS6KN3RWuikqXngHvO635cz9FjG3TW2oM7krbbTnta3d4eGclZe06dtdtw6GAPkH9ZJxKy2Q0Lp2tn78vkjhXq1PKqG78XzNa0lV3a161itNdcZK1tTES4vJIacEjGT4LpWVyt8hj2q295zuuDWjj3ghdTW/E6SXgzi1WC44S26xRHKZUEXS0RexqXtfQifYhUTEZ6KWneP8A3Gt/6l4fXun2qwHez9c3HmGUx/8AsQrwsql6P8qJrwnL9iy5XWL8kERFPHMEREAREQBe6PZJkEmwi3MH3PeW/wDzyn814XXtb2LKoVOySSmDsmnrZ4yO7O67/rUB6Rr/AGsZeEk/qdWJ77Xkzd0UXjde4dxwoK3J7rcq7WzCItF2garqKarbYrNl1bJhr3s4lpPJo8VruujTBzkdOJizyrFXAm1/T2G51LYW3GCmvMJHRu3scexrj2LLbPtVyVrnWS9/Y3SDqje4dKO/z/FYvTGzSlfbpJr+6R9bUDeAY8jos+PaVr2qNC6istQyut0stbDCd5j2frI8csj+SpGdmYuotwfKXcy84eLLFjwKW68zsF3t9LdbdNQVkYfDK3B8PEeK87aqslRYbxNb5xncOWO7HNPIrp2ido9NUtZb7+8U1WOqJiMMf59xWX2mabj1DYnVNKA+rgYXQlp+Mc91RmJZZg29nb7r+9ztNI2fXB9Xa308uS6nOAe9p5LftLXN9qrmzjJjPVkb3hcv2Yuw+tj5EBpx81v0Hwrjz12GXJw5d5K1RVtPDI7NTzR1EDJ4XB0bxlpCqBaDom+e6SigqXfYSO6jifgP8it+HgpzFyY5EOJde8rWVjSx7OF9O4mCiOagFEc10o5TkPtLkPttkgcTuyVL8gHwb/NaCzR9qcR+u4/vruW1LSzdVaWmpI+FXD9pTO/eHZ6riVovkFFTGkvLjTVlO8xPa9pycLybnwrgJ3Sp0uLjPqVH6HtMsW7E6eJ37W9lYa56BuUIL6GaOpb+yeq7+S22n1DZntBZcYAe5zsfisvS19JUtHRVETz+68FYRtsiSc6KZ9DiVRBUUkzoKqJ8UjebXDBCpniF2DUtHZLhTdHcpIWOx1JC8BzfIrk91pYaKtfDS1cdXEPhkYuyq3jI2/H7N7plv2K90/RS3S/0Nvp270k8zWNHmVl9E6Hv2rqro6CncyBrgJZ3jDGA+Pb5L0FoLZXYNKV7bix8tbWNZhj5sYYe0tHetu6OC26Na8zfKdgigjjAADWhuB4KdSyPZGwvkcGtaMkk4AXKdoe2S1WqGSj06+Ovrs7vS84o/H95YkdCuU3sjoeq7pHabNNUvkaxxG6wk44lcA1Br6hpd9lCPfJs8XZ6mfPtWr3O7av1pUt99qaqpj3sgHIiZntwOCyln0TBGRJc5OlI5Rs4N9T2rRPS/W7FKfNLu7iQry4YNbi3zZgKivv+pJ3NYZpYy4fZs4Mb3ZWZtOhiSJLlPjjxjj/mtyp4oaaIRQRNjYOxoU5cpmjT6qVskRWRqltr9nl9SjQUFHQRdHSQMjHbgcT6q4LwpC/xUu9ldqSXJEY5NvdkxcVLlCUC9PDT7u4x7Q7U/ewTJF/zLrIXJ9SDc1raJTjdMkf/ADrq45c15ie9P4nmp84VPyIpnwUFEcSAF2voRJrHtYPEewOvjP3/AHZv/wA8R/JeGV7U9tCqFNshhpi4A1FZBEB34Dnf9C8Vqo+j/PHnLxk39CyZXKSXgkERFOnMEREAREQBervYRuTXWvUNpLutHUxzhvg9hH/bC8orunsWXj3DahU255wyvoXY4/fjcHD/AAl6idcq7TBsS7uf5M6MWXDaj1DcWdHXzs7nlW6yOqGdFdXnHCRocPw/JYvfU3p1nb4tdi70voQWRS42yj5k5zukjnhc92XWSer1TX3q6RkyQyODRIOPSE8TjwW/75WA1DZ6qpmFfaK+S317cZc09STHY4fmtGrYNuVjuFb5klo+QsWx8fR95uqmBK5fUV+02MFjG0cnZvtDfnxwrGVm02tBbLXCBp7GvY38BlUiPo5mt819S1+u4+2/GvzN01fouw3trqiRraKr5+8R4Gf7Q5H8VzB94vmj7l+jqK9Q18Q4dE13SMx3YPI+RVHV1svttpGS3e9dM+R2GRCZ7ie88cKjoG0iqr/f5m5jgPDPa7s+S65YksGp+sy3S7jfjyjkNcD3RsOkbJNbHTVU8jd+oaCY2j4O3C2inWrO1C+PU0lrqImxxZ3WO7c44fNbFTSZ5KuZnauanb1a3+RN08KjtHuMjGzK37R14NVCKGpcTPGOq4/eb/NaFA5bBpOqgprox84PWG413YCe9e4NzquXPk+poz6VbS+XNdDoQURzUB4KI5q1IqbIrXdUaM07qKCSO426EyyHJnjaGyg4xneHkOa2JF6nsexk4vdHGblsGt8jyaC+1MLc8BNEH4+WFhqnYZfocGivNHKR+0HM/mu/+CiFmpyNqyLPE4NbdhF4ncHXC9UsAxx6NhkOfXC3jS+xnStplZUVvTXSZpyBOcR/wjn65XSYvhUy3J8jXPIsly3KdLTwUsDYKaGOGJow1jGhrQPIKNRKIaeSZwyGNLj6DKnPDmtf1fqGz26zV7JrrRxVHu8gZG6Zu8XbpwMZ716aUm2ee9X671Vrqrdb4AaajDiPd4CQ0jve7t/DwVGxaKhhc2e5vEz+fRN+EeZ7VS2ZyZlr2ceJa78VuqksbHg4qTPMzKnXJ1Q5IRtbGwMY1rGgYAaMAKJKlyoEru2IpsiTkqUrFT6itEMjozVb72nBDGOdx+Sq0dzkrzi32m6VeeAMdMd35ngtM8iqHvSS+ZuWNbLmosmr658M7KSlo562rkGWwwtycd57gqt5tesqCyzXie20dLTQMD5GSS70mM9gHBXFqvzNn9dWXDUdDKLncGN6CjjLXGONvAFzs4GTngMq7l2hQ600bqShmtxopIaXpGfab4c3I58Bg5wq1l6tlyt3oX9Pdc/H4EtTgwjFOS3ZYU8hlp45cY32B2PMKplWttP+7qbjn7Jv4BXCtcehBy5No1HVbidW2kBpOHsP+JdVEmQuU37MuurXG3sfHn+JdOa9bMKG8rH5m7Nr4qq/gXQcq9COlrIWftPA+qsmu8VldMR9LeIuGQwFx+Syz7OwxrLPBP6EdVTxWRj5nFfbuuLW2vT1pDutJUyTlvgxgH/cK8oruntp3j3/AGoU1uYcsoKFueP35HFx/wAIYuFqvaJU68GtPv5/myVypb2sIiKWNAREQBERAFtWyK9jTu0uwXZzt2OKsY2U5x9m/qO+jitVRYWVqyDg+jWx7F7Pc+lGqWdLR0tWP7Dj/ryK15Q2P34a02PW2uLw+o92DZcdkrOq75lpPqhBzjtXH6L2t40seXWttfv/ACY6jD+qprpJDKge9R5KUnCsxw7A8lK9zWNLjwAGSUJJK1/aDcTbdM1D2HEkuIm+vP6LGyahByfcbaqnZNQXecy1hc5L7qKR8ZLow7ooW+GfzW+2OhZbrbFTMHEDLj3k81oeh6T3y+Mkc3LIBvu4dvZ9V0rC+X69lyssUH8WfR9OoVcOS8jT9fWxziy6QAh8eBIRzx2FZLSV2ZcKQFzh00YxID2+KzcrGyMcx7QWuGCD2rnl5tFfYa81tE93QEnD2/dB+6Vy47hl1dhN7SXR/sdE96pdounebvTarszq00hqt1wO7vOaQ3Pmtnhfloc05B5ELh9kt0l3ufukbwx7w5wJHDI48Vslh1JX6bqTbLvBK6Bh4A/Ezy7wtmVpUVype8kun8GFeU3765HdbPql1PCyCsidI1owHtPW9Qtit97t1Zjo6hrHfsv6pXCblrOJk9O22Upr45WFx3Cd4HuxhZXTd0uVxfJLVW51FAP1e+es70WMMjLogpWLl59f5Oa3Bx7ZPh5M7lkK2rrjb6BodW11NSg8jNK1mfmVz+iuddSkdBUyAD7pOR8lh9Qaesmp673m6ipiqnkb00cxwR3bp4D0XVVqtMvf3RxT0myPPfdHQK3W+kaJpdPqG38OYjmDz8m5WBn2w6IicRHW1E/iynd+YCwVLsr0nE0b0VTNx5umP5LKwaA0hEQRZYHEHPWJK2PVcddE2aPVoLqWdx262OFm7brTXVT++Qtjb+JP0WHdtc1vdWubZNK7pJ6rxE+UY88ALe7dpnT1A4SUVnoonjk5sQz81mYw1gw1oA8Atc9aS9yH5hUVruOUx2janqrhery610chy5gcA7Hg1v5lX980RZdN6Gu1WGvrKwUrv6ROd4gkY4DsXS+fYtT2vSiHZ3dnntY1o9XtC5Fn35FsYt7LdckbI8uSOMbMWuElY8/Dhoyt3J7lo2zAnpK0ceTfJbuvoWKv6SK/qH/IkRUpPAhRUCQAug4i70DetP6X2e/pa60fSGW4yxbzIQ57ncSBx8AVSuW2+jiaWWewyHudO8MA9G5/FU9IaWh1js7NBNXGjZTXWSUvDQ7PDGOPmrqn0bstsDg+6XmCrlYclstSOP8AcavnVqxO2n2qcpbvkty1x225lvNs31BrWeLUOobzT0stTG1whiiLuiZjg3iRhZu86Msektm98/R29LPNT7sk8jgXO4jh3AeC5prLVOoNVX+rpbNPXS27fLKampmuAdGDgEtHfz4rYaGwX6xbJL869Nkg95fE6GF78ubxGSR2Z4cPBZzrvSgrLEua2ivj+x609ubJbc4MttNvc+ib+AU75XHlwCtqXIpomnmGNH0VXPDC+jRjsioze8ma3Aw1O0mmaQSI8O+TcrpQK55Y8v2kOLTwZEc/wroPJb9PXszfmySv92C8kVQ5bLpBm5T1daexu40+P+sLQ7rdmUn2UQEk3d2BZTaTfpNG7Dq65zSNZWSUrjH2faydVg9N4H0Vd9JtSqnV6lS95zaXw5mdGJKG18lsjxftdvY1FtLv92a7ejlrHtiOc/Zs6jfo0LVURd1dargoLolscMnu92ERFmeBERAEREAREQHpz2H9XCGsuekKmXAf/S6UF3k2QD/Afmu8X2l90uUkYGGuO83yK8FbPNSVGktZ2zUFOSTSTh0jQfjjPB7fVpK+gtdNTX7TNHe6CQTRuibI17fvMcAc/UFQkJ+oaqpv3LeT+Pd9+Z0Tj22O13x+hgFK/koEqXKumxFJERwXMdsVcX19JQNOWxsMjuPaT/kumnnhcT13UOqtV1hcMYeIwOfAcFH6lPhp28SW0iriv38DZtndMI7O6oIG9K88cccBbMrKx0raK009M053WDj3lXq+R5dva3Sn4s+hVR4YJECgjbICx7Q5p4EEZBUVVhbkrnNhC1Wq3UcrpqWkhikcMFzW4OFdXK10NzpzBXU7JWnkTzHkUY7dPDkruNwKz7SfFxb8zWktttuRrlp0Xb7bd47hT1FR9nndjJGOIwtmLAOIUQVMlt9lr3m9z2EYx5RJWFVAMhSqIOFqMuS5FwzV1ttlTBbrpK6KSQdR5HVx4nsW0xva9jXscHNcMgg8CFznVNmgvdtfE4Bs7ATDJ2td/JW2xbU88r5dM3N/29OD7uT3Dm30UhGiFuP2kOseq/ch8qpwnuujOqNcVVY4FUBzUzHYK5DkLhpwVpW3J27s5rhw6z4hz/fBW6A54rQ9u0jToKeEPZvmWN26XDOA7mF04S3yIfFHiXM5bsx/VVhx95q3Mlabs06tJVu7S9v4LbiSV9Pxl/TRXc9/7iROXKVxJBUpPipS/sXRscO5Y01mu962RCmtFPJVSi9ucWRniG7hBz4ZIVtZtkl/L21l8dT0NDEd+fek3n7g4nAHgrmw3LWFip6i32eqo6akkqHTBzmbzxvY7xjsU1xlvt2w296gq6yIc4GYijd5hvNVRabqDslGGyi23v3liefTCPvGZ/8AEW5mJ0OmdL0tBTOH2csvDh37owFh62q1BeIty/XqeqiJyaePEcZ8wMZU7cBoa0AADAA7EJwprF0TEx3xKO78XzIm7ULZ8lyQxwACg44UHO4c8Ba5f7+1gdR289LO7qlw4hvl3lSVtsao8UjmoonfNRiU7DdIqXWdZOWh2/mMeP8ArC2eW8VsodgtjaeAAHH5rVdPWh1O41dUd6d/HB+7/ms6FS8rV793CqbUfIulWDUknJbtGR0fbHXfUVNSkEs39+U9zRxK0X23tWtlq7Xo6kk6sf8AS6lrXcubYwR/Gfku06ChptP6Vr9T3J7YWGNzg93DdjaCSfofkF4a2h6kqNW6zueoKgkGrnLo2k/BGODG+jQFzaLR6xmO19IfVkZq1/4EYBERXQgQiIgCIiAIiIAiIgC9c+xjr1lxsVRoi5zB09E0vpQ8/HATxaP7JPycO5eRlmtD6jr9J6pob/bnkTUsgcW5wJG8nMPgRkLg1LDWZjuvv6r4m2mzs57nvO80bqGufBg7vNh7wrM8GrM2a62/XWiqK/WmQS9JEJGd/i0+IOR5hYZ/AYXfoeo+u4+0/fjykvPx+ZpyaOyny6PoSri9yjMut5WSM+Kq3SC0DtXaOXE8lylrPeNps5AJa2UvOfBv/wCLXr9qhR1582SmhQcrW+7kbu0YAA7FEJhTNXygvhAN4q4iGAqbRkhVhwCIxkyKmY8tPgtcoamrh1w+1zSF0daA6m3jgZxyBPlhbJPDLBK6KaN0b2nBa4YIXRdjyqUZPo1uaYWxk2u9FdkoKnDwrIHB4Kqx659jYXYcogqg16qBy82PRUxmallhDywyMLQ4cxkYyub7KrTW/wDiRHGT0clE5z5t48SOR885XSQ4LAXandpnbJbKkMDIbiyMEeLxun68VL6a5dlbFeBH5zS4UdXPJQUylUYRxGWpipqaSed4ZFE0uc48gAvPGrqut1dcrtqAEst9IBHFvOwAM9VvmeJW87Y9ROn6LSNq35a2qewS9HxwCeDPMnj5YUu03TzdH7G7fa2ECqqKxj6p4++7dcceQwPkrJpGJwR7WXV9PgYykotLvZpuzkgUFSSMfaAD5LZ3P7gtc0Ezdsm/ggvkOc9q2EkdqvGNHaqJWc2W98hvZ5lQJClLu5S+K6TkJy49ilJUCc8ApJZI4mF8j2saO1xwh516E+VbV1ZTUURkqZWsHYO0+Swl21NGPsLYwzzO4B26cD07VjaWzV9fP71dZnNyc7pPWPh4KOy9Tqx115krh6TbdznyX6ka663C9zmloI3RQcnHOCR4n8lk7RaoKBu+ftJjzcezwCvIIYaeIRwMDGjuU6qGZqFuS+fQtGPi10R2gidvaVk9N2uW8XiChjyA45e79lo5lYnfDW+K6HQzUGz3QNbqe9vEUphMrgfiDfusH7xOPU+CirZNLaPV8kbL7lVDc5n7Y+uIbRpyl0FaZQySqYDUhh+CBvANP9oj5A968krNa41HX6s1TXX+4vJmqpC4NzkRt5NYPADAWFV40zCWHjqvv6v4lNvtds3IIiKQNIREQBERAEREAREQBERAdx9lPaedJ6iGm7tUEWm4SfZOe7qwTHh6NdyPjgr1Zqe3taRcKYZhk+MD7pXziXr72WdrceoLY3RmpJw64wR7sEkh/wCJiAx/G36jioPMjZp+Qs+hbr8a8V4/f8nVW1bDspfI3queY6V2OZ4LTaS0TQaqqLplhhljwB94Hh/JdC1bbzbgcDfgkP2blrKiPSPUI33xnTPeMo/lu/qWXQaOGh8S2fEQHNTtUoCnAVXJ8niHHKqqVgwFOeJ4L1IxbLLW1jnqtGRahocirtVUXktHHcw059Dg/NdI0hcLbrXSNNWzRxySFoZMB8TJBz8u/wBVX0fb2HTJhqYw5lVvb7HDm0jGPkuVRzXHZJrWVkkcs2n65+QeYx4fvD6hW3Er4seMJLuK1fLjtlwvmnyNw1Fpuqtr3SwNdPS9jgMlvn/NYFbpqrW9NBoSo1Fp+SnrywNw0nIbkgEuHPhnktX0JqjTmtpDRXGmjtt27Oidutm8W+Pgo/I0hv2qvyOzH1CSj/VXzLVriFc0UVRVztgponyyO5NaMrem6EthaD7zU/MfyWdsdmorPC6OlYd5xy57uLitNOjWyl/U5Iyt1aqMfY5s0y0aQuU9Qx1cwU8IOXZcC53hwWobdaCSr1taW6eEtRe6aAymGMb26xnWacd/Dl2rou1HWtPoyyCoMRmrKjLaaPsJHaT3DK5jsP1VbZdV3S4amrdy8Vpa2GWbqtLSeLR2Dsx4KdxcKrGi1HvI6WRdd/Vl3dEZzZ/ryjvhbbbjijuzBuvjf1RI4c93x8FsGsLvFYbBV3GRzQY2HowT8TjyCvdZ7O9N6r/pckXutbzbVU2A4+fYVpmotBamqzb7ZfLxBW2aGoEklURuyNaAeDu/gOfiuCzSIu1Sg/Z70IZEJdeRS2E6RqK6vk1ze278sz3OpMnOSchz8fQeqvvajJGj7fwyDWgHw6juP0+qvNSbV9MabpY7XYIRcZIW9GxkPCJgA4ce30XMdTX7V2uWtjuskdJbt7ebAxmMEcj3n5qdqqlN7QRzufDPtbHsilo0kafgBx28vNZbI71aW6kZQ0cdNGS5rBjJ5lSV9xo6JuaidrT2Nzkn0ViglXWlLuIC1u62Tgt92XpcFTnnihjL5ZGsaOZccBarW6plkk6K30xJP3nDJ+SoQ2q73R4luE7o2dzvyHYuHJ1Sihddzvx9Iut5y5IyF01VBFmOhZ0z+W993/NWMduu13d0twlMUZ4tDuzyCzVvtFDQ4MUQdJ+2/if8leSPDWkkgDxVay9Ztu5Q5IsOLplNHNLmWVBbaOgb9izL+17uJVy52Vjqi7wNk6KAGok7mcR81NH71I4PncGNx+rb+ZUXKM37UzvTS5IvC4BSOepC5ZzRmnqjUNyEYzHSxdaeXsa3uHiVplJRW7PJSUVuzM7NNOCvqf0xXs/oVM7LQR+seOzyC4J7Vm086s1EdNWmoJtFvk+1cx3VnmHD1a3kPHJXSfac2qU2lrKNDaVkEddJFuTPjP8Aw0RH/O76DivIqmdD09zl63av/wAr9ys6jmdpLgQREVqIoIiIAiIgCIiAIiIAiIgCIiAK4t1bVW6ugrqGokp6mB4kilYcOa4ciFbovGk1swe3dg+1S2bStOOsF8McF7hjxKzOOkA/rY/zHYfBT6mgrtNXH3e5RGSmefsKmMcHDxHYV4qs1zr7Pc6e52yqlpayneHxSxnDmkL2VsW2tWLadYv9mtTxwwXhrMPjJw2bH9ZEew97eY8QqTquj+rSd1Ud4PqvD/BO6fqUoey2XNJU09Szegla8eBV00LC6z0hX6aqjPC581C8/Zzs7PB2ORWJjulwERjFQ4gtxkgZHqof1RTXFXLdFkhmKS5o3UA8gtk0JbXVNxNVLHmGEdo4FxXIqO9akt1Wypoq+OXo+IZPGHD8FsFPtc1jSANms1tkbz+zY4fg5SGJp8VNTlNcu458nInKDjBdTvzGhoDWtAA5ADkrO92m3Xq3SW+50sdTTyDi145HvB5g+IXHY9uFe3PvGmQMDsmI4/wq8pNu9vMm7WWCphZ+1HMHn5ED8VNqD7iE7C1PfYjeNiEfSTOsd7lpo5B+pmbvDHdkEcPMKlcdjE1HYYJ7NcXOvdOS9z/gbIeYDf2SO9bBRbadHTNzKLhTnufCD+BKyEG1vQr5ADc5GjvMDsfgtnt95k5XI0uzbVNU6WLbTq+yT1TouHS4LJMY7TjDvNdj0pfKXUdhprvRhzI5253HEbzCDgg4Wm3Laps8qo3QVNU6oa4EHNKXYB8wuT6S17HojVdYy1TvuWn6iQHccC0tHeM8nDl4raYOp2JtR2Z2S/aIl1LqYXDU9ayS10rv6HRRndaf3nnvPcsVtg0Lpivtsde+WO0VTA2KKoaw9Fw5NcBwA8Vru0rarpK+6adbqWK6SyyHeaY3dD0bhyJPHI8MLkFZqi/1tubbKu7Vc9I05EUkhI9TzPqiM6qbHs99tjcdFbRrxoevq7XUTi70MW9HHGJcsDhwDmO/Z8FZam1fq7XFU5kkssFA7A6CM7sTeWc/tce/K1GglbE4GCgEr++TLxnwAwsrG7UtX1GZgjHLgGD+a2cVEOdkjbKqxv8ApxW/i/4Mzb7dbLPH0ssjDKBxkeeXkOxS1uqKKFrhTtdO8cscB81joNMvkO/XVjnE8SGcfqVlaOz26l4sgD3d7+ssbderrXDSjVHRuOXFdLdmHdcb/dSWwRmCM9rBu/UqtR6YLn9LX1DnuPNrT+ZWxAgDA4KjU1cFOwulkDcdnb8lDX6nkXvkyVqxKaV7KI0dFSUjcU8LGeOOJ9VVlkZGwve4NaOZJWLluFXMQKOmw0/1kvAD0VsaB87t+vqXzHPwg4aFydm297H+7N/FtyRWqL7GZDFRQvqH8sgdVWbqWvrzmvqDHGf6piyMMcULd2GNrB4BTFyzVih/bW3n3mPN9SnTU9PSx7kEYYO09p9VUJUpK2HR2lq3UFRvAdBRMP2s7hw8h3laZzS9qTPJSUVuy20rp+t1BcBT07S2JpzLKRwYP5+CvNt20yz7LNMN09p7opr3Oz7NnPcz/WyfkO3yUm2fazYtmFjOm9Msiqb09mAzORFn+slP4N7fALxtebnX3i51FzudVLVVlQ8vllkOXOJXdpumSzZK65bQXReP+CBz8/f2IElxrau4109dXVElRUzvMksrzlznHmSrdEVxSSWyIQIiL0BERAEREAREQBERAEREAREQBERAFVo6moo6qKqpJpIJ4nB0ckbt1zSO0EKki8a3B6s2He0DSXSni0vtAdE2WQdEyskb9lP3B/Y1x7+RPcuh6u0B9k66aad7zTOG8acHLmj93vH+uK8ILrOx3bjqTQj4qCsdJdbM3h0Ej/tIR/5bj2funh5Ks5+huMnbicn3x7n8CSxc+Vb2mdVcHMeWSNLXNOCHDBCqAswui2e6aB2s2z3+0V0UVeG9ctG7Kw9z2H8fqtU1Po+92BznzQGel7KiIZbjx7vVQcbfa4Jrhl4Mn6siFi5GG6h54UslPTSj7SKN3mAqG+pmyYW7Zrob+JEv6It7uUDR5FSiw28ng14/vK5bJ4qqyRZK61fiZltFliNP2/OT0n8Sm/2ft3Ebr+P7yvt9R6ReesW/9mOGPgWMdgtjDkxOd4OcruO30EfwUsQ/u5UxkUDL4rF2WS6tnqUV3FdrY2cGsa3yCn3wBx4KzMuQqZ3HfEN4+JysOHfqe7l3JVwMON8OPc3iVRfWSk4ipnnxcQApA/HIAKBeSskku4bksoqphiScRN7RGOPzSGngiO81m8483OOSo7yZWXE9tjwqF3ioZUmVHKxPNyOUaHOcGtBJPAADiVnNNaUvF9cHU8Bip+2eXgweXf6LZ71c9BbKbb+kL1XxTV+PswRvSPPcxn5/VapW+1wQXFLwRotyIVrdsoaT0I50TbnqJ3utK0bwhJw9458f2R/rgud7b9v9FaaaXS2z4xGWMdFJWRjMcPeGftO8eQPeuW7YtuOpNdvloKN0lqszuHQRv+0mGf6xw7P3Rw81yZTuBobclbl833R7l8fEr+XqErOUSrWVNRWVUtVVzSTzyuLpJJHbznE9pJVJEVmS2IwIiL0BERAEREAREQBERAEREAREQBERAEREAREQBERAXlnulxs9wiuFqrZ6KriOWSwvLXD1HZ4L0Lsw9pyuomR27W1H75BwaaynaN7He9nI+Yx5Lzci48vAoy47Wx38+82V2zre8We9rfBs52iUZr9OXOminIy73ZwG6cffjPFvPuCwF92eagt2ZKeEV8A5Pg4nH9nmvGNurq221bKu31c9JUM+GWGQscPULsGhvaP13YAyC6GC+UzeH23Ul/jbwPqCq7foWTTzx58S8H1/MlKdUa5TOhyxywSGOaN8bwcFrhghQDlsNi9oPZlqljKfUtCbdM7hmrg3mjykZnHqAtrpNO7PdTwe86cvceHDI92qWzNHmMk/UKMslbQ9r63H6EnVm1z6M5qHlR3lv1Vsurg7NBdKSpb2B+WH81i6nZ/qaAn/AHeJQO2OQFYrIql0kdKtjLvNV3uKErNTaWvsX6y1VI8mEq2dY7m34qCpH/pn+S2KcPEzT8zHZUQVkG2O5uOBQVJ/9M/yVzDpe+zfq7VVH+4Qjsiu8b+ZhsplbTTaB1LOR/u7oge2R4CytJswuBd/TrnSUzf3cvP5LU8ipfiMHZBdWaFlTRMkleGRsc9xOAGjOV0Ws0/oDTMHvGo77GA0ZPvFQ2Fp8hkH6rU777QWzHSzHwaaoTcZ28M0kG60+cj8Z9AVnXK2/lTW5fT8znszaodWZCx6Cv1x3ZJoBQwHm+fgceXNZu5RbPNn1GK/U10ppZgMtFQ4dY/uRji7l3Fectc+0fru/h8FqMFjpncPsevL/G7gPQBcfuNfW3KrfV3Crnq6h/xSzSF7j6lSdGhZN3PIlwrwXX8yMu1VvlA9D7Tvabrqxklu0RRe5wYLRWVDRvY/cZyHmc+S893i6XG8XCW4XWtnrauU5fLM8ucfU9ngrNFYsTAoxI7VR28+/wDMirLZ2PeTCIi7DWEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBVKaeemmbNTzSQyt+F8bi1w8iFTRAbnZNqm0Szsayi1bc9xvJs8nTgekgK3S1+0rtJo90TPtVaBz6WmLSf4HNXGEXHZp+Lb79afyNkbZx6M9F0ftXakYB73pqhlPb0dS9n4hyyEfta1oHX0WHHwumP+yV5kRcr0LAf/AM/1f8mxZVq/Eem5Pa1rSOposNPjdM/9kLH1ntXakeD7rpqhiPZ0lS9/4Bq86Ii0LAXSv9X/ACHlWv8AEdnuntK7SazeEL7VRA8uipi4j+Nzlpd72qbRLwxzK3Vtz3Hc2wSdAD6Rhq0xF1V6fi1e5Wl8jXK2curKlTPPUzOmqJpJpXfE+Rxc4+ZKpoi7DWEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREB/9k=";

const TYPES = [
  { id:"payroll", label:"Payroll", icon:"👤", color:"#D4A90A", desc:"Employee records" },
  { id:"contract", label:"Contract", icon:"📋", color:"#D4A90A", desc:"Rate grids" },
  { id:"bulletin", label:"Bulletin", icon:"📄", color:"#2E7D32", desc:"Wage+fringe" },
  { id:"salary_schedule", label:"Salary Sched", icon:"📊", color:"#f59e0b", desc:"Group×level" },
  { id:"progression", label:"Progression", icon:"📈", color:"#D4A90A", desc:"GWIs+steps" },
];

const US_STATES = ["National","Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming","District of Columbia","Puerto Rico"];

// Map seed employers to states
const SEED_STATES = {
  "City of Los Angeles": "California",
  "City of Glendale": "California",
  "City of Santa Monica": "California",
  "City of Culver City": "California",
  "City of Long Beach": "California",
  "City of Pasadena": "California",
  "City of Burbank": "California",
  "City of San Francisco": "California",
  "City of San Diego": "California",
  "City of Oakland": "California",
  "City of Sacramento": "California",
  "City of San Jose": "California",
  "Pacific Gas & Electric": "California",
  "NECA / IBEW Local 11": "California",
  "LAUSD": "California",
  "United Parcel Service": "National",
  "UPS": "National",
  "City of New York": "New York",
  "New York City": "New York",
  "NYC": "New York",
  "ADMIN FOR CHILDREN'S SVCS": "New York",
  "City of Boston": "Massachusetts",
  "City of Chicago": "Illinois",
  "City of Houston": "Texas",
  "City of Phoenix": "Arizona",
  "City of Philadelphia": "Pennsylvania",
  "City of Seattle": "Washington",
  "City of Denver": "Colorado",
  "City of Portland": "Oregon",
  "City of Miami": "Florida",
  "City of Atlanta": "Georgia",
  "City of Dallas": "Texas",
};

// Detect if an "agency" is really a department within a known city/government
const AGENCY_TO_EMPLOYER = {
  // NYC agencies
  "admin for children's svcs":"City of New York","nypd":"City of New York","nyc police":"City of New York",
  "fire department":"City of New York","dept of education":"City of New York","dept of finance":"City of New York",
  "dept of health":"City of New York","dept of transportation":"City of New York","dept of sanitation":"City of New York",
  "dept of correction":"City of New York","dept of buildings":"City of New York","dept of parks":"City of New York",
  "human resources admin":"City of New York","law department":"City of New York","office of the mayor":"City of New York",
  "dept of social services":"City of New York","dept of environmental":"City of New York",
  "housing preservation":"City of New York","dept of homeless":"City of New York",
};

const detectEmployer = (records) => {
  if (!records.length || !records[0].agency) return null;
  const agency = (records[0].agency || "").toLowerCase().trim();
  const dept = records[0].department || "";

  // Check explicit mapping
  for (const [pattern, emp] of Object.entries(AGENCY_TO_EMPLOYER)) {
    if (agency.includes(pattern)) return { employer: emp, dept: cleanTitle(records[0].agency.replace(/\b\w/g, c => c.toUpperCase())), state: SEED_STATES[emp] || "" };
  }

  // Heuristic: if agency looks like a govt department (contains "dept", "admin", "office", "board", "commission", "authority")
  const govWords = ["dept","admin","office","board","commission","authority","bureau","division","district","housing","human","public","social","fire","police","sheriff","corrections"];
  const isGovDept = govWords.some(w => agency.includes(w));

  // If has "Work Location Borough" data (NYC pattern), treat as NYC
  if (dept && ["manhattan","bronx","brooklyn","queens","staten"].some(b => dept.toLowerCase().includes(b))) {
    return { employer: "City of New York", dept: cleanTitle(records[0].agency.replace(/\b\w/g, c => c.toUpperCase())), state: "New York" };
  }

  // If agency looks like a standalone employer (contains "city of", "county of", company name)
  if (agency.includes("city of") || agency.includes("county of") || agency.includes("state of")) {
    return { employer: cleanTitle(records[0].agency.replace(/\b\w/g, c => c.toUpperCase())), dept: "", state: "" };
  }

  // If gov-like, return as department with generic city
  if (isGovDept) {
    return { employer: records[0].agency, dept: "", state: "" };
  }

  return { employer: cleanTitle(records[0].agency.replace(/\b\w/g, c => c.toUpperCase())), dept: "", state: "" };
};

const PROMPTS = {
  payroll:"Return ONLY JSON array: [{employee_name,role_title,department,base_pay_annual,overtime_pay,other_pay,benefits,total_compensation,year}]. Numbers only. No markdown.",
  contract:"Return ONLY JSON array: [{classification,department,progression_step,rate_basis,base_wage_hourly,rate_2022,rate_2023,rate_2024,rate_2025}]. No markdown.",
  bulletin:"Return ONLY JSON array: [{classification,rate_basis,base_wage_hourly,fringe_pension,fringe_health,apprentice_pct,notes}]. No markdown.",
  salary_schedule:"Return ONLY JSON array: [{pay_scale_group,pay_scale_level,basis_type,annual_salary,monthly_salary}]. No markdown.",
  progression:"Return ONLY JSON array: [{classification,progression_family,progression_start,progression_12mo,progression_24mo,progression_36mo,progression_48mo,top_rate_formula,gwi_2023,gwi_2024,gwi_2025}]. No markdown.",
};

function parseCSV(text) {
  const lines = text.trim().split("\n"); if (lines.length < 2) return [];

  // Parse header row - handle quoted headers
  const rawHdr = lines[0].replace(/^\uFEFF/,"");
  const hdrs = [];
  let cur="", inQ=false;
  for (const c of rawHdr) { if(c==='"') inQ=!inQ; else if(c===","&&!inQ){hdrs.push(cur.trim());cur="";}else cur+=c; }
  hdrs.push(cur.trim());

  // Normalize header for matching
  const norm = h => h.toLowerCase().replace(/[^a-z0-9]/g,"");
  const hdrNorm = hdrs.map(norm);

  // Smart column finder - checks multiple patterns, returns first match
  const findCol = (...patterns) => {
    for (const pat of patterns) {
      const idx = hdrNorm.findIndex(h => h.includes(pat));
      if (idx !== -1) return idx;
    }
    return -1;
  };

  // Detect columns with priority-ordered patterns
  const iName       = findCol("employeename","fullname");
  const iFirst      = findCol("firstname","first");
  const iLast       = findCol("lastname","last");
  const iMid        = findCol("midinit","middleinit","middlename");
  const iTitle      = findCol("titledescription","jobtitle","title","positiontitle","position","classification","jobclass");
  const iBaseSal    = findCol("basesalary","basepay","annualsalary","salary","basewage");
  const iGrossPaid  = findCol("regulargrosspaid","grosspaid","regularpay","totalgross","grosspay");
  const iOT         = findCol("totalotpaid","overtimepay","overtime","otpay","otpaid");
  const iOther      = findCol("totalotherpay","otherpay","otherpaid","other");
  const iBene       = findCol("benefits","totalbenefits","benefitcost");
  const iTotal      = findCol("totalpaybenefits","totalcompensation","totalearnings","grandtotal");
  const iYear       = findCol("fiscalyear","year","calendaryear","payrollyear");
  const iAgency     = findCol("agencyname","agency","employer","organization","company");
  const iDept       = findCol("department","division","bureau","worklocationborough","worklocation");
  const iPayBasis   = findCol("paybasis","paytype","payfrequency","salarybasis");

  // Determine if this is a "rate + actuals" dataset (like NYC) vs "totals" dataset (like LA)
  const hasGrossPaid = iGrossPaid >= 0 && iBaseSal >= 0;

  const toN = v => { const x = parseFloat(String(v||"").replace(/[$,\s"]/g,"")); return isNaN(x) ? 0 : x; };
  const getVal = (row, idx) => idx >= 0 && idx < row.length ? row[idx] : "";

  // Clean ALL CAPS names → Title Case ("VALANTIA A RAPHAEL" → "Valantia A Raphael")
  const cleanName = s => {
    if (!s) return s;
    // Only apply if string is mostly uppercase
    if (s.length > 3 && s === s.toUpperCase()) {
      return s.split(" ").map(w => w.length <= 2 ? w : (w.charAt(0) + w.slice(1).toLowerCase())).join(" ");
    }
    return s;
  };

  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    // Parse row values handling quotes
    const vals = []; let c2 = "", q2 = false;
    for (const ch of lines[i]) { if(ch==='"') q2=!q2; else if(ch===","&&!q2){vals.push(c2.trim());c2="";}else c2+=ch; }
    vals.push(c2.trim());
    if (vals.length < 3) continue;

    // Build employee name from available columns
    let empName = "";
    if (iName >= 0) {
      empName = getVal(vals, iName);
    } else if (iFirst >= 0 || iLast >= 0) {
      const first = getVal(vals, iFirst);
      const last = getVal(vals, iLast);
      const mid = iMid >= 0 ? getVal(vals, iMid) : "";
      empName = [first, mid, last].filter(Boolean).join(" ");
    }
    empName = cleanName(empName);

    // Get and clean title
    const rawTitle = getVal(vals, iTitle);
    if (!rawTitle) continue;
    const title = cleanTitle(rawTitle.replace(/\b\w/g, c => c.toUpperCase()));

    // Get base salary rate and actual gross paid
    const salaryRate = iBaseSal >= 0 ? toN(getVal(vals, iBaseSal)) : 0;
    const grossPaid  = iGrossPaid >= 0 ? toN(getVal(vals, iGrossPaid)) : 0;

    // Handle pay basis - annualize hourly/daily rates
    const payBasis = iPayBasis >= 0 ? getVal(vals, iPayBasis).toLowerCase() : "";
    let annualRate = salaryRate;
    if (payBasis.includes("hour") && salaryRate > 0 && salaryRate < 500) {
      annualRate = Math.round(salaryRate * 2080);
    } else if (payBasis.includes("day") || payBasis.includes("diem")) {
      annualRate = Math.round(salaryRate * 260);
    }

    // Determine base pay: use annual salary rate for comparison purposes
    // If we have both rate + gross, use rate as base (the "job pays X")
    // If only gross, use gross as base
    let basePay = annualRate > 0 ? annualRate : grossPaid;
    if (basePay <= 0) continue;

    const ot    = iOT >= 0 ? toN(getVal(vals, iOT)) : 0;
    const other = iOther >= 0 ? toN(getVal(vals, iOther)) : 0;
    const bene  = iBene >= 0 ? toN(getVal(vals, iBene)) : 0;

    // Compute total compensation:
    // If explicit total column exists, use it
    // If we have actual gross paid + OT + other (NYC style), use that as total
    // Otherwise, use base + ot + other + bene
    let total = iTotal >= 0 ? toN(getVal(vals, iTotal)) : 0;
    if (total <= 0) {
      if (hasGrossPaid && grossPaid > 0) {
        // NYC-style: total = actual gross + OT + other pay
        total = Math.round(grossPaid + ot + other);
      } else {
        total = Math.round(basePay + ot + other + bene);
      }
    }

    const year = iYear >= 0 ? parseInt(getVal(vals, iYear)) || 2024 : 2024;
    const agency = iAgency >= 0 ? cleanName(getVal(vals, iAgency)) : "";
    const dept = iDept >= 0 ? cleanName(getVal(vals, iDept)) : "";

    rows.push({
      employee_name: empName,
      role_title: title,
      department: dept,
      base_pay_annual: Math.round(basePay),
      overtime_pay: Math.round(ot),
      other_pay: Math.round(other),
      benefits: Math.round(bene),
      total_compensation: Math.round(total),
      year,
      agency,
    });
  }
  return rows;
}

export default function WageBase() {
  const [records, setRecords] = useState([]);
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState("browse");
  const [log, setLog] = useState([]);
  // Upload
  const [srcType, setSrcType] = useState("payroll");
  const [employer, setEmployer] = useState("");
  const [unionName, setUnionName] = useState("");
  const [dept, setDept] = useState("");
  const [stateVal, setStateVal] = useState("");
  const [rawText, setRawText] = useState("");
  const [parsed, setParsed] = useState([]);
  const [parsing, setParsing] = useState(false);
  const [parseErr, setParseErr] = useState(null);
  const fileRef = useRef(null);
  const [pdfData, setPdfData] = useState(null);
  // Browse
  const [selEmp, setSelEmp] = useState(null);
  const [selRole, setSelRole] = useState(null);
  const [search, setSearch] = useState("");
  const searchChanged = v => { setSearch(v); setRolePage(0); };
  const [stateFilter, setStateFilter] = useState("all");
  const [lausdBasis, setLausdBasis] = useState("a");
  const [percentile, setPercentile] = useState(90);
  // Career ladder
  const [ladderMode, setLadderMode] = useState(false);
  const [ladderRoles, setLadderRoles] = useState([]); // [{role, base_avg, total_avg, count, ...}]
  const [savedLadders, setSavedLadders] = useState([]);
  const [selLadder, setSelLadder] = useState(null);
  const [rolePage, setRolePage] = useState(0);
  const ROLES_PER_PAGE = 25;
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState("desc");

  const addLog = msg => setLog(p => [`${new Date().toLocaleTimeString()} — ${msg}`, ...p.slice(0,29)]);

  // ── Load ──
  useEffect(() => {
    (async () => {
      let loaded = false;

      // Helper: safe storage get (returns null on any error)
      const safeGet = async (key) => {
        try { const r = await storage.get(key); return r?.value || null; } catch { return null; }
      };

      try {
        // Try chunked storage first
        const metaRaw = await safeGet("wb_meta");
        if (metaRaw) {
          const meta = JSON.parse(metaRaw);
          if (meta.chunks > 0) {
            let all = [];
            for (let i = 0; i < meta.chunks; i++) {
              const chunkRaw = await safeGet(`wb_data_${i}`);
              if (chunkRaw) all = all.concat(JSON.parse(chunkRaw));
            }
            if (all.length) { setRecords(all); addLog(`Loaded ${all.length} records (${meta.chunks} chunks)`); loaded = true; }
          }
        }

        // Try legacy single-key if chunked didn't work
        if (!loaded) {
          const legacyRaw = await safeGet(DB_KEY);
          if (legacyRaw) {
            const parsed = JSON.parse(legacyRaw);
            if (Array.isArray(parsed) && parsed.length) { setRecords(parsed); addLog(`Loaded ${parsed.length} records`); loaded = true; }
          }
        }
      } catch (e) {
        addLog(`Storage load error: ${e.message}`);
      }

      // Seed defaults if nothing loaded
      if (!loaded) {
        const flat = [];
        (SEED.payroll_raw||[]).forEach(p => flat.push({_t:"payroll",_e:"City of Los Angeles",_s:"California",n:p.n,role:p.t,base:p.b,ot:p.o,other:p.x,bene:p.bn,total:p.tc}));
        (SEED.pge||[]).forEach(c => c.steps.forEach(st => flat.push({_t:"contract",_e:"Pacific Gas & Electric",_s:"California",_u:"IBEW 1245",cls:c.cls,dept:c.dept,sap:c.sap,step:st.step,r22:st.r22,r23:st.r23,r24:st.r24,r25:st.r25})));
        (SEED.ibew||[]).forEach(r => flat.push({_t:"bulletin",_e:"NECA / IBEW Local 11",_s:"California",_u:"IBEW 11",cls:r.cls,wage:r.wage,basis:r.basis,notes:r.notes}));
        (SEED.lausd||[]).forEach(g => g.levels.forEach(l => flat.push({_t:"salary_schedule",_e:"LAUSD",_s:"California",grp:g.g,grpLabel:g.label,lvl:l.l,c:l.c,b:l.b,a:l.a})));
        (SEED.ups||[]).forEach(u => flat.push({_t:"progression",_e:"UPS",_s:"National",_u:"Teamsters",cls:u.cls,fam:u.fam,start:u.start,m12:u.m12,m24:u.m24,m36:u.m36,m48:u.m48,formula:u.formula,g23:u.g23,g24:u.g24,g25:u.g25,pt:u.pt,pa:u.pa}));
        (SEED.lausd_ci||[]).forEach(ci => flat.push({_t:"salary_schedule",_e:"LAUSD",_s:"California",grp:ci.tier,grpLabel:ci.label,basis_only:ci.basis,annual:ci.annual,monthly:ci.monthly,deg:ci.deg,_ci:true}));
        setRecords(flat);
        try { await saveChunked(flat); } catch {}
        addLog(`Seeded ${flat.length} records`);
      }
      setReady(true);
    })();
  }, []);

  // Strip non-essential fields to minimize storage size
  const compactRecord = (r) => {
    const c = { ...r };
    delete c._added; // timestamps not needed for storage
    // Remove zero-value numeric fields
    for (const k of ["ot","other","bene","r22","r23","r24","start","m12","m24","m36","m48","g23","g24","g25","pa"]) {
      if (c[k] === 0 || c[k] === null || c[k] === undefined || c[k] === "") delete c[k];
    }
    // Remove empty strings
    for (const k of ["_u","_d","dept","sap","notes","basis","formula","pt","fam","grpLabel","deg"]) {
      if (!c[k]) delete c[k];
    }
    return c;
  };

  // Save records in chunks of ~4MB each
  const saveChunked = async (recs) => {
    const compact = recs.map(compactRecord);
    const json = JSON.stringify(compact);
    const sizeMB = json.length / (1024 * 1024);

    if (sizeMB < 4.5) {
      // Fits in single key
      await storage.set(DB_KEY, json);
      await storage.set("wb_meta", JSON.stringify({ chunks: 0, total: recs.length, sizeMB: sizeMB.toFixed(1) }));
      return true;
    }

    // Split into chunks
    const CHUNK_MAX = 4 * 1024 * 1024; // 4MB per chunk
    const chunks = [];
    let currentChunk = [];
    let currentSize = 0;

    for (const rec of compact) {
      const recJson = JSON.stringify(rec);
      if (currentSize + recJson.length > CHUNK_MAX && currentChunk.length > 0) {
        chunks.push(currentChunk);
        currentChunk = [];
        currentSize = 0;
      }
      currentChunk.push(rec);
      currentSize += recJson.length + 1;
    }
    if (currentChunk.length) chunks.push(currentChunk);

    // Save each chunk
    for (let i = 0; i < chunks.length; i++) {
      await storage.set(`wb_data_${i}`, JSON.stringify(chunks[i]));
    }
    // Save metadata
    await storage.set("wb_meta", JSON.stringify({ chunks: chunks.length, total: recs.length, sizeMB: sizeMB.toFixed(1) }));
    // Clean up old single key if exists
    try { await storage.delete(DB_KEY); } catch {}

    return true;
  };

  const save = async (recs) => {
    setRecords(recs);
    try {
      await saveChunked(recs);
      return true;
    } catch (e) {
      addLog(`⚠️ Storage error: ${e.message}. Data kept in memory.`);
      return false;
    }
  };

  // ── Career Ladders ──
  useEffect(() => {
    (async () => {
      try {
        const r = await storage.get("wb_ladders");
        if (r?.value) setSavedLadders(JSON.parse(r.value));
      } catch {}
    })();
  }, []);

  const saveLadder = async (name, emp, roles) => {
    const ladder = { id: `L${Date.now()}`, name, emp, roles, created: new Date().toISOString() };
    const updated = [...savedLadders, ladder];
    setSavedLadders(updated);
    try { await storage.set("wb_ladders", JSON.stringify(updated)); } catch {}
    addLog(`✅ Saved career ladder: "${name}" (${roles.length} levels)`);
    return ladder;
  };

  const deleteLadder = async (id) => {
    const updated = savedLadders.filter(l => l.id !== id);
    setSavedLadders(updated);
    try { await storage.set("wb_ladders", JSON.stringify(updated)); } catch {}
    addLog("Deleted career ladder");
  };

  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleteRoleConfirm, setDeleteRoleConfirm] = useState(null);

  const deleteEmployer = async (empName) => {
    const filtered = records.filter(r => r._e !== empName);
    const ok = await save(filtered);
    const updatedLadders = savedLadders.filter(l => l.emp !== empName);
    setSavedLadders(updatedLadders);
    try { await storage.set("wb_ladders", JSON.stringify(updatedLadders)); } catch {}
    addLog(ok ? `🗑️ Deleted all data for "${empName}" (${records.length - filtered.length} records removed)` : `⚠️ Delete failed`);
    if (selEmp === empName) { setSelEmp(null); setSelRole(null); setSelLadder(null); }
  };

  const deleteRole = async (empName, roleName) => {
    const match = r => r._e === empName && cleanTitle(r.role || r.role_title || r.cls || r.classification || "") === roleName;
    const filtered = records.filter(r => !match(r));
    const removed = records.length - filtered.length;
    const ok = await save(filtered);
    addLog(ok ? `🗑️ Deleted "${roleName}" from ${empName} (${removed} records)` : `⚠️ Delete failed`);
    if (selRole && (selRole.role === roleName || selRole.cls === roleName)) setSelRole(null);
  };

  const addToLadder = (roleObj) => {
    if (ladderRoles.find(r => r.role === roleObj.role)) return;
    setLadderRoles(prev => [...prev, roleObj]);
  };

  const removeFromLadder = (idx) => {
    setLadderRoles(prev => prev.filter((_, i) => i !== idx));
  };

  const moveLadder = (idx, dir) => {
    setLadderRoles(prev => {
      const arr = [...prev];
      const newIdx = idx + dir;
      if (newIdx < 0 || newIdx >= arr.length) return arr;
      [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
      return arr;
    });
  };

  // ── Aggregations ──
  const empList = useMemo(() => {
    const map = {};
    records.forEach(r => {
      if (!map[r._e]) map[r._e] = { name: r._e, state: r._s || SEED_STATES[r._e] || "", types: new Set(), count: 0 };
      map[r._e].types.add(r._t); map[r._e].count++;
      if (r._s && !map[r._e].state) map[r._e].state = r._s;
    });
    return Object.values(map).sort((a,b) => b.count - a.count);
  }, [records]);

  const filteredEmpList = useMemo(() => {
    if (stateFilter === "all") return empList;
    return empList.filter(e => e.state === stateFilter);
  }, [empList, stateFilter]);

  const statesInData = useMemo(() => {
    const s = new Set(empList.map(e => e.state).filter(Boolean));
    return ["all", ...Array.from(s).sort()];
  }, [empList]);

  const roleStats = useMemo(() => {
    if (!selEmp) return [];
    const recs = records.filter(r => r._e === selEmp);
    const firstType = recs[0]?._t;

    if (firstType === "payroll") {
      const byRole = {};
      recs.filter(r=>r._t==="payroll").forEach(r => {
        const role = cleanTitle(r.role || r.role_title || "Unknown");
        if (!byRole[role]) byRole[role] = { role, bases:[], ots:[], others:[], benes:[], totals:[], employees:[] };
        const base = Number(r.base || r.base_pay_annual || 0);
        const ot = Number(r.ot || r.overtime_pay || 0);
        const other = Number(r.other || r.other_pay || 0);
        const bene = Number(r.bene || r.benefits || 0);
        const total = Number(r.total || r.total_compensation || 0);
        const emp = { n: r.n || r.employee_name || "", base, ot, other, bene, total };
        if (base > 0) byRole[role].bases.push(base);
        if (ot > 0) byRole[role].ots.push(ot);
        if (other > 0) byRole[role].others.push(other);
        if (bene > 0) byRole[role].benes.push(bene);
        if (total > 0) byRole[role].totals.push(total);
        // Keep top 100 employees by total comp for drill-down
        const emps = byRole[role].employees;
        emps.push(emp);
        if (emps.length > 100 && emps.length % 50 === 0) {
          emps.sort((a,b) => (b.total||0) - (a.total||0));
          emps.length = 100;
        }
      });
      return Object.values(byRole).map(d => {
        const safeMin = arr => arr.length ? Math.min.apply(null, arr) : 0;
        const safeMax = arr => arr.length ? Math.max.apply(null, arr) : 0;
        d.employees.sort((a,b) => (b.total||0) - (a.total||0));
        if (d.employees.length > 100) d.employees.length = 100;
        return {
          _t: "payroll", role: d.role, count: d.bases.length || d.employees.length,
          base_avg: Math.round(avg(d.bases)), base_med: Math.round(median(d.bases)),
          base_min: Math.round(safeMin(d.bases)), base_max: Math.round(safeMax(d.bases)),
          ot_avg: Math.round(avg(d.ots)),
          other_avg: Math.round(avg(d.others)),
          bene_avg: Math.round(avg(d.benes)),
          total_avg: Math.round(avg(d.totals)), total_med: Math.round(median(d.totals)),
          total_min: Math.round(safeMin(d.totals)), total_max: Math.round(safeMax(d.totals)),
          employees: d.employees,
        };
      }).sort((a,b) => b.base_avg - a.base_avg);
    }

    if (firstType === "contract") {
      const byRole = {};
      recs.filter(r=>r._t==="contract").forEach(r => {
        const cls = cleanTitle(r.cls || r.classification || "Unknown");
        if (!byRole[cls]) byRole[cls] = { cls, dept: r.dept || r.department || "", sap: r.sap || r.sap_job_code || "", steps: [] };
        byRole[cls].steps.push({
          step: r.step || r.progression_step || "",
          r22: Number(r.r22 || r.rate_2022 || 0) || null,
          r23: Number(r.r23 || r.rate_2023 || 0) || null,
          r24: Number(r.r24 || r.rate_2024 || 0) || null,
          r25: Number(r.r25 || r.rate_2025 || 0) || null,
        });
      });
      return Object.values(byRole).map(d => {
        const rates25 = d.steps.map(s=>s.r25).filter(Boolean);
        const rates22 = d.steps.map(s=>s.r22).filter(Boolean);
        return {
          _t: "contract", role: d.cls, dept: d.dept, sap: d.sap,
          count: d.steps.length,
          min25: Math.min(...rates25), max25: Math.max(...rates25),
          min22: Math.min(...rates22), max22: Math.max(...rates22),
          pctInc: rates22.length && rates25.length ? ((Math.max(...rates25)/Math.min(...rates22)-1)*100).toFixed(1) : null,
          steps: d.steps.sort((a,b) => (a.r25||0) - (b.r25||0)),
        };
      }).sort((a,b) => (b.max25||0) - (a.max25||0));
    }

    if (firstType === "bulletin") {
      return recs.filter(r=>r._t==="bulletin").map(r => {
        const wage = Number(r.wage || r.base_wage_hourly || 0);
        return {
          _t: "bulletin", role: cleanTitle(r.cls || r.classification || ""), wage, basis: r.basis || r.rate_basis || "", notes: r.notes || "",
          annual: wage ? Math.round(wage * 2080) : null,
        };
      }).sort((a,b) => (b.wage||0) - (a.wage||0));
    }

    if (firstType === "salary_schedule") {
      const byGrp = {};
      recs.filter(r=>r._t==="salary_schedule" && !r._ci).forEach(r => {
        if (!byGrp[r.grp]) byGrp[r.grp] = { grp: r.grp, label: r.grpLabel, levels: [] };
        byGrp[r.grp].levels.push(r);
      });
      return Object.values(byGrp).sort((a,b) => Number(a.grp) - Number(b.grp));
    }

    if (firstType === "progression") {
      return recs.filter(r=>r._t==="progression");
    }

    return recs;
  }, [selEmp, records]);

  // ── Upload handlers ──
  const handleFile = e => {
    const file = e.target.files[0]; if (!file) return;
    const name = file.name.toLowerCase();

    if (name.endsWith(".pdf")) {
      setPdfData({ name: file.name, sizeKB: Math.round(file.size/1024), status: "extracting", pages: 0, text: "" });
      setRawText("");
      addLog(`Loading PDF: ${file.name} (${Math.round(file.size/1024)}KB)...`);

      // Use pdf.js to extract text client-side
      const reader = new FileReader();
      reader.onload = async (ev) => {
        try {
          const arrayBuf = ev.target.result;
          // Load pdf.js from CDN (disable worker to avoid CORS issues)
          if (!window.pdfjsLib) {
            addLog("Loading PDF.js library...");
            const script = document.createElement("script");
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
            document.head.appendChild(script);
            await new Promise((resolve, reject) => {
              script.onload = resolve;
              script.onerror = () => reject(new Error("Failed to load PDF.js"));
              setTimeout(() => reject(new Error("PDF.js load timeout")), 15000);
            });
            window.pdfjsLib.GlobalWorkerOptions.workerSrc = "";
          }
          const loadingTask = window.pdfjsLib.getDocument({ data: new Uint8Array(arrayBuf) });
          const pdf = await loadingTask.promise;
          const totalPages = pdf.numPages;
          addLog(`PDF opened: ${totalPages} pages`);
          let fullText = "";
          for (let i = 1; i <= totalPages; i++) {
            try {
              const page = await pdf.getPage(i);
              const content = await page.getTextContent();
              const pageText = content.items.map(item => item.str).join(" ");
              if (pageText.trim()) fullText += `\n--- PAGE ${i} ---\n${pageText}`;
            } catch (pageErr) {
              addLog(`⚠️ Page ${i} skipped: ${pageErr.message}`);
            }
            if (i % 20 === 0 || i === totalPages) {
              setPdfData(prev => ({ ...prev, pages: i, status: `Extracted ${i}/${totalPages} pages...` }));
            }
          }
          if (fullText.length < 100) {
            addLog("⚠️ Very little text extracted — PDF may be image-based");
            setPdfData(prev => ({ ...prev, text: fullText || "(No text found — try pasting content manually)", pages: totalPages, status: fullText.length < 50 ? "warning" : "ready" }));
          } else {
            setPdfData(prev => ({ ...prev, text: fullText, pages: totalPages, status: "ready" }));
            addLog(`✅ Extracted ${Math.round(fullText.length/1024)}KB text from ${totalPages} pages`);
          }
        } catch (err) {
          addLog(`PDF extraction failed: ${err.message}. Try pasting text manually.`);
          setPdfData(prev => ({ ...prev, status: "error", text: "" }));
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      setPdfData(null);
      const reader = new FileReader();
      reader.onload = ev => {
        setRawText(ev.target.result);
        if (name.endsWith(".csv") && srcType === "payroll") {
          try {
            const r = parseCSV(ev.target.result);
            if (r.length) {
              setParsed(r); setParseErr(null); addLog(`Parsed ${r.length} from CSV`);
              // Auto-fill employer, department, state from data
              if (!employer) {
                const det = detectEmployer(r);
                if (det) {
                  setEmployer(det.employer);
                  if (det.dept && !dept) setDept(det.dept);
                  if (det.state && !stateVal) setStateVal(det.state);
                  else { const auto = SEED_STATES[det.employer]; if (auto && !stateVal) setStateVal(auto); }
                  addLog(`Auto-detected: ${det.employer}${det.state ? ` (${det.state})` : ""}${det.dept ? ` — Dept: ${det.dept}` : ""}`);
                }
              }
            }
          } catch {}
        }
      };
      reader.readAsText(file);
    }
  };

  const handleParse = async () => {
    const hasText = rawText.trim();
    const hasPdf = pdfData?.text;
    if (!hasText && !hasPdf) return;
    setParsing(true); setParseErr(null); setParsed([]);

    // CSV auto-parse for payroll
    if (srcType==="payroll" && hasText && rawText.includes(",") && !hasPdf) {
      try {
        const r=parseCSV(rawText);
        if(r.length){
          setParsed(r);setParsing(false);addLog(`CSV: ${r.length} records`);
          if (!employer) {
            const det = detectEmployer(r);
            if (det) {
              setEmployer(det.employer);
              if (det.dept && !dept) setDept(det.dept);
              if (det.state && !stateVal) setStateVal(det.state);
              else { const auto = SEED_STATES[det.employer]; if (auto && !stateVal) setStateVal(auto); }
            }
          }
          return;
        }
      } catch {}
    }

    // For PDFs: chunk text and send multiple API calls
    const sourceText = hasPdf ? pdfData.text : rawText;
    const CHUNK_SIZE = 14000; // ~14k chars per chunk (safe for token limits)
    const chunks = [];

    if (sourceText.length <= CHUNK_SIZE) {
      chunks.push(sourceText);
    } else {
      // Split on page boundaries
      const pages = sourceText.split(/(?=\n--- PAGE \d+)/);
      let current = "";
      for (const page of pages) {
        if ((current + page).length > CHUNK_SIZE && current.length > 500) {
          chunks.push(current);
          current = page;
        } else {
          current += page;
        }
      }
      if (current.length > 100) chunks.push(current);
    }

    addLog(`Parsing ${chunks.length} chunk${chunks.length>1?"s":""} (${Math.round(sourceText.length/1024)}KB total)...`);
    let allResults = [];

    try {
      for (let i = 0; i < chunks.length; i++) {
        if (chunks.length > 1) {
          addLog(`  Chunk ${i+1}/${chunks.length}...`);
          setPdfData(prev => prev ? { ...prev, status: `AI parsing chunk ${i+1}/${chunks.length}...` } : prev);
        }

        const resp = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 8192,
            system: PROMPTS[srcType] + "\n\nIMPORTANT: Return as many records as you can find. Be thorough.",
            messages: [{ role: "user", content: `Employer: ${employer}\nUnion: ${unionName}\nDepartment: ${dept}\n\nExtract all wage/rate data from this text:\n\n${chunks[i]}` }],
          }),
        });
        const d = await resp.json();
        if (d.error) throw new Error(d.error.message || JSON.stringify(d.error));
        const txt = (d.content||[]).map(b=>b.text||"").join("");
        const clean = txt.replace(/```json|```/g,"").trim();
        try {
          const result = JSON.parse(clean);
          if (Array.isArray(result)) {
            allResults = allResults.concat(result);
            addLog(`  → ${result.length} records from chunk ${i+1}`);
          }
        } catch (parseE) {
          addLog(`  ⚠️ Chunk ${i+1} parse failed: ${parseE.message.slice(0,60)}`);
        }
      }

      if (allResults.length === 0) throw new Error("No records extracted from any chunk");
      setParsed(allResults);
      addLog(`✅ Total: ${allResults.length} ${srcType} records${hasPdf ? ` from ${pdfData.name}` : ""}`);
    } catch(e) {
      setParseErr(e.message);
      addLog(`Parse error: ${e.message}`);
    }
    setParsing(false);
    if (pdfData) setPdfData(prev => prev ? { ...prev, status: "ready" } : prev);
  };

  const saveParsed = async () => {
    if (!parsed.length) return;
    let emp = employer || "Unknown";
    let saveDept = dept || "";
    // Smart employer override for city payroll data (NYC, etc)
    if (parsed[0]?.agency) {
      const det = detectEmployer(parsed);
      if (det && det.employer !== emp && det.dept) {
        emp = det.employer;
        saveDept = det.dept;
        if (det.state && !stateVal) setStateVal(det.state);
      }
    }
    const newRecs = parsed.map(r => {
      const base = { _t:srcType, _e:emp, _s:stateVal||SEED_STATES[emp]||"", _u:unionName||"", _d:saveDept||"", _added:new Date().toISOString() };
      if (srcType === "payroll") {
        return { ...base, n: r.employee_name||r.n||"", role: cleanTitle(r.role_title||r.role||""), base: Math.round(Number(r.base_pay_annual||r.base||0)), ot: Math.round(Number(r.overtime_pay||r.ot||0)), other: Math.round(Number(r.other_pay||r.other||0)), bene: Math.round(Number(r.benefits||r.bene||0)), total: Math.round(Number(r.total_compensation||r.total||0)), year: r.year||2023 };
      }
      if (srcType === "contract") {
        return { ...base, cls: cleanTitle(r.classification||r.cls||""), dept: r.department||r.dept||"", step: r.progression_step||r.step||"", r22: Number(r.rate_2022||r.r22||0)||null, r23: Number(r.rate_2023||r.r23||0)||null, r24: Number(r.rate_2024||r.r24||0)||null, r25: Number(r.rate_2025||r.r25||0)||null, sap: r.sap_job_code||r.sap||"" };
      }
      if (srcType === "bulletin") {
        return { ...base, cls: cleanTitle(r.classification||r.cls||""), wage: Number(r.base_wage_hourly||r.wage||0), basis: r.rate_basis||r.basis||"", notes: r.notes||"" };
      }
      if (srcType === "salary_schedule") {
        return { ...base, grp: r.pay_scale_group||r.grp, grpLabel: r.pay_scale_group_label||r.grpLabel||"", lvl: r.pay_scale_level||r.lvl, c: r.basis_type==="C"?Number(r.annual_salary):r.c, b: r.basis_type==="B"?Number(r.annual_salary):r.b, a: r.basis_type==="A"?Number(r.annual_salary):r.a };
      }
      if (srcType === "progression") {
        return { ...base, cls: cleanTitle(r.classification||r.cls||""), fam: r.progression_family||r.fam||"", start: Number(r.progression_start||r.start||0)||null, m12: r.progression_12mo||r.m12, m24: r.progression_24mo||r.m24, m36: r.progression_36mo||r.m36, m48: r.progression_48mo||r.m48, formula: r.top_rate_formula||r.formula||"", g23: r.gwi_2023||r.g23, pt: r.premium_type||r.pt||"", pa: r.premium_amount||r.pa };
      }
      return { ...base, ...r };
    });
    const ok = await save([...records, ...newRecs]);
    const totalRecs = [...records, ...newRecs];
    const sizeMB = (JSON.stringify(totalRecs).length / (1024*1024)).toFixed(1);
    addLog(ok ? `✅ Saved ${newRecs.length} to "${emp}" (${totalRecs.length} total, ${sizeMB}MB)` : `⚠️ Storage full (${sizeMB}MB). Data kept in memory only — will be lost on refresh.`);
    setParsed([]); setRawText(""); setPdfData(null); setStateVal("");
  };

  const exportCSV = () => {
    const keys = [...new Set(records.flatMap(r => Object.keys(r)))];
    const csv = keys.join(",") + "\n" + records.map(r => keys.map(k => `"${String(r[k]??"").replace(/"/g,'""')}"`).join(",")).join("\n");
    const a = document.createElement("a"); a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv); a.download = "bandana_wagepage.csv"; a.click();
  };

  // Download clean source data CSV for a specific employer
  const downloadSourceData = (empName) => {
    const recs = records.filter(r => r._e === empName);
    if (!recs.length) return;
    const firstType = recs[0]?._t;
    let csv = "";
    const safeName = empName.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();

    if (firstType === "payroll") {
      csv = "Employee Name,Job Title,Base Pay,Overtime Pay,Other Pay,Benefits,Total Pay & Benefits,Year\n";
      recs.filter(r => r._t === "payroll").forEach(r => {
        csv += `"${r.n||""}","${r.role||""}",${r.base||0},${r.ot||0},${r.other||0},${r.bene||0},${r.total||0},${r.year||""}\n`;
      });
    } else if (firstType === "contract") {
      csv = "Classification,Department,SAP Job Code,Progression Step,Rate 2022,Rate 2023,Rate 2024,Rate 2025\n";
      recs.filter(r => r._t === "contract").forEach(r => {
        csv += `"${r.cls||""}","${r.dept||""}","${r.sap||""}","${r.step||""}",${r.r22||""},${r.r23||""},${r.r24||""},${r.r25||""}\n`;
      });
    } else if (firstType === "bulletin") {
      csv = "Classification,Hourly Wage,Rate Basis,Fringe Notes\n";
      recs.filter(r => r._t === "bulletin").forEach(r => {
        csv += `"${r.cls||""}",${r.wage||""},"${r.basis||""}","${(r.notes||"").replace(/"/g,'""')}"\n`;
      });
    } else if (firstType === "salary_schedule") {
      csv = "Pay Scale Group,Group Label,Pay Scale Level,C Basis (Annual),B Basis (Annual),A Basis (Annual)\n";
      recs.filter(r => r._t === "salary_schedule" && !r._ci).forEach(r => {
        csv += `${r.grp||""},"${r.grpLabel||""}",${r.lvl||""},${r.c||""},${r.b||""},${r.a||""}\n`;
      });
    } else if (firstType === "progression") {
      csv = "Classification,Progression Family,Start Rate,12 Mo,24 Mo,36 Mo,48 Mo,Top Rate Formula,GWI 2023,GWI 2024,GWI 2025,Premium Type,Premium Amount\n";
      recs.filter(r => r._t === "progression").forEach(r => {
        csv += `"${r.cls||""}","${r.fam||""}",${r.start||""},${typeof r.m12==="number"?r.m12:""},${r.m24||""},${r.m36||""},${typeof r.m48==="number"?r.m48:""},"${r.formula||""}",${r.g23||""},${r.g24||""},${r.g25||""},${r.pt?`"${r.pt}"`:""},${r.pa||""}\n`;
      });
    } else {
      // Generic fallback
      const keys = [...new Set(recs.flatMap(r => Object.keys(r).filter(k => !k.startsWith("_"))))];
      csv = keys.join(",") + "\n";
      recs.forEach(r => { csv += keys.map(k => `"${String(r[k]??"").replace(/"/g,'""')}"`).join(",") + "\n"; });
    }
    const a = document.createElement("a");
    a.href = "data:text/csv;charset=utf-8,\uFEFF" + encodeURIComponent(csv);
    a.download = `bandana_wp_${safeName}_source_data.csv`;
    a.click();
    addLog(`Downloaded source data for ${empName} (${recs.length} records)`);
  };

  // Styles
  const C = {bg:"#FAF8F4",cd:"#FFFFFF",bd:"#E5E0DA",tx:"#1A1A1A",mt:"#7A756E",dm:"#A09A93",acc:"#F5C518",accDk:"#C9A000"};
  const sCard = {background:C.cd,border:`1px solid ${C.bd}`,borderRadius:12,padding:"20px 22px",marginBottom:14,boxShadow:"0 1px 4px rgba(0,0,0,0.04)"};
  const sTitle = {fontSize:11,fontWeight:700,color:C.mt,textTransform:"uppercase",letterSpacing:"0.8px",marginBottom:12};
  const sInput = {width:"100%",boxSizing:"border-box",background:"#fff",border:`1.5px solid ${C.bd}`,borderRadius:8,padding:"10px 14px",fontSize:14,color:C.tx,outline:"none",fontFamily:"inherit",transition:"border-color 0.15s"};
  const sBtn = (v) => ({padding:"9px 18px",borderRadius:8,fontSize:13,fontWeight:600,cursor:"pointer",border:"none",fontFamily:"inherit",transition:"all 0.12s",...(v==="p"?{background:"#1A1A1A",color:"#fff"}:v==="g"?{background:"#F5C518",color:"#1A1A1A",fontWeight:700,boxShadow:"0 1px 4px rgba(245,197,24,0.3)"}:{background:"#fff",color:C.tx,border:`1.5px solid ${C.bd}`})});
  const sTh = {textAlign:"left",padding:"10px 12px",borderBottom:"2px solid #E5E0DA",color:"#7A756E",fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.6px",cursor:"pointer"};
  const sTd = {padding:"10px 12px",borderBottom:"1px solid #F2EFEB"};
  const sBadge = c => ({display:"inline-block",padding:"3px 10px",borderRadius:20,fontSize:10,fontWeight:700,background:"#FFF3CC",color:"#8B7000"});
  const sStatBox = {textAlign:"center",padding:"10px 0"};
  const sStatN = (c) => ({fontSize:22,fontWeight:700,color:c||"#1A1A1A"});
  const sStatL = {fontSize:10,color:C.mt,marginTop:2};

  if (!ready) return <div style={{background:C.bg,color:C.mt,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'DM Sans',system-ui"}}>
    <div style={{textAlign:"center"}}><div style={{fontSize:28,fontWeight:700,marginBottom:8}}>Bandana <span style={{color:"#C9A000"}}>WagePage</span></div><div style={{color:C.dm}}>Loading database...</div></div>
  </div>;

  return (
    <div style={{fontFamily:"'DM Sans','Helvetica Neue',system-ui,sans-serif",background:C.bg,color:C.tx,minHeight:"100vh"}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=JetBrains+Mono:wght@400:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{padding:"0 24px",borderBottom:`1px solid ${C.bd}`,background:"#fff"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 0"}}>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <div style={{width:32,height:32,borderRadius:8,background:"#1A1A1A",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{color:"#F5C518",fontSize:16,fontWeight:800}}>B</span></div>
            <div>
              <div style={{fontSize:17,fontWeight:700,letterSpacing:"-0.3px"}}>Bandana <span style={{color:"#C9A000"}}>WagePage</span></div>
              <div style={{fontSize:11,color:C.dm}}>{records.length.toLocaleString()} records · {empList.length} employers</div>
            </div>
          </div>
          <div style={{display:"flex",gap:6}}>
            <button onClick={exportCSV} style={{...sBtn(),fontSize:12,padding:"7px 14px"}}>⬇ Export All</button>
            {deleteConfirm !== "RESET" ? <button onClick={()=>setDeleteConfirm("RESET")} style={{...sBtn(),fontSize:12,padding:"7px 14px",color:"#C62828",borderColor:"#FFCDD2"}}>Reset</button>
            : <div style={{display:"flex",gap:4,alignItems:"center"}}>
              <span style={{fontSize:11,color:"#C62828",fontWeight:600}}>Reset everything?</span>
              <button onClick={async()=>{try{await storage.delete(DB_KEY);await storage.delete("wb_meta");for(let i=0;i<20;i++){try{await storage.delete(`wb_data_${i}`)}catch{break}}await storage.delete("wb_ladders");}catch{};location.reload();}} style={{...sBtn(),fontSize:11,padding:"5px 12px",background:"#C62828",color:"#fff",border:"none"}}>Yes</button>
              <button onClick={()=>setDeleteConfirm(null)} style={{...sBtn(),fontSize:11,padding:"5px 12px"}}>No</button>
            </div>}
          </div>
        </div>
        <div style={{display:"flex",gap:2}}>
          {[["upload","Upload & Parse"],["browse","Browse Data"],["log","Activity Log"]].map(([id,label])=>(
            <button key={id} onClick={()=>{setTab(id);setSelEmp(null);setSelRole(null);setSelLadder(null);}} style={{padding:"10px 20px",fontSize:13,fontWeight:tab===id?700:500,color:tab===id?C.tx:C.dm,borderBottom:tab===id?"3px solid #1A1A1A":"3px solid transparent",background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",transition:"all 0.12s"}}>{label}</button>
          ))}
        </div>
      </div>

      <div style={{padding:"20px 24px",maxWidth:1080,margin:"0 auto"}}>

        {/* ═══ UPLOAD ═══ */}
        {tab==="upload" && <div>
          <div style={sCard}>
            <div style={sTitle}>Source Type</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8}}>
              {TYPES.map(s=>{
                const active = srcType===s.id;
                return <div key={s.id} onClick={()=>{setSrcType(s.id);setParsed([]);setParseErr(null);setPdfData(null);}} style={{padding:"12px 14px",borderRadius:10,border:active?"2px solid #1A1A1A":`1.5px solid ${C.bd}`,background:active?"#1A1A1A":"#fff",cursor:"pointer",transition:"all 0.12s"}}>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <span style={{fontSize:16}}>{s.icon}</span>
                    <span style={{fontSize:13,fontWeight:600,color:active?"#fff":C.tx}}>{s.label}</span>
                  </div>
                  <div style={{fontSize:11,color:active?"#A09A93":C.dm,marginTop:4}}>{s.desc}</div>
                </div>;
              })}
            </div>
          </div>
          <div style={sCard}>
            <div style={sTitle}>Metadata</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <div><label style={{fontSize:12,fontWeight:500,color:C.tx,display:"block",marginBottom:5}}>Employer <span style={{color:"#C62828"}}>*</span></label><input style={sInput} value={employer} onChange={e=>{setEmployer(e.target.value); const auto=SEED_STATES[e.target.value]; if(auto && !stateVal) setStateVal(auto);}} placeholder="e.g. City of Los Angeles" /></div>
              <div><label style={{fontSize:12,fontWeight:500,color:C.tx,display:"block",marginBottom:5}}>State <span style={{color:"#C62828"}}>*</span></label>
                <select value={stateVal} onChange={e=>setStateVal(e.target.value)} style={{...sInput,cursor:"pointer",appearance:"auto"}}>
                  <option value="">Select state...</option>
                  {US_STATES.map(s=><option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginTop:12}}>
              <div><label style={{fontSize:12,fontWeight:500,color:C.tx,display:"block",marginBottom:5}}>Union</label><input style={sInput} value={unionName} onChange={e=>setUnionName(e.target.value)} placeholder="e.g. IBEW Local 11" /></div>
              <div><label style={{fontSize:12,fontWeight:500,color:C.tx,display:"block",marginBottom:5}}>Department</label><input style={sInput} value={dept} onChange={e=>setDept(e.target.value)} placeholder="Optional" /></div>
            </div>
          </div>
          <div style={sCard}>
            <div style={sTitle}>Data Input</div>
            <div style={{display:"flex",gap:8,marginBottom:10,alignItems:"center"}}>
              <button onClick={()=>fileRef.current?.click()} style={{...sBtn(),padding:"10px 20px",fontSize:13}}>📎 Upload CSV or PDF</button>
              <input ref={fileRef} type="file" accept=".csv,.tsv,.txt,.pdf" style={{display:"none"}} onChange={handleFile} />
            </div>
            {pdfData && <div style={{padding:"12px 14px",background:pdfData.status==="error"?"#FFF0F0":pdfData.status==="warning"?"#FFF8E0":"#FFF9E0",border:`1px solid ${pdfData.status==="error"?"#FFCDD2":"#F5E6A3"}`,borderRadius:8,marginBottom:8}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:20}}>{pdfData.status==="error"?"❌":pdfData.status==="ready"?"✅":"📄"}</span>
                  <div>
                    <div style={{fontSize:13,fontWeight:600}}>{pdfData.name}</div>
                    <div style={{fontSize:11,color:C.mt}}>
                      {pdfData.status === "extracting" ? `Extracting text... ${pdfData.pages || 0} pages so far` :
                       pdfData.status === "error" ? "Could not extract text — try pasting the content manually" :
                       pdfData.status === "warning" ? `${pdfData.pages} pages · Very little text found (may be scanned/image PDF)` :
                       pdfData.status === "ready" ? `${pdfData.pages} pages · ${Math.round((pdfData.text||"").length/1024)}KB extracted · Ready to parse` :
                       pdfData.status}
                    </div>
                  </div>
                </div>
                <button onClick={()=>{setPdfData(null);addLog("Cleared PDF");}} style={{background:"none",border:"none",fontSize:16,cursor:"pointer",color:C.mt,padding:4}}>✕</button>
              </div>
              {(pdfData.status === "extracting") && <div style={{marginTop:6,height:4,background:"#E8E4DF",borderRadius:2}}><div style={{height:4,background:"#F5C518",borderRadius:2,width:`${Math.min((pdfData.pages||0)/(pdfData.pages>50?pdfData.pages:50)*100,95)}%`,transition:"width 0.3s"}} /></div>}
            </div>}
            {!pdfData && <textarea value={rawText} onChange={e=>setRawText(e.target.value)} placeholder="Paste wage data or upload a PDF above..." style={{...sInput,fontFamily:"'JetBrains Mono',monospace",fontSize:13,minHeight:120,resize:"vertical",lineHeight:1.6,background:"#FAFAF8"}} />}
            <div style={{marginTop:10,display:"flex",gap:8,alignItems:"center"}}>
              <button onClick={handleParse} disabled={parsing||(!rawText.trim()&&!pdfData?.text)} style={{...sBtn("p"),padding:"11px 24px",fontSize:14,opacity:((!rawText.trim()&&!pdfData?.text)||parsing)?0.35:1}}>{parsing?"⏳ Parsing...":(pdfData?.text?"🤖 Extract from PDF":(srcType==="payroll"?"⚡ Parse CSV":"🤖 AI Parse"))}</button>
              {parseErr&&<span style={{fontSize:12,color:"#C62828",background:"#FFF0F0",padding:"6px 12px",borderRadius:6}}>{parseErr}</span>}
            </div>
          </div>
          {parsed.length>0 && <div style={{...sCard,border:"2px solid #F5C518"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <div>
                <div style={{fontSize:16,fontWeight:700}}>{parsed.length} records ready</div>
                <div style={{fontSize:12,color:C.mt,marginTop:2}}>Review the data below, then save to your database</div>
              </div>
              <button onClick={saveParsed} style={{...sBtn("g"),padding:"12px 28px",fontSize:14}}>💾 Save to Database</button>
            </div>

            {/* Data summary */}
            {(() => {
              const stats = [
                { label: "Employees", count: parsed.length, icon: "👤" },
                { label: "Unique Roles", count: new Set(parsed.map(r => r.role_title)).size, icon: "💼" },
                { label: "With Base Pay", count: parsed.filter(r => r.base_pay_annual > 0).length, icon: "💰" },
                { label: "With Overtime", count: parsed.filter(r => r.overtime_pay > 0).length, icon: "⏰" },
                { label: "With Other Pay", count: parsed.filter(r => r.other_pay > 0).length, icon: "📋" },
                { label: "With Benefits", count: parsed.filter(r => r.benefits > 0).length, icon: "🏥" },
              ];
              const avgBase = parsed.reduce((s,r) => s + (r.base_pay_annual||0), 0) / parsed.length;
              const avgTotal = parsed.reduce((s,r) => s + (r.total_compensation||0), 0) / parsed.length;
              return <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
                {stats.map((s,i) => (
                  <div key={i} style={{background:"#FAFAF8",border:`1px solid ${C.bd}`,borderRadius:8,padding:"8px 14px",display:"flex",alignItems:"center",gap:6}}>
                    <span style={{fontSize:14}}>{s.icon}</span>
                    <div>
                      <div style={{fontSize:16,fontWeight:700}}>{s.count}</div>
                      <div style={{fontSize:10,color:C.mt}}>{s.label}</div>
                    </div>
                  </div>
                ))}
                <div style={{background:"#FAFAF8",border:`1px solid ${C.bd}`,borderRadius:8,padding:"8px 14px"}}>
                  <div style={{fontSize:16,fontWeight:700}}>{fmt(Math.round(avgBase))}</div>
                  <div style={{fontSize:10,color:C.mt}}>Avg Base</div>
                </div>
                <div style={{background:"#FAFAF8",border:`1px solid ${C.bd}`,borderRadius:8,padding:"8px 14px"}}>
                  <div style={{fontSize:16,fontWeight:700}}>{fmt(Math.round(avgTotal))}</div>
                  <div style={{fontSize:10,color:C.mt}}>Avg Total</div>
                </div>
              </div>;
            })()}

            <div style={{overflowX:"auto",maxHeight:300}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}><thead><tr>{Object.keys(parsed[0]).filter(k=>k!=="agency").slice(0,8).map(k=><th key={k} style={sTh}>{k.replace(/_/g," ")}</th>)}</tr></thead>
              <tbody>{parsed.slice(0,30).map((r,i)=><tr key={i}>{Object.entries(r).filter(([k])=>k!=="agency").slice(0,8).map(([k,v],j)=><td key={j} style={sTd}>{typeof v==="number"&&v>1000?fmt(v):typeof v==="number"&&v>0?(v<500?fmtHr(v):`$${v}`):String(v||"—")}</td>)}</tr>)}</tbody></table>
            </div>
          </div>}
        </div>}

        {/* ═══ BROWSE ═══ */}
        {tab==="browse" && <div>
          <input value={search} onChange={e=>searchChanged(e.target.value)} placeholder="🔍  Search roles, classifications, job titles..." style={{...sInput,fontSize:15,padding:"14px 18px",borderRadius:12,background:"#fff",boxShadow:"0 2px 8px rgba(0,0,0,0.04)",marginBottom:16}} />

          {/* EMPLOYER LIST */}
          {!selEmp && !selLadder && <div>
            {/* State filter */}
            <div style={{display:"flex",gap:10,marginBottom:14,alignItems:"center"}}>
              <label style={{fontSize:12,fontWeight:600,color:C.mt}}>Filter by state:</label>
              <select value={stateFilter} onChange={e=>setStateFilter(e.target.value)} style={{...sInput,width:"auto",minWidth:180,padding:"8px 14px",cursor:"pointer",appearance:"auto"}}>
                <option value="all">All States</option>
                {statesInData.filter(s=>s!=="all").map(s=><option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            {filteredEmpList.length === 0 && <div style={{textAlign:"center",padding:40,color:C.dm,fontSize:14}}>No employers found in this state</div>}
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
            {filteredEmpList.map(e=><div key={e.name} onClick={()=>{setSelEmp(e.name);setSelRole(null);setRolePage(0);}} style={{background:"#fff",border:`1.5px solid ${C.bd}`,borderRadius:12,padding:"18px 16px",cursor:"pointer",borderLeft:"4px solid #F5C518",transition:"all 0.12s",boxShadow:"0 1px 4px rgba(0,0,0,0.03)"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div style={{fontWeight:700,fontSize:14}}>{e.name}</div>
                <button onClick={(ev)=>{ev.stopPropagation();downloadSourceData(e.name);}} style={{background:"#F8F6F3",border:`1px solid ${C.bd}`,borderRadius:6,padding:"4px 10px",fontSize:10,fontWeight:600,color:C.mt,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap"}} title="Download source data as CSV">⬇ CSV</button>
              </div>
              <div style={{display:"flex",gap:6,marginTop:6,alignItems:"center"}}>
                {e.state && <span style={{fontSize:11,fontWeight:600,color:C.tx,background:"#F0EDE9",padding:"2px 8px",borderRadius:4}}>{e.state === "National" ? "🇺🇸 National" : `📍 ${e.state}`}</span>}
                <span style={{fontSize:11,color:C.dm}}>{e.count} records</span>
              </div>
              <div style={{marginTop:8,display:"flex",gap:4,flexWrap:"wrap"}}>{[...e.types].map(t=><span key={t} style={{fontSize:10,padding:"3px 10px",borderRadius:20,background:"#FFF3CC",color:"#8B7000",fontWeight:600}}>{t}</span>)}</div>
            </div>)}
          </div>
          </div>}

          {/* ROLE LIST (per employer) */}
          {selEmp && !selRole && !selLadder && <div>
            <button onClick={()=>{setSelEmp(null);setLadderMode(false);setLadderRoles([]);}} style={{background:"#F8F6F3",border:`1px solid #E5E0DA`,borderRadius:8,color:"#1A1A1A",cursor:"pointer",fontSize:12,fontFamily:"inherit",marginBottom:12,fontWeight:600,padding:"8px 14px"}}>← All employers</button>
            <div style={{...sCard}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{fontSize:15,fontWeight:700}}>{selEmp}</div>
                  {(() => { const st = empList.find(e=>e.name===selEmp)?.state; return st ? <span style={{fontSize:11,fontWeight:600,color:C.tx,background:"#F0EDE9",padding:"3px 10px",borderRadius:4}}>{st==="National"?"🇺🇸 National":`📍 ${st}`}</span> : null; })()}
                </div>
                <div style={{display:"flex",gap:6,alignItems:"center"}}>
                  <span style={{fontSize:11,color:C.mt}}>{roleStats.length} unique roles</span>
                  <button onClick={()=>{setLadderMode(!ladderMode);if(!ladderMode)setLadderRoles([]);}} style={{...sBtn(ladderMode?"g":undefined),display:"flex",alignItems:"center",gap:4,fontSize:11,padding:"5px 12px"}}>
                    {ladderMode ? "✕ Cancel" : "🪜 Build Career Ladder"}
                  </button>
                  <button onClick={()=>downloadSourceData(selEmp)} style={{...sBtn(),display:"flex",alignItems:"center",gap:4,fontSize:11,padding:"5px 12px"}}>
                    <span>⬇</span> Download Source Data
                  </button>
                  {deleteConfirm !== selEmp ? <button onClick={()=>setDeleteConfirm(selEmp)} style={{...sBtn(),display:"flex",alignItems:"center",gap:4,fontSize:11,padding:"5px 12px",color:"#C62828",borderColor:"#FFCDD2"}}>
                    🗑️ Delete
                  </button> : <div style={{display:"flex",gap:4,alignItems:"center"}}>
                    <span style={{fontSize:11,color:"#C62828",fontWeight:600}}>Delete all data?</span>
                    <button onClick={()=>{deleteEmployer(selEmp);setDeleteConfirm(null);}} style={{...sBtn(),fontSize:11,padding:"5px 12px",background:"#C62828",color:"#fff",border:"none"}}>Yes, Delete</button>
                    <button onClick={()=>setDeleteConfirm(null)} style={{...sBtn(),fontSize:11,padding:"5px 12px"}}>Cancel</button>
                  </div>}
                </div>
              </div>

              {/* CAREER LADDER BUILDER */}
              {ladderMode && <div style={{background:"#FFFDF5",border:"2px solid #F5C518",borderRadius:12,padding:18,marginBottom:14}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                  <div>
                    <div style={{fontSize:14,fontWeight:700}}>🪜 Career Ladder Builder</div>
                    <div style={{fontSize:12,color:C.mt,marginTop:2}}>Click roles below to add them in promotional order (lowest → highest)</div>
                  </div>
                  {ladderRoles.length >= 2 && !ladderMode._naming && <button onClick={()=>setLadderMode({_naming:true})}
                    style={{...sBtn("g"),padding:"8px 20px"}}>💾 Save Ladder</button>}
                  {ladderRoles.length >= 2 && ladderMode._naming && <div style={{display:"flex",gap:6,alignItems:"center"}}>
                    <input id="ladder-name" autoFocus placeholder="e.g. Fire Fighter Career Path" style={{...sInput,width:260,fontSize:13}} defaultValue={ladderRoles.map(r=>cleanTitle(r.role||r.cls)).join(" → ")} onKeyDown={e=>{if(e.key==="Enter"){const name=e.target.value.trim();if(name){saveLadder(name,selEmp,ladderRoles);setLadderMode(false);setLadderRoles([]);}}}} />
                    <button onClick={()=>{const el=document.getElementById("ladder-name");const name=el?.value?.trim();if(name){saveLadder(name,selEmp,ladderRoles);setLadderMode(false);setLadderRoles([]);}}} style={{...sBtn("g"),padding:"8px 16px",whiteSpace:"nowrap"}}>💾 Save</button>
                    <button onClick={()=>setLadderMode(true)} style={{...sBtn(),padding:"8px 12px",fontSize:11}}>Cancel</button>
                  </div>}
                </div>
                {ladderRoles.length === 0 && <div style={{textAlign:"center",padding:"16px 0",color:C.dm,fontSize:13}}>Click on roles in the table below to build the promotional path</div>}
                {ladderRoles.length > 0 && <div style={{display:"flex",alignItems:"center",gap:0,overflowX:"auto",padding:"4px 0"}}>
                  {ladderRoles.map((r, i) => {
                    const prevPay = i > 0 ? (ladderRoles[i-1].base_avg || ladderRoles[i-1].wage || 0) : 0;
                    const thisPay = r.base_avg || r.wage || 0;
                    const increase = prevPay && thisPay ? ((thisPay/prevPay - 1) * 100).toFixed(1) : null;
                    return <div key={i} style={{display:"flex",alignItems:"center"}}>
                      <div style={{background:"#fff",border:`1.5px solid ${C.bd}`,borderRadius:10,padding:"12px 16px",minWidth:140,position:"relative"}}>
                        <button onClick={()=>removeFromLadder(i)} style={{position:"absolute",top:4,right:6,background:"none",border:"none",fontSize:12,cursor:"pointer",color:C.dm,padding:0}}>✕</button>
                        <div style={{display:"flex",gap:4,marginBottom:6}}>
                          <button onClick={()=>moveLadder(i,-1)} disabled={i===0} style={{background:"none",border:"none",cursor:i===0?"default":"pointer",opacity:i===0?0.3:1,fontSize:10,padding:0}}>◀</button>
                          <span style={{fontSize:10,color:C.dm,fontWeight:600}}>LEVEL {i+1}</span>
                          <button onClick={()=>moveLadder(i,1)} disabled={i===ladderRoles.length-1} style={{background:"none",border:"none",cursor:i===ladderRoles.length-1?"default":"pointer",opacity:i===ladderRoles.length-1?0.3:1,fontSize:10,padding:0}}>▶</button>
                        </div>
                        <div style={{fontSize:13,fontWeight:700,marginBottom:4}}>{cleanTitle(r.role || r.cls)}</div>
                        <div style={{fontSize:16,fontWeight:700,color:"#1A1A1A"}}>{thisPay > 1000 ? fmt(thisPay) : fmtHr(thisPay)}</div>
                        <div style={{fontSize:10,color:C.dm}}>{r.count ? `${r.count} employees` : "hourly rate"}</div>
                      </div>
                      {i < ladderRoles.length - 1 && <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"0 6px"}}>
                        <div style={{width:32,height:2,background:"#F5C518"}} />
                        {increase && <div style={{fontSize:10,fontWeight:700,color:"#2E7D32",marginTop:2}}>+{increase}%</div>}
                      </div>}
                    </div>;
                  })}
                </div>}
              </div>}

              {/* SAVED CAREER LADDERS */}
              {!ladderMode && savedLadders.filter(l => l.emp === selEmp).length > 0 && <div style={{marginBottom:14}}>
                <div style={{fontSize:12,fontWeight:700,color:C.mt,marginBottom:8}}>SAVED CAREER LADDERS — Click to view dashboard</div>
                {savedLadders.filter(l => l.emp === selEmp).map(ladder => (
                  <div key={ladder.id} onClick={()=>{setSelLadder(ladder);setSelEmp(ladder.emp);}} style={{background:"#fff",border:`1.5px solid ${C.bd}`,borderRadius:10,padding:14,marginBottom:8,cursor:"pointer",transition:"all 0.12s"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <span style={{fontSize:16}}>🪜</span>
                        <div style={{fontSize:13,fontWeight:700}}>{ladder.name}</div>
                        <span style={{fontSize:10,color:C.dm,background:"#F0EDE9",padding:"2px 8px",borderRadius:4}}>{ladder.roles.length} levels</span>
                      </div>
                      <div style={{display:"flex",gap:6}}>
                        <span style={{fontSize:11,color:"#C9A000",fontWeight:600}}>View Dashboard →</span>
                        <button onClick={(ev)=>{ev.stopPropagation();deleteLadder(ladder.id);}} style={{background:"none",border:"none",fontSize:11,color:C.dm,cursor:"pointer",fontFamily:"inherit"}}>Delete</button>
                      </div>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:0,overflowX:"auto"}}>
                      {ladder.roles.map((r, i) => {
                        const prevPay = i > 0 ? (ladder.roles[i-1].base_avg || ladder.roles[i-1].wage || 0) : 0;
                        const thisPay = r.base_avg || r.wage || 0;
                        const increase = prevPay && thisPay ? ((thisPay/prevPay - 1) * 100).toFixed(1) : null;
                        return <div key={i} style={{display:"flex",alignItems:"center"}}>
                          <div style={{textAlign:"center",minWidth:110}}>
                            <div style={{fontSize:9,color:C.dm,fontWeight:600,marginBottom:2}}>LEVEL {i+1}</div>
                            <div style={{fontSize:12,fontWeight:700}}>{cleanTitle(r.role || r.cls)}</div>
                            <div style={{fontSize:15,fontWeight:700,color:"#1A1A1A",marginTop:2}}>{thisPay > 1000 ? fmt(thisPay) : fmtHr(thisPay)}</div>
                          </div>
                          {i < ladder.roles.length - 1 && <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"0 4px"}}>
                            <div style={{fontSize:16,color:"#F5C518"}}>→</div>
                            {increase && <div style={{fontSize:9,fontWeight:700,color:"#2E7D32"}}>+{increase}%</div>}
                          </div>}
                        </div>;
                      })}
                    </div>
                  </div>
                ))}
              </div>}

              {/* PAYROLL ROLES */}
              {roleStats[0]?._t === "payroll" && (() => {
                const filtered = roleStats.filter(r => !search || r.role.toLowerCase().includes(search.toLowerCase()));
                const totalPages = Math.ceil(filtered.length / ROLES_PER_PAGE);
                const paged = filtered.slice(rolePage * ROLES_PER_PAGE, (rolePage+1) * ROLES_PER_PAGE);
                return <div>
                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                  <thead><tr>
                    {ladderMode && <th style={{...sTh,width:40}}></th>}
                    <th style={sTh}>Role</th><th style={sTh}>#</th>
                    <th style={sTh}>Avg Base</th><th style={sTh}>Median</th><th style={sTh}>Range</th>
                    <th style={sTh}>Avg OT</th><th style={sTh}>Avg Benefits</th><th style={sTh}>Avg Total</th>
                    <th style={{...sTh,width:30}}></th>
                  </tr></thead>
                  <tbody>{paged.map((r,i)=>{
                    const inLadder = ladderRoles.some(lr => lr.role === r.role);
                    return <tr key={i} style={{cursor:"pointer",background:inLadder?"#FFFDF5":deleteRoleConfirm===r.role?"#FFF0F0":"transparent"}} onClick={()=>{ if(deleteRoleConfirm) return; if(ladderMode){if(!inLadder)addToLadder(r);} else setSelRole(r); }}>
                      {ladderMode && <td style={sTd}><div style={{width:22,height:22,borderRadius:6,border:inLadder?"2px solid #F5C518":`1.5px solid ${C.bd}`,background:inLadder?"#F5C518":"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:"#fff"}}>{inLadder?"✓":""}</div></td>}
                      <td style={{...sTd,fontWeight:600}}>{r.role}</td>
                      <td style={sTd}>{r.count.toLocaleString()}</td>
                      <td style={{...sTd,color:"#1A1A1A",fontWeight:700}}>{fmt(r.base_avg)}</td>
                      <td style={sTd}>{fmt(r.base_med)}</td>
                      <td style={{...sTd,fontSize:10,color:C.mt}}>{fmt(r.base_min)} – {fmt(r.base_max)}</td>
                      <td style={sTd}>{r.ot_avg > 0 ? fmt(r.ot_avg) : "—"}</td>
                      <td style={sTd}>{r.bene_avg > 0 ? fmt(r.bene_avg) : "—"}</td>
                      <td style={{...sTd,fontWeight:700}}>{fmt(r.total_avg)}</td>
                      <td style={{...sTd,textAlign:"center"}}>
                        {deleteRoleConfirm === r.role
                          ? <div style={{display:"flex",gap:2}} onClick={e=>e.stopPropagation()}>
                              <button onClick={()=>{deleteRole(selEmp,r.role);setDeleteRoleConfirm(null);}} style={{background:"#C62828",color:"#fff",border:"none",borderRadius:4,fontSize:9,padding:"3px 6px",cursor:"pointer",fontFamily:"inherit"}}>Yes</button>
                              <button onClick={()=>setDeleteRoleConfirm(null)} style={{background:"#fff",border:`1px solid ${C.bd}`,borderRadius:4,fontSize:9,padding:"3px 6px",cursor:"pointer",fontFamily:"inherit"}}>No</button>
                            </div>
                          : <button onClick={e=>{e.stopPropagation();setDeleteRoleConfirm(r.role);}} style={{background:"none",border:"none",cursor:"pointer",fontSize:12,color:C.dm,padding:2,opacity:0.4}} title="Delete this role">🗑️</button>
                        }
                      </td>
                    </tr>;
                  })}</tbody>
                </table>
                {totalPages > 1 && <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0"}}>
                  <div style={{fontSize:12,color:C.mt}}>Showing {rolePage*ROLES_PER_PAGE+1}–{Math.min((rolePage+1)*ROLES_PER_PAGE, filtered.length)} of {filtered.length} roles</div>
                  <div style={{display:"flex",gap:4}}>
                    <button onClick={()=>setRolePage(Math.max(0,rolePage-1))} disabled={rolePage===0} style={{...sBtn(),padding:"6px 12px",fontSize:11,opacity:rolePage===0?0.3:1}}>← Prev</button>
                    <span style={{padding:"6px 10px",fontSize:12,fontWeight:600}}>{rolePage+1} / {totalPages}</span>
                    <button onClick={()=>setRolePage(Math.min(totalPages-1,rolePage+1))} disabled={rolePage>=totalPages-1} style={{...sBtn(),padding:"6px 12px",fontSize:11,opacity:rolePage>=totalPages-1?0.3:1}}>Next →</button>
                  </div>
                </div>}
                </div>;
              })()}

              {/* CONTRACT ROLES */}
              {roleStats[0]?._t === "contract" && (() => {
                const filtered = roleStats.filter(r => !search || r.role.toLowerCase().includes(search.toLowerCase()));
                const totalPages = Math.ceil(filtered.length / ROLES_PER_PAGE);
                const paged = filtered.slice(rolePage * ROLES_PER_PAGE, (rolePage+1) * ROLES_PER_PAGE);
                return <div>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                <thead><tr>
                  {ladderMode && <th style={{...sTh,width:40}}></th>}
                  <th style={sTh}>Classification</th><th style={sTh}>Dept</th><th style={sTh}>Steps</th>
                  <th style={sTh}>2022 Low</th><th style={sTh}>2025 High</th><th style={sTh}>3yr ↑</th>
                </tr></thead>
                <tbody>{paged.map((r,i)=>{
                  const inLadder = ladderRoles.some(lr => (lr.role||lr.cls) === r.role);
                  const ladderObj = { role: cleanTitle(r.role), cls: cleanTitle(r.role), base_avg: r.max25, wage: r.max25, count: r.count };
                  return <tr key={i} style={{cursor:"pointer",background:inLadder?"#FFFDF5":"transparent"}} onClick={()=>{ if(ladderMode){if(!inLadder)addToLadder(ladderObj);} else setSelRole(r); }}>
                    {ladderMode && <td style={sTd}><div style={{width:22,height:22,borderRadius:6,border:inLadder?"2px solid #F5C518":`1.5px solid ${C.bd}`,background:inLadder?"#F5C518":"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:"#fff"}}>{inLadder?"✓":""}</div></td>}
                    <td style={{...sTd,fontWeight:600,maxWidth:200,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.role}</td>
                    <td style={{...sTd,fontSize:10}}>{(r.dept||"").replace("DCPP ","")}</td>
                    <td style={sTd}>{r.count}</td>
                    <td style={sTd}>{fmtHr(r.min22)}</td>
                    <td style={{...sTd,color:"#1A1A1A",fontWeight:700}}>{fmtHr(r.max25)}</td>
                    <td style={{...sTd,color:"#2E7D32"}}>{r.pctInc ? `+${r.pctInc}%` : "—"}</td>
                  </tr>;
                })}</tbody>
              </table>
              {totalPages > 1 && <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0"}}>
                <div style={{fontSize:12,color:C.mt}}>Showing {rolePage*ROLES_PER_PAGE+1}–{Math.min((rolePage+1)*ROLES_PER_PAGE, filtered.length)} of {filtered.length} classifications</div>
                <div style={{display:"flex",gap:4}}>
                  <button onClick={()=>setRolePage(Math.max(0,rolePage-1))} disabled={rolePage===0} style={{...sBtn(),padding:"6px 12px",fontSize:11,opacity:rolePage===0?0.3:1}}>← Prev</button>
                  <span style={{padding:"6px 10px",fontSize:12,fontWeight:600}}>{rolePage+1} / {totalPages}</span>
                  <button onClick={()=>setRolePage(Math.min(totalPages-1,rolePage+1))} disabled={rolePage>=totalPages-1} style={{...sBtn(),padding:"6px 12px",fontSize:11,opacity:rolePage>=totalPages-1?0.3:1}}>Next →</button>
                </div>
              </div>}
              </div>;
              })()}

              {/* BULLETIN ROLES */}
              {roleStats[0]?._t === "bulletin" && <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                <thead><tr><th style={sTh}>Classification</th><th style={sTh}>Hourly</th><th style={sTh}>Annualized</th><th style={sTh}>Rate Basis</th><th style={sTh}>Fringes</th></tr></thead>
                <tbody>{roleStats.filter(r => !search || r.role.toLowerCase().includes(search.toLowerCase())).map((r,i)=>(
                  <tr key={i}><td style={{...sTd,fontWeight:600}}>{r.role}</td><td style={{...sTd,color:"#2E7D32",fontWeight:700}}>{fmtHr(r.wage)}</td><td style={sTd}>{r.annual ? fmt(r.annual) : "—"}</td><td style={sTd}>{r.basis ? <span style={sBadge("#f59e0b")}>{r.basis}</span> : "Direct"}</td><td style={{...sTd,fontSize:10,color:C.mt}}>{r.notes}</td></tr>
                ))}</tbody>
              </table>}

              {/* SALARY SCHEDULE */}
              {roleStats[0]?.grp != null && <div>
                <div style={{display:"flex",gap:4,marginBottom:10}}>{[["c","C (204d)"],["b","B (221d)"],["a","A (261d)"]].map(([id,l])=><button key={id} onClick={()=>setLausdBasis(id)} style={{...sBtn(lausdBasis===id?"p":"o"),fontSize:10,padding:"4px 8px"}}>{l}</button>)}</div>
                <div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                  <thead><tr><th style={{...sTh,position:"sticky",left:0,background:C.cd,zIndex:1}}>Group</th>{Array.from({length:14},(_,i)=><th key={i} style={sTh}>{i+1}</th>)}</tr></thead>
                  <tbody>{roleStats.map((g,gi)=><tr key={gi}><td style={{...sTd,fontWeight:700,position:"sticky",left:0,background:C.cd,zIndex:1,whiteSpace:"nowrap",fontSize:11}}>{g.grp}<br/><span style={{fontSize:8,color:C.dm}}>{g.label}</span></td>
                    {Array.from({length:14},(_,li)=>{ const lvl=g.levels.find(l=>l.lvl===li+1); const val=lvl?lvl[lausdBasis]:null; return <td key={li} style={{...sTd,fontSize:10,fontWeight:val?500:400,color:val?C.tx:C.dm}}>{val?fmt(val):"—"}</td>; })}
                  </tr>)}</tbody>
                </table></div>
              </div>}

              {/* PROGRESSIONS */}
              {roleStats[0]?._t === "progression" && <div>
                {roleStats.filter(u=>!u.pt).map((u,i)=><div key={i} style={{marginBottom:8,padding:10,background:"#FAF8F5",borderRadius:7,border:`1px solid ${C.bd}`}}>
                  <div style={{display:"flex",justifyContent:"space-between"}}><div><strong style={{fontSize:13}}>{u.cls}</strong> <span style={sBadge("#ef4444")}>{u.fam}</span></div>{u.formula&&<span style={{fontSize:11,color:C.mt}}>{u.formula}</span>}</div>
                  {u.start&&<div style={{display:"flex",gap:5,marginTop:6}}>{[["Start",u.start],["12mo",u.m12],["24mo",u.m24],["36mo",u.m36],["48mo",u.m48]].filter(([,v])=>v!=null).map(([l,v],j)=><div key={j} style={{flex:1,textAlign:"center",padding:5,background:C.cd,borderRadius:5,border:`1px solid ${C.bd}`}}><div style={{fontSize:9,color:C.dm}}>{l}</div><div style={{fontSize:14,fontWeight:700,color:v==="Top Rate"?"#ef4444":"#fff"}}>{v==="Top Rate"?"TOP":fmtHr(v)}</div></div>)}</div>}
                </div>)}
                <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6,marginTop:8}}>{roleStats.filter(u=>u.pt).map((u,i)=><div key={i} style={{textAlign:"center",padding:8,background:C.cd,borderRadius:7,border:`1px solid ${C.bd}`}}><div style={{fontSize:11,fontWeight:600}}>{u.pt}</div><div style={{fontSize:16,fontWeight:700,color:"#D4A90A",marginTop:3}}>+{fmtHr(u.pa)}/hr</div></div>)}</div>
              </div>}
            </div>
          </div>}

          {/* CAREER LADDER DASHBOARD */}
          {selLadder && <div>
            <button onClick={()=>setSelLadder(null)} style={{background:"#F8F6F3",border:`1px solid #E5E0DA`,borderRadius:8,color:"#1A1A1A",cursor:"pointer",fontSize:12,fontFamily:"inherit",marginBottom:12,fontWeight:600,padding:"8px 14px"}}>← {selLadder.emp} roles</button>

            {(() => {
              // Enrich ladder roles with full stats from records
              const empRecs = records.filter(r => r._e === selLadder.emp && r._t === "payroll");
              const enriched = selLadder.roles.map((lr, idx) => {
                const matching = empRecs.filter(r => r.role === (lr.role||lr.cls));
                const bases = matching.map(r => r.base).filter(v => v > 0);
                const ots = matching.map(r => r.ot).filter(v => v > 0);
                const benes = matching.map(r => r.bene).filter(v => v > 0);
                const totals = matching.map(r => r.total).filter(v => v > 0);
                const avg = arr => arr.length ? arr.reduce((s,v)=>s+v,0)/arr.length : 0;
                const med = arr => { if(!arr.length) return 0; const s=[...arr].sort((a,b)=>a-b); return s[Math.floor(s.length/2)]; };
                return {
                  ...lr, level: idx + 1,
                  count: matching.length || lr.count || 0,
                  base_avg: Math.round(avg(bases)) || lr.base_avg || 0,
                  base_med: Math.round(med(bases)),
                  base_min: bases.length ? Math.round(Math.min(...bases)) : 0,
                  base_max: bases.length ? Math.round(Math.max(...bases)) : 0,
                  ot_avg: Math.round(avg(ots)) || lr.ot_avg || 0,
                  bene_avg: Math.round(avg(benes)) || lr.bene_avg || 0,
                  total_avg: Math.round(avg(totals)) || lr.total_avg || 0,
                  total_med: Math.round(med(totals)),
                  employees: matching.sort((a,b) => (b.total||0) - (a.total||0)),
                };
              });

              const first = enriched[0]; const last = enriched[enriched.length-1];
              const totalGrowth = first.base_avg && last.base_avg ? ((last.base_avg/first.base_avg - 1)*100).toFixed(0) : null;
              const ttStyle = {background:"#fff",border:"1px solid #E5E0DA",borderRadius:8,fontSize:11};

              // Chart data
              const compChart = enriched.map(r => ({
                name: (r.role||r.cls||"").replace(/^(.*?)\s/, "$1\n").substring(0,20),
                "Base Pay": r.base_avg,
                "Overtime": r.ot_avg,
                "Benefits": r.bene_avg,
              }));

              const rangeChart = enriched.map(r => ({
                name: (r.role||r.cls||"").substring(0,18),
                min: r.base_min, avg: r.base_avg, max: r.base_max, med: r.base_med,
              }));

              return <div>
                {/* Header card */}
                <div style={{...sCard,border:"2px solid #F5C518",background:"#FFFDF5"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
                    <div>
                      <div style={{fontSize:11,fontWeight:700,color:C.dm,textTransform:"uppercase",letterSpacing:"0.6px"}}>Career Ladder</div>
                      <div style={{fontSize:20,fontWeight:700,marginTop:4}}>{selLadder.name}</div>
                      <div style={{fontSize:12,color:C.mt,marginTop:4}}>{selLadder.emp} · {enriched.length} levels · {enriched.reduce((s,r)=>s+r.count,0)} total employees</div>
                    </div>
                    {totalGrowth && <div style={{textAlign:"right"}}>
                      <div style={{fontSize:11,color:C.dm}}>Total Pay Growth</div>
                      <div style={{fontSize:32,fontWeight:800,color:"#2E7D32"}}>+{totalGrowth}%</div>
                      <div style={{fontSize:11,color:C.dm}}>{fmt(first.base_avg)} → {fmt(last.base_avg)}</div>
                    </div>}
                  </div>

                  {/* Progression visual */}
                  <div style={{display:"flex",alignItems:"stretch",gap:0}}>
                    {enriched.map((r, i) => {
                      const prev = i > 0 ? enriched[i-1] : null;
                      const inc = prev && r.base_avg && prev.base_avg ? ((r.base_avg/prev.base_avg-1)*100).toFixed(1) : null;
                      const maxPay = Math.max(...enriched.map(e=>e.base_avg||0));
                      const barH = maxPay ? Math.max(20, (r.base_avg/maxPay)*100) : 50;
                      return <div key={i} style={{display:"flex",alignItems:"flex-end",flex:1}}>
                        <div style={{flex:1,textAlign:"center"}}>
                          <div style={{fontSize:10,fontWeight:700,color:C.dm}}>LEVEL {i+1}</div>
                          <div style={{fontSize:13,fontWeight:700,margin:"4px 0"}}>{cleanTitle(r.role||r.cls)}</div>
                          <div style={{background:"#1A1A1A",borderRadius:"8px 8px 0 0",height:barH,margin:"0 8px",display:"flex",alignItems:"center",justifyContent:"center"}}>
                            <span style={{color:"#F5C518",fontSize:13,fontWeight:700}}>{fmt(r.base_avg)}</span>
                          </div>
                          <div style={{fontSize:10,color:C.dm,marginTop:4}}>{r.count} employees</div>
                        </div>
                        {i < enriched.length-1 && <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-end",padding:"0 2px 30px"}}>
                          <div style={{width:24,height:2,background:"#F5C518"}} />
                          {inc && <div style={{fontSize:10,fontWeight:700,color:"#2E7D32",marginTop:2}}>+{inc}%</div>}
                        </div>}
                      </div>;
                    })}
                  </div>
                </div>

                {/* Charts row */}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
                  {/* Compensation comparison */}
                  <div style={sCard}>
                    <div style={{fontSize:12,fontWeight:700,marginBottom:12}}>Compensation Comparison</div>
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={compChart}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E0DA" />
                        <XAxis dataKey="name" tick={{fontSize:10,fill:"#7A756E"}} interval={0} />
                        <YAxis tick={{fontSize:10,fill:"#7A756E"}} tickFormatter={v=>`$${(v/1000).toFixed(0)}k`} />
                        <Tooltip contentStyle={ttStyle} formatter={v=>fmt(v)} />
                        <Legend wrapperStyle={{fontSize:11}} />
                        <Bar dataKey="Base Pay" fill="#1A1A1A" radius={[0,0,0,0]} />
                        <Bar dataKey="Overtime" fill="#F5C518" />
                        <Bar dataKey="Benefits" fill="#D4A90A" radius={[4,4,0,0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Pay range comparison */}
                  <div style={sCard}>
                    <div style={{fontSize:12,fontWeight:700,marginBottom:12}}>Base Pay Range by Level</div>
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={rangeChart} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E0DA" horizontal={false} />
                        <XAxis type="number" tick={{fontSize:10,fill:"#7A756E"}} tickFormatter={v=>`$${(v/1000).toFixed(0)}k`} />
                        <YAxis dataKey="name" type="category" tick={{fontSize:10,fill:"#7A756E"}} width={80} />
                        <Tooltip contentStyle={ttStyle} formatter={v=>fmt(v)} />
                        <Bar dataKey="min" fill="#E5E0DA" name="Min" stackId="range" />
                        <Bar dataKey="avg" fill="#F5C518" name="Avg" />
                        <Bar dataKey="max" fill="#1A1A1A" name="Max" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Per-level stat cards */}
                <div style={{...sCard}}>
                  <div style={{fontSize:12,fontWeight:700,marginBottom:14}}>Detailed Stats by Level</div>
                  <div style={{display:"grid",gridTemplateColumns:`repeat(${Math.min(enriched.length,4)},1fr)`,gap:12}}>
                    {enriched.map((r, i) => {
                      const prev = i > 0 ? enriched[i-1] : null;
                      const baseInc = prev ? ((r.base_avg/prev.base_avg-1)*100).toFixed(1) : null;
                      const totalInc = prev && r.total_avg && prev.total_avg ? ((r.total_avg/prev.total_avg-1)*100).toFixed(1) : null;
                      return <div key={i} style={{background:"#FAFAF8",border:`1.5px solid ${C.bd}`,borderRadius:10,padding:14,borderTop:"3px solid #F5C518"}}>
                        <div style={{fontSize:10,fontWeight:700,color:C.dm}}>LEVEL {i+1}</div>
                        <div style={{fontSize:14,fontWeight:700,marginTop:2}}>{cleanTitle(r.role||r.cls)}</div>
                        <div style={{fontSize:11,color:C.dm,marginTop:2}}>{r.count} employees</div>
                        <div style={{marginTop:12,display:"grid",gap:8}}>
                          <div><div style={{fontSize:10,color:C.mt}}>Avg Base Pay</div><div style={{fontSize:18,fontWeight:700}}>{fmt(r.base_avg)}</div>{baseInc && <div style={{fontSize:10,color:"#2E7D32",fontWeight:600}}>+{baseInc}% from Level {i}</div>}</div>
                          <div><div style={{fontSize:10,color:C.mt}}>Median Base</div><div style={{fontSize:14,fontWeight:600}}>{fmt(r.base_med)}</div></div>
                          <div><div style={{fontSize:10,color:C.mt}}>Range</div><div style={{fontSize:12}}>{fmt(r.base_min)} – {fmt(r.base_max)}</div></div>
                          {r.ot_avg > 0 && <div><div style={{fontSize:10,color:C.mt}}>Avg Overtime</div><div style={{fontSize:14,fontWeight:600,color:"#C9A000"}}>{fmt(r.ot_avg)}</div></div>}
                          {r.bene_avg > 0 && <div><div style={{fontSize:10,color:C.mt}}>Avg Benefits</div><div style={{fontSize:14,fontWeight:600}}>{fmt(r.bene_avg)}</div></div>}
                          <div style={{borderTop:`1px solid ${C.bd}`,paddingTop:8}}><div style={{fontSize:10,color:C.mt}}>Avg Total Comp</div><div style={{fontSize:18,fontWeight:700}}>{fmt(r.total_avg)}</div>{totalInc && <div style={{fontSize:10,color:"#2E7D32",fontWeight:600}}>+{totalInc}% from Level {i}</div>}</div>
                        </div>
                      </div>;
                    })}
                  </div>
                </div>

                {/* BENJI SAYS - CAREER LADDER */}
                <div style={{background:"#FFFDF5",border:"1.5px solid #F5C518",borderRadius:12,padding:18,marginBottom:16}}>
                  <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                    <img src={BENJI_IMG} style={{width:36,height:36,borderRadius:10,flexShrink:0,objectFit:"cover"}} alt="Benji" />
                    <div>
                      <div style={{fontSize:14,fontWeight:700}}>A Word From Benji</div>
                      <div style={{fontSize:13,color:"#3A3530",lineHeight:1.65,marginTop:6}}>
                        {(() => {
                          const lines = [];
                          const totalEmps = enriched.reduce((s,r)=>s+r.count,0);
                          const bottom = enriched[0];
                          const top = enriched[enriched.length-1];
                          const bottomPay = bottom.base_avg || bottom.wage || 0;
                          const topPay = top.base_avg || top.wage || 0;
                          const totalGrowthPct = bottomPay && topPay ? ((topPay/bottomPay-1)*100).toFixed(0) : null;
                          const dollarGrowth = topPay - bottomPay;

                          const B = v => <strong>{v}</strong>;
                          lines.push(<span>This career ladder at {B(selLadder.emp)} covers {B(`${enriched.length} levels`)} with {B(totalEmps.toLocaleString())} total employees.</span>);

                          if (totalGrowthPct && enriched.length >= 2) {
                            const isHourly = topPay < 500;
                            lines.push(<span>Moving from {B(cleanTitle(bottom.role||bottom.cls))} to {B(cleanTitle(top.role||top.cls))} represents a {B(`${totalGrowthPct}%`)} pay increase, {isHourly ? <span>from {B(`${fmtHr(bottomPay)}`)} to {B(`${fmtHr(topPay)}/hr`)}</span> : <span>from {B(fmt(bottomPay))} to {B(fmt(topPay))}</span>}{!isHourly && dollarGrowth > 0 ? <span>, a {B(fmt(dollarGrowth))} jump</span> : ""}.</span>);
                          }

                          // Step-by-step analysis
                          for (let i = 1; i < enriched.length; i++) {
                            const prev = enriched[i-1];
                            const curr = enriched[i];
                            const prevP = prev.base_avg || prev.wage || 0;
                            const currP = curr.base_avg || curr.wage || 0;
                            if (prevP && currP) {
                              const pctV = ((currP/prevP-1)*100).toFixed(0);
                              lines.push(<span>The step from {cleanTitle(prev.role||prev.cls)} to {cleanTitle(curr.role||curr.cls)} is a {B(`${pctV}%`)} bump{currP > 1000 ? <span> (+{B(fmt(currP-prevP))})</span> : ""}.</span>);
                            }
                          }

                          // OT analysis across levels
                          const otsPerLevel = enriched.map(r => ({name: r.role||r.cls, ot: r.ot_avg || 0})).filter(d => d.ot > 0);
                          if (otsPerLevel.length > 0) {
                            const topOT = otsPerLevel.reduce((best, d) => d.ot > best.ot ? d : best, otsPerLevel[0]);
                            lines.push(<span>Overtime is strongest at the {B(cleanTitle(topOT.name))} level, averaging {B(fmt(topOT.ot))}.</span>);
                          }

                          // Biggest level by headcount
                          const biggest = enriched.reduce((best, r) => r.count > best.count ? r : best, enriched[0]);
                          if (biggest.count > 10) {
                            lines.push(<span>The largest cohort is {B(cleanTitle(biggest.role||biggest.cls))} with {B(biggest.count.toLocaleString())} employees. This is where most people sit on the ladder.</span>);
                          }

                          // Overall takeaway
                          if (enriched.length >= 3 && totalGrowthPct > 50) {
                            lines.push(<span>Overall, this is a strong promotional path with meaningful pay increases at each step. Workers who stay and advance can expect substantial growth.</span>);
                          } else if (enriched.length >= 2) {
                            lines.push(<span>This ladder shows the earning trajectory for workers advancing through these roles.</span>);
                          }

                          return lines.map((line,i) => <span key={i}>{i>0?" ":""}{line}</span>);
                        })()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Combined employee table */}
                <div style={sCard}>
                  <div style={{fontSize:12,fontWeight:700,marginBottom:12}}>All Employees Across Ladder ({enriched.reduce((s,r)=>s+r.employees.length,0)})</div>
                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                    <thead><tr><th style={sTh}>Level</th><th style={sTh}>Role</th><th style={sTh}>Name</th><th style={sTh}>Base Pay</th><th style={sTh}>Overtime</th><th style={sTh}>Benefits</th><th style={sTh}>Total</th></tr></thead>
                    <tbody>
                      {enriched.flatMap((r, lvl) => r.employees.slice(0,10).map((e, j) => (
                        <tr key={`${lvl}-${j}`} style={{background:lvl%2===0?"transparent":"#FAFAF8"}}>
                          <td style={{...sTd,fontWeight:700,fontSize:10,color:C.dm}}>{lvl+1}</td>
                          <td style={{...sTd,fontWeight:600,fontSize:11}}>{cleanTitle(r.role||r.cls)}</td>
                          <td style={sTd}>{e.n}</td>
                          <td style={{...sTd,fontWeight:600}}>{fmt(e.base)}</td>
                          <td style={sTd}>{e.ot > 0 ? fmt(e.ot) : "—"}</td>
                          <td style={sTd}>{e.bene > 0 ? fmt(e.bene) : "—"}</td>
                          <td style={{...sTd,fontWeight:700}}>{fmt(e.total)}</td>
                        </tr>
                      )))}
                    </tbody>
                  </table>
                </div>
              </div>;
            })()}
          </div>}

          {/* ROLE DETAIL (drill-down) */}
          {selEmp && selRole && !selLadder && <div>
            <button onClick={()=>setSelRole(null)} style={{background:"#F8F6F3",border:`1px solid #E5E0DA`,borderRadius:8,color:"#1A1A1A",cursor:"pointer",fontSize:12,fontFamily:"inherit",marginBottom:12,fontWeight:600,padding:"8px 14px"}}>← {selEmp} roles</button>
            <div style={sCard}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
                <div>
                  <div style={{fontSize:16,fontWeight:700}}>{cleanTitle(selRole.role || selRole.cls)}</div>
                  <div style={{fontSize:12,color:C.mt,marginTop:4}}>{selEmp} • {selRole.count} {selRole._t==="payroll"?"employees":"steps"}</div>
                </div>
                {selRole._t === "payroll" && selRole.employees && <button onClick={()=>{
                  const roleName = (selRole.role||"data").replace(/[^a-zA-Z0-9]/g,"_");
                  let csv = "Employee Name,Job Title,Base Pay,Overtime Pay,Other Pay,Benefits,Total Compensation\n";
                  selRole.employees.forEach(e => { csv += `"${e.n||""}","${selRole.role||""}",${e.base||0},${e.ot||0},${e.other||0},${e.bene||0},${e.total||0}\n`; });
                  const a = document.createElement("a");
                  a.href = "data:text/csv;charset=utf-8,\uFEFF" + encodeURIComponent(csv);
                  a.download = `bandana_wp_${roleName}_employees.csv`; a.click();
                  addLog(`Downloaded ${selRole.employees.length} employee records for ${selRole.role}`);
                }} style={{...sBtn(),display:"flex",alignItems:"center",gap:4,fontSize:11,padding:"6px 12px"}}>
                  ⬇ Download Employee Data
                </button>}
                {selRole._t === "contract" && selRole.steps && <button onClick={()=>{
                  const clsName = (selRole.role||selRole.cls||"data").replace(/[^a-zA-Z0-9]/g,"_");
                  let csv = "Classification,Step,Rate 2022,Rate 2023,Rate 2024,Rate 2025\n";
                  selRole.steps.forEach(s => { csv += `"${selRole.role||selRole.cls}","${s.step||""}",${s.r22||""},${s.r23||""},${s.r24||""},${s.r25||""}\n`; });
                  const a = document.createElement("a");
                  a.href = "data:text/csv;charset=utf-8,\uFEFF" + encodeURIComponent(csv);
                  a.download = `bandana_wp_${clsName}_rates.csv`; a.click();
                  addLog(`Downloaded ${selRole.steps.length} rate records for ${selRole.role||selRole.cls}`);
                }} style={{...sBtn(),display:"flex",alignItems:"center",gap:4,fontSize:11,padding:"6px 12px"}}>
                  ⬇ Download Rate Data
                </button>}
              </div>
              <div style={{marginBottom:14}} />

              {/* PAYROLL DETAIL */}
              {selRole._t === "payroll" && (() => {
                const pctVal = (arr, p) => { const s=[...arr].filter(v=>v>0).sort((a,b)=>a-b); if(!s.length)return null; const idx=(p/100)*(s.length-1); const lo=Math.floor(idx); return lo===Math.ceil(idx)?s[lo]:s[lo]+(s[Math.ceil(idx)]-s[lo])*(idx-lo); };
                const compData = selRole.employees.slice(0,20).map(e => ({name:e.n?.split(" ")[0]||"?",base:e.base,ot:e.ot,other:e.other,bene:e.bene}));
                const ttStyle = {background:"#fff",border:"1px solid #E5E0DA",borderRadius:10,fontSize:12,boxShadow:"0 4px 16px rgba(0,0,0,0.06)"};
                const pctl = percentile;
                const bases=selRole.employees.map(e=>e.base).filter(v=>v>0);
                const ots=selRole.employees.map(e=>e.ot).filter(v=>v>0);
                const benes=selRole.employees.map(e=>e.bene).filter(v=>v>0);
                const others=selRole.employees.map(e=>e.other).filter(v=>v>0);
                const totals=selRole.employees.map(e=>e.total).filter(v=>v>0);
                const metrics = [
                  {label:"Base Pay",min:Math.min(...bases),max:Math.max(...bases),pv:pctVal(bases,pctl),avg:selRole.base_avg,c:"#1A1A1A"},
                  ...(ots.length?[{label:"Overtime",min:Math.min(...ots),max:Math.max(...ots),pv:pctVal(ots,pctl),avg:selRole.ot_avg,c:"#F5C518"}]:[]),
                  ...(benes.length?[{label:"Benefits",min:Math.min(...benes),max:Math.max(...benes),pv:pctVal(benes,pctl),avg:selRole.bene_avg,c:"#D4A90A"}]:[]),
                  ...(others.length?[{label:"Other Pay",min:Math.min(...others),max:Math.max(...others),pv:pctVal(others,pctl),avg:selRole.other_avg,c:"#9C9690"}]:[]),
                  {label:"Total Comp",min:Math.min(...totals),max:Math.max(...totals),pv:pctVal(totals,pctl),avg:selRole.total_avg,c:"#1A1A1A"},
                ];
                const isTop = pctl > 50;
                const label = isTop ? `Top ${100-pctl}%` : `Bottom ${pctl}%`;
                const aboveCount = totals.filter(t => t >= (pctVal(totals,pctl)||0)).length;

                return <div>
                  {/* Stat cards */}
                  <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:16}}>
                    {[{l:"Average Base Pay",v:fmt(selRole.base_avg),s:`Median: ${fmt(selRole.base_med)}`},
                      {l:"Average Overtime",v:selRole.ot_avg>0?fmt(selRole.ot_avg):"N/A",s:selRole.ot_avg>0?`${Math.round(selRole.ot_avg/selRole.base_avg*100)}% of base`:"—"},
                      {l:"Average Benefits",v:selRole.bene_avg>0?fmt(selRole.bene_avg):"N/A",s:selRole.bene_avg>0?`${Math.round(selRole.bene_avg/selRole.base_avg*100)}% of base`:"—"},
                      {l:"Average Total Comp",v:fmt(selRole.total_avg),s:`${fmt(selRole.total_min)} – ${fmt(selRole.total_max)}`},
                    ].map((s,i)=><div key={i} style={{background:"#fff",border:i===0?"2px solid #1A1A1A":`1px solid ${C.bd}`,borderRadius:10,padding:14}}>
                      <div style={{fontSize:11,color:C.mt}}>{s.l}</div>
                      <div style={{fontSize:26,fontWeight:700,marginTop:4}}>{s.v}</div>
                      <div style={{fontSize:11,color:C.dm,marginTop:2}}>{s.s}</div>
                    </div>)}
                  </div>

                  {/* PERCENTILE EXPLORER */}
                  <div style={{background:"#fff",border:"2px solid #F5C518",borderRadius:12,padding:20,marginBottom:16}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
                      <div>
                        <div style={{fontSize:15,fontWeight:700}}>Percentile Explorer</div>
                        <div style={{fontSize:12,color:C.mt,marginTop:3}}>Drag slider or tap a preset to see pay at any percentile</div>
                      </div>
                      <div style={{textAlign:"right",background:"#FAFAF8",borderRadius:10,padding:"10px 18px",border:`1px solid ${C.bd}`}}>
                        <div style={{fontSize:30,fontWeight:800,lineHeight:1}}>{label}</div>
                        <div style={{fontSize:11,color:C.mt,marginTop:4}}>{aboveCount} of {selRole.count} at or above</div>
                      </div>
                    </div>

                    {/* Slider with value tooltip */}
                    <div style={{marginBottom:20,position:"relative",padding:"0 2px"}}>
                      <div style={{position:"relative",marginBottom:8}}>
                        {/* Current value indicator */}
                        <div style={{position:"absolute",left:`calc(${pctl}% - 20px)`,top:-28,background:"#1A1A1A",color:"#fff",fontSize:12,fontWeight:700,padding:"3px 8px",borderRadius:6,whiteSpace:"nowrap",zIndex:2,pointerEvents:"none"}}>
                          P{pctl}
                          <div style={{position:"absolute",bottom:-4,left:"50%",transform:"translateX(-50%)",width:0,height:0,borderLeft:"5px solid transparent",borderRight:"5px solid transparent",borderTop:"5px solid #1A1A1A"}} />
                        </div>
                        <input type="range" min={1} max={99} value={pctl} onChange={e=>setPercentile(Number(e.target.value))}
                          style={{width:"100%",height:8,appearance:"none",WebkitAppearance:"none",background:`linear-gradient(to right, #F5C518 ${pctl}%, #E5E0DA ${pctl}%)`,borderRadius:4,outline:"none",cursor:"pointer",margin:0}} />
                        <style>{`input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:24px;height:24px;border-radius:50%;background:#1A1A1A;border:3px solid #F5C518;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,0.2);margin-top:0}`}</style>
                      </div>
                      {/* Tick marks */}
                      <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:C.dm,padding:"0 1px"}}>
                        {[0,25,50,75,100].map(p=><span key={p} style={{fontWeight:600}}>{p}</span>)}
                      </div>
                    </div>

                    {/* Preset buttons */}
                    <div style={{display:"flex",justifyContent:"center",gap:6,marginBottom:20}}>
                      {[10,25,50,75,90].map(p=><button key={p} onClick={()=>setPercentile(p)} style={{padding:"6px 16px",borderRadius:20,fontSize:12,fontWeight:600,cursor:"pointer",border:pctl===p?"2px solid #1A1A1A":`1.5px solid ${C.bd}`,background:pctl===p?"#1A1A1A":"#fff",color:pctl===p?"#fff":"#1A1A1A",fontFamily:"inherit",transition:"all 0.12s"}}>P{p}</button>)}
                    </div>
                    <div style={{display:"grid",gap:12}}>
                      {metrics.map((m,i)=>{
                        const range=m.max-m.min||1; const pctPos=m.pv!=null?((m.pv-m.min)/range*100):0; const avgPos=(m.avg-m.min)/range*100;
                        return <div key={i}>
                          <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                            <span style={{fontSize:12,fontWeight:600}}>{m.label}</span>
                            <span style={{fontSize:15,fontWeight:700,color:m.c}}>{m.pv!=null?fmt(Math.round(m.pv)):"N/A"}</span>
                          </div>
                          <div style={{position:"relative",height:22,background:"#F0EDE9",borderRadius:6}}>
                            <div style={{position:"absolute",left:0,top:0,height:22,width:`${Math.min(pctPos,100)}%`,background:`${m.c}20`,borderRadius:6}} />
                            <div style={{position:"absolute",left:`${Math.min(avgPos,98)}%`,top:0,width:2,height:22,background:C.dm,opacity:0.5}} />
                            {m.pv!=null&&<div style={{position:"absolute",left:`calc(${Math.min(pctPos,96)}% - 7px)`,top:3,width:16,height:16,borderRadius:"50%",background:m.c,border:"2px solid #fff",boxShadow:"0 1px 4px rgba(0,0,0,0.15)"}} />}
                          </div>
                          <div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:C.dm,marginTop:2}}><span>{fmt(m.min)}</span><span style={{color:C.mt}}>avg: {fmt(Math.round(m.avg))}</span><span>{fmt(m.max)}</span></div>
                        </div>;
                      })}
                    </div>
                  </div>

                  {/* Charts row */}
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
                    {/* Compensation breakdown - cleaner sorted bar */}
                    <div style={{background:"#fff",border:`1px solid ${C.bd}`,borderRadius:12,padding:18}}>
                      <div style={{fontSize:13,fontWeight:700,marginBottom:4}}>Compensation Breakdown</div>
                      <div style={{fontSize:11,color:C.dm,marginBottom:14}}>Top 20 earners by total compensation</div>
                      <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={compData} barSize={18}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE9" vertical={false} />
                          <XAxis dataKey="name" tick={{fontSize:9,fill:"#A09A93"}} interval={0} angle={-35} textAnchor="end" height={50} axisLine={false} tickLine={false} />
                          <YAxis tick={{fontSize:10,fill:"#A09A93"}} tickFormatter={v=>`$${(v/1000).toFixed(0)}k`} axisLine={false} tickLine={false} />
                          <Tooltip contentStyle={{background:"#fff",border:"1px solid #E5E0DA",borderRadius:10,fontSize:12,boxShadow:"0 4px 16px rgba(0,0,0,0.06)"}} formatter={v=>fmt(v)} />
                          <Bar dataKey="base" stackId="c" fill="#2D2D2D" name="Base Pay" radius={[0,0,0,0]} />
                          <Bar dataKey="ot" stackId="c" fill="#E8A800" name="Overtime" />
                          <Bar dataKey="bene" stackId="c" fill="#4A9B5C" name="Benefits" />
                          <Bar dataKey="other" stackId="c" fill="#B8B0A6" name="Other" radius={[4,4,0,0]} />
                          <Legend iconType="circle" iconSize={8} wrapperStyle={{fontSize:11,paddingTop:8}} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Comp split - horizontal stacked bar instead of pie */}
                    <div style={{background:"#fff",border:`1px solid ${C.bd}`,borderRadius:12,padding:18}}>
                      <div style={{fontSize:13,fontWeight:700,marginBottom:4}}>Average Compensation Split</div>
                      <div style={{fontSize:11,color:C.dm,marginBottom:18}}>How total pay breaks down</div>
                      {(() => {
                        const splitData = [{name:"Base Pay",value:selRole.base_avg,color:"#2D2D2D"},{name:"Overtime",value:selRole.ot_avg||0,color:"#E8A800"},{name:"Benefits",value:selRole.bene_avg||0,color:"#4A9B5C"},{name:"Other",value:selRole.other_avg||0,color:"#B8B0A6"}].filter(d=>d.value>0);
                        const totalComp = splitData.reduce((s,d)=>s+d.value,0);
                        return <div>
                          {/* Stacked bar */}
                          <div style={{display:"flex",borderRadius:8,overflow:"hidden",height:36,marginBottom:16}}>
                            {splitData.map((d,i)=><div key={i} style={{width:`${(d.value/totalComp*100)}%`,background:d.color,display:"flex",alignItems:"center",justifyContent:"center"}}>
                              {d.value/totalComp>0.12&&<span style={{fontSize:10,fontWeight:600,color:"#fff"}}>{Math.round(d.value/totalComp*100)}%</span>}
                            </div>)}
                          </div>
                          {/* Legend items */}
                          <div style={{display:"grid",gap:10}}>
                            {splitData.map((d,i)=>(
                              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                                <div style={{display:"flex",alignItems:"center",gap:8}}>
                                  <div style={{width:10,height:10,borderRadius:3,background:d.color}} />
                                  <span style={{fontSize:13,fontWeight:500}}>{d.name}</span>
                                </div>
                                <div style={{textAlign:"right"}}>
                                  <span style={{fontSize:15,fontWeight:700}}>{fmt(d.value)}</span>
                                  <span style={{fontSize:11,color:C.dm,marginLeft:6}}>{Math.round(d.value/totalComp*100)}%</span>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div style={{borderTop:`1px solid ${C.bd}`,marginTop:12,paddingTop:12,display:"flex",justifyContent:"space-between"}}>
                            <span style={{fontSize:13,fontWeight:700}}>Total Compensation</span>
                            <span style={{fontSize:17,fontWeight:800}}>{fmt(totalComp)}</span>
                          </div>
                        </div>;
                      })()}
                    </div>
                  </div>

                  {/* Pay vs Other Roles at this employer */}
                  {roleStats.length > 1 && <div style={{background:"#fff",border:`1px solid ${C.bd}`,borderRadius:12,padding:18,marginBottom:16}}>
                    <div style={{fontSize:13,fontWeight:700,marginBottom:4}}>Pay Compared to Other Roles</div>
                    <div style={{fontSize:11,color:C.dm,marginBottom:14}}>How {cleanTitle(selRole.role)} compares across {selEmp}</div>
                    <ResponsiveContainer width="100%" height={Math.min(roleStats.length * 32 + 40, 280)}>
                      <BarChart data={roleStats.slice(0,15).map(r=>({
                        name: (r.role||"").substring(0,22) + (r.role?.length>22?"…":""),
                        avg: r.base_avg,
                        fill: r.role === selRole.role ? "#E8A800" : "#E5E0DA",
                      }))} layout="vertical" barSize={16}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE9" horizontal={false} />
                        <XAxis type="number" tick={{fontSize:10,fill:"#A09A93"}} tickFormatter={v=>`$${(v/1000).toFixed(0)}k`} axisLine={false} tickLine={false} />
                        <YAxis dataKey="name" type="category" tick={{fontSize:10,fill:"#7A756E"}} width={120} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{background:"#fff",border:"1px solid #E5E0DA",borderRadius:10,fontSize:12}} formatter={v=>fmt(v)} />
                        <Bar dataKey="avg" name="Avg Base" radius={[0,4,4,0]}>
                          {roleStats.slice(0,15).map((r,i)=><Cell key={i} fill={r.role===selRole.role?"#E8A800":"#D5D0CA"} />)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>}

                  {/* BENJI SAYS */}
                  {(() => {
                    const r = selRole;
                    const p90base = pctVal(bases, 90);
                    const p10base = pctVal(bases, 10);
                    const p90total = pctVal(totals, 90);
                    const otPct = r.ot_avg && r.base_avg ? Math.round(r.ot_avg / r.base_avg * 100) : 0;
                    const hasOT = ots.length > 0;
                    const highOT = otPct > 15;
                    const topEarner = r.employees[0];
                    const spread = r.base_max && r.base_min ? ((r.base_max / r.base_min - 1) * 100).toFixed(0) : 0;
                    const benePct = r.bene_avg && r.total_avg ? Math.round(r.bene_avg / r.total_avg * 100) : 0;

                    const B = v => <strong>{v}</strong>;
                    const lines = [];
                    lines.push(<span>{selEmp} has {B(r.count.toLocaleString())} {cleanTitle(r.role)} employee{r.count!==1?"s":""} on the payroll. The average base pay is {B(fmt(r.base_avg))}, with a median of {B(fmt(r.base_med))}.</span>);

                    if (Number(spread) > 30) {
                      lines.push(<span>There's a wide pay spread, {B(`${spread}%`)} between the lowest ({B(fmt(r.base_min))}) and highest ({B(fmt(r.base_max))}) earners. This likely reflects differences in seniority, tenure, or step placement.</span>);
                    } else if (Number(spread) > 0) {
                      lines.push(<span>Pay is relatively consistent, ranging from {B(fmt(r.base_min))} to {B(fmt(r.base_max))}.</span>);
                    }

                    if (hasOT && highOT) {
                      lines.push(<span>This role sees significant overtime, averaging {B(fmt(r.ot_avg))} ({B(`${otPct}%`)} of base pay). {B(`${ots.length} of ${r.count}`)} employees logged OT. If you're looking at total earnings potential, overtime is a major factor here.</span>);
                    } else if (hasOT && otPct > 0) {
                      lines.push(<span>Overtime is available but modest, averaging {B(fmt(r.ot_avg))} ({otPct}% of base). {ots.length} of {r.count} employees logged some OT.</span>);
                    } else {
                      lines.push(<span>This role has minimal or no overtime on record.</span>);
                    }

                    if (p90base) {
                      lines.push(<span>The top 10% of earners make at least {B(fmt(Math.round(p90base)))} in base pay{p90total ? <span> and {B(fmt(Math.round(p90total)))} in total compensation</span> : ""}. Use the percentile slider above to explore the full range.</span>);
                    }

                    if (benePct > 20) {
                      lines.push(<span>Benefits make up {B(`${benePct}%`)} of total comp ({B(fmt(r.bene_avg))} on average), a strong benefits package.</span>);
                    }

                    if (topEarner && topEarner.total > r.total_avg * 1.3) {
                      lines.push(<span>Top earner {B(topEarner.n || "on record")} pulled in {B(fmt(topEarner.total))} total, {B(`${Math.round((topEarner.total / r.total_avg - 1) * 100)}%`)} above average.</span>);
                    }

                    return <div style={{background:"#FFFDF5",border:"1.5px solid #F5C518",borderRadius:12,padding:18,marginBottom:16}}>
                      <div style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:10}}>
                        <img src={BENJI_IMG} style={{width:36,height:36,borderRadius:10,flexShrink:0,objectFit:"cover"}} alt="Benji" />
                        <div>
                          <div style={{fontSize:14,fontWeight:700}}>A Word From Benji</div>
                          <div style={{fontSize:13,color:"#3A3530",lineHeight:1.65,marginTop:6}}>{lines.map((line,i) => <span key={i}>{i>0?" ":""}{line}</span>)}</div>
                        </div>
                      </div>
                    </div>;
                  })()}

                  <div style={{fontSize:12,fontWeight:700,marginBottom:8}}>All Employees ({selRole.employees.length})</div>
                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                    <thead><tr><th style={sTh}>#</th><th style={sTh}>Name</th><th style={sTh}>Base Pay</th><th style={sTh}>Overtime</th><th style={sTh}>Other</th><th style={sTh}>Benefits</th><th style={sTh}>Total</th></tr></thead>
                    <tbody>{selRole.employees.map((e,i)=>(
                      <tr key={i}><td style={{...sTd,color:C.dm}}>{i+1}</td><td style={{...sTd,fontWeight:500}}>{e.n}</td><td style={{...sTd,fontWeight:600}}>{fmt(e.base)}</td><td style={sTd}>{e.ot>0?fmt(e.ot):"—"}</td><td style={sTd}>{e.other>0?fmt(e.other):"—"}</td><td style={sTd}>{e.bene>0?fmt(e.bene):"—"}</td><td style={{...sTd,fontWeight:700}}>{fmt(e.total)}</td></tr>
                    ))}</tbody>
                  </table>
                </div>;
              })()}

              {/* CONTRACT DETAIL */}
              {selRole._t === "contract" && (() => {
                const topStep = selRole.steps[selRole.steps.length-1];
                const topStepTrend = [{yr:"2022",rate:topStep?.r22},{yr:"2023",rate:topStep?.r23},{yr:"2024",rate:topStep?.r24},{yr:"2025",rate:topStep?.r25}].filter(d=>d.rate);
                const ttStyle = {background:"#fff",border:"1px solid #E8E4DF",borderRadius:6,fontSize:11,boxShadow:"0 2px 8px rgba(0,0,0,0.06)"};
                return <div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:16}}>
                    {[{l:"2022 Entry",v:fmtHr(selRole.min22)},{l:"2025 Entry",v:fmtHr(selRole.steps[0]?.r25)},{l:"2025 Top Rate",v:fmtHr(selRole.max25),bold:true},{l:"3-Year Growth",v:selRole.pctInc?`+${selRole.pctInc}%`:"—"}].map((s,i)=><div key={i} style={{background:"#fff",border:s.bold?"2px solid #1A1A1A":`1px solid ${C.bd}`,borderRadius:10,padding:14}}>
                      <div style={{fontSize:11,color:C.mt}}>{s.l}</div>
                      <div style={{fontSize:26,fontWeight:700,marginTop:4}}>{s.v}</div>
                    </div>)}
                  </div>
                  {selRole.dept&&<div style={{fontSize:11,color:C.mt,marginBottom:12}}>Dept: <strong>{selRole.dept}</strong>{selRole.sap?` · SAP: ${selRole.sap}`:""}</div>}
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
                    <div style={{background:"#fff",border:`1px solid ${C.bd}`,borderRadius:10,padding:16}}>
                      <div style={{fontSize:12,fontWeight:700,marginBottom:12}}>Top Step Rate Trend</div>
                      <ResponsiveContainer width="100%" height={180}>
                        <LineChart data={topStepTrend}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#E8E4DF" />
                          <XAxis dataKey="yr" tick={{fontSize:11,fill:"#6B6560"}} />
                          <YAxis tick={{fontSize:10,fill:"#6B6560"}} tickFormatter={v=>`$${v}`} domain={["dataMin-2","dataMax+2"]} />
                          <Tooltip contentStyle={ttStyle} formatter={v=>fmtHr(v)} />
                          <Line type="monotone" dataKey="rate" stroke="#1A1A1A" strokeWidth={2.5} dot={{fill:"#F5C518",stroke:"#1A1A1A",strokeWidth:2,r:5}} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div style={{background:"#fff",border:`1px solid ${C.bd}`,borderRadius:10,padding:16}}>
                      <div style={{fontSize:12,fontWeight:700,marginBottom:12}}>2025 Rate by Step</div>
                      <ResponsiveContainer width="100%" height={180}>
                        <BarChart data={selRole.steps.map(st=>({step:(st.step||"").replace("End ",""),rate:st.r25})).filter(d=>d.rate)}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#E8E4DF" vertical={false} />
                          <XAxis dataKey="step" tick={{fontSize:9,fill:"#6B6560"}} interval={0} angle={-20} textAnchor="end" height={40} />
                          <YAxis tick={{fontSize:10,fill:"#6B6560"}} tickFormatter={v=>`$${v}`} domain={["dataMin-3","dataMax+1"]} />
                          <Tooltip contentStyle={ttStyle} formatter={v=>fmtHr(v)} />
                          <Bar dataKey="rate" fill="#F5C518" radius={[4,4,0,0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  {/* BENJI SAYS - CONTRACT */}
                  {(() => {
                    const r = selRole;
                    const topRate = r.max25;
                    const startRate = r.steps[0]?.r25;
                    const startRate22 = r.steps[0]?.r22;
                    const annualTop = topRate ? Math.round(topRate * 2080) : 0;
                    const annualStart = startRate ? Math.round(startRate * 2080) : 0;
                    const numSteps = r.steps.length;
                    const yearlyBump = startRate22 && startRate ? ((startRate / startRate22 - 1) * 100 / 3).toFixed(1) : null;

                    const lines = [];
                    const B = v => <strong>{v}</strong>;
                    lines.push(<span>The {cleanTitle(r.role||r.cls)} classification under this contract has {B(`${numSteps}`)} progression step{numSteps!==1?"s":""}.</span>);

                    if (startRate && topRate && startRate !== topRate) {
                      lines.push(<span>Starting rate in 2025 is {B(`${fmtHr(startRate)}/hr`)} ({B(fmt(annualStart))}/yr), progressing to {B(`${fmtHr(topRate)}/hr`)} ({B(fmt(annualTop))}/yr) at the top step, a {B(`${((topRate/startRate-1)*100).toFixed(0)}%`)} increase through step progression alone.</span>);
                    } else if (topRate) {
                      lines.push(<span>The 2025 rate is {B(`${fmtHr(topRate)}/hr`)}, which annualizes to roughly {B(fmt(annualTop))}.</span>);
                    }

                    if (r.pctInc) {
                      lines.push(<span>Over the 3-year contract period (2022 to 2025), rates increased {B(`${r.pctInc}%`)}{yearlyBump ? <span>, roughly {B(`${yearlyBump}%`)} per year</span> : ""}. These are negotiated General Wage Increases (GWIs) that apply across the board.</span>);
                    }

                    if (numSteps > 3) {
                      lines.push(<span>With {B(`${numSteps} steps`)}, there's room for meaningful pay progression within this role before needing a promotion. Each step typically requires 6 to 12 months of service.</span>);
                    }

                    return <div style={{background:"#FFFDF5",border:"1.5px solid #F5C518",borderRadius:12,padding:18,marginBottom:16}}>
                      <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                        <img src={BENJI_IMG} style={{width:36,height:36,borderRadius:10,flexShrink:0,objectFit:"cover"}} alt="Benji" />
                        <div>
                          <div style={{fontSize:14,fontWeight:700}}>A Word From Benji</div>
                          <div style={{fontSize:13,color:"#3A3530",lineHeight:1.65,marginTop:6}}>{lines.map((line,i) => <span key={i}>{i>0?" ":""}{line}</span>)}</div>
                        </div>
                      </div>
                    </div>;
                  })()}

                  <div style={{fontSize:12,fontWeight:700,marginBottom:8}}>All Steps × Years</div>
                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                    <thead><tr><th style={sTh}>Step</th><th style={sTh}>2022</th><th style={sTh}>2023</th><th style={sTh}>2024</th><th style={sTh}>2025</th><th style={sTh}>3yr ↑</th></tr></thead>
                    <tbody>{selRole.steps.map((st,i)=>(
                      <tr key={i}><td style={{...sTd,fontWeight:600}}>{st.step}</td><td style={sTd}>{fmtHr(st.r22)}</td><td style={sTd}>{fmtHr(st.r23)}</td><td style={sTd}>{fmtHr(st.r24)}</td><td style={{...sTd,fontWeight:700}}>{fmtHr(st.r25)}</td><td style={{...sTd,color:"#2E7D32",fontWeight:600}}>{st.r22&&st.r25?`+${((st.r25/st.r22-1)*100).toFixed(1)}%`:"—"}</td></tr>
                    ))}</tbody>
                  </table>
                </div>;
              })()}
            </div>
          </div>}
        </div>}

        {/* ═══ LOG ═══ */}
        {tab==="log" && <div style={sCard}>
          <div style={sTitle}>Activity Log</div>
          {log.length===0&&<div style={{color:C.dm,fontSize:12}}>No activity yet</div>}
          {log.map((e,i)=><div key={i} style={{padding:"3px 0",fontSize:12,color:e.includes("✅")?"#2E7D32":e.includes("⚠️")||e.includes("error")?"#C62828":C.tx,fontFamily:"monospace",borderBottom:"1px solid rgba(255,255,255,0.02)"}}>{e}</div>)}
        </div>}
      </div>
    </div>
  );
}
