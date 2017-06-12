// Initialize Firebase
var config = {
    apiKey: "AIzaSyCGqVYlpW8ZARRw0n0fV0VN31yxVGcQw6w",
    authDomain: "trainschedule-c54e8.firebaseapp.com",
    databaseURL: "https://trainschedule-c54e8.firebaseio.com",
    projectId: "trainschedule-c54e8",
    storageBucket: "trainschedule-c54e8.appspot.com",
    messagingSenderId: "325819356735"
};

firebase.initializeApp(config);

// reference to Firebase databse
var database = firebase.database();

// on click event handler for adding a Train schedule
$("#submit").click(function(){
    event.preventDefault();  
    var tName = $("#trainName").val().trim();
    var tDestination = $("#tDestination").val().trim();
    var firstTrainTime = $("#firstTrainTime").val().trim();
    var tFrequency = $("#tFrequency").val().trim();

    //pushing train data into firebase
    database.ref().push({
        name: tName,
        destination: tDestination,
        time: firstTrainTime,
        frequency: tFrequency
    });

    //clear input fields after submission
    $("input").val('');
    return false;
});

//on child_added event handler to fetch current train data from firebase
database.ref().on("child_added", function(trainData){
    var name = trainData.val().name;
    var destination = trainData.val().destination;
    var time = trainData.val().time;
    var frequency = trainData.val().frequency;

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(time,"hh:mm").subtract(1, "years");
    console.log("first time converted: " + firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % frequency;
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = frequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes").format("HH:mm");
    console.log("ARRIVAL TIME: " + moment(nextTrain, "hmm").format("HH:mm"));


    //display in the top table by appending  the tr
    $(".table").append(`"<tr><td>${name}</td><td>${destination}</td><td>${frequency}</td>"
    <td>${nextTrain}</td><td>${tMinutesTillTrain}</td></tr>`);

});