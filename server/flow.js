

module.exports = {
    simpleFlow:function(err, result){
      if(err){
        console.log(error);
        res.sendStatus(500);
      }else{
        res.json(result);
      }
  }
}
