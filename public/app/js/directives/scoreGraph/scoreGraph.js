angular.module('eloEverything').directive('scoreGraph', function() {
  
  var origionalDraw = Chart.controllers.line.prototype.draw;
  var myScoreX = 1200;

  Chart.controllers.line.prototype.draw = function(ease){
    origionalDraw.call(this, ease);

    var myScore = myScoreX;
    var scale = this.chart.scales['x-axis-0'];
    // var bot = this.chart.scales['y-axis-0'];

    var top = this.chart.scales['y-axis-0'].top;
    var bottom = this.chart.scales['y-axis-0'].bottom;

    var left = (myScore-scale.min*1)/ (scale.max*1-scale.min*1) * (scale.right - scale.left) + scale.left;

    this.chart.chart.ctx.beginPath();
    this.chart.chart.ctx.strokeStyle = '#000';
    this.chart.chart.ctx.moveTo(left,top);
    this.chart.chart.ctx.lineTo(left,bottom);
    this.chart.chart.ctx.stroke();

    this.chart.chart.ctx.textAlign = "center";
    this.chart.chart.ctx.fillStyle = '#000';
    this.chart.chart.ctx.fillText('YOU', left - 20, top+20);
  };



  return {
    scope: {
      scoresCollection: "=",
      myScore:"="
    },
    templateUrl: "app/js/directives/scoreGraph/scoreGraph.html",
    link: function(scope, elem, attr) {
      // var chrt =

      var ctx = elem.find('canvas')[0].getContext("2d");
      var chartData = {};
      updateChartData();

      function updateChartData() {
        myScoreX = scope.myScore;
        var bounds = scope.scoresCollection.reduce(function(prev, item) {
          return item.scores.reduce(function(prev, cur) {
            if (cur < prev.min) prev.min = cur;
            if (cur > prev.max) prev.max = cur;
            return prev;
          }, prev)
        }, {
          min: 2000,
          max: 0
        })

        var labels = [];
        var segments = 10;
        for (var i = 0; i < segments; i++) {
          labels.push(Math.floor(bounds.min + (i + 0.5) * (bounds.max - bounds.min) / segments)+"")
        }

        var cols =[
          "rgba(54,170,240,",//custom blue
          "rgba(28,107,180,",//custom blue

          "rgba(120,120,220,",//blue
          "rgba(120,220,120,",//green
          "rgba(220,120,120,",//red


          "rgba(220,220,220,",//grey
          "rgba(220,220,120,",
          "rgba(220,120,220,",
          "rgba(120,220,220,",




        ]
        var datasets = scope.scoresCollection.map(function(data, index) {
          var l = data.scores.length;
            var dataset = data.scores.reduce(function(prev, cur) {
              var index = Math.floor((cur - bounds.min) / (bounds.max - bounds.min) * segments)
              if(index == segments) index--;
              prev[index]+= 100/l;
              return prev;
            }, labels.map(function() {
              return 0;
            }))

            return {
              label: data.name,
              backgroundColor: cols[index]+"0.2)",
              borderColor: cols[index]+"1)",
              pointColor: cols[index]+"1)",
              pointStrokeColor: "#fff",
              pointHighlightFill: "#fff",
              pointHighlightStroke: "rgba(220,220,220,1)",
              data: dataset

            }
          })
          // console.log(labelArray);

        chartData = {
          labels: labels,
          datasets: datasets,
        }

        Chart.defaults.global.responsive = true;

        var myNewChart = new Chart(ctx, {
            type:'line',
            data:chartData
          });

      }
    }
  }
})
