# flowChart.js

flowChart.js is *jquery plugin for a pure browser flow-chart generation*.
It allow you to easily add flow-chart to your webpages.
It is standalone, less then 5k after minify+gzip, no image download.
It doesnt rely on external services which go on and off, or add latency while loading.

Show, dont tell, here is a <a href=''>example</a>


## How to Use It

Let me walk you thru it. First include it in your webpage with the usual script tag
    
    <script type="text/javascript" src="js/flowChart.js"></script>

Then create a DOM element which gonna contains the generated qrcode image. Lets say
a div

    <div id="flow-chart" style="width: 800px; height: 600px;"></div>

Then you add the *flowChart* in this container by

    jquery('#flow-chart').flowChart({ count: 4 });

This is it. see it <a href='index.html'>live</a>.

You can set the teams of the generated flowChart:

    jquery('#flow-chart').flowChart({ count: 4, teams: ['team1', 'team2', 'team3', 'team4', 'team2', 'team3', 'team2']});


## Conclusion
If you hit bugs, fill issues on github.
Feel free to fork, modify and have fun with it :)