angular.module('eloEverything').directive('scoreGraph', function() {
  return {
    scope: {
      scoresCollection: "="
    },
    templateUrl: "app/js/directives/scoreGraph/scoreGraph.html",
    link: function(scope, elem, attr) {
      // var chrt =

      var ctx = elem.find('canvas')[0].getContext("2d");
      var chartData = {};
      updateChartData();

      function updateChartData() {
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
          "rgba(220,220,220,",
          "rgba(220,220,120,",
          "rgba(220,120,220,",
          "rgba(120,220,220,",
          "rgba(120,120,220,",
          "rgba(120,220,120,",
          "rgba(220,120,120,",
          "rgba(120,120,120,"
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
              fillColor: cols[index]+"0.2)",
              strokeColor: cols[index]+"1)",
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

        var myNewChart = new Chart(ctx).Line(chartData)
        elem.append(myNewChart.generateLegend());
      }
    }
  }
})
