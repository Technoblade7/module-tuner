const config = {
    type: "line",
    data: {
        datasets: [
            {
                label: "Target",
                // backgroundColor: "rgba(255, 99, 132, 0.5)",
                borderColor: "rgb(255, 99, 132)",
                borderDash: [8, 4],
                fill: false,
                data: [],
            },
            {
                label: "Position",
                // backgroundColor: "rgba(54, 162, 235, 0.5)",
                borderColor: "rgb(54, 162, 235)",
                cubicInterpolationMode: "monotone",
                fill: false,
                data: [],
            },
        ],
    },
    options: {
        maintainAspectRatio: false,
        elements: {
            point: {
                radius: 0,
            },
        },
        scales: {
            x: {
                type: "realtime",
                time: {
                    minUnit: "second",
                },
                realtime: {
                    delay: 2000,
                    onRefresh: (chart) => {
                        chart.data.datasets[0].data.push({
                            x: Date.now(),
                            y: getTarget(),
                        });
                        chart.data.datasets[1].data.push({
                            x: Date.now(),
                            y: getCurrent(),
                        });
                    },
                },
            },
            y: {
                ticks: {
                    stepSize: 5,
                },
                suggestedMin: -180,
                suggestedMax: 180,
            },
        },
    },
};

const myChart = new Chart(document.getElementById("myChart"), config);

function toggleTheme() {
    const classes = [
        "columns",
        "columns-1",
        "columns-2",
        "col-1",
        "gradient-container",
        "col-bg",
        "col-up-item",
        "col-up-item-block",
        "col-up-item-block-last",
        "col-down-item",
        "col-down-item-block",
        "col-down-item-block-last",
        "col-down-item-block-title",
        "frame",
        "split",
        "split-item-left",
        "input-container",
        "label-container",
        "update-button",
        "test-button",
        "logo",
        "icon",
        "col-down-item-block-field-1",
        "col-down-item-block-field-2",
        "col-down-item-block-field-3",
    ];

    const tags = ["h1", "input", "label"];

    classes.forEach((className) => {
        let elements = document.getElementsByClassName(className);
        for (let i = 0; i < elements.length; i++) {
            elements[i].classList.toggle(`${className}-light`);
        }
    });

    tags.forEach((tagName) => {
        let elements = document.getElementsByTagName(tagName);
        for (let i = 0; i < elements.length; i++) {
            elements[i].classList.toggle(`${tagName}-light`);
        }
    });

    const indicator = document
        .getElementsByClassName("split-item-right")[0]
        .getElementsByTagName("h1")[0];

    if (indicator.innerHTML === "&nbsp; Dark Mode") {
        indicator.innerHTML = "&nbsp; Light Mode";
    } else {
        indicator.innerHTML = "&nbsp; Dark Mode";
    }
    // console.log(document.getElementsByClassName("logo")[0].src);
}
// label h1 input different

(function () {
    var cleanUp, debounce, i, len, ripple, rippleContainer, ripples, showRipple;

    debounce = function (func, delay) {
        var inDebounce;
        inDebounce = undefined;
        return function () {
            var args, context;
            context = this;
            args = arguments;
            clearTimeout(inDebounce);
            return (inDebounce = setTimeout(function () {
                return func.apply(context, args);
            }, delay));
        };
    };

    showRipple = function (e) {
        var pos, ripple, rippler, size, style, x, y;
        ripple = this;
        rippler = document.createElement("span");
        size = ripple.offsetWidth;
        pos = ripple.getBoundingClientRect();
        x = e.pageX - pos.left - size / 2;
        y = e.pageY - pos.top - size / 2;
        style =
            "top:" +
            y +
            "px; left: " +
            x +
            "px; height: " +
            size +
            "px; width: " +
            size +
            "px;";
        ripple.rippleContainer.appendChild(rippler);
        return rippler.setAttribute("style", style);
    };

    cleanUp = function () {
        while (this.rippleContainer.firstChild) {
            this.rippleContainer.removeChild(this.rippleContainer.firstChild);
        }
    };

    ripples = document.querySelectorAll("[ripple]");

    for (i = 0, len = ripples.length; i < len; i++) {
        ripple = ripples[i];
        rippleContainer = document.createElement("div");
        rippleContainer.className = "ripple--container";
        ripple.addEventListener("mousedown", showRipple);
        ripple.addEventListener("mouseup", debounce(cleanUp, 2000));
        ripple.rippleContainer = rippleContainer;
        ripple.appendChild(rippleContainer);
    }
})();

