const database = require('../services/database.js');

function dateFormat(data){
  var dataSplit = data.split('/');
  data = dataSplit[1] + '/' + dataSplit[0] + '/' + dataSplit[2]
  return new Date(data)
}


const baseQuery = 
 `select enddate "data",
    endtime "hora",
    receiverid "concessionaria",
    protocolfilename "arquivo"
  from current_996096275`;

  //select enddate, endtime, senderid, receiverid, protocolfilename, state, isalert from current_996096275 where protocolfilename like '%.NEL' order by eventdate, eventtime

async function find(context) {
  let query = baseQuery;
  const binds = {};

  if (context.tipo && context.datainicial) {



    if(dateFormat(context.datafinal) < dateFormat(context.datainicial) || context.datafinal == null || context.datafinal == ""){
      context.datafinal = context.datainicial
      console.log(context.datafinal);
    }

    binds.tipo = '%.' + context.tipo;
    binds.datainicial = context.datainicial;
    binds.datafinal = context.datafinal;
    
    if(context.sequencial && context.IDconcessionaria && context.sequencial.length == 5){
      binds.sequencial = '%' + context.sequencial + '%';
      binds.IDconcessionaria = context.IDconcessionaria + '%';
      query += ` where protocolfilename like :tipo and protocolfilename like :sequencial and enddate between TO_DATE(:datainicial, 'DD/MM/YY') and TO_DATE(:datafinal, 'DD/MM/YY') and  receiverid like :IDconcessionaria and isalert = 0 and state = 'TERMINATED'  order by eventdate, eventtime`;
    }else if(context.IDconcessionaria){
      binds.IDconcessionaria = context.IDconcessionaria + '%';
      query += ` where protocolfilename like :tipo and enddate between TO_DATE(:datainicial, 'DD/MM/YY') and TO_DATE(:datafinal, 'DD/MM/YY') and  receiverid like :IDconcessionaria and isalert = 0 and state = 'TERMINATED' order by eventdate, eventtime`;
    }else if(context.sequencial && context.sequencial.length == 5){
      binds.sequencial = '%' + context.sequencial + '%';
      query += ` where protocolfilename like :tipo and protocolfilename like :sequencial and enddate between TO_DATE(:datainicial, 'DD/MM/YY') and TO_DATE(:datafinal, 'DD/MM/YY') and isalert = 0 and state = 'TERMINATED' order by eventdate, eventtime`;
    }else{
      query += ` where protocolfilename like :tipo and enddate between TO_DATE(:datainicial, 'DD/MM/YY') and TO_DATE(:datafinal, 'DD/MM/YY') and isalert = 0 and state = 'TERMINATED' order by eventdate, eventtime`;
    }
    //console.log(query);
    
    const result = await database.simpleExecute(query, binds);

    return result.rows;
  } else{
    let jsonErro = '{"ERRO" : "TIPO E DATA INICIAL OBRIGATÓRIOS"}';
    jsonErro = JSON.parse(jsonErro);
    return jsonErro;
  }
}

module.exports.find = find;