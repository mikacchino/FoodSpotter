/*
    Name: Predict
    Created: 13.02.19
    Author: Mika Haeberli

    Changes:
    --------------------------------
    Created                 13.02.19
    Added all classes       24.02.19
    Wrote functions         24.02.19
    Reduced classes         26.02.19
*/

const classes = [
    "Apple pie",
    "Baby back ribs",
    "Baklava",
    "Beef carpaccio",
    "Beef tartare",
    "Beignets",
    "Bread pudding",
    "Breakfast burrito",
    "Bruschetta",
    "Caesar salad",
    "Cannoli",
    "Caprese salad",
    "Cheesecake",
    "Chicken curry",
    "Chicken quesadilla",
    "Chicken wings",
    "Chocolate cake",
    "Chocolate mousse",
    "Churros",
    "Clam chowder",
    "Club sandwich",
    "Crème brulée",
    "Croque madame",
    "Cup cakes",
    "Donuts",
    "Dumplings",
    "Eggs benedict",
    "Falafel",
    "Filet mignon",
    "Fish and chips",
    "French fries",
    "French toast",
    "Fried calamari",
    "Fried rice",
    "Garlic bread",
    "Gnocchi",
    "Guacamole",
    "Hamburger",
    "Hot dog",
    "Hummus",
    "Ice cream",
    "Lasagna",
    "Macaroni and cheese",
    "Macarons",
    "Miso soup",
    "Nachos",
    "Omelette",
    "Onion rings",
    "Paella",
    "Pancakes",
    "Pho",
    "Pizza",
    "Pork chop",
    "Prime rib",
    "Ramen",
    "Ravioli",
    "Red velvet cake",
    "Risotto",
    "Samosa",
    "Sashimi",
    "Scallops",
    "Spaghetti bolognese",
    "Spaghetti carbonara",
    "Spring rolls",
    "Steak",
    "Strawberry shortcake",
    "Sushi",
    "Tacos",
    "Tiramisu",
    "Waffles"
];

// Function to determine if a number is scientific and negative
/**
 * @return {boolean}
 */
function IsScientificNegative(number) {

    let chararray = number.toString().split("");
    let sci = chararray.indexOf("-");

    return sci !== -1;

}

// Function to predict image
async function predictImage() {

    // Get elements
    let progressbar = document.getElementById("predict-progress");
    let progressbartext = document.getElementById("predict-progress-text");
    let progressbarvalue = document.getElementById("predict-progress-value");

    // Blend in progress bar
    progressbar.style.opacity = "100";
    progressbar.style.height = "25px";
    progressbar.style.marginTop = "25px";

    // Blend out Predict! button
    document.getElementById("id-button").style.display = "none";

    // Set progress bar values
    progressbartext.innerText = "Loading Model... (10%)";
    //progressbarvalue.style.width = "10";
    progressbarvalue.setAttribute('aria-valuenow', '10');

    // Load model
    const model = await tf.loadModel('./final-keras-model/model.json');

    // Set progress bar values
    progressbartext.innerText = "Predicting...(50%)";
    //progressbarvalue.style.width = "50";
    progressbarvalue.setAttribute('aria-valuenow', '50');

    // Read canvas element
    const example = tf.fromPixels(document.getElementById("upl-image"))
        .resizeNearestNeighbor([224,224])
        .reverse(2)
        .expandDims();

    // Predict with model
    const prediction = await model.predict(example).data();

    // Set progress bar values
    progressbartext.innerText = "Predicted! (80%)";
    //progressbarvalue.style.width = "80";
    progressbarvalue.setAttribute('aria-valuenow', '80');

    // Create Array of prediction values
    let predArray = Array.from(prediction);

    // Get top 5 numbers and fetch the numbers in the list
    let copy_predArray = predArray.slice(0); // copy prediction array
    copy_predArray.sort(function(a, b){return b-a}); // sort copied array

    // Get top 5
    let first = predArray.indexOf(copy_predArray[0]);
    let second = predArray.indexOf(copy_predArray[1]);
    let third = predArray.indexOf(copy_predArray[2]);
    let fourth = predArray.indexOf(copy_predArray[3]);
    let fifth = predArray.indexOf(copy_predArray[4]);

    // Set scientific values to zero if necessary, otherwise multiply by 100 for % values
    for (let ind = 0; ind < 4; ind++) {
        if (IsScientificNegative(copy_predArray[ind])) {
            copy_predArray[ind] = 0;
        } else {
            copy_predArray[ind] = copy_predArray[ind] * 100;
        }
    }

    // Get class names
    let clss1 = classes[first];
    let clss2 = classes[second];
    let clss3 = classes[third];
    let clss4 = classes[fourth];
    let clss5 = classes[fifth];

    // Set progress bar values
    progressbartext.innerText = "Loaded predictions! (100%)";
    //progressbarvalue.style.width = "100";
    progressbarvalue.setAttribute('aria-valuenow', '100');

    // Display results
    document.getElementById("predictOutput").innerHTML = '<h5 id="predTitle">The predictions for this image are:</h5>'
        + '<table class="table table-sm">'
        + '<thead><tr><th>#</th><th>Foodstuff</th><th>Probability</th></tr></thead>'
        + '<tbody>'
        + '<tr><th scope="row">1.</th><td>' + clss1 + '</td><td>' + copy_predArray[0].toFixed(3) + '%</td></tr>'
        + '<tr><th scope="row">2.</th><td>' + clss2 + '</td><td>' + copy_predArray[1].toFixed(3) + '%</td></tr>'
        + '<tr><th scope="row">3.</th><td>' + clss3 + '</td><td>' + copy_predArray[2].toFixed(3) + '%</td></tr>'
        + '<tr><th scope="row">4.</th><td>' + clss4 + '</td><td>' + copy_predArray[3].toFixed(3) + '%</td></tr>'
        + '<tr><th scope="row">5.</th><td>' + clss5 + '</td><td>' + copy_predArray[4].toFixed(3) + '%</td></tr>'
        + '</tbody></table>';

    document.getElementById("predictOutput").style.display = "block";

    // Blend out progress bar
    progressbar.style.display = "none";
}