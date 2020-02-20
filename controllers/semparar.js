const semparar = require('../db_apis/semparar.js');

function formatarDataFinal(data){
  var meses = ['','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Out','Nov','Dec'];
  var dataFinal;
  for (var i = 0; i < meses.length; i++){
    if(data[1] == meses[i]){
      var mes = i < 10 ? '0' + i: i;
      dataFinal = data[2] + '/' + mes + '/' + data[3];
    }
  }
  return dataFinal;
}

async function post(req, res, next) {
    if (req.get('Token_autorizacao') == "vxt`sFAL_%E5&^;A"){
      try {
        const context = {};
        context.tipo = req.body.tipo;
        context.datainicial = req.body.datainicial;
        context.datafinal = req.body.datafinal;
        context.sequencial = req.body.sequencial;      
        context.IDconcessionaria = req.body.IDconcessionaria;      
  
        var rows = '{"Sucesso": ""}'
        rows = JSON.parse(rows);
        rows.lista = await semparar.find(context);
        var data;
        try{
          for(var i = 0; i < rows.lista.length ; i++){
            rows.lista[i].concessionaria = rows.lista[i].concessionaria.substr(0,5);
            rows.lista[i].sequencial = rows.lista[i].arquivo.substr(14, 5); 
            rows.lista[i].data = formatarDataFinal(rows.lista[i].data.toString().split(' '))  
          }
       
          
        }catch(e){
          console.log(e);
        }
        
        if (req.body.tipo && req.body.datainicial) {
            rows.Sucesso = true;
            res.status(200).json(rows);               
        } else {
            rows.Sucesso = false;
            res.status(400).json(rows);
        }
        console.log(rows);
      } catch (err) {
        next(err);
      }
    }else{
      res.status(400).json(JSON.parse('{"ERRO":"CREDENCIAIS INCORRETAS"}'))
    }
  }




module.exports.post = post;