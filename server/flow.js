

module.exports = {
    simpleFlow:function(err, result){
      if(err){
        console.error(error);
        res.sendStatus(500);
      }else{
        res.json(result);
      }
  }
}