// network tables
const inputs = document.getElementsByTagName("input");

let selectedWheel = 0;
NetworkTables.putValue("/SmartDashboard/selectedWheel", selectedWheel);

// kP, kI, kD, kF, sCurveStrength, cruiseVelocity, acceleration, allowableError,
// maxIntegralAccum, peakOutput

NetworkTables.addRobotConnectionListener(function (connected) {
    if (connected) {
        setTimeout(displayCurrentConfigs, 10);
    }
}, false);

function displayCurrentConfigs() {
    const configs = [
        NetworkTables.getValue("/SmartDashboard/frontLeftMotionMagicConfigs"),
        NetworkTables.getValue("/SmartDashboard/frontRightMotionMagicConfigs"),
        NetworkTables.getValue("/SmartDashboard/rearLeftMotionMagicConfigs"),
        NetworkTables.getValue("/SmartDashboard/rearRightMotionMagicConfigs"),
    ];
    configsArray = JSON.parse(configs[selectedWheel]);
    for (let i = 0; i < 10; i++) {
        inputs[i].value = Number(configsArray[i].toFixed(10));
    }
}

const wheels = document.getElementsByClassName("col-up-item-block");
wheels[selectedWheel].classList.toggle("selected");
for (let i = 0; i < wheels.length; i++) {
    wheels[i].addEventListener("click", () => {
        wheels[selectedWheel].classList.toggle("selected");
        selectedWheel = i;
        wheels[selectedWheel].classList.toggle("selected");
        NetworkTables.putValue("/SmartDashboard/selectedWheel", selectedWheel);
        displayCurrentConfigs();
    });
}

const updateButton = document.querySelector(".update-button");
updateButton.addEventListener("click", () => {
    // NetworkTables.putValue("/SmartDashboard/updateButton", false);
    NetworkTables.putValue("/SmartDashboard/updateButton", true);

    const keys = [
        "/SmartDashboard/frontLeftMotionMagicConfigs",
        "/SmartDashboard/frontRightMotionMagicConfigs",
        "/SmartDashboard/rearLeftMotionMagicConfigs",
        "/SmartDashboard/rearRightMotionMagicConfigs",
    ];
    let values = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < 10; i++) {
        let value = parseFloat(inputs[i].value);
        if (Number.isNaN(value)) {
            value = 0;
        }
        values[i] = value;
    }
    NetworkTables.putValue(keys[selectedWheel], `[${values.join()}]`);
});

const testButton = document.querySelector(".test-button");
testButton.addEventListener("click", () => {
    // NetworkTables.putValue("/SmartDashboard/testButton", false);
    NetworkTables.putValue("/SmartDashboard/testButton", true);
});

const currentWheel = document.querySelector("#current-wheel");
const targetWheel = document.querySelector("#target-wheel");
let currentAngle = 0;
let targetAngle = 0;

let updateCurrentAngle = (key, value) => {
    if (Number.isNaN(value)) {
        value = 0;
    }
    currentWheel.style.transform = `translate(-50%, -50%) rotate(${value}deg)`;
    currentAngle = value;
};
let updateTargetAngle = (key, value) => {
    if (Number.isNaN(value)) {
        value = 0;
    }
    targetWheel.style.transform = `translate(-50%, -50%) rotate(${value}deg)`;
    targetAngle = value;
};

NetworkTables.addKeyListener(
    "/SmartDashboard/currentAngle",
    updateCurrentAngle
);
NetworkTables.addKeyListener("/SmartDashboard/targetAngle", updateTargetAngle);

const target = document.getElementById("target");
const position = document.getElementById("position");

function getTarget() {
    return targetAngle;
}

function getCurrent() {
    updateTargetPosition();
    return currentAngle;
}

function updateTargetPosition() {
    target.innerHTML = `${Number(targetAngle.toFixed(3))}°`;
    position.innerHTML = `${Number(currentAngle.toFixed(3))}°`;
}
