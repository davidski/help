AWS.config.region = "us-west-2";

AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: "us-west-2:8496cbfb-ce1d-41d4-8bb9-940412bebd2b"
});

window.onload = function(){
    var predict_btn = document.getElementById("predict-button");
    var endpoint_btn = document.getElementById("btnStartEndpoint");
    var cognito_id = document.getElementById("cognito_id");

    AWS.config.credentials.get(function(err){
        if (err) {alert(err);}
        cognito_id.innerHTML = "Cognito Identity ID: " + AWS.config.credentials.identityID + "</p>";
    });
    
    AWS.config.region = "us-east-1";
    
    checkEndpointStatus();

    addHandler(predict_btn, endpoint_btn);
};

var checkEndpointStatus = function() {

    var ML = new AWS.MachineLearning();

    var MLparams = {
        MLModelId: "ml-oKHtcVCiEit",
        Verbose: false
    };

    ML.getMLModel(MLparams, function(err, data) {
        if (err) {console.log(err, err.stack);}
        else {updateEndpointStatusDisplay(data.EndpointInfo.EndpointStatus);}
    })
      
};

var updateEndpointStatusDisplay = function(status){
    document.getElementById("endpoint_status").innerHTML = status;
    if (status === "NONE") {
        document.getElementById("btnStartEndpoint").disabled = false;
        document.getElementById("predict-button").disabled = true;
    } else {
        document.getElementById("btnStartEndpoint").disabled = true;
        document.getElementById("predict-button").disabled = false;
        clearInterval();
    };
};

var startEndpoint = function(){
    // start realtime prediction endpoint
    var ML = new AWS.MachineLearning();
    var MLparams = {
        MLModelId: "ml-oKHtcVCiEit"
    };
    ML.createRealtimeEndpoint(MLparams, function(err, data) {
        if (err) {console.log(err, err.stack);}
        else {console.log(data);}
    })
    

    setInterval(function(){ window.location.reload();}, 120000);
}

var addHandler = function(predictBtn, endpointBtn){
    predictBtn.addEventListener("click", callPredict);
    endpointBtn.addEventListener("click", startEndpoint);
};

var callPredict = function(){
    // do ML submission here
    var ML = new AWS.MachineLearning();

    var MLparams = {
        MLModelId: "ml-oKHtcVCiEit",
        PredictEndpoint: "https://realtime.machinelearning.us-east-1.amazonaws.com",
        Record: {
        }
    };

    var x = document.getElementById("predict-params");
    var i;
    for (i = 0; i < x.length ;i++) {
        MLparams.Record[x.elements[i].id] = x.elements[i].value;
    }
    
    ML.predict(MLparams, function(err, data) {
        if (err) {results.innerHTML = "ERROR: " + err;}
        else {
            console.log(data);
            updateResults(MLparams, data);
        }
    });
    console.log("Button function complete!");
};

var updateResults = function(MLparams, data) {
    var results = document.getElementById("results_output");
    var debug_output = document.getElementById("debug_output");

    results.innerHTML = data.Prediction.predictedLabel;
    results.className += " bg-success";
    debug_output.innerHTML = "Passed parameters are: " + JSON.stringify(MLparams.Record) + "</p>Contents of result: " + JSON.stringify(data);
};