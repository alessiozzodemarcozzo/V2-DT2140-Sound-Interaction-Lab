
//==========================================================================================
// AUDIO SETUP
//------------------------------------------------------------------------------------------
//
//------------------------------------------------------------------------------------------
// Edit just where you're asked to!
//------------------------------------------------------------------------------------------
//
//==========================================================================================
let dspNodes = {};
let dspNodeParams = {};

// Change here depending on your wasm file names
const dspNames = ["bells", "frenchBell", "russianBell"];

dspNames.forEach(dspName => {
    const instance = new FaustWasm2ScriptProcessor(dspName);

    // output to window or npm package module
    if (typeof module === "undefined") {
        window[dspName] = instance;
    } else {
        const exp = {};
        exp[dspName] = instance;
        module.exports = exp;
    }

    // The name should be the same as the WASM file
    instance.createDSP(audioContext, 1024)
        .then(node => {
            dspNodes[dspName] = node;
            node.connect(audioContext.destination);

            console.log(dspName + ' params: ', node.getParams());

            const jsonString = node.getJSON();
            dspNodeParams[dspName] = JSON.parse(jsonString)["ui"][0]["items"];
        });
});


//==========================================================================================
// INTERACTIONS
//------------------------------------------------------------------------------------------
//
//------------------------------------------------------------------------------------------
// Edit the next functions to create interactions
// Decide which parameters you're using and then use playAudio to play the Audio
//------------------------------------------------------------------------------------------
//
//==========================================================================================

function accelerationChange(accx, accy, accz) {
    if (accx > Math.abs(5))
        playAudio("englishBell", "/englishBell/gate");

    if (accy > Math.abs(5))
        playAudio("frenchBell", "/frenchBell/gate");

    if (accz > Math.abs(5))
        playAudio("russianBell", "/russianBell/gate");
}

function rotationChange(rotx, roty, rotz) {
}

function mousePressed() {
    playAudio("englishBell", "/englishBell/gate");
    // Use this for debugging from the desktop!
}

function deviceMoved() {
    movetimer = millis();
    statusLabels[2].style("color", "pink");
}

function deviceTurned() {
    threshVals[1] = turnAxis;
}

function deviceShaken() {
    shaketimer = millis();
    statusLabels[0].style("color", "pink");
    
}

function getMinMaxParam(dspName, address) {
    const exampleMinMaxParam = findByAddress(dspNodeParams[dspName], address);
    // ALWAYS PAY ATTENTION TO MIN AND MAX, ELSE YOU MAY GET REALLY HIGH VOLUMES FROM YOUR SPEAKERS
    const [exampleMinValue, exampleMaxValue] = getParamMinMax(exampleMinMaxParam);
    console.log('Min value:', exampleMinValue, 'Max value:', exampleMaxValue);
    return [exampleMinValue, exampleMaxValue];
}


//==========================================================================================
// AUDIO INTERACTION
//------------------------------------------------------------------------------------------
//
//------------------------------------------------------------------------------------------
// Edit here to define your audio controls 
//------------------------------------------------------------------------------------------
//
//==========================================================================================

function playAudio(dspName, param) {
    const dspNode = dspNodes[dspName];

    if (!dspNode) {
        return;
    }

    if (audioContext.state === 'suspended') {
        return;
    }

    dspNode.setParamValue(param, 10);

    setTimeout(() => {
        dspNode.setParamValue(param, 0);
    }, 1000);
}

//==========================================================================================
// END
//==========================================================================================
