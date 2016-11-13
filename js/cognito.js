AWS.config.region = "us-west-2";

AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: "us-west-2:8496cbfb-ce1d-41d4-8bb9-940412bebd2b"
});

window.onload = function(){
    var button = document.getElementById("predict-button");
    var results = document.getElementById("results");
    var cognito_id = document.getElementById("cognito_id");

    AWS.config.credentials.get(function(err){
        if (err) {alert(err);}
        cognito_id.innerHTML = "Cognito Identity ID: " + AWS.config.credentials.identityID + "</p>";
    });

    addHandler(button);
};

var addHandler = function(button){
    button.addEventListener("click", callPredict);
};

var callPredict = function(){
    // do ML submission here
    AWS.config.region = "us-east-1";
    var ML = new AWS.MachineLearning();

    var params = {
        MLModelId: "ml-oKHtcVCiEit",
        PredictEndpoint: "https://realtime.machinelearning.us-east-1.amazonaws.com",
        Record: {
        }
    };

    var x = document.getElementById("predict-params");
    var i;
    for (i = 0; i < x.length ;i++) {
        params.Record[x.elements[i].id] = x.elements[i].value;
    }
    
    ML.predict(params, function(err, data) {
        if (err) {
            results.innerHTML = "ERROR: " + err;
        } else {
            console.log(data)
            results.innerHTML = "Contents of params: " + JSON.stringify(params.Record) + "</p>Contents of result: " + JSON.stringify(data);
        }
    });
    console.log("Button function complete!");
};